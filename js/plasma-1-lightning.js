const canvas = document.getElementById("plasma");
const ctx = canvas.getContext("2d");
const particles = [];
const particleCount = 100;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let mouseX = centerX;
let mouseY = centerY;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Create particles
for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speedX: 0,
    speedY: 0,
  });
}

function drawParticles() {
  // Enable shadow for glow effect
  ctx.shadowColor = "magenta";
  ctx.shadowBlur = 15;

  particles.forEach((particle) => {
    const dx = mouseX - particle.x;
    const dy = mouseY - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const force = (1 / (distance * distance)) * 1000;
    particle.speedX += (dx / distance) * force;
    particle.speedY += (dy / distance) * force;

    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.speedX *= 0.9; // Damping
    particle.speedY *= 0.9; // Damping

    ctx.save(); // Save the current state

    ctx.fillStyle = "magenta"; // Magenta color for particles
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // Restore the state to remove shadow from the next draw
  });

  // Disable shadow after drawing
  ctx.shadowBlur = 0;
}

function drawLightning(x1, y1, x2, y2, segments) {
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.25)"); // White at the start
  gradient.addColorStop(0.5, "rgba(0, 0, 255, 0.5)"); // Blue at the middle
  gradient.addColorStop(1, "rgba(255, 0, 255, 0.25)"); // Magenta at the end

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2;

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
  ctx.stroke();
}

function drawPlasmaOrb() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Only draw if mouse coordinates are available
  if (mouseX && mouseY) {
    // Draw central plasma orb at mouse position using a radial gradient
    const gradient = ctx.createRadialGradient(
      mouseX,
      mouseY,
      5,
      mouseX,
      mouseY,
      20
    );
    gradient.addColorStop(0, "rgba(173, 216, 230, 1)");
    gradient.addColorStop(1, "rgba(173, 216, 230, 1)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw internal details (concentric circles)
    for (let i = 1; i < 5; i++) {
      ctx.fillStyle = `rgba(173, 216, 230, ${0.2 / i})`;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, (20 / 5) * i, 0, Math.PI * 2);
      ctx.fill();
    }

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
