"use strict";

let KinkyDungeonTrapEnemy = {Rubble: 0.2, Chest: 0.3};
let KinkyDungeonTrapRestraint = {Rubble: 0.2, Chest: 0.4};
let KinkyDungeonChestLooted = 0;
let KinkyDungeonRubbleLooted = 0;

let KinkyDungeonLootTable = [
	{name: "nothing", 					message:"Fail", messageColor:"#aaaaaa", messageTime: 1, 				minLevel: 0, weight: {Rubble: 25,	Chest: 20,	increment: -2,	},		},
	{name: "smallgold", 				message:"SmallGold", messageColor:"yellow", messageTime: 2, 			minLevel: 0, weight: {Rubble: 18,	Chest: 8,	increment: -1,	},		loot: "Gold", amountMin:10, amountMax: 20},
	{name: "midgold", 					message:"MediumGold", messageColor:"yellow", messageTime: 2, 			minLevel: 0, weight: {Rubble: 6,	Chest: 12,	increment: 0,	},		loot: "Gold", amountMin:20, amountMax: 40},
	{name: "biggold", 					message:"BigGold", messageColor:"yellow", messageTime: 2, 				minLevel: 1, weight: {Rubble: 2,	Chest: 4,	increment: 1,	},		loot: "Gold", amountMin:40, amountMax: 80},
	{name: "hugegold", 					message:"HugeGold", messageColor:"orange", messageTime: 3, 				minLevel: 2, weight: {Rubble: 0,	Chest: 1,	increment: 1,	},		loot: "Gold", amountMin:80, amountMax: 200},
	{name: "knife", 					message:"Knife", messageColor:"lightgreen", messageTime: 2, 			minLevel: 0, weight: {Rubble: 12, 				increment: 0,	},		loot: "Knife"},
	{name: "enchknife", 				message:"EnchKnife", messageColor:"lightgreen", messageTime: 2, 		minLevel: 3, weight: {Rubble: 2, 	Chest: 1,	increment: 0,	},		loot: "EnchKnife"},
	{name: "pick", 						message:"Lockpick", messageColor:"lightgreen", messageTime: 2, 			minLevel: 0, weight: {Rubble: 20, 				increment: 0,	},		loot: "1Lockpick"},
	{name: "2pick", 					message:"Lockpicks", messageColor:"lightgreen", messageTime: 2, 		minLevel: 1, weight: {Rubble: 6, 				increment: 0,	},		loot: "2Lockpick"},
	{name: "redkey", 					message:"RedKey", messageColor:"lightgreen", messageTime: 2, 			minLevel: 1, weight: {Rubble: 9, 				increment: 0,	},		loot: "RedKey"},
	{name: "greenkey", 					message:"GreenKey", messageColor:"lightgreen", messageTime: 2, 			minLevel: 1, weight: {Rubble: 6, 				increment: 0,	},		loot: "GreenKey"},
	{name: "bluekey", 					message:"BlueKey", messageColor:"lightgreen", messageTime: 2, 			minLevel: 2, weight: {Rubble: 6, 				increment: 0,	},		loot: "BlueKey"},
	{name: "potion_health", 			message:"PotionHealth", messageColor:"lightgreen", messageTime: 2, 		minLevel: 2, weight: {				Chest: 0.5,	increment: 0,	},		loot: "Consumable", lootname: "PotionHealth"},
	{name: "potion_stamina", 			message:"PotionStamina", messageColor:"lightgreen", messageTime: 2, 	minLevel: 1, weight: {				Chest: 3,	increment: 0,	},		loot: "Consumable", lootname: "PotionStamina"},
	{name: "potion_frigid", 			message:"PotionFrigid", messageColor:"lightgreen", messageTime: 2, 		minLevel: 3, weight: {				Chest: 3,	increment: 0,	},		loot: "Consumable", lootname: "PotionFrigid"},
	{name: "potion_mana", 				message:"PotionMana", messageColor:"lightgreen", messageTime: 2, 		minLevel: 1, weight: {				Chest: 4,	increment: 0,	},		loot: "Consumable", lootname: "PotionMana"},
	{name: "potion_health2", 			message:"PotionHealth", messageColor:"lightblue", messageTime: 3, 		minLevel: 4, weight: {				Chest: 0.3,	increment: 0,	},		loot: "Consumable", lootname: "PotionHealthFast"},
	{name: "potion_stamina2",			message:"PotionStamina", messageColor:"lightblue", messageTime: 3,	 	minLevel: 2, weight: {				Chest: 1,	increment: 0,	},		loot: "Consumable", lootname: "PotionStaminaFast"},
	{name: "potion_frigid2", 			message:"PotionFrigid", messageColor:"lightblue", messageTime: 3, 		minLevel: 5, weight: {				Chest: 1,	increment: 0,	},		loot: "Consumable", lootname: "PotionFrigidFast"},
	{name: "potion_mana2", 				message:"PotionMana", messageColor:"lightblue", messageTime: 3, 		minLevel: 3, weight: {				Chest: 1.5,	increment: 0,	},		loot: "Consumable", lootname: "PotionManaFast"},
	{name: "potion_stamina3",			message:"PotionStamina", messageColor:"lightblue", messageTime: 3,	 	minLevel: 4, weight: {				Chest: 0.8,	increment: 0,	},		loot: "Consumable", lootname: "PotionStaminaMed"},
	{name: "potion_frigid3", 			message:"PotionFrigid", messageColor:"lightblue", messageTime: 3, 		minLevel: 8, weight: {				Chest: 0.8,	increment: 0,	},		loot: "Consumable", lootname: "PotionFrigidMed"},
	{name: "potion_mana3", 				message:"PotionMana", messageColor:"lightblue", messageTime: 3, 		minLevel: 6, weight: {				Chest: 1.2,	increment: 0,	},		loot: "Consumable", lootname: "PotionManaMed"},
	{name: "spell_points", 				message:"SpellPoints", messageColor:"lightblue", messageTime: 3, 		minLevel: 0, weight: {Rubble: 2,	Chest: 4,	increment: 0.6,	},		loot: "SpellPoints"},
	{name: "spell_discover",			message:"SpellDiscover", messageColor:"lightblue", messageTime: 3, 		minLevel: 0, weight: {Rubble: 2,	Chest: 4,	increment: 0.4,	},		loot: "SpellDiscover"},
	{name: "weapon_sword", 				message:"Weapon", messageColor:"lightblue", messageTime: 3, 			minLevel: 0, weight: {				Chest: 1,	increment: 0,	},		loot: "Weapon", ignoreInventory: true, lootname: "Sword"},
	{name: "weapon_axe", 				message:"Weapon", messageColor:"lightblue", messageTime: 3, 			minLevel: 0, weight: {				Chest: 1,	increment: 0,	},		loot: "Weapon", ignoreInventory: true, lootname: "Axe"},
	{name: "weapon_spear", 				message:"Weapon", messageColor:"lightblue", messageTime: 3, 			minLevel: 0, weight: {Rubble: 0.4,	Chest: 0.6,	increment: 0,	},		loot: "Weapon", ignoreInventory: true, lootname: "Spear"},
	{name: "weapon_hammer", 			message:"Weapon", messageColor:"lightblue", messageTime: 3, 			minLevel: 0, weight: {				Chest: 1,	increment: 0,	},		loot: "Weapon", ignoreInventory: true, lootname: "Hammer"},
	{name: "weapon_boltcutters", 		message:"Weapon", messageColor:"lightblue", messageTime: 3, 			minLevel: 0, weight: {				Chest: 1,	increment: 0,	},		loot: "Weapon", ignoreInventory: true, lootname: "BoltCutters"},
	{name: "weapon_wand", 				message:"Weapon", messageColor:"lightblue", messageTime: 3, 			minLevel: 0, weight: {				Chest: 1,	increment: 0,	},		loot: "Weapon", ignoreInventory: true, lootname: "Wand"},
];

function KinkyDungeonNewLevelLoot() {
	KinkyDungeonChestLooted = 0;
	KinkyDungeonRubbleLooted = 0;
}

function KinkyDungeonLootBasicItem(name) {
	if (name == "RedKey") KinkyDungeonRedKeys += 1;
	else if (name == "GreenKey") KinkyDungeonGreenKeys += 1;
	else if (name == "BlueKey") KinkyDungeonBlueKeys += 1;
	else if (name == "Knife") KinkyDungeonNormalBlades += 1;
	else if (name == "EnchKnife") KinkyDungeonEnchantedBlades += 1;
	else if (name.includes("Lockpick")) {
		KinkyDungeonLockpicks += parseInt(name);
	}
}

function KinkyDungeonLoot(Level, Index, Type) {
	let lootWeightTotal = 0;
	let lootWeights = [];
	let lootMess = "Loot" + Type;

	let luck = (Type == "Chest"?KinkyDungeonChestLooted:KinkyDungeonRubbleLooted) /5 + Level/10;

	for (let L = 0; L < KinkyDungeonLootTable.length; L++) {
		let loot = KinkyDungeonLootTable[L];
		if (Level >= loot.minLevel && loot.weight[Type]) {
			let prereqs = true;
			if (loot.ignoreInventory) {
				if (!loot.lootname || KinkyDungeonInventoryGet(loot.lootname)) prereqs = false;
			}
			if (prereqs) {
				let weight = loot.weight[Type];
				if (loot.weight.increment) weight += loot.weight.increment * luck;
				if (weight > 0) {
					lootWeights.push({loot: loot, weight: lootWeightTotal});
					lootWeightTotal += weight;
				}
			}
		}
	}
	let selection = Math.random() * lootWeightTotal;

	let loot = KinkyDungeonLootTable[0];
	for (let L = lootWeights.length - 1; L >= 0; L--) {
		if (selection > lootWeights[L].weight) {
			loot = lootWeights[L].loot;
			break;
		}
	}

	let trapChance = KinkyDungeonTrapEnemy[Type] * (1 + luck/15);
	if (KinkyDungeonCurrentMaxEnemies > 0) {
		let nonSumEnemies = 0;
		for (let e of KinkyDungeonEntities) {if (!e.summoned) nonSumEnemies++;}
		trapChance *= Math.max(0, 1 - nonSumEnemies/KinkyDungeonCurrentMaxEnemies);
	}
	let trapRestraintChance = KinkyDungeonTrapRestraint[Type] * (1 + luck/20);
	trapRestraintChance *= Math.max(0, 1 - KinkyDungeonRestraintList().length/20);

	let TextMess = null;
	selection = Math.random();
	if (selection < trapChance) {
		// Trigger enemy trap
		let amount = 1 + Math.random() * luck;
		if (KinkyDungeonTrapPlaceEnemy(Index, Level, amount)) TextMess = TextGet(lootMess + "TrapEnemy");
	} else if (selection < trapChance + trapRestraintChance) {
		// Trigger restraint trap
		let restraint = KinkyDungeonGetRestraint({attacktags: ["trap"]}, Level + luck / 25, null, true);
		if (restraint) {
			let lock = KinkyDungeonGenerateLockRestraint(restraint, Level, (!(restraint.Group == "ItemArms" || restraint.Group == "ItemHands")));
			
			KinkyDungeonAddRestraintIfWeaker(restraint, MiniGameKinkyDungeonCheckpoint, true, lock);
			let curse = luck / 20 - KinkyDungeonRestraintList().length/50;
			if (Math.random() < curse) KinkyDungeonCurseRestraint(KinkyDungeonGetRestraintItem(restraint.Group));
			if (restraint.trapAdd) {
				KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(restraint.trapAdd), MiniGameKinkyDungeonCheckpoint, true, false);
				TextMess = TextGet(lootMess + "TrapMagicVibe");
			} else {
				TextMess = TextGet(lootMess + "TrapMagic");
			}
			TextMess = TextMess.replace("RestraintType", TextGet("Restraint"+restraint.name))
		}
	}	

	let Mess = TextGet(lootMess + loot.message);

	// Procss Loots
	if (!loot.loot) {
		// NOTHING-  -
	} else if (loot.loot == "Gold") {
		let amount = Math.floor((loot.amountMin + (loot.amountMax - loot.amountMin + 1) * Math.random()) * (1 + Level/50));
		KinkyDungeonAddGold(amount);
		Mess = Mess.replace("XXX", "" + amount);
	} else if (loot.loot == "SpellDiscover") {
		let school = KinkyDungeonBooks[Math.floor(Math.random()*3)];
		let amount = Math.floor(1 + Math.random() * KinkyDungeonSpellLevel[school]);
		let spell = KinkyDungeonDiscoverSpell(school, amount, true);
		if (spell) Mess = Mess.replace("SPELL", TextGet("KinkyDungeonSpell"+spell.name));
		else Mess = TextGet(lootMess + "Fail");
	} else if (loot.loot == "SpellPoints") {
		let school = KinkyDungeonBooks[Math.floor(Math.random()*3)];
		let amount = Math.floor(1 + Math.random() * Math.random() * KinkyDungeonSpellLevel[school]/4);
		KinkyDungeonSpellPoints[school] += amount;
		Mess = Mess.replace("SCHOOL", school).replace("AMOUNT", "" + amount);
	} else if (loot.loot == "Weapon") {
		KinkyDungeonInventoryAddWeapon(loot.lootname);
		Mess = Mess.replace("WeaponAcquired", TextGet("KinkyDungeonInventoryItem"+loot.lootname));
	} else if (loot.loot == "Consumable") {
		let amount = 1 + Math.floor(1 + Math.random() * luck)
		KinkyDungeonChangeConsumable(KinkyDungeonConsumables[loot.lootname], amount);
	} else {
		KinkyDungeonLootBasicItem(loot.loot);
	}

	// Aftermath
	if (Type == "Chest") KinkyDungeonChestLooted += 1;
	if (Type == "Rubble") KinkyDungeonRubbleLooted += 1;
	if (TextMess) KinkyDungeonSendMessage(8, TextMess, "red", 5);
	KinkyDungeonSendMessage(3, Mess, loot.messageColor, loot.messageTime + KinkyDungeonActions.Move.Time);
}

function KinkyDungeonTrapPlaceEnemy (Index, Floor, amount) {
	let InJail = KinkyDungeonSpawnJailers > 0 && KinkyDungeonSpawnJailers == KinkyDungeonSpawnJailersMax;
	if (InJail) return 0;	// no other jailer..
	let enemyWeights = KinkyDungeonEnemyWeights(false, KinkyDungeonMapParams[Index].enemytags, Floor);
	let count = 0;
	let tries = 0;
	let miniboss = false;
	let boss = false;
	let playerDist = Math.sqrt(amount) * 3;
	let Xmin = Math.max(1, KinkyDungeonPlayerEntity.x - playerDist);
	let Xmax = Math.min(KinkyDungeonGridWidth, KinkyDungeonPlayerEntity.x + playerDist);
	let Ymin = Math.max(1, KinkyDungeonPlayerEntity.y - playerDist);
	let Ymax = Math.min(KinkyDungeonGridHeight, KinkyDungeonPlayerEntity.y + playerDist);
	// Create this number of enemies
	while (count < amount && tries < amount * 10) {
		let X = Xmin + Math.floor(Math.random()*(Xmax - Xmin + 1));
		let Y = Ymin + Math.floor(Math.random()*(Ymax - Ymin + 1));
		if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(X, Y)) && KinkyDungeonNoEnemy(X, Y, true)) {

			let L = KinkyDungeonGetEnemy(enemyWeights, Floor, X, Y, true, true, 99);

			if (L>=0) {
				let Enemy = enemyWeights[L].enemy;
				if (Enemy ) {
					KinkyDungeonEntities.push({Enemy: Enemy, x:X, y:Y, hp: (Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0});
					if (Enemy.placetags.includes("minor")) count += 0.2; else count += 1; // Minor enemies count as 1/5th of an enemy
					if (Enemy.placetags.includes("elite")) count += Math.max(1, 100/(100 + KinkyDungeonDifficulty)); // Elite enemies count as 2 normal enemies
					if (Enemy.placetags.includes("miniboss")) miniboss = true; // Adds miniboss as a tag
					if (Enemy.placetags.includes("boss")) boss = true; // Adds boss as a tag
					if (Enemy.placetags.includes("removeDoorSpawn") && KinkyDungeonMapGet(X, Y) == "d") KinkyDungeonMapSet(X, Y, '0');
					if (Enemy.summon) {
						for (let sum of Enemy.summon) {
							KinkyDungeonSummonEnemy(X, Y, sum.enemy, sum.count, sum.range, sum.strict);
						}
					}
				}
			}
		}
		tries += 1;
	}
	return count;
}

function KinkyDungeonAddGold(value) {
	KinkyDungeonGold += value;
	if (ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable()) CharacterChangeMoney(Player, Math.round(value/10));
}

function KinkyDungeonHandleTraps(x, y) {
	let tile = KinkyDungeonTiles[x + "," + y];
	if (tile && tile.Type == "Trap") {
		let msg = "";
		let color = "red";
		if (tile.Trap == "Skeletons") {
			let created = KinkyDungeonSummonEnemy(x, y, "SummonedSkeleton", tile.Power, 4);
			if (created > 0) {
				KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
				msg = "Default";
				KinkyDungeonTiles[x + "," + y] = undefined;
			}
		} else if (tile.Trap == "Bandits") {
			let created = KinkyDungeonSummonEnemy(x, y, "Bandit", tile.Power, 2);
			if (created > 0) {
				KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
				msg = "Default";
				KinkyDungeonTiles[x + "," + y] = undefined;
			}
		} else if (tile.Trap == "Random") {
			let created = KinkyDungeonTrapPlaceEnemy(KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], MiniGameKinkyDungeonLevel, tile.Power);
			if (created > 0) {
				KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Trap.ogg");
				msg = "Default";
				KinkyDungeonTiles[x + "," + y] = undefined;
			}			
		}
		if (msg) {
			if (msg == "Default")
				KinkyDungeonSendMessage(8, TextGet("KinkyDungeonTrap" + tile.Trap), color, 2);
			else
				KinkyDungeonSendMessage(8, msg, color, 2);
		}
	}
}

function KinkyDungeonGetTrap(trapTypes, Level, tags) {

	var trapWeightTotal = 0;
	var trapWeights = [];

	for (let L = 0; L < trapTypes.length; L++) {
		var trap = trapTypes[L];
		let effLevel = Level;
		let weightMulti = 1.0;
		let weightBonus = 0;

		if (effLevel >= trap.Level) {
			trapWeights.push({trap: trap, weight: trapWeightTotal});
			let weight = trap.Weight + weightBonus;
			if (trap.terrainTags)
				for (let T = 0; T < tags.length; T++)
					if (trap.terrainTags[tags[T]]) weight += trap.terrainTags[tags[T]];

			trapWeightTotal += Math.max(0, weight*weightMulti);

		}
	}

	var selection = Math.random() * trapWeightTotal;

	for (let L = trapWeights.length - 1; L >= 0; L--) {
		if (selection > trapWeights[L].weight) {
			return {Name: trapWeights[L].trap.Name, Power: trapWeights[L].trap.Power};
		}
	}

}
