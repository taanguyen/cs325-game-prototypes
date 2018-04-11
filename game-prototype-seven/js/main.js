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
    var VisualTimer;
    var cost, overallTimer; // cost of current ingredient and overall timer in the game
    var progressbar; // allots 3 seconds to buy or deny ingredient
    var tomatoAmount, cheeseAmount, lettuceAmount, currentIngredient;   // tracks amount of tomato, cheese, and lettuce in sandwich
    var sandwichText;
    var goalSandwichText;
    var money;      // user alloted 5 dollars initially
    var multiplier, multiplierText; // amount being offered
    var tomato, cheese, lettuce, ingredients;
    var positionY;

    function preload() {
        //game.load.script('VisualTimer.js');

        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        game.load.spritesheet('timer', 'assets/timer.png', 150, 20);


        PIXI.Sprite.defaultAnchor = {x : 0.5, y: 0.5};
        game.load.image('background', 'assets/picnic.png');
        game.load.spritesheet('timer', 'assets/timer.png', 150, 20);
        game.load.image( 'tomato', 'assets/rsz_tomato.png' );
        game.load.image( 'cheese', 'assets/rsz_cheese.png' );
        game.load.image( 'lettuce', 'assets/lettuce.png' );
    }


    function create() {

        background = game.add.image(game.world.centerX, game.world.centerY,'background');


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

        createText();
        generateIngredient();
    }

    function createText(){
      buy = game.add.text(game.world.centerX - 50, 550, " BUY ", {font: "25px Courier", backgroundColor: "#33CC00"});
      deny = game.add.text(game.world.centerX + 50, 550, " DENY ", {font: "25px Courier", backgroundColor: "#FF0000"});

      buy.strokeThickness = 2;
      deny.strokeThickness = 2;

      buy.inputEnabled = true;
      buy.events.onInputUp.add(() => {
              increaseIngredients();
              generateIngredient();
            });

      deny.inputEnabled = true;
      deny.events.onInputUp.add(() => {
              generateIngredient();
            });
      // display amounts of each ingredient
      sandwichText = game.add.text(game.world.centerX + 250, game.world.centerY + 150,"You have:\nTomato: " + tomatoAmount + "\nCheese: " + cheeseAmount + "\nLettuce: " + lettuceAmount);
      // display multiplier
      multiplierText = game.add.text(game.world.centerX - 150, game.world.centerY, "");
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

    }

    function update() {

    }
};
