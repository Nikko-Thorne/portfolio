const canvas = document.getElementById("plasma");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
  x: null,
  y: null,
  radius: 100,
};

canvas.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
  }

  update() {
    if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
    if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

    if (mouse.x) {
      const attractionForce = 0.01;
      this.speedX += (mouse.x - this.x) * attractionForce;
      this.speedY += (mouse.y - this.y) * attractionForce;
    }

    this.x += this.speedX;
    this.y += this.speedY;

    this.draw();
  }

  draw() {
    ctx.fillStyle = "magenta"; // Thicker magenta color
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawLightning() {
  if (Math.random() < 0.1) {
    // Random appearance of lightning
    const targetParticle =
      particles[Math.floor(Math.random() * particles.length)];
    const gradient = ctx.createLinearGradient(
      canvas.width / 2,
      canvas.height / 2,
      targetParticle.x,
      targetParticle.y
    );
    gradient.addColorStop(0, "white");
    gradient.addColorStop(0.5, "blue");
    gradient.addColorStop(1, "magenta");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    for (let i = 0; i < 10; i++) {
      const x =
        (targetParticle.x - canvas.width / 2) * (i / 10) + canvas.width / 2;
      const y =
        (targetParticle.y - canvas.height / 2) * (i / 10) + canvas.height / 2;
      const variance = (1 - i / 10) * (Math.random() * 20 - 10);
      ctx.lineTo(x + variance, y + variance);
    }
    ctx.lineTo(targetParticle.x, targetParticle.y);
    ctx.stroke();
  }
}

let particles = [];

function init() {
  for (let i = 0; i < 100; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    particles.push(new Particle(x, y));
  }
}

init();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw lightning
  drawLightning();

  // Update particles
  particles.forEach((particle) => {
    particle.update();
  });

  requestAnimationFrame(animate);
}

animate();
