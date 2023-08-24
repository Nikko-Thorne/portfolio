document.addEventListener("DOMContentLoaded", () => {
  // Select the anchor element with attribute href='#about'
  const refreshLink = document.querySelector(".click-about");
  // Select the element with class 'about-svg' which contains the SVG
  const svgContainer = document.querySelector(".about-svg");
  // Select the anchor element with attribute href='#about'
  const rlink = document.querySelector(".cta-button");

  // Function animate
  function playSVGAnimation() {
    OnlineWebFonts_Com({
      Id: ".about-svg",
      Data: __Animations["405942"],
    }).Play();
  }

  // Call the playSVGAnimation function
  playSVGAnimation();

  // Add an event listener for the click event on the refreshLink element
  refreshLink.addEventListener("click", (event) => {
    // Call the playSVGAnimation function
    playSVGAnimation();
  });
  rlink.addEventListener("click", (event) => {
    // Call the playSVGAnimation function
    playSVGAnimation();
  });

  console.log(refreshLink); // Should log the anchor element with href='#about'
  console.log(svgContainer); // Should log the div with class 'about-svg'
  console.log(SVGElement); // This might not work as expected unless SVGElement is defined elsewhere in your code
  console.log(__Animations["405942"]); // Should log the SVG animation object
  console.log(OnlineWebFonts_Com); // Should log the OnlineWebFonts_Com function
  console.log(playSVGAnimation); // Should log the playSVGAnimation function
});
