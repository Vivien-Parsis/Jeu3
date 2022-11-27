var timer;
var chronoText;
var win;
var WinOrLose;
var pause = false;
var timeCount = 0;
var life = 3;

function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('obstacle', 'assets/rock.png');
    this.load.image('background', 'assets/background.png')
}

function create() {
    this.q = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    this.background = this.physics.add.image(config.width/2,config.height/2,'background');
    this.background.setScale(config.width/this.background.width, config.height/this.background.height);
    
    this.player = this.physics.add.image(config.width / 2, 0, 'player').setScale(0.04, 0.04);
    this.player.setPosition(config.width / 2, config.height - (this.player.displayHeight/2));
    this.obstacle = this.physics.add.image(config.width / 2, 50, 'obstacle').setScale(0.05, 0.05);
    this.player.setCollideWorldBounds(true);
    this.player.setImmovable(true);
    this.obstacle.setImmovable(false);

    this.chronoText = this.add.text(10,10,'chrono',{fontfamily:"Passion-Regu",fill:'#dddddd',stroke:'#000000',strokeThickness:5});
    this.win = this.add.text(config.width/3,75,'',{fontfamily:"Passion-Regu",fill:'#eeee00',stroke:'#222222',strokeThickness:6});

    this.timer = this.time.delayedCall(1000,onEvent,null,this);
    this.physics.add.collider
      (
          this.player,
          this.obstacle,
          function(_player,_obstacle)
        {
          if(_player.body.touching.up && _obstacle.body.touching.down
             || _player.body.touching.left && _obstacle.body.touching.right
             || _player.body.touching.right && _obstacle.body.touching.left)
          {
            life -= 1;
            _obstacle.setPosition(RandInt(_obstacle.displayWidth/2,config.width - (_obstacle.displayWidth/2)), -50);
          }
        }
      );
}

function update() {
    this.obstacle.setVelocityX(0);
    if(this.r.isDown)
    {
      pause=false;
      WinOrLose = null;
      this.timer = this.time.delayedCall(1000,onEvent,null,this);
      timeCount = 0;
      life = 3;
      this.player.setVelocityX(0);
      this.obstacle.setPosition(RandInt(this.obstacle.displayWidth/2,config.width - (this.obstacle.displayWidth/2)), -50);
      this.player.setPosition(config.width / 2, config.height - (this.player.displayHeight/2));
      
    }
  
    if(pause==false)
    {
      
      let speed = (50 * timeCount)+300; 
      
      this.chronoText.setText('⏲timer: '+timeCount+'s\nPV: '+life);
      let cursors = this.input.keyboard.createCursorKeys();
      if ((cursors.left.isDown || this.q.isDown) || (cursors.right.isDown || this.d.isDown)) 
      {this.player.setVelocityX(cursors.left.isDown || this.q.isDown ? -270 : 270);}
      else 
      {this.player.setVelocityX(0);}
    
      this.obstacle.setVelocityY(speed);
      
      if(this.obstacle.y > config.height+(this.obstacle.displayWidth/2))
      {this.obstacle.setPosition(RandInt(this.obstacle.displayWidth/2,config.width - (this.obstacle.displayWidth/2)), -50);}
      
      if(this.timer.getProgress()==1)
      {
        this.timer = this.time.delayedCall(1000,onEvent,null,this);
        timeCount += 1;
      }
        
      if(WinOrLose == 'lose')
      {
        this.win.setText('You lose');  
        pause = true;
        this.obstacle.setVelocityY(0);
        this.player.setVelocityX(0);
        this.obstacle.setPosition(RandInt(this.obstacle.displayWidth/2,config.width - (this.obstacle.displayWidth/2)), -50);
        this.player.setPosition(config.width / 2, config.height - (this.player.displayHeight/2));
      }
      
      if(life <= 0)
      {
        WinOrLose = 'lose';
      }
      
      if(WinOrLose == null)
      {
        this.win.setText(); 
      }
    }
 
}

function onEvent()
  {console.log('time out');}

function RandInt(min, max)
{
  Math.round(min);
  Math.round(max);
  return Math.random() * (max - min) + min;
}



function reset(PauseOrNot)
  {
    pause = PauseOrNot;
    this.obstacle.setVelocityY(0);
    this.player.setVelocityX(0);
    this.obstacle.setPosition(RandInt(this.obstacle.displayWidth/2,config.width - (this.obstacle.displayWidth/2)), -50);
    this.player.setPosition(config.width / 2, config.height - (this.player.displayHeight/2));
  }


const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 550,
    //autoCenter: true,
    backgroundColor: '#020E55',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);