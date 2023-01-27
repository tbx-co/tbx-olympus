import { createOptimizedPicture } from "../../scripts/lib-franklin.js";

function optimizeImage(img) {
  return createOptimizedPicture(img.src, img.alt, true, [
    { media: "(min-width: 400px)", width: "2000" },
    { width: "750" },
  ]);
}

export default function decorate(block) {
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
         [...div.querySelectorAll("p")].forEach((p) => {
            if (p.textContent.toLowerCase().startsWith("description")) {
              p.className = "case-study-description";
              p.textContent = p.textContent.replace("Description:", "").trim();
            }
        });
      }
    });
  });
}
