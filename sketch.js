// code by hannesvz

// https://github.com/hannesvz/oreoreoreo

let cy = 0,textsize = 30,textsizemax = 30;
let dx,dy,o1,o2,re,arial_rounded;

let current = ['o','r','o'];

let word = '';

let tick1, tick2 = 0;
let blink = true;

const leftside = 25;

const button_upscaled = 1.1;
const button_downscaled = 0.8;

function preload() {
  o1 = loadImage('o1.png');
  o2 = loadImage('o2.png');
  re = loadImage('re.png');
  arial_rounded = loadFont('arial_rounded.ttf');
}

function scaleImgUp() {
  this.size (this.width * 1.1, this.height * 1.1);
}

function scaleImgDefault() {
  this.size (o1.width * button_downscaled, o1.height * button_downscaled);
}

function setup() {
  frameRate(30);
  createCanvas(window.innerWidth, window.innerHeight);
  windowResized();

  btn_o = createImg('o1.png');
  btn_o.position(leftside, dy - 395);
  btn_o.mousePressed(()=>{ current.push('o'); });
  btn_o.size (o1.width * button_downscaled, o1.height * button_downscaled);
  btn_o.mouseOver(scaleImgUp);
  btn_o.mouseOut(scaleImgDefault);
  
  btn_r = createImg('re.png');
  btn_r.position(leftside, dy - 305);
  btn_r.size (o1.width * button_downscaled, o1.height * button_downscaled);
  btn_r.mouseOver(scaleImgUp);
  btn_r.mouseOut(scaleImgDefault);
  btn_r.mousePressed(()=>{ current.push('r'); });
  
  btn_b = createImg('backspace.png');
  btn_b.position(leftside, dy - 220);
  btn_b.size (o1.width * button_downscaled, o1.height * button_downscaled);
  btn_b.mouseOver(scaleImgUp);
  btn_b.mouseOut(scaleImgDefault);
  btn_b.mousePressed(()=>{ current.pop(); });
  
  btn_c = createImg('clear.png');
  btn_c.position(leftside, dy - 130);
  btn_c.size (o1.width * button_downscaled, o1.height * button_downscaled);
  btn_c.mouseOver(scaleImgUp);
  btn_c.mouseOut(scaleImgDefault);
  btn_c.mousePressed(()=>{ current = []; });
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  
  // calculate the width of the help text
  textFont(arial_rounded);
  strokeWeight(0);
  textSize(15);
  let textW = textWidth('backspace to undo.');
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
  rectMode(CENTER);
  image (o1, (window.innerWidth - 30) - o1.width, (dy - 60) - o1.height, o1.width / 2, o1.height / 2);
  image (re, (window.innerWidth - 40) - re.width, (dy - 30) - re.height, re.width / 2, re.height / 2);
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
  textSize(15);
  text('O for a cookie.', leftside, dy - 320);
  text('R for some filling.', leftside, dy - 230);
  text('backspace to undo.', leftside, dy - 150);
  text('C to eat the stack.', leftside, dy - 60);

  // draw a phat cookie
  drawOreos();
}
