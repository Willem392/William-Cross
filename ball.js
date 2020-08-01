class Ball {

  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(1, 3));
    this.r = random(20, height / 12.5);
  }

  update() {
    this.pos.add(this.vel);

    if (this.pos.x + this.r > width) {
      this.pos.x = width - this.r;
      this.vel.x *= -1;
    }
    if (this.pos.x - this.r < 0) {
      this.pos.x = this.r;
      this.vel.x *= -1;
    }
    if (this.pos.y + this.r > height) {
      this.pos.y = height - this.r;
      this.vel.y *= -1;
    }
    if (this.pos.y - this.r < 0) {
      this.pos.y = this.r;
      this.vel.y *= -1;
    }
  }

  show() {
    noFill();
    stroke(100);
    strokeWeight(1);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }

}