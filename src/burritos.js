import { DINO_SIZE } from "./constants";
import { BURRITO, HOME, SHOOTER, AUTH_FLOW } from "./scenes";
import { addPoint, goAndSave, clearStorage } from "./storage";
import { bounceSprite } from "./animations";
import "./shooter";
import "./flappy";
import "./doublejump";
import { addDialog } from "./dialog";
import { addButton } from "./button";
import { addPointsCounter, addStytchWordmark, addPlaysLeft, stytch } from "./shared";

loadSprite("brick", "/sprites/brick.jpg");
loadSprite("door", "/sprites/door.png");
loadSprite("burrito", "/sprites/burrito.png");
loadSprite("howard", "/sprites/howard.png");

scene(BURRITO, () => {
  addPointsCounter();
  addButton("Reset", vec2(100, 94), () => {
      clearStorage();
      stytch.session.revoke();
      goAndSave(AUTH_FLOW, 0);
  });
  addStytchWordmark();
  addPlaysLeft();

  const level = [
    "             ",
    "             ",
    "=============",
    "=           =",
    "= .       @ |",
    "=           =",
    "=           =",
    "=    $      =",
    "=           =",
    "= .         =",
    "=           =",
    "=         . =",
    "=           =",
    "=============",
  ];

  addLevel(level, {
    width: 64,
    height: 64,
    pos: vec2(width() / 2 - (64 * 13) / 2, 64),
    "=": () => [sprite("brick", { width: 64, height: 64 }), area(), solid()],
    "-": () => [sprite("steel"), area(), solid()],
    "@": () => [sprite("dino", DINO_SIZE), area(), solid(), "player"],
    ".": () => [
      sprite("burrito", { width: 64, height: 64 }),
      rotate(),
      bounceSprite(),
      area(),
      solid(),
      "burrito",
    ],
    "|": () => [
      sprite("door", { width: 65, height: 65 }),
      area(),
      solid(),
      "door",
    ],
    $: () => [sprite("howard", { width: 110 }), area(), solid(), "howard"],
  });

  const player = get("player")[0];
  player.play("idle");

  player.onCollide("door", () => {
    goAndSave(AUTH_FLOW, 3);
  });

  const burrito1 = get("burrito")[0];
  burrito1.onCollide("player", () => {
    go(SHOOTER);
  });

  const burrito2 = get("burrito")[1];
  burrito2.onCollide("player", () => {
    go("FLAPPY");
  });

  const burrito3 = get("burrito")[2];
  burrito3.onCollide("player", () => {
    go("JUMP");
  });

  const dialog = addDialog();
  player.onCollide("howard", () => {
    const getButton = () => {
      return addButton(
        "Set up hot corners",
        vec2(width() / 2, height() - 64),
        () => {
          addPoint();
          window.open(
            "https://support.apple.com/guide/mac-help/use-hot-corners-mchlp3000/mac",
            "_blank"
          );
        },
        { alwaysColor: true, zIndex: 101 }
      );
    };
    dialog.say("Don't let your coworkers burrito you on Slack!", {
      size: 40,
      getComp: getButton,
      center: true,
    });
  });

  const dirs = {
    left: LEFT,
    right: RIGHT,
    up: UP,
    down: DOWN,
  };

  for (const dir in dirs) {
    onKeyPress(dir, () => {
      dialog.dismiss();
    });
    onKeyDown(dir, () => {
      player.move(dirs[dir].scale(320));
    });
  }
});
