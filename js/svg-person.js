OnlineWebFonts_Com({
  Id: ".about-svg",
  Data: __Animations["405942"],
}).Play();

const refreshLink = document.querySelector("a[href='#about']");

refreshLink.addEventListener("click", () => {
  const svgContainer = document.querySelector(".about-svg");
  const SVGElement = svgContainer.firstChild;
  const newSvg = svg.cloneNode(true);
  svgContainer.replaceChild(newSvg, SVGElement);
});
