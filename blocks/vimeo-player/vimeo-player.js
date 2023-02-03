import { initIntersectionObserver } from '../../scripts/scripts.js';
import { createTag, replaceAllChildElements } from '../../scripts/helpers.js';

export default function decorate(block) {
  const embedVideo = () => {
    const vimeoID = block.textContent.trim();
    const videoEmbed = createTag('iframe', {
      src: `https://player.vimeo.com/video/${vimeoID}`,
      title: 'Vimeo video player',
      frameborder: 0,
      allow: 'autoplay; picture-in-picture; fullscreen;',
    }, '');
    const videoEmbedWrapper = createTag('div', { class: 'vimeo-player-frame' }, videoEmbed);

    replaceAllChildElements(block, videoEmbedWrapper);
  };

  initIntersectionObserver({
    sections: block,
    callback: embedVideo,
    options: {
      root: null, rootMargin: '0px', threshold: 0.25,
    },
  });
}
