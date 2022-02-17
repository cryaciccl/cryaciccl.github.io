"use strict";
// Player entity
let KinkyDungeonPlayerEntity = null; // The current player entity

// Arousal -- It lowers your stamina regen. also used for some other...
let KinkyDungeonStatArousalMax = 100;
let KinkyDungeonArousalUnlockSuccessMod = 0.5; // Determines how much harder it is to insert a key while aroused. 1.0 is half success chance, 2.0 is one-third, etc.
let KinkyDungeonStatArousal = 0;
let KinkyDungeonStatArousalRegen = -0.3;
let KinkyDungeonStatArousalRegenStaminaRegenFactor = -3; // Stamina drain per time per 100 arousal
let KinkyDungeonArousalPerVibe = 1; // How much arousal per turn per vibe energy cost
let KinkyDungeonArousalPerPlug = 0.25; // How much arousal per move per plug level
// Note that things which increase max arousal (aphrodiasic) also increase the max stamina drain. This can end up being very dangerous as being edged at extremely high arousal will drain all your energy completely, forcing you to wait until the torment is over or the drugs wear off

// Stamina -- your HP. Used to move, attack, interact, and struggle; recover by natural, wait or sleep.
let KinkyDungeonStatStaminaMax = 100;
let KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax;
let KinkyDungeonStatStaminaRegen = 0;
let KinkyDungeonStaminaRate = KinkyDungeonStatStaminaRegen;

// Mana -- your MP. Used to cast spells, recover by drink shrine or use magical items
let KinkyDungeonStatManaMax = 100;
let KinkyDungeonStatMana = KinkyDungeonStatManaMax;
let KinkyDungeonStatManaRate = 0;
let KinkyDungeonStatManaRegen = 0;

// Willpower -- your Will. When it falls to 0, your character gives up and accepts her fate. recovers very slowly
let KinkyDungeonStatWillpowerMax = 100;
let KinkyDungeonStatWillpower = KinkyDungeonStatWillpowerMax;
let KinkyDungeonStatWillpowerRegen = 0.0; // Willpower does not regenerate! You have to visit a shrine, with an exponentially increasing price tag
let KinkyDungeonWillpowerDrainHighArousal = -0.04; // Willpower does not regen when totally exhausted
let KinkyDungeonWillpowerDrainHighArousalThreshold = 0.9; // Threshold at which willpower starts to drain

// Current Status
let KinkyDungeonStatPlugLevel = 0; // Cumulative with front and rear plugs
let KinkyDungeonPlugCount = 0;
let KinkyDungeonVibeLevel = 0;
let KinkyDungeonVibeCostPerIntensity = 0.15;
let KinkyDungeonOrgasmStrength = 0;
let KinkyDungeonSleepTurns = 0;

// Restraint stats

let KinkyDungeonBlindLevel = 0; // Blind level 1: -33% vision, blind level 2: -67% vision, Blind level 3: Vision radius = 1
let KinkyDungeonStatFreeze = 0; // Used for temporary freeze
let KinkyDungeonStatBind = 0; // Used for temporary bind
let KinkyDungeonStatLust = 0;
let KinkyDungeonDeaf = false; // Deafness reduces your vision radius to 0 if you are fully blind (blind level 3)

// Other stats
let KinkyDungeonGold = 0;
let KinkyDungeonLockpicks = 0;
// 3 types of keys, for 4 different types of padlocks. The last type of padlock requires all 3 types of keys to unlock
// The red keys are one-use only as the lock traps the key
// The green keys are multi-use, but jam often
// The blue keys cannot be picked or cut.
// Monsters are not dextrous enough to steal keys from your satchel, although they may spill your satchel on a nearby tile
let KinkyDungeonRedKeys = 0;
let KinkyDungeonGreenKeys = 0;
let KinkyDungeonBlueKeys = 0;
// Regular blades are used to cut soft restraints. Enchanted blades turn into regular blades after one use, and can cut magic items
// Some items are trapped with a curse, which will destroy the knife when cut, but otherwise still freeing you
let KinkyDungeonNormalBlades = 1;
let KinkyDungeonEnchantedBlades = 0;



// Combat
let KinkyDungeonTorsoGrabChance = 0.7;

// Your inventory contains items that are on you
let KinkyDungeonInventory = [];
let KinkyDungeonPlayerTags = [];

let KinkyDungeonCurrentDress = "Default";
let KinkyDungeonUndress = 0; // Level of undressedness

let KinkyDungeonPlayerBuffs = {};

// Temp - for multiplayer in future
let KinkyDungeonPlayers = [];

// For items like the cursed collar which make more enemies appear
let KinkyDungeonDifficulty = 0;

function KinkyDungeonDefaultStats() {
	KinkyDungeonSetDress("Default");
	KinkyDungeonSpawnJailers = 0;
	KinkyDungeonSpawnJailersMax = 0;
	KinkyDungeonGold = 0;
	KinkyDungeonLockpicks = 1;
	KinkyDungeonRedKeys = 0;
	KinkyDungeonGreenKeys = 0;
	KinkyDungeonBlueKeys = 0;
	KinkyDungeonNormalBlades = 1;
	KinkyDungeonEnchantedBlades = 0;

	KinkyDungeonOrbsPlaced = [];

	KinkyDungeonPlayerWeapon = null;
	KinkyDungeonSpellPoints = {"Elements": 1, "Illusion": 1, "Conjure": 1};

	KinkyDungeonStatArousalMax = 100;
	KinkyDungeonStatStaminaMax = 100;
	KinkyDungeonStatWillpowerMax = 100;
	KinkyDungeonStatManaMax = 100;
	KinkyDungeonStaminaRate = KinkyDungeonStatStaminaRegen;

	KinkyDungeonStatFreeze = 0;
	KinkyDungeonStatBind = 0;

	KinkyDungeonStatArousal = 0;
	KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax;
	KinkyDungeonStatMana = KinkyDungeonStatManaMax;
	KinkyDungeonStatWillpower = KinkyDungeonStatWillpowerMax;

	KinkyDungeonInventory = [];
	KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionMana, 1);
	KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionStamina, 1);
	KinkyDungeonChangeConsumable(KinkyDungeonConsumables.PotionFrigid, 1);
	KinkyDungeonInventoryAddWeapon("Knife");
	KinkyDungeonPlayerTags = [];

	KinkyDungeonPlayerDamage = KinkyDungeonPlayerDamageDefault.Attack;

	// Initialize all the other systems
	KinkyDungeonResetMagic();
	KinkyDungeonInitializeDresses();
	KinkyDungeonDressPlayer();
	KinkyDungeonShrineInit();
}

function KinkyDungeonNewLevelStats() {
	if (KinkyDungeonStatWillpowerMax < 100) KinkyDungeonStatWillpowerMax += (100-KinkyDungeonStatWillpowerMax) * 0.1;
	if (KinkyDungeonStatStaminaMax < 100) KinkyDungeonStatStaminaMax += (100-KinkyDungeonStatStaminaMax) * 0.15;
	if (KinkyDungeonStatManaMax < 100) KinkyDungeonStatManaMax += (100-KinkyDungeonStatManaMax) * 0.15;
	if (KinkyDungeonStatArousalMax < 100) KinkyDungeonStatArousalMax += (100-KinkyDungeonStatArousalMax) * 0.15;

	KinkyDungeonStatWillpower = Math.min(KinkyDungeonStatWillpowerMax, KinkyDungeonStatWillpower + 3);
}

function KinkyDungeonGetVisionRadius() {
	if (KinkyDungeonSleepTurns > 2) return 1;
	let gurantevis = 0;
	if (KinkyDungeonDeaf || KinkyDungeonBlindLevel > 3) gurantevis = 1;
	else if (KinkyDungeonBlindLevel > 2) gurantevis = 2;
	else gurantevis = 3;
	return Math.max(Math.max(gurantevis, KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Vision")), Math.floor(KinkyDungeonMapBrightness*(1.0 - 0.25 * KinkyDungeonBlindLevel)));
}

function KinkyDungeonDealDamage(Damage) {	// to player
	let dmg = Damage.damage;
	let damageTypes = {
		"grope": 	{melee:true,	AP:10,	SP:-7},
		"crush":	{melee:true,	AP:3,	SP:-9,	SPMax:-2},
		"pierce":	{melee:true,	AP:-5,	SP:-8,	SPMax:-4, MP:-2},
		"slash": 	{melee:true,			SP:-5,	SPMax:-5},
		"glue":  	{				AP:7,	SP:-10},
		"cold":  	{				AP:-6,	SP:-7,	MP:-10, WP:-1, Slow:2},
		"fire":  	{				AP:-7,	SP:-9,	SPMax:-4, WP:-2},
		"pain":  	{				AP:-8,	SP:-10,	WP:-2},
		"will":  	{								WP:-10},
		"electric":	{				AP:12,	SP:-10, WP:-4, MP:4, Stun:1, Charge:10}
	};
	let typeEffect = damageTypes[Damage.type];
	if (!typeEffect) typeEffect = {SP:-10};

	if (typeEffect.melee) dmg += KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "ArmorBreak");
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "MagicalArmor")) {
		let manadrain = Math.min(KinkyDungeonStatMana, Math.min(dmg, KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "MagicalArmor")));
		KinkyDungeonStatMana -= manadrain;
		dmg -= manadrain;
	}
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlaveArmor")) {
		let arousal = Math.min(dmg, KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SlaveArmor"));
		KinkyDungeonStatArousal += arousal;
		dmg -= arousal;
	}

	

	if (typeEffect.AP) KinkyDungeonStatArousal += (dmg * typeEffect.AP / 10);
	if (typeEffect.SP) KinkyDungeonStatStamina += (dmg * typeEffect.SP / 10);
	if (typeEffect.SPMax) KinkyDungeonStatStaminaMax += (dmg * typeEffect.SPMax / 10);
	if (typeEffect.MP) KinkyDungeonStatMana += (dmg * typeEffect.MP / 10);
	if (typeEffect.WP) KinkyDungeonStatWillpower += (dmg * typeEffect.WP / 10);
	if (typeEffect.Charge) KinkyDungeonChargeVibrators((dmg * typeEffect.Charge / 10));

	if (typeEffect.Slow) KinkyDungeonPlayerSlow((Damage.slow?Damage.slow:1), typeEffect.Slow * (Damage.time?Damage.time:1));
	if (typeEffect.Stun) KinkyDungeonPlayerStun(typeEffect.Stun * (Damage.time?Damage.time:1));

	KinkyDungeonSleepAwake(true);

	return dmg;
}

function KinkyDungeonPlayerBlind(time) {
	KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id:"PlayerBlind", type:"Blind", power:3, duration:time});
}
function KinkyDungeonPlayerStun(time) {
	KinkyDungeonPlayerBlind(time);
	KinkyDungeonAction += time;
}
function KinkyDungeonPlayerSlow(value, time) {
	KinkyDungeonActions.Move.Slow = value;
	KinkyDungeonActions.Move.SlowTime = Math.max(KinkyDungeonAction + time, KinkyDungeonActions.Move.SlowTime);
	KinkyDungeonCalculateSlowLevel();
	KinkyDungeonPushEvent({id:"RemoveSlow", clock:KinkyDungeonActions.Move.SlowTime, content:null});
}
function KinkyDungeonPlayerFreeze(time) {
	KinkyDungeonActions.Move.FreezeTime = Math.max(KinkyDungeonAction + time, KinkyDungeonActions.Move.FreezeTime);
	KinkyDungeonCalculateSlowLevel();
	KinkyDungeonPushEvent({id:"RemoveFreeze", clock:KinkyDungeonActions.Move.FreezeTime, content:null});
}

function KinkyDungeonHasStamina(Cost, AddRate) {
	let s = KinkyDungeonStatStamina;
	if (AddRate) s += KinkyDungeonStaminaRate;

	return s >= Cost;
}
function KinkyDungeonHasMana(Cost, AddRate) {
	let s = KinkyDungeonStatMana;
	if (AddRate) s += KinkyDungeonStatManaRate;

	return s >= Cost;
}
function KinkyDungeonArousalRate(eff = false) {
	if (eff) {
		if (KinkyDungeonStatLust) return 0;
	}
	return KinkyDungeonStatArousal / KinkyDungeonStatArousalMax;
}


function KinkyDungeonUpdateStats(delta) {
	KinkyDungeonPlayers = [KinkyDungeonPlayerEntity];
	// Initialize
	KinkyDungeonCalculateVibeLevel();
	KinkyDungeonDifficulty = 0;

	let arousalRate = KinkyDungeonStatArousalRegen + KinkyDungeonArousalPerVibe * KinkyDungeonVibeLevel;

	arousalRate += KinkyDungeonGetRestraintArousal();

	KinkyDungeonStaminaRate = KinkyDungeonSleepTurns > 0 ? KinkyDungeonActions.Sleep.SP : KinkyDungeonStatStaminaRegen;
	KinkyDungeonStatManaRate = KinkyDungeonStatManaRegen;

	// Arousal reduces staminal regen
	KinkyDungeonStaminaRate += KinkyDungeonArousalRate() * KinkyDungeonStatArousalRegenStaminaRegenFactor;
	
	let willpowerRate = 0;
	// If below a threshold, willpower starts to drain
	if (KinkyDungeonArousalRate(true) >= KinkyDungeonWillpowerDrainHighArousalThreshold) willpowerRate += KinkyDungeonWillpowerDrainHighArousal;

	// Update the player tags based on the player's groups
//	KinkyDungeonPlayerTags = KinkyDungeonUpdateRestraints(delta);

	KinkyDungeonBlindLevel = Math.min(4, KinkyDungeonPlayer.GetBlindLevel() + KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Blind"));
	
	KinkyDungeonDeaf = KinkyDungeonPlayer.IsDeaf();

	// Unarmed damage calc
	KinkyDungeonUpdateAttacks();

	// Cap off the values between 0 and maximum
	KinkyDungeonStatArousal += arousalRate*delta;
	KinkyDungeonStatStamina += KinkyDungeonStaminaRate*delta;
	KinkyDungeonStatMana += KinkyDungeonStatManaRate;
	KinkyDungeonStatWillpower += willpowerRate*delta;
	KinkyDungeonStatLust = Math.max(0, KinkyDungeonStatLust - delta);

	if (KinkyDungeonArousalRate(true) >= 1) KinkyDungeonDoOrgasm();

	KinkyDungeonDressPlayer();

	KinkyDungeonCapStats();

	// process sleep
	if (KinkyDungeonSleepTurns > 0 && KinkyDungeonStatStamina >= KinkyDungeonStatStaminaMax) KinkyDungeonSleepAwake(false);
	if (KinkyDungeonStatStamina <= 5 || KinkyDungeonSleepTurns > 0) {
		if (CharacterItemsHavePoseAvailable(KinkyDungeonPlayer, "BodyLower", "Kneel") && !CharacterDoItemsSetPose(KinkyDungeonPlayer, "Kneel") && !KinkyDungeonPlayer.IsKneeling()) {
			CharacterSetActivePose(KinkyDungeonPlayer, "Kneel", false);
			KinkyDungeonCalculateSlowLevel();
		}
	}
	// Slowness calculation - remove from each cycle - only do when status changed
	// KinkyDungeonCalculateSlowLevel();

	for (let item of KinkyDungeonInventory) {
		if (item.restraint) {
			if (item.restraint.difficultyBonus) {
				KinkyDungeonDifficulty += item.restraint.difficultyBonus;
			}
		}
	}
}

function KinkyDungeonCapStats() {
	if (KinkyDungeonStatStaminaMax < 30) {
		KinkyDungeonStatStamina -= (30 - KinkyDungeonStatStaminaMax) * 3;
		KinkyDungeonStatStaminaMax = 30;
	}
	if (KinkyDungeonStatManaMax < 30) {
		KinkyDungeonStatMana -= (30 - KinkyDungeonStatManaMax) * 3;
		KinkyDungeonStatManaMax = 30;
	}
	KinkyDungeonStatArousal = Math.max(0, Math.min(KinkyDungeonStatArousal, KinkyDungeonStatArousalMax));
	KinkyDungeonStatStamina = Math.max(0, Math.min(KinkyDungeonStatStamina, KinkyDungeonStatStaminaMax));
	KinkyDungeonStatMana = Math.max(0, Math.min(KinkyDungeonStatMana, KinkyDungeonStatManaMax));
	KinkyDungeonStatWillpower = Math.max(0, Math.min(KinkyDungeonStatWillpower, KinkyDungeonStatWillpowerMax));

	if (KinkyDungeonStatWillpower <= 0) {
		KinkyDungeonState = "Lose";
	}
}

function KinkyDungeonCalculateVibeLevel() {
	let oldVibe = KinkyDungeonVibeLevel;
	KinkyDungeonVibeLevel = 0;
	KinkyDungeonStatPlugLevel = 0;
	KinkyDungeonPlugCount = 0;
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		if (KinkyDungeonInventory[I] && KinkyDungeonInventory[I].restraint) {
			let vibe = KinkyDungeonInventory[I];
			if (vibe.restraint.maxbattery) {
				if (vibe.intensity > 0 && vibe.battery > 0) {
					KinkyDungeonVibeLevel += vibe.intensity * vibe.intensity;
					vibe.battery = Math.max(0, vibe.battery - KinkyDungeonVibeCostPerIntensity * vibe.intensity);
				}
			}
			if (vibe.restraint.plugSize) {
				let size = vibe.restraint.plugSize;
				KinkyDungeonStatPlugLevel += size * size;
				KinkyDungeonPlugCount += 1;
			}
		}
	}
	KinkyDungeonVibeLevel = Math.round(Math.sqrt(KinkyDungeonVibeLevel));
	KinkyDungeonStatPlugLevel = Math.round(Math.sqrt(KinkyDungeonStatPlugLevel));

	if (oldVibe > 0 && KinkyDungeonVibeLevel == 0) {
		KinkyDungeonSendMessage(4, TextGet("KinkyDungeonEndVibe"), "#FFaadd", 3);
	}

	if (KinkyDungeonVibeLevel > 0 && (KinkyDungeonVibeLevel != oldVibe || Math.random() < 0.15)) {
		KinkyDungeonSendMessage(2, TextGet("KinkyDungeonVibing" + Math.max(0, Math.min(Math.floor(KinkyDungeonVibeLevel / 0.7), 4))), "#FFaadd", 2);
	}
}

function KinkyDungeonDoOrgasm(force = false)	{
	let tag = [];
	let str = KinkyDungeonOrgasmStrength;
	for (let I = 0; I < KinkyDungeonInventory.length; I++)
		if (KinkyDungeonInventory[I] && KinkyDungeonInventory[I].restraint && (!KinkyDungeonInventory[I].intensity || KinkyDungeonInventory[I].intensity > 0)) {
			if (KinkyDungeonInventory[I].restraint.orgasm) tag.push(KinkyDungeonInventory[I].restraint.orgasm);
			if (KinkyDungeonInventory[I].restraint.orgasmstrength) str += KinkyDungeonInventory[I].restraint.orgasmstrength;
		}
	if (tag.includes("ruin") && !force) {
		KinkyDungeonStatStamina = Math.max(0, KinkyDungeonStatStamina - 10 - str * 0.1 + 10 * Math.random());
		KinkyDungeonStatArousal *= Math.max(0.8, Math.min(1, 0.2 + str * 0.006 + 0.4 * Math.random()));
		KinkyDungeonPlayerStun(2 + str * 0.03);
		KinkyDungeonStatWillpower -= (2 + str * 0.02);
		KinkyDungeonOrgasmStrength += Math.max(0, Math.random() * 5 - 10);
		KinkyDungeonSendMessage(7, TextGet("KinkyDungeonOrgasmRuin"+Math.floor(Math.random()*3)), "red", 3);
		KinkyDungeonFillCurse("Orgasm", 0.2);
	} else if (tag.includes("edge") && !force) {
		KinkyDungeonStatArousal = KinkyDungeonStatArousalMax;
		if (Math.random() < 0.1 + str * 0.004) {
			KinkyDungeonSendMessage(6, TextGet("KinkyDungeonOrgasmEdge"+Math.floor(Math.random()*2)), "pink", 3);
			KinkyDungeonStatWillpower -= 0.2;
			KinkyDungeonOrgasmStrength += Math.max(0, Math.random() * 1 - 3);
			KinkyDungeonFillCurse("Orgasm", 0.1);
		}
	} else if (force || tag.includes("noresist") || Math.random() > (KinkyDungeonStatWillpower / 200 - str/100)) {
		KinkyDungeonStatStamina = Math.max(0, KinkyDungeonStatStamina - 30 - str * 0.1 + 10 * Math.random());
		KinkyDungeonStatMana += str * 0.4 + 40;
		KinkyDungeonStatArousal = 0;
		KinkyDungeonPlayerStun(3 + str * 0.07);
		KinkyDungeonStatWillpower -= (6 + str * 0.04);
		KinkyDungeonOrgasmStrength = 0;
		KinkyDungeonSendMessage(6, TextGet("KinkyDungeonOrgasm"+Math.floor(Math.random()*5)), "pink", 6 + str * 0.07);
		KinkyDungeonFillCurse("Orgasm", 1);
	} else {
		KinkyDungeonStatArousal *= Math.max(0.8, Math.min(1, 0.5 + str * 0.005 + 0.2 * Math.random()));
		str += Math.max(0, Math.random() * 3 - 8);
		KinkyDungeonPlayerStun(0.2);
		KinkyDungeonSendMessage(6, TextGet("KinkyDungeonOrgasmResist"+Math.floor(Math.random()*3)), "pink", 3);
		KinkyDungeonFillCurse("Orgasm", 0.2);
	}
	if (KinkyDungeonOrgasmStrength>100) KinkyDungeonOrgasmStrength=100;

	KinkyDungeonSleepAwake(true);
}

function KinkyDungeonCalculateSlowLevel() {
	let slowlevel = 0;
	if (KinkyDungeonPlayer.IsMounted() || KinkyDungeonPlayer.Effect.indexOf("Tethered") >= 0 || KinkyDungeonPlayer.IsEnclose()) slowlevel = 10;
	else {
		let boots = KinkyDungeonGetRestraintItem("ItemBoots");
		if (boots && boots.restraint && boots.restraint.slowboots) slowlevel += boots.restraint.slowboots;

		if (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemLegs"), "Block", true)
			|| (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemLegs"), "KneelFreeze", true) && KinkyDungeonPlayer.Pose.includes("Kneel"))
			|| InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemLegs"), "Freeze", true)) slowlevel += 1.2;
		else if (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemLegs"), "Slow", true)
			|| (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemLegs"), "KneelFreeze", true) && !KinkyDungeonPlayer.Pose.includes("Kneel"))) slowlevel += 0.8;

		if (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemFeet"), "Freeze", true)
			|| InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemFeet"), "Block", true)) slowlevel += 1.2;
		else if (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemFeet"), "Slow", true)) slowlevel += 0.8;

		if (KinkyDungeonPlayer.Pose.includes("Kneel")) slowlevel = Math.max(3, slowlevel + 1);
		if (KinkyDungeonPlayer.Pose.includes("Hogtied")) slowlevel = Math.max(5, slowlevel + 1.5);

		for (let I = 0; I < KinkyDungeonInventory.length; I++) {
			if (KinkyDungeonInventory[I] && KinkyDungeonInventory[I].restraint && KinkyDungeonInventory[I].restraint.freeze) {
				slowlevel = 10;
			}
		}
	}
	if (KinkyDungeonActions.Move.SlowTime > KinkyDungeonClock) slowlevel += KinkyDungeonActions.Move.Slow;
	else KinkyDungeonActions.Move.Slow = 0;

	if (slowlevel >= 10) {
		KinkyDungeonActions.Move.Time = 1;
		KinkyDungeonActions.Move.SP = 0;
		KinkyDungeonActions.Move.Cantmove = true;
	} else {
		KinkyDungeonActions.Move.Time = (slowlevel/((KinkyDungeonGoddessRep.Ghost+50)/200+1)) + 1;
		KinkyDungeonActions.Move.SP = KinkyDungeonActions.Move.BaseSP + Math.abs(KinkyDungeonActions.Move.Time - 1) * KinkyDungeonActions.Move.SPperSlow;
		KinkyDungeonActions.Move.Cantmove = false;
	}
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "MoveSpeedBoost")) {
		KinkyDungeonActions.Move.Time *= 1 / (1 + KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "MoveSpeedBoost"));
	}

	if (KinkyDungeonActions.Move.FreezeTime > KinkyDungeonClock) {
		KinkyDungeonActions.Move.Cantmove = true;
	}
}
