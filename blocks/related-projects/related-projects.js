export default function decorate(block) {
  const cardsWrapper = [...document.querySelectorAll('.related-project-card-wrapper')];
  cardsWrapper.forEach((node) => {
    block.appendChild(node);
  });
}
