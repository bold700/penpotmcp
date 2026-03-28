/**
 * Penpot MCP execute_code — zet "Bookmark 20px" op pagina Symbols om tot library-component.
 * Assets-pad (mappen via " / "): Symbols / Material / Rounded / bookmark / 20px
 * Fill-token op main path: md.light.onSurface
 */
const COMPONENT_NAME = "Symbols / Material / Rounded / bookmark / 20px";
const TOKEN_NAME = "md.light.onSurface";
const FALLBACK_HEX = "#1D1B20";
const TARGET_PAGE = "Symbols";

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

function applyTokToRoot(root, tok) {
  if (!root || !tok || !tok.applyToShapes) return 0;
  let paths = penpotUtils.findShapes(
    (s) => s.type === "path" && s.fills && s.fills.length > 0,
    root,
  );
  if (!paths.length) {
    paths = penpotUtils.findShapes((s) => s.fills && s.fills.length > 0, root);
  }
  if (paths.length) tok.applyToShapes(paths, ["fill"]);
  return paths.length;
}

const page = penpotUtils.getPageByName(TARGET_PAGE);
if (!page) return { error: "Geen pagina " + TARGET_PAGE };
penpot.openPage(page);

const shape = penpotUtils.findShape(
  (s) => s.name === "Bookmark 20px" || s.name === COMPONENT_NAME,
  page.root,
);
if (!shape) return { error: "Geen Bookmark 20px op " + TARGET_PAGE };

const tok = ensureTok();
const existingComp = shape.component && shape.component();

if (existingComp) {
  existingComp.name = COMPONENT_NAME;
  shape.name = COMPONENT_NAME;
  const main = existingComp.mainInstance && existingComp.mainInstance();
  applyTokToRoot(main || shape, tok);
  sleepMs(120);
  return {
    ok: true,
    action: "bestaande component hernoemd",
    libraryName: COMPONENT_NAME,
    token: TOKEN_NAME,
  };
}

const libComp = penpot.library.local.createComponent([shape]);
if (!libComp) return { error: "createComponent mislukt" };
libComp.name = COMPONENT_NAME;
shape.name = COMPONENT_NAME;
const main = libComp.mainInstance && libComp.mainInstance();
applyTokToRoot(main || shape, tok);
sleepMs(120);

return {
  ok: true,
  action: "component aangemaakt",
  libraryName: COMPONENT_NAME,
  token: TOKEN_NAME,
};
