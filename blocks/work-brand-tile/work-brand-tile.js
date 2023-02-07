import { createTag, replaceElementType, replaceAllChildElements } from '../../scripts/helpers.js';

function createMediaDiv(div) {
  const picture = div.querySelector('picture');
  const mediaDiv = createTag('div', { class: 'work-brand-tile__media-box' }, '');
  mediaDiv.append(picture);
  return mediaDiv;
}

function createInfoDiv(div) {
  const infoDiv = createTag('div', { class: 'work-brand-tile__info-box' }, '');
  const title = div.querySelector('h3');
  const newTitle = replaceElementType(title, 'h6');
  const description = div.querySelector('p');
  infoDiv.append(newTitle, description);
  return infoDiv;
}

// TODO: update function to support video in work-brand-tile
function createVideoElement(videoLinkEl) {
  const videoSrc = videoLinkEl.getAttribute('href');
  const video = createTag('div', { class: 'work-brand-tile__video-container' }, '');
  if (videoSrc.includes('youtube')) {
    const videoFrame = document.createTag('iframe', {
      src: videoLinkEl.getAttribute('href'),
    });
    video.append(videoFrame);
  }
  return video;
}

export default function decorate(block) {
  const tileWrapperLink = createTag('a', { class: 'work-brand-tile__link-wrapper' }, '');

  // get links
  [...block.children].forEach((row) => {
    [...row.children].forEach((div) => {
      if (div.querySelector('picture')) {
        const mediaDiv = createMediaDiv(block);
        const videoLinkEl = div.querySelector('a');
        if (videoLinkEl) {
          const video = createVideoElement(videoLinkEl);
          if (video) { mediaDiv.append(video); }
        }
        tileWrapperLink.append(mediaDiv);
      } else {
        const infoDiv = createInfoDiv(div);
        tileWrapperLink.append(infoDiv);
        const targetLinkEl = div.querySelector('a');
        if (targetLinkEl) {
          const targetHref = targetLinkEl.getAttribute('href');
          tileWrapperLink.href = targetHref;
          tileWrapperLink.target = targetHref.includes('https') ? '_blank' : '_self';
        }
      }
    });
  });

  replaceAllChildElements(block, tileWrapperLink);
}
