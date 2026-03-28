#!/bin/bash
# ============================================================
# Penpot MCP Startup Script
# Gebruik: ./start-penpot-mcp.sh
# ============================================================

set -e

echo "🚀 Penpot MCP opstarten..."

# ── 1. Vind het juiste npx cache pad ────────────────────────
MCP_SERVER=$(find ~/.npm/_npx -name "index.js" \
  -path "*/penpot/mcp/packages/server/dist/index.js" \
  2>/dev/null | head -1)

if [ -z "$MCP_SERVER" ]; then
  echo "❌ Penpot MCP niet gevonden in cache. Eerst installeren..."
  echo "   Draai: npx -y @penpot/mcp@'>=0'"
  echo "   Wacht tot het klaar is, druk dan Ctrl+C en start dit script opnieuw."
  exit 1
fi

MCP_DIR=$(dirname "$MCP_SERVER")
MCP_ROOT=$(echo "$MCP_SERVER" | sed 's|/packages/server/dist/index.js||')
echo "✅ Gevonden: $MCP_SERVER"

# ── 2. Patch de "Already connected to a transport" bug ──────
PATCH_CHECK=$(grep -c "_s.connect" "$MCP_SERVER" 2>/dev/null || echo "0")

if [ "$PATCH_CHECK" = "0" ]; then
  echo "🔧 Patch toepassen..."
  node -e "
    const fs = require('fs');
    const p = '$MCP_SERVER';
    let c = fs.readFileSync(p, 'utf8');
    const old = 'await this.server.connect(transport);';
    const fix = '{const _s=this.server;if(_s._transport){try{await _s._transport.close();}catch(e){}}_s._transport=undefined;await _s.connect(transport);}';
    const n = c.split(old).length - 1;
    if (n > 0) {
      c = c.split(old).join(fix);
      fs.writeFileSync(p, c);
      console.log('  ✅ Patch toegepast op ' + n + ' plek(ken)');
    } else {
      console.log('  ⚠️  Patroon niet gevonden (al gepatcht of versie veranderd)');
    }
  "
else
  echo "✅ Patch al aanwezig, overgeslagen"
fi

# ── 3. Config bestand kopiëren ──────────────────────────────
if [ ! -f "$HOME/data/initial_instructions.md" ]; then
  echo "📄 Config bestand kopiëren..."
  INSTRUCTIONS=$(find "$MCP_ROOT" -name "initial_instructions.md" 2>/dev/null | head -1)
  if [ -n "$INSTRUCTIONS" ]; then
    mkdir -p "$HOME/data"
    cp "$INSTRUCTIONS" "$HOME/data/initial_instructions.md"
    echo "  ✅ Gekopieerd naar ~/data/"
  else
    echo "  ⚠️  initial_instructions.md niet gevonden"
  fi
else
  echo "✅ Config bestand al aanwezig"
fi

# ── 4. Bestaande processen stoppen ──────────────────────────
echo "🛑 Bestaande MCP processen stoppen..."
lsof -i :4401 -t | xargs kill 2>/dev/null && echo "  ✅ Poort 4401 vrijgemaakt" || echo "  ✅ Poort 4401 was al vrij"
sleep 1

# ── 5. MCP Server starten ───────────────────────────────────
echo "⚙️  MCP Server starten op poort 4401..."
cd "$MCP_DIR"
node index.js &
SERVER_PID=$!
sleep 2

if kill -0 $SERVER_PID 2>/dev/null; then
  echo "  ✅ Server gestart (PID: $SERVER_PID)"
else
  echo "  ❌ Server mislukt om te starten"
  exit 1
fi

# ── 6. Cloudflare tunnel starten ────────────────────────────
echo ""
echo "🌐 Cloudflare tunnel starten..."
echo "   (wacht op URL...)"
echo ""

cloudflared tunnel --url http://127.0.0.1:4401 2>&1 | while IFS= read -r line; do
  echo "$line"
  if echo "$line" | grep -q "trycloudflare.com"; then
    URL=$(echo "$line" | grep -o 'https://[^ ]*trycloudflare\.com' | head -1)
    if [ -n "$URL" ]; then
      echo ""
      echo "════════════════════════════════════════════════"
      echo "✅ KLAAR! Gebruik deze URL in Cowork:"
      echo ""
      echo "   ${URL}/mcp"
      echo ""
      echo "Stappen:"
      echo "  1. Cowork → Settings → Connectors → Penpot → Edit URL"
      echo "  2. Plak: ${URL}/mcp"
      echo "  3. Klik Connect"
      echo "  4. Penpot browser plugin → Connect to MCP Server"
      echo "════════════════════════════════════════════════"
      echo ""
    fi
  fi
done
