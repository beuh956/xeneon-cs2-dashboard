export const gameState = {
  connection: 'DEMO MODE',

  player: {
    name: 'beuh95',
    hp: 100,
    armor: 100,
    money: 4200,
    weapon: 'AK-47',
    ammoClip: 30,
    ammoClipMax: 30,
    ammoReserve: 90,
    team: 'CT'
  },

  match: {
    map: 'Mirage',
    round: 18,
    phase: 'ROUND LIVE',
    timer: 84,
    scoreCT: 8,
    scoreT: 5,
    aliveCT: 5,
    aliveT: 5
  },

  bomb: {
    planted: false,
    timer: null
  },

  stats: {
    kd: '12/5',
    adr: 84,
    hs: '58%',
    ping: 12
  },

  utility: {
    flash: 2,
    smoke: 1,
    he: 1,
    fire: 1,
    kit: false
  },

  effects: {
    flashed: 0,
    smoked: 0,
    burning: 0
  }
};

export function updateDemoState() {
  const t = Date.now() / 1000;

  gameState.player.hp = Math.max(1, Math.round(45 + 55 * Math.sin(t / 4)));
  gameState.player.armor = Math.max(0, Math.round(50 + 50 * Math.sin(t / 5)));
  gameState.player.money = Math.max(0, Math.round(3000 + 3000 * Math.sin(t / 6)));
  gameState.player.ammoClip = Math.max(0, Math.round(15 + 15 * Math.sin(t / 3)));

  gameState.match.timer = Math.max(0, Math.round(115 - (t % 115)));

  gameState.bomb.planted = Math.floor(t / 12) % 2 === 1;
  gameState.bomb.timer = gameState.bomb.planted
    ? Math.max(0, Math.round(40 - (t % 40)))
    : null;

  gameState.effects.flashed =
    Math.floor(t / 10) % 2 === 0
      ? Math.max(0, Math.round(180 * Math.abs(Math.sin(t * 2))))
      : 0;

  gameState.effects.burning = Math.floor(t / 14) % 2 === 0 ? 120 : 0;
  gameState.effects.smoked = Math.floor(t / 18) % 2 === 0 ? 120 : 0;
}