import { Ship } from "./Ship.js";
import { EnemyManager } from "./EnemyManager.js";
import { Gun } from "./Gun.js";
import { ParticleManager } from "./ParticleManager.js";
import { StarField } from "./StarField.js";
import { PlayerPreview } from "./PlayerPreview.js";

const game = (s) => {
  let player,
    gun,
    enemyManager,
    particleManager,
    starField,
    possiblePlayerCharacters,
    sprites = {},
    playerHasSelectedCharacter = false;

  const setSelectedPlayer = (character) => {
    player = new Ship(s, character);
    playerHasSelectedCharacter = true;
  };

  s.preload = () => {
    s.preloadCharacterSprites();
    s.preloadEnemySprites();
    s.preloadBulletSprite();
  };

  s.setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight);
    gun = new Gun(sprites.bullet);
    particleManager = new ParticleManager();
    enemyManager = new EnemyManager(s, particleManager, sprites.enemies);
    enemyManager.spawnEnemies(s);
    starField = new StarField(s);
    const spriteSize = 48;
    possiblePlayerCharacters = sprites.player.map((sprite, idx) => {
      return new PlayerPreview(
        s.width / 2 + idx * (spriteSize * 1.2) - 220,
        s.height / 2,
        sprite,
        spriteSize,
        setSelectedPlayer
      );
    });
  };

  s.draw = () => {
    s.background(0);
    starField.update();
    if (playerHasSelectedCharacter) {
      s.gameScene();
    } else {
      s.characterSelectionScene();
    }
  };

  s.characterSelectionScene = () => {
    s.fill(200);
    s.textSize(24);
    s.text("choose your fighter", s.width / 2 - 60, s.height / 2 - 60);
    possiblePlayerCharacters.forEach((character) => character.show(s));
  };

  s.gameScene = () => {
    player.controls(s);
    player.showGas(s);
    s.collisionTest();
    gun.show(s);
    player.show(s);
    enemyManager.show(s);
    enemyManager.displayCurrentWave(s);
    s.renderScore();
    particleManager.purgeParticles();
    particleManager.renderParticles(s);
  };

  s.keyPressed = () => {
    if (playerHasSelectedCharacter) gun.shoot(s.keyCode, player.x, player.y);
  };

  s.mousePressed = () => {
    // select a player
    possiblePlayerCharacters.forEach((character) => character.clicked(s));
  };

  s.collisionTest = () => {
    enemyManager.enemies.forEach((enemy, enemyIdx) => {
      // handle enemies making it "past the front"
      if (enemy.y > s.height) {
        enemyManager.killEnemy(s, enemyIdx);
        player.applyPenalty(enemy.pointValue);
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
    });
  };

  s.renderScore = () => {
    s.fill(200);
    s.textSize(24);
    s.text(`score: ${player.score}`, 5, s.height - 35);
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
};

new p5(game);
