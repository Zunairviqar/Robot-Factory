// Function to preload the images that are to be used in the Game
function preload() {
  upArrow = loadImage('assets/arrow_up.png');
  downArrow = loadImage('assets/arrow_down.png');
  leftArrow = loadImage('assets/arrow_left.png');
  rightArrow = loadImage('assets/arrow_right.png');
}

// Lists to store all the robots and the arrows
robots = [];
arrows = [];
// Keeps track of the number of arrows that have been created
let arrow_count;
// Y position of where the arrows are positioned on the screen
let arrowY;
// Keeping track of the score of the player
let score;

function setup() {
    var canvasMain = createCanvas(800,600);
    // set the ID on the canvas element
    canvasMain.id("p5_mainCanvas");
    // set the parent of the canvas element to the element in the DOM with
    // an ID of "left"
    canvasMain.parent("#center");

    // Setting the background initially
    background(0);
    // Starting off the arrow count with 1 as the program structure requires
    arrow_count = 1;
    // The very first y position for the first row of the arrows
    arrowY = height/8;
    // Sets the intial score to be 0
    score = 0;
}

function draw(){
    // Recreates the background on every frame
    background(120);
    noStroke();

    // For every 2 seconds, a new Robot is created
    if(frameCount %120==0){
      robots.push(new Robot(0,height/2-100, "right"))
    }

    // For the first 2 seconds, creates all the arrows at regular intervals
    if(frameCount %2==0 && arrows.length <49){
      // Adds a new arrow object to the list of arrows
      arrows.push(new Arrow(width/8*arrow_count,arrowY))
      // Increases the count of arrows
      arrow_count += 1;
      // Since one row can have a maximum of 7 arrows,
      if (arrow_count == 8){
        // The arrow count is reset for the next row
        arrow_count = 1;
        // The Y position for that row is incremented by 1/8th
        arrowY += height/8
      }
    }

    // Displaying the Robots and Moving them
    // Iterates through all the robots that have been created so far
    for (let i = 0; i < robots.length; i++) {
      // Display and move the robot
      robots[i].display();
      robots[i].move();
      // Calls the function to check if the Robot is Off the screen
      if (robots[i].isOffScreen() == true){
        // If so, it removes that Robot from the list for efficient usage of memory
        robots.splice(i, 1);
        // Continues so that the next if statement does not execute since that Robot has been deleted.
        continue;
      }
      // This checks if the Robot collides with the 'Black Exit RECTANGLE'
      if (robots[i].right > 780 && robots[i].y >= 200 && robots[i].y <= 400){
        // If so, it removes that specific robot from the list of robots
        robots.splice(i, 1);
        //  And increases the score by 1.
        score += 1;
      }
    }

    // Displaying the arrows and moving them
    // Iterates through all the arrows
    for (let j = 0;j < arrows.length; j++){
      // Displays each arrow on the screen.
      arrows[j].display();
    }

    fill(0);
    // Creates the Black Rectangle
    rect(780, 200,20, 200)
    // Writes the score on the screen
    text("Score: " + score, 730, 20)

}

// Function to check if the mouse is clicked
function mousePressed(){
  // Iterates through all the arrows
  for (let j = 0;j < arrows.length; j++){
    // Checks if the arrow is unlocked or has not been clicked 5 times already
    if (arrows[j].moving == "unlocked" && arrows[j].changeCount < 5){
      // Detects the click of the mouse with the arrow
      arrows[j].checkClick();
    }
  }
}


class Arrow {
  constructor(x,y){
    // Assigning the x and y positions of the Arrow
    this.x = x;
    this.y = y;
    // Choosing the direction at random
    this.direction = random(["up","down","left", "right"]);
    // 1/4th possibility of choosing locked
    this.moving = random(["unlocked","unlocked","unlocked", "locked"]);
    // Keeping track of the number of times the direction is changes
    this.changeCount = 0;
  }

  display(){

    // Choose the relevant image according to the arrow direction
    if (this.direction == "up"){
      this.pic = upArrow
    }
    if (this.direction == "down"){
      this.pic = downArrow
    }
    if (this.direction == "left"){
      this.pic = leftArrow
    }
    if (this.direction == "right"){
      this.pic = rightArrow
    }

    // If the arrow gets locked later, it creates a red circle around it
    if (this.changeCount == 5){
      fill(255,0,0);
      ellipse(this.x, this.y, 55)
    }
    // A white circle around locked arrows
    if (this.moving == "locked"){
      fill(255);
      ellipse(this.x, this.y, 55)
    }
    // Actually displays the image of the arrow
    imageMode(CENTER);
    image(this.pic,this.x,this.y)
    imageMode(CORNER);



  }
  // Checks if the Mouse was clicked over the arrow
  checkClick(){
      this.d = 0
      // Checks if the distance between mouse click and the center of the arrow is less than 25
      this.d = dist(this.x, this.y, mouseX, mouseY);
      if(this.d <= 25){
        // Changes the direction of the arrow in a sequential order.
        if (this.direction == "up"){
          this.direction = "right";
          // Adds to the number of times the arrow has changed direction.
          this.changeCount +=1;
        }
        else if (this.direction == "right"){
          this.direction = "down";
          this.changeCount +=1;
        }
        else if (this.direction == "down"){
          this.direction = "left";
          this.changeCount +=1;
        }
        else if (this.direction == "left"){
          this.direction = "up";
          this.changeCount +=1;
        }
      }

  }
}

class Robot {
  constructor(x,y, direction){
    // Assigning the x and y positions of the Robot
    this.x = x;
    this.y = y;

    // Choose the RGB color for the head at random
    this.headColorR =  random(255);
    this.headColorG =  random(255);
    this.headColorB =  random(255);
    this.headColor = color(this.headColorR, this.headColorG, this.headColorB);
    // Choose the RGB color for the body at random
    this.bodyColorR = random(255);
    this.bodyColorG = random(255);
    this.bodyColorB = random(255);
    this.bodyColor = color(this.bodyColorR, this.bodyColorG, this.bodyColorB);

    // Makes sure the head and body do not get the same color
    while (this.bodyColor == this.headColor){
      this.bodyColorR = random(255);
      this.bodyColorG = random(255);
      this.bodyColorB = random(255);
      this.bodyColor = color(this.bodyColorR, this.bodyColorG, this.bodyColorB);
    }

    // Choosing the size of the head from 25-50 pixels
    this.headSize = random(25,50);
    // The factor by which the body is larger than the head is chosen at random
    this.bodyFactor = random(1.2,1.4);
    // Calculates the bodySize of the Robot
    this.bodySize = this.headSize*this.bodyFactor;
    // The type of the eye is chosen at random
    this.eyeType = random(["visor", "rectangles", "ellipse"]);

    // The direction of the arrow is taken in as a parameter
    this.direction = direction;
    // Fixes speed of the robots
    this.speed = 1;

    // For the glowing semi-circle behing the Robot
    this.thrusterColor = 235;
    // The speed at which the color dims out
    this.thrusterColorSpeed = 3;
  }

  display(){
    noStroke();
    // The head is displayed
    fill(this.headColor);
    rect(this.x,this.y,this.headSize,this.headSize)
    // The body is displayed
    fill(this.bodyColor);
    rect(this.x - ((this.bodySize - this.headSize)/2), this.y + this.headSize,this.bodySize , this.bodySize)
    fill(255);
    // if the eye type is visor, a single rectangle is created
    if (this.eyeType == "visor"){
      rect(this.x+this.headSize/10, this.y+this.headSize/9,  this.headSize- this.headSize/10*2,this.headSize/3)
    }
    // If it is 'rectangle', two rectangles are creates
    else if (this.eyeType == "rectangles"){
      rect(this.x+this.headSize/6, this.y+this.headSize/9,  this.headSize- this.headSize/6*5,this.headSize/3)
      rect(this.x+this.headSize - (this.headSize/3)  , this.y+this.headSize/9,  this.headSize- this.headSize/6*5,this.headSize/3)
    }
    // Otherwise the eye type will be an ellipse so an ellipse is created
    else{
      ellipse(this.x + this.headSize/2, this.y + this.headSize/3, this.headSize/1.5, this.headSize/3)
    }

    // Drawing the legs as an extra feature
    fill(0);
    rect(this.x+this.headSize/12, this.y+this.headSize+this.bodySize,  this.headSize- this.headSize/6*5,this.headSize/3)
    rect(this.x+this.headSize - (this.headSize/4)  , this.y+this.headSize+this.bodySize,  this.headSize- this.headSize/6*5,this.headSize/3)
    // Calculating the x position of the 'right' side of the robot
    this.right = this.x + this.bodySize - ((this.bodySize - this.headSize)/2)
  }

  move(){
    // Checks the collision with the arrow
    for (let j = 0;j < arrows.length; j++){
      this.distance = dist(this.x + this.headSize/2, this.y + this.headSize, arrows[j].x, arrows[j].y)
      if (this.distance<=this.bodySize/2){
        this.direction = arrows[j].direction
      }
      // Draw a line between the arrow and the robot within a specifc distance range
      if (this.distance<=this.bodySize*2){
        // Uses the map function to calculate the stroke amount.
        this.sw = map(this.distance,this.bodySize/2, this.bodySize*2, 8, 1)
        stroke(0);
        // Applies the stroke
        strokeWeight(this.sw);
        // Creates a line
        line(arrows[j].x, arrows[j].y, this.x + this.headSize/2, this.y+this.headSize)
        strokeWeight(0);
      }

    }

    fill(this.thrusterColor,this.thrusterColor,0)
    // Changes the yellow color of the ellipse between a range from 100 to 235
    if (this.thrusterColor <=100){
      this.thrusterColorSpeed = -this.thrusterColorSpeed
    }
    if (this.thrusterColor >235){
      this.thrusterColorSpeed = -this.thrusterColorSpeed
    }

    this.thrusterColor -= this.thrusterColorSpeed;


    // Choose the direction of the yellow ellipse and draws it out according to the direction of the robot
    if (this.direction == "right"){
        this.x +=1;
        arc(this.x - (this.bodySize - this.headSize)/2 , this.y + this.headSize + this.bodySize/2, this.bodySize/2, this.bodySize/2, HALF_PI, -HALF_PI);
    }
    if (this.direction == "left"){
        this.x -=1;
        arc(this.x - (this.bodySize - this.headSize)/2 + this.bodySize, this.y + this.headSize + this.bodySize/2, this.bodySize/2, this.bodySize/2, -HALF_PI, HALF_PI);
    }
    if (this.direction == "up"){
        this.y -=1;
        arc(this.x + this.headSize/2, this.y+ this.headSize+ this.bodySize, this.bodySize/2, this.bodySize/2, 0, PI);
    }
    if (this.direction == "down"){
        this.y +=1;
        arc(this.x + this.headSize/2, this.y, this.bodySize/2, this.bodySize/2, PI, 0);
    }

  }
  // Checks if the Robot has gotten off screen
  isOffScreen() {
    // It the x position exceeds the width or the height or the opposite end of the screen
    if (this.x > width || this.x < 0 || this.y > height || this.y < 0) {
      return true;
    }
    return false;
  }
}
