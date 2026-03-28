# Penpot MCP Setup voor Cursor

## Stap 1: Start de Penpot MCP Server

Open een terminal en run:

```bash
cd ~/Documents/GitHub/penpotmcp && ./start-penpot-mcp.sh
```

Dit start:
- MCP Server op `http://localhost:4401/mcp`
- Plugin server op `http://localhost:4400`
- Cloudflare tunnel (voor als je die nodig hebt)

## Stap 2: Cursor MCP Configuratie

Voeg dit toe aan je Cursor MCP settings (`~/.cursor/mcp.json`). Heb je al andere servers, merge dan alleen het `penpot`-blok onder `mcpServers`. Zie ook `cursor/mcp.penpot-entry.json` in deze repo.

```json
{
  "mcpServers": {
    "penpot": {
      "url": "http://localhost:4401/mcp"
    }
  }
}
```

> Cursor ondersteunt HTTP direct — geen HTTPS tunnel nodig. Voor Cowork of andere clients die HTTPS vereisen, gebruik de tunnel-URL die `start-penpot-mcp.sh` toont.

## Stap 3: Penpot Plugin verbinden

1. Open je Penpot design file in Chrome
2. Open de Plugin Manager → installeer: `http://localhost:4400/manifest.json`
3. Open de plugin → klik **Connect to MCP Server**
4. Houd de plugin open (sluiten verbreekt de verbinding)

## Stap 4: Test in Cursor

Vraag Cursor om de Penpot tools te gebruiken:

```
Gebruik de execute_code tool om alle pagina's in mijn Penpot design op te halen:
return penpotUtils.getPages();
```

---

## Beschikbare MCP Tools

| Tool | Beschrijving |
|------|-------------|
| `execute_code` | JavaScript uitvoeren via de Penpot Plugin API |
| `high_level_overview` | Documentatie over de Penpot API lezen |
| `penpot_api_info` | API info voor specifieke types ophalen |
| `export_shape` | Shapes exporteren als afbeelding |
| `import_image` | Afbeeldingen importeren in het design |

## Prompt voor Cursor

Kopieer dit als system prompt of instructie bij je eerste vraag:

---

Je hebt toegang tot Penpot via de MCP tools. De Penpot Plugin API draait in de browser en je kunt JavaScript code uitvoeren via de `execute_code` tool.

**Belangrijke objecten:**
- `penpot` — het hoofdobject (type: Penpot), toegang tot de huidige pagina, selectie, libraries
- `penpotUtils` — hulpfuncties voor zoeken, navigeren en analyseren
- `storage` — persistent object om data tussen execute_code calls op te slaan

**Veelgebruikte patronen:**

```javascript
// Alle pagina's ophalen
return penpotUtils.getPages();

// Structuur van de huidige pagina
return penpotUtils.shapeStructure(penpot.root, 3);

// Shape zoeken op naam
const shape = penpotUtils.findShape(s => s.name === 'MijnShape');
return { name: shape.name, type: shape.type, x: shape.x, y: shape.y };

// Rectangle maken
const rect = penpot.createRectangle();
rect.name = "Nieuwe Rectangle";
rect.x = 100;
rect.y = 100;
rect.resize(200, 100);
rect.fills = [{ fillColor: "#FF6600", fillOpacity: 1 }];
return { id: rect.id, name: rect.name };

// Tekst maken
const text = penpot.createText("Hello World");
text.x = 100;
text.y = 200;
text.fontSize = 24;
text.growType = "auto-width";
return { id: text.id };

// Geselecteerde elementen ophalen
storage.selected = [...penpot.selection];
return storage.selected.map(s => ({ name: s.name, type: s.type }));

// Board met flex layout
const board = penpot.createBoard();
board.name = "Container";
board.x = 0;
board.y = 0;
board.resize(400, 300);
board.fills = [{ fillColor: "#FFFFFF", fillOpacity: 1 }];
const flex = board.addFlexLayout();
flex.dir = "column";
flex.rowGap = 16;
flex.horizontalPadding = 24;
flex.verticalPadding = 24;
return { id: board.id };
```

**Regels:**
- `width` en `height` zijn READ-ONLY → gebruik `shape.resize(w, h)`
- `parentX` en `parentY` zijn READ-ONLY → gebruik `penpotUtils.setParentXY(shape, x, y)`
- Fills/strokes arrays zijn immutable → vervang de hele array: `shape.fills = [{ fillColor: "#000", fillOpacity: 1 }]`
- Kleuren altijd als hex met hoofdletters: `#FF5533`
- Na tekst fontSize wijzigen, zet `growType` terug: `text.growType = "auto-width"`
- Gebruik `export_shape` om visueel te inspecteren
- Sla tussenresultaten op in `storage` voor gebruik in volgende calls

---

## Dagelijks Opstarten (1 minuut)

1. Terminal: `cd ~/Documents/GitHub/penpotmcp && ./start-penpot-mcp.sh`
2. Chrome: Open Penpot design → open plugin → Connect
3. Cursor: Start met designen!

## Troubleshooting

- **"Already connected" error**: Het script patcht dit automatisch. Als het toch voorkomt, herstart het script.
- **Plugin toont geen Connect knop**: Refresh de Penpot pagina en open de plugin opnieuw.
- **Server niet bereikbaar**: Check of het script nog draait in de terminal.
