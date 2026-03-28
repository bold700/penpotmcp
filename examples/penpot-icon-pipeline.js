/**
 * Penpot MCP — execute_code (plugin verbonden)
 *
 * VASTE AFSPRAKEN (niet onderhandelbaar):
 * - Kleur: altijd design token via fill "{md.light.onSurface}" (token moet in bestand bestaan).
 * - Altijd library-component + variantengroep.
 * - Variant-assen: "Size" → 20px | 24px | 40px | 48px  en  "Fill" → fill-0 | fill-1
 * - Assets-container: Symbols / Material / Rounded / <ICON_SLUG>
 *
 * Bron voor SVG’s (standaard stijl = rounded):
 * https://github.com/google/material-design-icons/tree/master/symbols/web
 * Map: symbols/web/<ICON_SLUG>/materialsymbolsrounded/
 * Bestanden: <slug>_<px>px.svg (fill-0) en <slug>_fill1_<px>px.svg (fill-1), px ∈ {20,24,40,48}.
 * Andere stijlen: materialsymbolsoutlined, materialsymbolssharp (zelfde bestandsnamen).
 *
 * Vervang onderstaand SVGS-object na download (Penpot-plugin heeft geen netwerk).
 */

const CONFIG = {
  ICON_SLUG: "search",
  /** Alleen voor documentatie / curl; Penpot voert dit niet uit */
  MATERIAL_STYLE_DIR: "materialsymbolsrounded",
  TOKEN_NAME: "md.light.onSurface",
  FALLBACK_HEX: "#1D1B20",
  TARGET_PAGE: "Symbols",
  REPLACE_EXISTING: true,
};

const SIZES = [20, 24, 40, 48];

/** google/material-design-icons master → symbols/web/search/materialsymbolsrounded */
const SVGS = {
  "20-0": "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"20\" viewBox=\"0 -960 960 960\" width=\"20\"><path d=\"M384.03-336Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.03q0 40.39-12.5 76.18Q599-464 577-434l214 214q11 11 11 25t-11 25q-11 11-25.5 11T740-170L526-383q-30 22-65.79 34.5-35.79 12.5-76.18 12.5Zm-.03-72q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z\"/></svg>",
  "20-1": "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"20\" viewBox=\"0 -960 960 960\" width=\"20\"><path d=\"M384.03-336Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.03q0 40.39-12.5 76.18Q599-464 577-434l214 214q11 11 11 25t-11 25q-11 11-25.5 11T740-170L526-383q-30 22-65.79 34.5-35.79 12.5-76.18 12.5Zm-.03-72q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z\"/></svg>",
  "24-0": "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 -960 960 960\" width=\"24\"><path d=\"M380-320q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l224 224q11 11 11 28t-11 28q-11 11-28 11t-28-11L532-372q-30 24-69 38t-83 14Zm0-80q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z\"/></svg>",
  "24-1": "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 -960 960 960\" width=\"24\"><path d=\"M380-320q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l224 224q11 11 11 28t-11 28q-11 11-28 11t-28-11L532-372q-30 24-69 38t-83 14Zm0-80q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z\"/></svg>",
  "40-0": "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"40\" viewBox=\"0 -960 960 960\" width=\"40\"><path d=\"M378.67-326q-108.44 0-183.56-75.17Q120-476.33 120-583.33t75.17-182.17q75.16-75.17 182.5-75.17 107.33 0 182.16 75.17 74.84 75.17 74.84 182.27 0 43.23-14 82.9-14 39.66-40.67 73l236 234.66q9.67 9.37 9.67 23.86 0 14.48-9.67 24.14-9.67 9.67-24.15 9.67-14.48 0-23.85-9.67L532.67-380q-30 25.33-69.64 39.67Q423.39-326 378.67-326Zm-.67-66.67q79.17 0 134.58-55.83Q568-504.33 568-583.33q0-79-55.42-134.84Q457.17-774 378-774q-79.72 0-135.53 55.83-55.8 55.84-55.8 134.84t55.8 134.83q55.81 55.83 135.53 55.83Z\"/></svg>",
  "40-1": "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"40\" viewBox=\"0 -960 960 960\" width=\"40\"><path d=\"M378.67-326q-108.44 0-183.56-75.17Q120-476.33 120-583.33t75.17-182.17q75.16-75.17 182.5-75.17 107.33 0 182.16 75.17 74.84 75.17 74.84 182.27 0 43.23-14 82.9-14 39.66-40.67 73l236 234.66q9.67 9.37 9.67 23.86 0 14.48-9.67 24.14-9.67 9.67-24.15 9.67-14.48 0-23.85-9.67L532.67-380q-30 25.33-69.64 39.67Q423.39-326 378.67-326Zm-.67-66.67q79.17 0 134.58-55.83Q568-504.33 568-583.33q0-79-55.42-134.84Q457.17-774 378-774q-79.72 0-135.53 55.83-55.8 55.84-55.8 134.84t55.8 134.83q55.81 55.83 135.53 55.83Z\"/></svg>",
  "48-0": "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" viewBox=\"0 -960 960 960\" width=\"48\"><path d=\"M378-329q-108.16 0-183.08-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l242 240q9 8.56 9 21.78T818-143q-9 9-22.22 9-13.22 0-21.78-9L533-384q-30 26-69.96 40.5Q423.08-329 378-329Zm-1-60q81.25 0 138.13-57.5Q572-504 572-585t-56.87-138.5Q458.25-781 377-781q-82.08 0-139.54 57.5Q180-666 180-585t57.46 138.5Q294.92-389 377-389Z\"/></svg>",
  "48-1": "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" viewBox=\"0 -960 960 960\" width=\"48\"><path d=\"M378-329q-108.16 0-183.08-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l242 240q9 8.56 9 21.78T818-143q-9 9-22.22 9-13.22 0-21.78-9L533-384q-30 26-69.96 40.5Q423.08-329 378-329Zm-1-60q81.25 0 138.13-57.5Q572-504 572-585t-56.87-138.5Q458.25-781 377-781q-82.08 0-139.54 57.5Q180-666 180-585t57.46 138.5Q294.92-389 377-389Z\"/></svg>",
};

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
  const fillDigit = lab.fillKey === "fill-1" ? "1" : "0";
  const svgKey = lab.px + "-" + fillDigit;
  const raw = SVGS[svgKey];
  if (!raw) {
    return { error: "SVGS mist key: " + svgKey, hint: "Download van GitHub symbols/web" };
  }
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
