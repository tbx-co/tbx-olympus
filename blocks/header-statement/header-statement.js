export default function decorate(block) {
  const nodeH1 = block.getElementsByTagName('h1')[0];
  const spanH1 = document.createElement('span');
  spanH1.textContent = nodeH1.textContent;
  nodeH1.innerHTML = null;
  nodeH1.appendChild(spanH1);

  if (block.children.length > 1) {
    const nodeP1 = block.children[1];
    nodeP1.classList.add('header-statement__text');
    nodeH1.parentNode.insertBefore(nodeP1, nodeH1.nextSibling);
  }
}
