export default function init(blockEl) {
  const anchors = [...blockEl.querySelectorAll('a')];
  blockEl.innerHTML = '';
  anchors.forEach((anchor) => {
    const { href, pathname } = anchor;

    if (!pathname.match('.mp4')) return;

    const isAutoplay = blockEl.classList.contains('autoplay');
    const attrs = isAutoplay ? 'playsinline autoplay loop muted' : 'playsinline controls';
    const video = `<video ${attrs}>
        <source src="${href}" type="video/mp4" />
      </video>`;
    blockEl.insertAdjacentHTML('beforeend', video);
  });
}
