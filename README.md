# Penpot MCP — Claude Cowork Setup

Design rechtstreeks in Penpot via Claude (Cowork).

**Cursor:** zie [cursor-setup.md](cursor-setup.md) voor lokale MCP op `http://localhost:4401/mcp` (geen tunnel nodig). **Handoff voor Claude / na reboot:** [HANDOFF-CLAUDE.md](HANDOFF-CLAUDE.md).

## Eerste keer instellen

### 1. Penpot MCP installeren
```bash
npx -y @penpot/mcp@">=0"
```
Wacht tot het volledig klaar is (kan 1-2 minuten duren), druk dan `Ctrl+C`.

### 2. Maak het script uitvoerbaar
```bash
chmod +x ~/path/to/start-penpot-mcp.sh
```

---

## Elke dag opstarten

### Stap 1 — Script draaien
```bash
./start-penpot-mcp.sh
```

Het script doet automatisch:
- ✅ Patch toepassen (bug fix voor "Already connected" error)
- ✅ Config bestanden kopiëren
- ✅ MCP server starten op poort 4401
- ✅ Cloudflare tunnel starten en URL tonen

### Stap 2 — Cowork connector updaten
1. Cowork → **Settings → Connectors**
2. Klik **`...`** bij Penpot → **Edit**
3. Vul de nieuwe `https://xxx.trycloudflare.com/mcp` URL in
4. Klik **Connect**

> ⚠️ De Cloudflare URL verandert elke keer. Je moet hem elke sessie updaten in Cowork.

### Stap 3 — Penpot plugin verbinden
1. Open Penpot in Chrome
2. Open het juiste design bestand
3. Klik in de **Penpot MCP Plugin** op **"Connect to MCP Server"**

### Stap 4 — Klaar!
Zeg tegen Claude wat je wil maken en hij ontwerpt het direct in Penpot.

---

## Technische details

### Architectuur
```
Claude (Cowork chat)
    ↕  HTTPS (Cloudflare tunnel)
Penpot MCP Server (localhost:4401)
    ↕  WebSocket (localhost:4402)
Penpot Plugin (Chrome browser)
    ↕  Plugin API
Penpot design bestand
```

### Bekende bug & fix
De Penpot MCP server v2.14.0 heeft een bug waarbij hij "Already connected to a transport" geeft bij meerdere verbindingspogingen. Het `start-penpot-mcp.sh` script patcht dit automatisch.

### Waarom Cloudflare tunnel?
Cowork vereist een HTTPS URL voor MCP connectors. De Penpot MCP server draait op HTTP (localhost). Cloudflare tunnel biedt een gratis HTTPS brug.

### Beschikbare tools
- `execute_code` — Schrijf JavaScript om shapes te maken/bewerken
- `high_level_overview` — Overzicht van de Penpot Plugin API
- `penpot_api_info` — Documentatie van specifieke API types
- `export_shape` — Exporteer een shape als PNG/SVG
- `import_image` — Importeer een afbeelding in het design

---

## Voorbeeld prompts

- "Maak een button component van 120x40 met blauwe achtergrond"
- "Voeg een tekst toe 'Hello World' in 24px op de huidige pagina"
- "Maak een frame van 375x812 voor een mobiel scherm"
- "Verander de kleur van alle rechthoeken op de pagina naar rood"
- "Lees alle shapes op de huidige pagina"
