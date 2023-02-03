export default function decorate(block) {
  const partnersList = document.createElement('ul');
  partnersList.setAttribute('class', 'partners-list');
  [...block.children].forEach((row) => {
    [...row.children].forEach((div) => {
      const title = div.querySelector('h1,h2,h3,h4,h5,h6');
      const picture = div.querySelector('picture');
      if (title) {
        title.setAttribute('class', 'partners-title');
        row.replaceWith(title);
      } else if (picture) {
        const listItem = document.createElement('li');
        listItem.setAttribute('class', 'partners-list-item');

        const linkEl = div.querySelector('a');
        if (linkEl) {
          const pictureLink = document.createElement('a');
          pictureLink.href = linkEl.href;
          pictureLink.title = linkEl.title;
          pictureLink.append(picture);
          listItem.append(pictureLink);
        } else {
          listItem.append(picture);
        }

        partnersList.append(listItem);
        row.remove();
      }
    });
  });
  block.append(partnersList);
}
