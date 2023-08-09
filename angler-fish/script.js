const canvas = document.getElementById("yourCanvasID");
const ctx = canvas.getContext("2d");

// Set canvas to full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Define your anglerfish (cursor) object
const anglerFish = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 50,
  draw: function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "#FF0000"; // Red color for illustration
    ctx.fill();
    ctx.closePath();
  },
};

// Define your particle fish objects
const fishes = [];
for (let i = 0; i < 100; i++) {
  fishes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 10,
    draw: function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = "#0000FF"; // Blue color for illustration
      ctx.fill();
      ctx.closePath();
    },
  });
}

canvas.addEventListener("mousemove", (e) => {
  anglerFish.x = e.clientX;
  anglerFish.y = e.clientY;
  // This is a very basic fish movement logic for illustration
  for (let fish of fishes) {
    if (fish.x < anglerFish.x) fish.x += 1;
    else fish.x -= 1;
    if (fish.y < anglerFish.y) fish.y += 1;
    else fish.y -= 1;
  }
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  anglerFish.draw();
  for (let fish of fishes) {
    fish.draw();
  }
  requestAnimationFrame(animate);
}
animate();
