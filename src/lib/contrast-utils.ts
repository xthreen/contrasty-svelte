function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

function rgbToHex(rgb: number[]) {
  return (
    "#" +
    rgb
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
      .toUpperCase()
  );
}

function rgbToHsl(rgb: number[]) {
  const [r, g, b] = rgb;
  const [RED, GREEN, BLUE] = [r / 255, g / 255, b / 255];
  const MAX = Math.max(RED, GREEN, BLUE);
  const MIN = Math.min(RED, GREEN, BLUE);
  const L = (MAX + MIN) / 2;
  let H = 0;
  let S = 0;

  if (MAX !== MIN) {
    const D = MAX - MIN;
    S = L > 0.5 ? D / (2 - MAX - MIN) : D / (MAX + MIN);

    switch (MAX) {
      case RED:
        H = (GREEN - BLUE) / D + (GREEN < BLUE ? 6 : 0);
        break;
      case GREEN:
        H = (BLUE - RED) / D + 2;
        break;
      case BLUE:
        H = (RED - GREEN) / D + 4;
        break;
    }
  }

  return [H * 60, S * 100, L * 100];
}

function toLinear(col: number) {
  const color = col / 255.0;
  if (color <= 0.03928) {
    return color / 12.92;
  } else {
    return Math.pow((color + 0.055) / 1.055, 2.4);
  }
}

function relativeLuminance(rgb: number[]) {
  const [r, g, b] = rgb;
  const [RED, GREEN, BLUE] = [toLinear(r), toLinear(g), toLinear(b)];
  return 0.2126 * RED + 0.7152 * GREEN + 0.0722 * BLUE;
}

function calculate(rgbOne: number[], rgbTwo: number[], textSize: string) {
  let L1 = relativeLuminance(rgbOne);
  let L2 = relativeLuminance(rgbTwo);

  if (L1 > L2) {
    [L1, L2] = [L2, L1];
  }

  const ratio = (L2 + 0.05) / (L1 + 0.05);

  let isAccessible = false;

  if (textSize === "small") {
    isAccessible = ratio >= 3;
  } else {
    isAccessible = ratio >= 4.5;
  }

  return {
    ratio,
    isAccessible,
  };
}

export {
    hexToRgb,
    rgbToHex,
    rgbToHsl,
    toLinear,
    relativeLuminance,
    calculate
}
