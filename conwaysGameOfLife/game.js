/*
 * @Author: kasora 
 * @Date: 2017-09-28 20:46:42 
 * @Last Modified by: kasora
 * @Last Modified time: 2017-09-28 22:25:46
 */
'use strict';

let config = {
  size: 50,
  tick: 100
};
let canvas, ctx, size, height, width, data;

function init() {
  canvas = document.getElementById("game");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  ctx = canvas.getContext("2d");
  size = config.size;
  height = parseInt(document.body.clientHeight / size) + 1;
  width = parseInt(document.body.clientWidth / size) + 1;
  data = [];

  for (let i = 0; i < height; i++) {
    data.push(new Array(width).fill([255, 255, 255, 0.5]))
  }
}

function draw() {
  ctx.clearRect(0, 0, width * size, height * size);
  if (canvas.getContext) {
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        ctx.fillStyle = `rgba(${data[i][j].join(',')})`
        ctx.fillRect(j * size, i * size, size, size);
      }
    }
  }
}

function nextTick() {

}

function startGame() {
  init();
  setInterval(function () {
    draw();
  }, config.tick);
}