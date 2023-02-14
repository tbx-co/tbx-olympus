import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';
import {
  createTag,
  replaceAllChildElements,
  getCurrentYear,
} from '../../scripts/helpers.js';

function addSpanAndYearForCopyrightThinkingBoxText(footer) {
  const copyrightSection = footer.querySelector('.copyright > div > div');
  if (copyrightSection) {
    copyrightSection.className = 'copyright-inner-wrapper';
    const currentYear = getCurrentYear();
    const thinkingBoxText = `${copyrightSection.childNodes[0].nodeValue} ${currentYear}`;
    const thinkingBoxTextElement = createTag('span', {}, thinkingBoxText);
    const termsElement = copyrightSection.querySelector('a:first-child');
    const privacyElement = copyrightSection.querySelector('a:nth-child(2)');

    replaceAllChildElements(
      copyrightSection,
      thinkingBoxTextElement,
      termsElement,
      privacyElement,
    );
  }
}

function addMainContactID(footer) {
  const firstMainContact = footer.querySelector('.columns > div > div:first-child');
  const scrollToID = 'contact-us';
  if (firstMainContact) {
    firstMainContact.id = scrollToID;
  }
}

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';
  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footer = document.createElement('div');
  footer.classList += 'footer-section-wrapper fadeup';
  footer.innerHTML = html;

  addSpanAndYearForCopyrightThinkingBoxText(footer);

  addMainContactID(footer);

  await decorateIcons(footer);
  block.append(footer);
}
