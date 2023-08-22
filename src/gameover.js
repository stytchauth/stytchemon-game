import { GAME_OVER } from "./scenes";
import { addButton } from "./button";
import { clearStorage, goAndSave, getTotalPoints } from "./storage";
import { AUTH_FLOW } from "./scenes";
import { stytch } from "./shared";
import { STYTCH_BLUE, STYTCH_GREEN, STYTCH_YELLOW, TEXT_SIZE } from "./constants";
import { scrollMenuOption } from "./shared";

function promptName () {
    let name = prompt("Name");
    if (name != "" && name != null) {
        console.log("updating name");
        stytch.user.update({
            untrusted_metadata: {
                name: name,
            },
        }).then(() => {
            destroyAll("nameInput");
            add([
                text("Thanks " + name + "!", { size: 50}),
                pos(width() / 2, height() / 2 + 200),
                STYTCH_GREEN,
                origin("center"),
            ]);
        })
    }
    else {
        alert("Please enter a non-empty name for the leaderboard!")
    }
};

scene(GAME_OVER, () => {
    const score = getTotalPoints();
    const user = stytch.user.getSync();
    if (!user) {
        goAndSave(AUTH_FLOW, 0);
        clearStorage();
    }
    else {
        const name = user.untrusted_metadata?.name;
        const previous_high_score = user.untrusted_metadata?.high_score
    
        add([
            rect(width(240), height(240)),
            STYTCH_BLUE,
            layer("background"),
        ]);
    
        add([
            text("GAME OVER", { size: 150}),
            pos(width() / 2, 200),
            STYTCH_YELLOW,
            origin("center"),
        ]);
        
    
        // If we have a score saved
        if (!previous_high_score || (previous_high_score && previous_high_score < score)) {
            add([
                text("New high score: " + score, {size: 70}),
                pos(width() / 2, height() / 2 - 100),
                STYTCH_GREEN,
                origin("center"),
            ]);
    
            // Update the User's high score
            stytch.user.update({
                untrusted_metadata: {
                    high_score: score,
                }
            });

            console.log("STYTCH_USER", stytch.user.getSync());
        }
    
        else if (previous_high_score) {
            add([
                text("Current score: " + score, {size: 70}),
                STYTCH_GREEN,
                pos(width() / 2, height() / 2 - 100),
                origin("center"),
            ]);
            add([
                text("Your high score: " + previous_high_score, {size: 70}),
                STYTCH_GREEN,
                pos(width() / 2, height() / 2),
                origin("center"),
            ]);
        }
    
        else {
            add([
                text("Score: " + score, { size: 70}),
                pos(width() / 2, height() / 2 - 100),
                STYTCH_GREEN,
                origin("center"),
            ]);
        }
    
        // If we don't have a name, prompt for one
        if (name == "" || name == null || !name) {
            add([
                text("Please enter a name for the scoreboard", { size: TEXT_SIZE }),
                pos(vec2(width() / 2, height() / 2 + 100)),
                area(),
                origin("center"),
                z(0),
                "button",
                "nameInput",
            ]);
        }

        onClick("nameInput", () => {
            promptName();
        })
        
        let menuOptions = ["Reset", "Please enter a name for the scoreboard"];
        let optionSelected = "Please enter a name for the scoreboard";
      
        onKeyPressRepeat("left", () => {
          optionSelected = scrollMenuOption("left", optionSelected, menuOptions);
        });

        onKeyPressRepeat("up", () => {
            optionSelected = scrollMenuOption("up", optionSelected, menuOptions);
          });
      
        onKeyPressRepeat("right", () => {
          optionSelected = scrollMenuOption("right", optionSelected, menuOptions);
        });

        onKeyPressRepeat("down", () => {
            optionSelected = scrollMenuOption("down", optionSelected, menuOptions);
          });
      
        onKeyPress("space", () => {
          switch(optionSelected) {                
              case "Reset":
                clearStorage();
                stytch.session.revoke();
                goAndSave(AUTH_FLOW, 0);
                break;
              case "Please enter a name for the scoreboard":
                promptName();
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
    
        if (name) {
            add([
                text("Thanks " + name + "!", { size: 50}),
                pos(width() / 2, height() / 2 + 200),
                STYTCH_GREEN,
                origin("center"),
            ]);
        }
    
        addButton("Reset", vec2(100, 64), () => {
            clearStorage();
            stytch.session.revoke();
            goAndSave(AUTH_FLOW, 0);
        });    
    }

});