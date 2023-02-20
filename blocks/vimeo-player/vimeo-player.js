import { createTag, replaceAllChildElements, addLibScriptBeforeBodyEndTag } from '../../scripts/helpers.js';

export default function decorate(block) {
  addLibScriptBeforeBodyEndTag('/scripts/vimeo-api-player.js');

  const embedVideo = () => {
    // add vimeo video player to block
    const vimeoID = block.textContent.trim();
    const videoEmbed = createTag('iframe', {
      src: `https://player.vimeo.com/video/${vimeoID}`,
      title: 'Vimeo video player',
      frameborder: 0,
      allow: 'autoplay; picture-in-picture; fullscreen;',
    }, '');
    const videoEmbedWrapper = createTag('div', { class: 'vimeo-player-frame' }, videoEmbed);

    replaceAllChildElements(block, videoEmbedWrapper);

    // toggle visibility of play button based on vimeo player status
    const vimeoPlayer = document.querySelector('.vimeo-player');
    const playButton = createTag('button', { class: 'video-player-button' }, '');
    vimeoPlayer.append(playButton);

    // eslint-disable-next-line no-undef
    const player = new Vimeo.Player(videoEmbed);
    player.on('play', () => {
      playButton.classList.add('is-hidden');
    });
    player.on('pause', () => {
      playButton.classList.remove('is-hidden');
    });
    playButton.addEventListener('click', () => {
      player.play();
    });
  };

  embedVideo();
}
