"use strict";

window.onload = function() {


    var game = new Phaser.Game( 800, 750, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );



    function preload() {
        // Load an image and call it 'logo'.
        PIXI.Sprite.defaultAnchor = {x : 0.5, y: 0.5};
        game.load.image('background', 'assets/bg.jpg');
        game.load.image('yellow', 'assets/yellow.png');
        game.load.image('green', 'assets/green.png');
        game.load.image('grey', 'assets/rsz_grey.jpg');
        game.load.image('trap', 'assets/hole.png');
        game.load.spritesheet('bomb', 'assets/explode1.png', 125 ,130, 14);
    }


    var position = []; // player position in the game, relative to square grid
    var squares = new Array(4); // 4 x 4 grid
    var player;
    var goal;
    var playerCoord = [];
    var currentLevel = 1;
    var bomb;
    var currentHealth;
    var background;
    var style;

    var input;
    var levelText, healthText;

    function create() {

      background = game.add.image(game.world.centerX, game.world.centerY,'background');
       var margin = 50;
       // and set the world's bounds according to the given margin
       var x = -margin;
       var y = -margin;
       var w = game.world.width + margin * 2;
       var h = game.world.height + margin * 2;
       // it's not necessary to increase height, we do it to keep uniformity
       game.world.setBounds(x, y, w, h);

       // we make sure camera is at position (0,0)
       game.world.camera.position.set(0);
        for (var i = size; i <= size * 4; i += size){
          squares[i] = new Array(4);
          for (var j = size; j <= size * 4; j += size){
            squares[i][j] = game.add.image(i ,j ,'grey');
          //  squares[i][j].alpha = 0.9;
          }
        }

        currentHealth = 5;
        input = new InputControl(game,[Phaser.Keyboard.RIGHT, Phaser.Keyboard.LEFT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN]);
        playerCoord = [0,3];
        player = game.add.sprite(0,0, 'yellow');

        goal = game.add.sprite(0, 0, 'green');


        style = { font: "25px Verdana", fill: "#ffffff", backgroundColor: "#000000", align: "center" };
        levelText = game.add.text( game.world.centerX, 40, "" + currentLevel, style );
        levelText.anchor.setTo( 0.5, 0.0 );
        healthText = game.add.text( game.world.centerX + 250, 40, "" + currentHealth, style );
        healthText.anchor.setTo( 0.5, 0.0 );
    }

    function place(object, coord){ // place all objects onto level
        var offsetX = 160;
        var offsetY = 160;
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
        bomb = game.add.sprite(playerCoord[0] * size + 160, playerCoord[1] * size + 160, 'bomb');
        var anim = bomb.animations.add('explode', [1,2,3,4,5,6,7,8,9,10], 20, false);
        anim.onComplete.add(function() {bomb.destroy();

          if(currentHealth == 0){
            displayEnd();
          }

        }, this);
        bomb.animations.play('explode');
        currentHealth--;
        addQuake();

    }

    function displayEnd(){
      if(currentHealth == 0){
      game.add.text(game.world.centerX, game.world.centerY, " GAME OVER! ", style);
    }
    else{
      game.add.text(game.world.centerX, game.world.centerY, " YOU WON! ", style);
    }
      game.paused = true;
      var replay = game.add.text(game.world.centerX, game.world.centerY + 50, " REPLAY? ", style);
      replay.inputEnabled = true;
      replay.events.onInputDown.add(() => {
        currentLevel = 1;
        game.destroy();
        game = new Phaser.Game( 800, 750, Phaser.AUTO, 'game', { preload: preload, create: create, update: update} );
      }, this);
    }

    function addQuake() {
      // define the camera offset for the quake
      var rumbleOffset = 10;
      // we need to move according to the camera's current position
      var properties = {
        x: game.camera.x - rumbleOffset
      };
      // we make it a relly fast movement
      var duration = 100;
      // because it will repeat
      var repeat = 4;
      // we use bounce in-out to soften it a little bit
      var ease = Phaser.Easing.Bounce.InOut;
      var autoStart = false;
      // a little delay because we will run it indefinitely
      var delay = 1000;
      // we want to go back to the original position
      var yoyo = true;
      var quake = game.add.tween(game.camera)
        .to(properties, duration, ease, autoStart, 0, 4, yoyo);
      // let the earthquake begins
      quake.start();
    }


    function update() {
      keys();
      healthText.setText(" Health: " + currentHealth + " ");
      levelText.setText(" Level: " + currentLevel + " ");
      input.update(game);
      place(player, playerCoord);
      place(goal, levels[currentLevel].goal);
      levels[currentLevel].bombs.forEach((bomb) => {
          if(playerCoord[0] == bomb[0] && playerCoord[1] == bomb[1]){
            explode();
            place(player, [0,3]);
            playerCoord = [0,3];
          }
      });

      if(playerCoord[0] == levels[currentLevel].goal[0] && playerCoord[1] == levels[currentLevel].goal[1]){
        if(currentLevel == 5){displayEnd();}
        currentLevel += currentLevel == 5? 0: 1;
        playerCoord = [0,3];

      }
      else if(playerCoord[0] == levels[currentLevel].trap[0] && playerCoord[1] == levels[currentLevel].trap[1] ){
        currentLevel -= currentLevel == 1? 0: 1;
        var trap = game.add.image(0,0,'trap');
        place(trap, playerCoord);
        var tweenTrap = game.add.tween(trap).to( {alpha: 0}, 1000, 'Linear',true);
        tweenTrap.onComplete.add(function(){trap.destroy();}, this);
        playerCoord = [0,3];
      }


    }
};
