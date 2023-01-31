import { createOptimizedPicture } from "../../scripts/lib-franklin.js";
import { createTag, replaceAllChildElements } from "../../scripts/helpers.js";

function optimizeImage(img) {
  return createOptimizedPicture(img.src, img.alt, true, [
    { media: "(min-width: 400px)", width: "2000" },
    { width: "750" },
  ]);
}

export default function decorate(block) {
  [...block.children].forEach((row, index) => {
    row.className = `stacked-card-labeled__card-wrapper item-${index}`;
    [...row.children].forEach((div) => {
      if (div.querySelector("picture")) {
        div.className = `stacked-card-labeled__card-image item-${index}`;
      } else {
        div.className = `stacked-card-labeled__card-label item-${index}`;
        let iconEl = div.querySelector(".icon");
        let labelText = div.innerText;
        let labelEl = createTag(
          "span",
          { class: "stacked-card-labeled__card-label-text" },
          labelText
        );
        replaceAllChildElements(div, iconEl, labelEl);
      }
    });
  });
}
