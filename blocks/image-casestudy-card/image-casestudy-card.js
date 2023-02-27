import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function optimizeImage(img) {
  return createOptimizedPicture(img.src, img.alt, true, [
    { media: '(min-width: 400px)', width: '2000' },
    { width: '750' },
  ]);
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // images
    [...row.children].forEach((div) => {
      if (div.querySelector('picture')) {
        const divFrame = document.createElement('div');
        divFrame.className = 'image-casestudy-card-image-frame';
        div.parentNode.insertBefore(divFrame, div);
        divFrame.append(div);

        div
          .querySelectorAll('img')
          .forEach((img) => img.closest('picture').replaceWith(optimizeImage(img)));
      }
    });
  });
}
