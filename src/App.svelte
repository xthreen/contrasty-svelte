<script lang="ts">
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import {
    hexToRgb,
    rgbToHex,
    rgbToHsl,
    hslToRgb,
    calculate,
  } from "./lib/contrast-utils";
  import "./app.css";

  let rgbOne = writable([255, 255, 255]);
  let rgbTwo = writable([0, 0, 0]);
  let textSize = writable("large");
  let ratio = writable(0);
  let isAccessible = writable(false);
  let asValOne = writable("Hex");
  let asValTwo = writable("Hex");

  $: maxWidth = window.innerWidth;

  onMount(() => {
    refreshContrast();
  });

  function handleOutputConversion(rgb: number[], asVal: string) {
    switch (asVal) {
      case "Hex":
        return rgbToHex(rgb);
      case "RGB":
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      case "HSL":
        return `hsl(${rgbToHsl(rgb)[0]}, ${rgbToHsl(rgb)[1].toPrecision(
          3
        )}%, ${rgbToHsl(rgb)[2].toPrecision(3)}%)`;
    }
  }

  function refreshContrast() {
    const result = calculate($rgbOne, $rgbTwo, $textSize);
    $ratio = parseFloat(result.ratio.toFixed(3));
    $isAccessible = result.isAccessible;
  }

  function handleRgbValue(asVal: string, element: HTMLInputElement) {
    switch (asVal) {
      case "RGB":
        const rgbRegex = /r?g?b?\(?(\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?/;
        const rgbMatch = element.value.match(rgbRegex);
        if (rgbMatch) {
          return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
        }
        break;
      case "HSL":
        const hslRegex = /h?s?l?\(?(\d{1,3}), ?(\d{1,3}\.\d{1,2})%, ?(\d{1,3}\.\d{1,2})%\)?/;
        const hslMatch = element.value.match(hslRegex);
        if (hslMatch) {
          return hslToRgb([parseInt(hslMatch[1]), parseFloat(hslMatch[2]), parseFloat(hslMatch[3])]);
        }
        break;
      default:
        return hexToRgb(element.value);
    }
  }

  function handleRgbEvent(event: Event) {
    const element = (event.target as HTMLInputElement);
    if (element.id === "rgbOne") {
        $rgbOne = handleRgbValue($asValOne, element);
    } else {
        $rgbTwo = handleRgbValue($asValTwo, element);
    }
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

<svelte:window bind:innerWidth={maxWidth} />
<h1 class="banner">Text Contrast Accessibility</h1>
<main class="main-grid">
  <div class="color-selector">
    <label for="colorSelect" class="selector-label">Text Size</label>
    <select
      id="colorSelect"
      name="colorSelect"
      class="selector-inner"
      on:change={setTextSize}
    >
      <option value="large">Large Text</option>
      <option value="small">Small Text</option>
    </select>
  </div>
  <article class="rgb-one" id="test-text">
    <h2>Text Color</h2>
    <div class="inner-container">
      <input
        type="color"
        id="rgbOne"
        name="rgbOne"
        value={rgbToHex($rgbOne)}
        on:input={handleRgbEvent}
      />
      <div class="output-rgb" id="test-text">
        <label class="output-label" for="rgbOneDisplay">Value</label>
        <input
          type="text"
          id="rgbOneDisplay"
          name="rgbOneDisplay"
          value={handleOutputConversion($rgbOne, $asValOne)}
          on:change={handleRgbEvent}
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
  {#if maxWidth > 1200} <div class="divider" /> {/if}
  <article class="rgb-two" id="test-bg">
    <h2>Background Color</h2>
    <div class="inner-container">
      <input
        type="color"
        id="rgbTwo"
        name="rgbTwo"
        value={rgbToHex($rgbTwo)}
        on:input={handleRgbEvent}
      />
      <div class="output-rgb" id="test-bg">
        <label class="output-label" for="rgbTwoDisplay">Value</label>
        <input
          type="text"
          id="rgbTwoDisplay"
          name="rgbTwoDisplay"
          value={handleOutputConversion($rgbTwo, $asValTwo)}
          on:change={handleRgbEvent}
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
    {#if maxWidth > 1200}
      <span id="lorem" style="color: {rgbToHex($rgbOne)}"
        >"Lorem ipsum dolor sit amet consectetur adipisicing elit..."</span
      >
    {:else}
      <span id="lorem" style="color: {rgbToHex($rgbOne)}">"Lorem ipsum..."</span
      >
    {/if}
  </article>
</main>
<footer>
  <p id="lineRatio">Contrast Ratio: <span id="ratio">{$ratio}</span></p>
  <p id="lineAccessible">
    Is Accessible: <span
      id="isAccessible"
      style="color: {$isAccessible ? '#00ff00' : '#ff0000'}"
      >{$isAccessible}</span
    >
  </p>
</footer>
