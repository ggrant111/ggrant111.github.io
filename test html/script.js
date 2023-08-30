document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".section");

  window.addEventListener("scroll", () => {
    console.log("Scroll event triggered");

    let scrollY = window.scrollY;
    let windowHeight = window.innerHeight;

    console.log(`ScrollY: ${scrollY}, Window Height: ${windowHeight}`);

    sections.forEach((section) => {
      let img = section.querySelector("img");
      let sectionTop = section.offsetTop;
      let sectionHeight = section.offsetHeight;
      let imgTopRelativeToDocument = sectionTop + img.offsetTop;
      let imgHeight = img.offsetHeight;
      let imgMiddleRelativeToDocument =
        imgTopRelativeToDocument + imgHeight / 2;

      console.log(
        `Section Top: ${sectionTop}, ImgTop: ${imgTopRelativeToDocument}, Img Middle: ${imgMiddleRelativeToDocument}`
      );

      let range = 50; // You can adjust this value
      if (
        Math.abs(scrollY + windowHeight / 2 - imgMiddleRelativeToDocument) <=
        range
      ) {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
    });
  });
});
