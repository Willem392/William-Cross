var sketch1 = function(a) {

  const balls = [];
  let numBalls = 15;
  let res = 10;
  let cols, rows;
  var field = [];
  let showFieldCheckbox;
  let showBallsCheckbox;

  let showField = false;
  let showBalls = false;

  a.setup = function() {
    a.createCanvas(500, 500);
    for (let i = 0; i < numBalls; i++) {
      balls.push(new Ball(a.random(a.width), a.random(a.height)));
    }
    cols = 1 + a.width / res;
    rows = 1 + a.height / res;
    for (let i = 0; i < cols; i++) {
      field[i] = [];
      for (let j = 0; j < rows; j++) {
        field[i][j] = a.random(255);
      }
    }
    showFieldCheckBox = a.createCheckbox('Show Field', false);
    showFieldCheckBox.changed(showFieldCheckEvent);
    showBallsCheckbox = a.createCheckbox('Show Balls', false);
    showBallsCheckbox.changed(showBallsCheckEvent);
  }

  a.draw = function() {
    a.background(51);

    for (let ball of balls) {
      ball.update();
      if (showBalls) {
        ball.show();
      }
    }

    calculateField();
    if (showField) {
      printField();
    }
    march();
  }

  function calculateField() {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        field[i][j] = 0;
        let sum = 0;
        for (let ball of balls) {
          let dx = i * res - ball.pos.x;
          let dy = j * res - ball.pos.y;
          let d2 = dx * dx + dy * dy;
          sum += a.sq(ball.r) / d2;
        }
        field[i][j] = sum;
      }
    }
  }

  function printField() {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        a.strokeWeight(4);
        a.stroke(field[i][j] * 255);
        a.point(i * res, j * res);
      }
    }
  }

  function march() {
    for (let i = 0; i < cols - 1; i++) {
      for (let j = 0; j < rows - 1; j++) {
        let x = i * res;
        let y = j * res;
        let pointA, pointB, pointC, pointD;
        if (field[i][j] < 1) {
          pointA = 0;
        } else {
          pointA = 1;
        }
        if (field[i + 1][j] < 1) {
          pointB = 0;
        } else {
          pointB = 1;
        }
        if (field[i + 1][j + 1] < 1) {
          pointC = 0;
        } else {
          pointC = 1;
        }
        if (field[i][j + 1] < 1) {
          pointD = 0;
        } else {
          pointD = 1;
        }
        let state = getState(pointA, pointB, pointC, pointD);
        let A = field[i][j];
        let B = field[i + 1][j];
        let C = field[i + 1][j + 1];
        let D = field[i][j + 1];
        a.stroke(255);
        a.strokeWeight(4);
        switch (state) {
          case 1:
            a.line(x, li(y, A, D), li(x, D, C), y + res);
            break;
          case 2:
            a.line(li(x, D, C), y + res, x + res, li(y, B, C));
            break;
          case 3:
            a.line(x, li(y, A, D), x + res, li(y, B, C));
            break;
          case 4:
            a.line(li(x, A, B), y, x + res, li(y, B, C));
            break;
          case 5:
            a.line(x, li(y, A, D), li(x, A, B), y);
            a.line(li(x, D, C), y + res, x + res, li(y, B, C));
            break;
          case 6:
            a.line(li(x, A, B), y, li(x, D, C), y + res);
            break;
          case 7:
            a.line(x, li(y, A, D), li(x, A, B), y);
            break;
          case 8:
            a.line(x, li(y, A, D), li(x, A, B), y);
            break;
          case 9:
            a.line(li(x, A, B), y, li(x, D, C), y + res);
            break;
          case 10:
            a.line(x, li(y, A, D), li(x, D, C), y + res);
            a.line(li(x, A, B), y, x + res, li(y, B, C));
            break;
          case 11:
            a.line(li(x, A, B), y, x + res, li(y, B, C));
            break;
          case 12:
            a.line(x, li(y, A, D), x + res, li(y, B, C));
            break;
          case 13:
            a.line(li(x, D, C), y + res, x + res, li(y, B, C));
            break;
          case 14:
            a.line(x, li(y, A, D), li(x, D, C), y + res);
            break;
        }
      }
    }
  }

  function getState(a, b, c, d) {
    return a * 8 + b * 4 + c * 2 + d * 1;
  }

  function li(x, point1, point2) {
    let y = x + res;
    return x + (y - x) * ((1 - point1) / (point2 - point1));
  }

  function showFieldCheckEvent() {
    if (this.checked()) {
      showField = true;
    } else {
      showField = false;
    }
  }

  function showBallsCheckEvent() {
    if (this.checked()) {
      showBalls = true;
    } else {
      showBalls = false;
    }
  }

  class Ball {

    constructor(x, y) {
      this.pos = a.createVector(x, y);
      this.vel = p5.Vector.random2D();
      this.vel.mult(a.random(1, 3));
      this.r = a.random(20, a.height / 12.5);
    }

    update() {
      this.pos.add(this.vel);

      if (this.pos.x + this.r > a.width) {
        this.pos.x = a.width - this.r;
        this.vel.x *= -1;
      }
      if (this.pos.x - this.r < 0) {
        this.pos.x = this.r;
        this.vel.x *= -1;
      }
      if (this.pos.y + this.r > a.height) {
        this.pos.y = a.height - this.r;
        this.vel.y *= -1;
      }
      if (this.pos.y - this.r < 0) {
        this.pos.y = this.r;
        this.vel.y *= -1;
      }
    }

    show() {
      a.noFill();
      a.stroke(100);
      a.strokeWeight(1);
      a.ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    }
  }
}
var myp5 = new p5(sketch1, 'c1');
var sketch2 = function(b) {
  const balls = [];
  let numBalls = 15;

  b.setup = function() {
    b.createCanvas(500, 500);
    for (let i = 0; i < numBalls; i++) {
      balls.push(new Ball(b.random(b.width), b.random(b.height)));
    }
  }

  b.draw = function() {
    b.background(51);

    for (let ball of balls) {
      ball.update();
      ball.show();
    }
  }
  
  class Ball {

    constructor(x, y) {
      this.pos = b.createVector(x, y);
      this.vel = p5.Vector.random2D();
      this.vel.mult(b.random(1, 3));
      this.r = b.random(20, b.height / 12.5);
    }

    update() {
      this.pos.add(this.vel);

      if (this.pos.x + this.r > b.width) {
        this.pos.x = b.width - this.r;
        this.vel.x *= -1;
      }
      if (this.pos.x - this.r < 0) {
        this.pos.x = this.r;
        this.vel.x *= -1;
      }
      if (this.pos.y + this.r > b.height) {
        this.pos.y = b.height - this.r;
        this.vel.y *= -1;
      }
      if (this.pos.y - this.r < 0) {
        this.pos.y = this.r;
        this.vel.y *= -1;
      }
    }

    show() {
      b.noFill();
      b.stroke(100);
      b.strokeWeight(1);
      b.ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    }
  }
  
}
var myp5 = new p5(sketch2, 'c2');
var sketch3 = function(c) {

  const balls = [];
  let numBalls = 15;
  let res = 25;
  let cols, rows;
  var field = [];

  c.setup = function() {
    c.createCanvas(500, 500);
    for (let i = 0; i < numBalls; i++) {
      balls.push(new Ball(c.random(c.width), c.random(c.height)));
    }
    cols = 1 + c.width / res;
    rows = 1 + c.height / res;
    for (let i = 0; i < cols; i++) {
      field[i] = [];
      for (let j = 0; j < rows; j++) {
        field[i][j] = 0;
      }
    }
	
  }

  c.draw = function() {
    c.background(51);
    for (let ball of balls) {
      ball.update();
      ball.show();
    }
	printField();
  }
  
  function printField() {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        c.strokeWeight(4);
        c.stroke(0);
        c.point(i * res, j * res);
      }
    }
  }

  class Ball {

    constructor(x, y) {
      this.pos = c.createVector(x, y);
      this.vel = p5.Vector.random2D();
      this.vel.mult(c.random(1, 3));
      this.r = c.random(20, c.height / 12.5);
    }

    update() {
      this.pos.add(this.vel);

      if (this.pos.x + this.r > c.width) {
        this.pos.x = c.width - this.r;
        this.vel.x *= -1;
      }
      if (this.pos.x - this.r < 0) {
        this.pos.x = this.r;
        this.vel.x *= -1;
      }
      if (this.pos.y + this.r > c.height) {
        this.pos.y = c.height - this.r;
        this.vel.y *= -1;
      }
      if (this.pos.y - this.r < 0) {
        this.pos.y = this.r;
        this.vel.y *= -1;
      }
    }

    show() {
      c.noFill();
      c.stroke(100);
      c.strokeWeight(1);
      c.ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    }
  }
}
var myp5 = new p5(sketch3, 'c3');
var sketch4 = function(d) {

  const balls = [];
  let numBalls = 15;
  let res = 10;
  let cols, rows;
  var field = [];
  
  var displayAsRectangles = false;

  d.setup = function() {
    d.createCanvas(500, 500);
    for (let i = 0; i < numBalls; i++) {
      balls.push(new Ball(d.random(d.width), d.random(d.height)));
    }
    cols = 1 + d.width / res;
    rows = 1 + d.height / res;
    for (let i = 0; i < cols; i++) {
      field[i] = [];
      for (let j = 0; j < rows; j++) {
        field[i][j] = d.random(255);
      }
    }
	showRectCheckBox = d.createCheckbox('Display as rectangles', false);
    showRectCheckBox.changed(showRectCheckEvent);
  }

  d.draw = function() {
    d.background(51);

    for (let ball of balls) {
      ball.update();
      ball.show();
    }

    calculateField();
    printField();
  }

  function calculateField() {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        field[i][j] = 0;
        let sum = 0;
        for (let ball of balls) {
          let dx = i * res - ball.pos.x;
          let dy = j * res - ball.pos.y;
          let d2 = dx * dx + dy * dy;
          sum += d.sq(ball.r) / d2;
        }
		if(sum >= 1){
			field[i][j] = 255;
		} else {
			field[i][j] = 0;
		}
      }
    }
  }

  function printField() {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        d.strokeWeight(4);
        d.stroke(field[i][j] * 255);
		if(displayAsRectangles){
			if(field[i][j] == 255){
				d.fill(255);
			} else {
				d.fill(51);
			}
			d.noStroke();
			d.rect((i * res) - (res * 0.5), (j * res) - (res * 0.5), res, res);
		} else {
			d.point(i * res, j * res);
		}
      }
    }
  }
  
  function showRectCheckEvent() {
    if (this.checked()) {
      displayAsRectangles = true;
    } else {
      displayAsRectangles = false;
    }
  }

  class Ball {

    constructor(x, y) {
      this.pos = d.createVector(x, y);
      this.vel = p5.Vector.random2D();
      this.vel.mult(d.random(1, 3));
      this.r = d.random(20, d.height / 12.5);
    }

    update() {
      this.pos.add(this.vel);

      if (this.pos.x + this.r > d.width) {
        this.pos.x = d.width - this.r;
        this.vel.x *= -1;
      }
      if (this.pos.x - this.r < 0) {
        this.pos.x = this.r;
        this.vel.x *= -1;
      }
      if (this.pos.y + this.r > d.height) {
        this.pos.y = d.height - this.r;
        this.vel.y *= -1;
      }
      if (this.pos.y - this.r < 0) {
        this.pos.y = this.r;
        this.vel.y *= -1;
      }
    }

    show() {
      d.noFill();
      d.stroke(100);
      d.strokeWeight(3);
      d.ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    }
  }
}
var myp5 = new p5(sketch4, 'c4');