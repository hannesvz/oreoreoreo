// code by hannesvz

// https://github.com/hannesvz/oreoreoreo

let cy = 0,textsize = 30,textsizemax = 30;
let dx,dy,o1,o2,re,arial_rounded;

let current = ['o','r','o'];

let word = '';

let tick1, tick2 = 0;
let blink = true;

const leftside = 50;

const button_upscaled = 1.1;
const button_downscaled = 0.7;

const o1_y = 390, re_y = 300, ib_y = 210, ic_y = 120;

let iwidth, iheight;

function preload() {
  o1 = loadImage('o1.png');
  o2 = loadImage('o2.png');
  re = loadImage('re.png');
  ib = loadImage('backspace.png');
  ic = loadImage('clear.png');
  arial_rounded = loadFont('arial_rounded.ttf');
  iwidth = 115 * button_downscaled;
  iheight = 70 * button_downscaled;
}

function scaleImgUp() {
  this.size (this.width * button_upscaled, this.height * button_upscaled);
}

function scaleImgDefault() {
  this.size (o1.width * button_downscaled, o1.height * button_downscaled);
}


function setup() {
  frameRate(30);
  createCanvas(window.innerWidth, window.innerHeight);
  windowResized();
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  
  // calculate the width of the help text
  textFont(arial_rounded);
  strokeWeight(0);
  textSize(15);
  let textW = textWidth('backspace to undo the last letter.');
  leftpadding = (leftside + textW + 20) - ((window.innerWidth / 2) - (o1.width/2));
  
  // add some padding to the cookie's x position if it overlaps the help text
  dx = (window.innerWidth / 2) + ((leftpadding > 0) ? leftpadding : 0);
  dy = window.innerHeight - 25;
}

// check for a backspace pressed
function keyPressed() {
  // stack can only be added to if it isn't already at the top of the screen
  if (cy > 50) {
    if (key.toLowerCase() === 'o') {
      current.push('o');
    }
    if (key.toLowerCase() === 'r') {
      current.push('r');
    }
  }
  
  // stack can always be cleared  
  if (key.toLowerCase() === 'c') {
    current = [];
  }
  
  if ((keyCode === BACKSPACE) & (current.length > 0)) {
      current.pop();
    }
}

function mouseClicked() {
  if (mouseX > leftside & mouseX < leftside + iwidth) {
    if (mouseY > (dy - o1_y) & mouseY < (dy - o1_y) + iheight) current.push('o');
    if (mouseY > (dy - re_y) & mouseY < (dy - re_y) + iheight) current.push('r');
    if (mouseY > (dy - ib_y) & mouseY < (dy - ib_y) + iheight) current.pop();
    if (mouseY > (dy - ic_y) & mouseY < (dy - ic_y) + iheight) current = [];
  }
}

// blink the cursor
setInterval(()=> { blink = !blink; }, 500);

function drawOreos() {
  let arr = [...current];
  arr.reverse();
  let count = 0;
  cy = dy - 100; // current y - will change in the loop
  while (count < arr.length) {
    switch (arr[count]) {
    
      // print the Os
      case 'o':
        
        // if printing an O and the previous one was an RE, add some buffer
        if (count > 0 & arr[count-1] === 'r') {
            cy -= 10;
          }
        
        // this is the top oreo which is o1
        if (count === arr.length-1)
        {
          cy -= 20;
          image (o1, dx - (o1.width/2), cy);
        } 
        else 
        {
          cy -= 20;
          image (o2, dx - (o2.width/2), cy);
        }
        break;
        
      // print the REs
      case 'r':
        if (count > 0 & arr[count-1] === 'o') {
          cy += 15;
        }
        cy -= 10;
        image (re, dx - (re.width/2), cy);
        break;
    }
    
    count++;
  }
}

function drawButtons() {
  image(o1, leftside, dy - o1_y, iwidth, iheight);
  image(re, leftside, dy - re_y, iwidth, iheight);
  image(ib, leftside, dy - ib_y, iwidth, iheight);
  image(ic, leftside, dy - ic_y, iwidth, iheight);
}


function draw() {
  background(255);

  // build the word to be printed to the screen
  word = current.join('').replace(/r/g,'re').toUpperCase();
  
  textSize(textsize);
  let tw = textWidth(word + (blink ? '_' : ''));
  
  // scale the bottom text when it hits the end of the screen
  if (tw+leftside > (window.innerWidth)) {
    textsize = textsizemax * 0.5;
  }
  
  if (tw+leftside < (window.innerWidth / 2)) {
    textsize = textsizemax;
  }
  
  // draw the bottom text
  textFont(arial_rounded);
  fill(0)
   .strokeWeight(0)
   .textSize(textsize);
  textAlign(LEFT);
  
  rectMode(CORNER);
  
  text(word + (blink ? '_' : ''), leftside, dy - 30, 700, 200);
  
  // draw the instructions
  drawButtons();
  textSize(15);
  text('O for a cookie.', leftside, dy - 320);
  text('R for some filling.', leftside, dy - 230);
  text('backspace to undo.', leftside, dy - 150);
  text('C to clear the stack.', leftside, dy - 60);

  // draw a phat cookie
  drawOreos();
}
