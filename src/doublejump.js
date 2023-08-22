import { addButton } from "./button";
import { DINO_SIZE } from "./constants";
import { goAndSave, addPoint } from "./storage";
import { BURRITO } from "./scenes";
import { removePlay } from "./utils";
import { addPlaysLeft, addPointsCounter } from "./shared"
import { scrollMenuOption } from "./shared";

loadSprite("lock", "/sprites/lock.png");
loadSprite("grass", "/sprites/grass.png");
loadSprite("burrito", "/sprites/burrito.png");
loadSound("score", "/sounds/score.mp3");

const PLAYER_SPEED = 550;
const JUMP_FORCE = 800;
const NUM_PLATFORMS = 6;

// a spinning component for fun
function spin(speed = 1200) {
  let spinning = false;
  return {
    require: ["rotate"],
    update() {
      if (!spinning) {
        return;
      }
      this.angle -= speed * dt();
      if (this.angle <= -360) {
        spinning = false;
        this.angle = 0;
      }
    },
    spin() {
      spinning = true;
    },
  };
}

scene("JUMP", () => {

  add([
    rect(width(240), height(240)),
    color(207, 231, 252),
    layer("background"),
  ]);

  addPlaysLeft();

  gravity(3000);

  const score = add([
    text("0", 24),
    pos(24, 24),
    {
      value: 0,
    },
  ]);

  const bean = add([
    sprite("dino", DINO_SIZE),
    area(),
    origin("center"),
    pos(0, 0),
    body({ jumpForce: JUMP_FORCE }),
    rotate(0),
    spin(),
  ]);

  for (let i = 1; i < NUM_PLATFORMS; i++) {
    add([
      sprite("grass"),
      area(),
      pos(rand(0, width()), (i * height()) / NUM_PLATFORMS),
      solid(),
      origin("center"),
      "platform",
      {
        speed: rand(120, 320),
        dir: choose([-1, 1]),
      },
    ]);
  }

  // go to the first platform
  bean.pos = get("platform")[0].pos.sub(0, 64);

  function genCoin(avoid) {
    const plats = get("platform");
    let idx = randi(0, plats.length);
    // avoid the spawning on the same platforms
    if (avoid != null) {
      idx = choose([...plats.keys()].filter((i) => i !== avoid));
    }
    const plat = plats[idx];
    add([
      pos(),
      origin("center"),
      sprite("lock"),
      area(),
      follow(plat, vec2(0, -60)),
      "lock",
      { idx: idx },
      scale(0.35),
    ]);
  }

  genCoin(0);

  for (let i = 0; i < width() / 64; i++) {
    add([
      pos(i * 64, height()),
      sprite("burrito"),
      area(),
      origin("bot"),
      scale(),
      "danger",
    ]);
  }

  bean.onCollide("danger", () => {
    destroyAll("danger");
    go("JUMPLOSE", score.value);
  });

  bean.onCollide("lock", (c) => {
    destroy(c);
    play("score");
    score.value += 5;
    score.text = score.value;
    genCoin(c.idx);
  });

  // spin on double jump
  bean.onDoubleJump(() => {
    bean.spin();
  });

  onUpdate("platform", (p) => {
    p.move(p.dir * p.speed, 0);
    if (p.pos.x < 0 || p.pos.x > width()) {
      p.dir = -p.dir;
    }
  });

  onKeyPress("space", () => {
    bean.doubleJump();
  });

  // both keys will trigger
  onKeyDown("left", () => {
    bean.move(-PLAYER_SPEED, 0);
  });

  onKeyDown("right", () => {
    bean.move(PLAYER_SPEED, 0);
  });

  let time = 30;

  const timer = add([origin("topright"), pos(width() - 24, 24), text(time)]);

  onUpdate(() => {
    time -= dt();
    if (time <= 0) {
      go("JUMPWIN", score.value);
    }
    timer.text = time.toFixed(2);
  });
});

scene("JUMPWIN", (score) => {
  addPoint(score);

  const player = add([
    sprite("dino", DINO_SIZE),
    pos(width() / 2, height() / 2 - 160),
    scale(2),
    origin("center"),
  ]);

  player.play("idle");

  // display score
  add([
    text(score),
    pos(width() / 2, height() / 2),
    scale(2),
    origin("center"),
  ]);

  addButton("Exit", vec2(width() / 2 - 150, height() / 2 + 130), () => {
    goAndSave(BURRITO);
  });

  addButton("Play again", vec2(width() / 2 + 150, height() / 2 + 130), () => {
    go("JUMP");
  });
});

scene("JUMPLOSE", (score) => {
  addPoint(score);

  add([rect(width(240), height(240)), color(212, 6, 6), layer("background")]);

  add([
    text("You Got Burritoed"),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  addPointsCounter();

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
          go("JUMP");
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

  addButton("Exit", vec2(width() / 2 - 150, height() / 2 + 100), () => {
    goAndSave(BURRITO);
  });

  addButton("Play again", vec2(width() / 2 + 150, height() / 2 + 100), () => {
    go("JUMP");
  });

  removePlay();
});
