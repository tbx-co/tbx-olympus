import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * collapses all open nav sections
 * @param {Element} sections The container element
 */

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

// Window Resize Listener
let screenWidth = window.innerWidth;

const handleResizeComplete = () => {
  screenWidth = window.innerWidth;
};

window.addEventListener('resizeComplete', handleResizeComplete);
// window.removeEventListener("resizeComplete", handleResizeComplete);

const BRAND_IMG = screenWidth < 900
  ? '<img loading="lazy" alt="Adobe" src="/blocks/header/tbx-logo.svg">'
  : '<img loading="lazy" alt="Adobe" src="/blocks/header/tbx-logo.svg" class="invert-icon">';

// console.log(screenWidth);

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
    navSections.insertAdjacentHTML('afterbegin', BRAND_IMG);

    navSections = nav.querySelector('div.nav-sections');
    const DECONSTRUCTION_AMOUNT = 4;
    navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
      const navSectionLink = navSection.querySelector('a');
      const sectionText = navSectionLink.innerHTML;
      // if width is more than 900px
      if (window.screen.width > 900) {
        navSectionLink.innerHTML = '';
        navSectionLink.classList.add('deconstructed-text-wrapper');
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
          navSectionLink.innerHTML += deconstructionTextWrapper;
        }
      }
      if (!navSectionLink.href.includes('#new-business')) {
        // new business is a special case, always anchor to footer
        const gotoLink = new URL(navSectionLink.href);
        navSectionLink.href = gotoLink.pathname;
      } else if (navSectionLink.href.includes('#new-business')) {
        // scroll to anchor
        navSectionLink.addEventListener('click', (e) => {
          e.preventDefault();
          // scroll to bottom of page
          document
            .getElementById('new-business')
            .scrollIntoView({ behavior: 'smooth' });
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
    });
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
        .to(section.querySelector('.deconstructed-text_02'), { y: '-45%', duration: 0.5 }, 'start+=0.1')
        .to(section.querySelector('.deconstructed-text-item_03'), { y: '-50%', duration: 0.5 }, 'start+=0.2')
        .to(section.querySelector('.deconstructed-text-container_03'), { y: '0%', height: 10, duration: 0.6 }, 'start+=0.2')
        .to(section.querySelector('.deconstructed-text_03'), { y: '0%', duration: 0.3 }, 'start+=0.2');
      section.addEventListener('mouseenter', () => {
        gsapAnimation.timeScale(1.3).play(0);
      });
    });
  }
}
