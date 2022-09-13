import {
  Color,
  GCodeRenderer,
  LineColorizer,
  LineColorConfig,
} from "gcode-viewer/src/index";

export function render(gcode: string) {
  // First parse the ;TYPE: comments to build an example config for the GCodeRenderer.
  // Note that the example gcode does not indicate travel moves easily -> just ignore that fact for simplicity.

  const EXTERNAL_PERIMETER_COLOR = new Color("#FF7315");
  const PERIMETER_COLOR = new Color("#FFE500");
  const SKIRT_COLOR = new Color("#008A6D");
  const SOLID_INFILL_COLOR = new Color("#A050D3");
  const INTERNAL_INFILL = new Color("#C01D1F");
  const TOP_SOLID_INFILL = new Color("#FF2335");
  const BRIDGE_INFILL = new Color("#3A82BF");
  let colorConfig: LineColorConfig = [];

  gcode.split("\n").forEach(function (line, i) {
    let color;
    if (line.startsWith(";TYPE:External perimeter")) {
      color = EXTERNAL_PERIMETER_COLOR;
    } else if (line.startsWith(";TYPE:Perimeter")) {
      color = PERIMETER_COLOR;
    } else if (line.startsWith(";TYPE:Skirt/Brim")) {
      color = SKIRT_COLOR;
    } else if (line.startsWith(";TYPE:Solid infill")) {
      color = SOLID_INFILL_COLOR;
    } else if (line.startsWith(";TYPE:Internal infill")) {
      color = INTERNAL_INFILL;
    } else if (line.startsWith(";TYPE:Top solid infill")) {
      color = TOP_SOLID_INFILL;
    } else if (line.startsWith(";TYPE:Bridge infill")) {
      color = BRIDGE_INFILL;
    }

    if (
      colorConfig.length === 0 ||
      (color && colorConfig[colorConfig.length - 1].color !== color)
    ) {
      colorConfig.push({ toLine: i, color });
    } else {
      colorConfig[colorConfig.length - 1].toLine = i;
    }
  });

  const renderer = new GCodeRenderer(gcode, 1024, 768, new Color(0x808080));
  renderer.colorizer = new LineColorizer(colorConfig);
  renderer.travelWidth = 0;

  document.getElementById("gcode-viewer")?.append(renderer.element());

  renderer.render().then(() => {
    console.log("rendering finished");

    const slider = document.createElement("input");
    slider.setAttribute("type", "range");
    slider.setAttribute("min", "0");
    slider.setAttribute("max", renderer.layerCount().toString());
    slider.setAttribute("value", renderer.layerCount().toString());
    document.getElementById("slider")?.append(slider);

    const layerCountElement = document.getElementById("layer-count");

    if (layerCountElement) {
      layerCountElement.innerText = renderer.layerCount().toString();
    }

    slider.addEventListener("change", (event) => {
      const inputElement = event.target as HTMLInputElement;
      const value = parseInt(inputElement.value);
      renderer.sliceLayer(0, value);
    });

    slider.addEventListener("input", (event) => {
      const inputElement = event.target as HTMLInputElement;
      if (layerCountElement) {
        layerCountElement.innerText = inputElement.value;
      }
    });
  });
}
