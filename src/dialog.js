import { addButton } from "./button";

export function addDialog() {
  const h = 160;
  const pad = 16;
  const bg = add([
    pos(0, height() - h),
    rect(width(), h),
    color(0, 0, 0),
    z(100),
  ]);
  const txt = add([
    text("", {
      width: width(),
    }),
    pos(0 + pad, height() - h + pad),
    z(100),
  ]);
  let comp;
  bg.hidden = true;
  txt.hidden = true;
  return {
    say(
      t,
      { size, getComp, center } = { size: 60, getComp: null, center: false }
    ) {
      txt.text = t;
      txt.textSize = size;
      if (center) {
        txt.origin = "top";
        txt.pos = vec2(width() / 2, height() - h + pad);
      }
      bg.hidden = false;
      txt.hidden = false;
      if (getComp && !comp) {
        comp = getComp();
      }
      if (comp) {
        comp.hidden = false;
      }
    },
    dismiss() {
      if (!this.active()) {
        return;
      }
      txt.text = "";
      bg.hidden = true;
      txt.hidden = true;
      if (comp) {
        comp.hidden = true;
      }
    },
    active() {
      return !bg.hidden;
    },
    destroy() {
      bg.destroy();
      txt.destroy();
      if (comp) {
        comp.destroy();
      }
    },
  };
}
