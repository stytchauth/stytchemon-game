export function animateSprite(player, gravityAmount) {
  const SPEED = 120;
  const JUMP_FORCE = 240;

  gravity(gravityAmount);

  // .play is provided by sprite() component, it starts playing the specified animation (the animation information of "idle" is defined above in loadSprite)
  player.play("idle");

  // Add a platform
  add([rect(width(), 24), area(), outline(1), pos(0, height() - 24), solid()]);

  // Switch to "idle" or "run" animation when player hits ground
  player.onGround(() => {
    if (!isKeyDown("left") && !isKeyDown("right")) {
      player.play("idle");
    } else {
      player.play("run");
    }
  });

  player.onAnimEnd("idle", () => {
    // You can also register an event that runs when certain anim ends
  });

  onKeyPress("space", () => {
    if (player.isGrounded()) {
      player.jump(JUMP_FORCE);
      player.play("jump");
    }
  });

  onKeyDown("left", () => {
    player.move(-SPEED, 0);
    player.flipX(true);
    // .play() will reset to the first frame of the anim, so we want to make sure it only runs when the current animation is not "run"
    if (player.isGrounded() && player.curAnim() !== "run") {
      player.play("run");
    }
  });

  onKeyDown("right", () => {
    player.move(SPEED, 0);
    player.flipX(false);
    if (player.isGrounded() && player.curAnim() !== "run") {
      player.play("run");
    }
  });

  onKeyRelease(["left", "right"], () => {
    // Only reset to "idle" if player is not holding any of these keys
    if (player.isGrounded() && !isKeyDown("left") && !isKeyDown("right")) {
      player.play("idle");
    }
  });

  return player;
}

export function bounceSprite() {
  let timer = Math.random() * 10;
  return {
    id: "bounce",
    require: ["pos"],
    update() {
      timer += dt() * 5;
      this.pos = vec2(this.pos.x, this.pos.y + Math.sin(timer) * 0.2);
    },
  };
}
