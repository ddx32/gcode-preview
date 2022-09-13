import "./style.css";
import { render } from "./render";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div id="gcode-viewer"></div>
  <div id="slider"></div>
  <div>Layer: <span id="layer-count"></span></div>
`;

fetch("pikachu.gcode")
  .then((res) => res.text())
  .then((gcode) => render(gcode));
