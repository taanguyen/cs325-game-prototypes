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
        game.load.spritesheet('chicken', 'assets/chicken_crop.png', 47, 46);

    }

    var chick;
    var cursors;
    let butcher;
    var ground;
    let knife;

    function create() {
        // add forest background to game
        game.add.sprite(0, 0, 'kitchen');
        // Create a sprite at the center of the screen using the chicken sprite
        chick = game.add.sprite(0, game.world.centerY + 100, 'chicken' );

        ground = game.add.sprite(0,445,'ground');

        //knives = game.add.group();

        //knives.create( Math.random() * 200 * (i + 20)/(i*4) + Math.random() * 30 * (i*i), 0, 'butcher');


        //butcher = game.add.sprite(game.world.centerX, 0, 'butcher' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        chick.anchor.setTo( 0.5, 0.5 );
        chick.scale.setTo(1.5);
        game.physics.startSystem(Phaser.Physics.ARCADE);


        // set gravity
        game.physics.arcade.gravity.y = 200;
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( chick, Phaser.Physics.ARCADE );
        game.physics.enable( ground, Phaser.Physics.ARCADE );

        ground.body.immovable = true;
        ground.body.allowGravity = false;


        chick.body.collideWorldBounds = true;

        chick.animations.add('left', [4, 5], 10, true);
        chick.animations.add('right', [7, 8], 10, true);

        // add keyboard inputs
        cursors = game.input.keyboard.createCursorKeys();
        game.time.events.repeat(Phaser.Timer.SECOND/2, 10, createKnife, this);

        chick.body.onCollide = new Phaser.Signal();
        //chick.body.onCollide.add(chickDie(this,knife), this);

        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
        text.anchor.setTo( 0.5, 0.0 );
    }


      function createKnife() {

      //  A bouncey ball sprite just to visually see what's going on.

      knife = game.add.sprite(game.world.randomX, 0, 'knife');

      game.physics.enable(knife, Phaser.Physics.ARCADE);
    //  game.physics.arcade.collide(knife, ground);



      knife.body.collideWorldBounds = true;

     }

    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        //bouncy.rotation = game.physics.arcade.accelerateToPointer( chick, game.input.activePointer, 500, 500, 500 );
        //  Reset the players velocity (movement)
        chick.body.velocity.x = 0;
        game.physics.arcade.collide(chick, ground);
        game.physics.arcade.collide(knife, ground);
        //knives.create( Math.random() * 200,  Math.random() * 30, 0, 'butcher');


        if (cursors.left.isDown)
        {
            //  Move to the left
            chick.body.velocity.x = -150;

            chick.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            chick.body.velocity.x = 150;

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
