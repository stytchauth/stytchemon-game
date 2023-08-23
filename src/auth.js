import { AUTH_FLOW } from "./scenes";
import { addButton } from "./button";
import { 
    goAndSave,
    setAuthKey,
    getAuthKey,
    addPoint,
    setPlaysLeft,
} from "./storage";
import { BURRITO } from "./scenes";
import { stytch, scrollMenuOption } from "./shared";
import { 
    DINO_SIZE, 
    TEXT_SIZE, 
    STYTCH_BLUE,
    SEND_SMS_OTP_TEXT,
    VALIDATE_SMS_OTP_TEXT,
    SEND_EMAIL_OTP_TEXT,
    VALIDATE_EMAIL_OTP_TEXT,
    EXIT_COMPUTER_TEXT,
    EXIT_COMPUTER_WITH_KEY
} from "./constants";
import { addPointsCounter, addStytchWordmark, addPlaysLeft, sendEmailOTP, sendSMSOTP, authOTP } from "./shared";
import { clearStorage } from "./storage";

loadSprite("julianna", "/sprites/julianna.png")
loadSprite("zack", "/sprites/zack.png")
loadSprite("door", "/sprites/door.png")
loadSprite("computer", "/sprites/computer.png")
loadSprite("brick", "/sprites/brick.jpg")
loadSprite("key", "/sprites/key.png")
loadSprite("meat", "/sprites/meat.png")
loadSprite("grape", "/sprites/grape.png")
loadSprite("kaytranada", "/sprites/kaytranada.png")
loadSprite("arcade", "/sprites/arcade.png")
loadSprite("phone", "/sprites/iphone.png")
loadSprite("email", "/sprites/email.png")
loadSprite("openDoor", "/sprites/open_door.png")


scene(AUTH_FLOW, (levelIdx) => {
    addPointsCounter();
    addButton("Reset", vec2(100, 94), () => {
        clearStorage();
        stytch.session.revoke();
        goAndSave(AUTH_FLOW, 0);
    });
    addStytchWordmark();
    setPlaysLeft();
    addPlaysLeft();


    const SPEED = 320;

	// character dialog data
	const characters = {
		"a": {
			sprite: "julianna",
			msg: "Try out a Stytch auth flow to get a key!",
            size: {width: 128, height: 128}
		},
		"b": {
			sprite: "zack",
			msg: "lunch is here!",
            size: {width: 128, height: 128}
		},
	};

	// level layouts
	const levels = [
		[
            "             ",
            "             ",
			"============= ",
			"= g         =",
			"=           =",
			"=======|===== ",
			"=        a  =",
			"=  @        =",
			"=           =",
			"=           =",
            "=:::     ///=",
            "=:::     ///=",
            "=:::     ///=",
			"=============",
		],
        [
            "             ",
            "             ",
			"============= ",
			"= g         =",
			"=           =",
			"=======|===== ",
			"=        a  =",
			"=           =",
			"=  k        =",
			"=           =",
            "=:::     ///=",
            "=:::  @  ///=",
            "=:::     ///=",
			"=============",
		],
        [
            "             ",
            "             ",
			"============= ",
			"= g         =",
			"=           =",
			"=======o ==== ",
			"=      @ a  =",
			"=           =",
			"=           =",
			"=           =",
            "=:::     ///=",
            "=:::     ///=",
            "=:::     ///=",
			"=============",
		],
        [
            "             ",
            "             ",
			"============= ",
			"= g @       =",
			"=           =",
			"=======o ==== ",
			"=        a  =",
			"=           =",
			"=           =",
			"=           =",
            "=:::     ///=",
            "=:::     ///=",
            "=:::     ///=",
			"=============",
		],
	];

	addLevel(levels[levelIdx], {
		width: 64,
		height: 64,
		pos: vec2(width() / 2 - (64 * 13) / 2, 0),
		"=": () => [
			sprite("brick", {width: 64, height: 64}),
			area(),
			solid()
		],
		"-": () => [
			sprite("brick", {width: 64, height: 64}),
			area(),
			solid()
		],
		"$": () => [
			sprite("arcade", {width: 150, height: 150}),
			area(),
			"arcade"
		],
		"@": () => [
			sprite("dino", DINO_SIZE),
			area(),
			solid(),
			"player"
		],
		"|": () => [
			sprite("door", {width: 65, height: 65}),
			area(),
			solid(),
			"door"
		],
        "x": () => [
            sprite("meat", {width: 64, height: 64}),
            area(),
            solid()
        ],
        "y": () => [
            sprite("grape", {width: 64, height: 64}),
            area(),
            solid(),
        ],
        "g": () => [
            sprite("arcade", {width: 64, height: 100}),
            area(),
            solid(),
            "arcade"
        ],
        ":": () => [rect(64, 64), color(198, 241, 255), area(), solid(), "SMS"],
        "/": () => [rect(64, 64), color(212, 206, 255), area(), solid(), "Email"],
        "o": () => [
            sprite("openDoor", {width: 70, height: 70}),
        ],
        "k": () => [
            sprite("key", {width: 64, height: 64}),
            area(), 
            solid(),
            "key",
        ],
		// any() is a special function that gets called everytime there's a
		// symbole not defined above and is supposed to return what that symbol
		// means
		any(ch) {
			const char = characters[ch]
			if (char) {
				return [
					sprite(char.sprite, char.size),
					area(),
					solid(),
					"character",
					{ msg: char.msg, },
				]
			}
		},
	});

    add([
        pos(width() / 2 - 310, 700),
        sprite("phone", {
            width: 100,
            height: 100,
        }),
    ]);

    add([
        pos(width() / 2 + 215, 710),
        sprite("email", {
            width: 100,
            height: 75,
        }),
    ]);

	// get the player game obj by tag
	const player = get("player")[0];
    player.play("idle");

	function addDialog() {
		const h = 160
		const pad = 16
		const bg = add([
			pos(0, height() - h),
			rect(width(), h),
			color(0, 0, 0),
			z(100),
		])
		const txt = add([
			text("", {
				width: width(),
			}),
			pos(0 + pad, height() - h + pad),
			z(100),
		])
		bg.hidden = true
		txt.hidden = true
		return {
			say(t) {
				txt.text = t
				bg.hidden = false
				txt.hidden = false
			},
			dismiss() {
				if (!this.active()) {
					return
				}
				txt.text = ""
				bg.hidden = true
				txt.hidden = true
			},
			active() {
				return !bg.hidden
			},
			destroy() {
				bg.destroy()
				txt.destroy()
			},
		}
	}

	const dialog = addDialog()

	player.onCollide("SMS", () => {
        go("api_challenge", "sms")
	})

    player.onCollide("Email", () => {
        // setAuthKey(true); here for backdoor
        go("api_challenge", "email")
	})

    player.onCollide("key", () => {
        setAuthKey(true);
        destroyAll("key");
    })

    scene("api_challenge", (type) => {
        let methodID;
        background: [51, 151, 255];
        add([
            rect(width(240), height(240)),
            STYTCH_BLUE,
            layer("background"),
        ])

        // Code to allow for scrolling to select menu options (mostly for the controller to work in this scene)
        let menuOptions = [];
        let optionSelected = "";

        if(type == "sms") {
            menuOptions = [SEND_SMS_OTP_TEXT, VALIDATE_SMS_OTP_TEXT, EXIT_COMPUTER_TEXT];
            optionSelected = SEND_SMS_OTP_TEXT
        }
        if(type == "email") {
            menuOptions = [SEND_EMAIL_OTP_TEXT, VALIDATE_EMAIL_OTP_TEXT, EXIT_COMPUTER_TEXT];
            optionSelected = SEND_EMAIL_OTP_TEXT
        }
        
        onKeyPressRepeat("up", () => {
            optionSelected = scrollMenuOption("up", optionSelected, menuOptions);
        });
        
        onKeyPressRepeat("down", () => {
            optionSelected = scrollMenuOption("down", optionSelected, menuOptions);
        });

        // press space to select an option (for SNES controller)
        onKeyPress("space", () => {
            switch(optionSelected) {                
                case SEND_SMS_OTP_TEXT:
                    sendSMSOTP();
                    break;
                case SEND_EMAIL_OTP_TEXT:
                    sendEmailOTP();
                    break;
                case VALIDATE_SMS_OTP_TEXT:
                case VALIDATE_EMAIL_OTP_TEXT:
                    authOTP();
                    break;
                case EXIT_COMPUTER_TEXT:
                    if (stytch.session.getSync()) {
                        go(AUTH_FLOW, 1);
                    }
                    else {
                        go(AUTH_FLOW, levelIdx);
                    }
                    break;
            }
        })


        if(type == "sms") {
            add([
                text(SEND_SMS_OTP_TEXT, {
                    size: TEXT_SIZE,
                }),
                pos(80, 100),
                color(195, 195, 195),
                area(),
                "sendSMSOTP",
                "menu-option"
            ])
            add([
                text(VALIDATE_SMS_OTP_TEXT, {
                    size: TEXT_SIZE,
                }),
                pos(80, 350),
                area(),
                color(195, 195, 195),
                "validateOTP",
                "menu-option"
            ])

            onClick("sendSMSOTP", () => {
                sendSMSOTP();
            });
        }
        if (type == "email") {
            add([
                text(SEND_EMAIL_OTP_TEXT, {
                    size: TEXT_SIZE,
                }),
                pos(80, 100),
                color(195, 195, 195),
                area(),
                "sendEmailOTP",
                "menu-option"
            ])

            add([
                text(VALIDATE_EMAIL_OTP_TEXT, {
                    size: TEXT_SIZE,
                }),
                pos(80, 350),
                area(),
                color(195, 195, 195),
                "validateOTP",
                "menu-option"
            ])
            
            onClick("sendEmailOTP", () => {
                sendEmailOTP();
            });
        }

        onClick("validateOTP", () => {
            authOTP();
        });

        add([
            text(EXIT_COMPUTER_TEXT, {
                size: 80,
            }),
            pos(80, 600),
            area(),
            "exitComputer",
            "menu-option"
        ])

        onClick("exitComputer", () => {
            if (stytch.session.getSync()) {
                go(AUTH_FLOW, 1);
            }
            else {
                go(AUTH_FLOW, levelIdx);
            }
        })

        onUpdate("menu-option", (text) => {            // console.log('text', text);
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
    })

	player.onCollide("door", () => {
		if (getAuthKey()) {
            addPoint();
            // setAuthKey(true); here for backdoor.
            setAuthKey(false);
            go(AUTH_FLOW, 2);
		} else {
			dialog.say("you need a session key!")
		}
	})

    player.onCollide("arcade", () => {
        go(BURRITO);
	})

	// talk on touch
	player.onCollide("character", (ch) => {
		dialog.say(ch.msg)
	})

	const dirs = {
		"left": LEFT,
		"right": RIGHT,
		"up": UP,
		"down": DOWN,
	}

	for (const dir in dirs) {
		onKeyPress(dir, () => {
			dialog.dismiss()
		})
		onKeyDown(dir, () => {
			player.move(dirs[dir].scale(SPEED))
		})
	}

})
