import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function optimizeImage(img) {
  return createOptimizedPicture(
    img.src,
    img.alt,
    true,
    [{ media: '(min-width: 400px)', width: '750' }, { width: '2000' }],
  );
}
export default function decorate(block) {
  [...block.children].forEach((container) => {
    [...container.children].forEach((div) => {
      if (div.querySelector('picture')) {
        const divFrame = document.createElement('div');
        divFrame.className = 'project-card-image-frame';
        div.parentNode.insertBefore(divFrame, div);
        divFrame.append(div);
        div.querySelectorAll('img')
          .forEach((img) => img.closest('picture')
            .replaceWith(optimizeImage(img)));
      } else {
        div.className = 'project-card-copy';
        [...div.querySelectorAll('p')].forEach((p) => {
          if (p.textContent.toLowerCase().startsWith('title')) {
            // out title item
            p.className = 'project-card-title';
            p.textContent = p.textContent.replace('Title:', '').trim();
          } else if (p.textContent.toLowerCase().startsWith('description')) {
            // out description item
            p.className = 'project-card-description';
            p.textContent = p.textContent.replace('Description:', '').trim();
          }
        });
      }
    });
  });
}
