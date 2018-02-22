"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".

    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update} );

    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'background', 'assets/background.jpg' );
        game.load.image('bar', 'assets/bar.png');
        game.load.image('ball', 'assets/ball.png');
        game.load.image('star (1)', 'assets/star (1).png');
        game.load.image('star (2)', 'assets/star (2).png');
        game.load.image('star (3)', 'assets/star (3).png');
        game.load.image('star (4)', 'assets/star (4).png');
        game.load.image('star (5)', 'assets/star (5).png');
        game.load.image('dot', 'assets/whitedot.png');

    }

  //  var sky;
    var leftbar;
    var rightbar;
    var ball;
    var cursors;
    var leftU;
    var leftD;
    var rightU;
    var rightD;
    var star, stars; // make a group
    var keys;
    var oldCenter;
    var dots;

    var leftbound, rightbound;
    var points;
    var starSpawn;
    var pointsText;

    // user controls
    var leftUText, leftDText, rightUText, rightDText;

    class Star {
      constructor() {
        this.i = game.rnd.integerInRange(1,5);
        this.image =  game.add.sprite(game.rnd.integerInRange(leftbound + 50, rightbound - 50),
        ball.position.y - game.rnd.integerInRange(game.height, game.height * 1.5), 'star (' + this.i + ')');
        this.text = game.add.text(this.image.position.x, this.image.position.y - 20, "",
         {
           fontSize: 20,
           fill: "#ffffff"
         });
        game.physics.arcade.enable(this.image);
        this.image.body.immovable = true;
        this.image.body.allowGravity = false;
        game.world.bringToTop(this.image);

        this.code = game.rnd.integerInRange(65,90);
        if(this.i != 1){
          this.text.setText(String.fromCharCode(this.code));

        }
      }

      changePaddleKey(ball){
          if(new Phaser.Rectangle(ball.position.x, ball.position.y, ball.width, ball.height).intersects(
            new Phaser.Rectangle(this.image.x, this.image.y, this.image.width, this.image.height))){
              ball.body.velocity.setMagnitude(0.7*ball.body.velocity.getMagnitude());
              switch(this.i){
                  case 2:
                    leftU = keys[this.code];
                    break;
                  case 3:
                    leftD = keys[this.code];
                    break;
                  case 4:
                    rightU = keys[this.code];
                    break;
                  case 5:
                    rightD = keys[this.code];
                    break;
              }
              points++;
              return true;
          }
          return false;
      }

      destroy(){
          this.image.destroy();
          this.text.destroy();
      }

    getText(){
        return String.fromCharCode(code);
      }

    }

    function create() {
        //sky = game.add.sprite(0, 0, 'background');
        // Create a sprite at the center of the screen using the 'logo' image.
        dots = [];
        points = 0;
        starSpawn = 0;
        leftbound = 50;
        rightbound = 750;
        for(var i = 0; i < 1200; i++){
            dots.push(game.add.image(game.world.randomX, game.world.randomY, 'dot'));
        } // make the night sky look
        ball = game.add.sprite( game.world.centerX, game.world.centerY, 'ball' );
        leftbar = game.add.sprite(leftbound, game.world.centerY, 'bar');
        rightbar = game.add.sprite(rightbound, game.world.centerY, 'bar');
        stars = [];

        leftUText = game.add.text(0,0,"", {fontSize:20, backgroundColor: "#0079f2"}); //blue
        leftDText = game.add.text(0,50,"",{fontSize:20, backgroundColor: "#00b359"}); // green
        rightUText = game.add.text(175, 0,"",{fontSize:20, backgroundColor: "#ff80bf"}); //pink
        rightDText = game.add.text(175, 50,"",{fontSize:20, backgroundColor: "#800080"});// purple
        pointsText = game.add.text(game.world.centerX, 50,"",{fontSize:20, fill: "#ffffff"});// points


        leftUText.fixedToCamera = true;
        leftDText.fixedToCamera = true;
        rightUText.fixedToCamera = true;
        rightDText.fixedToCamera = true;
        pointsText.fixedToCamera = true;

        keys = {};
        oldCenter = ball.world.y;

        // set keyboard controls to whatever Math.random generates
        var i;
        for(i = Phaser.Keyboard.A; i != (Phaser.Keyboard.Z + 1); i++){
            keys[i] = game.input.keyboard.addKey(i);
        }

        ball.anchor.setTo( 0.5, 0.5 );
        game.camera.follow( ball, 0, 0, 0.5 );
        game.camera.bounds = null;
        ball.scale.setTo(0.25);

        //star.scale.setTo(0.05);
        // Turn on the arcade physics engine for this sprite.
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //  Set the world (global) gravity
        game.physics.arcade.gravity.y;
        game.physics.enable( ball, Phaser.Physics.ARCADE );
        game.physics.enable( leftbar, Phaser.Physics.ARCADE );
        game.physics.enable( rightbar, Phaser.Physics.ARCADE );




        // keyboard controls for right and left bar
        leftU = keys[Phaser.Keyboard.W];
        leftD = keys[Phaser.Keyboard.S];
        rightU = keys[Phaser.Keyboard.I];
        rightD = keys[Phaser.Keyboard.K];// can change orientation later


        ball.body.allowGravity = true;
        leftbar.body.immovable = true;
        leftbar.body.allowGravity = false;
        rightbar.body.immovable = true;
        rightbar.body.allowGravity = false;

        ball.body.velocity.setTo(150,40);
      //  ball.body.bounce.setTo(1,1);




        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Collect Stars. Earn Points!", style );
        text.anchor.setTo( 0.5, 0.0 );
    }

    function ballHitLeft(ball, leftbar){
      //var diff = 0;
      ball.body.velocity.x = 300;
      ball.body.velocity.y = -100;

    }

    function ballHitRight(ball, rightbar){
      ball.body.velocity.x = -300;
      ball.body.velocity.y = -100;

    }



    function skyMake(){
        for(var i = 0; i < 20; i++){
            dots.push(game.add.image(game.world.randomX, ball.world.y - game.height/2 - game.rnd.realInRange(0, 10), 'dot'));
        }
        oldCenter = ball.world.y;
        for(var j = 0; j < 20; j++){
          dots[0].destroy();
          dots.splice(0,1);
        }

        game.world.bringToTop(leftbar);
        game.world.bringToTop(rightbar);
        game.world.bringToTop(ball);

    }





    function destroyStarsBelowScreen(){ // get rid of stars off screen
      stars.forEach(function(star){
          if(star.image.position.y > (game.world.centerY - (0.5*game.world.height))){
            star.destroy();
            stars.splice(stars.indexOf(star), 1);
          }
      });
    }




    function update() {
      if(ball.world.y - oldCenter < -20){
        skyMake();
        destroyStarsBelowScreen();
      }

      game.physics.arcade.collide(ball, leftbar, ballHitLeft, null, this);
      game.physics.arcade.collide(ball, rightbar, ballHitRight, null, this);

      // update UI
      leftUText.setText("Left UP: " + String.fromCharCode(leftU.keyCode) + "  ");
      leftDText.setText("Left DOWN: " + String.fromCharCode(leftD.keyCode)+ "  ");
      rightUText.setText("Right UP: " + String.fromCharCode(rightU.keyCode) + "  ");
      rightDText.setText("Right DOWN: " + String.fromCharCode(rightD.keyCode) + "  ");
      pointsText.setText("POINTS: " + points);

      if(ball.position.x < 0 || ball.position.x > game.width){
          let centerText = game.add.text(game.world.width/2,game.world.height/2,"GAME OVER", {fill:"#ffff50"});
          centerText.fixedToCamera = true;
          centerText.anchor.setTo(0.5);
          game.physics.arcade.isPause = true;
      }


      if(game.time.now >= starSpawn){
        stars.push(new Star());
        starSpawn = 2000 + game.time.now;
      }

      for(var i = 0; i  < stars.length; i++){
          if(stars[i].changePaddleKey(ball)){
            stars[i].destroy();
            stars.splice(i, 1);
            break;
          }
      }



      if(leftU.isDown){
         leftbar.y -= 10;
      }
      else if(leftD.isDown){
        leftbar.y += 10;
      }
      if(rightU.isDown){
        rightbar.y -= 10;
      }
      else if(rightD.isDown){
        rightbar.y += 10;
      }


    }

};
