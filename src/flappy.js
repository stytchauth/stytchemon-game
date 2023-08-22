import { addButton } from "./button";
import { DINO_SIZE } from "./constants";
import { BURRITO } from "./scenes";
import { addPlaysLeft, addPointsCounter } from "./shared";
import { goAndSave, addPoint } from "./storage";
import { removePlay } from "./utils";
import { scrollMenuOption } from "./shared";

loadSprite("burrito", "sprites/burrito.png");
loadSound("score", "/sounds/score.mp3");
loadSound("wooosh", "/sounds/wooosh.mp3");
loadSound("hit", "/sounds/hit.mp3");

scene("FLAPPY", () => {

  const PIPE_OPEN = 350;
  const PIPE_MIN = 60;
  const JUMP_FORCE = 800;
  const SPEED = 320;
  const CEILING = -60;

  add([
    rect(width(240), height(240)),
    color(207, 231, 252),
    layer("background"),
  ]);
  addPlaysLeft();

  // define gravity
  gravity(3200);

  // a game object consists of a list of components and tags
  const bean = add([
    // sprite() means it's drawn with a sprite of name "bean" (defined above in 'loadSprite')
    sprite("dino", DINO_SIZE),
    // give it a position
    pos(width() / 4, 0),
    // give it a collider
    area(),
    // body component enables it to fall and jump in a gravity world
    body(),
  ]);

  // check for fall death
  bean.onUpdate(() => {
    if (bean.pos.y >= height() || bean.pos.y <= CEILING) {
      // switch to "lose" scene
      go("FLAPPYLOSE", score);
    }
  });

  // jump
  onKeyPress("space", () => {
    bean.jump(JUMP_FORCE);
    play("wooosh");
  });

  // mobile
  onClick(() => {
    bean.jump(JUMP_FORCE);
    play("wooosh");
  });

  function spawnPipe() {
    // calculate pipe positions
    const h1 = rand(PIPE_MIN, height() - PIPE_MIN - PIPE_OPEN);
    const h2 = height() - h1 - PIPE_OPEN;

    const bottomPipe = add([
      pos(width(), h1 + PIPE_OPEN),
      rect(64, h2),
      color(2, 39, 71),
      outline(4),
      area(),
      move(LEFT, SPEED),
      cleanup(),
      "pipe",
      { passed: false },
    ]);

    const topPipe = add([
      pos(width(), 0),
      rect(64, h1),
      color(2, 39, 71),
      outline(4),
      area(),
      move(LEFT, SPEED),
      cleanup(),
      "pipe",
    ]);
  }

  // callback when bean onCollide with objects with tag "pipe"
  bean.onCollide("pipe", () => {
    go("FLAPPYLOSE", score);
    play("hit");
    addKaboom(bean.pos);
  });

  // per frame event for all objects with tag 'pipe'
  onUpdate("pipe", (p) => {
    // check if bean passed the pipe
    if (p.pos.x + p.width <= bean.pos.x && p.passed === false) {
      addScore();
      p.passed = true;
    }
  });

  // spawn a pipe every 1 sec
  loop(1.2, () => {
    spawnPipe();
  });

  let score = 0;

  // display score
  const scoreLabel = add([
    text(score),
    origin("center"),
    pos(width() / 2, 80),
    fixed(),
  ]);

  function addScore() {
    score++;
    scoreLabel.text = score;
    play("score");
  }
});

scene("FLAPPYLOSE", (score) => {
  add([rect(width(240), height(240)), color(212, 6, 6), layer("background")]);
  addPoint(score);
  removePlay();
  addPlaysLeft();
  add([
    text("You Got Burritoed"),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  add([
    sprite("dino", DINO_SIZE),
    pos(width() / 2, height() / 2 - 200),
    scale(3),
    origin("center"),
  ]);

  // display score
  add([
    text(score),
    pos(width() / 2, height() / 2 + 150),
    scale(3),
    origin("center"),
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
          go("FLAPPY");
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

  addButton("Exit", vec2(width() / 2 - 250, height() / 2 + 200), () => {
    goAndSave(BURRITO);
  });

  addButton("Play again", vec2(width() / 2 + 250, height() / 2 + 200), () => {
    go("FLAPPY");
  });
});
