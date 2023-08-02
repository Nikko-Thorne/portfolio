const canvas = document.getElementById("plasma");
const ctx = canvas.getContext("2d");

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

function drawPlasmaOrb() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 5; i++) {
    drawLightning(centerX, centerY, mouseX, mouseY, 10);
  }
}

function animate() {
  drawPlasmaOrb();
  requestAnimationFrame(animate);
}

animate();
