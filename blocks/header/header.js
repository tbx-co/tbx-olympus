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

    // relative header links from Google doc -> transform (very specific)
    let navSections = [...nav.children][0];
    navSections.querySelectorAll(':scope > p').forEach((p) => {
      const navSectionLink = p.querySelector('a');
      if (navSectionLink.href.includes('#')) {
        navSectionLink.href = '/';
      }
    });

    // eslint-disable-next-line prefer-destructuring
    navSections = [...nav.children][1];
    navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
      const navSectionLink = navSection.querySelector('a');
      if (navSectionLink.href.includes('#') && !navSectionLink.href.includes('#new-business')) {
        navSectionLink.href = navSectionLink.href.replace('#', '');
        // check for /home
        navSectionLink.href = navSectionLink.href.replace('/home', '/');
      }
    });

    // nested navs
    if (navSections) {
      navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        navSection.addEventListener('click', () => {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          collapseAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });
      });
    }

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
  }
}
