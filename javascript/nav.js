document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-list li a");
  const navList = document.querySelector(".nav-list");

  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section, .hero#home");
    const navbarHeight = document.querySelector("nav").offsetHeight;
    let foundActive = false;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();

      if (
        !foundActive &&
        rect.top <= window.innerHeight * 0.5 &&
        rect.bottom >= window.innerHeight * 0.5
      ) {
        navLinks.forEach((link) => link.classList.remove("active"));
        navLinks[index].classList.add("active");
        foundActive = true;
      }
    });
  }

  // Update active link on page load
  updateActiveNavLink();
});
