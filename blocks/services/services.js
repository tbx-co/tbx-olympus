import { createTag, replaceAllChildElements } from '../../scripts/helpers.js';

// desktop handling
function removeCurrentActiveClass(servicesLeftWrapper, servicesRightWrapper) {
  [...servicesLeftWrapper.children].forEach((title) => {
    title.classList.remove('active');
  });
  [...servicesRightWrapper.children].forEach((content) => {
    content.classList.remove('visible');
  });
}

function addShowActiveItemFunction(servicesLeftWrapper, servicesRightWrapper) {
  [...servicesLeftWrapper.children].forEach((title, index) => {
    title.addEventListener('click', () => {
      removeCurrentActiveClass(servicesLeftWrapper, servicesRightWrapper);
      title.classList.add('active');
      servicesRightWrapper.children[index].classList.add('visible');
    });
  });

  [...servicesLeftWrapper.children][0].click();
}

// mobile handling
function removeCurrentActiveAccordion(accordionButtons) {
  [...accordionButtons].forEach((btn) => {
    if (btn.classList.contains('active')) {
      btn.click();
    }
  });
}

function makeFirstAccordionActive(accordionButtons, accordionPanels) {
  const firstAccordion = accordionButtons[0];
  const firstPanel = accordionPanels[0];
  firstAccordion.classList.add('active');
  firstPanel.style.maxHeight = 'none';
}

function addShowAccordionFunction() {
  const accordionButtons = document.getElementsByClassName('services__accordion__button');

  const accordionPanels = document.querySelectorAll('.services__accordion__content-panel');

  [...accordionButtons].forEach((btn, index) => {
    btn.addEventListener('click', () => {
      removeCurrentActiveAccordion(accordionButtons);

      btn.classList.toggle('active');
      const targetPanel = accordionPanels[index];
      if (targetPanel.style.maxHeight) {
        targetPanel.style.maxHeight = null;
      } else {
        targetPanel.style.maxHeight = `${targetPanel.scrollHeight}px`;
      }
    });
  });

  makeFirstAccordionActive(accordionButtons, accordionPanels);
}

export default function decorate(block) {
  const servicesLeftWrapper = createTag('div', { class: 'services__left-title-wrapper' }, '');
  const servicesRightWrapper = createTag('div', { class: 'services__right-content-wrapper' }, '');

  const servicesAccordion = createTag('div', { class: 'services__accordion-mobile-wrapper' }, '');

  [...block.children].forEach((row, index) => {
    [...row.children].forEach((div) => {
      if (div.querySelector('h1, h2')) {
        const title = div.querySelector('h1, h2');
        title.classList.add('services__left-title-wrapper__title');

        // desktop title
        servicesLeftWrapper.append(title);

        // mobile accordion title button
        const mobileTitle = title.cloneNode(true);
        const serviceAccordionButton = createTag('button', { class: 'services__accordion__button' }, '');
        serviceAccordionButton.append(mobileTitle);
        servicesAccordion.append(serviceAccordionButton);
      } else {
        const content = div;
        content.className = 'services__content-wrapper desktop';

        // first element is visible by default
        if (index === 0) {
          content.classList.add('visible');
        }
        servicesRightWrapper.append(content);

        // mobile accordion content panel
        const serviceAccordionPanel = createTag('div', { class: 'services__accordion__content-panel' }, '');
        const mobileContent = content.cloneNode(true);
        mobileContent.className = 'services__content-wrapper mobile';
        serviceAccordionPanel.appendChild(mobileContent);
        servicesAccordion.append(serviceAccordionPanel);
      }
    });
  });

  // replace with new mobile and desktop element
  const servicesDesktopWrapper = createTag('div', { class: 'services__desktop-wrapper' }, '');
  replaceAllChildElements(servicesDesktopWrapper, servicesLeftWrapper, servicesRightWrapper);
  replaceAllChildElements(block, servicesDesktopWrapper, servicesAccordion);

  // desktop handling (900px up)
  addShowActiveItemFunction(servicesLeftWrapper, servicesRightWrapper);

  // mobile handling (900px down)
  addShowAccordionFunction();
}
