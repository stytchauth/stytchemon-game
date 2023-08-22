const SCENE_KEY = "Scene";
const KEY_KEY = "Key";
const POINTS_KEY = "Points";
const AUTH_KEY = "Auth";
const PLAYS = "Plays";
const METHOD_ID = "MethodID";

export function clearStorage() {
  localStorage.removeItem(SCENE_KEY);
  localStorage.removeItem(KEY_KEY);
  localStorage.removeItem(POINTS_KEY);
  localStorage.removeItem(METHOD_ID);
  setPlaysLeft();
}

export function goAndSave(scene, ...args) {
  go(scene, ...args);
  localStorage.setItem(SCENE_KEY, scene);
}

export function getSavedScene() {
  return localStorage.getItem(SCENE_KEY);
}

export function getHasKey() {
  return localStorage.getItem(KEY_KEY) !== null;
}

export function setHasKey(hasKey) {
  if (hasKey) {
    localStorage.setItem(KEY_KEY, true);
  } else {
    localStorage.removeItem(KEY_KEY);
  }
}

export function getAuthKey() {
  return localStorage.getItem(AUTH_KEY) !== null;
}

export function getMagicToken() {
  // this is hardcoded because we manually set this in magic_links/index.html in a horrendously hacky way
  return localStorage.getItem("magicToken");
}

export function setAuthKey(isAuthenticated) {
  if (isAuthenticated) {
    localStorage.setItem(AUTH_KEY, true);
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function getTotalPoints() {
  if (localStorage.getItem(POINTS_KEY) === null) {
    localStorage.setItem(POINTS_KEY, 0);
  }
  return parseInt(localStorage.getItem(POINTS_KEY));
}

export function addPoint(n = 1) {
  const points = getTotalPoints();
  localStorage.setItem(POINTS_KEY, points + n);
}

export function setPlaysLeft() {
  localStorage.setItem(PLAYS, 3);
}

export function decrementPlay() {
  localStorage.setItem(PLAYS, localStorage.getItem(PLAYS) - 1);
}

export function getPlaysLeft() {
  if(localStorage.getItem(PLAYS) === null) {
    return null
  }
  return localStorage.getItem(PLAYS);
}

export function setMethodID(methodId) {
  localStorage.setItem(METHOD_ID, methodId)
}

export function getMethodID() {
  return localStorage.getItem(METHOD_ID)
}
