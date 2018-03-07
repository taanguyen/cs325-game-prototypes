"use strict";

window.onload = function() {

    var game = new Phaser.Game( 1000, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload() {

        PIXI.Sprite.defaultAnchor = {x : 0.5, y: 0.5};
        game.load.image('instructions', 'assets/instructions.png');
        game.load.image( 'pirate', 'assets/pirate_doodle_rsz.png' ,70 , 92);
        game.load.spritesheet('coin', 'assets/rsz_spincoin.png',50 ,50);
        game.load.image('treasure', 'assets/rsz_island.png');
        game.load.image('bullet', 'assets/bullet (2).png');
        game.load.image('water1', 'assets/water_orig.jpeg');


// audio needed
    }
    var background;
    var coin;
    var ship;
    var bullets, bulletTimer; // generate bullet
    var pointsText, healthText, highScore = 0;
    var numCoins, increaseCount, totalCoins;
    var left,right,up, space; // down is not allowed, must turn!
    var treasure;
    var xcoin, ycoin;
    var emitter;

    function create() {


        game.stage.backgroundColor = "#36a9e0";
        game.physics.startSystem(Phaser.Physics.ARCADE);
        bullets = [];
        // keyboard controls
        left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
        space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        totalCoins = 0;
        numCoins = 0;
        increaseCount = 0;
        //display coins collected on top right of screen
        pointsText = game.add.text(game.world.centerX + (game.world.width / 2) - 100, 50, "Coins: " + numCoins,
        {font: "25px Verdana", backgroundColor: "#FFFF00", align: "center"});
        healthText = game.add.text(25,25,"", {font: "25px Verdana", backgroundColor: "#FF5050"});
        healthText.anchor.setTo(0);

        emitter = game.add.emitter(game.world.centerX, game.world.centerY, 400);
         emitter.makeParticles( [ 'water1'] );
         emitter.gravity = 0;
         emitter.setAlpha(1, 0, 1000);
         emitter.start(false, 3000, 5);


        ship = game.add.sprite(game.world.centerX, game.world.centerY, 'pirate');
        ship.scale.setTo(0.9);
        ship.events.onKilled.add(x => {
          game.add.text(game.world.centerX, game.world.centerY, "GAME OVER", {fill: "#ff5000", fontSize: 25});
          emitter.destroy();
          if(highScore < totalCoins){
            highScore = totalCoins;
          }
          game.destroy();
          game = new Phaser.Game( 1000, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update} );
        },this);
        ship.health = 5;
        ship.maxHealth = 5;

        treasure = game.add.sprite(90, game.world.height - 50, 'treasure');
        game.physics.enable(ship, Phaser.Physics.ARCADE);
        game.physics.enable(treasure, Phaser.Physics.ARCADE);
        ship.body.allowGravity = false;
        treasure.body.immovable = true;
        treasure.body.allowGravity = false;
        ship.body.collideWorldBounds = true;



        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        game.physics.arcade.paused = true; bulletTimer = NaN;
        var beginscreen = game.add.image(game.world.centerX, game.world.centerY, 'instructions');
        beginscreen.inputEnabled = true;
        beginscreen.events.onInputUp.add(() => {beginscreen.destroy(); game.physics.arcade.paused = false;

                generateCoin(null,null);
                generateBullet();
              });
    }


    function generateBullet(){
      var num = game.rnd.integerInRange(1,4);
      var bulletx, bullety;
      switch(num){
        case 1: bulletx = -10; bullety = game.world.randomY; break;
        case 2: bulletx = game.world.randomX; bullety = -10; break;
        case 3: bulletx = game.width + 10; bullety = game.world.randomY; break;
        case 4: bulletx = game.world.randomX; bullety = game.height + 10; break;
      }

      var bullet = game.add.sprite(bulletx, bullety, 'bullet');
      bullets.push(bullet);
      game.physics.enable(bullet, Phaser.Physics.ARCADE);
      var angle = bullet.position.angle(coin.position, true);
      game.physics.arcade.velocityFromAngle(angle, 200, bullet.body.velocity);
      bulletTimer = game.time.now + 1000;
      bullet.checkWorldBounds = true;
      bullet.events.onOutOfBounds.add(x => {
        x.destroy();
        bullets.splice(bullets.indexOf(x), 1);}, this);
    }

    function generateCoin(sprite1, sprite2) {

      xcoin = game.rnd.integerInRange(150, 900);
      ycoin = game.rnd.integerInRange(100, 450);
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
       game.add.tween(ship.scale).to( { x:0.9 + 0.2*increaseCount, y:   0.9 + 0.2*increaseCount}, 200, 'Linear',true);
    }

    function dumpCoins(){  // dump coins and shrink ship
      if(numCoins >= 20){
        numCoins = 0;   // but this will affect points
        increaseCount = 0;  // reset size of ship
        game.add.tween(ship.scale).to( { x:0.9, y: 0.9}, 200, 'Linear',true);
        ship.heal(2);
      }
    }





    function update() {


         emitter.minParticleSpeed.set(2, 2);
         emitter.maxParticleSpeed.set(10, 10);
         emitter.setAngle(0,0,0,0);

         emitter.emitX = ship.x;
         emitter.emitY = ship.y;


         game.physics.arcade.collide(ship, coin, generateCoin, null, this);
         game.physics.arcade.collide(ship, treasure, dumpCoins, null, this);
         game.physics.arcade.collide(ship, bullets, (x,y) => {
           ship.damage(1);
           bullets.splice(bullets.indexOf(y), 1);
           y.destroy();
         }, null, this);
         pointsText.setText("Best Score: " + highScore +  " " + "\nCoins: " + totalCoins + "  ");
         healthText.setText("Health: " + ship.health + " ");

         if(game.time.now > bulletTimer){
           generateBullet();
         }

         if(game.physics.arcade.paused != true){


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
              if(space.isDown){
                game.physics.arcade.velocityFromAngle(ship.angle + 180, 450, ship.body.velocity);
              }
         }
       }




    }

};
