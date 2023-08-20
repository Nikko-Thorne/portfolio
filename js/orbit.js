document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  const particles = [];
  const particleCount = 200;

  class Particle {
    constructor() {
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
      this.angle = Math.random() * Math.PI * 2;
      this.radius = Math.random() * (canvas.width / 2);
      this.speed = 0.02 + Math.random() * 0.03;
      this.color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random color
    }

    update() {
      this.angle += this.speed;
      this.radius -= 0.5; // particles converge towards the center
      if (this.radius < 0) {
        this.radius = Math.random() * (canvas.width / 2);
      }
      this.x = canvas.width / 2 + this.radius * Math.cos(this.angle);
      this.y = canvas.height / 2 + this.radius * Math.sin(this.angle);
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; // Slight fade effect for trails
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
});
