const canvas = document.getElementById("plasma");
const ctx = canvas.getContext("2d");

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
    this.x += this.speedX;
    this.y += this.speedY;

    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius) {
      this.speedX = -this.speedX;
      this.speedY = -this.speedY;
    }

    this.draw();
  }

  draw() {
    ctx.fillStyle = "rgba(173, 216, 230, 1)";
    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
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

  //update particles
  particles.forEach((particle) => {
    particle.update();
  });

  requestAnimationFrame(animate);
}

animate();
