export default function decorate(block) {
  [...block.children].forEach((div) => {
    const youtubeId = div.childNodes[1].innerHTML;
    const videoEmbed = `<div class="youtube-player-frame">
                          <iframe  width="560" height="315"
                                  src="https://www.youtube.com/embed/${youtubeId}" 
                                  title="YouTube video player" frameborder="0" allow="accelerometer; 
                                  autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                  allowfullscreen></iframe>
                        </div>`;
    div.insertAdjacentHTML('afterend', videoEmbed);
    div.remove();
  });
}
