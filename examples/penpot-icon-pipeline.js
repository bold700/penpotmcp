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
  ICON_SLUG: "bookmark",
  /** Alleen voor documentatie / curl; Penpot voert dit niet uit */
  MATERIAL_STYLE_DIR: "materialsymbolsrounded",
  TOKEN_NAME: "md.light.onSurface",
  FALLBACK_HEX: "#1D1B20",
  TARGET_PAGE: "Symbols",
  REPLACE_EXISTING: true,
};

const SIZES = [20, 24, 40, 48];

/** Afkomstig van google/material-design-icons master, materialsymbolsrounded (per optical size). */
const SVGS = {
  "20-0":
    '<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m480-240-141 57q-35 14-67-7.5T240-250v-494q0-29.7 21.15-50.85Q282.3-816 312-816h336q29.7 0 50.85 21.15Q720-773.7 720-744v494q0 38-32 59.5t-67 7.5l-141-57Zm0-78 168 67v-493H312v493l168-67Zm0-426H312h336-168Z"/></svg>',
  "20-1":
    '<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"><path d="m480-240-141 57q-35 14-67-7.5T240-250v-494q0-30 21-51t51-21h336q30 0 51 21t21 51v494q0 38-32 59.5t-67 7.5l-141-57Z"/></svg>',
  "24-0":
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m480-240-168 72q-40 17-76-6.5T200-241v-519q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v519q0 43-36 66.5t-76 6.5l-168-72Zm0-88 200 86v-518H280v518l200-86Zm0-432H280h400-200Z"/></svg>',
  "24-1":
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m480-240-168 72q-40 17-76-6.5T200-241v-519q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v519q0 43-36 66.5t-76 6.5l-168-72Z"/></svg>',
  "40-0":
    '<svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="m480-240-186.67 80Q260-145.67 230-165.34T200-221v-555.67q0-27 19.83-46.83 19.84-19.83 46.84-19.83h426.66q27 0 46.84 19.83Q760-803.67 760-776.67V-221q0 35.99-30 55.66-30 19.67-63.33 5.34L480-240Zm0-72 213.33 90.67v-555.34H266.67v555.34L480-312Zm0-464.67H266.67h426.66H480Z"/></svg>',
  "40-1":
    '<svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40"><path d="m480-240-186.67 80Q260-145.67 230-165.5T200-221v-555.67q0-27 19.83-46.83 19.84-19.83 46.84-19.83h426.66q27 0 46.84 19.83Q760-803.67 760-776.67V-221q0 35.67-30 55.5t-63.33 5.5L480-240Z"/></svg>',
  "48-0":
    '<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m480-240-196 84q-30 13-57-4.76-27-17.75-27-50.24v-574q0-24 18-42t42-18h440q24 0 42 18t18 42v574q0 32.49-27 50.24Q706-143 676-156l-196-84Zm0-64 220 93v-574H260v574l220-93Zm0-481H260h440-220Z"/></svg>',
  "48-1":
    '<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m480-240-196 84q-30 13-57-5t-27-50v-574q0-24 18-42t42-18h440q24 0 42 18t18 42v574q0 32-27 50t-57 5l-196-84Z"/></svg>',
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
