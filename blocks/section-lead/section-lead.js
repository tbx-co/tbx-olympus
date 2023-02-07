export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'section-lead__inner-wrapper';
  });
}
