export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.innerHTML = row.innerHTML.replace('TBX', 'TBX.syndicate');
  });
}
