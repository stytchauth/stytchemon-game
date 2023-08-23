import { getTotalPoints, getPlaysLeft, setMethodID, getMethodID } from "./storage";
import { TEXT_SIZE } from "./constants";
import { StytchHeadlessClient } from '@stytch/vanilla-js/headless';
import { addStytchResponse } from "./utils";

export const stytch = new StytchHeadlessClient(
    process.env.STYTCH_PUBLIC_TOKEN,
);

loadSprite("stytch", "/sprites/stytch.png");
loadSprite("coin", "/sprites/coin.png");


export const addPointsCounter = () => {
    const getPoints = () => `Points: ${getTotalPoints()}`;
    const pointsLabel = add([
        text(getPoints(), { size: TEXT_SIZE }),
        pos(30, 30),
    ]);
    pointsLabel.onUpdate(() => {
        pointsLabel.text = getPoints();
    });
};

export const addStytchWordmark = () => {
    add([
        sprite("stytch", {
            width: 200,
            height: 40
        }),
        pos(width() / 2 - 100, 50),

    ]);
};

export const addPlaysLeft = () => {
    destroyAll("coin");
    const playsLeft = getPlaysLeft();
    
    for (let i = 0; i < playsLeft; i++) {
        add([
            sprite("coin", { width: 64, height: 64 }),
            pos(width() - 300 + (70 * i), 50),
            "coin",
        ]);
    }
};

export const sendEmailOTP = () => {
    let email = prompt("Please enter your email address")
    if (email != "" && email != null) {
        play("wooosh");
        stytch.otps.email.loginOrCreate(email, {
            expiration_minutes: 5,
        })
        .then(response => {
            addStytchResponse(response, "stytchResponse");
            let methodID = response.method_id;
            setMethodID(methodID);
        });
    }
}

export const sendSMSOTP = () => {
    let phone_number = prompt("Please enter your phone number (without hyphens or parentheses)")
    phone_number = "+1" + phone_number;
    if (phone_number != "" && phone_number != null) {
        play("wooosh");
        stytch.otps.sms.loginOrCreate(phone_number)
        .then(response => {
            addStytchResponse(response, "stytchResponse");
            let methodID = response.method_id;
            setMethodID(methodID);
        });
    }
}

export const authOTP = () => {
    let methodID = getMethodID();
    let otp = prompt("Please enter your OTP code:", "");
    if (otp != null && otp != "") {
        stytch.otps.authenticate(otp, methodID, {
            session_duration_minutes: 60
        })
        .then(response => {
            if (response.status_code === 200) {
                addStytchResponse(response, "stytchResponse");
            }
            else {
                alert("Error, try again")
            }
        })
        .catch((error) => {
            alert("Error encounterd, try again. \n\n " + error);
        });
    }
}

export function scrollMenuOption(direction, optionSelected, menuOptions) {
    let currentIndex = menuOptions.indexOf(optionSelected);
    let newIndex;

    if (direction == "up" || direction == "left") {
        newIndex = currentIndex === 0 ? menuOptions.length - 1 : currentIndex - 1;
    }
    if (direction == "down" || direction == "right") {
        newIndex = currentIndex === menuOptions.length - 1 ? 0 : currentIndex + 1;
    }
    
    return menuOptions[newIndex];
};