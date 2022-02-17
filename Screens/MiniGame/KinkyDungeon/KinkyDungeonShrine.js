"use strict";

let KinkyDungeonPools = [
	{name: "Nothing",	UseGrace: 0},
	{name: "Mana",		UseGrace: 3},
	{name: "Cure",		UseGrace: 4},
	{name: "Will",		UseGrace: 5},
	{name: "Elements",	UseGrace: 5},
	{name: "Conjure",	UseGrace: 5},
	{name: "Illusion",	UseGrace: 5},
	{name: "Purify",	UseGrace: 6},
	{name: "Oblivion",	UseGrace: 6},
];
let KinkyDungeonShrineIndex = [
	{Type: "Commerce",		Weight: 8,	Pool: {"Nothing":1},							Basecost: 0},
	{Type: "Elements",		Weight: 3,	Pool: {"Nothing":1, "Mana":2, "Elements":10},	Basecost: 100,	Growth: 2},
	{Type: "Conjure",		Weight: 3,	Pool: {"Nothing":1, "Mana":2, "Conjure":10},	Basecost: 100,	Growth: 2},
	{Type: "Illusion",		Weight: 3,	Pool: {"Nothing":1, "Mana":2, "Illusion":10},	Basecost: 100,	Growth: 2},
	{Type: "Lock",			Weight: 2,	Pool: {"Nothing":1, "Mana":5, "Conjure":1},		Basecost: 50,	Growth: 1.5},
	{Type: "Gag",			Weight: 1,	Pool: {"Nothing":1, "Cure":5, "Conjure":2},		Basecost: 20},
	{Type: "Blindfold",		Weight: 1,	Pool: {"Nothing":1, "Will":5, "Illusion":2},	Basecost: 20},
	{Type: "Cuffs",			Weight: 2,	Pool: {"Nothing":1, "Mana":5, "Elements":1.5},	Basecost: 50},
	{Type: "Boots",			Weight: 1,	Pool: {"Nothing":1, "Cure":5, "Elements":2},	Basecost: 20},
	{Type: "Undead",		Weight: 1,	Pool: {"Nothing":1, "Will":5, "Illusion":2},	Basecost: 25},
	{Type: "Rope",			Weight: 1,	Pool: {"Nothing":1, "Cure":5, "Conjure":2},		Basecost: 20},
	{Type: "Leather",		Weight: 5,	Pool: {"Nothing":1, "Mana":5, "Illusion":1},	Basecost: 40},
	{Type: "Latex",			Weight: 3,	Pool: {"Nothing":1, "Mana":5, "Conjure":1},		Basecost: 40},
	{Type: "Metal",			Weight: 4,	Pool: {"Nothing":1, "Mana":5, "Elements":1},	Basecost: 60},
	{Type: "Delight",		Weight: 4,	Pool: {"Nothing":1, "Conjure":3, "Purify":3},	Basecost: 10,	Growth: 1},
	{Type: "Silence",		Weight: 4,	Pool: {"Nothing":1, "Cure":3, "Oblivion":3},	Basecost: 50},
	{Type: "Blindness",		Weight: 4,	Pool: {"Nothing":1, "Will":3, "Illusion":3},	Basecost: 50},
	{Type: "Freeze",		Weight: 4,	Pool: {"Nothing":1, "Mana":3, "Elements":3},	Basecost: 50},
	{Type: "Sacrifice",		Weight: 5,	Pool: {"Nothing":1, "Purify":3, "Will":4},		Basecost: 10},
	{Type: "Will",			Weight: 10,	Pool: {"Nothing":1, "Mana":4},					Basecost: 20,	Growth: 1.1},
	{Type: "Discipline",	Weight: 3,	Pool: {"Nothing":1, "Oblivion":3, "Purify":5},	Basecost: 40},

];
let KinkyDungeonShrineTypeRemove = ["Undead", "Leather", "Metal", "Rope", "Latex", "Cuffs", "Gag", "Blindfold", "Boots"]; // These shrines will try remove restraints associated with their shrine
let KinkyDungeonShrinePoolChance = 0.25;

let KinkyDungeonShopItems = [];
let KinkyDungeonShopIndex = 0;
let KinkyDungeonShrineCosts = {};
let KinkyDungeonPoolLastUse = {};
let KinkyDungeonGhostDecision = 0;
let KinkyDungeonGoddessRep = {};

function KinkyDungeonShrineInit() {
	KinkyDungeonShopItems = [];
	KinkyDungeonShopIndex = 0;
	KinkyDungeonShrineCosts = {};
	KinkyDungeonPoolLastUse = {};
	KinkyDungeonGhostDecision = 0;
	KinkyDungeonGoddessRep = {"Ghost" : -50, "Prisoner" : -50};
	for (let I = 0; I < KinkyDungeonShrineIndex.length; I++) {
		KinkyDungeonGoddessRep[KinkyDungeonShrineIndex[I].Type] = 0;
	}
}

function KinkyDungeonNewLevelShrine(Level) {
	KinkyDungeonChangeRep("Ghost", -1);
	KinkyDungeonMakeGhostDecision(); // Decides if the ghosts will be friendly or not
	KinkyDungeonShopItems = [];
	KinkyDungeonShopIndex = 0;
	for (let type in KinkyDungeonPoolLastUse) {
		KinkyDungeonPoolLastUse[type] -= 1;
		if (KinkyDungeonPoolLastUse[type] <= 0) delete KinkyDungeonPoolLastUse[type];
	}

	let chanceHigh = 0.3 + KinkyDungeonGoddessRep.Commerce / 200;
	let chanceMid = 0.3 + KinkyDungeonGoddessRep.Commerce / 150;
	let rarityMax = Math.min(4, 1 + Math.floor(Level/10 + KinkyDungeonGoddessRep.Commerce / 25));
	let rarityMin = Math.min(1, Math.max(0, Math.floor(Level/34 + KinkyDungeonGoddessRep.Commerce / 25)));
	let itemCount = 3 + Math.floor(Math.random() * (1 + Level / 34 + KinkyDungeonGoddessRep.Commerce / 25));

	for (let I = itemCount; I > 0; I--) {
		let Rarity = rarityMin;
		if (Math.random() < chanceHigh) {
			Rarity = rarityMax;
			chanceHigh -= 0.3;
		} else if (Math.random() < chanceMid) {
			Rarity = rarityMin + Math.floor(Math.random() * (rarityMax - rarityMin + 1));
			chanceMid -= 0.15;
		}
		let item = KinkyDungeonGetShopItem(Level, Rarity, true);
		KinkyDungeonShopItems.push({name: item.name, shoptype: item.shoptype, rarity: item.rarity, cost: item.cost});
	}
}

function KinkyDungeonGeneratePool(type) {
	for (let I = 0; I < KinkyDungeonShrineIndex.length; I++) {
		if (KinkyDungeonShrineIndex[I].Type == type) {
			let pool = KinkyDungeonShrineIndex[I].Pool;
			let weights=[];
			let weightsTotal = 0;
			for (let P = 0; P < KinkyDungeonPools.length; P++) if (pool[KinkyDungeonPools[P].name]) {
				weights.push({pool:KinkyDungeonPools[P].name, weight:weightsTotal});
				weightsTotal += pool[KinkyDungeonPools[P].name];
			}
			let selection = Math.random() * weightsTotal;
			for (let P = weights.length - 1; P >= 0; P--) if (selection > weights[P].weight) {
				return weights[P].pool;
			}
		}
	}
}

function KinkyDungeonShrineAvailable(type) {
	if (KinkyDungeonGetCurse("Shrine", type)) return true;
	if (type == "Commerce") {
		if (KinkyDungeonShopItems.length > 0) return true;
		else return false;
	}
	if (type == "Lock") {
		if (KinkyDungeonGetLockedRestraint("Red").length > 0 || KinkyDungeonGetLockedRestraint("Green").length > 0 ||
			KinkyDungeonGetLockedRestraint("Yellow").length > 0 || KinkyDungeonGetLockedRestraint("Jammed").length > 0 ||
			KinkyDungeonGetLockedRestraint("Blue").length > 0) return true;
		else return false;
	}
	if (KinkyDungeonShrineTypeRemove.includes(type) && KinkyDungeonGetRestraintsWithShrine(type).length > 0) return true;
	else if (type == "Elements" || type == "Illusion" || type == "Conjure") return true;	// they can always give some small orbs which recovers mana
	else if (type == "Will" && (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax || KinkyDungeonStatStaminaMax < 100 ||
						KinkyDungeonStatMana < KinkyDungeonStatManaMax)) return true;
	else if (type == "Silence" && !KinkyDungeonPlayer.CanTalk() && KinkyDungeonGetLockedRestraint("Goddess").length == 0) return true;
	else if (type == "Blindness" && KinkyDungeonPlayer.GetBlindLevel()>0 && KinkyDungeonGetLockedRestraint("Goddess").length == 0) return true;
	else if (type == "Freeze" && (KinkyDungeonActions.Move.Time>2 || KinkyDungeonActions.Move.Cantmove) && KinkyDungeonGetLockedRestraint("Goddess").length == 0) return true;
	else if (type == "Sacrifice" && !KinkyDungeonPlayer.CanInteract() && KinkyDungeonGetLockedRestraint("Goddess").length == 0) return true;
	else if (type == "Delight" && KinkyDungeonArousalRate(true) > 0.85) return true;
	else if (type == "Discipline") return true;
	return false;
}

function KinkyDungeonShrineCost(type) {
	if (type == "Commerce" && KinkyDungeonShopIndex < KinkyDungeonShopItems.length) {
		let item = KinkyDungeonShopItems[KinkyDungeonShopIndex];
		if (item.cost != null) return item.cost;
		if (item.rarity != null) {
			let costt = 5 * Math.round((1 + MiniGameKinkyDungeonLevel/10)*(30 + 2 * item.rarity * item.rarity * 10)/5);
			if (costt > 100) costt = 50 * Math.round(costt / 50);
			return costt;
		}
		return 15;
	}
	let mult = 1.0;
	for (let I = 0; I < KinkyDungeonShrineIndex.length; I++) {
		if (KinkyDungeonShrineIndex[I].Type == type) {
			let shrine = KinkyDungeonShrineIndex[I];
			return 5 * Math.round(shrine.Basecost * (KinkyDungeonShrineCosts[type] ? Math.pow(shrine.Growth?shrine.Growth:1.33, KinkyDungeonShrineCosts[type]) : 1)/5);
		}
	}
}

function KinkyDungeonPayShrine(type) {
	let ShrineMsg = "";
	let rep = 0;
	if (KinkyDungeonShrineTypeRemove.includes(type)) {
		rep += 2 * KinkyDungeonRemoveRestraintsWithShrine(type);
		ShrineMsg = TextGet("KinkyDungeonPayShrineRemoveRestraints");
	} else if (type == "Elements" || type == "Illusion" || type == "Conjure") {
		let amount = 1 + Math.max(0, Math.floor(Math.random() * KinkyDungeonGoddessRep[type] / 22));
		KinkyDungeonSpellLevel[type] += amount;
		for (let I = 0; I < amount ;I++) KinkyDungeonDiscoverSpell(type, KinkyDungeonSpellLevel[type]/2, true);
		ShrineMsg = TextGet("KinkyDungeonPayShrineSpell").replace("SCHOOL", TextGet("KinkyDungeonSpellsSchool" + type)).replace("AMOUNT", ''+amount);
		rep += KinkyDungeonSpellLevel[type];
	} else if (type == "Will") {
		let hurt = Math.max(0, 100 - KinkyDungeonStatStaminaMax) ;
		KinkyDungeonStatStaminaMax += Math.min(hurt, 10 + (hurt - 10) * (0.4 + KinkyDungeonGoddessRep[type]/200));
		KinkyDungeonStatStamina = Math.min(KinkyDungeonStatStaminaMax, KinkyDungeonStatStamina+KinkyDungeonStatStaminaMax * 0.5);
		KinkyDungeonStatMana = Math.min(KinkyDungeonStatManaMax, KinkyDungeonStatMana+KinkyDungeonStatManaMax * 0.5);
		KinkyDungeonStatWillpower = Math.min(KinkyDungeonStatWillpowerMax, KinkyDungeonStatWillpower+5);
		KinkyDungeonNextDataSendStatsTime = 0;
		rep += Math.max(5 - hurt/10, 0);
		ShrineMsg = TextGet("KinkyDungeonPayShrineHeal");
	} else if (type == "Commerce") {
		let item = KinkyDungeonShopItems[KinkyDungeonShopIndex];
		if (item) {
			if (item.shoptype == "Consumable")
				KinkyDungeonChangeConsumable(KinkyDungeonConsumables[item.name], 1);
			else if (item.shoptype == "Weapon")
				KinkyDungeonInventoryAddWeapon(item.name);
			else if (item.shoptype == "Basic") 
				KinkyDungeonLootBasicItem(item.name);
			ShrineMsg = TextGet("KinkyDungeonPayShrineCommerce").replace("ItemBought", TextGet("KinkyDungeonInventoryItem" + item.name));
			KinkyDungeonShopItems.splice(KinkyDungeonShopIndex, 1);
			if (KinkyDungeonShopIndex > 0) KinkyDungeonShopIndex -= 1;
			rep += item.rarity + 1;
		}
	} else if (type == "Locks") {
		rep += 2 * KinkyDungeonRemoveRestraintsWithShrine(type);
		ShrineMsg = TextGet("KinkyDungeonPayShrineRemoveLocks");
	} else if (type == "Silence") {		// she hates magic, loves fight
		KinkyDungeonStatWillpower = Math.min(KinkyDungeonStatWillpowerMax, KinkyDungeonStatWillpower+KinkyDungeonStatWillpowerMax * 0.1);
		let hurt = Math.max(0, 100 - KinkyDungeonStatStaminaMax) ;
		KinkyDungeonStatStaminaMax += Math.min(hurt, 15 + (hurt - 15) * (0.5 + KinkyDungeonGoddessRep[type]/200));
		KinkyDungeonStatStamina = Math.min(KinkyDungeonStatStaminaMax, KinkyDungeonStatStamina+KinkyDungeonStatStaminaMax * 0.7);
		KinkyDungeonStatArousal = Math.max(0, KinkyDungeonStatArousal - KinkyDungeonStatArousalMax * 0.4);
		KinkyDungeonStatMana = 0;
		rep += 2 * KinkyDungeonRemoveRestraintsWithShrine(type);
		KinkyDungeonAddRestraintWithShrine(type);
		KinkyDungeonNextDataSendStatsTime = 0;
		ShrineMsg = TextGet("KinkyDungeonPayShrineHealSilence");
	} else if (type == "Blindness") {	// she hates fight, loves calm
		KinkyDungeonStatWillpower = Math.min(KinkyDungeonStatWillpowerMax, KinkyDungeonStatWillpower+KinkyDungeonStatWillpowerMax * (0.2 + KinkyDungeonGoddessRep[type]/200));
		KinkyDungeonStatArousal = 0;
		rep += 2 * KinkyDungeonRemoveRestraintsWithShrine(type);
		KinkyDungeonAddRestraintWithShrine(type);
		KinkyDungeonNextDataSendStatsTime = 0;
		ShrineMsg = TextGet("KinkyDungeonPayShrineHealBlindness");
	} else if (type == "Freeze") {		// she hates crazy, loves magic
		KinkyDungeonStatWillpower = Math.min(KinkyDungeonStatWillpowerMax, KinkyDungeonStatWillpower+KinkyDungeonStatWillpowerMax * (0.2 + KinkyDungeonGoddessRep[type]/200));
		let hurt = Math.min(0, 100 - KinkyDungeonStatStaminaMax) ;
		KinkyDungeonStatMana = KinkyDungeonStatManaMax;
		KinkyDungeonStatArousal = Math.max(0, KinkyDungeonStatArousal - KinkyDungeonStatArousalMax * 0.7);
		rep += 2 * KinkyDungeonRemoveRestraintsWithShrine(type);
		KinkyDungeonAddRestraintWithShrine(type);
		KinkyDungeonNextDataSendStatsTime = 0;
		ShrineMsg = TextGet("KinkyDungeonPayShrineHealFreeze");
	} else if (type == "Sacrifice") {	// she hates calm, loves crazy
		KinkyDungeonStatArousal = KinkyDungeonStatArousalMax * 0.99;
		rep += 2 * KinkyDungeonRemoveRestraintsWithShrine(type);
		KinkyDungeonAddRestraintWithShrine(type);
		KinkyDungeonNextDataSendStatsTime = 0;
		ShrineMsg = TextGet("KinkyDungeonPayShrineHealSacrifice");
	} else if (type == "Delight") {
		KinkyDungeonRemoveRestraintsWithShrine(type);
		rep += (KinkyDungeonStatArousal / KinkyDungeonStatArousalMax - 0.85) * 100;
		KinkyDungeonStatArousal = KinkyDungeonStatArousalMax;
		KinkyDungeonOrgasmStrength = 100;
		KinkyDungeonDoOrgasm(true);
		KinkyDungeonChargeVibrators(100);
		ShrineMsg = TextGet("KinkyDungeonPayShrineDelight");
	} else if (type == "Discipline") {
		KinkyDungeonStatWillpower = Math.min(KinkyDungeonStatWillpowerMax, KinkyDungeonStatWillpower+KinkyDungeonStatWillpowerMax * 0.4);
		let value = Math.min(5, Math.max(1, KinkyDungeonGoddessRep.Ghost))
		let list = KinkyDungeonGetLockedRestraint("Goddess");
		for (let I = 0; I < list.length; I++) {
			var item = list[I];
			KinkyDungeonLock(item, "");
			KinkyDungeonRemoveRestraint(item, false);
			value += 5;
		}
		for (let rep in KinkyDungeonGoddessRep) {
			if (rep != "Prisoner") KinkyDungeonGoddessRep[rep] += value;
		}		
		ShrineMsg = TextGet("KinkyDungeonPayShrineDiscipline");
	}

	if (ShrineMsg) KinkyDungeonSendMessage(4, ShrineMsg, "lightblue", 1);

	if (KinkyDungeonShrineCosts[type] > 0) KinkyDungeonShrineCosts[type] = KinkyDungeonShrineCosts[type] + 1;
	else KinkyDungeonShrineCosts[type] = 1;

	if (rep != 0) {
		KinkyDungeonChangeRep(type, rep);
	}
	KinkyDungeonFillCurse("Shrine", type);
}

function KinkyDungeonHandleShrine(tag) {
	if (!KinkyDungeonTargetTile || (KinkyDungeonTargetTile.Type != "Shrine" && KinkyDungeonTargetTile.Type != "Ghost")) return false;
	let type = KinkyDungeonTargetTile.Name;
	if (tag == "Drink") {
		let pool = KinkyDungeonTargetTile.Pool;
		let turn = 0;
		if (KinkyDungeonPoolLastUse[type]) turn = KinkyDungeonPoolLastUse[type];	// this turn cooldown left so will anger
		// drink
		for (let P = 0; P < KinkyDungeonPools.length; P++) if (KinkyDungeonPools[P].name == pool)
			KinkyDungeonPoolLastUse[type] = KinkyDungeonPools[P].UseGrace;
		
		let chance = -KinkyDungeonGoddessRep[type] / 50 + KinkyDungeonShrinePoolChance * turn;

		if (Math.random() < chance) {
			KinkyDungeonSendMessage(10, TextGet("KinkyDungeonPoolDrinkAnger").replace("TYPE", TextGet("KinkyDungeonShrine" + type)), "#AA0000", 3);
			KinkyDungeonShrineAngerGods(type);
			KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Damage.ogg");
			KinkyDungeonDoAction("Wait");
		} else {
			let slimed = 0;
			for (let inv of KinkyDungeonRestraintList()) {
				if (inv.restraint && inv.restraint.slimeLevel) {
					slimed += 1;
					KinkyDungeonRemoveRestraint(inv.restraint.Group, false);
				}
			}
			if (slimed) KinkyDungeonSendMessage(4, TextGet("KinkyDungeonPoolDrinkSlime"), "#FF00FF", 3);
			if (pool == "Mana") {
				if (KinkyDungeonStatManaMax < 100) KinkyDungeonStatManaMax += (100 - KinkyDungeonStatManaMax) * 0.35;
				KinkyDungeonStatMana = KinkyDungeonStatManaMax;
			} else if (pool == "Cure") {
				if (KinkyDungeonStatStaminaMax < 100) KinkyDungeonStatStaminaMax += (100 - KinkyDungeonStatStaminaMax) * 0.35;
				KinkyDungeonStatStamina = KinkyDungeonStatStaminaMax;
			} else if (pool == "Will") {
				if (KinkyDungeonStatWillpowerMax < 100) KinkyDungeonStatWillpowerMax += (100 - KinkyDungeonStatWillpowerMax) * 0.35;
				if (KinkyDungeonStatArousalMax < 100) KinkyDungeonStatArousalMax += (100 - KinkyDungeonStatArousalMax) * 0.35;
				KinkyDungeonStatWillpower = Math.min(KinkyDungeonStatWillpower + 5, KinkyDungeonStatWillpowerMax);
				KinkyDungeonStatArousal = 0;
			} else if (pool == "Elements" || pool == "Conjure" || pool == "Illusion") {
				KinkyDungeonSpellLevel[pool] += 1;
			} else if (pool == "Oblivion") {
				KinkyDungeonResetLearnedMagic(true);
			}
			KinkyDungeonFillCurse("Pool", pool);
			KinkyDungeonChangeRep(type, -2 - slimed * 2);
			KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Magic.ogg");
			KinkyDungeonSendMessage(3, TextGet("KinkyDungeonPoolDrink" + pool), "#AAFFFF", 2);
			KinkyDungeonDoAction("Wait");
		}
		return true;
	} else if (tag == "Pay") {
		let type = KinkyDungeonTargetTile.Name;
		let cost = KinkyDungeonShrineCost(type);
		if (KinkyDungeonGold < cost || !KinkyDungeonHasStamina(-KinkyDungeonActions.Interact.SP)) {
			KinkyDungeonSendMessage(5, TextGet("KinkyDungeonPayShrineFail"), "red", 1);
			KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Damage.ogg");
			return false;
		}
		if (type != "Commerce") {
			KinkyDungeonTargetTile = null;
			delete KinkyDungeonTiles[KinkyDungeonTargetTileLocation];
			let x = KinkyDungeonTargetTileLocation.split(',')[0];
			let y = KinkyDungeonTargetTileLocation.split(',')[1];
			KinkyDungeonMapSet(parseInt(x), parseInt(y), "a");
		}
		KinkyDungeonGold -= cost;
		KinkyDungeonPayShrine(type);
		KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Magic.ogg");
		KinkyDungeonDoAction("Interact");
		return true;		
	} else if (tag == "Next") {
		KinkyDungeonShopIndex += 1;
		if (KinkyDungeonShopIndex >= KinkyDungeonShopItems.length) KinkyDungeonShopIndex = 0
		return true;
	} else if (tag == "GhostMaster") {
		let result = KinkyDungeonFillCurse("Slave");
		if (result) KinkyDungeonSendMessage(8, TextGet("KinkyDungeonGhostMasterYes"), "red", 2);
		else KinkyDungeonSendMessage(8, TextGet("KinkyDungeonGhostMasterNo"), "yellow", 2);
		KinkyDungeonChangeRep("Ghost", 25);
		KinkyDungeonDoAction("Interact");
		return true;
	}
	return false;
}

function KinkyDungeonGetRemoveChanceWithShrine(restraint, shrine) {
	if (restraint.curse) return 0;
	let repmod = 1 + KinkyDungeonGoddessRep[shrine]/100;
	if (!restraint.lock) return repmod;
	let lockstrength = KinkyDungeonGetRestraintPower(restraint, true, true) - 2;
	if (KinkyDungeonShrineTypeRemove.includes(shrine)) {
		return (0.8 - 0.4 * lockstrength) * repmod;
	} else if (shrine == "Lock") {
		return (0.6 - 0.3 * lockstrength) * repmod;
	} else if (shrine == "Delight") {
		return (1 - 0.3 * lockstrength) * repmod;
	} else if (shrine == "Freeze" || shrine == "Silence" || shrine == "Blindness" || shrine == "Sacrifice") {
		return repmod;
	}
}

function KinkyDungeonGetRestraintsWithShrine(shrine) {
	let ret = [];
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let item = KinkyDungeonInventory[I];
		if (item.restraint && item.restraint.shrine && item.restraint.shrine.includes(shrine) && 
			KinkyDungeonGetRemoveChanceWithShrine(item.restraint, shrine) > 0) {
			ret.push(item);
		}
	}
	return ret;
}

function KinkyDungeonRemoveRestraintsWithShrine(type) {
	let ret = 0;
	let removeGroups = {
		"Blindness": ["ItemBreast", "ItemNipples", "ItemTorso", "ItemPelvis", "ItemVulva"],
		"Silence": ["ItemArms", "ItemHead", "ItemHands"],
		"Freeze": ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemHood", "ItemHead", "ItemNeckRestraints", "ItemNeck"],
	};
	let removeAll = ["Sacrifice"];
	let Unlock = ["Lock", "Delight"];
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		var item = KinkyDungeonInventory[I];
		if (item.restraint && (
			(item.restraint.shrine && item.restraint.shrine.includes(type) && Math.random() < KinkyDungeonGetRemoveChanceWithShrine(item, type)) ||
			(removeAll.includes(type)) || (removeGroups[type] && removeGroups[type].includes(item.restraint.Group)) ) ) {
			KinkyDungeonRemoveRestraint(item.restraint.Group, false);
			ret += 1;
		}
		if (item.restraint && Unlock.includes(type) && item.lock && item.lock != "" && Math.random() < KinkyDungeonGetRemoveChanceWithShrine(item, type)) {
			KinkyDungeonLock(item, "");
			ret += 1;
		}
	}
	return ret;
}

function KinkyDungeonAddRestraintWithShrine(shrine) {
	var restraint = KinkyDungeonGetRestraint({attacktags: ["shrine"+shrine]}, MiniGameKinkyDungeonCheckpoint, null, true);
	if (KinkyDungeonAddRestraint(restraint, MiniGameKinkyDungeonCheckpoint, true) > 0)
		KinkyDungeonLock(KinkyDungeonGetRestraintItem(restraint.Group), "Goddess");
}

function KinkyDungeonDrawShrine() {
	let cost = 0;
	let type = KinkyDungeonTargetTile.Name;
	let pay = false;
	let pool = KinkyDungeonTargetTile.Pool;

	if (!KinkyDungeonPlayerTags.includes("slime")) {
		if ((pool == "Mana" && KinkyDungeonStatMana == KinkyDungeonStatManaMax && KinkyDungeonStatManaMax >= 100) ||
			(pool == "Cure" && KinkyDungeonStatStamina == KinkyDungeonStatStaminaMax && KinkyDungeonStatStaminaMax >= 100) ||
			(pool == "Will" && KinkyDungeonStatWillpower == KinkyDungeonStatWillpowerMax && KinkyDungeonStatWillpowerMax >= 100) ||
			(pool == "Oblivion" && KinkyDungeonSpells.length == 0) ||
			(pool == "Purify" && !KinkyDungeonGetCurse("Pool"))
			) pool = "Invalid";
	}

	if (KinkyDungeonShrineAvailable(type)) {
		cost = KinkyDungeonShrineCost(type);

		if (type == "Commerce") {
			if (KinkyDungeonShopIndex > KinkyDungeonShopItems.length) KinkyDungeonShopIndex = 0;

			KinkyDungeonDrawButton("GameShrinePay", 860, 925, 120, 60, TextGet("KinkyDungeonCommercePurchase").replace("ItemCost", "" + cost), (cost <= KinkyDungeonGold) ? "White" : "Pink", "", "");
			KinkyDungeonDrawButton("GameShrineNext", 1000, 925, 120, 60, TextGet("KinkyDungeonCommerceNext"), "White", "", "");

			if (KinkyDungeonShopItems[KinkyDungeonShopIndex]) {
				DrawText(TextGet("KinkyDungeonInventoryItem" + KinkyDungeonShopItems[KinkyDungeonShopIndex].name), 720, 950, "white", "silver");
			}
		} else {
			KinkyDungeonDrawButton("GameShrinePay", 625, 925, 275, 60, TextGet("KinkyDungeonPayShrine").replace("XXX", "" + cost), (KinkyDungeonGold >= cost)? "white":"pink", "", "");
		}
		pay = true;
	}

	if (pool == "Invalid") {
		DrawButton(pay?920:675, 925, pay?200:350, 60, TextGet("KinkyDungeonDrinkShrine"), "#444444", "", "");
	} else if (pool != "Nothing") {
		let turn = 0;
		if (KinkyDungeonPoolLastUse[type]) turn = KinkyDungeonPoolLastUse[type];
		KinkyDungeonDrawButton("GameShrineDrink", pay?920:675, 925, pay?200:350, 60, (turn>0 ? TextGet("KinkyDungeonDrinkShrineRecently").replace("XXX", ""+turn):TextGet("KinkyDungeonDrinkShrine")), "#AAFFFF", "", "");
	} else {
		if (!pay) DrawText(TextGet("KinkyDungeonLockedShrine"), 850, 950, "white", "silver");
	}
}
function KinkyDungeonDrawGhost() {
	if (KinkyDungeonGhostDecision <= 1) DrawText(TextGet("KinkyDungeonDrawGhostHelpful"), 850, 950, "white", "silver");
	else DrawText(TextGet("KinkyDungeonDrawGhostUnhelpful"), 850, 950, "white", "silver");
	let curse = KinkyDungeonGetCurse("Slave").curse;
	if (curse && !curse.ghostmeet) 
		KinkyDungeonDrawButton("GameShrineGhostMaster", 675, 925, 350, 60, TextGet("KinkyDungeonGhostMaster"), "white", "", "");
}
function KinkyDungeonGhostMessage() {
	let restraints = KinkyDungeonRestraintList();
	let msg = "";
	if (restraints.length == 0) {
		msg = TextGet("KinkyDungeonGhostGreet" + KinkyDungeonGhostDecision);
	} else {
		if (KinkyDungeonGhostDecision <= 1) {
			msg = TextGet("KinkyDungeonGhostHelpful" + KinkyDungeonGhostDecision);
		} else {
			let BoundType = "Generic";
			if (!KinkyDungeonPlayer.CanTalk() && Math.random() < 0.33) BoundType = "Gag";
			if (!KinkyDungeonPlayer.CanWalk() && Math.random() < 0.33) BoundType = "Feet";
			if (KinkyDungeonPlayer.IsChaste() && Math.random() < 0.33) BoundType = "Chaste";
			if (!KinkyDungeonPlayer.CanInteract() && Math.random() < 0.33) BoundType = "Arms";

			msg = TextGet("KinkyDungeonGhostUnhelpful" + BoundType + KinkyDungeonGhostDecision);
		}
	}
	if (msg) {
		KinkyDungeonSendMessage(2, msg, "white", 3);
	}
}


function KinkyDungeonMakeGhostDecision() {
	KinkyDungeonGhostDecision = 0;

	let rep = KinkyDungeonGoddessRep.Ghost;

	if (Math.random() < 0.25) KinkyDungeonGhostDecision += 1;
	if (rep > 0) KinkyDungeonGhostDecision += 1;
	if (rep != undefined) {
		if (Math.random() * 100 > -rep + 75) KinkyDungeonGhostDecision += 1;
		if (Math.random() * 100 > -rep + 85) KinkyDungeonGhostDecision += 1;
		if (Math.random() * 100 > -rep + 95) KinkyDungeonGhostDecision += 1;
	}
	if (KinkyDungeonGhostDecision > 4) KinkyDungeonGhostDecision = 4;
}

function KinkyDungeonShrineAngerGods(Type) {
	KinkyDungeonChangeRep(Type, -10);
	let value = KinkyDungeonGoddessRep[Type];
	let count = Math.floor(1 + Math.random() * Math.min(3, (25-value)/7));
	let rest = [];
	for (let I = 0; I < count; I++) {
		let restraint = KinkyDungeonGetRestraint({attacktags: [Type + "Anger"]}, MiniGameKinkyDungeonLevel + Math.max(0, -value), null, true);
		if (restraint) rest.push(restraint);
	}
	let listcount = rest.length;
	if (listcount == 0) {
		let list = KinkyDungeonRestraintList();
		let rest = list[Math.floor(Math.random()*list.length)];
		KinkyDungeonCurseRestraint(rest, false, Type);
	} else {
		let curse = -1;
		if (Math.random() < (-value)/200 + (count-listcount)*0.3) 
			curse = Math.floor(Math.random() * listcount);
		for (let I = 0; I < listcount; I++) {
			let lock = KinkyDungeonGenerateLockRestraint(rest[I], MiniGameKinkyDungeonLevel + Math.max(0, -value), true);
			KinkyDungeonAddRestraintIfWeaker(rest[I], count, true, lock);
			if (rest[I].trapAdd)
				KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(rest[I].trapAdd), MiniGameKinkyDungeonLevel + Math.max(0, -value), true, false);
			if (I == curse) KinkyDungeonCurseRestraint(KinkyDungeonGetRestraintItem(rest[I].Group), false, Type);
		}
	}
	if (Type == "Silence" || Type == "Blindness" || Type == "Discipline" || Type == "Sacrifice" || Type == "Freeze") {
		KinkyDungeonStatMana = 0;
		KinkyDungeonStatStamina = 0;
	} else if (Type == "Delight") {
		KinkyDungeonStatArousalMax -= 10;
		KinkyDungeonStatArousal = KinkyDungeonStatArousalMax;
	}
	KinkyDungeonUpdateStats(0);
}

function KinkyDungeonTakeOrb() {
	KinkyDungeonDrawState = "Orb";
}
function KinkyDungeonDrawOrb() {
	let xPad = 50;
	let yPad = 10;
	let i = 0;
	let j = 0;
	let ySpacing = 50;
	let xSpacing = 550;

	if (!KinkyDungeonTargetTile) {
		KinkyDungeonDrawState = "Game";
		return false;
	}
	let textSplit = KinkyDungeonWordWrap(TextGet("KinkyDungeonOrbIntro").replace("POINTS", KinkyDungeonTargetTile.Amount).replace("SCHOOL", TextGet("KinkyDungeonSpellsSchool"+KinkyDungeonTargetTile.School)), 70).split('\n');
	MainCanvas.textAlign = "center";
	for (i = 0; i < textSplit.length; i++) DrawText(textSplit[i],
		 canvasOffsetX + xPad + 500, canvasOffsetY + yPad + ySpacing * i, "white", "silver");
	
	yPad = 170;
	i = 0;
	ySpacing = 55;

	for (let I = 0; I < KinkyDungeonShrineIndex.length; I++) {
		let shrine = KinkyDungeonShrineIndex[I];
		let value = KinkyDungeonGoddessRep[shrine.Type];
		if (shrine) {
			let color = "#ffff00";
			if (value < -10) {
				if (value < -30) color = "#ff0000";
				else color = "#ff8800";
			} else if (value > 10) {
				if (value > 30) color = "#00ff00";
				else color = "#88ff00";
			}
			KinkyDungeonDrawButton("Orb"+shrine.Type,
				canvasOffsetX + xPad + xSpacing * j, canvasOffsetY + yPad + ySpacing * i - ySpacing * 0.4, 225, ySpacing*0.8, TextGet("KinkyDungeonShrine" + shrine.Type), "white");
			DrawProgressBar(canvasOffsetX + xPad + xSpacing * j + 275, canvasOffsetY + yPad + ySpacing * i - ySpacing/4, 200, ySpacing/2, 50 + value, color, "#444444");

			if (j==0) j = 1;
			else {j = 0; i += 1;}
		}
	}
	KinkyDungeonDrawButton("ToGame", 1330, 925, 165, 60, TextGet("KinkyDungeonOrbReturnGame"), "White", "", "");

	MainCanvas.textAlign = "center";
}
function KinkyDungeonButtonOrb(button) {
	let type = button.tag;
	let amount = KinkyDungeonTargetTile.Amount;
	let school = KinkyDungeonTargetTile.School;
	KinkyDungeonSpellPoints[school] += amount;
	KinkyDungeonChangeRep(type, amount * -10);
	KinkyDungeonTargetTile = null;
	delete KinkyDungeonTiles[KinkyDungeonTargetTileLocation];
	let x = KinkyDungeonTargetTileLocation.split(',')[0];
	let y = KinkyDungeonTargetTileLocation.split(',')[1];
	KinkyDungeonMapSet(parseInt(x), parseInt(y), "o");

	KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Magic.ogg");
	KinkyDungeonDrawState = "Game";

	let chance = (-KinkyDungeonGoddessRep[type]-20)/30;
	if (Math.random < chance) {
		KinkyDungeonSendMessage(10, TextGet("KinkyDungeonPoolDrinkAnger").replace("TYPE", TextGet("KinkyDungeonShrine" + type)), "#AA0000", 5);
		KinkyDungeonShrineAngerGods(type);
		KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Damage.ogg");
	}
	KinkyDungeonDoAction("Wait");

	return true;
}

function KinkyDungeonChangeRep(Rep, Amount) {
	if (KinkyDungeonGoddessRep[Rep] != undefined) {
		let last = KinkyDungeonGoddessRep[Rep];
		let target = -50;
		let interval = 0.02;
		if (Amount >= 0) target = 50;
		for (let i = 0; i < Math.abs(Amount); i++) {
			KinkyDungeonGoddessRep[Rep] += (target - KinkyDungeonGoddessRep[Rep]) * interval;
		}
		KinkyDungeonGoddessRep[Rep] = Math.min(50, Math.max(-50, KinkyDungeonGoddessRep[Rep]));
		if (KinkyDungeonGoddessRep[Rep] != last) return true;
		return false;
	}
	return false;
}

function KinkyDungeonDrawReputation() {
	let xPad = 50;
	let yPad = 50;
	let i = 0;
	let j = 0;
	let ySpacing = 55;
	let xSpacing = 550;
	MainCanvas.textAlign = "left";
	for (let rep in KinkyDungeonGoddessRep) {
		let value = KinkyDungeonGoddessRep[rep];

		if (rep) {
			let color = "#ffff00";
			if (value < -10) {
				if (value < -30) color = "#ff0000";
				else color = "#ff8800";
			} else if (value > 10) {
				if (value > 30) color = "#00ff00";
				else color = "#88ff00";
			}
			DrawText(TextGet("KinkyDungeonShrine" + rep), canvasOffsetX + xPad + xSpacing * j, canvasOffsetY + yPad + ySpacing * i, "white", "black");
			DrawProgressBar(canvasOffsetX + xPad + xSpacing * j + 275, canvasOffsetY + yPad + ySpacing * i - ySpacing/4, 200, ySpacing/2, 50 + value, color, "#444444");

			if (j==0) j = 1;
			else {j = 0; i += 1;}
		}
	}
	MainCanvas.textAlign = "center";
	KinkyDungeonDrawButton("ToInfomation", 1130, 925, 165, 60, TextGet("KinkyDungeonInfomation"), "White", "", "");	
}
