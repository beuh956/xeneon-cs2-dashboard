import{gameState,updateDemoState}from'./state.js';import{render}from'./ui.js';import{fetchState}from'./gsi.js';
let liveState=null;async function poll(){const data=await fetchState();if(data&&Object.keys(data).length){liveState=data;}}
function loop(){if(liveState){render(liveState)}else{updateDemoState();render(gameState)}requestAnimationFrame(loop)}
setInterval(poll,1000);poll();loop();
