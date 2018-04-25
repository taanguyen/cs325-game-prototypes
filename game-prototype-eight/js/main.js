"use strict";

window.onload = function() {


    var game = new Phaser.Game( 790, 750, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload() {
        // Load an image and call it 'logo'.
        PIXI.Sprite.defaultAnchor = {x : 0.5, y: 0.5};
        game.load.image('yellow', 'assets/yellow.png');
        game.load.image('green', 'assets/green.png');
        game.load.image('brown', 'assets/rsz_brown.png');
    }


    var cursors;
    var position = []; // player position in the game, relative to square grid
    var squares = new Array(4); // 4 x 4 grid
    var player;
    var left, right, up, down;
    var green, red;

    function create() {


        //position = [0,0];
        for (var i = 160; i <= 640; i += 160){
          squares[i] = new Array(4);
          for (var j = 160; j <= 640; j += 160){
            squares[i][j] = game.add.image(i ,j ,'brown');
          }
        }

        player = game.add.sprite(160, 640, 'yellow');
        green = game.add.sprite(480, 160, 'green');




        left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
        text.anchor.setTo( 0.5, 0.0 );
    }

    function keys(){
      if(left.isDown){
        player.position.x -= 10;
      }
      else if(right.isDown){
        player.position.x += 10;
      }
      else if(up.isDown){
        player.position.y -= 10;
      }
      else if(down.isDown){
        player.position.y += 10;
      }
    }

    function update() {
      keys();
    }
};
