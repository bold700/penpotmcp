#!/bin/bash
# ============================================================
# Penpot MCP Startup Script v2
# Gebruik: ./start-penpot-mcp.sh
# Lokaal MCP: http://localhost:4401/mcp (o.a. Cursor)
# Plugin:     http://localhost:4400/manifest.json
# Optioneel:  Cloudflare tunnel voor HTTPS-clients (Cowork, enz.)
# ============================================================

set -e

ORIG_DIR="$(pwd)"

echo ""
echo "🚀 Penpot MCP opstarten..."
echo ""

# ── 1. Vind het juiste npx cache pad ────────────────────────
MCP_SERVER=$(find ~/.npm/_npx -name "index.js" \
  -path "*/@penpot/mcp/packages/server/dist/index.js" \
  2>/dev/null | head -1)

if [ -z "$MCP_SERVER" ]; then
  echo "❌ Penpot MCP niet gevonden in cache."
  echo ""
  echo "   Eenmalige installatie:"
  echo "   1. Draai: npx -y @penpot/mcp@'>=0'"
  echo "   2. Wacht tot je 'node dist/index.js' ziet"
  echo "   3. Druk Ctrl+C"
  echo "   4. Start dit script opnieuw"
  echo ""
  exit 1
fi

MCP_DIR=$(dirname "$MCP_SERVER")
MCP_ROOT=$(echo "$MCP_SERVER" | sed 's|/packages/server/dist/index.js||')
echo "✅ Server gevonden"

# ── 2. Patch de "Already connected" bug (v3: SDK protocol.js direct patchen) ──
# De echte fix: pas protocol.js aan zodat connect() altijd werkt, ook bij reconnect

# Vind alle protocol.js (ESM + CJS in pnpm); één patchen is niet genoeg — Node laadt maar één bundel.
echo "🔧 SDK 'Already connected'-fix controleren..."
export _PENPOT_MCP_ROOT="$MCP_ROOT"
node <<'PATCHSDK'
const fs = require('fs');
const { execSync } = require('child_process');
const MCP_ROOT = process.env._PENPOT_MCP_ROOT || '';
let out = '';
try {
  out = execSync(
    'find ' + JSON.stringify(MCP_ROOT) + ' -path "*/shared/protocol.js" -name "protocol.js" 2>/dev/null',
    { encoding: 'utf8', shell: '/bin/bash' }
  );
} catch (e) { out = ''; }
const paths = out.trim().split('\n').filter(Boolean);
const needle = "throw new Error('Already connected to a transport";
const replacement = `/* graceful reconnect patch */
        if (this._transport) {
            try {
                await this._transport.close();
            }
            catch (e) { }
            this._transport = undefined;
        }`;
let patched = 0;
for (const p of paths) {
  let c = fs.readFileSync(p, 'utf8');
  if (!c.includes('Already connected to a transport')) continue;
  if (c.includes('graceful reconnect patch')) continue;
  const i = c.indexOf(needle);
  if (i === -1) continue;
  const ifStart = c.lastIndexOf('if (this._transport)', i);
  if (ifStart === -1) continue;
  const blockEnd = c.indexOf('}', i);
  if (blockEnd === -1) continue;
  const oldBlock = c.substring(ifStart, blockEnd + 1);
  if (!oldBlock.includes('throw new Error')) continue;
  c = c.replace(oldBlock, replacement.trim());
  fs.writeFileSync(p, c);
  patched++;
  console.log('  ✅', p);
}
if (patched === 0 && paths.length) console.log('  ✅ Alle protocol.js kopieën al gepatcht of geen match');
if (!paths.length) console.log('  ⚠️  Geen protocol.js gevonden onder MCP_ROOT');
PATCHSDK
unset _PENPOT_MCP_ROOT

# ── 3. Config bestand ────────────────────────────────────────
if [ ! -f "$HOME/data/initial_instructions.md" ]; then
  echo "📄 Config bestand kopiëren..."
  INSTRUCTIONS=$(find "$MCP_ROOT" -name "initial_instructions.md" \
    2>/dev/null | grep -v ".pnpm" | head -1)
  if [ -n "$INSTRUCTIONS" ]; then
    mkdir -p "$HOME/data"
    cp "$INSTRUCTIONS" "$HOME/data/initial_instructions.md"
    echo "  ✅ Gekopieerd"
  fi
else
  echo "✅ Config bestand aanwezig"
fi

# ── 4. Bestaande processen stoppen ───────────────────────────
echo "🛑 Oude processen stoppen..."
lsof -i :4400 -t 2>/dev/null | xargs kill 2>/dev/null || true
lsof -i :4401 -t 2>/dev/null | xargs kill 2>/dev/null && sleep 1 || true
lsof -i :9443 -t 2>/dev/null | xargs kill 2>/dev/null || true

# ── 5. MCP Server starten ────────────────────────────────────
echo "⚙️  MCP Server starten..."
cd "$MCP_DIR"
node index.js > /tmp/penpot-mcp.log 2>&1 &
SERVER_PID=$!
sleep 2

if ! kill -0 $SERVER_PID 2>/dev/null; then
  echo "❌ Server kon niet starten. Log:"
  cat /tmp/penpot-mcp.log
  exit 1
fi
echo "✅ MCP Server draait (poort 4401)"

# ── 5b. Plugin webserver starten (poort 4400) ─────────────────
PLUGIN_DIR="$MCP_ROOT/packages/plugin/dist"
if [ -d "$PLUGIN_DIR" ]; then
  echo "🔌 Plugin server starten..."
  node -e "
    const http = require('http');
    const fs = require('fs');
    const path = require('path');
    const url = require('url');
    const dir = '$PLUGIN_DIR';
    const mime = {'.html':'text/html','.js':'application/javascript','.json':'application/json','.css':'text/css','.map':'application/json','.svg':'image/svg+xml','.png':'image/png'};
    http.createServer((req,res) => {
      const parsed = url.parse(req.url);
      let pathname = decodeURIComponent(parsed.pathname);
      if (pathname === '/') pathname = '/index.html';
      let p = path.join(dir, pathname);
      if (!fs.existsSync(p)) {
        // Probeer in assets subfolder
        const alt = path.join(dir, 'assets', path.basename(pathname));
        if (fs.existsSync(alt)) { p = alt; }
        else { res.writeHead(404); res.end('Not found'); return; }
      }
      const ext = path.extname(p);
      res.writeHead(200, {
        'Content-Type': mime[ext]||'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': '*'
      });
      fs.createReadStream(p).pipe(res);
    }).listen(4400, () => {});
  " > /tmp/penpot-plugin.log 2>&1 &
  PLUGIN_PID=$!
  sleep 1
  echo "✅ Plugin server draait (poort 4400)"
  echo "   Plugin URL: http://localhost:4400/manifest.json"
else
  echo "⚠️  Plugin dist niet gevonden in $PLUGIN_DIR"
  PLUGIN_PID=""
fi

# ── 6. HTTPS tunnel via Cloudflare ─────────────────────────────
if ! command -v cloudflared &>/dev/null; then
  echo "⚠️  cloudflared niet gevonden. Installeer:"
  echo "   brew install cloudflared"
  echo ""
  echo "   MCP server draait op http://localhost:4401/mcp"
  wait $SERVER_PID
  exit 0
fi

echo "🌐 Cloudflare tunnel starten..."
cloudflared tunnel --url http://127.0.0.1:4401 \
  > /tmp/cloudflared-penpot.log 2>&1 &
TUNNEL_PID=$!

# Wacht tot de tunnel URL beschikbaar is (max 15 sec)
TUNNEL_URL=""
for i in $(seq 1 30); do
  TUNNEL_URL=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/cloudflared-penpot.log 2>/dev/null | head -1)
  if [ -n "$TUNNEL_URL" ]; then break; fi
  sleep 0.5
done

if [ -z "$TUNNEL_URL" ]; then
  echo "❌ Tunnel kon niet starten. Log:"
  cat /tmp/cloudflared-penpot.log
  kill $SERVER_PID 2>/dev/null
  exit 1
fi

echo ""
echo "════════════════════════════════════════════════"
echo "✅ ALLES DRAAIT!"
echo ""
echo "   Cursor / lokaal MCP:"
echo "   http://localhost:4401/mcp"
echo ""
echo "   MCP URL voor Cowork (HTTPS tunnel, kopieer dit!):"
echo ""
echo "   ${TUNNEL_URL}/mcp"
echo ""
echo "Stappen:"
echo "  1. Cursor: zie cursor-setup.md → ~/.cursor/mcp.json"
echo "  2. Cowork → Settings → Connectors → Penpot"
echo "     URL: ${TUNNEL_URL}/mcp → Add"
echo "  3. Penpot (Chrome) → plugin → Connect to MCP Server"
echo "  4. Praat met je AI-assistent en begin te designen!"
echo ""
echo "  Stop met: Ctrl+C"
echo "════════════════════════════════════════════════"
echo ""

# Wacht tot Ctrl+C
trap "kill $SERVER_PID $PLUGIN_PID $TUNNEL_PID 2>/dev/null; echo ''; echo '👋 Gestopt.'; exit 0" INT
wait
