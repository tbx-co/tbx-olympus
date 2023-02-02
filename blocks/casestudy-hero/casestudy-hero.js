export default function decorate(block) {
	const picture = block.querySelector('picture');
	const eyebrow = block.querySelector('p');
	const heading = block.querySelector('h1,h2,h3');

	block.innerHTML = '';

	const pictureWrapper = document.createElement('div');
	pictureWrapper.setAttribute('class', 'picture-wrapper');

	const copyWrapper = document.createElement('div');
	copyWrapper.setAttribute('class', 'copy-wrapper');

	const backdrop = document.createElement('div');
	backdrop.setAttribute('class', 'casestudy-hero-backdrop');

	pictureWrapper.append(picture);
	copyWrapper.append(eyebrow, heading);

	block.append(pictureWrapper, backdrop, copyWrapper);
}