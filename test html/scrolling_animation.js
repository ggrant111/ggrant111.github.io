window.addEventListener("scroll", function () {
  let sections = document.querySelectorAll(".section-container");
  let scrollY = window.scrollY;

  sections.forEach((section) => {
    let offsetTop = section.offsetTop;
    let offsetBottom = offsetTop + section.offsetHeight;

    if (scrollY > offsetTop && scrollY < offsetBottom) {
      section.id = "current-section";
      location.hash = "#current-section";
    } else {
      section.id = "";
    }
  });
});
