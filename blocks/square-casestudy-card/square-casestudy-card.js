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
        divFrame.className = 'square-casestudy-card-image-frame';
        div.parentNode.insertBefore(divFrame, div);
        divFrame.append(div);

        div
          .querySelectorAll('img')
          .forEach((img) => img.closest('picture').replaceWith(optimizeImage(img)));
      } else {
        div.className = 'square-casestudy-card-copy';
        [...div.querySelectorAll('p')].forEach((p) => {
          if (p.textContent.toLowerCase().startsWith('tags')) {
            // out tags item
            p.className = 'square-casestudy-card-tags';
            let tags = p.textContent.replace('Tags:', '').trim();
            tags = tags.split(',').map((tag) => tag.trim());
            p.textContent = '';
            tags.forEach((tag) => {
              const tagElement = document.createElement('span');
              tagElement.className = 'square-casestudy-card-tag';
              tagElement.textContent = tag;
              p.append(tagElement);
            });
          } else if (p.textContent.toLowerCase().startsWith('title')) {
            // out title item
            p.className = 'square-casestudy-card-title';
            p.textContent = p.textContent.replace('Title:', '').trim();
          } else if (p.textContent.toLowerCase().startsWith('description')) {
            // out description item
            p.className = 'square-casestudy-card-description';
            p.textContent = p.textContent.replace('Description:', '').trim();
          }
        });
      }
    });
  });
}
