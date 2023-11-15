document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-list li a");
  const sections = document.querySelectorAll(".hero#home, section");

  function updateActiveNavLink() {
    const viewportHeight = window.innerHeight;
    let topSectionIndex = null;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();

      // Adjust this value to change when the nav link becomes active
      // For example, setting it to 0.5 would mean the middle of the section needs to reach the top of the viewport
      const activationThreshold = 0.5; 

      // Check if the section has reached the activation threshold
      if (rect.top <= viewportHeight * activationThreshold && rect.bottom > viewportHeight * activationThreshold) {
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
