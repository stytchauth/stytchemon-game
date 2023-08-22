import { addButton } from "./button";
import { DINO_SIZE } from "./constants";
import { BURRITO, SHOOTER, END_GAME } from "./scenes";
import { addPoint, goAndSave } from "./storage";
import { removePlay } from "./utils";
import { addPlaysLeft, addPointsCounter } from "./shared";
import { scrollMenuOption } from "./shared";

const objs = [
  "ghosty",
  "burrito",
  "burrito",
  "burrito",
  "burrito",
  "burrito",
  "burrito",
];

for (const obj of objs) {
  loadSprite(obj, `/sprites/${obj}.png`);
}

loadSound("hit", "/sounds/hit.mp3");
loadSound("shoot", "/sounds/shoot.mp3");
loadSound("explode", "/sounds/explode.mp3");
loadSound("OtherworldlyFoe", "/sounds/OtherworldlyFoe.mp3");

scene(SHOOTER, () => {
  const BULLET_SPEED = 1200;
  const TRASH_SPEED = 120;
  const BOSS_SPEED = 70;
  const PLAYER_SPEED = 600;
  const STAR_SPEED = 120;
  const BOSS_HEALTH = 150;
  const OBJ_HEALTH = 2;

  const bossName = "burrito";

  let insaneMode = false;

  const music = play("OtherworldlyFoe");

  volume(0.5);

  add([
    rect(width(240), height(250)),
    color(207, 231, 252),
    layer("background"),
  ]);

  addPlaysLeft();

  function grow(rate) {
    return {
      update() {
        const n = rate * dt();
        this.scale.x += n;
        this.scale.y += n;
      },
    };
  }

  function late(t) {
    let timer = 0;
    return {
      add() {
        this.hidden = true;
      },
      update() {
        timer += dt();
        if (timer >= t) {
          this.hidden = false;
        }
      },
    };
  }

  add([
    text("KILL", { size: 160 }),
    pos(width() / 2, height() / 2),
    origin("center"),
    lifespan(1),
    fixed(),
  ]);

  add([
    text("THE", { size: 80 }),
    pos(width() / 2, height() / 2),
    origin("center"),
    lifespan(2),
    late(1),
    fixed(),
  ]);

  add([
    text(bossName.toUpperCase(), { size: 120 }),
    pos(width() / 2, height() / 2),
    origin("center"),
    lifespan(4),
    late(2),
    fixed(),
  ]);

  const sky = add([rect(width(), height()), color(0, 0, 0), opacity(0)]);

  sky.onUpdate(() => {
    if (insaneMode) {
      const t = time() * 10;
      sky.color.r = wave(127, 255, t);
      sky.color.g = wave(127, 255, t + 1);
      sky.color.b = wave(127, 255, t + 2);
      sky.opacity = 1;
    } else {
      sky.color = rgb(0, 0, 0);
      sky.opacity = 0;
    }
  });

  const player = add([
    sprite("dino", DINO_SIZE),
    area(),
    pos(width() / 2, height() - 64),
    origin("center"),
  ]);

  onKeyDown("left", () => {
    player.move(-PLAYER_SPEED, 0);
    if (player.pos.x < 0) {
      player.pos.x = width();
    }
  });

  onKeyDown("right", () => {
    player.move(PLAYER_SPEED, 0);
    if (player.pos.x > width()) {
      player.pos.x = 0;
    }
  });

  onKeyPress("up", () => {
    insaneMode = true;
    music.speed(2);
  });

  onKeyRelease("up", () => {
    insaneMode = false;
    music.speed(1);
  });

  player.onCollide("enemy", (e) => {
    destroy(e);
    destroy(player);
    shake(120);
    play("explode");
    music.detune(-1200);
    addExplode(center(), 12, 120, 30);
    wait(1, () => {
      music.stop();
      go(END_GAME, false);
    });
  });

  function addExplode(p, n, rad, size) {
    for (let i = 0; i < n; i++) {
      wait(rand(n * 0.1), () => {
        for (let i = 0; i < 2; i++) {
          add([
            pos(p.add(rand(vec2(-rad), vec2(rad)))),
            rect(4, 4),
            outline(4),
            scale(1 * size, 1 * size),
            lifespan(0.1),
            grow(rand(48, 72) * size),
            origin("center"),
          ]);
        }
      });
    }
  }

  function spawnBullet(p) {
    add([
      rect(12, 48),
      area(),
      pos(p),
      origin("center"),
      color(127, 127, 255),
      outline(4),
      move(UP, BULLET_SPEED),
      cleanup(),
      // strings here means a tag
      "bullet",
    ]);
  }

  onUpdate("bullet", (b) => {
    if (insaneMode) {
      b.color = rand(rgb(0, 0, 0), rgb(255, 255, 255));
    }
  });

  onKeyPress("space", () => {
    spawnBullet(player.pos.sub(16, 0));
    spawnBullet(player.pos.add(16, 0));
    play("shoot", {
      volume: 0.3,
      detune: rand(-1200, 1200),
    });
  });

  function spawnTrash() {
    const name = choose(objs.filter((n) => n != bossName));
    add([
      sprite(name),
      area(),
      pos(rand(0, width()), 0),
      health(OBJ_HEALTH),
      origin("bot"),
      "trash",
      "enemy",
      { speed: rand(TRASH_SPEED * 0.5, TRASH_SPEED * 1.5) },
    ]);
    wait(insaneMode ? 0.1 : 0.3, spawnTrash);
  }

  const boss = add([
    sprite(bossName),
    area(),
    pos(width() / 2, 40),
    health(BOSS_HEALTH),
    scale(2),
    origin("top"),
    "enemy",
    {
      dir: rand() > 0.5 ? 1 : -1,
    },
  ]);

  on("death", "enemy", (e) => {
    destroy(e);
    shake(2);
    addKaboom(e.pos);
    addPoint(.5);
  });

  on("hurt", "enemy", (e) => {
    shake(1);
    play("hit", {
      detune: rand(-1200, 1200),
      speed: rand(0.2, 2),
    });
  });

  const timer = add([text(0), pos(12, 32), fixed(), { time: 0 }]);

  timer.onUpdate(() => {
    timer.time += dt();
    timer.text = timer.time.toFixed(2);
  });

  onCollide("bullet", "enemy", (b, e) => {
    destroy(b);
    e.hurt(insaneMode ? 10 : 1);
    addExplode(b.pos, 1, 24, 1);
  });

  onUpdate("trash", (t) => {
    t.move(0, t.speed * (insaneMode ? 5 : 1));
    if (t.pos.y - t.height > height()) {
      destroy(t);
    }
  });

  boss.onUpdate((p) => {
    boss.move(BOSS_SPEED * boss.dir * (insaneMode ? 3 : 1), 0);
    if (boss.dir === 1 && boss.pos.x >= width() - 20) {
      boss.dir = -1;
    }
    if (boss.dir === -1 && boss.pos.x <= 20) {
      boss.dir = 1;
    }
  });

  boss.onHurt(() => {
    healthbar.set(boss.hp());
  });

  boss.onDeath(() => {
    music.stop();
    addPoint();
    go(END_GAME, true);
  });

  const healthbar = add([
    rect(width(), 24),
    pos(0, 0),
    color(127, 255, 127),
    fixed(),
    {
      max: BOSS_HEALTH,
      set(hp) {
        this.width = (width() * hp) / this.max;
        this.flash = true;
      },
    },
  ]);

  healthbar.onUpdate(() => {
    if (healthbar.flash) {
      healthbar.color = rgb(255, 255, 255);
      healthbar.flash = false;
    } else {
      healthbar.color = rgb(155, 127, 255);
    }
  });

  add([
    text("UP: insane mode", { width: width() / 2, size: 32 }),
    origin("botleft"),
    pos(24, height() - 24),
  ]);

  spawnTrash();
});

scene(END_GAME, (won) => {
  if (won) {
    addPoint(10);
  }

  const b = burp({
    loop: false,
  });

  loop(0.5, () => {
    b.detune(rand(-1200, 1200));
  });

  add([
    rect(width(240), height(240)),
    color(207, 231, 252),
    layer("background"),
  ]);

  removePlay();
  addPointsCounter();

  add([
    sprite("burrito"),
    won ? color(0, 255, 0) : color(255, 0, 0),
    origin("center"),
    scale(5),
    pos(width() / 2, height() / 2),
  ]);

  add([
    text(`You ${won ? "WIN" : "LOSE"}`, { size: 120 }),
    origin("center"),
    pos(width() / 2, height() / 2 - 250),
  ]);

  add([
    text("SET UP HOT CORNERS"),
    origin("center"),
    pos(width() / 2, height() / 2 - 100),
  ]);

  add([
    text("TO PROTECT YOUR LAPTOP"),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  addButton("Exit", vec2(width() / 2 - 150, height() / 2 + 100), () => {
    goAndSave(BURRITO);
  });

  addButton("Play again", vec2(width() / 2 + 150, height() / 2 + 100), () => {
    go(SHOOTER);
  });

  let menuOptions = ["Exit", "Play again"];
  let optionSelected = "Exit";

  onKeyPressRepeat("left", () => {
    optionSelected = scrollMenuOption("left", optionSelected, menuOptions);
  });

  onKeyPressRepeat("right", () => {
    optionSelected = scrollMenuOption("right", optionSelected, menuOptions);
  });

  onKeyPress("space", () => {
    switch(optionSelected) {                
        case "Exit":
          goAndSave(BURRITO);
          break;
        case "Play again":
          go(SHOOTER);
          break;
    }
  })

  onUpdate("button", (text) => {            // console.log('text', text);
    if (text.isHovering() || text.text === optionSelected) {
        const t = time() * 10
        text.color = rgb(
            wave(0, 255, t),
            wave(0, 255, t + 2),
            wave(0, 255, t + 4),
        )
        text.scale = vec2(1.2)
    } else {
        text.scale = vec2(1)
        text.color = rgb()
    }
  })
});
