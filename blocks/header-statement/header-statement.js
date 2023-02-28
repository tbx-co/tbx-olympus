export default function decorate(block) {
  const nodeH1 = block.getElementsByTagName('h1')[0];
  const spanH1 = document.createElement('span');
  spanH1.textContent = nodeH1.textContent;
  nodeH1.innerHTML = null;
  nodeH1.appendChild(spanH1);
}
