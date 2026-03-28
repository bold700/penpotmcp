#!/usr/bin/env bash
# Penpot MCP (HTTP) + lokale HTTPS-proxy voor Cursor.
# Repo-root: sibling van dit script.
#
# Poorten: 4400 plugin, 4401 MCP (HTTP), 4402 WebSocket, 8443 MCP (HTTPS → 4401).
# Plugin in Penpot: http://localhost:4400/manifest.json
# Cursor: zie cursor/mcp.penpot-entry.json — URL https://localhost:8443/mcp
#
# Certificaten: ./ssl/ (mkcert). Eenmalig systeem vertrouwen:
#   mkcert -install
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CERT_DIR="${ROOT}/ssl"
CERT="${CERT_DIR}/localhost+2.pem"
KEY="${CERT_DIR}/localhost+2-key.pem"
HTTP_PORT=4401
HTTPS_PORT=8443

if [[ ! -f "$CERT" || ! -f "$KEY" ]]; then
  echo "Geen certificaat in $CERT_DIR — aanmaken met:"
  echo "  cd \"$CERT_DIR\" && mkcert localhost 127.0.0.1 ::1"
  exit 1
fi

cleanup() {
  if [[ -n "${PENPOT_PID:-}" ]] && kill -0 "$PENPOT_PID" 2>/dev/null; then
    kill "$PENPOT_PID" 2>/dev/null || true
    wait "$PENPOT_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM HUP

echo "Penpot MCP starten (HTTP) op achtergrond…"
npx -y '@penpot/mcp@>=0' "$@" &
PENPOT_PID=$!

echo "Wachten tot poort $HTTP_PORT open is…"
for _ in $(seq 1 90); do
  if bash -c "echo >/dev/tcp/127.0.0.1/${HTTP_PORT}" 2>/dev/null; then
    break
  fi
  sleep 1
done
if ! bash -c "echo >/dev/tcp/127.0.0.1/${HTTP_PORT}" 2>/dev/null; then
  echo "Timeout: Penpot luistert niet op $HTTP_PORT."
  exit 1
fi

echo "HTTPS-proxy op https://localhost:${HTTPS_PORT} → http://127.0.0.1:${HTTP_PORT}"
echo "Plugin-URL: http://localhost:4400/manifest.json"
echo "Stoppen: Ctrl+C"
npx -y local-ssl-proxy \
  --source "$HTTPS_PORT" \
  --target "$HTTP_PORT" \
  --cert "$CERT" \
  --key "$KEY"
