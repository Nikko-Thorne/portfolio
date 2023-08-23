// Wait for the content of the document to be fully loaded before running the code
document.addEventListener("DOMContentLoaded", function () {
  // Grab the canvas from the HTML and its 2d context for drawing
  const canvas = document.getElementById("particleCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");

  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Array to hold all the particles
  const particles = [];

  // Number of particles to be drawn on the canvas
  const particleCount = 200;

  // Particle class definition
  class Particle {
    constructor() {
      // Start position of particle is the center of the canvas
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;

      // Angle for the direction in which the particle moves
      this.angle = Math.random() * Math.PI * 2;

      // Distance of particle from the center
      this.radius = Math.random() * (canvas.width / 2);

      // Speed at which the particle moves
      this.speed = 0.01 + Math.random() * 0.01;

      // Assign a random color to the particle
      this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    // Update the particle's position
    update() {
      // Adjust the angle by the speed (how much it moves in each frame)
      this.angle += this.speed;

      // Particles converge towards the center at a fixed rate
      this.radius -= 0.5;

      // Reset particle's position if it reaches the center
      if (this.radius < 0) {
        this.radius = Math.random() * (canvas.width / 2);
      }

      // Calculate x and y based on the updated angle and radius
      this.x = canvas.width / 2 + this.radius * Math.cos(this.angle);
      this.y = canvas.height / 2 + this.radius * Math.sin(this.angle);
    }

    // Draw the particle on the canvas
    draw() {
      // Start a new path for drawing
      ctx.beginPath();

      // Define the shape of the particle (circle)
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);

      // Fill the particle with its color
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Initialize the particles array with Particle objects
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Function that animates the particles
  function animate() {
    // Create a fade effect by overlaying a semi-transparent black rectangle on each frame
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; // Reduced alpha for a longer trail
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // For each particle, update its position and redraw it
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    // Request the browser to run `animate` again for the next frame
    requestAnimationFrame(animate);
  }

  // Start the animation
  animate();
});
