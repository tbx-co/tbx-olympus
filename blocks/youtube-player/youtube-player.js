import { initIntersectionObserver } from '../../scripts/scripts.js';

export default function decorate(block) {
  const embedVideo = () => {
    [...block.children].forEach((div) => {
      const youtubeId = div.childNodes[1].innerHTML;
      const videoEmbed = `<div class="youtube-player-frame">
                            <iframe  width="560" height="315"
                                    src="https://www.youtube.com/embed/${youtubeId}" 
                                    title="YouTube video player" frameborder="0" allow="accelerometer; 
                                    autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
                            </iframe>
                          </div>`;
      div.insertAdjacentHTML('afterend', videoEmbed);
      div.remove();
    });
  };
  initIntersectionObserver({ sections: block, callback: embedVideo, options: { root: null, rootMargin: '0px', threshold: 0.25 } });
}
