import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function optimizeImage(img) {
  return createOptimizedPicture(
    img.src,
    img.alt,
    true,
    [{ media: '(min-width: 700px)', width: '700' }, { width: '360' }],
  );
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((div) => {
      if (div.querySelector('picture')) {
        // decorate img
        const frame = document.createElement('div');
        frame.className = 'statement-image-frame';
        div.parentNode.insertBefore(frame, div);
        frame.append(div);
        div.querySelectorAll('img')
          .forEach((img) => img.closest('picture')
            .replaceWith(optimizeImage(img)));
      } else {
        // decorate text
        div.className = 'statement-image-copy';
      }
    });
  });
}
