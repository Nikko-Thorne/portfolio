const canvas = document.getElementById("plasma");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  active: false,
};

canvas.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  mouse.active = true;
});

canvas.addEventListener("mouseout", function () {
  mouse.active = false;
});

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 1;
    this.angle = Math.random() * 360;
  }

  update() {
    // Gradual rotation around the mouse or center
    this.angle += 0.1;
    const distanceFromCenter = 200;
    const centerX = mouse.active ? mouse.x : canvas.width / 2;
    const centerY = mouse.active ? mouse.y : canvas.height / 2;
    this.x = centerX + Math.cos(this.angle) * distanceFromCenter;
    this.y = centerY + Math.sin(this.angle) * distanceFromCenter;
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
  if (mouse.active) {
    for (let j = 0; j < 5; j++) {
      // Draw multiple lightning beams
      if (Math.random() < 0.2) {
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
        ctx.lineWidth = 10 - j * 2; // Gradually reduce thickness
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        for (let i = 0; i < 10; i++) {
          const x =
            (targetParticle.x - canvas.width / 2) * (i / 10) + canvas.width / 2;
          const y =
            (targetParticle.y - canvas.height / 2) * (i / 10) +
            canvas.height / 2;
          const variance = (1 - i / 10) * (Math.random() * 20 - 10);
          ctx.lineTo(x + variance, y + variance);
        }
        ctx.lineTo(targetParticle.x, targetParticle.y);
        ctx.stroke();
      }
    }
  }
}

let particles = [];

function init() {
  for (let i = 0; i < 100; i++) {
    let angle = (i / 100) * Math.PI * 2;
    let x = mouse.x + Math.cos(angle) * 200;
    let y = mouse.y + Math.sin(angle) * 200;
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
