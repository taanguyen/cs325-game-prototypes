"use strict";

window.onload = function() {


    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    let WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { game.time.events.add(Phaser.Timer.SECOND, null, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Fontdiner Swanky']
    }

    };
    var background, buy, deny;          // buy or deny buttons
    var overallTimer;
    var cost, overallTimer; // cost of current ingredient and overall timer in the game
    var progressbar; // allots 3 seconds to buy or deny ingredient
    var tomatoAmount, cheeseAmount, lettuceAmount, currentIngredient;   // tracks amount of tomato, cheese, and lettuce in sandwich
    var sandwichText, ratioText;
    var goalSandwichText;
    var money;      // user alloted 5 dollars initially
    var multiplier, multiplierText; // amount being offered
    var tomato, cheese, lettuce, ingredients;
    var positionY, buttonMask;
    var startTime, timer, timeTween;
    var ratioCheese, ratioTomato, ratioLettuce;

    function preload() {


        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        game.load.image('instructions', 'assets/instructions.png');
        PIXI.Sprite.defaultAnchor = {x : 0.5, y: 0.5};
        game.load.image('background', 'assets/picnic.png');
        game.load.spritesheet('timer', 'assets/timer.png', 150, 20);
        game.load.image( 'tomato', 'assets/rsz_tomato.png' );
        game.load.image( 'cheese', 'assets/rsz_cheese.png' );
        game.load.image( 'lettuce', 'assets/lettuce.png' );
    }


    function create() {


        background = game.add.image(game.world.centerX, game.world.centerY,'background');
        var instructions = game.add.image(game.world.centerX, game.world.centerY, 'instructions');

        instructions.inputEnabled = true;
        instructions.events.onInputUp.add(() => {instructions.destroy();
                                            createText();
                                            generateIngredient();
                                            startTime = game.time.now;
                                          });

        tomatoAmount = 0;
        cheeseAmount = 0;
        lettuceAmount = 0;
        multiplier = 0;

        // ingredient position
        positionY = game.world.centerY + 100
        tomato = game.add.image(game.world.centerX, positionY, 'tomato');
        cheese = game.add.image(game.world.centerX, positionY, 'cheese');
        lettuce = game.add.image(game.world.centerX, positionY, 'lettuce');
        lettuce.scale.setTo(1.25);

        tomato.visible = false;
        cheese.visible = false;
        lettuce.visible = false;

        ingredients = {
          1: tomato,
          2: cheese,
          3: lettuce
        }


    }

    function createText(){
      overallTimer = game.add.text(700, 50, "", {font: "25px Courier", fill: "#ffffff"});
      buy = game.add.text(game.world.centerX, 560, "  BUY  ", {font: "25px Courier", backgroundColor: "#75a845"});
  //    deny = game.add.text(game.world.centerX + 50, 560, " DENY ", {font: "25px Courier", backgroundColor: "#d95e5f"});

      buy.strokeThickness = 2;
    //  deny.strokeThickness = 2;

      buy.inputEnabled = true;
      buy.events.onInputUp.add(() => {
              increaseIngredients();
              generateIngredient();
            });

      // deny.inputEnabled = true;
      // deny.events.onInputUp.add(() => {
      //         generateIngredient();
      //       });
      // display amounts of each ingredient
      ratioTomato = game.rnd.integerInRange(1,9);
      ratioCheese = game.rnd.integerInRange(1,9 - ratioTomato);
      ratioLettuce = 11-ratioCheese-ratioTomato;
      ratioText = game.add.text(game.world.centerX - 250, game.world.centerY + 150,
         "Ratios:\nTomato: " + ratioTomato + "\nCheese: " + ratioCheese + "\nLettuce: " + ratioLettuce);
      sandwichText = game.add.text(game.world.centerX + 250, game.world.centerY + 150,"You have:\nTomato: " + tomatoAmount + "\nCheese: " + cheeseAmount + "\nLettuce: " + lettuceAmount);
      // display multiplier
      multiplierText = game.add.text(game.world.centerX, game.world.centerY, "");
    }

    function increaseIngredients(){
      switch (currentIngredient){
        case tomato:
            tomatoAmount += multiplier;
            break;
        case cheese:
            cheeseAmount += multiplier;
            break;
        case lettuce:
            lettuceAmount += multiplier;
            break;
      }
    }

    // randomly choose an ingredient and a multiplier for the ingredient
    function generateIngredient(){
        multiplier = game.rnd.integerInRange(1,3);
        multiplierText.setText(multiplier);

        sandwichText.setText("You have:\nTomato: " + tomatoAmount + "\nCheese: " + cheeseAmount + "\nLettuce: " + lettuceAmount);
        console.log(multiplier);
        // change ingrdient image on display
        currentIngredient = ingredients[game.rnd.integerInRange(1,3)];
        currentIngredient.visible = true;
        switch(currentIngredient){
          case tomato:
              cheese.visible = false;
              lettuce.visible = false;
              break;
          case cheese:
              tomato.visible = false;
              lettuce.visible = false;
              break;
          case lettuce:
              tomato.visible = false;
              cheese.visible = false;
              break;
        }


          timer = game.add.graphics(200, 0);
          timer.beginFill(0x505050);
          timer.drawRect(0,30,388,30);
          timer.endFill();

          if(buttonMask){
      			buttonMask.destroy();
            game.tweens.removeAll();
      		}
           buttonMask = game.add.graphics(200, 0);
  		     buttonMask.beginFill(0x9cdcdc);
  	       buttonMask.drawRect(0, 30, 388, 30);
  		     buttonMask.endFill();

    			 timeTween=game.add.tween(buttonMask);
    			 timeTween.to({
    				      x: -200
                }, 2000, "Linear",true, 0, -1);
    			 timeTween.onLoop.addOnce(function(){
                  generateIngredient();
    	          }, this);

          var blackbox = game.add.graphics(0, 0);
          blackbox.beginFill(0x000000);
          blackbox.drawRect(0,0,200,70);
          timer.endFill();
    }

    function calculateScore(){
      let maxSandwich = Math.floor(Math.min(tomatoAmount/ratioTomato, cheeseAmount/ratioCheese, lettuceAmount/ratioLettuce));
      var maxSandwichText = game.add.text(game.world.centerX - 45, 150, "Total sandwiches: " + maxSandwich, {font: "25px Arial", fill: "#fff"});
      let excessTomato = tomatoAmount - (maxSandwich * ratioTomato);
      let excessCheese = cheeseAmount - (maxSandwich * ratioCheese);
      let excessLettuce = lettuceAmount - (maxSandwich * ratioLettuce);
      let score = (3 * maxSandwich) - (excessTomato + excessLettuce + excessCheese);
      // var style = { font: "25px Arial", fill: "#fff", stroke: "#000000", strokeThickness: 5};
      // let scoreText = game.add.text(game.world.centerX, game.world.centerY,
      //      "                Ratio           Amount        Excess" +
      //      "\nTomato:      " + ratioTomato+"                    " + tomatoAmount + "                  " + excessTomato +
      //      "\nCheese:      " + ratioCheese+"                     " + cheeseAmount + "                    " + excessCheese +
      //      "\nLettuce:      " + ratioLettuce+"                     " + lettuceAmount + "                    " + excessLettuce +
      //
      //      "\nScore = (3 * total sandwiches)  - total excess = " + score, style);



      var headings = [ "    ", 'Ratio', 'Amount', 'Excess'];
     var style = { font: "25px Arial", fill: "#fff", tabs: [ 160, 150, 140 ] };

      var headingsText = game.add.text(game.world.centerX - 45, game.world.centerY - 100, '', style);
      headingsText.parseList(headings);
    //  headingsText.padding.set(20, 20);
      var finalScore = [
          [ 'Tomato', ratioTomato, tomatoAmount, excessTomato],
          [ 'Cheese', ratioCheese, cheeseAmount, excessCheese],
          [ 'Lettuce', ratioLettuce, lettuceAmount, excessLettuce]
      ];

      var tableText = game.add.text(game.world.centerX - 45, game.world.centerY, '', style);
      tableText.parseList(finalScore);
      tableText.padding.set(10, 10);
      var scoreText = game.add.text(game.world.centerX - 25, game.world.centerY + 75,"\nScore = (3 * total sandwiches)  - total excess = " + score, {font: "25px Arial", fill: "#fff"});
      scoreText.stroke = '#000000';
      scoreText.strokeThickness = 5;

      multiplierText.destroy();
      buy.destroy();
      ratioText.destroy();
      overallTimer.destroy();
      sandwichText.destroy();
      currentIngredient.destroy();
      timeTween.stop();

    }

    function update() {
      if(startTime != null && overallTimer != null){
        overallTimer.setText("Time: " +  Math.floor(61 - (game.time.now - startTime)/1000));
      }
      if((game.time.now - startTime)/1000 >= 60 && overallTimer != null){
        startTime = null;
        calculateScore();
      }


    }
};
