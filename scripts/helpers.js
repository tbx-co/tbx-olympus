/**
 * Replace element type. ex) <p> -> <div>
 * @param {Element} el The original element that subject to replace.
 * @param {string} type The nodeName to be set for el.
 * @returns newEl Updated Element
 */
export const replaceElementType = (el, type) => {
  // If they are same, no need to replace.
  if (el === null || el.nodeName === type.toUpperCase()) {
    return el;
  }
  const newEl = document.createElement(type);
  newEl.innerHTML = el.innerHTML;
  el.parentNode.replaceChild(newEl, el);
  // copy all attributes from el to newEl
  [...el.attributes].forEach((attr) => newEl.setAttribute(attr.nodeName, attr.nodeValue));
  return newEl;
};

/**
 * Create an element with ID, class, children, and attributes
 * @param {String} tag the tag nav of the element
 * @param {Object} attributes the attributes of the tag
 * @param {HTMLElement} html the content of the element
 * @returns {HTMLElement} the element created
 */
export function createTag(tag, attributes, html) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement) {
      el.append(html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      el.setAttribute(key, attributes[key]);
    });
  }
  return el;
}

// replace ALL innerHTML of the parentElement with childNodes {HTMLElement} provided
export function replaceAllChildElements(parentElement, ...childNodes) {
  if (parentElement && childNodes) {
    parentElement.innerHTML = '';
    childNodes.forEach((child) => {
      parentElement.append(child);
    });
  }
}

// trim element text & update className of element
// e.g. <p>Title: xxxx</p> --> <p class="classname-provided">xxxx</p>
export function trimElementTextAndUpdateClass(
  element = null,
  prefixText = '',
  className = '',
  textToBeTrimmed = '',
) {
  if (element.textContent && prefixText.length > 0) {
    if (element.textContent.toLowerCase().startsWith(prefixText)) {
      element.className += className;
      element.textContent = element.textContent
        .replace(textToBeTrimmed, '')
        .trim();
    }
  }
}

// see client-feedback.js for example use
// elementArray = HTMLElement[]
// conditions = [{prefixText: '', className: '', textToBeTrimmed: ''}]
export function trimTextAndUpdateClassOfElementArray(elementArray, conditions) {
  if (elementArray.length && conditions.length) {
    elementArray.forEach((el) => {
      conditions.forEach((cond) => {
        trimElementTextAndUpdateClass(
          el,
          cond.prefixText,
          cond.className,
          cond.textToBeTrimmed,
        );
      });
    });
  }
}

// add specific class [starts with section-layout-] to parent section if
// specific class exist inside the block for easier styling
export function addSectionLayoutClassToParentSection(blockElement) {
  const sectionClassSpecificPrefix = 'section-layout-';
  if (!blockElement.className.includes(sectionClassSpecificPrefix)) {
    return;
  }

  blockElement.classList.forEach((className) => {
    if (className.startsWith(sectionClassSpecificPrefix)) {
      const parentSection = blockElement.closest('.section');
      parentSection.className += ` ${className}`;
    }
  });
}

// add an extra div to wrap around children blocks if there are more than one
// children inside a section, i.e.
// <div class="section">
//     <div class="blocks-wrapper"> ...children </div>
// </div>
export function addSectionInnerWrapperDiv(blockElement) {
  const parentSection = blockElement.closest('.section');
  const childrenDivs = parentSection.children;
  if (childrenDivs.length <= 1) {
    return;
  }

  const innerWrapperDiv = createTag('div', { class: 'blocks-wrapper' }, '');
  [...parentSection.children].forEach((child) => innerWrapperDiv.appendChild(child));
  parentSection.append(innerWrapperDiv);
}

export function getCurrentYear() {
  return new Date().getFullYear();
}
