let mouse = {
  x: null,
  y: null,
  radius: 100,
};

canvas.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});
