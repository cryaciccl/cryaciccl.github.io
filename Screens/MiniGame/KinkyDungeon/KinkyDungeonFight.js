"use strict";
var KinkyDungeonKilledEnemy = null;
let KinkyDungeonAlert = 0;

var KinkyDungeonMissChancePerBlind = 0; // Max 3; blind already calculated in calculateAttack
var KinkyDungeonBullets = []; // Bullets on the game board
var KinkyDungeonBulletsID = {}; // Bullets on the game board

var KinkyDungeonOpenObjects = KinkyDungeonTransparentObjects; // Objects bullets can pass thru
var KinkyDungeonMeleeDamageTypes = ["unarmed", "crush", "slash", "pierce", "grope", "pain", "chain"];

// Weapons
var KinkyDungeonPlayerWeapon = null;
var KinkyDungeonPlayerDamageDefault = {
	"Attack":	{name: "Attack",	dmg: 2, chance: 0.8, type: "unarmed",		SP: -3, 	sfx: "Unarmed"},
	"Kick":		{name: "Kick",		dmg: 3, chance: 0.7, type: "unarmed",		SP: -3, 	sfx: "Unarmed"},
	"Tackle":	{name: "Tackle",	dmg: 1.5, chance: 0.8, type: "unarmed", 	SP: -4,  	sfx: "Unarmed"},
	"Struggle":	{name: "Struggle",	dmg: 1, chance: 0.6, type: "unarmed", 		SP: -5,  	sfx: "Struggle"},
};
var KinkyDungeonPlayerDamage = KinkyDungeonPlayerDamageDefault.Attack;
var KinkyDungeonWeapons = {
	"Knife":		{name: "Knife", 		dmg: 2.5, chance: 0.85, type: "slash",	SP: -3, 	rarity: 0, shop: false, sfx: "Unarmed",		},
	"Sword": 		{name: "Sword", 		dmg: 3.5, chance: 1.1, type: "slash", 	SP: -4,  	rarity: 2, shop: true, sfx: "LightSwing", 	cutBonus: 0.1},
	"MagicSword": 	{name: "MagicSword", 	dmg: 3.5, chance: 2.0, type: "slash",  	SP: -4,  	rarity: 4, shop: false, sfx: "LightSwing", 	magic: true, cutBonus: 0.2, VibeCharge:3, VibeChance: 0.6},
	"Axe": 			{name: "Axe", 			dmg: 6, chance: 0.7, type: "slash", 	SP: -5,  	rarity: 3, shop: true, sfx: "HeavySwing",	},
	"Spear": 		{name: "Spear", 		dmg: 5, chance: 0.8, type: "pierce", 	SP: -5,  	rarity: 2, shop: true, sfx: "HeavySwing",	},
	"Hammer": 		{name: "Hammer", 		dmg: 7, chance: 0.6, type: "crush",  	SP: -5,  	rarity: 3, shop: true, sfx: "HeavySwing",	},
	"BoltCutters": 	{name: "BoltCutters", 	dmg: 3, chance: 1.0, type: "crush", 	SP: -3,  	rarity: 3, shop: true, sfx: "Unarmed", 		cutBonus: 0.3},
	"Wand": 		{name: "Wand", 			dmg: 3, chance:0.8, type: "crush", 		SP: -3, 	rarity: 3, shop: true, sfx: "LightSwing", 	magic: true, spell: 2, VibeCharge:1, VibeChance: 0.8},
	"LightStaff": 	{name: "LightStaff", 	dmg: 4.5, chance:0.8, type: "crush", 	SP: -5,  	rarity: 4, shop: true, sfx: "HeavySwing", 	magic: true, spell: 4, VibeCharge:2, VibeChance: 0.9},
};

function KinkyDungeonFindWeapon(Name) {
	for (let con of Object.values(KinkyDungeonWeapons)) {
		if (con.name == Name) return con;
	}
	return undefined;
}

function KinkyDungeonWeaponCanCut(RequireInteract) {
	if (KinkyDungeonPlayerWeapon && KinkyDungeonWeapons[KinkyDungeonPlayerWeapon].cutBonus > 0 && (!RequireInteract || KinkyDungeonPlayer.CanInteract())) return true;
	return false;
}

function KinkyDungeonUpdateAttacks() {
	// update Attack Struggle, Interact and UseTool AP, APChance, Time, SP
	let diffInt = 0;
	let diffSens = 0;
	let diffSwing = 0;
	let diffKick = 0;
	let freeDeg = 0;
	let resTouch = 0;
	let resHit = 0;
	let fis = 0;
	let kik = 0;
	let dmgboost = (KinkyDungeonGoddessRep.Ghost + 100)/100 * KinkyDungeonStatArousal/100 * 5;	// max 7.5 that huge
	let playerTags = KinkyDungeonPlayerTags;
	if (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemArms"), "Block", true)) {diffInt += 10; diffSens += 4; diffSwing += 12; freeDeg -= 10; resTouch += 1; }
	else if (playerTags.includes("ItemArmsFull")) {diffInt += 1; diffSens += 2; diffSwing += 7; freeDeg -= 2; resTouch += 1;}
	if (playerTags.includes("ItemArmsBlocked")) {diffInt += 15; diffSens += 2; diffSwing += 7; freeDeg -= 12; resTouch += 1; }
	if (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemHands"), "Block", true)) {diffInt += 20; freeDeg -= 5; resTouch += 1; fis += (KinkyDungeonGetRestraintItem("ItemHands").restraint.fistdmg || 0);}
	else if (playerTags.includes("ItemHandsFull")) {diffInt += 2; resTouch += 1; fis += (KinkyDungeonGetRestraintItem("ItemHands").restraint.fistdmg || 0);}
	if (playerTags.includes("ItemHandsBlocked")) {diffInt += 25; freeDeg -= 5; resTouch += 1; }
	if (playerTags.includes("ItemHeadFull")) {diffInt += 3; diffSens += 8 * KinkyDungeonPlayer.GetBlindLevel(); diffSwing += 1; resTouch += 1; }
	if (playerTags.includes("ItemHeadBlocked")) {diffInt += 3; diffSens += 6 * KinkyDungeonPlayer.GetBlindLevel(); diffSwing += 1; resTouch += 1; }
	for (let tag of ["ItemMouth", "ItemMouth2", "ItemMouth3"]) {
		if (playerTags.includes(tag + "Full")) {diffInt += 1; diffSens += 0.2; resTouch += 1; }
		if (playerTags.includes(tag + "Blocked")) {diffInt += 1; diffSens += 0.2; resTouch += 1; }
	}
	for (let tag of ["ItemNeck", "ItemBreast", "ItemTorso", "ItemPelvis", "ItemVulva", "ItemButt"]) {
		if (playerTags.includes(tag + "Full")) {resTouch += 2; resHit += 2; }
		if (playerTags.includes(tag + "Blocked")) {resTouch += 1; resHit += 1; }
	}
	let legs = InventoryGet(KinkyDungeonPlayer, "ItemLegs");
	let feet = InventoryGet(KinkyDungeonPlayer, "ItemFeet");
	if (legs) {
		if (InventoryItemHasEffect(legs, "Freeze", true)) {diffSwing += 1; diffSens += 2; diffKick += 20; freeDeg -= 6; resTouch += 1; resHit += 1; }
		else if (InventoryItemHasEffect(legs, "Prone", true)) {diffSwing += 1; diffSens += 1; diffKick += 12; freeDeg -= 4; resTouch += 1; resHit += 1; }
		else {diffSwing += 1; diffKick += 5; freeDeg -= 1; resTouch += 1; resHit += 1; }
	}
	if (feet) {
		if (InventoryItemHasEffect(feet, "Freeze", true)) {diffSwing += 3; diffSens += 7; diffKick += 20; freeDeg -= 4; resTouch += 1; }
		else if (InventoryItemHasEffect(feet, "Prone", true)) {diffSwing += 2; diffSens += 4; diffKick += 12; freeDeg -= 2; resTouch += 1; }
		else if (InventoryItemHasEffect(feet, "Slow", true)) {diffSwing += 1; diffSens += 2; diffKick += 9; freeDeg -= 1; resTouch += 1;}
		else {diffKick += 7; freeDeg -= 1;}
	}
	if (playerTags.includes("ItemLegsBlocked")) {diffSwing += 1; diffSens += 4; freeDeg -= 2; resTouch += 1; }
	if (playerTags.includes("ItemFeetBlocked")) {diffSwing += 2; diffSens += 4; freeDeg -= 3; resTouch += 1; }
	if (playerTags.includes("ItemBootsFull")) {diffSens += 4; resTouch += 1; kik += (KinkyDungeonGetRestraintItem("ItemBoots").restraint.bootdmg || 0);}
	if (playerTags.includes("ItemBootsBlocked")) {diffSens += 4; resTouch += 1; }

	if (KinkyDungeonPlayer.Pose.includes("Kneel")) {diffSwing += 4; diffKick += 20; freeDeg -= 4; resTouch *= 1.2; resHit *= 2; kik -= 2;}
	if (KinkyDungeonPlayer.Pose.includes("Hogtied")) {diffInt += 10; diffSwing += 25; diffKick += 25; freeDeg -= 8; resTouch *= 1.6; resHit *= 3; kik -= 2; fis -= 2; dmgboost = -1;}

	for (let tag of ["Cloth", "Suit", "ClothLower", "SuitLower", "Socks", "Shoes"])
		if (playerTags.includes(tag + "Full")) {resTouch -= 0.5; }
	for (let tag of ["Panties", "Bra", "Corset"])
		if (playerTags.includes(tag + "Full")) {resTouch -= 1; resHit -= 2; }
	if (playerTags.includes("GlovesFull")) {diffInt += 0.5; diffSens += 0.5; resTouch -= 1; }

	let repmod = (KinkyDungeonGoddessRep.Ghost + 50)/200+1;
	
	diffInt = Math.min(1, Math.max(0, diffInt/25/repmod));
	diffSens = Math.min(1, Math.max(0, diffSens/25/repmod));
	diffSwing = Math.min(1, Math.max(0, diffSwing/25/repmod));
	diffKick = Math.min(1, Math.max(0, diffKick/25/repmod));
	freeDeg = -Math.min(1, Math.max(0, -freeDeg/25/repmod));
	resTouch = Math.min(1, Math.max(0, resTouch/25/repmod));
	resHit = Math.min(1, Math.max(0, resHit/25/repmod));

	let damage = {};
	let apMulti = 1;
	let score = 0;
	if (diffInt < 0.5 && diffSwing < 0.5) {	// weapon attack
		let wpdamage = {dmg:0, chance:0};
		if (KinkyDungeonPlayerWeapon && KinkyDungeonWeapons[KinkyDungeonPlayerWeapon]) wpdamage = KinkyDungeonWeapons[KinkyDungeonPlayerWeapon];
		else if (KinkyDungeonNormalBlades + KinkyDungeonEnchantedBlades >= 1) wpdamage = KinkyDungeonWeapons.Knife;
		let wpscore = (wpdamage.dmg + dmgboost/2) * (wpdamage.chance * ((1.25 - diffSens) / 1.25)) / (1 + diffSwing);
		if (wpscore > score) {
			damage = wpdamage;
			score = wpscore;
		}
	}
	if (diffSwing < 0.5) {	// arm attack
		let armdamage = KinkyDungeonPlayerDamageDefault.Attack;
		let armscore = (armdamage.dmg + fis + dmgboost) * (armdamage.chance * ((1.25 - diffSens) / 1.25)) / (1 + diffSwing);
		if (armscore > score) {
			damage = armdamage;
			score = armscore;
		}
	}
	if (diffKick < 0.5 && KinkyDungeonToggleKick != "Off") {	// kick attack
		let kickdamage = KinkyDungeonPlayerDamageDefault.Kick;
		let kickscore = (kickdamage.dmg + kik + dmgboost) * (kickdamage.chance * ((1.25 - diffSens) / 1.25)) / (1 + diffKick) * (KinkyDungeonToggleKick == "On"?2:1);
		if (kickscore > score) {
			damage = kickdamage;
			score = kickscore;
			apMulti = 1.2;
		}
	}
	if (freeDeg > -0.75) {
		let tackledamage = KinkyDungeonPlayerDamageDefault.Tackle;
		let tacklescore = (tackledamage.dmg + dmgboost) * (tackledamage.chance * ((1.25 - diffSens) / 1.25)) * Math.min(1, 2 + freeDeg);
		if (tacklescore > score) {
			damage = tackledamage;
			score = tacklescore;
			apMulti = 2;
		}
	}
	let struggledamage = KinkyDungeonPlayerDamageDefault.Struggle;
	if ((struggledamage.dmg + dmgboost) * (struggledamage.chance * ((1.25 - diffSens) / 1.25)) * Math.min(1, 1.4 + freeDeg) > score) {
		damage = struggledamage;
		apMulti = 3;
	}
	KinkyDungeonPlayerDamage = {};
	Object.assign(KinkyDungeonPlayerDamage, damage);
	KinkyDungeonPlayerDamage.chance *= ((1.25 - diffSens) / 1.25);

	KinkyDungeonActions.Struggle.Time = (1/Math.min(1, 1.4 + freeDeg));
	KinkyDungeonActions.UseTool.Time = (1 + diffSwing);
	KinkyDungeonActions.Interact.Time = (0.5 + diffInt);

	KinkyDungeonActions.Attack.AP = (resHit * 5 + resTouch * 2) * apMulti;
	KinkyDungeonActions.Interact.AP = resTouch * (1 + diffInt);
	KinkyDungeonActions.UseTool.AP = resTouch * 1.5;
	KinkyDungeonActions.Struggle.AP = (resHit * 5 + resTouch * 2) * 3;

	KinkyDungeonActions.Interact.SP = freeDeg * 2;
	KinkyDungeonActions.UseTool.SP = -diffInt * 2 + 1;
	KinkyDungeonActions.Struggle.SP = freeDeg * 4 - diffSens * 2 - diffInt * 2;

	if (damage.name == "Kick") {
		KinkyDungeonPlayerDamage.dmg += kik + dmgboost;
		KinkyDungeonActions.Attack.Time = (1 + diffKick);
		KinkyDungeonActions.Attack.SP = damage.SP * (1 + diffKick);
	} else if (damage.name == "Tackle") {
		KinkyDungeonPlayerDamage.dmg += dmgboost;
		KinkyDungeonActions.Attack.Time = (1/Math.min(1, 2 + freeDeg));
		KinkyDungeonActions.Attack.SP = damage.SP * (1/Math.min(1, 1.6 + freeDeg));
	} else if (damage.name == "Struggle") {
		KinkyDungeonPlayerDamage.dmg += dmgboost;
		KinkyDungeonActions.Attack.Time = (1/Math.min(1, 1.4 + freeDeg));
		KinkyDungeonActions.Attack.SP = damage.SP * (1/Math.min(1, 1.25 + freeDeg));
	} else {
		if (damage.name == "Attack") KinkyDungeonPlayerDamage.dmg += fis + dmgboost;
		else KinkyDungeonPlayerDamage.dmg += dmgboost/2;
		KinkyDungeonActions.Attack.Time = (1 + diffSwing);
		KinkyDungeonActions.Attack.SP = damage.SP * (1 + diffSwing);
	}
	// reduce damage if staminamax low
	KinkyDungeonPlayerDamage.dmg *= Math.min(1, 0.5 + (KinkyDungeonStatStaminaMax / 100));
	// Mana affects magic damage
	if (KinkyDungeonPlayerDamage.magic) KinkyDungeonPlayerDamage.dmg *= (0.75 + KinkyDungeonStatMana / KinkyDungeonStatManaMax * 0.5);

	if (!KinkyDungeonPlayerDamage.magic && KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AtkSpeedBoost")) {
		KinkyDungeonActions.Attack.Time *= 1 / (1 + KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AtkSpeedBoost"));
	}
}

function KinkyDungeonEvasion(Enemy) {
	var hitChance = (Enemy && Enemy.buffs) ? KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(Enemy.buffs, "Evasion")) : 1.0;
	if (Enemy.Enemy && Enemy.Enemy.evasion && (!Enemy.stun || Enemy.stun < 1 || Enemy.Enemy.alwaysEvade || Enemy.Enemy.evasion < 0)) hitChance *= Math.max(0, KinkyDungeonMultiplicativeStat(Enemy.Enemy.evasion));
	if (Enemy.Enemy && Enemy.Enemy.defensetags.includes("ghost") && KinkyDungeonPlayerWeapon && KinkyDungeonPlayerWeapon.magic) hitChance = Math.max(hitChance, 1.0);
	hitChance *= KinkyDungeonPlayerDamage.chance;
	hitChance *= (1+KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AttackAcc"));
	if (Enemy.slow > 0) hitChance *= 2;

	hitChance -= Math.min(3, KinkyDungeonPlayer.GetBlindLevel()) * KinkyDungeonMissChancePerBlind;
	if (KinkyDungeonPlayer.IsDeaf()) hitChance *= 0.67;

	if (!Enemy) KinkyDungeonSleepTime = 0;

	if (Math.random() < hitChance) return true;

	return false;
}

function KinkyDungeonGetImmunity(tags, type, resist) {
	if (tags.includes(type + resist)
		|| (KinkyDungeonMeleeDamageTypes.includes(type) && tags.includes("melee" + resist))
		|| (!KinkyDungeonMeleeDamageTypes.includes(type) && tags.includes("magic"+resist)))
		return true;
	return false;
}

function KinkyDungeonDamageEnemy(Enemy, Damage, Ranged, NoMsg, Spell, bullet, attacker) {
	let dmg = (Damage) ? Damage.damage : 0;
	if (typeof(dmg) != "number") dmg = 0;
	//let type = (Damage) ? Damage.type : "";
	let effect = false;
	let resistStun = 0;
	let resistSlow = 0;
	let resistDamage = 0;
	let dmgDealt = 0;
	let armor = (Enemy.Enemy.armor) ? Enemy.Enemy.armor : 0;

	armor -= KinkyDungeonGetBuffedStat(Enemy.buffs, "ArmorBreak");

	if (Enemy.freeze > 0 && Damage && KinkyDungeonMeleeDamageTypes.includes(Damage.type)) {
		dmg *= 2;
	}
	if (Damage && Damage.type == "instantkill" && !Enemy.Enemy.ohkoResist) dmg *= 9999;

	if (Damage) {
		if (Enemy.Enemy.defensetags) {
			if (KinkyDungeonGetImmunity(Enemy.Enemy.defensetags, Damage.type, "immune")) resistDamage = 2;
			else if (KinkyDungeonGetImmunity(Enemy.Enemy.defensetags, Damage.type, "resist")) resistDamage = 1;
			else if (KinkyDungeonGetImmunity(Enemy.Enemy.defensetags, Damage.type, "weakness")) resistDamage = -1;
			else if (KinkyDungeonGetImmunity(Enemy.Enemy.defensetags, Damage.type, "severeweakness")) resistDamage = -2;
			if (Enemy.Enemy.defensetags.includes("unstoppable")) resistStun = 2;
			else if (Enemy.Enemy.defensetags.includes("unflinching")) resistStun = 1;
			if (Enemy.Enemy.defensetags.includes("unslowable")) resistSlow = 2;
			else if (Enemy.Enemy.defensetags.includes("slowresist")) resistSlow = 1;

		}

		if (Damage.type != "inert" && resistDamage < 2) {
			if (resistDamage == 1 || (resistStun > 0 && Damage.type == "stun")) {
				dmg = Math.max(dmg - armor, 0); // Armor goes before resistance
				dmgDealt = Math.min(1, dmg-1); // Enemies that resist the damage type can only take 1 damage, and if they would take 1 damage it deals 0 damage instead
			} else if (resistDamage == -1) {
				dmgDealt = Math.max(dmg+1, Math.floor(dmg*1.5)); // Enemies that are vulnerable take either dmg+1 or 1.5x damage, whichever is greater
				dmgDealt = Math.max(dmgDealt - armor, 0); // Armor comes after vulnerability
			} else if (resistDamage == -2) {
				dmgDealt = Math.max(dmg+2, Math.floor(dmg*2)); // Enemies that are severely vulnerable take either dmg+1 or 2x damage, whichever is greater
				dmgDealt = Math.max(dmgDealt - armor, 0); // Armor comes after vulnerability
			} else {
				dmgDealt = Math.max(dmg - armor, 0);
			}

			dmgDealt = Math.round(dmgDealt*10)/10;

			if (Enemy.freeze > 0 && KinkyDungeonMeleeDamageTypes.includes(Damage.type)) {
				Enemy.freeze = 0;
			}

			if (Enemy.Enemy.defensetags && Enemy.Enemy.defensetags.includes("playerinstakill") && attacker && attacker.player) dmgDealt = Enemy.hp;

			if (Spell && Spell.hitsfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + Spell.hitsfx + ".ogg");
			else if (dmgDealt > 0 && bullet) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/DealDamage.ogg");
			Enemy.hp -= dmgDealt;
		}
		if ((resistStun < 2 && resistDamage < 2) && (Damage.type == "stun" || Damage.type == "electric")) { // Being immune to the damage stops the stun as well
			effect = true;
			if (!Enemy.stun) Enemy.stun = 0;
			if (resistStun == 1)
				Enemy.stun = Math.max(Enemy.stun, Math.min(Math.floor(Damage.time/2), Damage.time-1)); // Enemies with stun resistance have stuns reduced to 1/2, and anything that stuns them for one turn doesn't affect them
			else Enemy.stun = Math.max(Enemy.stun, Damage.time);
		}
		if ((resistDamage < 2) && (Damage.type == "ice")) { // Being immune to the damage stops the stun as well
			effect = true;
			if (!Enemy.freeze) Enemy.freeze = 0;
			if (resistDamage == 1)
				Enemy.freeze = Math.max(Enemy.freeze, Math.min(Math.floor(Damage.time/2), Damage.time-1)); // Enemies with ice resistance have freeze reduced to 1/2, and anything that freezes them for one turn doesn't affect them
			else Enemy.freeze = Math.max(Enemy.freeze, Damage.time);
		}
		if ((resistDamage < 2) && (Damage.type == "chain" || Damage.type == "glue")) { // Being immune to the damage stops the bind
			effect = true;
			if (!Enemy.bind) Enemy.bind = 0;
			if (resistDamage == 1)
				Enemy.bind = Math.max(Enemy.bind, Math.min(Math.floor(Damage.time/2), Damage.time-1)); // Enemies with resistance have bind reduced to 1/2, and anything that binds them for one turn doesn't affect them
			else Enemy.bind = Math.max(Enemy.bind, Damage.time);
		}
		if ((resistSlow < 2 && resistDamage < 2) && (Damage.type == "slow" || Damage.type == "cold")) { // Being immune to the damage stops the stun as well
			effect = true;
			if (!Enemy.slow) Enemy.slow = 0;
			if (resistSlow == 1)
				Enemy.slow = Math.max(Enemy.slow, Math.min(Math.floor(Damage.time/2), Damage.time-1)); // Enemies with stun resistance have stuns reduced to 1/2, and anything that stuns them for one turn doesn't affect them
			else Enemy.slow = Math.max(Enemy.slow, Damage.time);
		}
	}

	var atkname = (Spell) ? TextGet("KinkyDungeonSpell" + Spell.name) : TextGet("KinkyDungeonBasicAttack");

	if (Enemy.hp <= 0) {
		KinkyDungeonKilledEnemy = Enemy;
	}

	if (!NoMsg && (dmgDealt > 0 || !Spell || effect)) KinkyDungeonSendMessage(5, (Damage && dmgDealt > 0) ?
		TextGet((Ranged) ? "PlayerRanged" : "PlayerAttack"+KinkyDungeonPlayerDamage.name).replace("TargetEnemy", TextGet("Name" + Enemy.Enemy.name)).replace("AttackName", atkname).replace("DamageDealt", "" + dmgDealt)
		: TextGet("PlayerMiss" + ((Damage) ? "Armor" : "")).replace("TargetEnemy", TextGet("Name" + Enemy.Enemy.name)),
			(Damage && (dmg > 0 || effect)) ? "orange" : "red", 2);

	if (Enemy && Enemy.Enemy && Enemy.Enemy.AI == "ambush" && Spell && !Spell.name.includes("Witch")) {
		Enemy.ambushtrigger = true;
	}

	if (dmg > 0 && Enemy.Enemy.placetags.includes("jailer")) KinkyDungeonJailTransgressed = true;
	
	return dmg;
}

function KinkyDungeonAttackEnemy(Enemy, Damage) {
	let eva = KinkyDungeonEvasion(Enemy);
	let dmg = Damage;
	let buffdmg = KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "AttackDmg");
	if (buffdmg) dmg.damage = Math.max(0, dmg.damage + buffdmg);
	KinkyDungeonDamageEnemy(Enemy, (eva) ? dmg : null, undefined, undefined, undefined, undefined, KinkyDungeonPlayerEntity);
	if (eva && KinkyDungeonPlayerDamage && KinkyDungeonPlayerDamage.sfx) {
		KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + KinkyDungeonPlayerDamage.sfx + ".ogg");
	} else if (!eva) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
	KinkyDungeonAlert = 5;

	KinkyDungeonDoAction("Attack");
}

function KinkyDungeonUpdateBullets(clock) {
	let brokenshields = [];
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		let b = KinkyDungeonBullets[E];
		let expire = null;
		let expireclock = null;

		let collision = KinkyDungeonBulletsCheckCollision(b, clock);
		// the spell hit something!
		for (let I = 0; I < collision.length; I++) {
			let hit = collision[I];
			let nomsg = false;
			if (hit.player) {
				if (b.playerEffect) {
					KinkyDungeonPlayerEffect(b);
					nomsg = true;
				}
				for (let H = 0; H < b.alreadyHit.length; H++) if (b.alreadyHit[H].player) {b.alreadyHit.splice(H, 1); H--;}
				b.alreadyHit.push(hit);
			}
			if (hit.enemy) {
				if (b.damage) {
					KinkyDungeonDamageEnemy(hit.enemy, {damage: b.damage, type: b.type, time: b.time}, true, nomsg, b.spell, b);
					if (hit.enemy.hp <= 0) {
						for(let E=0; E<KinkyDungeonEntities.length;E++) if (KinkyDungeonEntities[E] == hit.enemy) KinkyDungeonEnemyCheckHP(hit.enemy, E);
						if (b.killEffect) {
							if (b.killEffect.name == "Bullet")
								KinkyDungeonLaunchBullet(hit.t, b.killEffect.bullet, hit.x, hit.y, 0, 0, b.bulletdamages, b.spell);
						}
					}
					nomsg = true;
				}
				for (let H = 0; H < b.alreadyHit.length; H++) if (b.alreadyHit[H].enemy == hit.enemy) {b.alreadyHit.splice(H, 1); H--;}
				b.alreadyHit.push(hit);
				if (b.hitEffect) {
					if (b.hitEffect.name == "Repel") {
						let x = hit.enemy.x;
						let y = hit.enemy.y;
						let dx = x - b.x;
						let dy = y - b.y;
						let d = Math.sqrt(dx*dx+dy*dy);
						if (d) { dx /= d; dy /= d;}
						for (let delta = 0; delta < b.hitEffect.power; delta += 0.1) {
							x = Math.round(hit.enemy.x + delta * dx);
							y = Math.round(hit.enemy.y + delta * dy);
							if (!KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(x, y)) || (x == KinkyDungeonPlayerEntity.x && y == KinkyDungeonPlayerEntity.y) || (KinkyDungeonEnemyAt(x, y) && KinkyDungeonEnemyAt(x, y) != hit.enemy)) {
								x = Math.round(hit.enemy.x + (delta - 0.1)* dx);
								y = Math.round(hit.enemy.y + (delta - 0.1)* dy);
								break;
							}
						}
						hit.enemy.x = x;
						hit.enemy.y = y;
					} else if (b.hitEffect.name == "Dominate") {
						let newenemy = {};
						Object.assign(newenemy, hit.enemy.Enemy);
						hit.enemy.Enemy = newenemy;
						newenemy.allied = true;
					} else if (b.hitEffect.name == "Clarify") {
						let count = KinkyDungeonDispelBuff(hit.enemy.buff, hit.enemy.Enemy.allied);
						if (count) KinkyDungeonSendMessage(5, "KinkyDungeonDispelBuff"+hit.enemy.Enemy.allied?"Ally":"Enemy", "yellow", 4);
					}
				}
			}
			if (b.buffs && (hit.enemy || hit.player)) {
				for (let B = 0; B < b.buffs.length; B++) {
					let buff = b.buffs[B];
					if (hit.player && buff.player) {
						KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, buff);
					}
					if (hit.enemy && ((buff.enemies && !hit.enemy.Enemy.allied)||(buff.ally && hit.enemy.Enemy.allied))) {
						KinkyDungeonApplyBuff(hit.enemy.buffs, buff);
					}
				}
			}
			if (b.hit && !hit.passby && (!b.hitfilter || (b.hitfilter.includes("Enemy") && hit.enemy) || (b.hitfilter.includes("Player") && hit.player))) {
				// launch next bullet
				let bullet = {};
				if (b.hitNextTarget) {
					if (hit.enemy) {
						let target = null;
						let nearest = b.spell[b.hit].range;
						for (let E = 0; E < KinkyDungeonEntities.length; E++) {
							let enemy = KinkyDungeonEntities[E];
							if (enemy != hit.enemy && hit.enemy.Enemy.allied == enemy.allied && (enemy.x - hit.x) * (enemy.x - hit.x) + (enemy.y - hit.y) * (enemy.y - hit.y) <= nearest * nearest) {
								nearest = Math.sqrt((enemy.x - hit.x) * (enemy.x - hit.x) + (enemy.y - hit.y) * (enemy.y - hit.y));
								target = enemy;
							}
						}
						if (target) {
							if (b.spell[b.hit].speed) {
								let vx = (target.x - hit.x);
								let vy = (target.y - hit.y);
								if (vx != 0 || vy != 0) {
									let dist = Math.sqrt(vx * vx + vy * vy);
									vx = vx * b.spell[b.hit].speed / dist;
									vy = vy * b.spell[b.hit].speed / dist;
								}
								bullet = KinkyDungeonLaunchBullet(hit.t, b.hit, hit.x, hit.y, vx, vy, b.bulletdamages, b.spell);
							} else bullet = KinkyDungeonLaunchBullet(hit.t, b.hit, target.x, target.y, 0, 0, b.bulletdamages, b.spell);
						}
					}
				} else bullet = KinkyDungeonLaunchBullet(hit.t, b.hit, hit.x, hit.y, 0, 0, b.bulletdamages, b.spell);
				if (b.hitFollow) bullet.Follow = hit.enemy || "Player";
				if (b.hitInherit) bullet.alreadyHit = b.alreadyHit;
			}
			if (b.trail && hit.passby) {
				let trail = KinkyDungeonLaunchBullet(hit.t, b.trail, hit.x, hit.y, 0, 0, b.bulletdamages, b.spell);
				if (b.keeprotate) trail.direction = b.direction;
			}
			if (b.shield) {
				b.shield.block -= (b.damage || 0);
				if (b.shield.block <= 0) {
					brokenshields.push(b.shield);
				}
			}
			if (hit.blocked=="wall" && b.stopwhenhit) {
				b.x = hit.x;
				b.y = hit.y;
				delete b.speed;
				b.vx = 0;
				b.vy = 0;
				break;
			} else if (hit.expire || hit.blocked) {
				expire = hit.expire || "hit";
				expireclock = hit.t;
				b.x = hit.x;
				b.y = hit.y;
				break;
			}
		}
		if (b.expireIf && b.expireIf(b)) {
			expire = "External";
		}		
		if (!expire) {
			let delta = clock - b.update;
			b.update += delta;
			if (b.lifetime) b.lifetime -= delta;
			if (b.speed) b.range -= delta * b.speed;
			b.x += b.vx * delta;
			b.y += b.vy * delta;
			if (b.tickrotate) b.direction += b.tickrotate;
		} else {
			if (expire != "hit" && b.expire) {
				let next = KinkyDungeonLaunchBullet(expireclock, b.expire, b.x, b.y, 0, 0, b.bulletdamages, b.spell);
				if (b.keeprotate) next.direction = b.direction;
			}
			KinkyDungeonBullets.splice(E, 1);
			delete KinkyDungeonBulletsID[b.spriteID];
			E -= 1;
			continue;
		}
	}
	for (let E = 0; E < KinkyDungeonBullets.length; E++) if (brokenshields.includes(KinkyDungeonBullets[E])) {
		KinkyDungeonBullets.splice(E, 1);
		delete KinkyDungeonBulletsID[b.spriteID];
		E -= 1;		
	}
	return;
}

/*
function KinkyDungeonUpdateBulletsCollisions(delta) {
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		var b = KinkyDungeonBullets[E];

		if (!KinkyDungeonBulletsCheckCollision(b, b.time >= 0)) {
			if (!(b.bullet.spell && b.bullet.spell.piercing)) {
				KinkyDungeonBullets.splice(E, 1);
				KinkyDungeonBulletsID[b.spriteID] = null;
				E -= 1;
			}
			KinkyDungeonBulletHit(b, 1);
		}
	}
}

function KinkyDungeonBulletHit(b, born) {
	if (!b.bullet.hit) return;
	if (b.bullet.spell && b.bullet.spell.landsfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + b.bullet.spell.landsfx + ".ogg");

	if (b.bullet.hit.includes("Hit")) {
		KinkyDungeonBullets.push({born: born, time:1, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID:b.bullet.name+"Hit" + CommonTime(), bullet:{lifetime: 1, passthrough:true, name:b.bullet.name+"Hit", width:b.bullet.width, height:b.bullet.height}});
	}
	if (b.bullet.hit.includes("Aoe")) {
		KinkyDungeonBullets.push({born: born, time:b.bullet.spell.lifetime, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID:b.bullet.name+"AoeHit" + CommonTime(),
			bullet:{spell:b.bullet.spell, damage: {damage:(b.bullet.damage.aoedamage) ? b.bullet.damage.aoedamage : b.bullet.damage.damage, type:b.bullet.damage.type, time:b.bullet.damage.time}, aoe: b.bullet.spell.aoe, lifetime: b.bullet.spell.lifetime, passthrough:true, name:b.bullet.name+"AoeHit", width:(b.bullet.spell.aoesize?b.bullet.spell.aoesize:b.bullet.width), height:(b.bullet.spell.aoesize?b.bullet.spell.aoesize:b.bullet.height)}});
	}
	if (b.bullet.hit.includes("Lingering")) {
		let rad = (b.bullet.spell.aoe) ? b.bullet.spell.aoe : 0;
		for (let X = -Math.ceil(rad); X <= Math.ceil(rad); X++)
			for (let Y = -Math.ceil(rad); Y <= Math.ceil(rad); Y++) {
				if (Math.sqrt(X*X+Y*Y) <= rad) {
					let LifetimeBonus = (b.bullet.spell.lifetimeHitBonus) ? Math.floor(Math.random() * b.bullet.spell.lifetimeHitBonus) : 0;
					KinkyDungeonBullets.push({born: born, time:b.bullet.spell.lifetime + LifetimeBonus, x:b.x+X, y:b.y+Y, vx:0, vy:0, xx:b.x+X, yy:b.y+Y, spriteID:b.bullet.name+"Hit" + CommonTime(),
						bullet:{spell:b.bullet.spell, block: (b.bullet.blockhit ? b.bullet.blockhit : 0), damage: {damage:b.bullet.damage.damage, type:b.bullet.damage.type, time:b.bullet.damage.time}, lifetime: b.bullet.spell.lifetime + LifetimeBonus, name:b.bullet.name+"Hit", width:1, height:1}});
				}
			}
	}
	if (b.bullet.hit.includes("Teleport")) {
		KinkyDungeonBullets.push({born: born, time:b.bullet.spell.lifetime, x:b.x, y:b.y, vx:0, vy:0, xx:b.x, yy:b.y, spriteID:b.bullet.name+"Hit" + CommonTime(),
			bullet:{spell:b.bullet.spell, damage: {damage:(b.bullet.spell.aoedamage) ? b.bullet.spell.aoedamage : b.bullet.spell.power, type:b.bullet.spell.damage, time:b.bullet.spell.time}, aoe: b.bullet.spell.aoe, lifetime: b.bullet.spell.lifetime, passthrough:true, name:b.bullet.name+"Hit", width:b.bullet.width, height:b.bullet.height}});
		KinkyDungeonMoveTo(b.x, b.y);
		KinkyDungeonAction = Math.min(KinkyDungeonAction, KinkyDungeonClock);
	}

	if (b.bullet && b.bullet.summon) {
	}
}


function KinkyDungeonBulletTrail(b) {
	if (b.bullet.spell.trail == "lingering") {
		let aoe = b.bullet.spell.trailspawnaoe ? b.bullet.spell.trailspawnaoe : 0.0;
		let rad = Math.ceil(aoe/2);
		for (let X = -Math.ceil(rad); X <= Math.ceil(rad); X++)
			for (let Y = -Math.ceil(rad); Y <= Math.ceil(rad); Y++) {
				if (Math.sqrt(X*X+Y*Y) <= aoe && Math.random() < b.bullet.spell.trailChance) {
					KinkyDungeonBullets.push({born: 0, time:b.bullet.spell.trailLifetime, x:b.x + X, y:b.y + Y, vx:0, vy:0, xx:b.x + X, yy:b.y + Y, spriteID:b.bullet.name+"Trail" + CommonTime(),
						bullet:{hit: b.bullet.spell.trailHit, spell:b.bullet.spell, damage: {damage:b.bullet.spell.trailPower, type:b.bullet.spell.trailDamage, time:b.bullet.spell.trailTime}, lifetime: b.bullet.spell.trailLifetime, name:b.bullet.name+"Trail", width:1, height:1}});
				}
			}
	}
}
*/
function KinkyDungeonBulletPass(b, clock, X, Y, volume = 0.49, hard = true) {
	let di = volume + (b.aoe || 0);
	if (b.speed) {
		// calculate for bolt..
		let a = b.speed * b.speed;
		let hb = -((X - b.x) * b.vx + (Y - b.y) * b.vy)
		let c = (X - b.x) * (X - b.x) + (Y - b.y) * (Y - b.y) - di * di;
		let p = hb * hb - a * c;
		if (p < 0) return null;
		let hardt = (-hb-Math.sqrt(p))/a;
		let softt = -hb/a;
		let mint = Math.max(Math.min(hardt, clock - b.update), 0);
		let mind = (X-b.x-b.vx*mint)*(X-b.x-b.vx*mint)+(Y-b.y-b.vy*mint)*(Y-b.y-b.vy*mint);
		if (mind <= di) {
			if (hard) return {x:b.x+b.vx*hardt, y:b.y+b.vy*hardt, t:b.update+hardt};
			else return {x:b.x+b.vx*softt, y:b.y+b.vy*softt, t:b.update+softt};
		}
	} else {
		if (di * di >= (X - b.x) * (X - b.x) + (Y - b.y) * (Y - b.y)) {
			if (!b.needpath || KinkyDungeonCheckPath(Math.round(b.x), Math.round(b.y), X, Y, true)) {
				return {x:X, y:Y, t:b.update};
			}
		}
	}
	return null;
}

function KinkyDungeonBulletsCheckCollision(b, clock) {
	let delta = clock - b.update;
	let aoe = (b.aoe||0.1)
	let ret = [];

	// check terrain
	let xMin = Math.floor( Math.min(b.x, b.x+b.vx*delta) - aoe);
	let xMax = Math.ceil( Math.max(b.x, b.x+b.vx*delta) + aoe);
	let yMin = Math.floor( Math.min(b.y, b.y+b.vy*delta) - aoe);
	let yMax = Math.ceil( Math.max(b.y, b.y+b.vy*delta) + aoe);
	if (b.speed) {
		for (let X = xMin; X < xMax; X++) for (let Y = yMin; Y < yMax; Y++) {
			let mapItem = KinkyDungeonMapGet(X, Y);
			if (!KinkyDungeonOpenObjects.includes(mapItem) && !b.passthrough) {
				let collision = null;
				if (b.aoewall) {
					let aoe = b.aoe;
					b.aoe = b.aoewall;
					collision = KinkyDungeonBulletPass(b, clock, X, Y);
					b.aoe = aoe;
				} else collision = KinkyDungeonBulletPass(b, clock, X, Y);
				if (collision) {
					ret.push({x:collision.x, y:collision.y, t:collision.t, blocked:"wall", update:true}); // hit wall
				}
			}
		}
	}
	if (b.trail) {
		if (b.speed) {
			let dur = (b.trailduration || ((b.traillen || b.aoe || 1) / b.speed));
			let starttime = b.update - (b.vx ? ((b.x - b.ix)/b.vx) : ((b.y-b.iy)/b.vy));
			for (let count = Math.floor((b.update - starttime)/dur); count <= Math.floor((clock - starttime)/dur + 0.1) ; count ++) {
				let trail = true;
				for (let I = 0; I < b.trailTile.length; I++) if (b.trailTile[I].count == count) trail = false;
				if (trail) ret.push({x:b.ix+dur*b.vx*count, y:b.iy+dur*b.vy*count, t:starttime+count*dur, passby:true});
				b.trailTile.push({count:count});
			}
		} else {
			let dur = (b.trailduration || 1);
			let count = Math.floor(clock/dur)-Math.floor(b.update/dur);
			while (count > 0) {
				for (let X = xMin; X < xMax; X++) for (let Y = yMin; Y < yMax; Y++) {
					if (aoe * aoe >= (X - b.x) * (X - b.x) + (Y - b.y) * (Y - b.y) && (!b.chance || Math.random() < b.chance)) {
						let trail = true;
						for (let I = 0; I < b.trailTile.length; I++) if (b.trailTile[I].x == X && b.trailTile[I].y == Y) trail = false;
						if (trail) ret.push({x:X, y:Y, t:(Math.floor(b.update/dur) + count) * dur, passby:true});
						b.trailTile.push({x:X, y:Y});
					}
				}
				count -= 1;
			}
		}
	}
	// enemies and player
	let hitexpire = ((!b.pierce) && (b.lifetime == undefined)) || b.hitExpire;
	if (b.damage || b.buffs || b.canHitEnemy) {
		for (let E = 0; E < KinkyDungeonEntities.length; E++) {
			let enemy = KinkyDungeonEntities[E];
			if (!b.spell || (!b.spell.enemySpell && !enemy.Enemy.allied) || (!b.spell.allySpell && enemy.Enemy.allied)) {
				let collision = KinkyDungeonBulletPass(b, clock, enemy.x, enemy.y, undefined, !b.hitSoft);
				if (collision) {
					if (b.lifetime && b.hitduration) {//multiple hits
						if (Math.floor(clock/b.hitduration) != Math.floor(b.update/b.hitduration)) { // have hits
							for (let count = Math.floor(b.update/b.hitduration) + 1; count <= Math.floor(clock/b.hitduration); count++) {
								ret.push({x:collision.x, y:collision.y, t:count * b.hitduration, enemy:enemy });
							}
						}
					} else {// hit everyone only once
						let canhit = true;
						for (let I = 0; I < b.alreadyHit.length; I++) if (b.alreadyHit[I].enemy == enemy) canhit = false;
						if (canhit)
							ret.push({x:collision.x, y:collision.y, t:collision.t, enemy:enemy, blocked:hitexpire?"Enemy":false });
					}
				}
			}
		}
	}
	if ((b.playerEffect || b.buffs || b.canHitPlayer) && (!b.cooldown || b.cooldown <= b.update)) {
		let collision = KinkyDungeonBulletPass(b, clock, KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, undefined, !b.hitSoft);
		if (collision) {
			if (b.lifetime && b.hitduration) {//multiple hits
				if (Math.floor(clock/b.hitduration) != Math.floor(b.update/b.hitduration)) { // have hits
					for (let count = Math.floor(b.update/b.hitduration) + 1; count <= Math.floor(clock/b.hitduration); count++) {
						ret.push({x:collision.x, y:collision.y, t:count * b.hitduration, player:true });
					}
				}
			} else {// hit everyone only once
				let canhit = true;
				for (let I = 0; I < b.alreadyHit.length; I++) if (b.alreadyHit[I].player) canhit = false;
				if (canhit)
					ret.push({x:collision.x, y:collision.y, t:collision.t, player:true, blocked:hitexpire?"Player":false });
			}
		}
	}
	// blocker
	for (let B = 0; B < KinkyDungeonBullets.length; B++) {
		let b2 = KinkyDungeonBullets[B];
		if (b2 != b && b2.block > 0 && (!b2.blockignore || b2.blockignore != b.name)) {
			let collision = KinkyDungeonBulletPass(b, clock, b2.x, b2.y, b2.aoe||0.5);
			if (collision) {
				ret.push({x:collision.x, y:collision.y, t:collision.t, shield:b2, blocked:"shield"});
			}
		}
	}
	// natural expire
	if (b.lifetime != undefined && b.lifetime <= clock - b.update) {
		ret.push({x:b.x+b.vx*b.lifetime, y:b.y+b.vy*b.lifetime, t:b.lifetime+b.update, expire:"expire"});
	}
	if (b.speed && b.range / b.speed <= clock - b.update) {
		ret.push({x:b.x+b.vx*b.range / b.speed, y:b.y+b.vy*b.range / b.speed, t:b.range / b.speed+b.update, expire:"outrange"});
	}
	//sort
	ret.sort(function(a,b){return a.t-b.t});
	return ret;
}


function KinkyDungeonLaunchBullet(clock, bulletname, x, y, vx, vy, bulletdamages, spell) {
	let b = {x:x, y:y, ix:x, iy:y, vx:vx, vy:vy};
	Object.assign(b, spell[bulletname]);
	b.bulletdamages = bulletdamages;
	if (bulletdamages[bulletname]) b.damage = bulletdamages[bulletname];
	b.spell = spell;
	b.name = spell.name + bulletname;
	b.update = clock;
	if (KinkyDungeonAction > clock) 
		b.lifetime += (KinkyDungeonAction-clock);
	b.direction = (b.norotate?0:Math.atan2(b.vy, b.vx));
	if (b.trail) b.trailTile = [];
	b.alreadyHit = [];
	if (b.size) b.spriteID = b.name + CommonTime();
	KinkyDungeonBullets.push(b);
	if (b.sfx) KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + b.sfx + ".ogg");
	if (b.cooldown) b.cooldown += clock;
	if (b.launchEffect) {
		let eff = b.launchEffect;
		if (eff.name == "ChangeTerrain" && eff.fromtile.includes(KinkyDungeonMapGet(x, y))) {
			KinkyDungeonMapSet(x, y, eff.totile);
		}
	}
	if (b.playerEffectOnCast) {
		if (b.playerEffectOnCast.name == "StaminaMaxLoss") KinkyDungeonStatStaminaMax -= b.playerEffectOnCast.value;
		if (b.playerEffectOnCast.name == "LossRandomPotion") {
			let potion = KinkyDungeonGetRandomConsumable(0);
			if (potion) KinkyDungeonChangeConsumable(potion, -1);
		}
		if (b.playerEffectOnCast.name == "Bullet") {
			KinkyDungeonLaunchBullet(clock, b.playerEffectOnCast.bullet, KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, 0, 0, b.bulletdamages, b.spell);
		}
		if (b.playerEffectOnCast.name == "Teleport") {
			KinkyDungeonMoveTo(x, y);
			KinkyDungeonUpdateLightGrid	= true;
			KinkyDungeonAction = Math.min(KinkyDungeonAction, KinkyDungeonClock);
		}
	}
	
	if (b.summon) {
		let created = 0;
		let type = "";
		for (let sum of b.summon) {
			let summonType = sum.name; // Second operand is the enemy type
			if (!type) type = summonType;
			let count = sum.count ? sum.count : 1;
			let rad = (sum.range) ? sum.range : 0;
			if (count > 0)
				created += KinkyDungeonSummonEnemy(b.x, b.y, summonType, count, rad, false, sum.time ? sum.time : undefined);
		}
		if (created == 1) KinkyDungeonSendMessage(8, TextGet("KinkyDungeonSummonSingle"+type), "white", 2);
		else if (created > 1) KinkyDungeonSendMessage(8, TextGet("KinkyDungeonSummonMulti"+type).replace("SummonCount", "" + created), "white", 3);
	}
	return b;
}

function KinkyDungeonDrawFight(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let E = 0; E < KinkyDungeonBullets.length; E++) {
		var bullet = KinkyDungeonBullets[E];
		if (!bullet.size) continue;
		var sprite = bullet.name;
		var spriteCanvas = KinkyDungeonBulletsID[bullet.spriteID];
		if (!spriteCanvas) {
			spriteCanvas = document.createElement("canvas");
			spriteCanvas.width = bullet.size*KinkyDungeonSpriteSize;
			spriteCanvas.height = bullet.size*KinkyDungeonSpriteSize;
			KinkyDungeonBulletsID[bullet.spriteID] = spriteCanvas;

		}

		var Img = DrawGetImage(KinkyDungeonRootDirectory + "Bullets/" + sprite + ".png");
		if (bullet.cooldown > bullet.update && bullet.cooldownsprite) Img = DrawGetImage(KinkyDungeonRootDirectory + "Bullets/" + sprite + bullet.cooldownsprite + ".png"); 

		var spriteContext = spriteCanvas.getContext("2d");

		// Rotate the canvas m,
		spriteContext.translate(spriteCanvas.width/2, spriteCanvas.height/2);
		spriteContext.rotate(bullet.direction);
		spriteContext.translate(-spriteCanvas.width/2, -spriteCanvas.height/2);

		// Draw the sprite
		spriteContext.clearRect(0, 0, spriteCanvas.width, spriteCanvas.height);
		spriteContext.drawImage(Img, 0, 0);

		// Reset the transformation
		spriteContext.setTransform(1, 0, 0, 1, 0, 0);

		KinkyDungeonUpdateVisualPosition(bullet, KinkyDungeonDrawDelta);
		let tx = bullet.visual_x;
		let ty = bullet.visual_y;

		if (bullet.x >= CamX && bullet.y >= CamY && bullet.x < CamX + KinkyDungeonGridWidthDisplay && bullet.y < CamY + KinkyDungeonGridHeightDisplay) {
			KinkyDungeonContext.drawImage(spriteCanvas,  (tx - CamX - (bullet.size-1)/2)*KinkyDungeonGridSizeDisplay, (ty - CamY - (bullet.size-1)/2)*KinkyDungeonGridSizeDisplay);
		}
	}
}
