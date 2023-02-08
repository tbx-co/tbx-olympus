import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function optimizeImage(img) {
  return createOptimizedPicture(img.src, img.alt, true, [
    { media: '(min-width: 400px)', width: '2000' },
    { width: '750' },
  ]);
}

// support both images & gifs
export default function decorate(block) {
  [...block.children].forEach((row, index) => {
    row.className = `stacked-card-desktop__card-wrapper item-${index}`;

    [...row.children].forEach((div, i) => {
      if (div.querySelector('picture')) {
        div.className = `stacked-card-desktop__image item-${i}`;
        div
          .querySelectorAll('img')
          .forEach((img) => img.closest('picture').replaceWith(optimizeImage(img)));
      }
    });
  });
}
