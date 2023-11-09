document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-list li a");
    const sections = document.querySelectorAll("section");
  
    function updateActiveNavLink() {
      const navbarHeight = document.querySelector("nav").offsetHeight;
      let foundActive = false;
  
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
  
        if (
          !foundActive &&
          rect.top <= navbarHeight &&  // Use navbarHeight to determine if the section is at the top of the viewport
          rect.bottom >= navbarHeight  
        ) {
          navLinks.forEach((link) => link.classList.remove("active"));
          if(navLinks[index]) {  // Check if a navigation link exists at the current index
            navLinks[index].classList.add("active");
          }
          foundActive = true;
        }
      });
    }
  
    // Update active link on page load and on scroll
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
  });