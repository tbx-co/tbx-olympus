import {
  sampleRUM,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './lib-franklin.js';
import { addNextSectionArrowButton } from './helpers.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'tbx-olympus'; // add your RUM generation information here

/**
 * Looks for a meta tag with the given name and returns styles the body background color
 * @param main
 */
function decoratePageTheme() {
  const theme = document.querySelector('meta[name="page-theme-color"]');
  if (theme) {
    document.body.style.backgroundColor = theme.getAttribute('content');
    document.getElementsByTagName('nav')[0].style.backgroundColor = theme.getAttribute('content');
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * loads everything that doesn't need to be delayed.
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? main.querySelector(hash) : false;
  if (hash && element) element.scrollIntoView();

  await loadHeader(doc.querySelector('header'));
  await loadFooter(doc.querySelector('footer'));

  decoratePageTheme();

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`, null);
  addFavIcon(`${window.hlx.codeBasePath}/assets/images/favicon-96x96.png`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * loads everything that happens a lot later, without impacting
 * the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

const observerOptions = {
  threshold: 0.10,
  rootMargin: '-10px 0px -10px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Window Resize Handler
let resizeTimer;
const resizeCompleteEvent = new CustomEvent('resizeComplete', (e) => {
  window.handleEvent(e.detail);
});
// dispatch custom resize event when a resize event has completed
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    window.dispatchEvent(resizeCompleteEvent);
  }, 250);
});

// add external script before body tag ends to ensure availability
export function addCDNScriptBeforeBodyEndTag(cdnLink) {
  const cdnScript = document.createElement('script');
  cdnScript.src = cdnLink;
  document.body.append(cdnScript);
}

// batch add external scripts
function addExternalCDNScripts() {
  const cdnLinks = ['https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/gsap.min.js', 'https://player.vimeo.com/api/player.js'];
  cdnLinks.forEach((link) => {
    addCDNScriptBeforeBodyEndTag(link);
  });
}

async function loadPage() {
  addExternalCDNScripts();
  await loadEager(document);
  await loadLazy(document);
  addNextSectionArrowButton();
  loadDelayed();
}

loadPage().then(() => {
  const sections = Array.from(document.getElementsByClassName('fadeup'));
  sections.forEach((section) => {
    observer.observe(section);
  });
});
