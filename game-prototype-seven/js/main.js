"use strict";

window.onload = function() {


    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload() {
        game.load.script('VisualTimer.js');
        PIXI.Sprite.defaultAnchor = {x : 0.5, y: 0.5};
        game.load.image('background', 'assets/picnic.png');
        game.load.spritesheet('timer', 'assets/timer.png', 150, 20);
        game.load.image( 'tomato', 'assets/tomato.png' );
        game.load.image( 'cheese', 'assets/cheese.png' );
        game.load.image( 'lettuce', 'assets/lettuce.png' );
    }

    var background, buy, deny;          // buy or deny buttons
    var VisualTimer;
    var cost, overallTimer; // cost of current ingredient and overall timer in the game
    var progressbar; // allots 3 seconds to buy or deny ingredient
    var tomatoAmount, cheeseAmount, lettuceAmount;   // tracks amount of tomato, cheese, and lettuce in sandwich
    var money;      // user alloted 5 dollars initially
    var multiplier; // amount being offered
    var tomato, cheese, lettuce;


    function create() {
        background = game.add.image(game.world.centerX, game.world.centerY,'background');
        
        buy = game.add.text(game.world.centerX - 50, 550, "BUY", {font: "25px Verdana", backgroundColor: "#33CC00"});
        deny = game.add.text(game.world.centerX + 50, 550, "DENY", {font: "25px Verdana", backgroundColor: "#FF0000"});





        var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
        text.anchor.setTo( 0.5, 0.0 );
    }

    function update() {

    }
};
