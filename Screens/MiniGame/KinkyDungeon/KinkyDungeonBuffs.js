"use strict";

function KinkyDungeonSendBuffEvent(Event, data) {
	for (let buff of Object.values(KinkyDungeonPlayerBuffs)) {
		if (buff && buff.events) {
			for (let e of buff.events) {
				if (e.trigger == Event) {
					KinkyDungeonHandleBuffEvent(Event, buff, KinkyDungeonPlayerEntity, data);
				}
			}
		}
	}
	for (let ent of KinkyDungeonEntities) {
		if (ent.buffs) {
			for (let buff of Object.values(ent.buffs)) {
				if (buff && buff.events) {
					for (let e of buff.events) {
						if (e.trigger == Event) {
							KinkyDungeonHandleBuffEvent(Event, buff, e, data);
						}
					}
				}
			}
		}
	}
}

// Decreases time left in buffs and also applies effects
function KinkyDungeonTickBuffs(list, delta) {
	for (const [key, value] of Object.entries(list)) {
		if (value) {
			if (!value.duration || value.duration < 0) list[key] = undefined;
			else {
				if (value.type == "restore_mp") KinkyDungeonStatMana += value.power * delta;
				if (value.type == "restore_sp") KinkyDungeonStatStamina += value.power * delta;
				if (value.type == "restore_wp") KinkyDungeonStatWillpower += value.power * delta;
				if (value.type == "restore_ap") KinkyDungeonStatArousal += value.power * delta;
				if (value.type == "restore_spmax") KinkyDungeonStatStaminaMax = Math.min(100, KinkyDungeonStatStaminaMax + value.power * delta);
				if (value.type == "restore_mpmax") KinkyDungeonStatManaMax = Math.min(100, KinkyDungeonStatManaMax + value.power * delta);
				if (value.type == "enemy_restore") {
					for (let E=0; E<KinkyDungeonEntities.length; E++) if (KinkyDungeonEntities[E].buffs == list)
						KinkyDungeonEntities[E].hp += value.power * delta;
				}

				value.duration -= delta;
			}
		}
	}
}

// Updates buffs for all creatures
function KinkyDungeonUpdateBuffs(delta) {
	// Tick down buffs the buffs
//	KinkyDungeonSendBuffEvent("tick", {delta: delta});
	KinkyDungeonTickBuffs(KinkyDungeonPlayerBuffs, delta);
	for (let EE = 0; EE < KinkyDungeonEntities.length; EE++) {
		let enemy = KinkyDungeonEntities[EE];
		if (!enemy.buffs) enemy.buffs = {};
		KinkyDungeonTickBuffs(enemy.buffs, delta);
	}
}

function KinkyDungeonGetBuffedStat(list, Stat) {
	let stat = 0;
	if (list)
		for (let buff of Object.values(list)) {
			if (buff && buff.type == Stat) {
				stat += buff.power;
			}
		}
	return stat;
}

function KinkyDungeonApplyBuff(list, origbuff) {
	if (!list) return;
	if (!origbuff) return;
	let buff = {};
	Object.assign(buff, origbuff);
	if (!buff.duration) buff.duration = Infinity;
	if (!list[buff.id]) list[buff.id] = buff;
	else if (buff.power && list[buff.id].power && buff.stack) {
		list[buff.id].power += buff.power;
		list[buff.id].duration = buff.duration;
	} else if (buff.power && buff.power > list[buff.id].power) list[buff.id] = buff;
	else if (((list[buff.id].power && buff.power == list[buff.id].power) || !list[buff.id].power) && buff.duration > list[buff.id].duration) list[buff.id].duration = buff.duration;
}

function KinkyDungeonDecreaseBuffStat(list, Stat, value) {
	if (list && value>0) {
		let buffs = [];
		for (let buff of Object.values(list)) {
			if (buff && buff.type == Stat) {
				buffs.push(buff);
			}
		}
		if (!buffs) return;
		buffs.sort(function(a,b){return a.duration - b.duration});
		for (let I=0;I<buffs.length;I++) {
			if (buffs[I].power > value) {
				buffs[I].power -= value;
				break;
			} else {
				value -= buffs[I].power;
				delete list[buffs[I].id];
			}
		}
	}	
}

function KinkyDungeonDispelBuff(list, negative = true) {
	let count = 0;
	if (list)
		for (let buff of Object.values(list)) {
			if (buff.type == "Blind" && (buff.power>0) == negative) {
				delete list[buff.id];
				count += 1;
			}
		}
	return count;
}