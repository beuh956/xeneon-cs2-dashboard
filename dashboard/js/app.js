import { gameState, updateDemoState } from './state.js';
import { render } from './ui.js';
import { fetchState } from './gsi.js';

let liveState = null;

function weaponName(name) {
  return String(name || 'Unknown')
    .replace('weapon_', '')
    .replace('ak47', 'AK-47')
    .replace('m4a1', 'M4A1')
    .replace('m4a1_silencer', 'M4A1-S')
    .toUpperCase();
}

function activeWeapon(weapons = {}) {
  return Object.values(weapons).find(w => w.state === 'active') || {};
}

function countGrenade(weapons = {}, name) {
  return Object.values(weapons).filter(w => w.name === name).length;
}

function normalizeGsi(gsi) {
  const player = gsi.player || {};
  const pstate = player.state || {};
  const map = gsi.map || {};
  const round = gsi.round || {};
  const stats = player.match_stats || {};
  const weapon = activeWeapon(player.weapons);
  const scoreCT = map.team_ct?.score ?? 0;
  const scoreT = map.team_t?.score ?? 0;

  return {
    connection: gsi.ready ? 'GSI LIVE' : 'DEMO MODE',
    player: {
      name: player.name || 'Unknown',
      hp: pstate.health ?? 100,
      armor: pstate.armor ?? 0,
      money: pstate.money ?? 0,
      weapon: weaponName(weapon.name),
      ammoClip: weapon.ammo_clip ?? 0,
      ammoReserve: weapon.ammo_reserve ?? 0,
      team: player.team || ''
    },
    match: {
      map: map.name || 'Unknown',
      round: map.round ?? 0,
      phase: String(round.phase || map.phase || 'unknown').toUpperCase(),
      timer: gsi.clock?.round_time ?? 0,
      scoreCT,
      scoreT,
      aliveCT: 5,
      aliveT: 5
    },
    bomb: {
      planted: round.bomb === 'planted',
      timer: null
    },
    stats: {
      kd: `${stats.kills ?? 0}/${stats.deaths ?? 0}`,
      adr: stats.score ?? 0,
      hs: `${stats.kills ? Math.round(((stats.round_killhs ?? 0) / stats.kills) * 100) : 0}%`,
      ping: '--'
    },
    utility: {
      flash: countGrenade(player.weapons, 'weapon_flashbang'),
      smoke: countGrenade(player.weapons, 'weapon_smokegrenade'),
      he: countGrenade(player.weapons, 'weapon_hegrenade'),
      fire: countGrenade(player.weapons, 'weapon_molotov') + countGrenade(player.weapons, 'weapon_incgrenade'),
      kit: Boolean(pstate.defusekit)
    }
  };
}

async function poll() {
  const data = await fetchState();
  if (data?.ready) {
    liveState = normalizeGsi(data);
  } else {
    liveState = null;
  }
}

function loop() {
  if (liveState) {
    render(liveState);
  } else {
    updateDemoState();
    render(gameState);
  }

  requestAnimationFrame(loop);
}

setInterval(poll, 1000);
poll();
loop();