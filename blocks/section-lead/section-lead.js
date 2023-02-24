import {
  createTag, replaceAllChildElements,
} from '../../scripts/helpers.js';

export default function decorate(block) {
  if (block.children.children.length > 1) {
    [...block.children].forEach((row) => {
      row.className = 'section-lead__inner-wrapper';
    });
  } else {
    block.children[0].className = 'section-lead__inner-wrapper';
    const p = createTag('p', { class: '' }, block.children[0].children[0].textContent);
    replaceAllChildElements(block.children[0], p);
  }
}
