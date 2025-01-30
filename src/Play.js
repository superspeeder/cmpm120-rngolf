class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100

        this.MOVING_WALL_SPEED = 400
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        this.shots = 0
        this.score = 0

        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4);
        this.cup.body.setOffset(this.cup.width / 4);
        this.cup.body.setImmovable(true);
        
        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.setBounce(0.5);
        this.ball.body.setDamping(true).setDrag(0.5);

        // add walls
        this.wallA = this.physics.add.sprite(0, height / 4, 'wall')
        this.wallA.setX(Phaser.Math.Between(this.wallA.width / 2, width - this.wallA.width / 2))
        this.wallA.body.setImmovable(true);


        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(wallB.width / 2, width - wallB.width / 2))
        wallB.body.setImmovable(true);

        this.walls = this.add.group([this.wallA, wallB]);

        // add one-way
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(this.oneWay.width / 2, width - this.oneWay.width / 2));
        this.oneWay.body.setImmovable(true);
        this.oneWay.body.checkCollision.down = false;

        // add pointer input
        this.input.on("pointerdown", (pointer) => {
            let shotDirection = pointer.y <= this.ball.y ? 1 : -1;
            let shotXDirection = pointer.x <= this.ball.x ? 1 : -1;
            this.ball.body.setVelocityX(Phaser.Math.Between(0, this.SHOT_VELOCITY_X) * shotXDirection);
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection);
            this.shots += 1
        });

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            ball.setVelocity(0);
            ball.setX(width / 2);
            ball.setY(height - height / 10);
            this.score += 1
        });

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls);

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay);

        this.movingWallDirection = 1
        
        this.shotsText = this.add.text(10, 10, "Shots:     0").setFontSize(18).setColor('white').setBackgroundColor('black')
        this.scoreText = this.add.text(10, 30, "Score:     0").setFontSize(18).setColor('white').setBackgroundColor('black')
        this.successText = this.add.text(10, 50, "Success %: 0%").setFontSize(18).setColor('white').setBackgroundColor('black')

    }

    update() {
        
        if (this.movingWallDirection > 0 && this.wallA.x + this.wallA.width / 2 >= width) {
            this.movingWallDirection = -1
        } else if (this.movingWallDirection < 0 && this.wallA.x - this.wallA.width / 2 <= 0) {
            this.movingWallDirection = 1
        }

        this.wallA.body.setVelocityX(this.movingWallDirection * this.MOVING_WALL_SPEED);

        this.shotsText.setText("Shots:     " + this.shots)
        this.scoreText.setText("Score:     " + this.score)
        if (this.shots > 0) {
            this.successText.setText("Success %: " + Math.round(this.score / this.shots * 100) + "%")
        } else {
            this.successText.setText("Success %: 0%")
        }
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[x] Add ball reset logic on successful shot
[x] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[x] Make one obstacle move left/right and bounce against screen edges
[x] Create and display shot counter, score, and successful shot percentage
*/