/**
 * Penpot MCP execute_code — bookmark 20px als variant-component met property **Fill**
 * (fill-0 / fill-1), Material Symbols Rounded uit repo-SVG’s.
 *
 * Assets-container: Symbols / Material / Rounded / 20px / bookmark
 * (icoon-naam laatste segment; maat ervoor)
 *
 * Fill op main path: md.light.onSurface
 */
const VC_NAME = "Symbols / Material / Rounded / 20px / bookmark";
const LEGACY_SINGLE = "Symbols / Material / Rounded / bookmark / 20px";
const TOKEN_NAME = "md.light.onSurface";
const FALLBACK_HEX = "#1D1B20";
const TARGET_PAGE = "Symbols";

const SVG_FILL_0 =
  '<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m480-240-141 57q-35 14-67-7.5T240-250v-494q0-29.7 21.15-50.85Q282.3-816 312-816h336q29.7 0 50.85 21.15Q720-773.7 720-744v494q0 38-32 59.5t-67 7.5l-141-57Zm0-78 168 67v-493H312v493l168-67Zm0-426H312h336-168Z"/></svg>';
const SVG_FILL_1 =
  '<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m480-240-141 57q-35 14-67-7.5T240-250v-494q0-30 21-51t51-21h336q30 0 51 21t21 51v494q0 38-32 59.5t-67 7.5l-141-57Z"/></svg>';

function ensureTok() {
  let t = penpotUtils.findTokenByName(TOKEN_NAME);
  if (t) return t;
  const catalog = penpot.library.local.tokens;
  let set = catalog.sets.find((s) => s.name === "Material Icons");
  if (!set) set = catalog.addSet({ name: "Material Icons" });
  if (!set.active) set.toggleActive();
  set.addToken({ type: "color", name: TOKEN_NAME, value: FALLBACK_HEX });
  return penpotUtils.findTokenByName(TOKEN_NAME);
}

function sleepMs(ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {}
}

function ensureFill(svg, hex) {
  return svg.replace(/<path /g, '<path fill="' + hex + '" ');
}

/**
 * Penpot-plugin: applyToken/applyToShapes op shapes faalt vaak (token_proxy-validatie in de bridge).
 * Wél betrouwbaar: fill als tokenreferentie met accolades, bv. "{md.light.onSurface}".
 */
function setFillTokenReferenceOnRoot(root, tokenName) {
  if (!root || !tokenName) return 0;
  const leaves = penpotUtils.findShapes(
    (s) => s.fills && s.fills.length > 0,
    root,
  );
  const ref = "{" + tokenName + "}";
  for (let i = 0; i < leaves.length; i++) {
    const s = leaves[i];
    const op =
      s.fills[0] && s.fills[0].fillOpacity != null ? s.fills[0].fillOpacity : 1;
    s.fills = [{ fillColor: ref, fillOpacity: op }];
  }
  return leaves.length;
}

function applyTokToSvgRoot(root, tokenName) {
  setFillTokenReferenceOnRoot(root, tokenName);
}

function applyTokMainFromBoard(board, tokenName) {
  if (!board || !tokenName) return 0;
  let n = setFillTokenReferenceOnRoot(board, tokenName);
  const anyComp = penpotUtils.findShape(
    (s) => typeof s.component === "function",
    board,
  );
  if (anyComp) {
    const comp = anyComp.component();
    const main = comp && comp.mainInstance && comp.mainInstance();
    if (main) {
      n += setFillTokenReferenceOnRoot(main, tokenName);
    }
  }
  return n;
}

function reapplyTokenOnAllVariantMains(vc, tokenName) {
  if (!tokenName || !vc) return 0;
  let n = 0;
  for (let i = 0; i < vc.children.length; i++) {
    n += applyTokMainFromBoard(vc.children[i], tokenName);
  }
  return n;
}

const page = penpotUtils.getPageByName(TARGET_PAGE);
if (!page) return { error: "Geen pagina " + TARGET_PAGE };
penpot.openPage(page);

const existingVc = penpotUtils.findShape(
  (s) => s.isVariantContainer && s.isVariantContainer() && s.name === VC_NAME,
  page.root,
);
if (existingVc && existingVc.variants) {
  const Vx = existingVc.variants;
  const props = Vx.properties || [];
  const nComp = Vx.variantComponents ? Vx.variantComponents().length : 0;
  if (props.length === 1 && props[0] === "Fill" && nComp === 2) {
    ensureTok();
    reapplyTokenOnAllVariantMains(existingVc, TOKEN_NAME);
    sleepMs(250);
    return {
      ok: true,
      skipped: true,
      container: VC_NAME,
      properties: props,
      token: TOKEN_NAME,
    };
  }
  try {
    existingVc.remove();
  } catch (e1) {}
}

let ox = 80;
let oy = 80;
const toClear = penpotUtils.findShapes((s) => {
  if (s.isVariantContainer && s.isVariantContainer()) return false;
  return (
    s.name === VC_NAME ||
    s.name === LEGACY_SINGLE ||
    s.name === "Bookmark 20px"
  );
}, page.root);
if (toClear.length) {
  ox = toClear[0].x;
  oy = toClear[0].y;
  toClear.forEach((s) => {
    try {
      s.remove();
    } catch (e2) {}
  });
}

const tok = ensureTok();

function buildImported(hexSvg) {
  const g = penpot.createShapeFromSvg(ensureFill(hexSvg, FALLBACK_HEX));
  if (!g) return null;
  g.resize(20, 20);
  applyTokToSvgRoot(g, TOKEN_NAME);
  g.x = ox;
  g.y = oy;
  page.root.appendChild(g);
  penpot.library.local.createComponent([g]);
  sleepMs(150);
  const comp = g.parent && g.parent.component && g.parent.component();
  if (comp && comp.mainInstance) {
    applyTokToSvgRoot(comp.mainInstance(), TOKEN_NAME);
  }
  sleepMs(200);
  return g.parent;
}

const g0root = buildImported(SVG_FILL_0);
const g1root = buildImported(SVG_FILL_1);
if (!g0root || !g1root) {
  return { error: "SVG-import of component mislukt" };
}

const c0 = g0root.component();
if (!c0 || !c0.transformInVariant) {
  return { error: "transformInVariant niet beschikbaar" };
}
c0.transformInVariant();

const vc = g0root.parent;
if (!vc || !vc.isVariantContainer || !vc.isVariantContainer()) {
  return { error: "Geen variant-container" };
}

if (vc.children.length >= 2) {
  try {
    vc.children[1].remove();
  } catch (e3) {}
}
vc.appendChild(g1root);

vc.name = VC_NAME;

reapplyTokenOnAllVariantMains(vc, TOKEN_NAME);
sleepMs(200);

const V = vc.variants;
if (!V) return { error: "Geen variants" };

sleepMs(200);
V.renameProperty(0, "Fill");
while (V.properties.length > 1) {
  V.removeProperty(V.properties.length - 1);
}

const comps = V.variantComponents();
if (comps.length >= 2) {
  comps[0].setVariantProperty(0, "fill-0");
  comps[1].setVariantProperty(0, "fill-1");
}

sleepMs(200);
reapplyTokenOnAllVariantMains(vc, TOKEN_NAME);
sleepMs(250);

return {
  ok: true,
  container: VC_NAME,
  properties: V.properties,
  variants: comps.length,
  token: TOKEN_NAME,
};
