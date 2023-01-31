import { readBlockConfig, decorateIcons } from "../../scripts/lib-franklin.js";
import {
  createTag,
  replaceAllChildElements,
  getCurrentYear,
} from "../../scripts/helpers.js";

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

function addSpanAndYearForCopyrightThinkingBoxText(footer) {
  let copyrightSection = footer.querySelector(".copyright > div > div");
  copyrightSection.className = "copyright-inner-wrapper";
  let currentYear = getCurrentYear();
  let thinkingBoxText =
    copyrightSection.childNodes[0].nodeValue + ` ${currentYear}`;
  let thinkingBoxTextElement = createTag("span", {}, thinkingBoxText);
  let termsElement = copyrightSection.querySelector("a:first-child");
  let privacyElement = copyrightSection.querySelector("a:nth-child(2)");

  replaceAllChildElements(
    copyrightSection,
    thinkingBoxTextElement,
    termsElement,
    privacyElement
  );
}

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = "";

  const footerPath = cfg.footer || "/footer";
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footer = document.createElement("div");
  footer.classList += "footer-section-wrapper fadeup";
  footer.innerHTML = html;

  addSpanAndYearForCopyrightThinkingBoxText(footer);

  await decorateIcons(footer);
  block.append(footer);
}
