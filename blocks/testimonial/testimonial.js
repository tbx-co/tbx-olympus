export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  cols.forEach((col, index) => {
    col.classList.add(`column-${index}`);
  });
}
