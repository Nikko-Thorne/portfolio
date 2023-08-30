// Add this JavaScript to your script file or in a <script> tag at the end of your HTML
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-list li a");

  // Function to update active class based on scroll position
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section"); // Assuming each section has the "section" tag

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();

      if (rect.top <= 400 && rect.bottom >= 400) {
        navLinks.forEach((link) => link.classList.remove("active"));
        navLinks[index].classList.add("active");
      }
    });
  }

  // Listen for scroll event and update active link
  window.addEventListener("scroll", updateActiveNavLink);

  // Update active link on page load
  updateActiveNavLink();
});
