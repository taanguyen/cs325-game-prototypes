"use strict";

window.onload = function() {

    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload() {
       PIXI.Sprite.defaultAnchor = {x : 0.5, y: 0.5};
       // load in audio and button images
        game.load.audio( 'sax','assets/sax.mp3' );
        game.load.audio( 'opera', 'assets/opera.mp3');
        game.load.audio( 'typewriter', 'assets/typewriter.mp3');
        game.load.audio( 'windchimes', 'assets/windchimes.mp3');
        game.load.audio( 'traindoor', 'assets/traindoor.mp3');

        // add sprites for each sound, make drag and drop
        game.load.image('background', 'assets/stage.jpg');
        game.load.image('sax_img', 'assets/images/saxophone.png');
        game.load.image('opera_img', 'assets/images/theatre.png');
        game.load.image('typewriter_img', 'assets/images/typewriter.png');
        game.load.image('traindoor_img', 'assets/images/musical-bell-outline.png');
        game.load.image('windchimes_img', 'assets/images/chimes.png');
        // find a nice background sprite-- soap opera


    }

    var sax_audio;
    var opera_audio;
    var typewriter_audio;
    var windchimes_audio;
    var traindoor_audio;
    var sax; // sprites don't have audio tag
    var opera;
    var typewriter;
    var windchimes;
    var traindoor;
    var sequence; // randomly generated sounds
    var soundsDict;
    var soundsArray;
    var style;
    //var remove1, remove2;
    var sprites; // array of images for sounds
    var audioNumPositions; // position array of where numbers corresponding to audio will be
    var orderTextPositions; // array of text objects so player can order sounds
    var textRectangle;
    var submit;
    var submissionArray;
    var background;

    function create() {

        background = game.add.image(game.world.centerX, game.world.centerY,'background');
        background.scale.setTo(1.5);
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
        game.input.mouse.capture = true;
        sax_audio = game.add.audio('sax');
        typewriter_audio = game.add.audio('typewriter');
        windchimes_audio = game.add.audio('windchimes');
        traindoor_audio = game.add.audio('traindoor');
        opera_audio = game.add.audio('opera');


        var width = game.width;
        var height = game.height;
        var spriteHeight = height - 100;

        sax = game.add.sprite(0, spriteHeight, 'sax_img');
        sax.alpha = 0;
        typewriter = game.add.sprite(0, spriteHeight,'typewriter_img');
        typewriter.alpha = 0;
        windchimes = game.add.sprite(0, spriteHeight,'windchimes_img');
        windchimes.alpha = 0;
        traindoor = game.add.sprite(0, spriteHeight, 'traindoor_img');
        traindoor.alpha = 0;
        opera = game.add.sprite(0, spriteHeight,'opera_img');
        opera.alpha = 0;

        sprites = [sax, typewriter, windchimes, traindoor, opera];
        submissionArray = [null, null, null, null, null];
        //sprite will be positioned according to game width and height, and number of sounds
        for(var i = 0; i < sprites.length; i++){
          sprites[i].x = i*(width/sprites.length) + 60;
        }

        // need to link image with audio
        soundsDict = {
            sax_img : sax_audio,
            typewriter_img: typewriter_audio,
            windchimes_img : windchimes_audio,
            traindoor_img : traindoor_audio,
            opera_img : opera_audio
        };

        // play sounds ramdonly and display number as sound is played
        style = { font: "25px Verdana", fill: "	#ffffff", align: "center" , stroke: "#000000", strokeThickness: 3}; // text formatting
        soundsArray = [sax_audio, typewriter_audio, windchimes_audio, traindoor_audio, opera_audio];
        Phaser.ArrayUtils.shuffle(soundsArray);
        playSequence(soundsArray); // ADD BACK IN AFTER TESTINGS


        orderTextPositions = [];

        var textHeight = height - 300;
        for(var i = 0; i < soundsArray.length; i++){
            orderTextPositions[i] = game.add.text(sprites[i].x, textHeight, (i + 1), style);
            orderTextPositions[i].alpha = 0;

        }
        submit = game.add.text(game.world.centerX, 60, " SUBMIT ", style);
        submit.visible = false;
        submit.inputEnabled = true;
        submit.events.onInputUp.add(checkSubmission, this);
        var text = game.add.text( game.world.centerX, 15, "Listen Carefully.", style );
        text.anchor.setTo( 0.5, 0.0 );
    }

    function removeImg(image){
      for(var i = 0; i < sprites.length; i++){
          if(submissionArray[i] == image){
            submissionArray[i] = null;
          }
      }
    }

    function playSound(image, pointer, boolean){
      for(var i = 0; i < soundsArray.length; i++){
        soundsArray[i].stop();
      }
      if(pointer.rightButton.isDown){
        soundsDict[image.key].play();
      }
    }

    function dragToNum(image){
       textRectangle  = new Phaser.Rectangle(image.x - (image.width/2) - 13, image.y - (image.height/2) - 13 , image.width + 13, image.height + 13);
       for(var i = 0; i < sprites.length; i++){
          if(textRectangle.contains(orderTextPositions[i].x, orderTextPositions[i].y)){
            image.x = orderTextPositions[i].x;
            image.y = orderTextPositions[i].y;
            submissionArray[i] = image;
            for(var j = 0; j < sprites.length; j++){
              if(sprites[j] != image && sprites[j].x == image.x && sprites[j].y == image.y){
                sprites[j].y += 120;
                break;
              }
            }
            break;
          }
         }
       }

    function showOptions(){
      // show options
      for(var i = 0; i < sprites.length; i++){
        game.add.tween(sprites[i]).to( { alpha: 1 }, 3000, Phaser.Easing.Linear.None, true);
        sprites[i].inputEnabled = true;
        sprites[i].input.enableDrag();
        sprites[i].events.onDragStart.add(removeImg, this);
        sprites[i].events.onDragStop.add(dragToNum, this);
        sprites[i].events.onInputDown.add(playSound, this);
        game.add.tween(orderTextPositions[i]).to( { alpha: 1 }, 3000, Phaser.Easing.Linear.None, true);
      }
    }

    function playSequence(soundArray) {
    soundArray[0].play();
    game.add.text(40, 150, "1", style);
    soundArray.forEach(function(element, index, array) {
        if (soundArray[index + 1]) {
            soundArray[index].onStop.addOnce(function() {
                soundArray[index + 1].play();
                game.add.text((150 * (index + 1)) + 60, 150, " " + (index + 2), style);
                if(index + 2 == array.length){
                  soundArray[index+1].onStop.addOnce(showOptions);
                }
              }, this);

            }
        });

      }

    function checkSubmission(submit){
      for(var i = 0; i < submissionArray.length; i++){
        if(soundsDict[submissionArray[i].key] != soundsArray[i]){
          game.add.text(game.world.centerX, game.height - 100, " GAME OVER ", style);
          var timer = game.time.create(true);
          timer.add(3000, () => {
            game.destroy();
            game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
          })
          timer.start();
          return;
        }
      }
      game.add.text(game.world.centerX, game.height - 100, " WAY TO GO!!! ", style);
      return;
    }


    function update() {
      if(!submissionArray.includes(null)){
        submit.visible = true;
        submit.inputEnabled = true;
      }
      else{
        submit.visible = false;
        submit.inputEnabled = false;
      }

    }
};
