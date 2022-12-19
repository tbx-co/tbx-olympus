export default function decorate(block) {
  [...block.children].forEach((div) => {
    const vimeoId = div.childNodes[1].innerHTML;
    const videoEmbed = `<div class="vimeo-player-frame">
                          <iframe src="https://player.vimeo.com/video/${vimeoId}" 
                                  width="400px" height="400px" 
                                  frameborder="0"
                                  allow="autoplay; fullscreen; picture-in-picture"
                                  title="{video_title}" 
                                  webkitallowfullscreen 
                                  mozallowfullscreen 
                                  allowfullscreen>
                          </iframe>
                        </div>`;
    div.insertAdjacentHTML('afterend', videoEmbed);
    div.remove();
  });
}
