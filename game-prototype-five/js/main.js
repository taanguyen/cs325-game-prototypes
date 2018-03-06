"use strict";

window.onload = function() {

    var game = new Phaser.Game( 1000, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload() {

        PIXI.Sprite.defaultAnchor = {x : 0.5, y: 0.5};
        game.load.image('background', 'assets/ocean_expand.png');
        game.load.image( 'pirate', 'assets/pirate_doodle_rsz.png' ,70 , 92);
        game.load.spritesheet('coin', 'assets/rsz_spincoin.png',50 ,50);
        game.load.image('treasure', 'assets/rsz_island.png');
        game.load.image('bullet', 'assets/rsz_bullet.png');
// audio needed
    }
    var background;
    var coin;
    var ship;
    var bullet, bulletTimer; // generate bullet
    var pointsText;
    var numCoins, increaseCount, totalCoins;
    var left,right,up, down; // down is not allowed, must turn!
    var treasure;
    var xcoin, ycoin;

    function create() {
        game.stage.backgroundColor = "#36a9e0";
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // keyboard controls
        left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

        generateCoin(null,null);
        totalCoins = 0;
        numCoins = 0;
        increaseCount = 0;
        //display coins collected on top right of screen
        pointsText = game.add.text(game.world.centerX + (game.world.width / 2) - 100, 50, "Coins: " + numCoins,
        {font: "25px Verdana", backgroundColor: "#FFFF00", align: "center"});

        ship = game.add.sprite(game.world.centerX, game.world.centerY, 'pirate');
        ship.scale.setTo(0.9);
        treasure = game.add.sprite(90, game.world.height - 50, 'treasure');
        game.physics.enable(ship, Phaser.Physics.ARCADE);
        game.physics.enable(treasure, Phaser.Physics.ARCADE);
        ship.body.allowGravity = false;
        treasure.body.immovable = true;
        treasure.body.allowGravity = false;

        generateBullet();



        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
        text.anchor.setTo( 0.5, 0.0 );
    }


    function generateBullet(){
      game.add.sprite(xcoin, ycoin, 'bullet');
      bulletTimer = game.time.now + 1000;
    }

    function generateCoin(sprite1, sprite2) {
      console.log("hit coin");
      xcoin = game.rnd.integerInRange(200, 800);
      ycoin = game.rnd.integerInRange(200, 400);
      if(sprite2 == null){
        coin = game.add.sprite(xcoin, ycoin, 'coin');
        game.physics.enable(coin, Phaser.Physics.ARCADE);
        coin.body.collideWorldBounds = true;
        var spin = coin.animations.add('spin',[1,2,3,4,5,6,7,8,9,10], 5, true);
        coin.animations.play('spin');

      }
      else{
        sprite2.destroy(); // ship collected coin
        totalCoins++;
        numCoins++;
        if(numCoins % 5 == 0){
          increaseCount++;
          growShip();
        }
        coin = game.add.sprite(xcoin,ycoin, 'coin');
        game.physics.enable(coin, Phaser.Physics.ARCADE);
        coin.body.collideWorldBounds = true;
        var spin = coin.animations.add('spin',[1,2,3,4,5,6,7,8,9,10], 5, true);
        coin.animations.play('spin');
        }
       }

    function growShip(){
      game.add.tween(ship.scale).to( { x:0.9 + 0.1*increaseCount, y:   0.9 + 0.1*increaseCount}, 1000, 'Linear',true);

    }

    function dumpCoins(){  // dump coins and shrink ship
      if(numCoins >= 20){
        numCoins = 0;   // but this will affect points
        increaseCount = 0;  // reset size of ship
        ship.scale.setTo(0.9);
      }
    }





    function update() {
         game.physics.arcade.collide(ship, coin, generateCoin, null, this);
         game.physics.arcade.collide(ship, treasure, dumpCoins, null, this);
         pointsText.setText("Coins: " + totalCoins + "  ");

         if(game.time.now > bulletTimer){
           generateBullet();
         }

         ship.body.velocity.x = 0;
         ship.body.velocity.y = 0;
         ship.body.angularVelocity = 0;


         if (left.isDown)
         {
             ship.body.angularVelocity = -200;
         }
         else if (right.isDown)
         {
             ship.body.angularVelocity = 200;
         }

         if (up.isDown)
         {
             game.physics.arcade.velocityFromAngle(ship.angle + 180, 300, ship.body.velocity);
         }


    }
};
