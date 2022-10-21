export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.innerHTML = row.innerHTML.replaceAll('TBX', 'TBX.syndicate');
  });
}
