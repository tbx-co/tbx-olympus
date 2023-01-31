import { trimTextAndUpdateClassOfElementArray } from "../../scripts/helpers.js";

export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = "client-feedback__wrapper";
    [...row.children].forEach((div) => {
      if (div.querySelector("picture")) {
        div.className = "client-feedback__image";
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
