/**
 * Penpot MCP execute_code — zet kleurtoken **md.light.onSurface** op het path in elke variant
 * (via library **mainInstance**). Geen fallback op `onSurface`; token wordt zo nodig aangemaakt.
 * Werkt voor bestaande bookmark/favorite-variantcontainers na import.
 *
 * Zet VC_NAME, bv.:
 *   "Symbols / Material / Rounded / 20px / bookmark" (Fill-variant, 20px)
 *   "Material / Symbols / Rounded / bookmark" (oude multi-size container)
 *   "Material / Symbols / Rounded / home"
 *   "Material / Symbols / Rounded / favorite"
 */

const VC_NAME = "Symbols / Material / Rounded / 20px / bookmark";
const TOKEN_NAME = "md.light.onSurface";
const FALLBACK_HEX = "#1D1B20";

function ensureMdLightOnSurface() {
  let t = penpotUtils.findTokenByName(TOKEN_NAME);
  if (t) return t;
  const catalog = penpot.library.local.tokens;
  let set = catalog.sets.find(function (s) {
    return s.name === "Material Icons";
  });
  if (!set) set = catalog.addSet({ name: "Material Icons" });
  if (!set.active) set.toggleActive();
  set.addToken({ type: "color", name: TOKEN_NAME, value: FALLBACK_HEX });
  return penpotUtils.findTokenByName(TOKEN_NAME);
}

const TARGET_PAGE_NAME = "Symbols";
const page = penpotUtils.getPageByName(TARGET_PAGE_NAME);
if (!page) {
  return { error: "Pagina niet gevonden: " + TARGET_PAGE_NAME };
}
penpot.openPage(page);

const tok = ensureMdLightOnSurface();
if (!tok) {
  return { error: "Token niet beschikbaar: " + TOKEN_NAME };
}

const vc = penpotUtils.findShape(function (s) {
  return (
    s.name === VC_NAME &&
    s.isVariantContainer &&
    s.isVariantContainer()
  );
}, page.root);

if (!vc) {
  return { error: "Variantcontainer niet gevonden: " + VC_NAME };
}

let updated = 0;
const boards = vc.children;
for (let i = 0; i < boards.length; i++) {
  const board = boards[i];
  const pCanvas = penpotUtils.findShapes(function (s) {
    return s.type === "path" && s.fills && s.fills.length > 0;
  }, board)[0];
  if (!pCanvas || !pCanvas.component) {
    continue;
  }
  const comp = pCanvas.component();
  const main = comp && comp.mainInstance && comp.mainInstance();
  if (!main) {
    continue;
  }
  const pMain = penpotUtils.findShapes(function (s) {
    return s.type === "path" && s.fills && s.fills.length > 0;
  }, main)[0];
  if (pMain && tok.applyToShapes) {
    tok.applyToShapes([pMain], ["fill"]);
    updated++;
  }
}

return {
  ok: true,
  container: VC_NAME,
  token: tok.name,
  mainPathsUpdated: updated,
};
