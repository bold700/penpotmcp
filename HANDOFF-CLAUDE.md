# Penpot MCP + Cursor — handoff (na PC-herstart)

Gebruik dit als vaste instructie voor Claude of voor jezelf: na elke reboot weer dezelfde stappen.

## Locaties

- **Repo:** `~/Documents/GitHub/penpotmcp`
- **Startscript:** `./start-penpot-mcp.sh` — patcht alle `@modelcontextprotocol/sdk` `protocol.js`-kopieën tegen *"Already connected to a transport"*, start MCP-server, plugin-server en optioneel Cloudflare-tunnel
- **Uitgebreide setup:** [cursor-setup.md](cursor-setup.md)
- **Voorbeeld MCP-config:** [cursor/mcp.penpot-entry.json](cursor/mcp.penpot-entry.json)

## Cursor: `~/.cursor/mcp.json`

Minimaal:

```json
"penpot": {
  "url": "http://localhost:4401/mcp"
}
```

Andere servers (bijv. Figma) blijven naast `penpot` staan.

**Optioneel:** `penpot-cloudflare` met de tunnel-URL die `start-penpot-mcp.sh` na start toont — die URL wisselt per sessie.

## Eenmalig (als `@penpot/mcp` nog niet in de npx-cache staat)

```bash
npx -y @penpot/mcp@">=0"
```

Wacht tot de install klaar is, daarna `Ctrl+C`, en gebruik daarna het startscript.

## Elke werkssessie (na reboot)

1. Terminal (laten draaien):

   ```bash
   cd ~/Documents/GitHub/penpotmcp && ./start-penpot-mcp.sh
   ```

2. **Cursor:** Command Palette → **MCP: Restart Servers** (of Cursor herstarten) als Penpot MCP niet groen is.

3. **Chrome → Penpot:** design openen → **Penpot MCP Plugin** → **Connect to MCP Server** → plugin **open laten**.

## Poorten

| Poort | Functie |
|------|---------|
| 4401 | MCP HTTP — `http://localhost:4401/mcp` |
| 4400 | Plugin — `http://localhost:4400/manifest.json` |
| 4402 | WebSocket tussen server en plugin (automatisch) |

## Voor Claude in Cursor (Penpot API)

- JavaScript via tool **`execute_code`**; objecten: `penpot`, `penpotUtils`, `storage`.
- Rechthoeken: `penpot.createRectangle()` + **`shape.resize(w, h)`** — `width`/`height` zijn read-only.
- Meer patronen en regels: [cursor-setup.md](cursor-setup.md).

## Troubleshooting

- Script opnieuw starten → plugin opnieuw verbinden → Cursor MCP herstarten.
- Logs: `/tmp/penpot-mcp.log`, `/tmp/penpot-mcp-startup.log`.
