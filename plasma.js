const canvas = document.getElementById("plasma");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let mouseX = null;
let mouseY = null;

const particles = [];
const particleCount = 10;

// Create particles
for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speedX: 0,
    speedY: 0,
  });
}

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function drawLightning(x1, y1, x2, y2, segments) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const xt = x1 + (x2 - x1) * t;
    const yt = y1 + (y2 - y1) * t;
    const variance = (1 - t) * (Math.random() * 20 - 10);
    ctx.lineTo(xt + variance, yt + variance);
  }
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawParticles() {
  particles.forEach((particle) => {
    if (mouseX && mouseY) {
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const force = (1 / (distance * distance)) * 10000;
      particle.speedX += (dx / distance) * force;
      particle.speedY += (dy / distance) * force;
    }

    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.speedX *= 0.9; // Damping
    particle.speedY *= 0.9; // Damping

    ctx.fillStyle = "rgba(255, 0, 0, 1)"; // Red color for particles
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawPlasmaOrb() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawParticles();
  for (let i = 0; i < 5; i++) {
    const targetParticle =
      particles[Math.floor(Math.random() * particles.length)]; // Select random particles to shock
    drawLightning(centerX, centerY, targetParticle.x, targetParticle.y, 10);
  }
}

function animate() {
  drawPlasmaOrb();
  requestAnimationFrame(animate);
}

animate();
