#!/usr/bin/env bash
# Kopieert Penpot MCP tool-descriptors naar de Cursor-projectmap zodat de agent
# execute_code e.d. weer ziet (na MCP-fout of lege cache).
# Gebruik: ./cursor/sync-penpot-mcp-descriptors.sh [doelmap]
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$REPO_ROOT/cursor/penpot-mcp-descriptors"
DEFAULT_DEST="$HOME/.cursor/projects/Users-nova-Documents-GitHub-penpotmcp/mcps/user-penpot"
DEST="${1:-$DEFAULT_DEST}"

if [[ ! -d "$SRC/tools" ]]; then
  echo "Bron ontbreekt: $SRC/tools" >&2
  exit 1
fi

mkdir -p "$DEST/tools"
cp "$SRC/INSTRUCTIONS.md" "$DEST/"
cp "$SRC/SERVER_METADATA.json" "$DEST/"
cp "$SRC/tools/"*.json "$DEST/tools/"
# Verwijder oude foutstatus zodat Cursor opnieuw verbindt
rm -f "$DEST/STATUS.md" 2>/dev/null || true

echo "Penpot MCP descriptors gesynchroniseerd naar: $DEST"
echo "Herstart MCP-servers in Cursor (Command Palette: MCP: Restart Servers)."
