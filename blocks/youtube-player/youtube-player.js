import { initIntersectionObserver } from '../../scripts/scripts.js';
import { createTag, replaceAllChildElements } from '../../scripts/helpers.js';

export default function decorate(block) {
  const embedVideo = () => {
    const youtubeID = block.textContent.trim();
    const videoEmbed = createTag('iframe', {
      src: `https://www.youtube.com/embed/${youtubeID}`,
      title: 'YouTube video player',
      frameborder: 0,
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;',
      allowfullscreen: '',
    }, '');
    const videoEmbedWrapper = createTag('div', { class: 'youtube-player-frame' }, videoEmbed);

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
