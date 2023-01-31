import { createOptimizedPicture } from "../../scripts/lib-franklin.js";
import {
  addSectionLayoutClassToParentSection,
  trimTextAndUpdateClassOfElementArray,
} from "../../scripts/helpers.js";

function optimizeImage(img) {
  return createOptimizedPicture(img.src, img.alt, true, [
    { media: "(min-width: 400px)", width: "2000" },
    { width: "750" },
  ]);
}

export default function decorate(block) {
  addSectionLayoutClassToParentSection(block);

  [...block.children].forEach((row) => {
    [...row.children].forEach((div) => {
      if (div.querySelector("picture")) {
        div.className = "case-study-logo";
        const divFrame = document.createElement("div");
        divFrame.className = "case-study-logo-image-frame";
        div.parentNode.insertBefore(divFrame, div);
        divFrame.append(div);
        div
          .querySelectorAll("img")
          .forEach((img) =>
            img.closest("picture").replaceWith(optimizeImage(img))
          );
      } else {
        div.className = "case-study-copy";
        let updateConditions = [
          {
            prefixText: "eyebrow",
            className: "case-study-eyebrow",
            textToBeTrimmed: "Eyebrow:",
          },
          {
            prefixText: "description",
            className: "case-study-description",
            textToBeTrimmed: "Description:",
          },
        ];
        let targetElementArray = [...div.querySelectorAll("p")];
        trimTextAndUpdateClassOfElementArray(
          targetElementArray,
          updateConditions
        );
      }
    });
  });
}
