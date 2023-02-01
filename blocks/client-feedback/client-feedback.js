import { createOptimizedPicture } from "../../scripts/lib-franklin.js";
import { trimTextAndUpdateClassOfElementArray } from "../../scripts/helpers.js";

function optimizeImage(img) {
  return createOptimizedPicture(img.src, img.alt, true, [{ width: "300" }]);
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = "client-feedback__wrapper";
    [...row.children].forEach((div) => {
      if (div.querySelector("picture")) {
        div.className = "client-feedback__image";
        div
          .querySelectorAll("img")
          .forEach((img) =>
            img.closest("picture").replaceWith(optimizeImage(img))
          );
      } else {
        div.className = "client-feedback__copy";
        let updateConditions = [
          {
            prefixText: "feedback",
            className: "client-feedback__copy-feedback",
            textToBeTrimmed: "Feedback:",
          },
          {
            prefixText: "client",
            className: "client-feedback__copy-client",
            textToBeTrimmed: "Client:",
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
