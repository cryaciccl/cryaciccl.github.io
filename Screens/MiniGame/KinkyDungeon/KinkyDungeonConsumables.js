"use strict";

var KinkyDungeonConsumables = {
	"PotionHealth":		{name: "PotionHealth",		rarity: 2, shop: true, type: "restore",		wp_instant: 0, wp_gradual: 20, duration: 10, 				sfx: "PotionDrink"},
	"PotionHealthFast":	{name: "PotionHealthFast",	rarity: 3, shop: true, type: "restore",		wp_instant: 15, wp_gradual: 9, duration: 3, wp_hurt:3,		sfx: "PotionDrink"},
	"PotionMana":		{name: "PotionMana",		rarity: 0, shop: true, type: "restore",		mp_instant: 10, mp_gradual: 40, duration: 20,				sfx: "PotionDrink"},
	"PotionManaMed":	{name: "PotionManaMed",		rarity: 2, shop: true, type: "restore",		mp_instant: 25, mp_gradual: 120, duration: 20,				sfx: "PotionDrink"},
	"PotionManaFast":	{name: "PotionManaFast",	rarity: 1, shop: true, type: "restore",		mp_instant: 55, mp_gradual: 15, duration: 5, mp_hurt:5,		sfx: "PotionDrink"},
	"PotionStamina":	{name: "PotionStamina",		rarity: 0, shop: true, type: "restore",		sp_instant: 10, sp_gradual: 60, duration: 10,				sfx: "PotionDrink"},
	"PotionStaminaMed":	{name: "PotionStaminaMed",	rarity: 2, shop: true, type: "restore",		sp_instant: 30, sp_gradual: 180, duration: 10,				sfx: "PotionDrink"},
	"PotionStaminaFast":{name: "PotionStaminaFast",	rarity: 1, shop: true, type: "restore",		sp_instant: 75, sp_gradual: 36, duration: 4, sp_hurt:5,		sfx: "PotionDrink"},
	"PotionFrigid":		{name: "PotionFrigid",		rarity: 1, shop: true, type: "restore",		ap_instant: 0, ap_gradual: -70, duration: 7,				sfx: "PotionDrink"},
	"PotionFrigidMed":	{name: "PotionFrigidMed",	rarity: 3, shop: true, type: "restore",		ap_instant: 0, ap_gradual: -180, duration: 6,				sfx: "PotionDrink"},
	"PotionFrigidFast":	{name: "PotionFrigidFast",	rarity: 2, shop: true, type: "restore",		ap_instant:-75, ap_gradual: -30, duration: 2, ap_hurt:10, 	sfx: "PotionDrink"},
};

var KinkyDungneonBasic = {
	"RedKey" :			{name: "RedKey", 			rarity: 0, shop: true},
	"GreenKey" :		{name: "GreenKey", 			rarity: 1, shop: true},
	"BlueKey" :			{name: "BlueKey", 			rarity: 2, shop: true},
	"2Lockpick" :		{name: "2Lockpick", 		rarity: 0, shop: true},
	"4Lockpick" :		{name: "4Lockpick", 		rarity: 1, shop: true},
	"Knife" :			{name: "Knife", 			rarity: 0, shop: true},
	"EnchKnife" :		{name: "EnchKnife", 		rarity: 3, shop: true},
};

function KinkyDungeonFindConsumable(Name) {
	for (let con of Object.values(KinkyDungeonConsumables)) {
		if (con.name == Name) return con;
	}
	return undefined;
}

function KinkyDungeonGetInventoryItem(Name, Filter = "Consumables") {
	let Filtered = KinkyDungeonFilterInventory(Filter);
	for (let I = 0; I < Filtered.length; I++) {
		let item = Filtered[I];
		if (item.name == Name) return item;
	}
	return null;
}

function KinkyDungeonItemCount(Name) {
	let item = KinkyDungeonGetInventoryItem(Name);
	if (item && item.item && item.item.quantity) {
		return item.item.quantity;
	}
	return 0;
}

function KinkyDungeonGetShopItem(Level, Rarity, Shop) {
	let Table = [];
	let params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
	if (params.ShopExclusives) {
		for (let S = 0; S < params.ShopExclusives.length; S++) {
			Table.push(params.ShopExclusives[S]);
		}
	}
	let Shopable = Object.entries(KinkyDungeonConsumables).filter(([k, v]) => (v.shop));
	for (let S = 0; S < Shopable.length; S++) {
		let s = Shopable[S][1];
		s.shoptype = "Consumable";
		Table.push(s);
	}
	// @ts-ignore
	Shopable = Object.entries(KinkyDungneonBasic).filter(([k, v]) => (v.shop));
	for (let S = 0; S < Shopable.length; S++) {
		let s = Shopable[S][1];
		s.shoptype = "Basic";
		Table.push(s);
	}
	// @ts-ignore
	Shopable = Object.entries(KinkyDungeonWeapons).filter(([k, v]) => (v.shop));
	for (let S = 0; S < Shopable.length; S++) {
		let s = Shopable[S][1];
		s.shoptype = "Weapon";
		Table.push(s);
	}

	for (let R = Rarity; R >= 0; R--) {
		let available = Table.filter((item) => (item.rarity == R));
		if (available.length > 0) return available[Math.floor(Math.random() * available.length)];
	}
	return null;
}

function KinkyDungeonGetRandomConsumable(rarity = 0) {
	let table = [];
	let weightTotal = 0;
	while(table.length < 1) {
		let list = Object.entries(KinkyDungeonConsumables).filter(([k, v]) => (v.rarity == rarity));
		for (let I = 0; I < list.length; I++) {
			let item = list[I][1];
			let count = KinkyDungeonItemCount(item.name);
			if (count) {
				table.push({item:item, weight:weightTotal})
				weightTotal += count;
			}
		}
		rarity += 1;
		if (rarity >= 5) break;
	}
	let selection = Math.random() * weightTotal;
	let ret = null;
	for (let S = table.length - 1; S>=0; S--) if (selection > table[S].weight) ret = table[S].item;
	return ret;
}

function KinkyDungeonChangeConsumable(Consumable, Quantity) {
	let consumables = KinkyDungeonFilterInventory("Consumables");
	for (let I = 0; I < consumables.length; I++) {
		let item = consumables[I];
		if (item.name == Consumable.name) {
			item.item.quantity += Quantity;
			if (item.item.quantity <= 0) {
				for (let II = 0; II < KinkyDungeonInventory.length; II++) {
					if (KinkyDungeonInventory[II].consumable && KinkyDungeonInventory[II].consumable.name == Consumable.name) {
						KinkyDungeonInventory.splice(II, 1);
						return true;
					}
				}
			}
			return true;
		}
	}

	if (Quantity >= 0) {
		KinkyDungeonInventory.push({consumable: Consumable, quantity: Quantity});
	}

	return false;
}

function KinkyDungeonConsumableEffect(Consumable) {
	if (Consumable.type == "restore") {
		if (Consumable.wp_instant) KinkyDungeonStatWillpower += Consumable.wp_instant;
		if (Consumable.mp_instant) KinkyDungeonStatMana += Consumable.mp_instant;
		if (Consumable.sp_instant) KinkyDungeonStatStamina += Consumable.sp_instant;
		if (Consumable.ap_instant) KinkyDungeonStatArousal += Consumable.ap_instant;

		if (Consumable.wp_hurt) KinkyDungeonStatWillpowerMax -= Consumable.wp_hurt;
		if (Consumable.mp_hurt) KinkyDungeonStatManaMax -= Consumable.mp_hurt;
		if (Consumable.sp_hurt) KinkyDungeonStatStaminaMax -= Consumable.sp_hurt;
		if (Consumable.ap_hurt) KinkyDungeonStatArousalMax -= Consumable.ap_hurt;

		if (Consumable.wp_gradual) KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "PotionHealth", type: "restore_wp", power: Consumable.wp_gradual/Consumable.duration, duration: Consumable.duration});
		if (Consumable.mp_gradual) KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "PotionMana", type: "restore_mp", power: Consumable.mp_gradual/Consumable.duration, duration: Consumable.duration});
		if (Consumable.sp_gradual) KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "PotionStamina", type: "restore_sp", power: Consumable.sp_gradual/Consumable.duration, duration: Consumable.duration});
		if (Consumable.ap_gradual) KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id: "PotionFrigid", type: "restore_ap", power: Consumable.ap_gradual/Consumable.duration, duration: Consumable.duration});
	}
}

function KinkyDungeonAttemptConsumableChance() {
	let chance = 1;
	if (!KinkyDungeonPlayer.CanInteract()) {
		if (KinkyDungeonIsHandsBound(true)) chance -= 0.7;
		if (KinkyDungeonIsArmsBound(true)) chance -= 0.25;
	}
	if (!KinkyDungeonPlayer.CanTalk()) chance -= 0.75;
	return chance;
}

function KinkyDungeonAttemptConsumable(Name, Quantity) {
	let chance = KinkyDungeonAttemptConsumableChance();
	if (chance < 0) {
		KinkyDungeonSendMessage(7, TextGet("KinkyDungeonCantUsePotions"), "red", 2);
		return false;
	} else if (Math.random() < chance) {
		KinkyDungeonDoAction("Interact");
		KinkyDungeonUseConsumable(Name, Quantity);
		KinkyDungeonAdvanceTime(1);
		return true;
	} else {
		KinkyDungeonDoAction("Struggle");
		KinkyDungeonAdvanceTime(1);
		KinkyDungeonSendMessage(7, TextGet("KinkyDungeonUsePotionFail"), "red", 2);
		// todo: loss the potion
		return false;
	}
}

function KinkyDungeonUseConsumable(Name, Quantity) {
	let item = KinkyDungeonGetInventoryItem(Name, "Consumables");
	if (!item || item.item.quantity < Quantity) return false;

	for (let I = 0; I < Quantity; I++) {
		KinkyDungeonConsumableEffect(item.item.consumable);
	}
	KinkyDungeonChangeConsumable(item.item.consumable, -Quantity);

	KinkyDungeonSendMessage(6, TextGet("KinkyDungeonInventoryItem" + Name + "Use"), "#88FF88", 1);
	if (item.item.consumable.sfx) {
		AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/" + item.item.consumable.sfx + ".ogg");
	}
	return true;
}
