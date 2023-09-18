import { expect, test } from 'vitest';
import {
  hexToRgb,
  hslToRgb,
  rgbToHex,
  rgbToHsl,
  toLinear,
  relativeLuminance,
  calculate,
} from "./contrast-utils";

test(`hexToRgb("#000000")`, () => {
    expect(hexToRgb("#000000")).toEqual([0, 0, 0]);
});

test(`hexToRgb("#ffffff")`, () => {
    expect(hexToRgb("#ffffff")).toEqual([255, 255, 255]);
});

test(`hexToRgb("#ff0000")`, () => {
    expect(hexToRgb("#ff0000")).toEqual([255, 0, 0]);
});

test(`hexToRgb("#00ff00")`, () => {
    expect(hexToRgb("#00ff00")).toEqual([0, 255, 0]);
});

test(`hexToRgb("#0000ff")`, () => {
    expect(hexToRgb("#0000ff")).toEqual([0, 0, 255]);
});

test(`hexToRgb("#ff00ff")`, () => {
    expect(hexToRgb("#ff00ff")).toEqual([255, 0, 255]);
});

test(`hexToRgb("#00ffff")`, () => {
    expect(hexToRgb("#00ffff")).toEqual([0, 255, 255]);
});

test(`hexToRgb("#ffff00")`, () => {
    expect(hexToRgb("#ffff00")).toEqual([255, 255, 0]);
});

test(`hexToRgb("#ff0000")`, () => {
    expect(hexToRgb("#ff0000")).toEqual([255, 0, 0]);
});

test("hslToRgb([0,0,0])", () => {
    expect(hslToRgb([0, 0, 0])).toEqual([0, 0, 0]);
});

test("hslToRgb([0,0,1])", () => {
    expect(hslToRgb([0, 0, 1])).toEqual([3, 3, 3]);
});

test("hslToRgb([0,0,100])", () => {
    expect(hslToRgb([0, 0, 100])).toEqual([255, 255, 255]);
});

test("hslToRgb([0,0,50])", () => {
    expect(hslToRgb([0, 0, 50])).toEqual([128, 128, 128]);
});

test("hslToRgb([0,0,25])", () => {
    expect(hslToRgb([0, 0, 25])).toEqual([64, 64, 64]);
});

test("hslToRgb([0,0,75])", () => {
    expect(hslToRgb([0, 0, 75])).toEqual([191, 191, 191]);
});

test("hslToRgb([0, 100, 50])", () => {
    expect(hslToRgb([0, 100, 50])).toEqual([255, 0, 0]);
});

test("hslToRgb([240, 100, 50])", () => {
    expect(hslToRgb([240, 100, 50])).toEqual([0, 0, 255]);
});

test("hslToRgb([120, 100, 50])", () => {
    expect(hslToRgb([120, 100, 50])).toEqual([0, 255, 0]);
});

test("hslToRgb([60, 100, 50])", () => {
    expect(hslToRgb([60, 100, 50])).toEqual([255, 255, 0]);
});

test("hslToRgb([180, 100, 50])", () => {
    expect(hslToRgb([180, 100, 50])).toEqual([0, 255, 255]);
});

test("rgbToHex([0, 0, 0])", () => {
    expect(rgbToHex([0, 0, 0])).toEqual("#000000");
});

test("rgbToHex([255, 255, 255])", () => {
    expect(rgbToHex([255, 255, 255])).toEqual("#FFFFFF");
});

test("rgbToHex([255, 0, 0])", () => {
    expect(rgbToHex([255, 0, 0])).toEqual("#FF0000");
});

test("rgbToHex([0, 255, 0])", () => {
    expect(rgbToHex([0, 255, 0])).toEqual("#00FF00");
});

test("rgbToHex([0, 0, 255])", () => {
    expect(rgbToHex([0, 0, 255])).toEqual("#0000FF");
});

test("rgbToHex([255, 0, 255])", () => {
    expect(rgbToHex([255, 0, 255])).toEqual("#FF00FF");
});

test("rgbToHex([0, 255, 255])", () => {
    expect(rgbToHex([0, 255, 255])).toEqual("#00FFFF");
});

test("rgbToHex([255, 255, 0])", () => {
    expect(rgbToHex([255, 255, 0])).toEqual("#FFFF00");
});

test("rgbToHex([255, 0, 0])", () => {
    expect(rgbToHex([255, 0, 0])).toEqual("#FF0000");
});

test("rgbToHsl([0, 0, 0])", () => {
    expect(rgbToHsl([0, 0, 0])).toEqual([0, 0, 0]);
});

test("rgbToHsl([255, 255, 255])", () => {
    expect(rgbToHsl([255, 255, 255])).toEqual([0, 0, 100]);
});

test("rgbToHsl([255, 0, 0])", () => {
    expect(rgbToHsl([255, 0, 0])).toEqual([0, 100, 50]);
});

test("rgbToHsl([0, 255, 0])", () => {
    expect(rgbToHsl([0, 255, 0])).toEqual([120, 100, 50]);
});

test("rgbToHsl([0, 0, 255])", () => {
    expect(rgbToHsl([0, 0, 255])).toEqual([240, 100, 50]);
});

test("rgbToHsl([255, 0, 255])", () => {
    expect(rgbToHsl([255, 0, 255])).toEqual([300, 100, 50]);
});

test("rgbToHsl([0, 255, 255])", () => {
    expect(rgbToHsl([0, 255, 255])).toEqual([180, 100, 50]);
});

test("rgbToHsl([255, 255, 0])", () => {
    expect(rgbToHsl([255, 255, 0])).toEqual([60, 100, 50]);
});

test("toLinear(0.04045)", () => {
    expect(toLinear(0.04045)).toBeCloseTo(0.001368);
});

test("toLinear(0.0031308)", () => {
    expect(toLinear(0.0031308)).toBeCloseTo(0.00031308);
});

test("relativeLuminance([0, 0, 0])", () => {
    expect(relativeLuminance([0, 0, 0])).toBeCloseTo(0);
});

test("relativeLuminance([255, 255, 255])", () => {
    expect(relativeLuminance([255, 255, 255])).toBeCloseTo(1);
});

test("relativeLuminance([255, 0, 0])", () => {
    expect(relativeLuminance([255, 0, 0])).toBeCloseTo(0.2126);
});

test("relativeLuminance([0, 255, 0])", () => {
    expect(relativeLuminance([0, 255, 0])).toBeCloseTo(0.7152);
});

test("relativeLuminance([0, 0, 255])", () => {
    expect(relativeLuminance([0, 0, 255])).toBeCloseTo(0.0722);
});

test("relativeLuminance([255, 0, 255])", () => {
    expect(relativeLuminance([255, 0, 255])).toBeCloseTo(0.2848);
});

test("relativeLuminance([0, 255, 255])", () => {
    expect(relativeLuminance([0, 255, 255])).toBeCloseTo(0.7874);
});

test("relativeLuminance([255, 255, 0])", () => {
    expect(relativeLuminance([255, 255, 0])).toBeCloseTo(0.9278);
});

test("calculate([0, 0, 0], [255, 255, 255], 'large')", () => {
    expect(calculate([0, 0, 0], [255, 255, 255], "large").ratio).toBeCloseTo(21);
});

test("calculate([0, 0, 0], [255, 255, 255], 'small')", () => {
    expect(calculate([0, 0, 0], [255, 255, 255], "small").ratio).toBeCloseTo(21);
});

test("calculate([255, 255, 255], [0, 0, 0], 'large')", () => {
    expect(calculate([255, 255, 255], [0, 0, 0], "large").ratio).toBeCloseTo(21);
});

test("calculate([255, 255, 255], [0, 0, 0], 'small')", () => {
    expect(calculate([255, 255, 255], [0, 0, 0], "small").ratio).toBeCloseTo(21);
});

test("calculate([255, 0, 0], [0, 0, 0], 'large')", () => {
    expect(calculate([255, 0, 0], [0, 0, 0], "large").ratio).toBeCloseTo(5.252);
});

test("calculate([255, 0, 0], [0, 0, 0], 'small')", () => {
    expect(calculate([255, 0, 0], [0, 0, 0], "small").ratio).toBeCloseTo(5.252);
});

test("calculate([0, 0, 0], [255, 0, 0], 'large')", () => {
    expect(calculate([0, 0, 0], [255, 0, 0], "large").ratio).toBeCloseTo(5.252);
});

test("calculate([0, 0, 0], [255, 0, 0], 'small')", () => {
    expect(calculate([0, 0, 0], [255, 0, 0], "small").ratio).toBeCloseTo(5.252);
});

test("calculate([0, 0, 0], [0, 255, 0], 'large')", () => {
    expect(calculate([0, 0, 0], [0, 255, 0], "large").ratio).toBeCloseTo(15.303);
});

test("calculate([0, 0, 0], [0, 255, 0], 'small')", () => {
    expect(calculate([0, 0, 0], [0, 255, 0], "small").ratio).toBeCloseTo(15.303);
});

test("calculate([0, 0, 0], [0, 0, 255], 'large')", () => {
    expect(calculate([0, 0, 0], [0, 0, 255], "large").ratio).toBeCloseTo(2.444);
});