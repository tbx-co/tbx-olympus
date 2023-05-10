import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import {
  addSectionLayoutClassToParentSection,
  addSectionInnerWrapperDiv,
} from '../../scripts/helpers.js';

export default function decorate(block) {
  addSectionInnerWrapperDiv(block);
  addSectionLayoutClassToParentSection(block);
  
  const nodeH1 = block.getElementsByTagName('h1')[0];

  const pattern = /\b(img-\S+)\b/;
  const bgImage = block.classList.toString().match(pattern);
  if (bgImage) {
    const spanH1 = document.createElement('span');
    spanH1.textContent = nodeH1.textContent;
    nodeH1.innerHTML = null;
    nodeH1.appendChild(spanH1);
    nodeH1.style.backgroundImage = `url("/blocks/header-statement/${bgImage[0]}.webp")`;
  } else {
    nodeH1.style.backgroundImage = null;
  }

  // additional text, not the H1
  if (block.children.length > 1) {
    const nodeP1 = block.children[1];
    nodeP1.classList.add('header-statement__text');
    nodeH1.parentNode.insertBefore(nodeP1, nodeH1.nextSibling);
  }
}
