import {
  sampleRUM,
  buildBlock,
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

const LCP_BLOCKS = []; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'tbx-olympus'; // add your RUM generation information here

function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (
    h1
    && picture
    && h1.compareDocumentPosition(picture) && Node.DOCUMENT_POSITION_PRECEDING
  ) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

// TODO: previous custom cursor function not finishing up yet
// TODO: remove later in codebase if not in use
// function mouseMove(evt) {
//   let scrollHeight = 0;
//   window.addEventListener('scroll', (event) => {
//     scrollHeight = window.scrollY;
//   });
//   const mouseX = evt.clientX;
//   const mouseY = evt.clientY;
//   gsap.to('.shape', {
//     x: mouseX,
//     y: mouseY + scrollHeight,
//     rotation: -50,
//     stagger: -0.02,
//   });
// }

// function buildCursorTakeover() {
//   const shapes = document.createElement('div');
//   shapes.className = 'shapes';
//   shapes.innerHTML = `<div class="shape shape-1"></div>
//                     <div class="shape shape-2"></div>
//                     <div class="shape shape-3"></div>`;
//   document.body.append(shapes);
//   window.addEventListener('mousemove', (evt) => {
//     mouseMove(evt);
//   });
// }

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
// eslint-disable-next-line no-unused-vars
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

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
  // buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  // buildCursorTakeover();   // TODO: remove later if not in use
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
  threshold: 0.25,
  rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

export function initIntersectionObserver({ sections, callback, options = {} }) {
  const intersectionObserver = new IntersectionObserver((entries, ob) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry.target, entry);
        ob.unobserve(entry.target);
      }
    });
  }, options);

  intersectionObserver.observe(sections);
  return intersectionObserver;
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

// add external script before body tag ends to ensure availability
export function addCDNScriptBeforeBodyEndTag(cdnLink) {
  const cdnScript = document.createElement('script');
  cdnScript.src = cdnLink;
  document.body.append(cdnScript);
}

// batch add external scripts
function addExternalCDNScripts() {
  const cdnLinks = ['https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/gsap.min.js'];
  cdnLinks.forEach((link) => {
    addCDNScriptBeforeBodyEndTag(link);
  });
}

async function loadPage() {
  addExternalCDNScripts();
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage().then(() => {
  const sections = Array.from(document.getElementsByClassName('fadeup'));
  sections.forEach((section) => {
    observer.observe(section);
  });
});
