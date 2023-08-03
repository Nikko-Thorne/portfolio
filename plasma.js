const canvas = document.getElementById("plasma");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let mouseX = null;
let mouseY = null;

const particles = [];
const particleCount = 100;

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
  let dx = x2 - x1;
  let dy = y2 - y1;
  let angle = Math.atan2(dy, dx);
  let distance = Math.sqrt(dx * dx + dy * dy);

  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const xt = x1 + dx * t;
    const yt = y1 + dy * t;
    const variance =
      Math.sin(t * Math.PI * 4 + Date.now() * 0.002) *
      (1 - t) *
      (30 + Math.random() * 5);
    const offsetX = Math.cos(angle - Math.PI / 2) * variance;
    const offsetY = Math.sin(angle - Math.PI / 2) * variance;
    ctx.lineTo(xt + offsetX, yt + offsetY);
  }
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Additional drawing to give a 'glow' effect
  ctx.strokeStyle = "rgba(137, 239, 255, 0.65)"; // Light purple color
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawParticles() {
  particles.forEach((particle, index) => {
    if (mouseX && mouseY) {
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const force = (1 / (distance * distance)) * 10000;
      particle.speedX += (dx / distance) * force;
      particle.speedY += (dy / distance) * force;
    } else {
      // Circular motion when not following the mouse
      const angle = (Date.now() * 0.0005 + index) % (Math.PI * 2); // Continuous rotation
      particle.speedX = Math.cos(angle) * 2; // Radius of circular motion
      particle.speedY = Math.sin(angle) * 2; // Radius of circular motion
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

  // Only draw if mouse coordinates are available
  if (mouseX && mouseY) {
    // Draw central plasma orb at mouse position
    ctx.fillStyle = "rgba(173, 216, 230, 0.8)"; // Light blue color
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 20, 0, Math.PI * 2);
    ctx.fill();

    drawParticles();
    for (let i = 0; i < 5; i++) {
      const targetParticle =
        particles[Math.floor(Math.random() * particles.length)]; // Select random particles to shock
      drawLightning(mouseX, mouseY, targetParticle.x, targetParticle.y, 10); // Using mouse coordinates
    }
  }
}

function animate() {
  drawPlasmaOrb();
  requestAnimationFrame(animate);
}

animate();
