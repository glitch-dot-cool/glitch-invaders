import { Player } from "./Player.js";
import { EnemyManager } from "./EnemyManager.js";
import { Gun } from "./Gun.js";
import { ParticleManager } from "./ParticleManager.js";
import { StarField } from "./StarField.js";
import { PlayerPreview } from "./PlayerPreview.js";
import { PowerupManager } from "./PowerupManager.js";
import { Server } from "./Server.js";

const game = (s) => {
  const gameStates = { CHARACTER_SELECT: 0, PLAYING: 1, DEAD: 2 };

  let player,
    gun,
    enemyManager,
    particleManager,
    powerupManager,
    starField,
    possiblePlayerCharacters,
    sprites = {},
    gameState = gameStates.CHARACTER_SELECT,
    font,
    restartButton,
    server;

  const setSelectedPlayer = (character) => {
    gun = new Gun(sprites.bullet);
    player = new Player(s, character, gun);
    gameState = gameStates.PLAYING;
    possiblePlayerCharacters = null;
    powerupManager = new PowerupManager(s, sprites.powerups, gun);
    enemyManager = new EnemyManager(
      s,
      powerupManager,
      particleManager,
      sprites.enemies
    );
    enemyManager.spawnEnemies(s);
  };

  const setGameState = (state) => {
    gameState = state;
  };

  s.preload = () => {
    s.preloadCharacterSprites();
    s.preloadEnemySprites();
    s.preloadBulletSprite();
    s.preloadPowerupSprites();
    font = s.loadFont("assets/JetBrainsMono-Regular.ttf");
  };

  s.setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight);
    s.textFont(font);
    restartButton = s.createButton("restart");
    restartButton.mousePressed(() => location.reload());
    particleManager = new ParticleManager();
    starField = new StarField(s);
    server = new Server();
    const spriteSize = 48;
    possiblePlayerCharacters = sprites.player.map((sprite, idx) => {
      return new PlayerPreview(
        s.width / 2 + idx * (spriteSize * 1.2) - 250,
        s.height / 2,
        sprite,
        spriteSize,
        setSelectedPlayer,
        s
      );
    });
  };

  s.draw = () => {
    s.background(0);
    starField.update();

    switch (gameState) {
      case gameStates.CHARACTER_SELECT:
        s.characterSelectionScene();
        break;
      case gameStates.PLAYING:
        s.gameScene();
        break;
      case gameStates.DEAD:
        s.deathScene();
        break;
    }
  };

  s.characterSelectionScene = () => {
    s.fill(200);
    s.textSize(24);
    s.text("choose your fighter", s.width / 2 - 120, s.height / 2 - 60);
    possiblePlayerCharacters.forEach((character) => character.show(s));
  };

  s.gameScene = () => {
    player.controls(s);
    player.showBattery(s);
    s.collisionTest();
    gun.show(s);
    player.show(s);
    server.show(s);
    enemyManager.show(s);
    enemyManager.displayCurrentWave(s);
    powerupManager.show(s);
    s.renderScore();
    particleManager.purgeParticles();
    particleManager.renderParticles(s);
  };

  s.deathScene = () => {
    s.fill(175, 0, 0);
    s.textSize(64);
    s.text("YOU ARE DEAD", s.width / 2 - 200, s.height / 2);
    restartButton.position(s.width / 2, s.height / 2 + 50);

    if (s.frameCount % 3 === 0) {
      particleManager.emit(s, { x: s.random(s.width), y: s.random(s.height) });
    }
    particleManager.purgeParticles();
    particleManager.renderParticles(s);
  };

  s.mousePressed = () => {
    if (gameState === gameStates.CHARACTER_SELECT) {
      possiblePlayerCharacters.forEach((character) => character.clicked(s));
    }
  };

  s.collisionTest = () => {
    enemyManager.enemies.forEach((enemy, enemyIdx) => {
      // handle enemies making it "past the front"
      if (enemy.y > s.height) {
        enemyManager.killEnemy(s, enemyIdx);
        player.applyPenalty(enemy.pointValue);
        server.takeDamage(enemy.pointValue, setGameState, gameStates);
      }

      // handle bullet collisions with enemies
      gun.bullets.forEach((bullet, bulletIdx) => {
        const dist = s.dist(bullet.x, bullet.y, enemy.x, enemy.y);
        if (dist < enemy.size) {
          gun.deleteBullet(bulletIdx);
          enemyManager.killEnemy(s, enemyIdx);
          player.updateScore(enemy.pointValue);
        }
      });

      // handle enemies hitting player
      const dist = s.dist(enemy.x, enemy.y, player.x, player.y);
      if (dist < enemy.size) {
        player.hit(enemy, setGameState, gameStates);
        enemyManager.killEnemy(s, enemyIdx);
      }
    });
    // handle collisions w/ powerups
    powerupManager.activePowerups.forEach((powerup, idx) => {
      if (
        player.x > powerup.x &&
        player.x < powerup.x + powerup.width &&
        player.y > powerup.y &&
        player.y < powerup.y + powerup.height
      ) {
        powerup.consume();
        powerupManager.purge(idx);
      }
    });
  };

  s.renderScore = () => {
    s.fill(200);
    s.textSize(24);
    s.text(`score: ${player.score.toLocaleString()}`, 5, s.height - 35);
    s.textSize(16);
    s.text(`multiplier: ${player.multiplier}x`, 5, s.height - 15);
  };

  s.preloadCharacterSprites = () => {
    sprites.player = [
      s.loadImage("assets/characters/woulg.png"),
      s.loadImage("assets/characters/nuan.png"),
      s.loadImage("assets/characters/soup.png"),
      s.loadImage("assets/characters/mfs_square.png"),
      s.loadImage("assets/characters/oddlogic.png"),
      s.loadImage("assets/characters/jim.png"),
      s.loadImage("assets/characters/meii.png"),
      s.loadImage("assets/characters/sunnk.png"),
      s.loadImage("assets/characters/vaeprism.png"),
      s.loadImage("assets/characters/abroxis.png"),
    ];
  };

  s.preloadEnemySprites = () => {
    sprites.enemies = [
      s.loadImage("assets/enemies/tears1.png"),
      s.loadImage("assets/enemies/tears2.png"),
      s.loadImage("assets/enemies/tears3.png"),
      s.loadImage("assets/enemies/tears4.png"),
    ];
  };

  s.preloadBulletSprite = () => {
    sprites.bullet = s.loadImage("assets/logo_bullet.png");
  };

  s.preloadPowerupSprites = () => {
    sprites.powerups = {
      rateOfFire: s.loadImage("assets/powerups/fire_rate.png"),
      numBullets: s.loadImage("assets/powerups/increase_bullets.png"),
    };
  };

  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
  };
};

new p5(game);
