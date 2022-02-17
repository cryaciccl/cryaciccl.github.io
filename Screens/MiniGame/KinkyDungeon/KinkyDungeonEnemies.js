"use strict";
var KinkyDungeonEnemies = [// Player
	{name: "Wall", 			placetags: ["player"], minLevel: 0, weight: 0, terrainTags: {}, 		movetags: [], allied: true, AI: "wander", followRange: 100, visionRadius: 0, movePoints: 1000, 																		maxhp: 25, defensetags: ["playerinstakill"], evasion: -100, armor: 1, regen: -2.5, lowpriority: true, 	attacktags: [], attackPoints: 0, attack: "", attackRange: 0 },
//	{name: "ShadowWarrior",	placetags: ["player"], minLevel:0, weight:0, terrainTags: {},			movetags: [], allied: true, AI: "hunt", followRange: 1, visionRadius: 20, playerBlindSight: 10, movePoints: 1, noblockplayer: true,  								maxhp: 8, defensetags: ["ghost"], armor: 0, regen: -0.5, 												attacktags: [], attackPoints: 1, attack: "Spell", attackRange: 0, power: 1, spells: ["AllyShadowStrike"], spellCooldownMult: 1, spellCooldownMod: 0}, 
	{name: "Elemental", 	placetags: ["player"], minLevel: 0, weight: 0, terrainTags: {}, 		movetags: [], allied: true, AI: "hunt", followRange: 3, visionRadius: 20, playerBlindSight: 10, movePoints: 1, noblockplayer: true, playerFollowRange: 2, 			maxhp: 8, defensetags: ["fireimmune", "electricimmune", "coldweakness", "iceweakness"], armor: 0, 		attacktags: [], attackPoints: 1, kite: 1.5, attack: "Spell", attackRange: 0, power: 1, spells: ["AllyFirebolt"], minSpellRange: 1.5, spellCooldownMult: 1, spellCooldownMod: 0, castWhileMoving: true }, 
	{name: "Golem", 		placetags: ["player"], minLevel: 0, weight: 0, terrainTags: {}, 		movetags: [], allied: true, AI: "hunt", followRange: 1, visionRadius: 20, playerBlindSight: 10, movePoints: 99, noblockplayer: true, 								maxhp: 24, defensetags: ["meleeresist"], armor: 2, 														attacktags: [], attackPoints: 2, attack: "Melee", attackRange: 2, attackWidth: 5, power: 6 }, 
	{name: "Familiar", 		placetags: ["player"], minLevel:0, weight:0, terrainTags: {},			movetags: [], allied: true, AI: "hunt", followRange: 1, visionRadius: 20, playerBlindSight: 10, movePoints: 1, noblockplayer: true, helpStruggle:true,				maxhp: 6, defensetags: [], armor: 0, 																	attacktags: [], attackPoints: 1, attack: "Melee", attackRange: 1, attackWidth: 3, power: 1},
	{name: "Illusion",		placetags: ["player"], minLevel:0, weight:0, terrainTags: {},			movetags: [], allied: true, AI: "wander", followRange: 100, visionRadius: 0, movePoints: 2,noblockplayer: true,   													maxhp: 6, defensetags: [], evasion: 4, armor: 0, regen: -1, 											attacktags: [], attackPoints: 0, attack: "", attackRange: 0}, 
//	{name: "StormCrystal", 	placetags: ["player"], minLevel:0, weight:0, terrainTags: {},			movetags: [], allied: true, AI: "wander", followRange: 1, visionRadius: 6, movePoints: 1000, noblockplayer: true,   												maxhp: 16, defensetags: [], armor: 2, regen: -0.5, 														attacktags: [], attackPoints: 1, attack: "Spell", attackRange: 0, power: 1, spells: ["AllyCrackle"], spellCooldownMult: 1, spellCooldownMod: 0},
// Graveyard -- 0 
// Catacomb -- 1 
// Ancient Tomb -- 11 
{name: "BlindZombie", 		placetags: ["zombie"], minLevel: 0, weight: 14, terrainTags: {}, 													movetags: ["ignoreharmless"], AI: "wander", ignorechance: 0.33, followRange: 1, visionRadius: 1.5, movePoints: 3, 		maxhp: 8, defensetags: ["meleeweakness"], evasion: -1, armor: 0, 					attacktags: ["melee", "ribbonRestraints"], attackPoints: 3, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 2, 													dropTable: [ {name: "Gold", amountMin: 20, amountMax: 40, weight: 2 }, {name: "Gold", amountMin: 13, amountMax: 23, weight: 5 }] }, 
{name: "FastZombie", 		placetags: ["zombie"], minLevel: 4, weight: 6, terrainTags: { "secondhalf": 10, "lastthird": 14 }, 					movetags: ["ignoreharmless"], AI: "hunt", ignorechance: 0.33, followRange: 1, visionRadius: 6, movePoints: 3, 			maxhp: 10, defensetags: ["slashweakness"], evasion: -1, armor: 1, 					attacktags: ["melee", "ribbonRestraints"], attackPoints: 2, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 3, 													dropTable: [ {name: "Gold", amountMin: 40, amountMax: 60, weight: 1 }, {name: "Gold", amountMin: 15, amountMax: 29, weight: 5 }] }, 
{name: "SamuraiZombie", 	placetags: ["zombie", "elite"], minLevel: 4, weight: 5, terrainTags: { "secondhalf": 8, "lastthird": 6 }, 			movetags: ["ignoreharmless"], AI: "hunt", ignorechance: 0.33, followRange: 1, visionRadius: 6, movePoints: 3, 			maxhp: 20, defensetags: ["meleeweakness"], evasion: -1, armor: 2, 					attacktags: ["melee", "leashing", "ropeRestraints", "ropeRestraints2", ], attackPoints: 2, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 1, dmgType: "slash", fullBoundBonus: 4, 						dropTable: [ {name: "Gold", amountMin: 50, amountMax: 80, weight: 2 }, {name: "Gold", amountMin: 15, amountMax: 29, weight: 5 }], 
		/* --- */ 																																																																																			specialAttack: "Stun", specialRemove: "Bind", specialCDonAttack: false, specialWidth: 5, specialRange: 1, stunTime: 2, specialCD: 6 }, 
{name: "Skeleton", 			placetags: ["skeleton"], minLevel: 1, weight: 8, terrainTags: { "secondhalf": 4, "Leather": 1 }, 					movetags: [], AI: "hunt", ignorechance: 0, followRange: 1, visionRadius: 4, movePoints: 2, 								maxhp: 5, defensetags: ["iceresist", "crushweakness"], armor: 0, 					attacktags: ["leashing", "melee", "ropeRestraints", "leatherRestraints", "clothRestraints"], attackPoints: 2, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 3, dmgType: "grope", fullBoundBonus: 1, 	dropTable: [ {name: "Gold", amountMin: 25, amountMax: 50, weight: 2 }, {name: "Gold", amountMin: 20, amountMax: 35, weight: 5 }] }, 
{name: "SummonedSkeleton", 	placetags: ["skeleton"], minLevel: 1, weight: 8, terrainTags: {}, 													movetags: [], AI: "guard", ignorechance: 0, followRange: 1, visionRadius: 6, movePoints: 2, 							maxhp: 5, defensetags: ["crushweakness"], armor: 0, 								attacktags: ["leashing", "melee", "ropeRestraints", "leatherRestraints", "clothRestraints"], attackPoints: 2, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 2, dmgType: "grope", fullBoundBonus: 1, 	dropTable: [ {name: "Gold", amountMin: 25, amountMax: 50, weight: 2 }, {name: "Gold", amountMin: 20, amountMax: 35, weight: 5 }] }, 
{name: "LesserSkeleton", 	placetags: ["skeleton"], minLevel: 0, weight: 10, terrainTags: { "secondhalf": -8, "lastthird": -8 }, 				movetags: ["ignorenoSP"], AI: "wander", ignorechance: 0, followRange: 1, visionRadius: 1, movePoints: 2, 				maxhp: 2.5, defensetags: ["iceresist", "crushweakness"], evasion: -2, armor: 0, 	attacktags: ["leashing", "melee", ], attackPoints: 3, attack: "MeleeSlow", attackWidth: 1, attackRange: 1, power: 3, dmgType: "grope", fullBoundBonus: 1 }, 
{name: "GreaterSkeleton", 	placetags: ["skeleton", "ancient", "elite"], minLevel: 12, weight: 3, terrainTags: { "secondhalf": 2, "lastthird": 3, "increasingWeight": 1 },
		/* --- */ 																																movetags: ["ignoreharmless"], AI: "hunt", ignorechance: 0, followRange: 1.5, visionRadius: 4, movePoints: 3, 			maxhp: 10, defensetags: ["iceresist", "crushweakness"], evasion: -2, armor: 0, 		attacktags: ["leashing", "melee", ], attackPoints: 3, attack: "MeleeSlow", attackWidth: 3, attackRange: 1, power: 10, dmgType: "crush", fullBoundBonus: 0, 															dropTable: [ {name: "PotionStamina", weight: 3 }, {name: "Gold", amountMin: 50, amountMax: 100, weight: 3 }, {name: "Hammer", weight: 50, ignoreInInventory: true }] }, // 1378 
{name: "Ghost", 			placetags: ["ghost", "SacrificeAnger"], minLevel: 0, weight: 0, terrainTags: { "ghost": 5, "Sacrifice": 1 }, 		movetags: ["ignorenoSP"], AI: "hunt", blindSight: 3, ignorechance: 0, followRange: 1, visionRadius: 10, movePoints: 2, 	maxhp: 1, defensetags: ["ghost"], ethereal: true, evasion: 9.0, alwaysEvade: true, armor: 0, 
		/* --- */ 																																																																																			attacktags: ["melee"], attackPoints: 1, attack: "Melee", attackWidth: 3, attackRange: 1, power: 6, dmgType: "will", fullBoundBonus: 0 }, 
{name: "AnimatedArmor", 	placetags: ["ancient", "metal", "minor"], minLevel: 1, weight: 0, terrainTags: { "removeDoorSpawn": 1, "lastthird": 8, "passage": 40, "adjChest": 8, "door": 40, "Metal": 1 }, 																maxhp: 10, defensetags: ["slashresist", "fireresist", "electricresist", "crushweakness"], evasion: -0.5, armor: 2,
		/* -- */																																movetags: ["ignoreharmless"], AI: "ambush", ignorechance: 1.0, visionRadius: 100, ambushRadius: 1.9, blindSight: 100, blockVisionWhileStationary: true, followRange: 1, movePoints: 4, 						attacktags: ["leashing", "melee", "shackleRestraints", "shackleGag", ], attackPoints: 4, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 4, dmgType: "crush", fullBoundBonus: 4, 						dropTable: [ {name: "RedKey", weight: 4 }, {name: "Gold", amountMin: 75, amountMax: 125, weight: 10 }, {name: "Sword", weight: 1, ignoreInInventory: true }] }, // Jungle -- 2 
{name: "VinePlant", 		placetags: ["plant", "minor"], minLevel: 0, weight: 10, terrainTags: { "removeDoorSpawn": 1, "passage": -50, "adjChest": 8, "door": 8, "Rope": 1 }, 																						maxhp: 10, defensetags: ["slashsevereweakness", "firesevereweakness", "unarmedresist", "crushresist", ], armor: 2,
		/* -- */																																movetags: ["ignorenoSP"], AI: "ambush", ignorechance: 1.0, followRange: 1, visionRadius: 3, ambushRadius: 1.9, blindSight: 5, movePoints: 1, blockVisionWhileStationary: true, 								attacktags: ["melee", "vineRestraints"], attackPoints: 2, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 2, dmgType: "pierce", fullBoundBonus: 4,														dropTable: [ {name: "PotionFrigid", weight: 2 }, {name: "Nothing", weight: 10 }, ],
	   	/* --- */ 																specialAttack: "Stun", specialAttackPoints: 1, specialRemove: "Bind", specialCD: 99 }, 
{name: "Bramble", 			placetags: ["plant", "minor"], minLevel: 0, weight: -80, terrainTags: { "removeDoorSpawn": 1, "passage": -50, "adjChest": -50, "door": -50, "open": 110, "Rope": 1 }, 																																							attacktags: ["melee"], attackPoints: 1, attack: "Melee", attackWidth: 8, attackRange: 1, power: 1, dmgType: "pain", hitsfx: "DealDamage",
		/* -- */																																movetags: [], AI: "wander", ignorechance: 1.0, visionRadius: 1.5, blindSight: 1.5, followRange: 1, movePoints: 99999, 	maxhp: 16, defensetags: ["slashsevereweakness", "firesevereweakness", "unarmedresist", "crushresist"], evasion: -9, armor: 2, 		specialAttack: "Slow", specialAttackPoints: 1, specialCD: 2 }, 
{name: "Bandit", 			placetags: ["bandit"], minLevel: 0, weight: 15, terrainTags: { "thirdhalf": -4, "Leather": 1 }, 					movetags: [], AI: "patrol", ignorechance: 0, followRange: 1, visionRadius: 6, movePoints: 2, 							maxhp: 9, defensetags: [], armor: 0, 												attacktags: ["leashing", "melee", "leatherRestraints", "leatherRestraintsHeavy", "clothRestraints"], attackPoints: 2, attack: "SpellMeleeBind", attackWidth: 1, attackRange: 1, power: 3, dmgType: "crush", fullBoundBonus: 3,
		/* -- */ 																																																																																			spells: ["BanditBola"], minSpellRange: 1.5, spellCooldownMult: 1, spellCooldownMod: 8, 																																dropTable: [ {name: "Gold", amountMin: 30, amountMax: 50, weight: 4 }, {name: "Gold", amountMin: 25, amountMax: 35, weight: 8 }, {name: "Pick", weight: 8 }, {name: "PotionStamina", weight: 1 }] }, 
{name: "BanditHunter", 		placetags: ["bandit"], minLevel: 4, weight: 0, terrainTags: { "secondhalf": 7, "thirdhalf": 5, "Leather": 1 }, 		movetags: [], AI: "patrol", ignorechance: 0, followRange: 2, visionRadius: 7, movePoints: 2, 							maxhp: 9, defensetags: [], armor: 0, stealth: 1, 									attacktags: ["leashing", "melee", "leatherRestraints", "leatherRestraintsHeavy", "clothRestraints"], attackPoints: 2, attack: "SpellMeleeBind", attackWidth: 1, attackRange: 1, power: 3, dmgType: "pierce", fullBoundBonus: 5, 
		/* --- */																																																																																			spells: ["BanditBola"], minSpellRange: 1.5, spellCooldownMult: 1, spellCooldownMod: 3, 																																dropTable: [ {name: "Gold", amountMin: 30, amountMax: 50, weight: 4 }, {name: "Gold", amountMin: 25, amountMax: 35, weight: 8 }, {name: "Pick", weight: 8 }, {name: "PotionStamina", weight: 1 }] }, 
{name: "SmallSlime", 		placetags: ["slime", "fantasy"], minLevel: 15, weight: 10, terrainTags: { "Latex": 1 }, 							movetags: ["ignoretiedup"], AI: "hunt", ignorechance: 0.75, followRange: 1, visionRadius: 3, movePoints: 1, 			maxhp: 3, defensetags: ["meleeresist"], 											attacktags: ["melee", "slimeRestraints"], attackPoints: 2, attack: "MeleeBindSlowSuicide", suicideOnAdd: true, attackWidth: 1, attackRange: 1, power: 1, dmgType: "glue", fullBoundBonus: 5, sneakThreshold: 1, 	dropTable: [ {name: "Nothing", weight: 49 }, {name: "Pick", weight: 4 }, {name: "Knife", weight: 2 }, {name: "MagicSword", weight: 1, ignoreInInventory: true }] }, 
{name: "FastSlime", 		placetags: ["slime", "fantasy"], minLevel: 22, weight: 5, terrainTags: { "Latex": 1 }, 								movetags: ["ignoretiedup"], AI: "hunt", followRange: 1, visionRadius: 3, movePoints: 1, 								maxhp: 3, defensetags: ["meleeresist"], evasion: 0.3, 								attacktags: ["melee", "slimeRestraints"], attackPoints: 2, attack: "MeleeBindSlowSuicide", suicideOnAdd: true, attackWidth: 1.5, attackRange: 3, power: 4, dmgType: "glue", fullBoundBonus: 6, sneakThreshold: 1, 	dropTable: [ {name: "Nothing", weight: 29 }, {name: "Pick", weight: 4 }, {name: "RedKey", weight: 1 }, {name: "BlueKey", weight: 1 }, {name: "Knife", weight: 2 }, {name: "MagicSword", weight: 1, ignoreInInventory: true }] }, 
{name: "BigSlime", 			placetags: ["slime", "fantasy"], minLevel: 23, weight: 2, terrainTags: { "Latex": 1 }, 								movetags: ["ignoretiedup"], AI: "hunt", followRange: 1, visionRadius: 3, movePoints: 3, 								maxhp: 12, defensetags: ["meleeresist"], evasion: 0.3, 								attacktags: ["melee", "slimeRestraints"], attackPoints: 3, attack: "MeleeBind", attackWidth: 8, attackRange: 1, power: 4, dmgType: "glue", fullBoundBonus: 4, sneakThreshold: 1, 
		/* --- */																																																																																			ondeath: [{ type: "summon", enemy: "SmallSlime", range: 2.5, count: 4, strict: true }], 																															dropTable: [ {name: "Nothing", weight: 9 }, {name: "Pick", weight: 4 }, {name: "RedKey", weight: 1 }, {name: "BlueKey", weight: 1 }, {name: "Knife", weight: 2 }, {name: "MagicSword", weight: 1, ignoreInInventory: true }] }, 
{name: "LesserTentacle", 	placetags: ["tentacles", "fantasy", "minor"], minLevel: 0, weight: 9, terrainTags: { "rubble": 15 }, 				movetags: ["ignorenoSP"], AI: "wander", ignorechance: 0.5, followRange: 1, visionRadius: 1, movePoints: 99, 			maxhp: 5, defensetags: ["crushresist", "fireweakness", "electricweakness"], 		attacktags: ["melee", "TentacleRestraint"], attackPoints: 3, attackWhileMoving:true, attack: "MeleeBindSlow", attackWidth: 1, attackRange: 1, power: 2, dmgType: "grope", fullBoundBonus: 2, 						dropTable: [ {name: "Nothing", weight: 7 }, {name: "PotionHealth", weight: 1 }, {name: "Gold", amountMin: 10, amountMax: 30, weight: 2 }] }, 
{name: "Tentacles", 		placetags: ["tentacles", "fantasy"], minLevel: 0, weight: 6, terrainTags: { "rubble": 10, "Delight": 1 }, 			movetags: ["ignorenoSP"], AI: "wander", ignorechance: 0.5, followRange: 1, visionRadius: 1, movePoints: 4, 				maxhp: 11, defensetags: ["crushresist", "fireweakness", "electricweakness"], 		attacktags: ["melee", "TentacleRestraint"], attackPoints: 2, attackWhileMoving:true, attack: "MeleeBindSlow", attackWidth: 3, attackRange: 1, power: 2, dmgType: "grope", fullBoundBonus: 2, 						dropTable: [ {name: "PotionFrigid", weight: 1 }, {name: "PotionHealth", weight: 1 }, {name: "Nothing", weight: 10}] }, 
{name: "GreaterTentacles", 	placetags: ["tentacles", "fantasy", "elite"], minLevel: 4, weight: 4, terrainTags: { "secondhalf": 4, "thirdhalf": 2, "rubble": 5, "Delight": 1 }, 																							maxhp: 21, defensetags: ["unarmedimmune", "crushimmune", "slashresist", "pierceresist", "fireweakness", "electricweakness"], armor: 1, ondeath: [{ type: "summon", enemy: "Tentacles", range: 2.5, count: 2, strict: true }],
		/* -- */																																movetags: ["ignorenoSP"], AI: "wander", ignorechance: 0.5, visionRadius: 1, followRange: 1, movePoints: 8, 																									attacktags: ["melee", "TentacleRestraints", ], attackPoints: 2, attackWhileMoving:true, attack: "MeleeBindSlow", attackWidth: 3, attackRange: 1, power: 4, dmgType: "grope", fullBoundBonus: 4, 					dropTable: [ {name: "PotionFrigid", weight: 1 }, {name: "PotionHealth", weight: 1 }, {name: "Nothing", weight: 10}] }, 
{name: "RopeSnake", 		placetags: ["rope", "minor"], minLevel: 1, weight: 3, terrainTags: { "secondhalf": 4, "lastthird": 2, "Rope": 1 },	movetags: ["ignoreharmless"], AI: "wander", followRange: 1, ignorechance: 0.75, visionRadius: 3, movePoints: 1, 		maxhp: 4, defensetags: ["fireweakness", "slashweakness"], 							attacktags: ["melee", "ropeRestraints"], attackPoints: 2, attack: "MeleeBindSuicide", suicideOnAdd: true, attackWidth: 1, attackRange: 1, power: 1, dmgType: "grope", fullBoundBonus: 4 }, 
{name: "LearnedRope",	 	placetags: ["rope"], minLevel: 3, weight: 1, terrainTags: { "secondhalf": 4, "lastthird": 2, "Rope": 1 }, 			movetags: ["ignoreharmless"], AI: "hunt", followRange: 1, ignorechance: 0.75, visionRadius: 5, movePoints: 2, 			maxhp: 8, defensetags: ["fireweakness", "slashweakness"], 							attacktags: ["melee", "ropeRestraints", "ropeRestraints2"], attackPoints: 2, attack: "MeleeBindSuicide", suicideOnAdd: true, attackWidth: 1.5, attackRange: 2, power: 3, multiBind: 2, dmgType: "grope", fullBoundBonus: 5 }, 
{name: "MonsterRope", 		placetags: ["rope", "elite"], minLevel: 5, weight: 0, terrainTags: { "secondhalf": 1, "lastthird": 4, "Rope": 1 },	movetags: ["ignoreharmless"], AI: "guard", ignorechance: 0.75, followRange: 1, visionRadius: 6, movePoints: 3, 			maxhp: 20, defensetags: ["fireweakness", "slashweakness"], 							attacktags: ["melee", "ropeRestraints", "ropeRestraints2"], attackPoints: 2, attack: "MeleeBindSuicide", suicideOnAdd: true, attackWidth: 3, attackRange: 1, power: 5, multiBind: 5, dmgType: "grope", fullBoundBonus: 15 }, 
{name: "RopeKraken", 		placetags: ["rope", "boss"], minLevel: 5, weight: -30, terrainTags: { "secondhalf": 16, "lastthird": 5, "boss": -80, "open": 30, "passage": -60, "Rope": 10 }, 																				maxhp: 60, defensetags: ["fireweakness", "slashweakness"], 							attacktags: ["melee"], attackPoints: 2, attack: "Spell", attackWidth: 1, attackRange: 1, power: 6, dmgType: "grope", 																								
		/* -- */																																movetags: [], AI: "hunt", ignorechance: 0.75, followRange: 1, visionRadius: 10, movePoints: 4, ignoreflag: ["kraken"],																						spells: ["RopeEngulf"], spellCooldownMult: 1, spellCooldownMod: 1, summon: [{ enemy: "RopeMinion", range: 2.5, count: 8, strict: true }], 																			dropTable: [ {name: "Knives", weight: 4 }, {name: "EnchKnife", weight: 3 }] }, 
{name: "RopeMinion", 		placetags: [], minLevel: 1, weight: -1000, terrainTags: {}, 														movetags: [], AI: "hunt", ignorechance: 0.75, followRange: 1, visionRadius: 10, movePoints: 1, master: { type: "RopeKraken", range: 4 }, ignoreflag: ["kraken"],
		/* -- */																																																														maxhp: 8, defensetags: ["fireweakness", "slashweakness"], 							attacktags: ["melee"], attackPoints: 2, attack: "MeleePull", attackWidth: 1, attackRange: 1, power: 2, dmgType: "grope", fullBoundBonus: 2 }, 
{name: "Rat", 				placetags: ["beast", "minor"], minLevel: 0, weight: 8, terrainTags: { "rubble": 20, "increasingWeight": -5 }, 		movetags: ["ignorenoSP"], AI: "guard", followRange: 1, visionRadius: 4, movePoints: 1.5, 								maxhp: 1, defensetags: [], evasion: 0.5, 											attacktags: ["melee"], attackPoints: 2, attack: "Melee", attackWidth: 1, attackRange: 1, power: 3, dmgType: "pain" }, 
{name: "WitchShock", 		placetags: ["witch", "ElementsAnger", "elite", "miniboss"], minLevel: 3, weight: 10, terrainTags: { "secondhalf": 2, "lastthird": 1, "miniboss": -10, "Elements": 1 }, 																		maxhp: 14, defensetags: ["unflinching", "electricimmune", "glueweakness", "iceweakness"], 											spells: ["WitchElectrify"], spellCooldownMult: 1, spellCooldownMod: 0, castWhileMoving: true,									
		/* -- */																																movetags: ["opendoors", "closedoors"], AI: "hunt", visionRadius: 6, followRange: 2, movePoints: 2, 																											attacktags: ["leashing", "ranged"], attackPoints: 2, attack: "Spell", attackWidth: 1, attackRange: 1, power: 1, dmgType: "electric", 																				dropTable: [ {name: "Gold", amountMin: 30, amountMax: 50, weight: 5}, {name: "PotionMana", weight:3}, {name: "RedKey", weight: 3 }, {name: "GreenKey", weight: 2 }, {name: "BlueKey", weight: 2 }] }, 
{name: "WitchChain", 		placetags: ["witch", "MetalAnger", "elite", "miniboss"], minLevel: 5, weight: 6, terrainTags: { "secondhalf": 3, "lastthird": 3, "miniboss": -10, "Metal": 1 }, 																			maxhp: 14, defensetags: ["unflinching", "electricweakness", "meleeresist", "fireresist"], 											spells: ["WitchChainBolt"], spellCooldownMult: 2, spellCooldownMod: 2, 																								
		/* -- */																																movetags: ["opendoors", "closedoors"], AI: "hunt", visionRadius: 6, followRange: 1, movePoints: 3, 																											attacktags: ["leashing", "ranged"], attackPoints: 4, attack: "MeleeLockAllSpell", attackWidth: 1, attackRange: 1, power: 5, dmgType: "crush", 																		dropTable: [ {name: "Gold", amountMin: 30, amountMax: 50, weight: 5}, {name: "PotionMana", weight:3}, {name: "RedKey", weight: 3 }, {name: "GreenKey", weight: 2 }, {name: "BlueKey", weight: 2 }] }, 
{name: "WitchSlime", 		placetags: ["witch", "ConjureAnger", "elite", "miniboss"], minLevel: 4, weight: 4, terrainTags: { "secondhalf": 2, "lastthird": 1, "miniboss": -12, "open": 4, "Conjure": 1 }, 																maxhp: 10, defensetags: ["unflinching", "glueimmune", "fireimmune", "meleeresist", "electricweakness", "iceweakness"], 				spells: ["WitchSlimeBall", "WitchSlimeBall", "WitchSlime"], castWhileMoving: true, spellCooldownMult: 2, spellCooldownMod: 1,										
		/* -- */																																movetags: ["opendoors", "closedoors"], AI: "wander", visionRadius: 8, followRange: 4, movePoints: 3, 																										attacktags: ["leashing", "ranged"], attackPoints: 2, kite: 1.5, attack: "Spell", attackWidth: 1, attackRange: 1, power: 1, dmgType: "glue", 																		dropTable: [ {name: "Gold", amountMin: 30, amountMax: 50, weight: 5}, {name: "PotionMana", weight:3}, {name: "RedKey", weight: 3 }, {name: "GreenKey", weight: 2 }, {name: "BlueKey", weight: 2 }] }, 
{name: "WitchTentacles", 	placetags: ["witch", "DelightAnger", "elite", "miniboss"], minLevel: 9, weight: 6, terrainTags: { "secondhalf": 2, "lastthird": 1, "miniboss": -8, "Delight": 1 }, 																			maxhp: 13, defensetags: ["unflinching", "crushresist", "fireweakness", "electricweakness"], 										spells: ["SummonTentacles"], spellCooldownMult: 1, spellCooldownMod: 1,																								
		/* -- */																																movetags: ["opendoors", "closedoors"], AI: "hunt", visionRadius: 8, followRange: 3, movePoints: 3, 																											attacktags: ["leashing", "ranged"], attackPoints: 2, attack: "MeleeSpell", attackWidth: 1, attackRange: 1, power: 3, dmgType: "grope", fullBoundBonus: 2, 															dropTable: [ {name: "Gold", amountMin: 30, amountMax: 50, weight: 5}, {name: "PotionMana", weight:3}, {name: "RedKey", weight: 3 }, {name: "GreenKey", weight: 2 }, {name: "BlueKey", weight: 2 }] }, 
{name: "Mummy", 			placetags: ["mummy", "UndeadAnger", "elite"], minLevel: 5, weight: 11, terrainTags: { "secondhalf": 2, "lastthird": 2, "open": 2, "Undead": 1 }, 																							maxhp: 8, defensetags: ["iceresist", "meleeweakness"], 								attacktags: ["leashing", "ranged", "mummyRestraints"], attackPoints: 1, attack: "SpellMeleeWill", attackWidth: 1, attackRange: 1, power: 3, dmgType: "crush", fullBoundBonus: 3,																												
		/* -- */																																movetags: ["opendoors", "closedoors"], AI: "hunt", visionRadius: 7, followRange: 1, movePoints: 2, 																											specialCD: 3, specialAttack: "Bind", spells: ["MummyBolt"], minSpellRange: 1.5, spellCooldownMult: 1, spellCooldownMod: 5, 																							dropTable: [ {name: "Gold", amountMin: 30, amountMax: 60, weight: 11 }, {name: "PotionStamina", weight: 1 }, {name: "BlueKey", weight: 1 }] }, 
{name: "Necromancer", 		placetags: ["witch", "WillAnger", "elite", "miniboss"], minLevel: 1, weight: 6, terrainTags: { "secondhalf": 3, "lastthird": 3, "miniboss": -100, "Will": 1 }, 																				maxhp: 20, defensetags: ["unflinching", "meleeweakness"], 							attacktags: ["leashing", "ranged"], attackPoints: 3, attack: "MeleeLockAllSpell", attackWidth: 1, attackRange: 1, power: 5, dmgType: "cold", 																		dropTable: [ {name: "Gold", amountMin: 30, amountMax: 60, weight: 4 }, {name: "GreenKey", weight: 3 }, {name: "BlueKey", weight: 2 }], 																													
		/* -- */																																movetags: ["opendoors", "closedoors"], AI: "hunt", visionRadius: 10, followRange: 1, movePoints: 3, 																										spells: ["SummonSkeleton", "SummonSkeletons"], spellCooldownMult: 1, spellCooldownMod: 2 }, 
{name: "Cleric", 			placetags: ["bast", "IllusionAnger"], minLevel: 0, weight: 8, terrainTags: { "secondhalf": 2, "lastthird": 4, "passage": -99, "open": 4, "Illusion": 1 }, 																					maxhp: 8, defensetags: ["magicresist"], 											attacktags: ["leashing", "ranged"], attackPoints: 3, attack: "MeleeStun", attackWidth: 1, attackRange: 6, power: 3, fullBoundBonus: 3, dmgType: "crush", noCancelAttack: true, 										dropTable: [ {name: "Gold", amountMin: 10, amountMax: 30, weight: 11 }, {name: "PotionMana", weight: 1 }, {name: "RedKey", weight: 1 }],																													
		/* -- */																																movetags: ["opendoors", "closedoors"], AI: "guard", visionRadius: 7, followRange: 4, movePoints: 1 }, 
{name: "MeleeCleric", 		placetags: ["bast", "IllusionAnger"], minLevel: 0, weight: 10, terrainTags: { "secondhalf": 2, "lastthird": 2, "Illusion": 1 }, 																											maxhp: 8, defensetags: ["magicresist"], 											attacktags: ["leashing", "melee", "kittyRestraints"], attackPoints: 2, attack: "Melee", attackWidth: 1, attackRange: 1, power: 3, fullBoundBonus: 2, dmgType: "crush", specialCD: 3, specialAttack: "Bind", 		dropTable: [ {name: "Gold", amountMin: 10, amountMax: 30, weight: 11 }, {name: "PotionStamina", weight: 1 }, {name: "RedKey", weight: 1 }], /* --- */ 																																
		/* -- */																																movetags: ["opendoors", "closedoors"], AI: "hunt", visionRadius: 6, followRange: 1, blindSight: 4, movePoints: 2 }, 
{name: "Ninja", 			placetags: ["bast", "LatexAnger"], minLevel: 4, weight: 4, terrainTags: { "secondhalf": 3, "lastthird": 7, "Latex": 1 }, 																													maxhp: 12, defensetags: ["meleeweakness"], stealth: 1, evasion: 1, 					attacktags: ["leashing", "melee", "ropeRestraints", "ropeRestraints2"], attackPoints: 2, attack: "MeleeBind", attackWidth: 1, attackRange: 1, power: 2, dmgType: "slash", fullBoundBonus: 2, 						dropTable: [ {name: "Gold", amountMin: 50, amountMax: 80, weight: 3 }, {name: "Pick", weight: 2 }],																														
		/* -- */																																movetags: ["opendoors"], AI: "hunt", blindSight: 5, followRange: 1, visionRadius: 10, movePoints: 1, 																										specialAttack: "Stun", specialRemove: "Bind", specialCDonAttack: false, specialWidth: 1, specialRange: 4, specialMinrange: 1.5, stunTime: 4, specialCD: 8, specialCharges: 2 }, 
// Jailers 
{name: "Jailer", 			placetags: ["jailer", "minor"], minLevel: -1, weight: 0, terrainTags: { "jailer": 15 }, 							movetags: ["opendoors", "closedoors"], AI: "patrol", visionRadius: 7, keys: true, followRange: 1, movePoints: 1, 		maxhp: 12, defensetags: [], 														attacktags: ["leashing", "shackleRestraints"], attackPoints: 2, attack: "MeleeBindLockAll", attackWidth: 1, attackRange: 1, power: 2, dmgType: "crush", fullBoundBonus: 2, 											dropTable: [ {name: "Pick", weight: 10 }, {name: "RedKey", weight: 7 }, {name: "BlueKey", weight: 1 }] }, 
{name: "Guard", 			placetags: ["jailer", "minor"], minLevel: -1, weight: 0, terrainTags: {}, 											movetags: ["opendoors", "closedoors"], AI: "guard", keys: true, followRange: 1, visionRadius: 7, movePoints: 1, 		maxhp: 12, defensetags: [], 														attacktags: ["leashing", "shackleRestraints"], attackPoints: 2, attack: "MeleeBindLockAll", attackWidth: 1, attackRange: 1, power: 5, dmgType: "electric", fullBoundBonus: 3, 										dropTable: [ {name: "Pick", weight: 4 }, {name: "RedKey", weight: 1 }, {name: "Knife", weight: 2 }] },
// unused:
// Temple -- 3
// Mushroom -- 4
// Bellows -- 5
// Desert -- 6
// Ice -- 7
// Marble -- 8
// Ancient Lab -- 9
// Mansion -- 10

];

let KinkyDungeonSpawnJailers = 0;
let KinkyDungeonSpawnJailersMax = 5;
let KinkyDungeonLeashedPlayer = 0;
let KinkyDungeonLeashingEnemy = null;
let KinkyDungeonDoorShutTimer = 6;

function KinkyDungeonNearestPatrolPoint(x, y) {
	let dist = 100000;
	let point = -1;
	for (let p of KinkyDungeonPatrolPoints) {
		let d = Math.max(Math.abs(x - p.x), Math.abs(y - p.y));
		if (d < dist) {
			dist = d;
			point = KinkyDungeonPatrolPoints.indexOf(p);
		}
	}

	return point;
}

let KinkyDungeonFlags = {};

function KinkyDungeonSetFlag(Flag, Duration) {
	if (!KinkyDungeonFlags[Flag] || KinkyDungeonFlags[Flag] > 0) {
		KinkyDungeonFlags[Flag] = Duration;
	}
}

function KinkyDungeonUpdateFlags(delta) {
	for (let f of Object.keys(KinkyDungeonFlags)) {
		if (KinkyDungeonFlags[f] > 0)
			KinkyDungeonFlags[f] -= delta;
		else
			KinkyDungeonFlags[f] = undefined;
	}
}

function KinkyDungeonGetPatrolPoint(index, radius, Tiles) {
	let p = KinkyDungeonPatrolPoints[index];
	let t = Tiles ? Tiles : KinkyDungeonMovableTilesEnemy;
	if (p) {
		for (let i = 0; i < 8; i++) {
			let XX = p.x + Math.round(Math.random() * 2 * radius - radius);
			let YY = p.y + Math.round(Math.random() * 2 * radius - radius);
			if (t.includes(KinkyDungeonMapGet(XX, YY))) {
				return {
					x: XX,
					y: YY
				};
			}
		}
	}
	return p;
}

function KinkyDungeonNearestPlayer(enemy, requireVision, decoy) {
	if (decoy) {
		let pdist = Math.sqrt((KinkyDungeonPlayerEntity.x - enemy.x) * (KinkyDungeonPlayerEntity.x - enemy.x) + (KinkyDungeonPlayerEntity.y - enemy.y) * (KinkyDungeonPlayerEntity.y - enemy.y));
		let nearestVisible = undefined;
		let nearestDistance = !enemy.Enemy.allied ? pdist + 1 : 100000;

		for (let e of KinkyDungeonEntities) {
			if ((e.Enemy && e.Enemy.allied && (!enemy.Enemy || !enemy.Enemy.allied)) || (enemy.Enemy.allied && !e.Enemy.allied) || (enemy.rage && enemy != e)) {
				let dist = Math.sqrt((e.x - enemy.x) * (e.x - enemy.x) + (e.y - enemy.y) * (e.y - enemy.y));
				if (dist <= nearestDistance) {
					if (KinkyDungeonCheckLOS(enemy, e, dist, enemy.Enemy.visionRadius, true)) {
						if (enemy.rage || !e.Enemy.lowpriority || !KinkyDungeonCheckLOS(enemy, KinkyDungeonPlayerEntity, pdist, enemy.Enemy.visionRadius, true) || !KinkyDungeonCheckPath(enemy.x, enemy.y, e.x, e.y, false, true)) {
							nearestVisible = e;
							nearestDistance = dist;
						}
					}
				}
			}
		}

		if (nearestVisible)
			return nearestVisible;
	}
	return KinkyDungeonPlayerEntity;
}

function KinkyDungeonEnemyWeights(InJail, enemyTags, Floor) {
	// make generator tag weights
	let enemyWeights = [];

	for (let L = 0; L < KinkyDungeonEnemies.length; L++) {
		let enemy = KinkyDungeonEnemies[L];
		let effLevel = Floor + KinkyDungeonDifficulty / 5;
		let gen = false;
		let weightBonus = 0;
		let weightMulti = 1;
		let globalWeight = 0;
		for (let I = 0; I < enemyTags.length; I++) {
			if (enemy.placetags.includes(enemyTags[I].tag)) {
				gen = true;
				globalWeight += enemyTags[I].weight;
			}
		}
		if (KinkyDungeonSpawnJailers > 0 && enemy.placetags.includes("jailer")) {
			gen = true;
			globalWeight += (KinkyDungeonGoddessRep.Prisoner + 60);
			// base 10 add security level
		}
		for (let I = 0; I < KinkyDungeonShrineIndex.length; I++) {
			let shrine = KinkyDungeonShrineIndex[I].Type;
			let rep = KinkyDungeonGoddessRep[shrine];
			if (rep <= -10 && enemy.placetags.includes(shrine + "Anger")) {
				gen = true;
				globalWeight += (-rep);
				// base 10 add anger level
			}
			if (rep <= -25 && enemy.placetags.includes(shrine + "Rage")) {
				gen = true;
				globalWeight += (-rep);
				// base 25 add anger level
			}
			if (enemy.terrainTags[shrine] && rep) {
				if (rep > 0)
					weightMulti *= Math.max(0, 1.0 / (rep / 50));
				else if (rep < 0) {
					weightMulti *= Math.max(1, 1 + 1.0 / (-rep / 50));
					weightBonus += Math.min(10, -rep / 8);
					effLevel += -rep / 2;
				}
			}
		}
		if (gen && effLevel >= enemy.minLevel) {
			enemyWeights.push({
				enemy: enemy,
				localWeight: enemy.weight + weightBonus,
				weightMulti: weightMulti,
				globalWeight: globalWeight,
				totalWeight: 0
			});
		}
	}
	return enemyWeights;
}

function KinkyDungeonGetEnemy(enemyWeights, Floor, X, Y, miniboss, boss, jailerCount) {
	let tags = [];
	if (KinkyDungeonMapGet(X, Y) == 'R' || KinkyDungeonMapGet(X, Y) == 'r')
		tags.push("rubble");
	if (KinkyDungeonMapGet(X, Y) == 'D' || KinkyDungeonMapGet(X, Y) == 'd')
		tags.push("door");
	if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y)))
		tags.push("floor");
	if (KinkyDungeonMapGet(X, Y) == 'g')
		tags.push("grate");
	if (!KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X, Y + 1)) && !KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X, Y - 1)))
		tags.push("passage");
	else if (!KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X + 1, Y)) && !KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X - 1, Y)))
		tags.push("passage");
	else if (KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X + 1, Y + 1)) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X + 1, Y - 1)) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X - 1, Y + 1)) && KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X - 1, Y - 1)))
		tags.push("open");

	for (let XX = X - 1; XX <= X + 1; XX += 1)
		for (let YY = Y - 1; YY <= Y + 1; YY += 1)
			if (!(XX == X && YY == Y)) {
				if (KinkyDungeonMapGet(XX, YY) == '1' || KinkyDungeonMapGet(XX, YY) == 'X')
					tags.push("adjWall");
				if (KinkyDungeonMapGet(XX, YY) == 'D' || KinkyDungeonMapGet(XX, YY) == 'd')
					tags.push("adjDoor");
				if (KinkyDungeonMapGet(XX, YY) == 'D')
					tags.push("adjClosedDoor");
				if (KinkyDungeonMapGet(XX, YY) == 'c' || KinkyDungeonMapGet(XX, YY) == 'C')
					tags.push("adjChest");
				if (KinkyDungeonMapGet(XX, YY) == 'r' || KinkyDungeonMapGet(XX, YY) == 'R')
					tags.push("adjRubble");
			}

	if (Floor % 10 >= 5 || KinkyDungeonDifficulty > 20)
		tags.push("secondhalf");
	if (Floor % 10 >= 8 || KinkyDungeonDifficulty > 40)
		tags.push("lastthird");
	if (Floor % 10 >= 8 || KinkyDungeonDifficulty > 60)
		tags.push("lastthird");
	if (miniboss)
		tags.push("miniboss");
	if (boss)
		tags.push("boss");

	let enemyWeightTotal = 0;
	for (let I = 0; I < enemyWeights.length; I++) {
		let enemy = enemyWeights[I].enemy;
		let weight = enemyWeights[I].localWeight;
		enemyWeights[I].totalWeight = enemyWeightTotal;
		if (enemy.terrainTags.increasingWeight)
			weight += enemy.terrainTags.increasingWeight * MiniGameKinkyDungeonCheckpoint;
		for (let T = 0; T < tags.length; T++)
			if (enemy.terrainTags[tags[T]])
				weight += enemy.terrainTags[tags[T]];
		if (!enemy.terrainTags.grate && tags.includes("grate"))
			weight = 0;
		if (enemy.placetags.includes("spawnFloorsOnly") && !tags.includes("floor"))
			weight = 0;
		if (enemy.placetags.includes("jailer") && jailerCount >= KinkyDungeonSpawnJailersMax)
			weight = 0;
		if (weight > 0) {
			enemyWeightTotal += Math.max(0, weight * enemyWeights[I].globalWeight * enemyWeights[I].weightMulti);
		}
	}
	let selection = Math.random() * enemyWeightTotal;
	let L = 0;
	for (L = enemyWeights.length - 1; L >= 0; L--) {
		if (selection > enemyWeights[L].totalWeight) {
			break;
		}
	}
	return L;
}

// @ts-ignore
function KinkyDungeonPlaceEnemies(InJail, enemyTags, Floor, width, height) {
	//TODOPLACE
	// decide enemy counts
	let enemyTagWeights = 0;
	for (let I = 0; I < enemyTags.length; I++) {
		enemyTagWeights += enemyTags[I].weight;
	}
	let enemyCount = Math.round(enemyTagWeights * width * height / 1000 * Math.sqrt(1 + ((Floor + 9) % 10) / 10) * (Math.random() / 2 + Math.random() / 2 + 0.5) + KinkyDungeonDifficulty / 10);

	let enemyWeights = KinkyDungeonEnemyWeights(InJail, enemyTags, Floor)
	// tile variations
	KinkyDungeonEntities = [];

	let count = 0;
	let tries = 0;
	let miniboss = false;
	let boss = false;
	let jailerCount = 0;

	// Create this number of enemies
	while (count < enemyCount && tries < 1000) {
		let X = 1 + Math.floor(Math.random() * (width - 1));
		let Y = 1 + Math.floor(Math.random() * (height - 1));
		let playerDist = 6;
		let PlayerEntity = KinkyDungeonNearestPlayer({
			x: X,
			y: Y
		});

		if (Math.sqrt((X - PlayerEntity.x) * (X - PlayerEntity.x) + (Y - PlayerEntity.y) * (Y - PlayerEntity.y)) > playerDist && (!InJail || X > KinkyDungeonJailLeashX + 3) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(X, Y)) && KinkyDungeonNoEnemy(X, Y, true)) {

			let L = KinkyDungeonGetEnemy(enemyWeights, Floor, X, Y, miniboss, boss, jailerCount);

			if (L >= 0) {
				let Enemy = enemyWeights[L].enemy;
				if (Enemy && (!InJail || (Enemy.placetags.includes("jailer") || Enemy.placetags.includes("jail")))) {
					KinkyDungeonEntities.push({
						Enemy: Enemy,
						x: X,
						y: Y,
						hp: (Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp,
						movePoints: 0,
						attackPoints: 0
					});
					if (Enemy.placetags.includes("minor"))
						count += 0.2;
					else
						count += 1;
					// Minor enemies count as 1/5th of an enemy
					if (Enemy.placetags.includes("elite"))
						count += Math.max(1, 100 / (100 + KinkyDungeonDifficulty));
					// Elite enemies count as 2 normal enemies
					if (Enemy.placetags.includes("miniboss"))
						miniboss = true;
					// Adds miniboss as a tag
					if (Enemy.placetags.includes("boss"))
						boss = true;
					// Adds boss as a tag
					if (Enemy.placetags.includes("removeDoorSpawn") && KinkyDungeonMapGet(X, Y) == "d")
						KinkyDungeonMapSet(X, Y, '0');
					if (Enemy.placetags.includes("jailer"))
						jailerCount += 1;

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

	if (KinkyDungeonSpawnJailers > 0)
		KinkyDungeonSpawnJailers -= 1;
	if (KinkyDungeonSpawnJailers > 3 && KinkyDungeonSpawnJailers < KinkyDungeonSpawnJailersMax - 1)
		KinkyDungeonSpawnJailers -= 1;
	// Reduce twice as fast when you are in deep...

	KinkyDungeonCurrentMaxEnemies = KinkyDungeonEntities.length;
}

function KinkyDungeonSummonEnemy(x, y, summonType, count, rad, strict, lifetime) {
	let slots = [];
	for (let X = -Math.ceil(rad); X <= Math.ceil(rad); X++)
		for (let Y = -Math.ceil(rad); Y <= Math.ceil(rad); Y++) {
			if (Math.sqrt(X * X + Y * Y) <= rad) {
				slots.push({
					x: X,
					y: Y
				});
			}
		}

	let created = 0;
	let maxcounter = 0;
	let Enemy = KinkyDungeonEnemies.find(element=>element.name == summonType);
	for (let C = 0; C < count && KinkyDungeonEntities.length < 100 && maxcounter < count * 30; C++) {
		let slot = slots[Math.floor(Math.random() * slots.length)];
		if (KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(x + slot.x, y + slot.y)) && (KinkyDungeonNoEnemy(x + slot.x, y + slot.y, true) || Enemy.noblockplayer) && (!strict || KinkyDungeonCheckPath(x, y, x + slot.x, y + slot.y, false))) {
			KinkyDungeonEntities.push({
				summoned: true,
				Enemy: Enemy,
				x: x + slot.x,
				y: y + slot.y,
				hp: (Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp,
				movePoints: 0,
				attackPoints: 0,
				lifetime: lifetime
			});
			created += 1;
		} else
			C -= 1;
		maxcounter += 1;
	}
	return created;
}

function KinkyDungeonDrawEnemies(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		let enemy = KinkyDungeonEntities[E];
		let sprite = enemy.Enemy.name;
		KinkyDungeonUpdateVisualPosition(enemy, KinkyDungeonDrawDelta);
		let tx = enemy.visual_x;
		let ty = enemy.visual_y;
		let playerDist = Math.max(Math.abs(KinkyDungeonEntities[E].x - KinkyDungeonPlayerEntity.x), Math.abs(KinkyDungeonEntities[E].y - KinkyDungeonPlayerEntity.y));
		if (KinkyDungeonEntities[E].x >= CamX && KinkyDungeonEntities[E].y >= CamY && KinkyDungeonEntities[E].x < CamX + KinkyDungeonGridWidthDisplay && KinkyDungeonEntities[E].y < CamY + KinkyDungeonGridHeightDisplay) {
			if ((!enemy.Enemy.stealth || playerDist <= enemy.Enemy.stealth + 0.1) && !(KinkyDungeonGetBuffedStat(enemy.buffs, "Sneak") > 0)) {
				DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Enemies/" + sprite + ".png", KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize, (tx - CamX) * KinkyDungeonGridSizeDisplay, (ty - CamY) * KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);

				if (enemy.aware && enemy.vp > 0 && enemy.Enemy && enemy.Enemy.visionRadius > 1.6 && enemy.Enemy.movePoints < 90 && enemy.Enemy.AI != "ambush") {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Aware.png", KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize, (tx - CamX) * KinkyDungeonGridSizeDisplay, (ty - CamY) * KinkyDungeonGridSizeDisplay - KinkyDungeonGridSizeDisplay / 2, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (enemy.stun > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Stun.png", KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize, (tx - CamX) * KinkyDungeonGridSizeDisplay, (ty - CamY) * KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (enemy.bind > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Bind.png", KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize, (tx - CamX) * KinkyDungeonGridSizeDisplay, (ty - CamY) * KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (enemy.slow > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Slow.png", KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize, (tx - CamX) * KinkyDungeonGridSizeDisplay, (ty - CamY) * KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(enemy.buffs, "AttackDmg") > 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Buff.png", KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize, (tx - CamX) * KinkyDungeonGridSizeDisplay, (ty - CamY) * KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
				if (KinkyDungeonGetBuffedStat(enemy.buffs, "AttackDmg") < 0) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Debuff.png", KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize, (tx - CamX) * KinkyDungeonGridSizeDisplay, (ty - CamY) * KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
			}
			if (enemy.freeze > 0) {
				DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Conditions/Freeze.png", KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize, (tx - CamX) * KinkyDungeonGridSizeDisplay, (ty - CamY) * KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
			}
		}
	}
}

function KinkyDungeonDrawEnemiesWarning(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		var enemy = KinkyDungeonEntities[E];
		if (enemy.warningTiles) {
			for (let T = 0; T < enemy.warningTiles.length; T++) {
				var tx = enemy.x + enemy.warningTiles[T].x;
				var ty = enemy.y + enemy.warningTiles[T].y;
				if (tx >= CamX && ty >= CamY && tx < CamX + KinkyDungeonGridWidthDisplay && ty < CamY + KinkyDungeonGridHeightDisplay && !(tx == enemy.x && ty == enemy.y) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(tx, ty))) {
					DrawImageZoomCanvas(KinkyDungeonRootDirectory + ((enemy.Enemy && enemy.Enemy.allied) ? "WarningAlly.png" : "Warning.png"), KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize, (tx - CamX) * KinkyDungeonGridSizeDisplay, (ty - CamY) * KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, false);
				}
			}
		}
	}
}

function KinkyDungeonBar(x, y, w, h, value, foreground="#66FF66", background="red") {
	if (value < 0)
		value = 0;
	if (value > 100)
		value = 100;
	DrawRect(x + 2, y + 2, Math.floor((w - 4) * value / 100), h - 4, foreground);
	DrawRect(Math.floor(x + 2 + (w - 4) * value / 100), y + 2, Math.floor((w - 4) * (100 - value) / 100), h - 4, background);
}

function KinkyDungeonDrawEnemiesHP(canvasOffsetX, canvasOffsetY, CamX, CamY) {
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		var enemy = KinkyDungeonEntities[E];
		let playerDist = Math.max(Math.abs(KinkyDungeonEntities[E].x - KinkyDungeonPlayerEntity.x), Math.abs(KinkyDungeonEntities[E].y - KinkyDungeonPlayerEntity.y));
		if ((!enemy.Enemy.stealth || playerDist <= enemy.Enemy.stealth + 0.1) && !(KinkyDungeonGetBuffedStat(enemy.buffs, "Sneak") > 0) && (enemy.Enemy.allied || (enemy.hp < enemy.Enemy.maxhp && KinkyDungeonLightGet(enemy.x, enemy.y) > 0))) {
			let xx = enemy.visual_x ? enemy.visual_x : enemy.x;
			let yy = enemy.visual_y ? enemy.visual_y : enemy.y;
			KinkyDungeonBar(canvasOffsetX + (xx - CamX) * KinkyDungeonGridSizeDisplay, canvasOffsetY + (yy - CamY) * KinkyDungeonGridSizeDisplay, KinkyDungeonGridSizeDisplay, 12, enemy.hp / enemy.Enemy.maxhp * 100, enemy.Enemy.allied ? "#00ff88" : "#ff0000", enemy.Enemy.allied ? "#aa0000" : "#000000");
		}
	}
}

function KinkyDungeonEnemyCheckHP(enemy, E) {
	if (enemy.hp <= 0) {
		KinkyDungeonEntities.splice(E, 1);
		if (enemy == KinkyDungeonKilledEnemy) {

			KinkyDungeonSendMessage(6, TextGet("Kill" + enemy.Enemy.name), "orange", 1);
			KinkyDungeonKilledEnemy = null;
		}
		if (enemy.Enemy && enemy.Enemy.maxhp)
			KinkyDungeonChangeRep("Ghost", -Math.max(5, 0.05 * enemy.Enemy.maxhp));

		if (enemy.Enemy && enemy.Enemy.ondeath) {
			for (let o of enemy.Enemy.ondeath) {
				if (o.type == "summon") {
					KinkyDungeonSummonEnemy(enemy.x, enemy.y, o.enemy, o.count, o.range, o.strict);
				}
			}
		}
		KinkyDungeonItemDrop(enemy.x, enemy.y, enemy.Enemy.dropTable);
		return true;
	}
	return false;
}

function KinkyDungeonCheckLOS(enemy, player, distance, maxdistance, allowBlind) {
	let bs = (enemy && enemy.Enemy && enemy.Enemy.blindSight) ? enemy.Enemy.blindSight : 0;
	if (player.player && enemy.Enemy && enemy.Enemy.playerBlindSight)
		bs = enemy.Enemy.playerBlindSight;
	return distance <= maxdistance && ((allowBlind && bs >= distance) || KinkyDungeonCheckPath(enemy.x, enemy.y, player.x, player.y, allowBlind));
}

function KinkyDungeonTrackSneak(enemy, delta, player) {
	if (!enemy.vp)
		enemy.vp = 0;
	let sneakThreshold = enemy.Enemy.sneakThreshold ? enemy.Enemy.sneakThreshold : 2;
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak"))
		sneakThreshold += KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Sneak");
	if (!player.player)
		return true;
	enemy.vp = Math.min(sneakThreshold * 2, enemy.vp + delta);
	return (enemy.vp > sneakThreshold);
}

function KinkyDungeonMultiplicativeStat(Stat) {
	if (Stat > 0) {
		return 1 / (1 + Stat);
	}
	if (Stat < 0) {
		return 1 - Stat;
	}

	return 1;
}

let KinkyDungeonDamageTaken = false;

function KinkyDungeonUpdateEnemies(delta) {
	if (KinkyDungeonLeashedPlayer > 0) {
		KinkyDungeonLeashedPlayer -= 1;

		let xx = KinkyDungeonStartPosition.x + KinkyDungeonJailLeashX;
		let yy = KinkyDungeonStartPosition.y;
		if (KinkyDungeonTiles[(xx - 1) + "," + yy] && KinkyDungeonTiles[(xx - 1) + "," + yy].Type == "Door") {
			KinkyDungeonTiles[(xx - 1) + "," + yy].Lock = undefined;
		}
	}
	KinkyDungeonUpdateFlags(delta);
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		let enemy = KinkyDungeonEntities[E];
		let player = KinkyDungeonNearestPlayer(enemy, false, true);

		// Delete the enemy
		if (KinkyDungeonEnemyCheckHP(enemy, E)) {
			E -= 1;
			continue;
		}

		if (!enemy.castCooldown)
			enemy.castCooldown = 0;
		if (enemy.castCooldown > 0)
			enemy.castCooldown = Math.max(0, enemy.castCooldown - delta);

		let idle = true;
		let moved = false;
		let ignore = false;
		let followRange = enemy.Enemy.followRange;
		let chaseRadius = Math.max(enemy.Enemy.visionRange * 2, enemy.Enemy.blindSight * 2);
		let ignoreLocks = enemy.Enemy.keys;

		// Check if the enemy ignores the player
		if (player.player) {
			if (enemy.Enemy.movetags.includes("ignorenoSP") && !KinkyDungeonHasStamina(1.1))
				ignore = true;
			if (enemy.Enemy.movetags.includes("ignoreharmless") && (!enemy.warningTiles || enemy.warningTiles.length == 0) && (KinkyDungeonPlayerDamage.dmg <= enemy.Enemy.armor || !KinkyDungeonHasStamina(1.1)) && !KinkyDungeonPlayer.CanTalk() && !KinkyDungeonPlayer.CanInteract() && KinkyDungeonActions.Move.Time > 2 && (!enemy.Enemy.ignorechance || Math.random() < enemy.Enemy.ignorechance || !KinkyDungeonHasStamina(1.1)))
				ignore = true;
			if (enemy.Enemy.movetags.includes("ignoretiedup") && (!enemy.warningTiles || enemy.warningTiles.length == 0) && !KinkyDungeonPlayer.CanInteract() && !KinkyDungeonPlayer.CanTalk() && !KinkyDungeonPlayer.CanInteract() && KinkyDungeonActions.Move.Time > 2 && (!enemy.Enemy.ignorechance || Math.random() < enemy.Enemy.ignorechance || !KinkyDungeonHasStamina(1.1)))
				ignore = true;
			if (enemy.Enemy.movetags.includes("ignoreboundhands") && (!enemy.warningTiles || enemy.warningTiles.length == 0) && (KinkyDungeonPlayerDamage.dmg <= enemy.Enemy.armor || !KinkyDungeonHasStamina(1.1)) && !KinkyDungeonPlayer.CanInteract() && (!enemy.Enemy.ignorechance || Math.random() < enemy.Enemy.ignorechance || !KinkyDungeonHasStamina(1.1)))
				ignore = true;
			if (enemy.Enemy.ignoreflag) {
				for (let f of enemy.Enemy.ignoreflag) {
					if (KinkyDungeonFlags[f])
						ignore = true;
				}
			}
			if (enemy.Enemy.placetags.includes("jailer") && !KinkyDungeonJailTransgressed)
				ignore = true;
		}

		let MovableTiles = KinkyDungeonMovableTilesEnemy;
		let AvoidTiles = "g";
		if (enemy.Enemy.movetags && enemy.Enemy.movetags.includes("opendoors"))
			MovableTiles = KinkyDungeonMovableTilesSmartEnemy;
		if (enemy.Enemy.ethereal) {
			AvoidTiles = "";
			MovableTiles = MovableTiles + "1X";
		}

		if (enemy.Enemy.specialCharges && enemy.specialCharges <= 0)
			enemy.specialCD = 999;
		if (enemy.specialCD > 0)
			enemy.specialCD -= delta;
		if (enemy.slow > 0)
			enemy.slow -= delta;
		if (enemy.bind > 0)
			enemy.bind -= delta;
		if (enemy.stun > 0 || enemy.freeze > 0) {
			if (enemy.stun > 0)
				enemy.stun -= delta;
			if (enemy.freeze > 0)
				enemy.freeze -= delta;
		} else {
			let attack = enemy.Enemy.attack;
			let usingSpecial = false;
			let range = enemy.Enemy.attackRange;
			let width = enemy.Enemy.attackWidth;

			if (enemy.Enemy.attacktags && enemy.Enemy.attacktags.includes("leashing") && !KinkyDungeonHasStamina(1.1)) {
				followRange = 1;
				if (!attack.includes("Bind"))
					attack = "Bind" + attack;
			}

			let hitsfx = (enemy.Enemy && enemy.Enemy.hitsfx) ? enemy.Enemy.hitsfx : "";
			let playerDist = Math.sqrt((enemy.x - player.x) * (enemy.x - player.x) + (enemy.y - player.y) * (enemy.y - player.y));
			if (KinkyDungeonAlert && playerDist < KinkyDungeonAlert)
				enemy.aware = true;
			if (enemy.Enemy.specialAttack && (!enemy.specialCD || enemy.specialCD <= 0) && (!enemy.Enemy.specialMinrange || playerDist > enemy.Enemy.specialMinrange)) {
				attack = attack + enemy.Enemy.specialAttack;
				usingSpecial = true;
				if (enemy.Enemy && enemy.Enemy.hitsfxSpecial)
					hitsfx = enemy.Enemy.hitsfxSpecial;

				if (enemy.Enemy.specialRemove)
					attack = attack.replace(enemy.Enemy.specialRemove, "");
				if (enemy.Enemy.specialRange && usingSpecial) {
					range = enemy.Enemy.specialRange;
				}
				if (enemy.Enemy.specialWidth && usingSpecial) {
					width = enemy.Enemy.specialWidth;
				}
			}

			if (!enemy.Enemy.attackWhileMoving && range > followRange) {
				followRange = range;
			}
			if (player.player && enemy.Enemy && enemy.Enemy.playerFollowRange)
				followRange = enemy.Enemy.playerFollowRange;

			var AI = enemy.Enemy.AI;
			if (!enemy.warningTiles)
				enemy.warningTiles = [];
			let canSensePlayer = KinkyDungeonCheckLOS(enemy, player, playerDist, enemy.Enemy.visionRadius, true);
			let canSeePlayer = KinkyDungeonCheckLOS(enemy, player, playerDist, enemy.Enemy.visionRadius, false);

			if (canSeePlayer && enemy.Enemy.placetags.includes("jailer") && (KinkyDungeonPlayer.CanInteract() || (Math.abs(player.x - KinkyDungeonStartPosition.x) >= KinkyDungeonJailLeashX - 1 || Math.abs(player.y - KinkyDungeonStartPosition.y) > KinkyDungeonJailLeash))) {
				KinkyDungeonJailTransgressed = true;
				ignore = false;
			}

			if ((canSensePlayer || canSeePlayer) && KinkyDungeonTrackSneak(enemy, delta, player))
				enemy.aware = true;

			let kite = false;
			if (canSeePlayer && enemy.Enemy && enemy.Enemy.kite && !usingSpecial && (enemy.attackPoints <= 0 || enemy.Enemy.attackWhileMoving) && playerDist <= enemy.Enemy.kite && (!enemy.Enemy.allied || !player.player)) {
				kite = true;
			}

			if (AI == "wander") {
				idle = true;
				if (ignore || !KinkyDungeonCheckLOS(enemy, player, playerDist, followRange + 0.5, true || kite))
					for (let T = 0; T < 8; T++) {
						// try 8 times
						let dir = KinkyDungeonGetDirection(10 * (Math.random() - 0.5), 10 * (Math.random() - 0.5));
						if (MovableTiles.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y)) && (T > 5 || !AvoidTiles.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y))) && KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, true)) {
							if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y))
								moved = true;
							idle = false;
							break;
						}
					}
			} else if ((AI == "guard" || AI == "patrol" || (AI == "ambush" && !enemy.ambushtrigger)) && (enemy.Enemy.attackWhileMoving || ignore || !KinkyDungeonCheckLOS(enemy, player, playerDist, followRange + 0.5, true) || kite)) {
				if (!enemy.gx)
					enemy.gx = enemy.x;
				if (!enemy.gy)
					enemy.gy = enemy.y;

				idle = true;
				let patrolChange = false;

				// try 12 times to find a moveable tile, with some random variance
				if (!ignore && (playerDist <= enemy.Enemy.visionRadius || (enemy.aware && playerDist <= chaseRadius * 2)) && AI != "ambush" && (enemy.aware || canSensePlayer)) {
					if (!enemy.aware)
						enemy.path = undefined;
					enemy.aware = true;
					for (let T = 0; T < 12; T++) {
						let dir = kite ? KinkyDungeonGetDirectionRandom(enemy.x - player.x, enemy.y - player.y) : KinkyDungeonGetDirectionRandom(player.x - enemy.x, player.y - enemy.y);
						let splice = false;
						if (T > 2 && T < 8)
							dir = KinkyDungeonGetDirectionRandom(dir.x * 10, dir.y * 10);
						// Fan out a bit
						if (T >= 8 || enemy.path || !canSeePlayer) {
							if (!enemy.path && (KinkyDungeonAlert || enemy.aware || canSeePlayer))
								enemy.path = KinkyDungeonFindPath(enemy.x, enemy.y, player.x, player.y, true, false, ignoreLocks, MovableTiles);
							// Give up and pathfind
							if (enemy.path && enemy.path.length > 0) {
								dir = {
									x: enemy.path[0].x - enemy.x,
									y: enemy.path[0].y - enemy.y,
									delta: 1
								};
								if (!KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, false))
									enemy.path = undefined;
								splice = true;
							} else {
								enemy.path = undefined;
								enemy.aware = false;
								//dir = KinkyDungeonGetDirectionRandom(0, 0); // Random...
							}
						}
						if (KinkyDungeonEnemyCanMove(enemy, dir, MovableTiles, AvoidTiles, ignoreLocks, T)) {
							if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y))
								moved = true;
							if (moved && splice && enemy.path)
								enemy.path.splice(0, 1);
							idle = false;
							break;
						}
					}
				} else if (Math.abs(enemy.x - enemy.gx) > 0 || Math.abs(enemy.y - enemy.gy) > 0) {
					if (enemy.aware)
						enemy.path = undefined;
					enemy.aware = false;
					for (let T = 0; T < 8; T++) {
						let dir = KinkyDungeonGetDirectionRandom(enemy.gx - enemy.x, enemy.gy - enemy.y);
						let splice = false;
						if (T > 2 && T < 8)
							dir = KinkyDungeonGetDirectionRandom(dir.x * 10, dir.y * 10);
						// Fan out a bit
						if (T >= 8 || enemy.path || !KinkyDungeonCheckPath(enemy.x, enemy.y, enemy.gx, enemy.gy)) {
							if (!enemy.path)
								enemy.path = KinkyDungeonFindPath(enemy.x, enemy.y, enemy.gx, enemy.gy, true, false, ignoreLocks, MovableTiles);
							// Give up and pathfind
							if (enemy.path && enemy.path.length > 0) {
								dir = {
									x: enemy.path[0].x - enemy.x,
									y: enemy.path[0].y - enemy.y,
									delta: 1
								};
								if (!KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, false))
									enemy.path = undefined;
								splice = true;
							} else {
								enemy.path = undefined;
							}
						}
						if (KinkyDungeonEnemyCanMove(enemy, dir, MovableTiles, AvoidTiles, ignoreLocks, T)) {
							if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y))
								moved = true;
							if (moved && splice && enemy.path)
								enemy.path.splice(0, 1);
							idle = false;
							break;
						}
					}
				} else
					patrolChange = true;

				if (AI == "patrol") {
					let patrolChance = patrolChange ? 0.2 : 0.02;
					if (!enemy.patrolIndex)
						enemy.patrolIndex = KinkyDungeonNearestPatrolPoint(enemy.x, enemy.y);
					if (KinkyDungeonPatrolPoints[enemy.patrolIndex] && Math.random() < patrolChance) {
						if (enemy.patrolIndex < KinkyDungeonPatrolPoints.length - 1)
							enemy.patrolIndex += 1;
						else
							enemy.patrolIndex = 0;

						let newPoint = KinkyDungeonGetPatrolPoint(enemy.patrolIndex, 1.4, MovableTiles);
						enemy.gx = newPoint.x;
						enemy.gy = newPoint.y;
					}

				}

			} else if ((AI == "hunt" || (AI == "ambush" && enemy.ambushtrigger)) && (enemy.Enemy.attackWhileMoving || ignore || !KinkyDungeonCheckLOS(enemy, player, playerDist, followRange + 0.5, true) || kite)) {

				idle = true;
				// try 12 times to find a moveable tile, with some random variance
				if (!ignore && (playerDist <= enemy.Enemy.visionRadius || (enemy.aware && playerDist <= chaseRadius * 2)) && (enemy.aware || canSensePlayer)) {
					if (!enemy.aware)
						enemy.path = undefined;
					enemy.aware = true;
					for (let T = 0; T < 12; T++) {
						let dir = kite ? KinkyDungeonGetDirectionRandom(enemy.x - player.x, enemy.y - player.y) : KinkyDungeonGetDirectionRandom(player.x - enemy.x, player.y - enemy.y);
						let splice = false;
						if (T > 2 && T < 8)
							dir = KinkyDungeonGetDirectionRandom(dir.x * 10, dir.y * 10);
						// Fan out a bit
						if (T >= 8 || enemy.path || !canSeePlayer) {
							if (!enemy.path && (KinkyDungeonAlert || enemy.aware || canSeePlayer))
								enemy.path = KinkyDungeonFindPath(enemy.x, enemy.y, player.x, player.y, true, false, ignoreLocks, MovableTiles);
							// Give up and pathfind
							if (enemy.path && enemy.path.length > 0) {
								dir = {
									x: enemy.path[0].x - enemy.x,
									y: enemy.path[0].y - enemy.y,
									delta: 1
								};
								if (!KinkyDungeonNoEnemy(enemy.x + dir.x, enemy.y + dir.y, false))
									enemy.path = undefined;
								splice = true;
							} else {
								enemy.path = undefined;
								enemy.aware = false;
								//dir = KinkyDungeonGetDirectionRandom(0, 0); // Random...
							}
						}
						if (KinkyDungeonEnemyCanMove(enemy, dir, MovableTiles, AvoidTiles, ignoreLocks, T)) {
							if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y))
								moved = true;
							if (moved && splice && enemy.path)
								enemy.path.splice(0, 1);
							idle = false;
							break;
						}
					}
				} else {
					if (enemy.aware)
						enemy.path = undefined;
					enemy.aware = false;
					for (let T = 0; T < 8; T++) {
						// try 8 times
						let dir = KinkyDungeonGetDirection(10 * (Math.random() - 0.5), 10 * (Math.random() - 0.5));
						if (KinkyDungeonEnemyCanMove(enemy, dir, MovableTiles, AvoidTiles, ignoreLocks, T)) {
							if (KinkyDungeonEnemyTryMove(enemy, dir, delta, enemy.x + dir.x, enemy.y + dir.y))
								moved = true;
							idle = false;
							break;
						}
					}
				}
			}

			playerDist = Math.sqrt((enemy.x - player.x) * (enemy.x - player.x) + (enemy.y - player.y) * (enemy.y - player.y));
			if (  (!enemy.Enemy.allied || (!player.player && (!player.Enemy || !player.Enemy.allied)))   &&   ((enemy.aware && KinkyDungeonTrackSneak(enemy, 0, player)) || playerDist < Math.max(1.5, enemy.Enemy.blindSight))
				&&   (AI != "ambush" || enemy.ambushtrigger)   &&   !ignore   &&   (!moved || enemy.Enemy.attackWhileMoving)   &&   (attack.includes("Melee") || (enemy.Enemy.attacktags && enemy.Enemy.attacktags.includes("leashing") && !KinkyDungeonHasStamina(1.1)))
				&&   KinkyDungeonCheckLOS(enemy, player, playerDist, range + 0.5, true)   &&   KinkyDungeonGetBuffedStat(enemy.buffs, "Disarm") <= 0   ) {
				//Player is adjacent
				idle = false;

				let dir = KinkyDungeonGetDirection(player.x - enemy.x, player.y - enemy.y);

				let attackTiles = enemy.warningTiles ? enemy.warningTiles : [dir];

				if (!KinkyDungeonEnemyTryAttack(enemy, player, attackTiles, delta, enemy.x + dir.x, enemy.y + dir.y, (usingSpecial && enemy.Enemy.specialAttackPoints) ? enemy.Enemy.specialAttackPoints : enemy.Enemy.attackPoints)) {
					if (enemy.warningTiles.length == 0) {
						enemy.warningTiles = KinkyDungeonGetWarningTiles(player.x - enemy.x, player.y - enemy.y, range, width);
						if (enemy.Enemy.specialRange && usingSpecial && enemy.Enemy.specialCDonAttack) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
						if (enemy.Enemy.specialWidth && usingSpecial && enemy.Enemy.specialCDonAttack) {
							enemy.specialCD = enemy.Enemy.specialCD;
						}
					}

					let playerEvasion = (player.player) ? KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Evasion")) : KinkyDungeonMultiplicativeStat(((player.Enemy && player.Enemy.evasion) ? player.Enemy.evasion : 0)) * KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(player.buffs, "Evasion"));
					if (attack.includes("Bind") && Math.random() <= playerEvasion) {
						let caught = false;
						for (let W = 0; W < enemy.warningTiles.length; W++) {
							let tile = enemy.warningTiles[W];
							if (enemy.x + tile.x == player.x && enemy.y + tile.y == player.y) {
								caught = true;
								break;
							}
						}
						if (caught) {
							let harnessChance = 0;
							for (let restraint of KinkyDungeonRestraintList()) {
								if (restraint.restraint && restraint.restraint.harness)
									harnessChance += 1;
							}

							if (harnessChance > 0) {
								let roll = Math.random();
								for (let T = 0; T < harnessChance; T++) {
									roll = Math.max(roll, Math.random());
								}
								if (roll > KinkyDungeonTorsoGrabChance) {
									KinkyDungeonPlayerFreeze(1);

									KinkyDungeonSendMessage(6, TextGet("KinkyDungeonTorsoGrab").replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 1);
								}
							}
						}
					}
				} else {
					// Attack lands!
					let hit = ((usingSpecial && enemy.Enemy.specialAttackPoints) ? enemy.Enemy.specialAttackPoints : enemy.Enemy.attackPoints) <= 1;
					for (let W = 0; W < enemy.warningTiles.length; W++) {
						let tile = enemy.warningTiles[W];
						if (enemy.x + tile.x == player.x && enemy.y + tile.y == player.y) {
							hit = true;
							break;
						}
					}

					let playerEvasion = (player.player) ? KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Evasion")) : KinkyDungeonMultiplicativeStat(((player.Enemy && player.Enemy.evasion) ? player.Enemy.evasion : 0)) * KinkyDungeonMultiplicativeStat(KinkyDungeonGetBuffedStat(player.buffs, "Evasion"));
					if (hit && Math.random() > playerEvasion) {
						KinkyDungeonSendMessage(5, TextGet("KinkyDungeonAttackMiss").replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "lightgreen", 1);
						hit = false;
					}
					if (hit) {
						let replace = [];
						let restraintAdd = [];
						let Damage = enemy.Enemy.power;
						let msgColor = "yellow";
						let Locked = false;
						let Stun = false;
						let priorityBonus = 0;
						let addedRestraint = false;
						let resistRestraint = false;

						if (attack.includes("Lock") && KinkyDungeonPlayerGetLockableRestraints().length > 0) {
							let Lockable = KinkyDungeonPlayerGetLockableRestraints();
							let Lstart = 0;
							let Lmax = Lockable.length - 1;
							if (!enemy.Enemy.attack.includes("LockAll")) {
								Lstart = Math.floor(Lmax * Math.random());
								// Lock one at random
							}
							for (let L = Lstart; L <= Lmax; L++) {
								KinkyDungeonLock(Lockable[L], KinkyDungeonGenerateLock(true));
								// Lock it!
								priorityBonus += Lockable[L].restraint.power;
							}
							Locked = true;
							if (usingSpecial && Locked && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Lock"))
								enemy.specialCD = enemy.Enemy.specialCD;
						} else if (attack.includes("Bind")) {
							let numTimes = 1;
							if (enemy.Enemy.multiBind)
								numTimes = enemy.Enemy.multiBind;
							if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "ResistRestraint")) {
								let rr = KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "ResistRestraint");
								KinkyDungeonDecreaseBuffStat(KinkyDungeonPlayerBuffs, "ResistRestraint", numTimes);
								numTimes = Math.max(0, numTimes - rr);
								resistRestraint = true;
							}
							
							for (let times = 0; times < numTimes; times++) {
								// Note that higher power enemies get a bonus to the floor restraints appear on
								let rest = KinkyDungeonGetRestraint(enemy.Enemy, MiniGameKinkyDungeonCheckpoint + enemy.Enemy.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
								if (rest) {
									replace.push({
										keyword: "RestraintAdded",
										value: TextGet("Restraint" + rest.name)
									});
									restraintAdd.push(rest);
									addedRestraint = true;
								}
							}
							if (usingSpecial && addedRestraint && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Bind"))
								enemy.specialCD = enemy.Enemy.specialCD;
							if (!addedRestraint && enemy.Enemy.fullBoundBonus) {
								Damage += enemy.Enemy.fullBoundBonus;
								// Some enemies deal bonus damage if they cannot put a binding on you
							}
						}

						if (attack.includes("Suicide") && (!enemy.Enemy.suicideOnAdd || addedRestraint)) {
							enemy.hp = 0;
						}
						if (player.player && playerDist < 1.5 && (enemy.Enemy.attacktags && enemy.Enemy.attacktags.includes("leashing") || attack.includes("Pull")) && (KinkyDungeonLeashedPlayer < 1 || KinkyDungeonLeashingEnemy == enemy)) {
							let leashed = attack.includes("Pull");
							if (!leashed)
								for (let restraint of KinkyDungeonRestraintList()) {
									if (restraint.restraint && restraint.restraint.leash) {
										leashed = true;
										break;
									}
								}
							if (leashed) {
								let leashPos = KinkyDungeonStartPosition;
								let findMaster = undefined;
								if (attack.includes("Pull") && enemy.Enemy.master) {
									let masterDist = 1000;
									for (let e of KinkyDungeonEntities) {
										if (e.Enemy.name == enemy.Enemy.master.type && Math.sqrt((e.x - enemy.x) * (e.x - enemy.x) + (e.y - enemy.y) * (e.y - enemy.y)) < masterDist) {
											masterDist = Math.sqrt((e.x - enemy.x) * (e.x - enemy.x) + (e.y - enemy.y) * (e.y - enemy.y));
											findMaster = e;
										}
									}
									if (findMaster)
										leashPos = {
											x: findMaster.x,
											y: findMaster.y
										};
								}
								if (leashPos == KinkyDungeonStartPosition && !KinkyDungeonHasStamina(1.1) && Math.abs(KinkyDungeonPlayerEntity.x - leashPos.x) <= 1 && Math.abs(KinkyDungeonPlayerEntity.y - leashPos.y) <= 1) {
									KinkyDungeonDefeat();
									KinkyDungeonLeashedPlayer = 3 + enemy.Enemy.attackPoints * 2;
									KinkyDungeonLeashingEnemy = enemy;
								} else if (Math.abs(KinkyDungeonPlayerEntity.x - leashPos.x) > 1.5 || Math.abs(KinkyDungeonPlayerEntity.y - leashPos.y) > 1.5 && (!findMaster || !(findMaster.x == leashPos.x && findMaster.y == leashPos.y))) {
									if (!KinkyDungeonHasStamina(1.1))
										KinkyDungeonPlayerFreeze(2);
									// Leash pullback
									let path = KinkyDungeonFindPath(enemy.x, enemy.y, leashPos.x, leashPos.y, false, false, ignoreLocks, KinkyDungeonMovableTiles);
									if (path && path.length > 0) {
										let leashPoint = path[0];
										let enemySwap = KinkyDungeonEnemyAt(leashPoint.x, leashPoint.y);
										if (!enemySwap || !enemySwap.Enemy.noDisplace) {
											KinkyDungeonLeashedPlayer = 3 + enemy.Enemy.attackPoints * 2;
											KinkyDungeonLeashingEnemy = enemy;
											if (enemySwap) {
												enemySwap.x = KinkyDungeonPlayerEntity.x;
												enemySwap.y = KinkyDungeonPlayerEntity.y;
											}
											KinkyDungeonMoveTo(enemy.x, enemy.y);
											enemy.x = leashPoint.x;
											enemy.y = leashPoint.y;
											if (KinkyDungeonMapGet(enemy.x, enemy.y) == 'D') {
												KinkyDungeonMapSet(enemy.x, enemy.y, 'd');
												if (KinkyDungeonTiles[enemy.x + ',' + enemy.y] && KinkyDungeonTiles[enemy.x + ',' + enemy.y].Type == "Door")
													KinkyDungeonTiles[enemy.x + ',' + enemy.y].Lock = undefined;
											}
											KinkyDungeonSendMessage(6, TextGet("KinkyDungeonLeashGrab").replace("EnemyName", TextGet("Name" + enemy.Enemy.name)), "yellow", 1);
										}
									}
								}
							}
						}
						Damage += KinkyDungeonGetBuffedStat(enemy.buffs, "AttackDmg");
						if (Damage > 0) {
							replace.push({
								keyword: "DamageTaken",
								value: Damage
							});
							msgColor = "#ff8888";
							if (usingSpecial && enemy.Enemy.specialAttack)
								enemy.specialCD = enemy.Enemy.specialCD;
						}
						var happened = 0;
						var bound = 0;
						if (player.player) {
							happened += KinkyDungeonDealDamage({
								damage: Damage,
								type: enemy.Enemy.dmgType
							});
							for (let r of restraintAdd) {
								bound += KinkyDungeonAddRestraint(r, enemy.Enemy.power) * 2;
							}
							if (KinkyDungeonGetBuffedStat(enemy.buffs, "Curse")) {
								for (let r of restraintAdd) {
									KinkyDungeonCurseRestraint(KinkyDungeonGetRestraintItem(r.Group));
								}
							}
							if (attack.includes("Slow")) {
								KinkyDungeonPlayerSlow(1, 5);
								if (usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Slow"))
									enemy.specialCD = enemy.Enemy.specialCD;
								happened += 1;
							}
							if (attack.includes("Stun")) {
								let time = enemy.Enemy.stunTime ? enemy.Enemy.stunTime : 1;
								KinkyDungeonPlayerStun(time);
								if (usingSpecial && enemy.Enemy.specialAttack && enemy.Enemy.specialAttack.includes("Stun"))
									enemy.specialCD = enemy.Enemy.specialCD;
								happened += 1;
								priorityBonus += 3 * time;
								Stun = true;
							}
							happened += bound;
						} else if (Math.random() <= playerEvasion) {
							if (enemy.Enemy.fullBoundBonus) {
								Damage += enemy.Enemy.fullBoundBonus;
								// Some enemies deal bonus damage if they cannot put a binding on you
							}
							happened += KinkyDungeonDamageEnemy(player, {
								type: enemy.Enemy.dmgType,
								damage: Damage
							}, false, true);
							if (happened > 0) {
								let sfx = (hitsfx) ? hitsfx : "DealDamage";
								KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg");
							}
						} else {
							let sfx = (enemy.Enemy && enemy.Enemy.misssfx) ? enemy.Enemy.misssfx : "Miss";
							KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg");
						}

						if (usingSpecial && enemy.specialCD > 0 && enemy.Enemy.specialCharges) {
							if (enemy.specialCharges == undefined)
								enemy.specialCharges = enemy.Enemy.specialCharges - 1;
							else
								enemy.specialCharges -= 1;
						}

						if (happened > 0 && player.player) {
							let suffix = "";
							if (Stun)
								suffix = "Stun";
							else if (Locked)
								suffix = "Lock";
							else if (resistRestraint)
								suffix = "BindResist"
							else if (bound > 0)
								suffix = "Bind";

							let sfx = (hitsfx) ? hitsfx : "Damage";
							KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + sfx + ".ogg");
							let msg = TextGet("Attack" + enemy.Enemy.name + suffix);
							if (replace)
								for (let R = 0; R < replace.length; R++)
									msg = msg.replace(replace[R].keyword, "" + replace[R].value);
							KinkyDungeonSendMessage(happened + priorityBonus, msg, msgColor, 3);
						}
					}

					enemy.warningTiles = [];
				}
			} else {
				enemy.warningTiles = [];
				enemy.attackPoints = 0;
			}

			enemy.moved = (moved || enemy.movePoints > 0);
			enemy.idle = idle && !(moved || enemy.attackPoints > 0);

			if (!ignore && AI == "ambush" && playerDist <= enemy.Enemy.ambushRadius) {
				enemy.ambushtrigger = true;
			} else if (AI == "ambush" && ignore)
				enemy.ambushtrigger = false;

			if ((!enemy.Enemy.allied || (!player.player && (!player.Enemy || !player.Enemy.allied))) && ((enemy.aware && KinkyDungeonTrackSneak(enemy, 0, player)) || playerDist < Math.max(1.5, enemy.Enemy.blindSight)) && !ignore && (!moved || enemy.Enemy.castWhileMoving) && enemy.Enemy.attack.includes("Spell") && KinkyDungeonCheckLOS(enemy, player, playerDist, enemy.Enemy.visionRadius, false) && enemy.castCooldown <= 0 && (!enemy.Enemy.minSpellRange || (playerDist > enemy.Enemy.minSpellRange)) && KinkyDungeonGetBuffedStat(enemy.buffs, "Silence") <= 0) {
				idle = false;
				let spellchoice = null;
				let spell = null;

				for (let tries = 0; tries < 5; tries++) {
					spellchoice = enemy.Enemy.spells[Math.floor(Math.random() * enemy.Enemy.spells.length)];
					spell = KinkyDungeonFindSpell(spellchoice, true);
					if (playerDist > spell.start.range)
						spell = null;
					else
						break;
				}

				if (spell) {
					enemy.castCooldown = spell.cooldown * enemy.Enemy.spellCooldownMult + enemy.Enemy.spellCooldownMod + 1;
					if (KinkyDungeonCastSpell(player.x, player.y, spell, enemy, player) && spell.sfx) {
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/" + spell.sfx + ".ogg");
					}

					//console.log("casted "+ spell.name);
				}
			}
		}

		if (idle) {
			enemy.movePoints = 0;
			enemy.attackPoints = 0;
			enemy.warningTiles = [];
		}

		if (enemy.vp > 0 && !enemy.path)
			enemy.vp = Math.max(0, enemy.vp - 0.1);

		// Delete the enemy
		if (KinkyDungeonEnemyCheckHP(enemy, E)) {
			E -= 1;
		}
		if (enemy.Enemy.regen)
			enemy.hp = Math.min(enemy.Enemy.maxhp, enemy.hp + enemy.Enemy.regen * delta);
		if (enemy.Enemy.lifespan || enemy.lifetime != undefined) {
			if (enemy.lifetime == undefined)
				enemy.lifetime = enemy.Enemy.lifespan;
			enemy.lifetime -= delta;
			if (enemy.lifetime <= 0)
				enemy.hp = 0;
		}
	}
	KinkyDungeonAlert = 0;

	KinkyDungeonHandleJailSpawns();
}

let KinkyDungeonJailGuard = undefined;
let KinkyDungeonGuardTimer = 0;
let KinkyDungeonGuardTimerMax = 22;
let KinkyDungeonGuardSpawnTimer = 0;
let KinkyDungeonGuardSpawnTimerMax = 74;
let KinkyDungeonGuardSpawnTimerMin = 52;
let KinkyDungeonMaxPrisonReduction = 10;
let KinkyDungeonPrisonReduction = 0;

function KinkyDungeonHandleJailSpawns() {
	let xx = KinkyDungeonStartPosition.x + KinkyDungeonJailLeashX;
	let yy = KinkyDungeonStartPosition.y;
	let playerInCell = (Math.abs(KinkyDungeonPlayerEntity.x - KinkyDungeonStartPosition.x) < KinkyDungeonJailLeashX - 1 && Math.abs(KinkyDungeonPlayerEntity.y - KinkyDungeonStartPosition.y) <= KinkyDungeonJailLeash);
	if (KinkyDungeonSpawnJailers + 1 == KinkyDungeonSpawnJailersMax && (KinkyDungeonGuardSpawnTimer == 1 || KinkyDungeonSleepTurns == 3) && !KinkyDungeonJailGuard && playerInCell) {
		KinkyDungeonGuardSpawnTimer = KinkyDungeonGuardSpawnTimerMin + Math.floor(Math.random() * (KinkyDungeonGuardSpawnTimerMax - KinkyDungeonGuardSpawnTimerMin));
		let Enemy = KinkyDungeonEnemies.find(element=>element.name == "Guard");
		let guard = {
			summoned: true,
			Enemy: Enemy,
			x: xx,
			y: yy,
			gx: xx - 2,
			gy: yy,
			hp: (Enemy && Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp,
			movePoints: 0,
			attackPoints: 0
		};

		if (KinkyDungeonTiles[(xx - 1) + "," + yy] && KinkyDungeonTiles[(xx - 1) + "," + yy].Type == "Door") {
			KinkyDungeonTiles[(xx - 1) + "," + yy].Lock = undefined;
		}
		KinkyDungeonJailGuard = guard;
		KinkyDungeonEntities.push(guard);
		KinkyDungeonSendMessage(8, TextGet("KinkyDungeonGuardAppear"), "white", 6);

		KinkyDungeonGuardTimer = KinkyDungeonGuardTimerMax;
	} else if (KinkyDungeonGuardSpawnTimer > 0)
		KinkyDungeonGuardSpawnTimer -= 1;
	if (KinkyDungeonJailGuard && KinkyDungeonGuardTimer > 0 && KinkyDungeonGuardTimerMax - KinkyDungeonGuardTimer > 6 && Math.random() < 0.2) {
		if (Math.random() < 0.5)
			KinkyDungeonJailGuard.gy = yy + Math.round(Math.random() * KinkyDungeonJailLeash * 2 - KinkyDungeonJailLeash);
		else
			KinkyDungeonJailGuard.gy = KinkyDungeonPlayerEntity.y;
	}

	if (KinkyDungeonGuardTimer > 0) {
		KinkyDungeonGuardTimer -= 1;
		if (KinkyDungeonGuardTimer <= 0) {
			KinkyDungeonJailGuard.gx = xx;
			KinkyDungeonJailGuard.gy = yy;
		}
	} else {
		if (KinkyDungeonJailGuard && KinkyDungeonJailGuard.x == xx && KinkyDungeonJailGuard.y == yy && !KinkyDungeonJailTransgressed) {
			KinkyDungeonEntities.splice(KinkyDungeonEntities.indexOf(KinkyDungeonJailGuard), 1);

			if (KinkyDungeonTiles[(xx - 1) + "," + yy] && KinkyDungeonTiles[(xx - 1) + "," + yy].Type == "Door") {
				KinkyDungeonMapSet(xx - 1, yy, 'D');
				KinkyDungeonTiles[(xx - 1) + "," + yy].Lock = KinkyDungeonGenerateLock(true, MiniGameKinkyDungeonLevel);
				KinkyDungeonSendMessage(6, TextGet("KinkyDungeonGuardDisappear"), "red", 6);
				if (KinkyDungeonPrisonReduction < KinkyDungeonMaxPrisonReduction) {
					KinkyDungeonPrisonReduction += 1;
					KinkyDungeonChangeRep("Prisoner", -1);
				}
				KinkyDungeonChangeRep("Ghost", 1);
			}
		}
	}

	if (!KinkyDungeonJailGuard) {
		KinkyDungeonGuardTimer = 0;
	}
	if (!KinkyDungeonEntities.includes(KinkyDungeonJailGuard))
		KinkyDungeonJailGuard = undefined;
}

function KinkyDungeonNoEnemy(x, y, Player) {

	if (KinkyDungeonEnemyAt(x, y))
		return false;
	if (Player)
		for (let P = 0; P < KinkyDungeonPlayers.length; P++)
			if ((KinkyDungeonPlayers[P].x == x && KinkyDungeonPlayers[P].y == y))
				return false;
	return true;
}

function KinkyDungeonEnemyAt(x, y) {
	for (let E = 0; E < KinkyDungeonEntities.length; E++) {
		if (KinkyDungeonEntities[E].x == x && KinkyDungeonEntities[E].y == y)
			return KinkyDungeonEntities[E];
	}
	return null;
}

function KinkyDungeonEnemyTryMove(enemy, Direction, delta, x, y) {
	if (enemy.bind > 0)
		enemy.movePoints += delta / 10;
	else if (enemy.slow > 0)
		enemy.movePoints += delta / 2;
	else
		enemy.movePoints += KinkyDungeonSleepTurns > 0 ? 4 * delta : delta;

	if (enemy.movePoints >= enemy.Enemy.movePoints) {
		enemy.movePoints = 0;
		let dist = Math.abs(x - KinkyDungeonPlayerEntity.x) + Math.abs(y - KinkyDungeonPlayerEntity.y);

		if (KinkyDungeonMapGet(enemy.x, enemy.y) == 'd' && enemy.Enemy && enemy.Enemy.movetags.includes("closedoors") && Math.random() < 0.8 && dist > 5) {
			KinkyDungeonMapSet(enemy.x, enemy.y, 'D');
			if (dist < 10) {
				KinkyDungeonSendMessage(3, TextGet("KinkyDungeonHearDoorCloseNear"), "#dddddd", 3);
			} else if (dist < 20)
				KinkyDungeonSendMessage(2, TextGet("KinkyDungeonHearDoorCloseFar"), "#999999", 3);
		}

		enemy.x += Direction.x;
		enemy.y += Direction.y;

		if (KinkyDungeonMapGet(x, y) == 'D' && enemy.Enemy && enemy.Enemy.movetags.includes("opendoors")) {
			KinkyDungeonMapSet(x, y, 'd');
			if (KinkyDungeonTiles[x + ',' + y] && KinkyDungeonTiles[x + ',' + y].Type == "Door")
				KinkyDungeonTiles[x + ',' + y].Lock = undefined;
			if (dist < 5) {
				KinkyDungeonSendMessage(3, TextGet("KinkyDungeonHearDoorOpenNear"), "#dddddd", 3);
			} else if (dist < 15)
				KinkyDungeonSendMessage(2, TextGet("KinkyDungeonHearDoorOpenFar"), "#999999", 3);
		}

		for (let B = 0; B < KinkyDungeonBullets.length; B++) if (KinkyDungeonBullets[B].Follow == enemy) {
			KinkyDungeonBullets[B].x = enemy.x;
			KinkyDungeonBullets[B].y = enemy.y;
		}

		return true;
	}
	return false;
}

function KinkyDungeonEnemyTryAttack(enemy, player, Tiles, delta, x, y, points, replace, msgColor) {
	enemy.attackPoints += delta;

	if (enemy.attackPoints >= points) {
		enemy.attackPoints = 0;
		if (points > 1)
			for (let T = 0; T < Tiles.length; T++) {
				let ax = enemy.x + Tiles[T].x;
				let ay = enemy.y + Tiles[T].y;

				if (player.x == ax && player.y == ay) {
					return true;
				}
			}
		else
			return true;
		enemy.warningTiles = [];
	} else if (!enemy.Enemy.noCancelAttack) {
		// Verify player is in warningtiles and reset otherwise
		let playerIn = false;
		for (let T = 0; T < Tiles.length; T++) {
			let ax = enemy.x + Tiles[T].x;
			let ay = enemy.y + Tiles[T].y;

			if (player.x == ax && player.y == ay) {
				playerIn = true;
				break;
			}
		}
		if (!playerIn) {
			enemy.attackPoints = 0;
			enemy.warningTiles = [];
		}
	}
	return false;
}

function KinkyDungeonGetWarningTilesAdj() {
	var arr = [];

	arr.push({
		x: 1,
		y: 1
	});
	arr.push({
		x: 0,
		y: 1
	});
	arr.push({
		x: 1,
		y: 0
	});
	arr.push({
		x: -1,
		y: -1
	});
	arr.push({
		x: -1,
		y: 1
	});
	arr.push({
		x: 1,
		y: -1
	});
	arr.push({
		x: -1,
		y: 0
	});
	arr.push({
		x: 0,
		y: -1
	});

	return arr;
}

function KinkyDungeonGetWarningTiles(dx, dy, range, width) {
	if (range == 1 && width == 8)
		return KinkyDungeonGetWarningTilesAdj();

	var arr = [];
	var cone = 0.78539816 * (width - 0.9) / 2;
	var angle_player = Math.atan2(dx, dy) + ((width % 2 == 0) ? ((Math.random() > 0.5) ? -0.39269908 : 39269908) : 0);
	if (angle_player > Math.PI)
		angle_player -= Math.PI;
	if (angle_player < -Math.PI)
		angle_player += Math.PI;

	for (let X = -range; X <= range; X++)
		for (let Y = -range; Y <= range; Y++) {
			var angle = Math.atan2(X, Y);

			var angleDiff = angle - angle_player;
			angleDiff += (angleDiff > Math.PI) ? -2 * Math.PI : (angleDiff < -Math.PI) ? 2 * Math.PI : 0;

			if (Math.abs(angleDiff) < cone + 0.15 && Math.sqrt(X * X + Y * Y) < range + 0.5)
				arr.push({
					x: X,
					y: Y
				});
		}

	return arr;
}

function KinkyDungeonDefeat() {
	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.restraint && inv.restraint.removePrison) {
			KinkyDungeonRemoveRestraint(inv.restraint.Group, false);
		}
	}
	KinkyDungeonPrisonReduction = 0;
	let firstTime = KinkyDungeonSpawnJailersMax == 0;
	KinkyDungeonGuardSpawnTimer = 4 + Math.floor(Math.random() * (KinkyDungeonGuardSpawnTimerMax - KinkyDungeonGuardSpawnTimerMin));
	KinkyDungeonSpawnJailersMax = 2;
	if (KinkyDungeonGoddessRep.Prisoner)
		KinkyDungeonSpawnJailersMax += Math.round(6 * (KinkyDungeonGoddessRep.Prisoner + 50) / 100);
	let securityBoost = (firstTime) ? 0 : Math.max(2, Math.ceil(4 * (KinkyDungeonSpawnJailersMax - KinkyDungeonSpawnJailers + 1) / KinkyDungeonSpawnJailersMax));

	KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id:"Jail", type:"Blind", power:3, duration:3});

	MiniGameKinkyDungeonLevel = Math.floor(MiniGameKinkyDungeonLevel / 10) * 10;
	KinkyDungeonSendMessage(8, TextGet("KinkyDungeonLeashed"), "#ff0000", 3);
	let params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
	KinkyDungeonSpawnJailers = KinkyDungeonSpawnJailersMax;
	KinkyDungeonCreateMap(params, MiniGameKinkyDungeonLevel);

	KinkyDungeonSetDress(params.defeat_outfit);
	KinkyDungeonDressPlayer();
	for (let r of params.defeat_restraints) {
		let level = 0;
		if (KinkyDungeonGoddessRep.Prisoner)
			level = Math.max(0, KinkyDungeonGoddessRep.Prisoner + 50);
		if (!r.Level || level >= r.Level)
			KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(r.Name), 0, true);
	}
	KinkyDungeonSetDress(params.defeat_outfit);
	KinkyDungeonRedKeys = 0;
	KinkyDungeonBlueKeys = 0;
	KinkyDungeonLockpicks = Math.min(Math.max(0, Math.round(3 * (1 - (KinkyDungeonGoddessRep.Prisoner + 50) / 100))), KinkyDungeonLockpicks);
	KinkyDungeonNormalBlades = 0;

	let newInv = KinkyDungeonRestraintList();
	KinkyDungeonInventory = newInv;
	KinkyDungeonInventoryAddWeapon("Knife");

	KinkyDungeonChangeRep("Ghost", 1 + Math.round(KinkyDungeonSpawnJailers / 2));
	KinkyDungeonChangeRep("Prisoner", securityBoost);
	// Each time you get caught, security increases...

	KinkyDungeonDressPlayer();
	KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/StoneDoor_Close.ogg");
}

function KinkyDungeonEnemyCanMove(enemy, dir, MovableTiles, AvoidTiles, ignoreLocks, Tries) {
	let master = enemy.Enemy.master;
	let xx = enemy.x + dir.x;
	let yy = enemy.y + dir.y;
	if (master) {
		let findMaster = undefined;
		let masterDist = 1000;
		for (let e of KinkyDungeonEntities) {
			if (e.Enemy.name == master.type && Math.sqrt((e.x - enemy.x) * (e.x - enemy.x) + (e.y - enemy.y) * (e.y - enemy.y)) < masterDist) {
				masterDist = Math.sqrt((e.x - enemy.x) * (e.x - enemy.x) + (e.y - enemy.y) * (e.y - enemy.y));
				findMaster = e;
			}
		}
		if (findMaster) {
			if (Math.sqrt((xx - findMaster.x) * (xx - findMaster.x) + (yy - findMaster.y) * (yy - findMaster.y)) > master.range && Math.sqrt((xx - findMaster.x) * (xx - findMaster.x) + (yy - findMaster.y) * (yy - findMaster.y)) > masterDist)
				return false;
		}
	}
	return MovableTiles.includes(KinkyDungeonMapGet(xx, yy)) && ((Tries && Tries > 5) || !AvoidTiles.includes(KinkyDungeonMapGet(enemy.x + dir.x, enemy.y + dir.y))) && (ignoreLocks || !KinkyDungeonTiles[(xx) + "," + (yy)] || !KinkyDungeonTiles[(xx) + "," + (yy)].Lock) && KinkyDungeonNoEnemy(xx, yy, true);
}
