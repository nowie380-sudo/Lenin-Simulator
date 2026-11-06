import { createGame } from "./js/game.js";
import { createUI } from "./js/ui.js";
import { drawMap } from "./js/map.js";

const canvas = document.querySelector("#world");
const game = createGame();
const ui = createUI(game);

function render() {
  ui.render();
  drawMap(canvas, game.state);
}
window.addEventListener("resize", () => drawMap(canvas, game.state));
game.subscribe(render);
ui.bind();
render();
