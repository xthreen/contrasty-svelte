<!--
Simple project: reproduce colors.html and extend its functionality using svelte!

colors.html is a simple html5 page with a handful of javascript functions which renders a select, two color pickers,
and some text. The text displays the contrast ratio of the two colors currently selected and whether or not that ratio
is accessible according to WCAG 2.0 guidelines. The acceptable ratio used is dependant on the text-size option selected
from the select element.

Developer story:
    - I should not import any other components or libraries.
    - What I need to do should be possible with the standard svelte library, html5 and css.
    - colors.html implements most of the user story below, except for clipboard functionality.
    - this app should ultimately be more elegant than colors.html, even if every part is written in this one file.

User story:
    - As a user, I want to be able to select from two colors and see the contrast ratio between them.
    - As a user, I want to be able to clearly see the RGB, HSL, and Hex values of the colors I select.
        - I should be able to see these values update in real time as I select colors.
    - As a user, I want to be able to see if the contrast ratio is acceptable according to WCAG 2.0 guidelines.
    - As a user, I want to be able to select a text size, and see if the contrast ratio is acceptable for that text size.
    - As a user, I want to be able to see the contrast ratio in real time as I select colors.
    - As a user, I want to be able to see the results change in real time as I select a text size.
    - As a user, I want to be able to select, copy, and paste color values from/into the color pickers.
        - I should be able to paste a color value into either color picker.
        - I should be able to paste RGB, HSL and Hex values.
-->
<script lang="ts">
    import {writable} from "svelte/store";
    import {onMount} from "svelte";
    import './app.css';

    let rgbOne = writable([255, 255, 255]);
    let rgbTwo = writable([0, 0, 0]);
    let textSize = writable("large");
    let ratio = writable(0);
    let isAccessible = writable(false);
    let lorem = writable("Lorem ipsum dolor sit amet consectetur adipisicing elit...");
    let asValOne = writable("Hex");
    let asValTwo = writable("Hex");

    onMount(() => {
        refreshContrast();
    });

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
        return "#" + rgb.map((x) => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("").toUpperCase();
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

    function handleOutputConversion(rgb: number[], asVal: string) {
        switch (asVal) {
            case "Hex":
                return rgbToHex(rgb);
            case "RGB":
                return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
            case "HSL":
                return `hsl(${rgbToHsl(rgb)[0]}, ${rgbToHsl(rgb)[1].toPrecision(3)}%, ${rgbToHsl(rgb)[2].toPrecision(3)}%)`;
        }
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

    function refreshContrast() {
        const result = calculate($rgbOne, $rgbTwo, $textSize);
        $ratio = parseFloat(result.ratio.toFixed(3));
        $isAccessible = result.isAccessible;
    }

    function setRgbOne(event: Event) {
        $rgbOne = hexToRgb((event.target as HTMLInputElement).value);
        refreshContrast();
    }

    function setRgbTwo(event: Event) {
        $rgbTwo = hexToRgb((event.target as HTMLInputElement).value);
        refreshContrast();
    }

    function setTextSize(event: Event) {
        $textSize = (event.target as HTMLSelectElement).value;
        refreshContrast();
    }

    function handleOutputSelect(event: Event) {
        const select = event.target as HTMLSelectElement;
        if (select.parentElement?.id === "test-text") {
            $asValOne = select.value;
        } else {
            $asValTwo = select.value;
        }
    }
</script>

<h1 class="banner">Text Contrast Accessibility</h1>
<div class="container">
    <main class="main-grid">
        <div class="color-selector">
            <label for="colorSelect" class="selector-label">Text Size</label>
            <select id="colorSelect" name="colorSelect" class="selector-inner" on:change={setTextSize}>
                <option value="large">Large Text</option>
                <option value="small">Small Text</option>
            </select>
        </div>
        <article class="rgb-one" id="test-text">
            <h2>Text Color</h2>
            <div class="inner-container">
                <input type="color" id="rgbOne" name="rgbOne" value={rgbToHex($rgbOne)} on:input={setRgbOne}/>
                <div class="output-rgb" id="test-text">
                    <label class="output-label" for="rgbOneDisplay">Value</label>
                    <input
                            type="text"
                            id="rgbOneDisplay"
                            name="rgbOneDisplay"
                            value={handleOutputConversion($rgbOne, $asValOne)}
                            on:change={setRgbOne}
                            class="output-inner"
                        />
                    <select on:change={handleOutputSelect}>
                        <option value="Hex">Hex</option>
                        <option value="RGB">RGB</option>
                        <option value="HSL">HSL</option>
                    </select>
                </div>
            </div>
        </article>
        <div class="divider"></div>
        <article class="rgb-two" id="test-bg">
            <h2>Background Color</h2>
            <div class="inner-container">
                <input type="color" id="rgbTwo" name="rgbTwo" value={rgbToHex($rgbTwo)} on:input={setRgbTwo}/>
                <div class="output-rgb" id="test-bg">
                    <label class="output-label" for="rgbTwoDisplay">Value</label>
                    <input
                            type="text"
                            id="rgbTwoDisplay"
                            name="rgbTwoDisplay"
                            value={handleOutputConversion($rgbTwo, $asValTwo)}
                            on:change={setRgbTwo}
                            class="output-inner"
                    />
                    <select on:change={handleOutputSelect}>
                        <option value="Hex">Hex</option>
                        <option value="RGB">RGB</option>
                        <option value="HSL">HSL</option>
                    </select>
                </div>
            </div>
        </article>
        <article id="lorem-bg" style="background-color: {rgbToHex($rgbTwo)}">
        <span id="lorem" style="color: {rgbToHex($rgbOne)}"
        >{$lorem}</span
        >
        </article>
    </main>
    <footer>
        <p id="lineRatio">Contrast Ratio: <span id="ratio">{$ratio}</span></p>
        <p id="lineAccessible">
            Is Accessible: <span id="isAccessible">{$isAccessible}</span>
        </p>
    </footer>
</div>