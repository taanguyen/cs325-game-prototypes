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

    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'kitchen', 'assets/kitchen.png');
        this.load.image('ground', 'assets/ground.png');
        game.load.image( 'knife', 'assets/butcher.png');
        game.load.image('gum', 'assets/gum30.png');
        game.load.audio('jazz', 'assets/jazz.mp3');
        game.load.spritesheet('chicken', 'assets/chicken_crop.png', 47, 46);


    }

    var chick;
    var cursors;
    let butcher;
    var ground;
    let knife;
    let knives;
    let text;
    let style;
    let knifeMade;
    let dazed;
    let gum;
    let dazedTime;
    let gumTime;
    let sound;

    function create() {
        // add kitchen background to game
        game.add.sprite(0, 0, 'kitchen');
        // Create a sprite at the center of the screen using the chicken sprite
        chick = game.add.sprite(0, game.world.centerY + 100, 'chicken' );

        ground = game.add.sprite(0,445,'ground');
        knives = [];

        chick.anchor.setTo( 0.5, 0.5 );
        chick.scale.setTo(1.5);
        game.physics.startSystem(Phaser.Physics.ARCADE);

        sound = game.add.audio('jazz');
        sound.play();
        // set gravity
        game.physics.arcade.gravity.y = 200;
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( chick, Phaser.Physics.ARCADE );
        game.physics.enable( ground, Phaser.Physics.ARCADE );

        chick.body.friction.x = 0.9;
        ground.body.immovable = true;
        ground.body.allowGravity = false;

        chick.body.collideWorldBounds = true;

        chick.animations.add('left', [4, 5], 10, true);
        chick.animations.add('right', [7, 8], 10, true);

        // add keyboard inputs
        cursors = game.input.keyboard.createCursorKeys();
        //game.time.events.repeat(Phaser.Timer.SECOND/2, 100, createKnife, this);

        chick.body.onCollide = new Phaser.Signal();

        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        style = { font: "25px Verdana", fill: "#000000", align: "center" };
        text = game.add.text( game.world.centerX, 15, "Dodge knives.", style );
        text.anchor.setTo( 0.5, 0.0 );



        knifeMade = game.time.now + 1000;
        gumTime = game.time.now + 2000;


    }


      function createKnife() {

      knife = game.add.sprite(game.world.randomX, 0, 'knife');
      knives.push(knife);
      game.physics.enable(knife, Phaser.Physics.ARCADE);
      knife.body.onCollide = new Phaser.Signal();

    //  game.physics.arcade.collide(knife, ground);

      knife.body.onCollide.add(chickDie, this);
      knife.body.collideWorldBounds = true;
      knifeMade = game.time.now + 500;

     }
     // make chicken disappear after it's been hit
     function chickDie(sprite1, sprite2) {
       sprite2.kill();// assume chick is sprite2
       text.destroy();
       text = game.add.text( game.world.centerX, game.world.centerY, "GAME OVER", style );
       text.anchor.setTo( 0.5, 0.0 );
       game.paused = true; // end game, pausing makes the game appear as if ended

     }

     function createDestroyGum(){

         if(gum != null){
           gum.destroy();
         }
         // if dazed, you hit gum, so if dazed and gum is not null, then destroy gum
         //if game time now + offset, if game time now > gum respawn, make new gum

         if(game.time.now > gumTime + 2000){
           gum = game.add.sprite((Math.random() > 0.30 ? chick.body.x + 100: chick.body.x - 100),450,'gum');
           gum.anchor.setTo(0,1);
           game.physics.enable(gum, Phaser.Physics.ARCADE);
           gum.body.immovable = true;
           gum.body.allowGravity = false;
           gum.body.onCollide = new Phaser.Signal();

           gum.body.onCollide.add((sprite1, sprite2) => {dazed = true; dazedTime = game.time.now + 2000;
             if(gum != null){
                gum.destroy();
           }
           }, this);
           gumTime = game.time.now + 4000;
         }


     }



    function update() {


        chick.body.velocity.x = 0;
        game.physics.arcade.collide(chick, ground);
        game.physics.arcade.collide(knives, chick); //check for collision with chick
        game.physics.arcade.collide(gum, chick);


       if(chick.body.blocked.right) {
         text = game.add.text( game.world.centerX, game.world.centerY, "YOU WON!", style );
         text.anchor.setTo( 0.5, 0.0 );
         game.paused = true;

       }

       if(game.time.now > gumTime){
         createDestroyGum();
       }


       if(game.time.now > dazedTime){
         dazed = false;
       }


        if(game.time.now > knifeMade){
              createKnife();
        }

        if (cursors.left.isDown)
        {
            //  Move to the left
            if(dazed){

              chick.body.velocity.x = -200;
            }
            else{
            chick.body.velocity.x = -350;
          }
          chick.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
          if(dazed){

            chick.body.velocity.x = 200;
          }
          else{
            //  Move to the right
            chick.body.velocity.x = 350;
          }

            chick.animations.play('right');
        }
        else
        {
            //  Stand still
            chick.animations.stop();

            chick.frame = 1;
        }

  }
};
