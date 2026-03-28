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

function sleepMs(ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {}
}

/** Plugin-bridge: fill koppelen via "{tokenNaam}" — applyToken faalt op token_proxy. */
function setFillTokenReferenceOnRoot(root, tokenName) {
  if (!root || !tokenName) return 0;
  const leaves = penpotUtils.findShapes(function (s) {
    return s.fills && s.fills.length > 0;
  }, root);
  const ref = "{" + tokenName + "}";
  for (let i = 0; i < leaves.length; i++) {
    const s = leaves[i];
    const op =
      s.fills[0] && s.fills[0].fillOpacity != null ? s.fills[0].fillOpacity : 1;
    s.fills = [{ fillColor: ref, fillOpacity: op }];
  }
  return leaves.length;
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
  updated += setFillTokenReferenceOnRoot(board, TOKEN_NAME);
  const anyComp = penpotUtils.findShape(function (s) {
    return typeof s.component === "function";
  }, board);
  if (anyComp) {
    const comp = anyComp.component();
    const main = comp && comp.mainInstance && comp.mainInstance();
    if (main) {
      updated += setFillTokenReferenceOnRoot(main, TOKEN_NAME);
    }
  }
}
sleepMs(250);

return {
  ok: true,
  container: VC_NAME,
  token: TOKEN_NAME,
  shapesTouched: updated,
};
