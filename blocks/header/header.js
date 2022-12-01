import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * collapses all open nav sections
 * @param {Element} sections The container element
 */

function collapseAllNavSections(sections) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', 'false');
  });
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

const BRAND_IMG = '<img loading="lazy" alt="Adobe" src="/blocks/header/tbx-logo.svg">';

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch nav content
  const navPath = cfg.nav || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.innerHTML = html;
    decorateIcons(nav);

    const classes = ['brand', 'sections', 'tools'];
    classes.forEach((e, j) => {
      const section = nav.children[j];
      if (section) section.classList.add(`nav-${e}`);
    });

    // look at URI path, look for relative and absolute links
    let navSections = nav.querySelector('div.nav-brand');
    navSections.querySelectorAll(':scope > p').forEach((p) => {
      const navSectionLink = p.querySelector('a');
      const gotoLink = new URL(navSectionLink.href);
      navSectionLink.href = gotoLink.pathname;
    });

    // decorate brand icon
    const brand = navSections.querySelector('a');
    navSections.insertAdjacentHTML('afterbegin', BRAND_IMG);

    navSections = nav.querySelector('div.nav-sections');
    navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
      const navSectionLink = navSection.querySelector('a');
      if (!navSectionLink.href.includes('#new-business')) { // new business is a special case, always anchor to footer
        const gotoLink = new URL(navSectionLink.href);
        navSectionLink.href = gotoLink.pathname;
      } else if (navSectionLink.href.includes('#new-business')) {
        // scroll to anchor
        navSectionLink.addEventListener('click', (e) => {
          e.preventDefault();
          // scroll to bottom of page
          document.getElementById('new-business').scrollIntoView({ behavior: 'smooth' });
        });
      }

      // nested navs
      /**
      if (navSections) {
        navSections.querySelectorAll(':scope > ul > li').forEach((navSection_) => {
          if (navSection_.querySelector('ul')) navSection_.classList.add('nav-drop');
          navSection_.addEventListener('click', () => {
            const expanded = navSection_.getAttribute('aria-expanded') === 'true';
            collapseAllNavSections(navSections);
            navSection_.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          });
        });
      }
       */

      // hamburger for mobile
      const hamburger = document.createElement('div');
      hamburger.classList.add('nav-hamburger');
      hamburger.innerHTML = '<div class="nav-hamburger-icon"></div>';
      hamburger.addEventListener('click', () => {
        const expanded = nav.getAttribute('aria-expanded') === 'true';
        document.body.style.overflowY = expanded ? '' : 'hidden';
        nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
      nav.prepend(hamburger);
      nav.setAttribute('aria-expanded', 'false');
      decorateIcons(nav);
      block.append(nav);
    });
  }
}
