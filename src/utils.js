import { CODE_COLOR } from "./constants";
import { addPlaysLeft } from "./shared";
import { decrementPlay, getPlaysLeft, goAndSave } from "./storage";
import { GAME_OVER } from "./scenes";

export function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// Removes a play (coin
export function removePlay() {
  decrementPlay();
  const playsLeft = getPlaysLeft();
  console.log("getPlaysLeft", playsLeft);
  
  if (playsLeft <= 0) {
    console.log('here');
    goAndSave(GAME_OVER);
  }

  else {
    console.log('not zero')
    addPlaysLeft();
  }
}

export function addStytchResponse(json, tag) {  
  destroyAll(tag);
  if(json.session) {
    json.session = "{ ... }";
  }
  if(json.session_jwt) {
    json.session_jwt = json.session_jwt[0, 4] + "...";
  }
  if (json.user) {
    json.user = "{ ... }"
  }
  const jsonString = JSON.stringify(json, null, 2); // Convert JSON data to a formatted string

  const textEntity = add([
    text(jsonString, {
      width: width() / 2 - 50,
      height: 500,
      wrap: true,
      size: 30,
      //font: "CP874",
    }),
    pos(width() / 2 + 50, 200),
    //pos(0, 0),
    CODE_COLOR,
    tag
  ]);
}