import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';
import { createTag, replaceElementType } from '../../scripts/helpers.js';

/**
 * collapses all open nav sections
 * @param {Element} sections The container element
 */

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

const BRAND_IMG = '<img loading="lazy" alt="Adobe" src="/blocks/header/tbx-logo.svg">';

function addClassToNavInnerSection(nav) {
  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((e, j) => {
    const section = nav.children[j];
    if (section) section.classList.add(`nav-${e}`);
  });
}

function updateNavBrandWithHomeLink(nav) {
  const navBrandWrapper = nav.querySelector('.nav-brand');
  if (navBrandWrapper) {
    const navBrandWrapperLink = replaceElementType(navBrandWrapper, 'a');
    navBrandWrapperLink.href = '/';
  }
}

function addMobileHamburgerToggleButton(nav, block) {
  // create hamburger icon
  const hamburgerLineClass = 'nav-hamburger-icon__line';
  const hamburgerLineOne = `<div class="${hamburgerLineClass} top"></div>`;
  const hamburgerLineTwo = `<div class="${hamburgerLineClass} middle"></div>`;
  const hamburgerLineThree = `<div class="${hamburgerLineClass} bottom"></div>`;
  const hamburgerIcon = `<div class="nav-hamburger-icon"> ${hamburgerLineOne} ${hamburgerLineTwo} ${hamburgerLineTwo} ${hamburgerLineThree} </div>`;

  const hamburger = createTag('div', { class: 'nav-hamburger' }, hamburgerIcon);

  // add toggle functionality
  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    document.body.classList.toggle('scroll-disable');
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  });
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  decorateIcons(nav);
  block.append(nav);
}

function addScrollToBottomForContactLink(nav) {
  const navSectionLinks = nav.querySelectorAll('a');

  // contact is a special case, always anchor to footer
  navSectionLinks.forEach((navSectionLink) => {
    if (!navSectionLink.href.includes('#contact-us')) {
      const gotoLink = new URL(navSectionLink.href);
      navSectionLink.href = gotoLink.pathname;
    } else if (navSectionLink.href.includes('#contact-us')) {
      // scroll to bottom of page for desktop only
      if (navSectionLink.className.includes('desktop-nav-link')) {
        navSectionLink.addEventListener('click', (e) => {
          e.preventDefault();
          document
            .getElementById('contact-us')
            .scrollIntoView({ behavior: 'smooth' });
        });
      }
    }
  });
}

function closeMobileMenuWhenLinkIsOnSamePage(nav) {
  const mobileMenuLinks = nav.querySelectorAll('.mobile-nav-link');
  const mobileMenuButton = nav.querySelector('.nav-hamburger');
  mobileMenuLinks.forEach((link) => {
    if (link.href.includes('#')) {
      link.addEventListener('click', () => {
        mobileMenuButton.click();
      });
    }
  });
}

function closeMobileMenuWhenResizeBackToMobile(nav) {
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      if (nav.getAttribute('aria-expanded') === 'true') {
        const mobileMenuButton = nav.querySelector('.nav-hamburger');
        mobileMenuButton.click();
      }
    }
  });
}

function addDesktopNavLink(navSectionLink, navSection) {
  const sectionText = navSectionLink.innerHTML;

  const desktopNavLink = navSectionLink.cloneNode(true);
  desktopNavLink.classList.add('desktop-nav-link');
  desktopNavLink.innerHTML = '';

  if (document.URL === desktopNavLink.href) desktopNavLink.classList.add('active');

  const span = document.createElement('span');
  span.innerHTML = sectionText;
  desktopNavLink.appendChild(span);

  navSection.append(desktopNavLink);
}

// ------------------------- MAIN FUNCTION HERE -------------------------
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

    // add .nav-hamburger, .nav-brand, .nav-sections
    addClassToNavInnerSection(nav);

    // add brand icon
    let navSections = nav.querySelector('div.nav-brand');
    navSections.insertAdjacentHTML('afterbegin', BRAND_IMG);
    updateNavBrandWithHomeLink(nav);

    // add hamburger for mobile menu
    addMobileHamburgerToggleButton(nav, block);

    // add desktop nav-links + mobile nav-link class
    navSections = nav.querySelector('div.nav-sections');
    navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
      const navSectionLink = navSection.querySelector('a');
      addDesktopNavLink(navSectionLink, navSection);

      // add mobile class to allow hiding of links
      navSectionLink.classList.add('mobile-nav-link');
    });

    addScrollToBottomForContactLink(nav);

    // mobile menu behavior
    closeMobileMenuWhenLinkIsOnSamePage(nav);
    closeMobileMenuWhenResizeBackToMobile(nav);
  }
}
