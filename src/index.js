import kaboom from "kaboom";
import { AUTH_FLOW } from "./scenes";
import { getSavedScene } from "./storage";

kaboom({
  scale: 0.9,
  background: [243, 252, 249],
});

// Loading a multi-frame sprite
loadSprite("dino", "/sprites/dino.png", {
  // The image contains 9 frames layed out horizontally, slice it into individual frames
  sliceX: 9,
  // Define animations
  anims: {
    idle: {
      // Starts from frame 0, ends at frame 3
      from: 0,
      to: 3,
      // Frame per second
      speed: 5,
      loop: true,
    },
    run: {
      from: 4,
      to: 7,
      speed: 10,
      loop: true,
    },
    // This animation only has 1 frame
    jump: 8,
  },
});

require("./auth");
require("./burritos");
require("./gameover");

const scene = getSavedScene() ?? AUTH_FLOW;
go(scene, 0);
