export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  [...block.children].forEach((row) => {
    row.className = 'columns__row';
    [...row.children].forEach((div) => {
      div.className = 'columns__inner-box';
      if (div.querySelector('.icon')) {
        div.className += ' support-icon';
        const iconWrapper = div.querySelector('.icon').parentElement;
        iconWrapper.classList.add('icon-wrapper');
      }
    });
  });
}
