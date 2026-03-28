/**
 * Penpot MCP — execute_code (plugin verbonden)
 *
 * VASTE AFSPRAKEN (niet onderhandelbaar):
 * - Kleur: altijd design token via fill "{md.light.onSurface}" (token moet in bestand bestaan).
 * - Altijd library-component + variantengroep.
 * - Variant-assen: "Size" → 20px | 24px | 40px | 48px  en  "Fill" → fill-0 | fill-1
 * - Assets-container: Symbols / Material / Rounded / <ICON_SLUG>
 *
 * Pas alleen boven CONFIG aan (ander icoon: nieuwe path-d’s uit Material Symbols Rounded SVG).
 */

const CONFIG = {
  ICON_SLUG: "bookmark",
  TOKEN_NAME: "md.light.onSurface",
  FALLBACK_HEX: "#1D1B20",
  TARGET_PAGE: "Symbols",
  /** Zet true om bestaande variantcontainer metzelfde naam te vervangen */
  REPLACE_EXISTING: true,
};

const SIZES = [20, 24, 40, 48];

/** Outline (fill-0) en gevuld (fill-1) — zelfde viewBox; Penpot resize per maat. Material Symbols Rounded / bookmark. */
const D_OUTLINE =
  "m480-240-141 57q-35 14-67-7.5T240-250v-494q0-29.7 21.15-50.85Q282.3-816 312-816h336q29.7 0 50.85 21.15Q720-773.7 720-744v494q0 38-32 59.5t-67 7.5l-141-57Zm0-78 168 67v-493H312v493l168-67Zm0-426H312h336-168Z";
const D_FILL =
  "m480-240-141 57q-35 14-67-7.5T240-250v-494q0-30 21-51t51-21h336q30 0 51 21t21 51v494q0 38-32 59.5t-67 7.5l-141-57Z";

const VC_NAME =
  "Symbols / Material / Rounded / " + CONFIG.ICON_SLUG;
const TOKEN_NAME = CONFIG.TOKEN_NAME;
const FALLBACK_HEX = CONFIG.FALLBACK_HEX;
const TARGET_PAGE = CONFIG.TARGET_PAGE;

function ensureToken() {
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

function ensureFillSvg(svg) {
  return svg.replace(/<path /g, '<path fill="' + FALLBACK_HEX + '" ');
}

function setFillTokenReferenceOnRoot(root) {
  if (!root) return 0;
  const ref = "{" + TOKEN_NAME + "}";
  const leaves = penpotUtils.findShapes(
    (s) => s.fills && s.fills.length > 0,
    root,
  );
  for (let i = 0; i < leaves.length; i++) {
    const s = leaves[i];
    const op =
      s.fills[0] && s.fills[0].fillOpacity != null ? s.fills[0].fillOpacity : 1;
    s.fills = [{ fillColor: ref, fillOpacity: op }];
  }
  return leaves.length;
}

function svgFor(px, fillIsOne) {
  const d = fillIsOne ? D_FILL : D_OUTLINE;
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" width="' +
    px +
    '" height="' +
    px +
    '" viewBox="0 -960 960 960"><path d="' +
    d +
    '"/></svg>'
  );
}

function reapplyTokenOnAllVariantMains(vc) {
  for (let i = 0; i < vc.children.length; i++) {
    const board = vc.children[i];
    setFillTokenReferenceOnRoot(board);
    const anyComp = penpotUtils.findShape(
      (s) => typeof s.component === "function",
      board,
    );
    if (anyComp) {
      const comp = anyComp.component();
      const main = comp && comp.mainInstance && comp.mainInstance();
      if (main) setFillTokenReferenceOnRoot(main);
    }
  }
}

const page = penpotUtils.getPageByName(TARGET_PAGE);
if (!page) {
  return { error: "Pagina niet gevonden: " + TARGET_PAGE };
}
penpot.openPage(page);

const existingVc = penpotUtils.findShape(
  (s) =>
    s.name === VC_NAME &&
    s.isVariantContainer &&
    s.isVariantContainer(),
  page.root,
);
if (existingVc) {
  const Vx = existingVc.variants;
  const ok =
    Vx &&
    Vx.properties &&
    Vx.properties[0] === "Size" &&
    Vx.properties[1] === "Fill" &&
    Vx.variantComponents().length === 8;
  if (ok && !CONFIG.REPLACE_EXISTING) {
    ensureToken();
    reapplyTokenOnAllVariantMains(existingVc);
    sleepMs(250);
    return { ok: true, skipped: true, container: VC_NAME, token: TOKEN_NAME };
  }
  try {
    existingVc.remove();
  } catch (e0) {}
}

ensureToken();

const VARIANT_LABELS = [];
for (let si = 0; si < SIZES.length; si++) {
  const px = SIZES[si];
  VARIANT_LABELS.push({ px: px, fillKey: "fill-0" });
  VARIANT_LABELS.push({ px: px, fillKey: "fill-1" });
}

const mains = [];
for (let vi = 0; vi < VARIANT_LABELS.length; vi++) {
  const lab = VARIANT_LABELS[vi];
  const fillOne = lab.fillKey === "fill-1" ? 1 : 0;
  const raw = svgFor(lab.px, fillOne === 1);
  const g = penpot.createShapeFromSvg(ensureFillSvg(raw));
  if (!g) {
    return { error: "SVG-import mislukt", index: vi };
  }
  g.name =
    "Symbols / Material / Rounded / " +
    lab.px +
    "px / " +
    CONFIG.ICON_SLUG +
    " / " +
    lab.fillKey;
  g.resize(lab.px, lab.px);
  setFillTokenReferenceOnRoot(g);
  page.root.appendChild(g);
  penpot.library.local.createComponent([g]);
  sleepMs(90);
  const comp = g.parent && g.parent.component && g.parent.component();
  if (comp && comp.mainInstance) {
    setFillTokenReferenceOnRoot(comp.mainInstance());
  }
  mains.push(g.parent);
}

const root0 = mains[0];
const c0 = root0.component();
if (!c0 || !c0.transformInVariant) {
  return { error: "transformInVariant niet beschikbaar" };
}
c0.transformInVariant();

const vc = root0.parent;
if (!vc || !vc.isVariantContainer || !vc.isVariantContainer()) {
  return { error: "Geen variant-container" };
}

if (vc.children.length >= 2) {
  try {
    vc.children[1].remove();
  } catch (e1) {}
}
for (let j = 1; j < mains.length; j++) {
  vc.appendChild(mains[j]);
}

vc.name = VC_NAME;

reapplyTokenOnAllVariantMains(vc);
sleepMs(200);

const V = vc.variants;
if (!V) {
  return { error: "Geen variants" };
}

sleepMs(150);
V.renameProperty(0, "Size");
if (V.properties.length < 2) {
  V.addProperty();
}
V.renameProperty(1, "Fill");
while (V.properties.length > 2) {
  V.removeProperty(V.properties.length - 1);
}

const comps = V.variantComponents();
for (let k = 0; k < comps.length && k < VARIANT_LABELS.length; k++) {
  comps[k].setVariantProperty(0, VARIANT_LABELS[k].px + "px");
  comps[k].setVariantProperty(1, VARIANT_LABELS[k].fillKey);
}

sleepMs(200);
reapplyTokenOnAllVariantMains(vc);
sleepMs(250);

return {
  ok: true,
  container: VC_NAME,
  token: TOKEN_NAME,
  axes: V.properties,
  variantCount: comps.length,
  sizes: SIZES,
  fills: ["fill-0", "fill-1"],
};
