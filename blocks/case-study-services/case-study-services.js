function addProjectThemeColorToSection(block) {
  const section = block.closest('.section');
  const projectThemeColor = document.querySelector('meta[name="project-theme-color"]');

  if (projectThemeColor) {
    section.style.backgroundColor = projectThemeColor.getAttribute('content');
  }
}

export default function decorate(block) {
  addProjectThemeColorToSection(block);

  [...block.children].forEach((row) => {
    row.className = 'case-study-services__wrapper';
    [...row.children].forEach((div, index) => {
      div.className = `case-study-services__col-${index + 1}`;
    });
  });
}
