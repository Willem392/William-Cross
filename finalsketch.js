const balls = [];
let numBalls = 15;
let res = 10;
let cols, rows;
var field = [];
let showFieldCheckbox;
let showBallsCheckbox;

let showField = false;
let showBalls = false;

function setup() {
  var canvas = createCanvas(500, 500);
  canvas.parent('sketch-holder');
  for (let i = 0; i < numBalls; i++) {
    balls.push(new Ball(random(width), random(height)));
  }
  cols = 1 + width / res;
  rows = 1 + height / res;
  for (let i = 0; i < cols; i++) {
    field[i] = [];
    for (let j = 0; j < rows; j++) {
      field[i][j] = random(255);
    }
  }
  showFieldCheckBox = createCheckbox('Show Field', false);
  showFieldCheckBox.changed(showFieldCheckEvent);
  showBallsCheckbox = createCheckbox('Show Balls', false);
  showBallsCheckbox.changed(showBallsCheckEvent);
  showFieldCheckBox.parent('sketch-holder');
  showBallsCheckbox.parent('sketch-holder');
}

function draw() {
  background(51);

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
        sum += sq(ball.r) / d2;
      }
      field[i][j] = sum;
    }
  }
}

function printField() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      strokeWeight(4);
      stroke(field[i][j] * 255);
      point(i * res, j * res);
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
      stroke(255);
      strokeWeight(4);
      switch (state) {
        case 1:
          line(x, li(y, A, D), li(x, D, C), y + res);
          break;
        case 2:
          line(li(x, D, C), y + res, x + res, li(y, B, C));
          break;
        case 3:
          line(x, li(y, A, D), x + res, li(y, B, C));
          break;
        case 4:
          line(li(x, A, B), y, x + res, li(y, B, C));
          break;
        case 5:
          line(x, li(y, A, D), li(x, A, B), y);
          line(li(x, D, C), y + res, x + res, li(y, B, C));
          break;
        case 6:
          line(li(x, A, B), y, li(x, D, C), y + res);
          break;
        case 7:
          line(x, li(y, A, D), li(x, A, B), y);
          break;
        case 8:
          line(x, li(y, A, D), li(x, A, B), y);
          break;
        case 9:
          line(li(x, A, B), y, li(x, D, C), y + res);
          break;
        case 10:
          line(x, li(y, A, D), li(x, D, C), y + res);
          line(li(x, A, B), y, x + res, li(y, B, C));
          break;
        case 11:
          line(li(x, A, B), y, x + res, li(y, B, C));
          break;
        case 12:
          line(x, li(y, A, D), x + res, li(y, B, C));
          break;
        case 13:
          line(li(x, D, C), y + res, x + res, li(y, B, C));
          break;
        case 14:
          line(x, li(y, A, D), li(x, D, C), y + res);
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