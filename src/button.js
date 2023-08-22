import { TEXT_SIZE } from "./constants";

export function addButton(
  txt,
  p,
  f,
  { changeColor, alwaysColor, zIndex, id, size, originVal } = {
    changeColor: true,
    alwaysColor: false,
    zIndex: 0,
    id: "button",
    size: TEXT_SIZE,
    originVal: "center",
  }
) {
  const btn = add([
    text(txt, { size: size ?? TEXT_SIZE }),
    pos(p),
    area({ cursor: "pointer" }),
    scale(1),
    origin(originVal ?? "center"),
    z(zIndex ?? 0),
    id,
  ]);

  console.log("ID", id);

  btn.onClick(f);

  btn.onUpdate(() => {
    if (alwaysColor) {
      const rand = Math.random() * 255;
      btn.color = rgb(
        wave(0, 255, rand),
        wave(0, 255, rand + 2),
        wave(0, 255, rand + 4)
      );
    }

    if (btn.isHovering()) {
      const t = time() * 10;
      if (changeColor) {
        btn.color = rgb(
          wave(0, 255, t),
          wave(0, 255, t + 2),
          wave(0, 255, t + 4)
        );
      }
      btn.scale = vec2(1.2);
    } else {
      btn.scale = vec2(1);
      if (changeColor) {
        btn.color = rgb();
      }
    }
  });

  return btn;
}
