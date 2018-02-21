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

    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render } );

    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'background', 'assets/background.jpg' );
        game.load.image('bar', 'assets/bar.png');
        game.load.image('ball', 'assets/ball.png');
        game.load.image('star', 'assets/star_small.png');
        game.load.image('dot', 'assets/whitedot.png');
        game.load.image('pink', 'assets/pink.png');
        game.load.image('blue', 'assets/blue.png');
        game.load.image('green', 'assets/green.png');
        game.load.image('purple', 'assets/purple.png');

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
    var star; // make a group
    var keys;
    var oldCenter;
    var stars;
    var pink, yellow, green, blue;
    var code, style_text, text_star;


    function create() {
        //sky = game.add.sprite(0, 0, 'background');
        // Create a sprite at the center of the screen using the 'logo' image.
        stars = [];
        for(var i = 0; i < 1200; i++){
            stars.push(game.add.image(game.world.randomX, game.world.randomY, 'dot'));
        }
        ball = game.add.sprite( game.world.centerX, game.world.centerY, 'ball' );
        leftbar = game.add.sprite(200, game.world.centerY, 'bar');
        rightbar = game.add.sprite(600, game.world.centerY, 'bar');
        star = game.add.sprite(250, game.world.centerY, 'star');
        pink = game.add.sprite(400, 80, 'pink');// experimental
        pink.anchor.setTo(0.5);
        code = game.rnd.integerInRange(65, 90);
        style_text = { font: "20px Arial",  fill: "#ffffff", backgroundColor: "#000000" };

        text_star = game.add.text(0, 0, String.fromCharCode(code), style_text);
        console.log(String.fromCharCode(code));
        keys = {};
        oldCenter = ball.world.y;

        // set keyboard controls to whatever Math.random generates
        var i;
        for(i = Phaser.Keyboard.A; i != (Phaser.Keyboard.Z + 1); i++){
            keys[i] = game.input.keyboard.addKey(i);
        }
        keys[Phaser.Keyboard.UP] = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        keys[Phaser.Keyboard.DOWN] = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        keys[Phaser.Keyboard.LEFT] = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        keys[Phaser.Keyboard.RIGHT] = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);


        ball.anchor.setTo( 0.5, 0.5 );
        game.camera.follow( ball, 0, 0, 0.5 );
        game.camera.bounds = null;
        ball.scale.setTo(0.25);
        star.anchor.setTo( 0.5, 0.5 );
        //star.scale.setTo(0.05);
        // Turn on the arcade physics engine for this sprite.
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //  Set the world (global) gravity
        game.physics.arcade.gravity.y;
        game.physics.enable( ball, Phaser.Physics.ARCADE );
        game.physics.enable( leftbar, Phaser.Physics.ARCADE );
        game.physics.enable( rightbar, Phaser.Physics.ARCADE );
        game.physics.enable( star, Phaser.Physics.ARCADE );
        game.physics.enable(pink, Phaser.Physics.ARCADE);



        // keyboard controls for right and left bar
        leftU = keys[Phaser.Keyboard.W];
        leftD = keys[Phaser.Keyboard.S];
        rightU = keys[Phaser.Keyboard.UP];
        rightD = keys[Phaser.Keyboard.DOWN];// can change orientation later


        ball.body.allowGravity = true;
        leftbar.body.immovable = true;
        leftbar.body.allowGravity = false;
        rightbar.body.immovable = true;
        rightbar.body.allowGravity = false;
        star.body.immovable = true;
        star.body.allowGravity = false;

        ball.body.velocity.setTo(150,40);
      //  ball.body.bounce.setTo(1,1);




        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
        text.anchor.setTo( 0.5, 0.0 );
    }

    function ballHitLeft(ball, leftbar){
      //var diff = 0;
      ball.body.velocity.x = 300;
      ball.body.velocity.y = -100;
      console.log("hit left");
    }

    function ballHitRight(ball, rightbar){
      ball.body.velocity.x = -300;
      ball.body.velocity.y = -100;
      console.log("hit right");
    }

    function ballHitStar(ball, star){
      var diff = ball.body.x - star.body.y;
      if(diff < 0){ // ball hit star on left side
        ball.body.velocity.x = 200;
      }
      else{
        ball.body.velocity.x = -200;
      }

      star.destroy();
      console.log("star gone");
    }

    function skyMake(){
        for(var i = 0; i < 20; i++){
            stars.push(game.add.image(game.world.randomX, ball.world.y - game.height/2 - game.rnd.realInRange(0, 10), 'dot'));
        }
        oldCenter = ball.world.y;
        for(var j = 0; j < 20; j++){
          stars[0].destroy();
          stars.splice(0,1);
        }

        game.world.bringToTop(leftbar);
        game.world.bringToTop(rightbar);
        game.world.bringToTop(ball);

    }

    function ballHitPink(){

       rightU = keys[code];
       pink.destroy();
       console.log("hit pink");
    }



    function render(){
      // game.debug.text(game.world.position, 25,25, "#ffffff");
      // game.debug.text("Ball: " + ball.position, 25,50, "#ffffff");
      game.debug.text('A'.charCodeAt(0) + 1, 25,50,'#ffffff');
      //console.log(game.world.position);
    }


    function update() {

      game.physics.arcade.collide(ball, leftbar, ballHitLeft, null, this);
      game.physics.arcade.collide(ball, rightbar, ballHitRight, null, this);
      game.physics.arcade.collide(ball, star, ballHitStar, null, this);
      game.physics.arcade.collide(ball, pink, ballHitPink, null, this);

      text_star.x = pink.x - 5;
      text_star.y = pink.y + (pink.height/2);

      if(ball.world.y - oldCenter < -20){
        skyMake();
      }

      if(leftU.isDown){
         leftbar.y -= 10;
      }
      if(leftD.isDown){
        leftbar.y += 10;
      }
      if(rightU.isDown){
        rightbar.y -= 10;
      }
      if(rightD.isDown){
        rightbar.y += 10;
      }


    }

};
