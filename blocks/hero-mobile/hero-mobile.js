import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function optimizeImage(img) {
  return createOptimizedPicture(
    img.src,
    img.alt,
    true,
    [{ media: '(min-width: 400px)', width: '2000' }, { width: '750' }],
  );
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // images
    [...row.children].forEach((div) => {
      if (div.querySelector('picture')) {
        const image = document.createElement('div');
        image.className = 'hero-mobile-image-frame';
        div.parentNode.insertBefore(image, div);
        image.append(div);

        div.querySelectorAll('img')
          .forEach((img) => img.closest('picture')
            .replaceWith(optimizeImage(img)));
      } else {
        div.className = 'hero-mobile-copy';
      }
    });
  });
}