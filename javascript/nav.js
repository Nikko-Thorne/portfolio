document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-list li a");
  const navList = document.querySelector(".nav-list");

  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section");
    const navbarHeight = document.querySelector("nav").offsetHeight;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();

      if (
        rect.top <= window.innerHeight * 0.5 + navbarHeight &&
        rect.bottom >= window.innerHeight * 0.5
      ) {
        navLinks.forEach((link) => link.classList.remove("active"));
        navLinks[index].classList.add("active");
      }
    });
  }

  // Listen for scroll event and update active link
  window.addEventListener("scroll", updateActiveNavLink);
  console.log("scroll");

  // Update active link on page load
  updateActiveNavLink();
});