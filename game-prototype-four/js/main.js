"use strict";

window.onload = function() {

    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload() {
       // load in audio and button images
        game.load.audio( 'sax','assets/sax.mp3' );
        game.load.audio( 'opera', 'assets/opera.mp3');
        game.load.audio( 'typewriter', 'assets/typewriter.mp3');
        game.load.audio( 'windchimes', 'assets/windchimes.mp3');
        game.load.audio( 'traindoor', 'assets/traindoor.mp3');


    }

    var sax_audio;
    var opera_audio;
    var typewriter_audio;
    var windchimes_audio;
    var traindoor_audio;
    var sax;
    var opera;
    var typewriter;
    var windchimes;
    var traindoor;
    var sequence; // randomly generated sounds
    var soundsDict;
    var soundsArray;
    var style;
    var remove1, remove2;

    function create() {

        sax_audio = game.add.audio('sax');
        typewriter_audio = game.add.audio('typewriter');
        windchimes_audio = game.add.audio('windchimes');
        traindoor_audio = game.add.audio('traindoor');
        opera_audio = game.add.audio('opera');

        soundsDict = {
            'sax': sax_audio,
            'typewriter': typewriter_audio,
            'windchimes': windchimes_audio,
            'traindoor': traindoor_audio,
            'opera': opera_audio
        };

        // play sounds ramdonly and display number as sound is played
        style = { font: "25px Verdana", fill: "#9999ff", align: "center" }; // text formatting
        soundsArray = [sax_audio, typewriter_audio, windchimes_audio, traindoor_audio, opera_audio];
        Phaser.ArrayUtils.shuffle(soundsArray);
        playSequence(soundsArray); // ADD BACK IN AFTER TESTINGS

        // replay sequence with missing sounds
        remove1 = game.rnd.integerInRange(0, soundsArray.length - 1);

        remove2 = game.rnd.integerInRange(0, soundsArray.length - 1);
        while(remove2 == remove1){
          remove2 = game.rnd.integerInRange(0, soundsArray.length - 1);
        }

        playSequenceMissing(soundsArray);



        var text = game.add.text( game.world.centerX, 15, "Listen Carefully.", style );
        text.anchor.setTo( 0.5, 0.0 );
    }

    function playSequenceMissing(soundArray) {

    for(var i = 0; i < soundArray.length; i++){
      if(i == remove1 && i == remove2){
        game.add.text((150 * (i)) + 40, 300, " ? ", style);
      }
      else{

        if (soundArray[i]) {
           // play sound with gaps
            soundArray[i].onStop.addOnce(function() {
              if(soundArray[i + 1]){
                soundArray[i + 1].play();
                game.add.text((150 * (i + 1)) + 40, 300, " " + (i + 2), style);
              }
            }, this);

          } // end if
      } // end else
    }
}

    function playSequence(soundArray) {
    soundArray[0].play();
    game.add.text(40, 150, "1", style);
    soundArray.forEach(function(element, index, array) {
        if (soundArray[index + 1]) {
            soundArray[index].onStop.addOnce(function() {
                soundArray[index + 1].play();
                game.add.text((150 * (index + 1)) + 40, 150, " " + (index + 2), style);
                }, this);
            }
        });
      }


    function update() {


    }
};
