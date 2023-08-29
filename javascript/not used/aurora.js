document.addEventListener("DOMContentLoaded", (event) => {
  const canvas = document.getElementById("aurora");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawAurora();
  });

  function drawBackground() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawAurora() {
    drawBackground();

    for (let i = 0; i < 5; i++) {
      // Drawing multiple bands of light
      let gradient = ctx.createLinearGradient(
        0,
        Math.random() * canvas.height,
        canvas.width,
        Math.random() * canvas.height
      );
      gradient.addColorStop(0, "rgba(140, 255, 251, 0.5)");
      gradient.addColorStop(0.5, "rgba(140, 90, 251, 0.7)");
      gradient.addColorStop(1, "rgba(140, 255, 251, 0.5)");

      ctx.fillStyle = gradient;

      let y = canvas.height * (0.4 + 0.2 * Math.random()); // Random starting height
      let width = Math.random() * 300 + 100; // Random width for the band

      for (let x = 0; x < canvas.width; x += 2) {
        ctx.fillRect(x, y + 40 * Math.sin(0.01 * x + i), 2, width);
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    drawAurora();
  }

  animate();
});
