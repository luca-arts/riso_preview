let ditherType = 'atkinson';
let imgscale = 512;
let dithermode = false;
let colormode = false;
let debugmode = true;
let helptext = true;
let halftonemode = false;
let threshold = 128;
var layer1,layer2,layer3,layer4;
let layercolor = [2,11,16,18];
let layerdither = [3,3,3,3];
let layerthreshold = [128,128,128,128];
let layerhalftone = [false,false,false,false];
let layerhtdither = ['n','n','n','n'];
let halftonesubmodes  = ['dots', 'freq', 'rot', 'intensity']
let halftonesubmode = 0;
let dots = ["line", "square", "circle", "ellipse", "cross"];
let htdots = ["line","line","line","line"]; 
let htfreq = [3,3,3,3];
let htrot = [45,45,45,45];
let htintensity = [90,90,90,90]
let currentlayer = 1;
let dithertypes = ['atkinson','floydsteinberg','bayer','none'];
let ditherindex = 0;
//  head1, head2, info, qr, back



function preload() {
   head1 = loadImage('data/head1.png');
   head2 = loadImage('data/head2.png');
   info = loadImage('data/text.png');
   qr = loadImage('data/qr.png');
   back = loadImage('data/backgradient.png');
  // let reds = extractRGBChannel(head1, "red");
  // let blues = extractRGBChannel(head2, "blue");
}

function setup() {
  pixelDensity(1);
  createCanvas(imgscale,imgscale);
  // layer1color = 
  regenLayers();
  noLoop();
}

function draw() {
  background(255);
  // console.log()
  if (dithermode){  
    threshold = map(mouseX, 0, width, 0, 255);
    layerthreshold[currentlayer] = threshold;
  }
  if (halftonemode){
    if (halftonesubmodes[halftonesubmode] == 'dots'){ //The third is the frequency of dots, measured in lpi (lines per inch), with a default value of 10.
      htdots[currentlayer] = dots[int(map(mouseX, 0, width, 0, 5))];
    }
   if (halftonesubmodes[halftonesubmode] == 'freq'){ //The third is the frequency of dots, measured in lpi (lines per inch), with a default value of 10.
      htfreq[currentlayer] = int(map(mouseX, 0, width, 0, 50));
    }
    else if (halftonesubmodes[halftonesubmode]  == 'rot'){ //The fourth one is the angle to rotate overlapping patterns to reduce interference (default value 45). 
      htrot[currentlayer] = radians(map(mouseX, 0, width, 0, 360));
    }
    else if (halftonesubmodes[halftonesubmode]  == 'intensity'){ //The fifth parameter is intensity, which will dither the result at the given threshold (default value 127).
      htintensity[currentlayer] = int(map(mouseX, 0, width, 0, 255));
    }
  }
  clearRiso();  
  

  // let threshold = 0;
  var dithered1 = ditherImage(back, dithertypes[layerdither[0]], layerthreshold[0]);
  var dithered2 = ditherImage(head1, dithertypes[layerdither[1]], layerthreshold[1]);
  var dithered3 = ditherImage(head2, dithertypes[layerdither[2]], layerthreshold[2]);
  var dithered4 = ditherImage(info, dithertypes[layerdither[3]], layerthreshold[3]);

  var halftoned1 = halftoneImage(back, htdots[0], htfreq[0], htrot[0], htintensity[0]); // pass image to halftone with line dots, frequency of 3, angle of 45, and intensity of 90.
  var halftoned2 = halftoneImage(head1, htdots[1], htfreq[1], htrot[1], htintensity[1]); // pass image to halftone with line dots, frequency of 3, angle of 45, and intensity of 90.
  var halftoned3 = halftoneImage(head2, htdots[2], htfreq[2], htrot[2], htintensity[2]); // pass image to halftone with line dots, frequency of 3, angle of 45, and intensity of 90.
  var halftoned4 = halftoneImage(info, htdots[3], htfreq[3], htrot[3], htintensity[3]); // pass image to halftone with line dots, frequency of 3, angle of 45, and intensity of 90.
  // layer4.image(halftoned, 0, 0); // draw halftoned image

  layer1.imageMode(CENTER);
  layer2.imageMode(CENTER);
  layer3.imageMode(CENTER);
  layer4.imageMode(CENTER);

  var img1,img2,img3,img4;

  if (layerhtdither[0] == 'h') {
    img1 = halftoned1;
  } else {
    img1 = dithered1;
  }  
  if (layerhtdither[1] == 'h') {
    img2 = halftoned2;
  } else {
    img2 = dithered2;
  }
  if (layerhtdither[2] == 'h') {
    img3 = halftoned3;
  } else {
    img3 = dithered3;
  }
  if (layerhtdither[3] == 'h') {
    img4 = halftoned4;
  } else {
    img4 = dithered4;
  }
  var mergedqr = mergeImgs(img2,qr)
  var mergedinfo = mergeImgs(img3, info)

  layer1.image(img1, width / 2, height / 2, imgscale,imgscale);
  layer2.image(mergedqr, width / 2, height / 2, imgscale,imgscale);
  layer3.image(mergedinfo, width / 2, height / 2,  imgscale,imgscale);
  // layer4.image(dithered4, width / 2, height / 2,  imgscale,imgscale);

  // let textGraphic = createGraphics(width, height);
  // textGraphic.fill(0);
  // textGraphic.textStyle(BOLD);
  // textGraphic.textFont('Helvetica');
  // textGraphic.textAlign(CENTER, CENTER);
  // textGraphic.textSize(80);
  // textGraphic.text('ABOLISH', width * 0.5, height * 0.7);

  // blue.cutout(textGraphic);d

  drawRiso();


  if (debugmode) {
    // text("The keyCode of the key pressed", 60, 160);
    // textSize(52);
    // fill("black");
    // text(keyCode, 160, 220);
    drawDebug();
   }
   if (helptext) {
    drawHelp();
  }  
  noLoop();

}

function mousePressed() {
  // exportRiso();
}

function keyReleased() {
  if (key == 1) currentlayer = 0; 
  if (key == 2) currentlayer = 1; 
  if (key == 3) currentlayer = 2; 
  if (key == 4) currentlayer = 3; 
  // console.log(ditherType);

  if (key =='d') {
    colormode = false;
    halftonemode = false;
    if (dithermode) { 
      dithermode = false;
      layerhtdither[currentlayer] = 'n';
    }
    else {dithermode = true;
      layerhtdither[currentlayer] = 'd';
     }
  } 
  if (dithermode == true) {

    if (keyCode == 37) {
      // console.log(layerdither);
      layerdither[currentlayer] = layerdither[currentlayer] - 1;
    //   console.log(layerdither);
      if (layerdither[currentlayer] < 0) { layerdither[currentlayer] = 3;}
      // layerdither[currentlayer]  = dithertypes[layerdither[currentlayer]];
    //   console.log(layerdither);

    }
    if (keyCode == 39) {
      layerdither[currentlayer] = layerdither[currentlayer] + 1;
      if (layerdither[currentlayer] > 3) { layerdither[currentlayer] = 0;}
      // layerdither[currentlayer]  = dithertypes[layerdither[currentlayer]];
      // dithertypes[layerdither[currentlayer]]
    }
  }
  if (key =='h') {
    dithermode = false;
    colormode = false;
    if (halftonemode) { 
      layerhtdither[currentlayer] = 'n';
      halftonemode = false;}
    else {
        halftonemode = true; 
        layerhtdither[currentlayer] = 'h'
      }

  }
  if (halftonemode) {
    if (keyCode == 37) {
      halftonesubmode = halftonesubmode - 1
      if (halftonesubmode < 0) { halftonesubmode = 3}
    }
    if (keyCode == 39) {
      halftonesubmode = halftonesubmode - 1
      if (halftonesubmode >= 3) { halftonesubmode = 0}
    }

  }

  if (key =='c') {
    dithermode = false;
    halftonemode = false;
    if (colormode) { colormode = false;}
    else {colormode = true;}
  } 
  if (colormode == true) {

    
    if (keyCode == 37) {
      newcolor = layercolor[currentlayer] -1;
      if (newcolor < 0) { newcolor = RISOCOLORS.length-1;}
      layercolor[currentlayer] = newcolor;
      regenLayers()
    }
    if (keyCode == 39) {
      newcolor = layercolor[currentlayer] +1;
      if (newcolor >= RISOCOLORS.length) { newcolor = 0;}
      layercolor[currentlayer] = newcolor;
      regenLayers();
    }


  }
  if (keyCode == 32) {
    if (debugmode) {debugmode=false;}
    else {debugmode = true;}
  }  
  if (keyCode == 191) {
    if (helptext) {helptext=false;}
    else {helptext = true;}
  }
  console.log("dithermode = ", dithermode, 'ditherType = ', ditherType, threshold, layerdither);
  console.log("colormode = ", colormode, 'currentlayer = ', currentlayer, RISOCOLORS[layercolor[currentlayer]].name);
  console.log("halftonemode = ", layerhtdither, 'currentlayer = ', currentlayer, htdots[currentlayer], htfreq[currentlayer], htrot[currentlayer], htintensity[currentlayer]);
  
  if (key == 'e') {
    exportRiso();
}
    loop();

}


function mergeImgs(img1,img2) {
  //for now works on 2 images same size as stage
  let Img = createGraphics(width, height);
  Img.image(img1,0,0,width,height)
  Img.image(img2,0,0,width,height)
  return Img;
}

function regenLayers(){
  layer1 = new Riso(RISOCOLORS[layercolor[0]].name);
  layer2 = new Riso(RISOCOLORS[layercolor[1]].name);
  layer3 = new Riso(RISOCOLORS[layercolor[2]].name);  
  layer4 = new Riso(RISOCOLORS[layercolor[3]].name);
}


function drawDebug() {
  textAlign(LEFT)
  fill(0,200);
  noStroke();
  rect(10,height - 110, 492, 100);
  noFill();
  stroke(255);
  rect(100, height - 105 + currentlayer*20, 400, 20)
  fill(255);
  noStroke();
  
  textSize(10);

  fill(255,0,0);

  if (dithermode) {
    text("dither",405, height- 15);
    noFill();
    stroke(255,0,0);
    rect(405, height -105, 95,80);
    noStroke();
  }
  if (colormode) {
    text("color",260, height- 15);
    noFill();
    stroke(255,0,0);
    rect(260, height -105, 145,80);
    noStroke();
    
  }
  if (halftonemode) {
    text("halftone",100, height- 15);
    text(halftonesubmodes[halftonesubmode] , 160,height- 15);
    noFill();
    stroke(255,0,0);
    rect(100, height -105, 140,80);
    if (halftonesubmode == 0){rect(100, height -105, 40,80);}
    if (halftonesubmode == 1){rect(140, height -105, 35,80);}
    if (halftonesubmode == 2){rect(175, height -105, 35,80);}
    if (halftonesubmode == 3){rect(210, height -105, 30,80);}
    noStroke();

  }

  textAlign(RIGHT);
  fill(255);
  if (layerhtdither[0] == 'h') {
    text(str(htdots[0]), 135,height - 90);
    text(str(htfreq[0]), 175,height - 90);
    text(str(int(degrees(htrot[0]))) , 205,height - 90);
    text(str(htintensity[0]), 235,height - 90);
  }
  if (layerhtdither[1] == 'h') {
    text(str(htdots[1]), 135,height - 70);
    text(str(htfreq[1]), 175,height - 70);
    text(str(int(degrees(htrot[1]))) , 205,height - 70);
    text(str(htintensity[1]), 235,height - 70);
  }
  if (layerhtdither[2] == 'h') {
    text(str(htdots[2]), 135,height - 50);
    text(str(htfreq[2]), 175,height - 50);
    text(str(int(degrees(htrot[2]))) , 205,height - 50);
    text(str(htintensity[2]), 235,height - 50);  
  }
  if (layerhtdither[3] == 'h') {
    text(str(htdots[3]), 135,height - 30);
    text(str(htfreq[3]), 175,height - 30);
    text(str(int(degrees(htrot[3]))) , 205,height - 30);
    text(str(htintensity[3]), 235,height - 30);  
  }



  fill(RISOCOLORS[layercolor[0]].color);
  text(str(layercolor[0]) + " " + RISOCOLORS[layercolor[0]].name, 400,height - 90);
  fill(RISOCOLORS[layercolor[1]].color);
  text(str(layercolor[1]) + " " + RISOCOLORS[layercolor[1]].name, 400,height - 70);
  fill(RISOCOLORS[layercolor[2]].color);
  text(str(layercolor[2]) + " " + RISOCOLORS[layercolor[2]].name, 400,height - 50);
  fill(RISOCOLORS[layercolor[3]].color);
  text(str(layercolor[3]) + " " + RISOCOLORS[layercolor[3]].name, 400,height - 30);

  textAlign(LEFT);
  fill(255);
  textSize(9);

  if (layerhtdither[0] == 'd'){
    text(dithertypes[layerdither[0]] + " " + str(int(layerthreshold[0])),410 ,height - 90);
  }
  if (layerhtdither[1] == 'd'){
    text(dithertypes[layerdither[1]] + " " + str(int(layerthreshold[1])),410 ,height - 70);
  }
  if (layerhtdither[2] == 'd'){
    text(dithertypes[layerdither[2]] + " " + str(int(layerthreshold[2])),410 ,height - 50);
  }
  if (layerhtdither[3] == 'd'){
    text(dithertypes[layerdither[3]] + " " + str(int(layerthreshold[3])),410 ,height - 30);
  }
}


function  drawHelp() {
  push();
  translate(0,200);
  fill(0,180)
  rect(10,0,250,100);
  fill(255);
  text("1-2-3-4 to select operating layer", 20, 12);
  text("'d' to enable dithermnode", 20,22);
  text("'c' to enable colormode", 20,32);
  text("arrow left/right to cycle options", 20,42);
  text("in dithermode move mouseX to set threshold", 20,52);
  text("? to hide/show this text", 20,62);
  text("press spacebar to hide the feedback window", 20,72);
  text("press 'e' to export riso layers", 20,82);
  pop();
}