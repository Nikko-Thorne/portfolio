document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-list li a");
  const sections = document.querySelectorAll(".hero#home, section");

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;
    const totalPageHeight = document.body.scrollHeight;
    let topSectionIndex = null;

    // Detect if the user is at the bottom of the page
    const isAtBottom = (scrollPosition + viewportHeight) >= totalPageHeight;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const activationThreshold = 0.5; // The threshold of the section where the link becomes active

      if (isAtBottom) {
        // If the user is at the bottom, the last link (presumably for the contact section) should be active
        topSectionIndex = navLinks.length - 1;
      } else if (rect.top <= viewportHeight * activationThreshold && rect.bottom > viewportHeight * activationThreshold) {
        // Otherwise, check each section to see if it meets the criteria to become active
        topSectionIndex = index;
      }
    });

    navLinks.forEach((link, index) => {
      // Add 'active' class to the nav link that corresponds to the active section or to the last link if we're at the bottom
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