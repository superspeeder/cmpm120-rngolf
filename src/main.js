// Code Practice: RNGolf
// Name: Andy Newton 
// Date: 1/29/2025

'use strict'

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    scene: [ Play ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
}

let game = new Phaser.Game(config)

let { width, height } = game.config