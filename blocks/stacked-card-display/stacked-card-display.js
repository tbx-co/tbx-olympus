import { createOptimizedPicture } from "../../scripts/lib-franklin.js";

function optimizeImage(img) {
  return createOptimizedPicture(img.src, img.alt, true, [{ width: "640" }]);
}

// support both images & gifs
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = "stacked-cards-outer-wrapper";
    let cardTotal = row.children.length;

    [...row.children].forEach((div, index) => {
      if (div.querySelector("picture")) {
        div.className = `stacked-cards-wrapper item-${index}`;
        // style picture based on its index
        let zIndex = cardTotal - index;
        div.style.zIndex = zIndex;

        div
          .querySelectorAll("img")
          .forEach((img) =>
            img.closest("picture").replaceWith(optimizeImage(img))
          );
      }
    });
  });
}
