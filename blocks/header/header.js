import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';
import { createTag, replaceElementType, loadScript } from '../../scripts/helpers.js';

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
  const DECONSTRUCTION_AMOUNT = 4;
  const sectionText = navSectionLink.innerHTML;

  const desktopRollingLink = navSectionLink.cloneNode(true);
  desktopRollingLink.innerHTML = '';
  desktopRollingLink.classList.add('deconstructed-text-wrapper', 'desktop-nav-link');
  // decorate nav-section decosntruct text
  for (let i = 0; i < DECONSTRUCTION_AMOUNT; i += 1) {
    const deconstructionTextWrapper = `<div class="deconstructed-text-item_0${i}">
                                              <div class="deconstructed-text-container_0${i}">
                                                <div class="deconstructed-text_0${i}">
                                                ${sectionText}
                                                </div>
                                              </div>
                                            </div>
                                          <div class="hidden-text">${sectionText}</div>`;
    desktopRollingLink.innerHTML += deconstructionTextWrapper;
  }

  navSection.append(desktopRollingLink);
}

function addRollingAnimationForDesktopNavLinks() {
  const deconstructedNavSections = document.getElementsByClassName('deconstructed-text-wrapper');
  [...deconstructedNavSections].forEach((section) => {
    const gsapAnimation = gsap
      .timeline({ paused: true })
      .addLabel('start')
      .to(section.querySelector('.deconstructed-text-item_00'), { y: '150%', duration: 0.7 }, 'start+=0.1')
      .to(section.querySelector('.deconstructed-text-container_00'), { height: 10, duration: 0.7 }, 'start+=0.1')
      .to(section.querySelector('.deconstructed-text-item_01'), { y: '100%', duration: 0.5 }, 'start')
      .to(section.querySelector('.deconstructed-text-container_01'), { height: '20px', duration: 0.4 }, 'start')
      .to(section.querySelector('.deconstructed-text_01'), { y: '85%', duration: 0.5 }, 'start')
      .to(section.querySelector('.deconstructed-text-item_02'), { y: '-50%', duration: 0.5 }, 'start+=0.1')
      .to(section.querySelector('.deconstructed-text-container_02'), { y: '46%', height: 20, duration: 0.5 }, 'start+=0.1')
      .to(section.querySelector('.deconstructed-text_02'), { y: '-40%', duration: 0.5 }, 'start+=0.1')
      .to(section.querySelector('.deconstructed-text-item_03'), { y: '-50%', duration: 0.5 }, 'start+=0.2')
      .to(section.querySelector('.deconstructed-text-container_03'), { y: '0%', height: 10, duration: 0.6 }, 'start+=0.2')
      .to(section.querySelector('.deconstructed-text_03'), { y: '0%', duration: 0.3 }, 'start+=0.2');

    section.addEventListener('mouseenter', () => {
      gsapAnimation.timeScale(1.3).play(0);
    });
  });
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

    // animation
    loadScript(`${window.hlx.codeBasePath}/scripts/gasp-3_11_3-min.js`, () => {
      addRollingAnimationForDesktopNavLinks();
    });
  }
}
