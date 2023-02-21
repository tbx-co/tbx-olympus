export default function decorate(block) {
  const picture = block.querySelector('picture');
  const eyebrow = block.querySelector('p');
  const heading = block.querySelector('h1, h2, h3');

  block.innerHTML = '';

  const pictureWrapper = document.createElement('div');
  pictureWrapper.setAttribute('class', 'picture-wrapper');

  const copyWrapper = document.createElement('div');
  copyWrapper.setAttribute('class', 'copy-wrapper');

  const fadeupWrapper = document.createElement('div');
  // fadeupWrapper.setAttribute('class', 'fadeup');

  const backdrop = document.createElement('div');
  backdrop.setAttribute('class', 'casestudy-hero-backdrop');

  heading.setAttribute('class', 'casestudy-hero-heading');

  pictureWrapper.append(picture);
  fadeupWrapper.append(eyebrow, heading);
  copyWrapper.append(fadeupWrapper);

  block.append(pictureWrapper, backdrop, copyWrapper);
}
