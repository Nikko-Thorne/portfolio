const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Define a variable to store the mouse position
const mouse = {
  x: undefined,
  y: undefined,
};

// Add an event listener to track mouse movement
canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Add an event listener to track window resizing
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  createFireflies();
});

// Add an event listener to track mouse movement
canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

const fireflies = [];

class Firefly {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
    };
  }

  draw() {
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.radius
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.5)"); // Inner color (glow)
    gradient.addColorStop(1, this.color); // Outer color (firefly's color)

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient; // Use the radial gradient for the fill style
    ctx.shadowColor = this.color; // Glow color
    ctx.shadowBlur = 10; // Adjust the shadow blur for the desired effect
    ctx.fill();
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.velocity.x = -this.velocity.x;
    }

    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.velocity.y = -this.velocity.y;
    }

    this.draw();
  }
}

function createFireflies() {
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 2 + 1;
    let color_r = Math.floor(Math.random() * 255);
    let color_g = Math.floor(Math.random() * 255);
    let color_b = Math.floor(Math.random() * 255);
    let color_a = Math.random() * 0.5 + 0.5;
    const color = `rgba(${color_r}, ${color_g}, ${color_b}, ${color_a})`;

    fireflies.push(new Firefly(x, y, radius, color));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < fireflies.length; i++) {
    fireflies[i].update();
  }
}

createFireflies();
animate();
