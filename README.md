# Penpot MCP + Cursor (lokaal, HTTPS)

Alles voor Penpot MCP staat in deze repo: startscript, Cursor-configsnippet en TLS-instructies.

## Vereisten

- Node.js 22.x (aanbevolen door Penpot MCP)
- Optioneel: [Homebrew](https://brew.sh/) + `mkcert` voor vertrouwde lokale HTTPS

## Cursor

Voeg het Penpot-blok toe aan `~/.cursor/mcp.json` (of merge met je bestaande servers). Zie [`cursor/mcp.penpot-entry.json`](cursor/mcp.penpot-entry.json).

Na wijzigingen: Cursor volledig afsluiten en opnieuw openen.

## Starten

```bash
./start-penpot-mcp.sh
```

Dit start `@penpot/mcp` (HTTP op poort **4401**) en een TLS-proxy op **https://localhost:8443** die naar 4401 doorstuurt.

## Penpot in de browser

1. Open je bestand op [design.penpot.app](https://design.penpot.app) (of je eigen instance).
2. **Plugins** → plugin laden: `http://localhost:4400/manifest.json`
3. In de plugin: **Connect to MCP server**
4. Plugin-UI open laten tijdens gebruik.

Zie ook de [officiële Penpot MCP-documentatie](https://github.com/penpot/penpot/tree/develop/mcp).

## Structuur

| Pad | Inhoud |
|-----|--------|
| `start-penpot-mcp.sh` | Penpot MCP + `local-ssl-proxy` |
| `ssl/` | mkcert `*.pem` (lokaal, niet in git) |
| `cursor/mcp.penpot-entry.json` | JSON-fragment voor Cursor |

## Handige links

- [Penpot MCP productpagina](https://penpot.app/penpot-mcp-server)
- [Broncode `penpot/mcp`](https://github.com/penpot/penpot/tree/develop/mcp)
