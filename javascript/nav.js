document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-list li a");
  const navList = document.querySelector(".nav-list");

  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section, .hero#home");
    const viewportHeight = window.innerHeight;
    let sectionFound = false;

    // Set the "home" button to active by default
    navLinks[0].classList.add("active");

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();

      // Register the section as active when the bottom passes the bottom of the viewport
      if (!sectionFound && rect.bottom >= viewportHeight && rect.top < viewportHeight) {
        navLinks.forEach((link) => link.classList.remove("active"));
        navLinks[index].classList.add("active");
        sectionFound = true;
      }
    });

    // If no sections are active, default to the "home" section
    if (!sectionFound) {
      navLinks.forEach((link) => link.classList.remove("active"));
      navLinks[0].classList.add("active");
    }
  }

  // Update active link on page load
  updateActiveNavLink();

  // Add a scroll event listener to update the active link as the user scrolls
  document.addEventListener('scroll', updateActiveNavLink);
});