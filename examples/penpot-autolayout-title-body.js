/**
 * Penpot MCP — execute_code
 * Flex-autolayout (kolom) met titel + bodytekst.
 *
 * Gebruik: Penpot-plugin verbonden met MCP → voer deze code uit via execute_code.
 * Let op: gebruik board.appendChild, niet board.flex.appendChild (die is kapot).
 */

const board = penpot.createBoard();
if (!board) {
  return { ok: false, error: "createBoard() mislukt" };
}

board.name = "Autolayout — titel + body";
board.fills = [{ fillColor: "#FFFFFF", fillOpacity: 1 }];

const flex = board.addFlexLayout();
flex.dir = "column";
flex.alignItems = "stretch";
flex.rowGap = 12;
flex.columnGap = 0;
flex.verticalPadding = 24;
flex.horizontalPadding = 24;
flex.horizontalSizing = "auto";
flex.verticalSizing = "auto";

const title = penpot.createText("Titel");
const body = penpot.createText(
  "Dit is de bodytekst. In een kolom-flexlayout vullen de tekstlagen de breedte en stapelen ze verticaal met vaste tussenruimte — vergelijkbaar met autolayout in andere design tools.",
);

if (!title || !body) {
  return { ok: false, error: "createText() mislukt" };
}

title.growType = "auto-height";
body.growType = "auto-height";

title.fontSize = "24";
title.fontWeight = "700";
title.fills = [{ fillColor: "#1C1C1C", fillOpacity: 1 }];

body.fontSize = "16";
body.fontWeight = "400";
body.lineHeight = "1.5";
body.fills = [{ fillColor: "#454545", fillOpacity: 1 }];

board.appendChild(title);
board.appendChild(body);

if (title.layoutChild) {
  title.layoutChild.horizontalSizing = "fill";
  title.layoutChild.verticalSizing = "auto";
}
if (body.layoutChild) {
  body.layoutChild.horizontalSizing = "fill";
  body.layoutChild.verticalSizing = "auto";
}

// Vaste breedte zodat lange body netjes afbreken (auto-hoogte op tekst).
board.resize(400, 160);

const root = penpot.root;
if (root && typeof root.appendChild === "function") {
  root.appendChild(board);
}
penpotUtils.setParentXY(board, 80, 80);

return {
  ok: true,
  structure: penpotUtils.shapeStructure(board, 5),
};
