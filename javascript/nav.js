document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-list li a");
  const sections = document.querySelectorAll("section, .hero#home");

  function updateActiveNavLink() {
    const viewportHeight = window.innerHeight;
    let topSectionIndex = null;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();

      // We are looking for the section that is closest to the top without going above it
      if (rect.top >= 0 && (topSectionIndex === null || rect.top < sections[topSectionIndex].getBoundingClientRect().top)) {
        topSectionIndex = index;
      }
    });

    navLinks.forEach((link, index) => {
      link.classList.toggle("active", index === topSectionIndex);
    });
  }

  // Set the "home" button as active upon initial load if the page starts at the top
  if (window.scrollY === 0) {
    navLinks[0].classList.add("active");
  }

  // Update the active nav link upon scrolling
  document.addEventListener('scroll', updateActiveNavLink);

  // Call the function on page load to set the correct active link
  updateActiveNavLink();
});