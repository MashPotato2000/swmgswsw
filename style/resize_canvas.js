const dataset = document.currentScript.dataset;
const preferred_width = Number(dataset.width);
const preferred_height = Number(dataset.height);
const preferred_aspect_ratio = preferred_width / preferred_height;
const preferred_window_fit = dataset.windowFit;
const target = dataset.target;
const update_canvas_attributes = dataset.updateCanvasAttributes === 'true';

function resizeCanvas() {
  let width = preferred_width;
  let height = preferred_height;
  let window_fit = preferred_window_fit;

  // 固定サイズでもウィンドウをはみ出す場合は縦横比維持モードで表示
  if (window_fit == 'none' &&
    (window.innerWidth < preferred_width || window.innerHeight < preferred_height)
  ) {
    window_fit = 'contain';
  }

  if (window_fit == 'none') {
    //default
  } else if (window_fit == 'fill') {
    width = window.innerWidth;
    height = window.innerHeight;
  } else if (window_fit == 'contain') {
    const window_aspect_ratio = window.innerWidth / window.innerHeight;
    if (window_aspect_ratio >= preferred_aspect_ratio) {
      //ゲーム設定より横長のディスプレイ＝左右に黒帯
      width = preferred_width * window.innerHeight / preferred_height;
      height = window.innerHeight;
    } else {
      //ゲーム設定より縦長のディスプレイ＝上下に黒帯
      width = window.innerWidth;
      height = preferred_height * window.innerWidth / preferred_width;
    }
  } else {
    console.log(`unknown window_fit: ${window_fit}`)
  }

  width = Math.round(width);
  height = Math.round(height);

  const el = document.querySelector(target);
  if (!el) return;

  el.style.width = `${width}px`;
  el.style.height = `${height}px`;

  if (update_canvas_attributes) {
    const dpr = window.devicePixelRatio || 1;

    el.width = Math.round(width * dpr);
    el.height = Math.round(height * dpr);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  resizeCanvas();
});
window.addEventListener('resize', function () {
  resizeCanvas();
});

// Godot 等が canvas サイズを読む前にリサイズを確実に反映させる
resizeCanvas();
