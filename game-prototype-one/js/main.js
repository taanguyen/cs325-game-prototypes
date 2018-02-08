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
        game.load.image( 'logo', 'assets/pichu.png' );
        game.load.image('cookie', 'assets/blowkiss.png');
        game.load.audio('eaten', 'assets/eaten.mp3');
    }


    var bouncy;
    let button;
    let cookie;
    let array;
    let sound;

    function create() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
        button = game.input.keyboard.createCursorKeys();
        sound = game.add.audio('eaten');
        // Create a sprite at the center of the screen using the 'logo' image.
        bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
        array = [];
        for(let i = 0; i < 5; i++){

          array.push(game.add.sprite(Math.random() * game.world.width, Math.random() * game.world.height, 'cookie'));

        }
        game.physics.arcade.gravity.y = 100;
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        bouncy.anchor.setTo( 0.5, 0.5 );

        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        game.physics.enable( array, Phaser.Physics.ARCADE );
        array.forEach(function(cookie){
          cookie.body.immovable = true;

          cookie.body.moves = false;
        });
        // Make it bounce off of the world bounds.
        bouncy.body.collideWorldBounds = true;

        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#ff50ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Eat cookies. Use arrow keys.", style );
        text.anchor.setTo( 0.5, 0.0 );
        // change background to white
        game.stage.backgroundColor = "#a6aab2";
         // event handler for pichu eating cookie
        bouncy.body.onCollide = new Phaser.Signal();
        bouncy.body.onCollide.add(eatCookie, this);
    }

    function eatCookie(sprite1, sprite2){
      sprite2.destroy(); // pichu ate cookie
      sound.play();

    }

    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        if (button.up.isDown)
        {
          // move sprite down
          bouncy.body.velocity.y -= 10;
        }

        else if (button.down.shiftKey)
        {
          bouncy.body.velocity.y += 10;
        }

        else if (button.left.isDown)
        {
          bouncy.body.velocity.x -= 10;
        }
        else if (button.right.isDown)
        {
          bouncy.body.velocity.x += 10;
        }

        //check for collision
        game.physics.arcade.collide(bouncy, array);
    }
};
