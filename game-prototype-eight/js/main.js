"use strict";

window.onload = function() {


    var game = new Phaser.Game( 790, 750, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );



    function preload() {
        // Load an image and call it 'logo'.
        PIXI.Sprite.defaultAnchor = {x : 0.5, y: 0.5};
        game.load.image('yellow', 'assets/yellow.png');
        game.load.image('green', 'assets/green.png');
        game.load.image('brown', 'assets/rsz_brown.png');
        game.load.spritesheet('bomb', 'assets/explode1.png');
    }


    var position = []; // player position in the game, relative to square grid
    var squares = new Array(4); // 4 x 4 grid
    var player;
    var goal;
    var playerCoord = [];
    var currentLevel = 1;
    var bomb;

    var input;
    var levelText;

    function create() {
        //position = [0,0];
        for (var i = 160; i <= 640; i += 160){
          squares[i] = new Array(4);
          for (var j = 160; j <= 640; j += 160){
            squares[i][j] = game.add.image(i ,j ,'brown');
          }
        }


        input = new InputControl(game,[Phaser.Keyboard.RIGHT, Phaser.Keyboard.LEFT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN]);
        playerCoord = [0,3];
        player = game.add.sprite(0,0, 'yellow');

        goal = game.add.sprite(0, 0, 'green');
        // bomb = game.add.sprite(0, 0, 'bomb');
        //
        // bomb.animations.add()

        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        levelText = game.add.text( game.world.centerX, 40, "" + currentLevel, style );
        text.anchor.setTo( 0.5, 0.0 );
    }

    function place(object, coord){ // place all objects onto level
        var offsetX = 150;
        var offsetY = 150;
        object.position.setTo(size * coord[0] + offsetX, size * coord[1] + offsetY);
    }

    function keys(){

      if(input.isDown(Phaser.Keyboard.LEFT)){
        playerCoord[0] -= playerCoord[0] == 0? 0: 1;
      }
      else if(input.isDown(Phaser.Keyboard.RIGHT)){
        playerCoord[0] += playerCoord[0] == 3? 0: 1;
      }
      else if(input.isDown(Phaser.Keyboard.UP)){
        playerCoord[1] -= playerCoord[1] == 0? 0: 1;
      }
      else if(input.isDown(Phaser.Keyboard.DOWN)){
        playerCoord[1] += playerCoord[1] == 3? 0: 1;
      }

    }

    function explode(){ // call bomb animation
        console.log("explode");
        //decrease life and move player back 
    }

    function update() {
      keys();
      levelText.setText(currentLevel);
      input.update(game);
      place(player, playerCoord);
      place(goal, levels[currentLevel].goal);
      levels[currentLevel].bombs.forEach((bomb) => {
          if(playerCoord[0] == bomb[0] && playerCoord[1] == bomb[1]){
            explode();
          }
      })
      if(playerCoord[0] == levels[currentLevel].goal[0] && playerCoord[1] == levels[currentLevel].goal[1]){
        currentLevel += currentLevel == 5? 0: 1;
        playerCoord = [0,3];
      }
      else if(playerCoord[0] == levels[currentLevel].trap[0] && playerCoord[1] == levels[currentLevel].trap[1] ){
        currentLevel -= currentLevel == 1? 0: 1;
        playerCoord = [0,3];
      }
    }
};
