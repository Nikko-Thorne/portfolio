// Define a variable to store the mouse position
const mouse = {
  x: undefined,
  y: undefined,
};

// Add an event listener to track mouse movement
canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

class Firefly {
  // ... (previous code)

  // Update the firefly's position and respond to the mouse
  update() {
    // Calculate the distance between the firefly and the mouse cursor
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Define a maximum distance at which the firefly is affected by the mouse
    const maxMouseDistance = 100;

    // If the mouse is within the defined range, move the firefly towards it
    if (distance < maxMouseDistance) {
      // Calculate the velocity based on the distance to the mouse
      this.velocity.x = (dx / distance) * 2;
      this.velocity.y = (dy / distance) * 2;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // ... (remaining code)
  }
}
