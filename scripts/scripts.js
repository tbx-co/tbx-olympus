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

function decorateIconPlaceholders(main) {
  main.querySelectorAll('span.icon').forEach((span) => {
    span.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateIconPlaceholders(main);
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

function addFadeUp() {
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

  const sections = Array.from(document.getElementsByClassName('fadeup'));
  sections.forEach((section) => {
    observer.observe(section);
  });
}

/**
 * loads everything that doesn't need to be delayed.
 */
async function loadLazy(doc) {
  addFadeUp();
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? main.querySelector(hash) : false;
  if (hash && element) element.scrollIntoView();

  await loadHeader(doc.querySelector('header'));
  await loadFooter(doc.querySelector('footer'));
  await decorateIcons(main);

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

async function loadPage() {
  // need vimeo available for vimeo block
  await loadEager(document);
  await loadLazy(document);
  addNextSectionArrowButton();
  loadDelayed();
}

loadPage();
