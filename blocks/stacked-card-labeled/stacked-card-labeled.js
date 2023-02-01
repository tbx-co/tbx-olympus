import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { createTag, replaceAllChildElements } from '../../scripts/helpers.js';

function optimizeImage(img) {
  return createOptimizedPicture(img.src, img.alt, true, [{ width: '640' }]);
}

export default function decorate(block) {
  [...block.children].forEach((row, index) => {
    row.className = `stacked-card-labeled__card-wrapper item-${index}`;
    [...row.children].forEach((div) => {
      if (div.querySelector('picture')) {
        div.className = `stacked-card-labeled__card-image item-${index}`;
        div
          .querySelectorAll('img')
          .forEach((img) => img.closest('picture').replaceWith(optimizeImage(img)));
      } else {
        div.className = `stacked-card-labeled__card-label item-${index}`;
        const iconEl = div.querySelector('.icon');
        const labelText = div.innerText;
        const labelEl = createTag(
          'span',
          { class: 'stacked-card-labeled__card-label-text' },
          labelText,
        );
        replaceAllChildElements(div, iconEl, labelEl);
      }
    });
  });
}
