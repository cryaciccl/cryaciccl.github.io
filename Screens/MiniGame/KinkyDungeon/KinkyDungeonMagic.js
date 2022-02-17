"use strict";
let KinkyDungeonBookScale = 1.3;
// Magic book image source: https://www.pinterest.es/pin/54324739242326557/

let KinkyDungeonBooks = ["Elements", "Conjure", "Illusion"];
let KinkyDungeonPreviewSpell = null;
let KinkyDungeonSpellsStart = {};
let KinkyDungeonSpellChoices = [0, 1, 2];
let KinkyDungeonSpellChoiceCount = 3;

// 0 Ars Pyrotecnica - Elemental magic such as fireballs, ice, wind, etc
// 1 Codex Imaginus - Conjuring things such as weapons and restraints, and also enchanting (and disenchanting)
// 2 Clavicula Romantica - Illusory magic, disorientation and affecting enemy AI
let KinkyDungeonSpells = [];
let KinkyDungeonSpellLevel = {"Elements":0, "Conjure":0, "Illusion":0};
let KinkyDungeonSpellPoints = {"Elements": 1, "Conjure": 1, "Illusion": 1};
let KinkyDungeonCurrentPage = 0;
let KinkyDungeonCurrentSpellsPage = 0;
let KinkyDungeonLearnableSpells = {
	"Elements":	[],
	"Conjure":	[],
	"Illusion":	[], //"Mist", "Clarify", "Rope"],
};
let KinkyDungeonSpellPress = 0;
let KinkyDungeonTargetingSpell = null;

let KinkyDungeonSpellList = { // List of spells you can unlock in the 3 books. must discover them before learn using points.
	/* Spell Description															
	 *	 Basic Information: name, how to learn, how to cast, target, 																						bullets created, first start, then any other described by hit, expire, trail and tick. they have range(for start to launch spell), speed(for bolt), lifetime(for lingering), damage if can hit, and som other switches.  **/																																				
	"Elements": [		/*																																																																																																																																*/
		{name: "Flare",		school: "Elements", level: 1, vpos: 1,	manacost: 7, components: "ArmsFree", miscast:"Continue",								start:	{size:1, sfx:"FireSpell",	range:50, speed:2, hit:"aoe", damage:3, levelboost:0.2, type:"fire", playerEffect:{name:"Damage"},},	
				/* --- */																																	aoe:	{size:3, 					aoe:1.7, lifetime:1, damage:1.5, levelboost:0.1, hit:"hit", hitfilter:"PlayerEnemy", type:"fire", playerEffect:{name:"Damage"},}, hit: {size:1, lifetime:1},},				// Throw a fireball deal direct damage and explosion aoe damage.
		{name: "Electrify",	school: "Elements", level: 1, vpos: 3,	manacost: 6, components: "Verbal", miscast:"Continue", 									start:	{size:1, sfx:"FireSpell",	range:3, speed:6, hitSoft:true, hit:"scatt", keeprotate:true, hitNextTarget: true, hitInherit:true, trail:"light", damage:4, levelboost:0.25, type:"electric", time:3, playerEffect:{name:"Shock", time:3},},
				/* --- */																																	scatt:	{size:1,					range:3, speed:6, hitSoft:true, keeprotate:true, trail:"light", damage:4, levelboost:0.25, type:"electric", time:3, playerEffect:{name:"Damage"},},
				/* --- */																																	light:	{size:1,					keeprotate:true, lifetime:0.9, expire:"light2"}, light2: {size:1, lifetime:0.9}},																							// Attack target and another nearby enemy.
		{name: "Light", 	school: "Elements", level: 1, vpos: 6, 	manacost: 4, components: "WillHigh", miscast:"Continue", 								start:	{size:5, sfx: "FireSpell",	range:5, lifetime:1.5, expire:"light",},
				/* --- */																		 															light:	{size:5, 					aoe:2.5, needpath:true, lifetime:0.9, damage:1, levelboost:0.04, type: "stun", time: 8, playerEffect: {name: "Blind", time: 5}},},											// Light a large area aoe for slight damage and long stun.
		{name: "Earth", 	school: "Elements", level: 2, vpos: 2,	manacost: 9, components: "Kneel", Target:["noEnemy","noPlayer","ignoreTerrainXg"],	 	start:	{size:1, sfx: "MagicSlash",	range:6, lifetime:1, summon: [{name: "Wall", count: 1, time: 10}], launchEffect:{name:"ChangeTerrain", fromtile:"Xg", totile:"2"},},},										// Earth create a wall, on which if wall may dismiss.
		{name: "Pool", 		school: "Elements", level: 2, vpos: 4,	manacost: 14, components: "ArousalLowArmsFree", 										start:	{size:3, sfx: "MagicSlash",	range:4, lifetime:8, hitduration:1, aoe:1.5, buffs: [{id: "Pool_ap", type: "restore_ap", power: -5.0, player: true, duration: 1}, {id: "Pool_sp", type: "restore_sp", power: 3.0, player: true, duration: 1},
				/* --- */																																	{id: "Pool_silence", type: "Silence", power: 3.0, enemies: true, duration: 1}, {id: "Pool_spmax", type: "restore_spmax", power:0.5, player:true, duration:1}, {id: "Pool_ally", type: "enemy_restore", power:2, ally:true, duration:1}]},},																																																				// Pool make a restoring pool with sp up, ap down and enemy silence.
		{name: "Frost",		school: "Elements", level: 2, vpos: 5, 	manacost: 8, components: "ArmsFree", miscast:"Continue", 								start:	{		sfx: "Freeze",		range:6, speed:12, keeprotate:true, pierce:true, trail:"ice", damage:2, levelboost:0.15, type:"ice", time:2, playerEffect: {name: "Damage"}},
				/* --- */																																	ice:	{size:1,					lifetime:4, damage:1, levelboost:0.02, hitduration:1, slow:2, time: 6, type:"cold", playerEffect:{name:"Slow", slow:2, time:6},},}, 										// Frost hit a strait line freeze and leave that slows whoever step on them for several turns
		{name: "Ivy",		school: "Elements", level: 2, vpos: 6, 	manacost: 9, staminacost: 8, components: "ArousalLow", recast:"Replace", miscast:"Continue",
				/* --- */																																	start:	{size:1, sfx: "Struggle",	range:3, lifetime:7, hitduration:1, damage:2, type:"stun", time:2, playerEffect: {name:"Restraint", attacktags:["vineRestraints"], count:3, power: 3}},},					// Ivy creates a magic ivy on enemy, try stun them every turn for a long time, also deal a little damage.
		{name: "Golem", 	school: "Elements", level: 3, vpos: 2, 	manacost: 16, components: "LegsFreeKneel", prerequisites:"Earth", Target: ["noEnemy","noPlayer"],
				/* --- */																																	start:	{size:1, sfx: "MagicSlash",	range:6, lifetime: 25, aoe:1, block:25, summon: [{name: "Golem", count: 1, time: 25}]},},																					// Golem create a minion blocks friend and enemy unit, and leave a shield block projectiles up to 25 damage.
		{name: "Thunder", 	school: "Elements", level: 3, vpos: 3, 	manacost: 12, components: "ArmsFreeVerbal", prerequisites:"Electrify", 					start:	{size:1, sfx: "FireSpell",	range:7, lifetime: 3.1, expire:"thunder"}, light:{size:3, lifetime:1.5,},
				/* --- */																																	thunder:{size:3, 					aoe:1, lifetime:0.1, damage:6, levelboost:0.35, type:"electric", time:8, playerEffect:{name:"Damage"}, expire:"light"}},													// Thunder hit an area after 3 turns, deal a lot of damage and long stun
		{name: "Hurricane",	school: "Elements", level: 3, vpos: 5, 	manacost: 14, components: "VisibleManaHigh",		 									start:	{size:3, sfx: "MagicSlash",	range:9, aoe:1.5, norotate:true, speed:0.75, pierce:true, aoewall:0.01, stopwhenhit:true, block:Infinity, hitduration:1, damage:2, levelboost:0.1, lifetime:12, type:"crush"},	},	// Hurricane create a moving hurricane area cause damage and blow away other bullets
		{name: "Elemental",	school: "Elements", level: 4, vpos: 1, 	manacost: 21, willcost:1, components: "ArmsFreeWillHighStand", prerequisites:"Flare", Target: ["noEnemy","noPlayer"], recast:"Dismiss", dismiss:"Elemental",
				/* --- */																																	start:	{size:1, sfx: "MagicSlash",	range:2, lifetime: 1, summon: [{name: "Elemental", count: 1}]},},																											// Elemental create a minion fight for you with high stats
		{name: "Blizzard", 	school: "Elements", level: 4, vpos: 5, 	manacost: 19, components: "ArmsFreeLegsFreeVerbal", prerequisites:"Hurricane", 			start:	{size:5, sfx: "MagicSlash",	range:6, aoe:2.5, tickrotate:0.15, lifetime:22, hitduration:1, damage:2, levelboost:0.12, type:"ice", playerEffect:{name:"Damage"},},},										// Call a Storm for freeze and high damage at a large area
	], "Conjure": [		/*																																																																																																																																*/
		{name: "Escape",	school: "Conjure", level: 1, vpos: 1, 	staminacost: 30, components: "ArousalHigh", Target:["Player"], miscast:"Never",			start:	{size:1, sfx: "MagicSlash",	lifetime:1, playerEffectOnCast:{name:"StaminaMaxLoss", value:30}, playerEffect:{name:"Escape"},}},																			// Escape removes all restraints and -30 stamina max
		{name: "Curse",		school: "Conjure", level: 1, vpos: 3, 	manacost: 14, components: "WillLowSilent", Target:["Enemy"],							start:	{							range:4, damage:2, type:"slow", time:12, hit:"curse", hitFollow:true, hitInherit:true, buffs:[{id:"Curse", type: "Curse", power: 2, enemies: true, duration: 12}, {id:"Curse_losshp", type: "enemy_restore", power: -2, enemies:true, duration:12}]},		// Curse slows an enemy, make him loss hp and spread this to other enemies... also, TODO their restraint will be cursed!
				/* --- */																																	curse:	{size:1, sfx: "FireSpell",	damage:1, type:"slow", time:12, lifetime: 12, aoe:0.6, hit:"curse", hitfilter:"Enemy", hitFollow:true, hitInherit:true, expireIf:function(b){return b.Follow.hp<=0;}, buffs:[{id:"Curse", type: "Curse", power: 2, enemies: true, duration: 12}, {id:"Curse_losshp", type: "enemy_restore", power: -1, enemies:true, duration:12}]}},
		{name: "Desire",	school: "Conjure", level: 1, vpos: 6, 	manacost: 4, arousalcost: -10, components: "StaminaHigh", Target:["Player"],			start:	{		sfx: "FireSpell",	buffs:[{id:"Desire_ap", type: "restore_ap", power: 1.0, player:true, duration:30, stack:true}, {id:"Desire_attack", type: "AttackDmg", power:5.0, player:true, duration:30},]}},	// Desire make yourself +1 ap for 30 turns, also +5 damage.
		{name: "Blood", 	school: "Conjure", level: 2, vpos: 1, 	staminacost: 11, components: "ArmsBound", 												start:	{size:1, sfx:"MagicSlash",	range:50, speed:2, hitSoft:true, hit:"hit", damage:4, levelboost:0.2, type:"stun", playerEffectOnCast:{name:"StaminaMaxLoss", value:4}, playerEffect:{name:"Damage"},},
				/* --- */																																	hit:	{size:1,					lifetime:1},},																																								// Blood shoot enemy dealing damage, it costs stamina and staminamax, it can use when arms are bound.
		{name: "Explosion",	school: "Conjure", level: 2, vpos: 2, 	manacost: 6, components: "ArmsFree", 													start:	{size:1, sfx: "Click",		range:3, lifetime:4, expire:"boom", playerEffectOnCast:{name:"LossRandomPotion", value:1}},
				/* --- */																																	boom:	{size:3, sfx: "FireSpell",	aoe:2, damage:5, levelboost:0.3, type:"fire", hitEffect:{name:"Repel", power:1.5}, lifetime:1, trail:"burn", chance:0.5, playerEffect:{name:"Damage"}, },
				/* --- */																																	burn:	{size:1,					damage:1, type:"fire", playerEffect:{name:"Damage"}, lifetime:6, hitduration:1,},},																							// Explosion make one of your potion to bomb, throw it and ... boooooom!!							
		{name: "Fraggile",	school: "Conjure", level: 2, vpos: 5, 	manacost: 11, components: "LegsBound", Target:["Player"],								start:	{size:7, sfx: "FireSpell",	aoe:3.3, lifetime:15, hitduration:1, damage:1, type:"pierce", buffs:[{id:"Fraggile", type:"ArmorBreak", enemies:true, player:true, ally:true, power:1, duration:2, stack:true}]}},	// Fraggile any nearby enemy, their armor loss by 1 each turn, and take 1 damage. you are also freeze to move during which.
		{name: "Conjure", 	school: "Conjure", level: 3, vpos: 3, 	manacost: 9, willcost: 3, components: "BlindWillLow", prerequisites:"Curse", Target:["Enemy"],
				/* --- */																																	start:	{		sfx: "FireSpell",	range:4, damage:1, type:"instantkill", killEffect:{name:"Bullet", bullet:"aoe"}, hit:"hit"}, hit:{size:1, lifetime:1},
				/* --- */																																	aoe:	{size:3, 					lifetime:1, aoe:1.5, damage:9, type:"ice", time:2},},																														// Conjure try kill an enemy instantly, if success it Aoe its nearby units for high damage and slow.
		{name: "Wildness",	school: "Conjure", level: 3, vpos: 6, 	manacost: 4, arousalcost: 15, components: "StaminaHighArousalHigh", Target:["Player"],	start:	{		sfx: "FireSpell",	buffs:[{id:"WildAtk", type:"AtkSpeedBoost", power:1, player:true, duration:20}, {id:"Wild", type:"MoveSpeedBoost", power:1, player:true, duration:20}, {id:"WildMana", type:"restore_mpmax", power:-0.5, player:true, duration:20, stack:true}]}},																							// Wildness decrease mana max for 20 turns, for exchange boost attack and move speed.
		{name: "Imprison",	school: "Conjure", level: 4, vpos: 1, 	willcost: 2, components: "ArmsBoundManaHigh",	Target:["Player"],						start:	{		sfx: "FireSpell",	playerEffect:{name:"Submit"}, hit:"aura", hitFollow:true, },																												// Imprison nearby enemies from melee attack, drains mana every turn. once you get freed your arm the effect disappear.
				/* --- */																																	aura:	{size:5, sfx: "FireSpell",	aoe:2.5, lifetime:9999, hitduration:1, expireIf:function(b){return KinkyDungeonPlayer.CanInteract()||KinkyDungeonStatMana<=1;}, buffs:[{id:"ImprisonDrain", type:"restore_mp", power:-0.5, duration:1, player:true},{id:"Imprison", type:"Disarm", power:1, duration:1, enemies:true}]}},
		{name: "Dominate",	school: "Conjure", level: 4, vpos: 4, 	willcost: 7, staminacost:30, components: "VerbalArmsFreeLegsFreeWillHighStand", Target:["Enemy"],
				/* --- */																																	start:	{size:1, sfx: "FireSpell",	range:1, lifetime:2, expire:"hit"}, hit: {canHitEnemy:true, hitEffect:{name:"Dominate"}}},																					// Try touch persuade and dominate an enemy for several turns. need several turns before...
	], "Illusion": [	/*																																																																																																																																*/
		{name: "Mist", 		school: "Illusion", level: 1, vpos: 1, 	manacost: 2, components: "ArousalLow", 													start:	{size:7, sfx: "FireSpell",	lifetime:3, aoe: 3, range: 4, trail:"mist", chance:0.5},																													// Mist creates a shroud area with random generated mists. Enemies within are hard to hit with melee attacks.
				/* --- */																																	mist:	{size:1, 					lifetime:12, hitduration:1, buffs: [{id: "Mist", type: "Evasion", power: 3.0, player: true, enemies: true, duration:2}, {id: "MistBlind", type:"Blind", power:1.0, player:true, duration:2}, {id: "MistSneak", type: "Sneak", power: 3.0, player: true, duration:2,}],},},
		{name: "Clarify",	school: "Illusion", level: 1, vpos: 3, 	manacost: 4, willcost: 1, components: "Verbal", Target:["Enemy", "Player"],				start:	{		sfx: "FireSpell",	range:5, canHitEnemy:true, hitEffect:{name:"Clarify"}, playerEffect: {name: "Clarify"}},},																					// Clarify removes blind, slow, freeze effect for you, or buff effects for enemy. *TODO*
		{name: "Torch",		school: "Illusion", level: 1, vpos: 4, 	manacost: 7, components: "LegsFree", recast:"Replace",									start:	{size:1, sfx: "FireSpell",	range:7, lifetime:15, light:4,},},																																			// Torch makes an light area visible even in darkness
		{name: "Rope",		school: "Illusion", level: 1, vpos: 6, 	manacost: 3, components: "Silent", Target:["noEnemy", "noPlayer"],						start:	{size:1, sfx: "FireSpell",	range:3, lifetime:1, expire:"trap"},
				/* --- */																																	trap:	{							damage:true, type:"stun", time:12, playerEffect:{name:"Restraint", attacktags:["ropeMagicStrong"], count:3, power: 3}},},													// Rope creates a magic rope trap that creates magic ropes on anything that steps on it. They are invisible once placed. Enemies get rooted, players get fully tied!
		{name: "Vision",	school: "Illusion", level: 2, vpos: 1, 	manacost: 7, components: "Blind", prerequisites:"Mist", Target:["Player"],				start:	{		sfx: "FireSpell",	lifetime:12, hitduration:1, Follow:"Player", expireIf:function(){return KinkyDungeonPlayer.GetBlindLevel()<=1;}, buffs:[{id: "Vision", type:"Vision", power:5, player:true, duration:1}]}},																																	// Vision enhance.
		{name: "Familiar", 	school: "Illusion", level: 2, vpos: 2, 	manacost: 9, staminacost: 25, components: "Verbal", Target:["noEnemy"],					start:	{size:1, sfx: "MagicSlash",	range:1, lifetime:1, summon: [{name: "Familiar", count: 1}]},},																												// Familiar creates a friendly unit for attraction and helps struggle.
		{name: "Shield", 	school: "Illusion", level: 2, vpos: 4, 	manacost: 11, components: "WillHigh", Target:["Player"],								start:	{size:1, sfx: "FireSpell",	lifetime:20, Follow:"Player", aoe:1, block:20, buffs:[{id: "Shield", type:"ResistRestraint", player:true, power:6, duration:20}]}},											// Shield follow you.
		{name: "Slime", 	school: "Illusion", level: 2, vpos: 6, 	manacost: 7, components: "ArmsBound", 													start:	{size:1, 					range:8, speed:1.2, trail:"slime", keeprotate:true, pierce:true }, 
				/* --- */																																	slime:	{size:1, sfx: "MagicSlash",	lifetime:10, hitExpire:true, damage:2, levelboost:0.2, type:"glue", time:3, block:5, aoe:0.49, blockignore:"Slimestart", buffs:[{id:"Disarm", enemies:true, power:1, duration:5}], playerEffect: {name:"Restraint", attacktags:["slime"], power:1},}},		// Throws a ball of slime slow, block projectile, and disarm enemy
		{name: "Illusion", 	school: "Illusion", level: 3, vpos: 2, 	manacost: 14, staminacost: 25, components: "VerbalBliind", prerequisites:"Familiar", Target:"Player", sum:{size:1, lifetime:1, summon: [{name: "Illusion", count: 1}]},
				/* --- */																																	start:	{		sfx: "MagicSlash",	aoe:4, lifetime:30, Follow:"Player", trail:"sum", chance:0.2, trailduration:2 },},																							// Illusion creates many friendly illusions for attraction. they also casts lesserlight to enemies.
		{name: "Portal", 	school: "Illusion", level: 3, vpos: 5, 	manacost: 16, willcost:2, components: "VerbalWillHigh", recast:"Expire",				start:	{size:1, sfx: "MagicSlash",	range:50, lifetime:120, hitduration:1, cooldown:5, cooldownsprite:"prepare", playerEffect:{name:"Teleport"}, hitsfx: "Teleport", playerEffectOnCast:{name:"Bullet", bullet:"entry"}},
				/* --- */																																	entry:	{size:1, 					lifetime:120, hitduration:1, cooldown:5, cooldownsprite:"prepare", playerEffect:{name:"Teleport"}, hitsfx: "Teleport",},},													// Creates a portal that can multiple use but single way!.
		{name: "Invisible",	school: "Illusion", level: 4, vpos: 1, 	manacost: 15, components: "VisibleArousalLow", prerequisites:"Vision", Target:["Player","Enemy"],
				/* --- */																																	start:	{		sfx: "FireSpell",	buffs: [{id: "Invisibility", type: "Sneak", duration: 14, power: 10.0, player: true, ally: true}],}},																		// Invisible.
		{name: "Blink", 	school: "Illusion", level: 4, vpos: 5, 	manacost: 4, willcost:5, components: "WillHighVisible", prerequisites:"Portal", Target:["needVision"],
				/* --- */																																	start:	{size:1, sfx: "Teleport",	range:5, lifetime:1, playerEffectOnCast: {name:"Teleport"}},}, 																												// Blink take you to a nearby place instantly.
	],
};

let KinkyDungeonSpellListEnemies = [
	//{name: "AllyCrackle",													start:	{		sfx: "FireSpell",	range:4, speed:8, lifetime:1, piercing: true, projectile:true, nonVolatile: true, onhit:"", power: 4, delay: 0, time: 1, range: 4, speed: 4, size: 1, damage: "electric", trailPower: 0, trailLifetime: 1.1, trailTime: 4, trailDamage:"inert", trail:"lingering", trailChance: 1.0},},
	{name: "AllyFirebolt",		allySpell: true,		cooldown:1,			start:	{size:1, sfx: "FireSpell", type:"fire", damage: 4, range: 50, speed: 2, hit:"hit"}, hit: {size:1, lifetime:1}}, // Throws a fireball in a direction that moves 1 square each turn
	//{name: "AllyShadowStrike",											start:	{	sfx: "MagicSlash", school: "Illusion", manacost: 3, components: ["Verbal"], level:1, type:"inert", onhit:"aoe", power: 6, time: 2, delay: 1, range: 1.5, size: 1, aoe: 0.75, lifetime: 1, damage: "cold"},}, // A series of light shocks incapacitate you
	{name: "BanditBola",		enemySpell: true, 		cooldown:3,			start:	{size:1, sfx: "Miss", 		range:50, speed:1, damage:3, type:"chain", time:1, hit:"hit", playerEffect: {name: "Restraint", attacktags: ["ropeRestraints"], count:1, power:3, doasfail:true, faileffect:"Slow", failtime:2}}, hit: {size:1, lifetime:1}}, // Throws a chain which stuns the target for 1 turn
	{name: "MummyBolt",			enemySpell: true, 		cooldown:4,			start:	{size:1, sfx: "FireSpell", 	range:50, speed:1, damage:4, type:"fire", playerEffect: {name: "MysticShock", time: 3}}},
	{name: "RopeEngulf",		enemySpell: true, 		cooldown:4,			start:	{size:3, sfx: "Struggle", 	range: 2, lifetime:1, expire:"rope"}, rope: {size:3, aoe:1, damage:0, type:"grope", lifetime:1, playerEffect: {name: "RopeEngulf", power: 2}}}, // Start with flash, an explosion with a 1 turn delay and a 1.5 tile radius. If you are caught in the radius, you also get blinded temporarily!
	{name: "WitchChainBolt",	enemySpell: true, 		cooldown:6,			start:	{size:1, sfx: "FireSpell",	range:50, speed:1, damage:6, type:"chain", time:6, playerEffect: {name:"Restraint", attacktags:["chainRestraints"], power:1, faileffect:"Slow", failtime:2, }}}, // Throws a chain which stuns the target for 1 turn
	{name: "WitchSlime",		enemySpell: true, 		cooldown:4,			start:	{size:3,  					range:4, lifetime:1, expire:"slime"}, slime:{lifetime:1,aoe:1.5,trail:"hit"},
			/* --- */														hit:	{size:1, sfx: "MagicSlash",	damage:4, type:"glue", time:2, aoe:1, lifetime:10, playerEffect: {name:"Restraint", attacktags:["slime"], power:1, faileffect:"Damage"}},}, // Creates a huge pool of slime, slowing enemies that try to enter. If you step in it, you have a chance of getting trapped!
	{name: "WitchSlimeBall",	enemySpell: true, 		cooldown:4,			start:	{size:1, sfx: "FireSpell",	damage:4, type:"glue", time:2, aoe:1, range:5, speed:1, hit:"hit", trail:"trail", playerEffect: {name:"Restraint", attacktags:["slime"], power:1, faileffect:"Damage"}}, // Throws a ball of slime which oozes more slime
			/* --- */														trail:	{size:1,  					lifetime:10, damage:2, type:"glue", playerEffect: {name: "SlimeTrap", time: 3}},},
	{name: "WitchElectrify",	enemySpell: true, 		cooldown:4,			start:	{size:1, 					range:4, lifetime:1.5, expire:"hit"},
			/* --- */														hit:	{size:1, sfx: "FireSpell",	damage:5, time:2, aoe:0.5, lifetime:1, type:"electric", playerEffect: {name: "Damage"},}}, // A series of light shocks incapacitate you
	{name: "SummonSkeleton",	enemySpell: true, 		cooldown:3,			start:	{		sfx: "Bones",		range:7, summon: [{name: "LesserSkeleton", count: 1, time: 12}],}},
	{name: "SummonSkeletons",	enemySpell: true, 		cooldown:5,			start:	{		sfx: "Bones",		range:7, summon: [{name: "LesserSkeleton", count: 4, time: 12}],}},
	{name: "SummonTentacles",	enemySpell: true, 		cooldown:3,			start:	{		sfx: "Miss",		range:6, summon: [{name: "Tentacles", count: 2, time:50}],}},
];

function KinkyDungeonSearchSpell(list, name) {
	for (let L = 0; L < list.length; L++) {
		let spell = list[L];
		if (spell.name == name) return spell;
	}
	return null;
}
function KinkyDungeonFindSpell(name, SearchEnemies) {
	if (SearchEnemies) {
		let spell = KinkyDungeonSearchSpell(KinkyDungeonSpellListEnemies, name);
		if (spell) return spell;
	}
	for (let key in KinkyDungeonSpellList) {
		let list = KinkyDungeonSpellList[key];
		let spell = KinkyDungeonSearchSpell(list, name);
		if (spell) return spell;
	}
	return KinkyDungeonSearchSpell(KinkyDungeonSpells, name);
}

function KinkyDungeonResetMagic() {
	KinkyDungeonSpellChoices = [0, 1, 2];
	KinkyDungeonSpellChoiceCount = 3;
	KinkyDungeonSpells = [];
	for (let key in KinkyDungeonSpellsStart) if (KinkyDungeonSpellsStart[key]) {
		KinkyDungeonSpells.push(KinkyDungeonFindSpell(key));
	}
	KinkyDungeonSpellLevel = {"Elements":0, "Conjure":0, "Illusion":0};
	KinkyDungeonSpellPoints = {"Elements": 1, "Conjure": 1, "Illusion": 1};
	KinkyDungeonSpellPress = 0;
	KinkyDungeonCurrentPage = 0;
	KinkyDungeonCurrentSpellsPage = 0;
	for (let school of KinkyDungeonBooks) 
		for (let I = 0; I < 2 + Math.random()*3; I++)
			KinkyDungeonDiscoverSpell(school, (I+4)/3, true);
}

function KinkyDungeonNewLevelMagic() {
	KinkyDungeonTargetingSpell = null;
}

function KinkyDungeonPlayerEffect(b) {
	if (!b || !b.playerEffect || b.type == "inert") return ;
	let eff = b.playerEffect;
	if (!eff.chance || Math.random() < eff.chance) {
		if (eff.name == "Damage") {
			let dmg = KinkyDungeonDealDamage({damage:b.damage, type:b.type, time:b.time});
			KinkyDungeonSendMessage(5, TextGet("KinkyDungeonDamageSelf").replace("DamageDealt", dmg), "red", 3);
		} else if (eff.name == "Blind") {
			KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, {id:"MagicBlind", type:"Blind", power:3, duration:eff.time});
			KinkyDungeonSendMessage(7, TextGet("KinkyDungeonBlindSelf"), "red", eff.time+1);
		} else if (eff.name == "Slow") {
			let slowlevel = eff.slow || b.spell.level;
			KinkyDungeonPlayerSlow(slowlevel, (eff.time || 2));
			KinkyDungeonSendMessage(6, TextGet("KinkyDungeonSlowedBySpell" + (slowlevel>3?"Heavy":(slowlevel>1?"Medium":""))), "orange", (eff.time || 2) +1);
		} else if (eff.name == "Restraint") {
			let addrestraint = false;
			for (let I = 0; I < (eff.count || 1); I++) {
				let restraint = KinkyDungeonGetRestraint({attacktags: eff.attacktags}, b.damage || b.spell.level, null, true);
				if (restraint) {
					KinkyDungeonAddRestraintIfWeaker(restraint, b.damage || b.spell.level, true);
					KinkyDungeonSendMessage(7, TextGet("KinkyDungeonSpellAddRestraint").replace("RESTRAINT", TextGet("Restraint"+restraint.name)), "red", 5);
					addrestraint = true;
				}
			} if ((!addrestraint || eff.doasfail) && eff.faileffect) {
				if (eff.faileffect == "Freeze") {
					KinkyDungeonPlayerFreeze(eff.failtime);
					KinkyDungeonSendMessage(9, TextGet("KinkyDungeonFreeze"), "red", 3);
				}
				if (eff.faileffect == "Slow") {
					KinkyDungeonPlayerSlow(1, eff.failtime);
					KinkyDungeonSendMessage(6, TextGet("KinkyDungeonSlowedBySpell", "orange", 5));
				}
				if (eff.faileffect == "Damage") {
					let dmg = KinkyDungeonDealDamage({damage:b.damage, type:b.type, time:b.time});
					KinkyDungeonSendMessage(5, TextGet("KinkyDungeonDamageSelf").replace("DamageDealt", dmg), "red", 3);
				}
			}
		} else if (eff.name == "Escape") {
			let list = KinkyDungeonRestraintList();
			for (let I = 0; I < list.length; I++) {
				if (list[I].restraint) KinkyDungeonRemoveRestraint(list[I].restraint.Group, false);
			}
			KinkyDungeonSendMessage(5, TextGet("KinkyDungeonSpellEscape"), "green", 4);
		} else if (eff.name == "Submit") {
			let params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
			KinkyDungeonCurseRestraint(KinkyDungeonGetRestraintItem("ItemArms"), "Orgasm")
			KinkyDungeonSendMessage(8, TextGet("KinkyDungeonSpellImprison"), "yellow", 4);
		} else if (eff.name == "Clarify") {
			let count = KinkyDungeonDispelBuff(KinkyDungeonPlayerBuffs, true);
			if (count) KinkyDungeonSendMessage(5, TextGet("KinkyDungeonDispelBuffPlayer"), "yellow", 4);
		} else if (eff.name == "Teleport") {
			for (let B = 0; B < KinkyDungeonBullets.length; B++) {
				let b2 = KinkyDungeonBullets[B];
				if (b2.spell == b.spell && b2 != b) {
					KinkyDungeonMoveTo(b2.x, b2.y);
					// set b and b2 to pre...
					b.cooldown = b.update + 3;
					b2.cooldown = b.update + 3;
					KinkyDungeonUpdateLightGrid	= true;
					KinkyDungeonAction = Math.min(KinkyDungeonAction, KinkyDungeonClock);
					break;
				}
			}
		} 
		// not checked yet
		else if (eff.name == "SlimeTrap") {
			KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("StickySlime"));
			KinkyDungeonPlayerFreeze(1);
			KinkyDungeonSendMessage(7, TextGet("KinkyDungeonSlime"), "red", playerEffect.time);

			if (spell.power > 0) {
				KinkyDungeonDealDamage(damage);
			}
		} else if (eff.name == "Shock") {
			KinkyDungeonPlayerStun(eff.time);
			KinkyDungeonDealDamage({damage:b.damage, type:b.type, time:b.time});
			KinkyDungeonSendMessage(9, TextGet("KinkyDungeonShock"), "red", eff.time);
		} else if (eff.name == "MysticShock") {
			KinkyDungeonPlayerStun(eff.time);
			KinkyDungeonSendMessage(7, TextGet("KinkyDungeonMysticShock"), "red", eff.time);
		} else if (eff.name == "SingleRope" || eff.name == "BanditBola") {
			if (eff.name == "BanditBola") {
				KinkyDungeonPlayerSlow(1, eff.time);
			}
			let restraintAdd = KinkyDungeonGetRestraint({attacktags: ["ropeRestraints"]}, MiniGameKinkyDungeonLevel + (b.damage || 1), KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (restraintAdd) {
				KinkyDungeonAddRestraintIfWeaker(restraintAdd, (b.damage || 1));
				KinkyDungeonSendMessage(7, TextGet("KinkyDungeonSingleRope"), "red", eff.time);
			} else {
				KinkyDungeonPlayerSlow(1, eff.time);
				KinkyDungeonSendMessage(6, TextGet("KinkyDungeonSlowedBySpell"), "yellow", eff.time);
//				KinkyDungeonDealDamage({damage: spell.power*2, type: spell.damage});
			}

		} else if (eff.name == "RopeEngulf") {
			let added = [];
			for (let i = 0; i < playerEffect.power; i++) {
				let restraintAdd = KinkyDungeonGetRestraint({attacktags: ["ropeMagicStrong", "ropeAuxiliary", "clothRestraints", "tapeRestraints"]}, MiniGameKinkyDungeonLevel + spell.power, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
				if (restraintAdd && KinkyDungeonAddRestraintIfWeaker(restraintAdd, spell.power)) added.push(restraintAdd);
			}
			if (added.length > 0) {
				KinkyDungeonSendMessage(7, TextGet("KinkyDungeonRopeEngulf"), "red", 3);
			} else {
				let RopeDresses = ["Leotard", "Bikini", "Lingerie"];
				if (!RopeDresses.includes(KinkyDungeonCurrentDress)) {
					KinkyDungeonSetDress(RopeDresses[Math.floor(Math.random() * RopeDresses.length)]);
					KinkyDungeonDressPlayer();
					KinkyDungeonSendMessage(3, TextGet("KinkyDungeonRopeEngulfDress"), "red", 3);
				} else KinkyDungeonSetFlag("kraken", 10);
			}
		}
	}
}

function KinkyDungeoCheckComponents(spell, checkCost = true, onlyFailed = true, returntable = false) {
	if (checkCost) {
		let recastFlag = KinkyDungeonGetRecastFlag(spell);
		if (spell.willcost && !recastFlag && (!onlyFailed || (KinkyDungeonStatWillpower < spell.willcost))) return "Willpower";
		if (spell.staminacost && !recastFlag && (!onlyFailed || (KinkyDungeonStatStamina < spell.staminacost))) return "Stamina";
		if (spell.arousalcost && !recastFlag && (!onlyFailed || (KinkyDungeonStatArousal < spell.arousalcost))) return "Arousal";
		if (spell.manacost && !recastFlag && (!onlyFailed || (KinkyDungeonStatMana < spell.manacost))) return "Mana";
	}
	let componentlist = ["Verbal", "Silent", "Visible", "Blind", "ArmsFree", "ArmsBound", "LegsFree", "LegsBound", "Kneel", "Stand",
		"ArousalHigh", "ArousalLow", "WillHigh", "WillLow", "StaminaHigh", "StaminaLow", "ManaHigh", "ManaLow"];
	if (returntable) {
		let ret = [];
		for (let comp of componentlist) if (spell.components.includes(comp)) ret.push(comp);
		return ret;
	}
	if (!onlyFailed) {
		for (let comp of componentlist) if (spell.components.includes(comp)) return comp;
	}
	if (KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Silence")) return "Silenced";
	let componentcheck = {
		Verbal: function () {return !KinkyDungeonPlayer.CanTalk();},
		Visible: function () {return KinkyDungeonPlayer.GetBlindLevel() > 1;},
		ArmsFree: function () {return (InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemArms"), "Block", true) || InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ItemArms"));},
		LegsFree: function () {return (!KinkyDungeonPlayer.CanWalk() || InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemLegs"), "Block", true) || InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemLegs"), "KneelFreeze", true));},
		Kneel: function () {return (!KinkyDungeonPlayer.Pose.includes("Kneel") && !KinkyDungeonPlayer.Pose.includes("Hogtied"));},
		ArousalHigh: function () {return KinkyDungeonStatArousal < 50;},
		WillHigh: function () {return KinkyDungeonStatWillpower < 50;},
		StaminaHigh: function () {return KinkyDungeonStatStamina < 50;},
		ManaHigh: function () {return KinkyDungeonStatMana < 50;},
	}
	for (let I = 0; I < componentlist.length; I+=2) {
		if (componentcheck[componentlist[I]]()) {
			if (spell.components.includes(componentlist[I])) return componentlist[I];
		} else if (spell.components.includes(componentlist[I+1])) return componentlist[I+1];
	}
	return "";
}

function KinkyDungeonCheckSpellValid(spell, x, y) {
	if (!spell) return false;
	let isProjectile = KinkyDungeonIsProjectile(spell);
	if (!isProjectile && spell.start.range && spell.start.range < Math.sqrt((x - KinkyDungeonPlayerEntity.x) * (x - KinkyDungeonPlayerEntity.x) + (y - KinkyDungeonPlayerEntity.y) * (y - KinkyDungeonPlayerEntity.y))) return false;
	let target = (spell.Target || []);
	let isPlayer = (KinkyDungeonPlayerEntity.x == x && KinkyDungeonPlayerEntity.y == y);
	let isEnemy = (KinkyDungeonEnemyAt(x, y));
	if (target.includes("Player") || target.includes("Enemy")) {
		if (target.includes("Player") && isPlayer) return true;
		if (target.includes("Enemy") && isEnemy) return true;
		return false;
	}
	if (isPlayer && (target.includes("noPlayer") || isProjectile)) return false;
	if (isEnemy && target.includes("noEnemy")) return false;
	if (target.includes("needVision") && !KinkyDungeonCheckPath(x, y, KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, true)) return false;
	if (isProjectile) return true;
	for (let T = 0; T < target.length; T++) {
		if (target[T].startsWith("ignoreTerrain")) {
			let terrain = target[T].slice(13);
			if (terrain.includes(KinkyDungeonMapGet(x, y))) return true;
		}
	}
	if (KinkyDungeonOpenObjects.includes(KinkyDungeonMapGet(x, y))) return true;
	return false;					
}

function KinkyDungeonHandleSpellChoice(SpellChoice) {
	let spell = KinkyDungeonSpells[SpellChoice];
	if (KinkyDungeoCheckComponents(spell)) {
		KinkyDungeonSendMessage(5, TextGet("KinkyDungeonComponentsFail" + KinkyDungeoCheckComponents(spell)), "red", 1);
		KinkyDungeonTargetingSpell = null;
		return null;
	} else return spell;
}

function KinkyDungeonHandleSpell(spell = null) {
	if (KinkyDungeonSpells[KinkyDungeonSpellChoices[0]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[0]].passive && KinkyDungeonSpellPress == KinkyDungeonKeySpell[0]) {
		spell = KinkyDungeonHandleSpellChoice(KinkyDungeonSpellChoices[0]);
	} else if (KinkyDungeonSpells[KinkyDungeonSpellChoices[1]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[1]].passive && KinkyDungeonSpellPress == KinkyDungeonKeySpell[1]) {
		spell = KinkyDungeonHandleSpellChoice(KinkyDungeonSpellChoices[1]);
	} else if (KinkyDungeonSpells[KinkyDungeonSpellChoices[2]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[2]].passive && KinkyDungeonSpellPress == KinkyDungeonKeySpell[2]) {
		spell = KinkyDungeonHandleSpellChoice(KinkyDungeonSpellChoices[2]);
	}
	if (spell) {
		// Handle spell activation
		KinkyDungeonTargetingSpell = spell;
		KinkyDungeonSendMessage(5, TextGet("KinkyDungeonSpellTarget" + spell.name).replace("SpellArea", "" + Math.floor(spell.aoe)), "white", 1);
		return true;
	}
	KinkyDungeonSpellPress = 0;
	return false;
}

function KinkyDungeonCanLearnSpell(spell) {
	if (!spell || !spell.school || !spell.level) return null;
	if (KinkyDungeonSpellIndex(spell.name)>=0) return "Learnt";
	let ret = "";
	if (KinkyDungeonSpellPoints[spell.school] < spell.level) ret = ret + "NoPoint";
	if (KinkyDungeonSpellLevel[spell.school] < [0, 1, 3, 6][spell.level - 1]) ret = ret + "NoAcc";
	if (spell.prerequisites && KinkyDungeonSpellIndex(spell.prerequisites)<0) ret = ret + "NoReq";
	return (ret == ""?"OK":ret);
}

function KinkyDungeonResetLearnedMagic() {
	while (KinkyDungeonSpells.length > 0) {
		let spell = KinkyDungeonSpells.pop();
		KinkyDungeonSpellPoints[spell.school] += spell.level * 0.8;
		KinkyDungeonSpellLevel[spell.school] -= spell.level;
	}
	for (let S of KinkyDungeonBooks) KinkyDungeonSpellPoints[K] = Math.round(KinkyDungeonSpellPoints[K]);
	KinkyDungeonPreviewSpell = undefined;
	KinkyDungeonSpellChoices = [0, 1, 2];
	KinkyDungeonSpellChoiceCount = 3;
	KinkyDungeonSpellPress = 0;
	KinkyDungeonCurrentPage = 0;
	KinkyDungeonCurrentSpellsPage = 0;
}

function KinkyDungeonGetRecastFlag(spell, act = false) {
	if (!spell.recast) return false;
	let ret = false;
	if (spell.recast == "Dismiss") {
		for (let I = 0; I < KinkyDungeonEntities.length; I++) {
			if (KinkyDungeonEntities[I].Enemy.name == spell.dismiss) {
				if (act) {KinkyDungeonEntities.splice(I, 1); I--;}
				ret = true;
			}
		}
	}
	if (spell.recast == "Expire") {
		for (let I = 0; I < KinkyDungeonBullets.length; I++) {
			if (KinkyDungeonBullets[I].spell == spell) {
				if (act) {KinkyDungeonBullets.splice(I, 1); I--;}
				ret = true;
			}
		}
	}
	return ret;
}

function KinkyDungeonCastSpell(targetX, targetY, spell, enemy, player) {
	let entity = KinkyDungeonPlayerEntity;
	let moveDirection = KinkyDungeonMoveDirection;
	let miscastChance = 0;
	let tX = targetX;
	let tY = targetY;
	let miscast = false;
	// miscast chance
	if (spell.school == "Elements") miscastChance = Math.min(0.75, Math.max(0, KinkyDungeonArousalRate(true) - 0.2));
	if (spell.school == "Conjure") miscastChance = Math.min(0.75, 0.6 - Math.max(0, KinkyDungeonStatMana / Math.max(100, KinkyDungeonStatManaMax)));
	if (spell.school == "Illusion") miscastChance = Math.min(0.75, 0.8 - Math.max(0, KinkyDungeonStatWillpower / Math.max(100, KinkyDungeonStatWillpowerMax)));
	if (enemy) {
		entity = enemy;
		moveDirection = KinkyDungeonGetDirection(player.x - entity.x, player.y - entity.y);
		miscastChance = 0;
	}
	if (spell.miscast == "Never") miscastChance = 0;
	let tampered = KinkyDungeonSpellTampered();
	if (tampered) {
		miscastChance = 1;
		KinkyDungeonDealDamage({damage:tampered.restraint.dmg, type:"electric"});
		KinkyDungeonSendMessage(8, TextGet("KinkyDungeonSpellTampered").replace("RESTRAINT", TextGet("Restraint"+tampered.restraint.name)), "red", 2);
	}
		




	if (Math.random() < miscastChance) {

		KinkyDungeonSendMessage(5, TextGet("KinkyDungeonSpellMiscast"), "#FF8800", 2);

		moveDirection = {x:0, y:0, delta:1};
		tX = entity.x;
		tY = entity.y;
		miscast = true;
	}
	// spell power
	let bulletdamages = {};
	for (let bullet in spell) if (typeof(spell[bullet]) == "object" && spell[bullet].damage) {
		let spellPower = spell[bullet].damage;
		if (KinkyDungeonPlayerWeapon && KinkyDungeonWeapons[KinkyDungeonPlayerWeapon] && KinkyDungeonWeapons[KinkyDungeonPlayerWeapon].spell)
			spellPower += KinkyDungeonWeapons[KinkyDungeonPlayerWeapon].spell;
		if (spell[bullet].levelboost) spellPower += KinkyDungeonSpellLevel[spell.school] * spell[bullet].levelboost;
		bulletdamages[bullet] = spellPower;
	}
	let recastFlag = KinkyDungeonGetRecastFlag(spell, true);
	// launch spell
	if (!recastFlag && (!miscast || spell.miscast == "Continue") ) {
		// prefix things
		if (spell.recast == "Replace") {
			for (let B=0; B<KinkyDungeonBullets.length; B++) if (KinkyDungeonBullets[B].spell == spell) {KinkyDungeonBullets.splice(B, 1); B--;}
		}
		
		let vx = 0;
		let vy = 0;
		if (KinkyDungeonIsProjectile(spell)) {
			vx = (tX - entity.x);
			vy = (tY - entity.y);
			if (vx != 0 || vy != 0) {
				let dist = Math.sqrt(vx * vx + vy * vy);
				vx = vx * spell.start.speed / dist;
				vy = vy * spell.start.speed / dist;
			}
			tX = entity.x + moveDirection.x;
			tY = entity.y + moveDirection.y;
		}
		KinkyDungeonLaunchBullet(KinkyDungeonAction, "start", tX, tY, vx, vy, bulletdamages, spell);
	}
	if (!enemy && !recastFlag) { // Costs for the player
		KinkyDungeonSleepAwake();
		if (spell.manacost) {
			KinkyDungeonStatMana -= spell.manacost;
			KinkyDungeonChargeVibrators(spell.manacost);
			KinkyDungeonFillCurse("Residual", spell.manacost);
		}
		if (spell.staminacost) {
			KinkyDungeonStatStamina -= spell.staminacost;
		}
		if (spell.arousalcost) {
			KinkyDungeonStatArousal -= spell.arousalcost;
		}
		if (spell.willcost) {
			KinkyDungeonStatWillpower -= spell.willcost;
		}
		KinkyDungeonAction += (spell.casttime?spell.casttime:1);
		if (!miscast) KinkyDungeonSendMessage(4, TextGet("KinkyDungeonSpellCast"+spell.name), "#88AAFF", 2);
	} else if (recastFlag) {
		KinkyDungeonSendMessage(5, TextGet("KinkyDungeonSpellReCast"+spell.name), "#88AAFF", 2);
	}
	// sideeffect
	if (spell.casteffect) {}

	return true;
}

function KinkyDungeonChargeVibrators(cost) {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let vibe = KinkyDungeonInventory[I];
		if (vibe.restraint && vibe.restraint.maxbattery > 0 && vibe.restraint.vibeType.includes("Charging")) {
			let launchEvent = (vibe.battery == 0);
			vibe.battery = Math.min(vibe.restraint.maxbattery, vibe.battery + cost);
			if (launchEvent) KinkyDungeonEventVibeChange(vibe);
		}
	}
}
//TODO
function KinkyDungeonHandleMagic() {
	//if (KinkyDungeonPlayer.CanInteract()) { // Allow turning pages
	if (KinkyDungeonCurrentPage > 0 && MouseIn(canvasOffsetX + 100, canvasOffsetY + 483*KinkyDungeonBookScale, 250, 60)) {
		if (KinkyDungeonPreviewSpell) KinkyDungeonPreviewSpell = undefined;
		else KinkyDungeonCurrentPage -= 1;
		return true;
	}
	if (KinkyDungeonCurrentPage < KinkyDungeonSpells.length-1 && MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale - 325, canvasOffsetY + 483*KinkyDungeonBookScale, 250, 60)) {
		if (KinkyDungeonPreviewSpell) KinkyDungeonPreviewSpell = undefined;
		else KinkyDungeonCurrentPage += 1;
		return true;
	}

	if (KinkyDungeonSpells[KinkyDungeonCurrentPage] && !KinkyDungeonPreviewSpell) {
		for (let I = 0; I < KinkyDungeonSpellChoiceCount; I++) {
			if ( KinkyDungeonSpellChoices[I] != null && KinkyDungeonSpells[KinkyDungeonSpellChoices[I]]) {
				if (!KinkyDungeonSpellChoices.includes(KinkyDungeonCurrentPage)) {
					if (MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale + 40, canvasOffsetY + 125 + I*200, 225, 60)) {
						KinkyDungeonSpellChoices[I] = KinkyDungeonCurrentPage;
						return true;
					}
				}
			}
		}
	} else if (KinkyDungeonPreviewSpell && MouseIn(canvasOffsetX + 640*KinkyDungeonBookScale + 40, canvasOffsetY + 125, 225, 60)) { // Learn
		let spell = KinkyDungeonPreviewSpell;
		let check = KinkyDungeonCanLearnSpell(spell);
		if (check == "OK") {
			KinkyDungeonSpellPoints[spell.school] -= spell.level;
			KinkyDungeonSpellLevel[spell.school] += spell.level;
			KinkyDungeonSpells.push(spell);
			AudioPlayInstantSound(KinkyDungeonRootDirectory + "/Audio/Magic.ogg");
			KinkyDungeonCurrentPage = KinkyDungeonSpellIndex(KinkyDungeonPreviewSpell.name);
			KinkyDungeonPreviewSpell = undefined;
			KinkyDungeonDoAction("Interact");				
			if (KinkyDungeonTextTime > KinkyDungeonClock)
				KinkyDungeonDrawState = "Game";
		} else if (check.includes("NoPoint")) {
			KinkyDungeonSendMessage(5, TextGet("KinkyDungeonSpellsNotEnoughPoints"), "orange", 1);
		} else if (check.includes("NoAcc")) {
			KinkyDungeonSendMessage(5, TextGet("KinkyDungeonSpellsNotEnoughLevels").replace("SCHOOL", TextGet("KinkyDungeonSpellsSchool" + spell.school)), "orange", 1);
		}
		return true;
	}

	if (MouseIn(650, 925, 355, 60)) {
		KinkyDungeonDrawState = "MagicSpells";
		return true;
	}
	return true;
}

function KinkyDungeonDrawMagic() {
	DrawImageZoomCanvas(KinkyDungeonRootDirectory + "MagicBook.png", MainCanvas, 0, 0, 640, 483, canvasOffsetX, canvasOffsetY, 640*KinkyDungeonBookScale, 483*KinkyDungeonBookScale, false);

	if (KinkyDungeonSpells[KinkyDungeonCurrentPage] || KinkyDungeonPreviewSpell) {
		let spell = KinkyDungeonPreviewSpell ? KinkyDungeonPreviewSpell : KinkyDungeonSpells[KinkyDungeonCurrentPage];

		DrawText(TextGet("KinkyDungeonSpell"+ spell.name), canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/5, "black", "silver");
		DrawText(TextGet("KinkyDungeonSpellsSchool" + spell.school), canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/3.8, "black", "silver");
		DrawRect(canvasOffsetX + 640*KinkyDungeonBookScale/3.35 - 38, canvasOffsetY + 483*KinkyDungeonBookScale/3.4, 76, 76, "black");
		DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Spells/" + spell.name + ".png", MainCanvas, 0, 0, 72, 72, canvasOffsetX + 640*KinkyDungeonBookScale/3.35 - 36, canvasOffsetY + 483*KinkyDungeonBookScale/3.4, 72, 72, false);
		DrawText(TextGet("KinkyDungeonMagicLevel") + spell.level, canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/2.2, "black", "silver");
		let i = 0;
		if (spell.manacost) { DrawText(TextGet("KinkyDungeonMagicManaCost") + spell.manacost, canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/2 + 195 - i * 40, "black", "silver"); i++;}
		if (spell.staminacost) { DrawText(TextGet("KinkyDungeonMagicStaminaCost") + spell.staminacost, canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/2 + 195 - i * 40, "black", "silver"); i++;}
		if (spell.arousalcost) { DrawText(TextGet("KinkyDungeonMagicArousalCost") + spell.arousalcost, canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/2 + 195 - i * 40, "black", "silver"); i++;}
		if (spell.willcost) { DrawText(TextGet("KinkyDungeonMagicWillCost") + spell.willcost, canvasOffsetX + 640*KinkyDungeonBookScale/3.35, canvasOffsetY + 483*KinkyDungeonBookScale/2 + 195 - i * 40, "black", "silver"); i++;}
		let text = TextGet("KinkyDungeonSpellDescription"+ spell.name);
		for (let keys in spell) if (typeof(spell[keys])=="object") {
			let damage = spell[keys].damage;
			if (damage && KinkyDungeonPlayerWeapon && KinkyDungeonWeapons[KinkyDungeonPlayerWeapon] && KinkyDungeonWeapons[KinkyDungeonPlayerWeapon].spell) damage += KinkyDungeonWeapons[KinkyDungeonPlayerWeapon].spell;
			if (damage && spell[keys].levelboost) damage += KinkyDungeonSpellLevel[spell.school] * spell[keys].levelboost;
			damage += KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "SpellDmg");
			damage = Math.round(damage*20)/20;
			text = text.replace("Damage"+keys, (damage!=spell[keys].damage)?"*"+damage+"*":""+damage).replace("Time"+keys, spell[keys].time);
		}
		let textSplit = KinkyDungeonWordWrap(text, 18).split('\n');
		for (let N = 0; N < textSplit.length; N++) {
			DrawText(textSplit[N],
				canvasOffsetX + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY + 483*KinkyDungeonBookScale/5 + N * 40, "black", "silver"); i++;}
		i = 0;
		let complist = KinkyDungeoCheckComponents(spell, false, false, true);
		if (complist.length>0) {
			for (i = 0; i < complist.length; i++) 
				DrawText(TextGet("KinkyDungeonComponents"+complist[i]), canvasOffsetX + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY + 483*KinkyDungeonBookScale/2 + 195 - 40*i, "black", "silver");
			DrawText(TextGet("KinkyDungeonComponents"), canvasOffsetX + 640*KinkyDungeonBookScale*(1-1/3.35), canvasOffsetY + 483*KinkyDungeonBookScale/2 + 195 - 40*i, "black", "silver");
		}

		if (!KinkyDungeonPreviewSpell)
			for (let I = 0; I < KinkyDungeonSpellChoiceCount; I++) {
				if ( KinkyDungeonSpellChoices[I] != null && KinkyDungeonSpells[KinkyDungeonSpellChoices[I]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[I]].passive) {
					DrawText(TextGet("KinkyDungeonSpellChoice" + I), canvasOffsetX + 640*KinkyDungeonBookScale + 150, canvasOffsetY + 50 + I*200, "white", "silver");
					DrawText(TextGet("KinkyDungeonSpell" + KinkyDungeonSpells[KinkyDungeonSpellChoices[I]].name), canvasOffsetX + 640*KinkyDungeonBookScale + 150, canvasOffsetY + 95 + I*200, "white", "silver");
				}
				if (!KinkyDungeonSpellChoices.includes(KinkyDungeonCurrentPage) && !KinkyDungeonSpells[KinkyDungeonCurrentPage].passive)
					DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale + 40, canvasOffsetY + 125 + I*200, 225, 60, TextGet("KinkyDungeonSpell" + I), "White", "", "");
			}
		else {
			DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale + 40, canvasOffsetY + 125, 225, 60, TextGet("KinkyDungeonSpellsBuy"),
				(KinkyDungeonCanLearnSpell(spell) == "OK") ? "White" : "Pink", "", "");
		}
	}

	if (KinkyDungeonCurrentPage > 0) {
		DrawButton(canvasOffsetX + 100, canvasOffsetY + 483*KinkyDungeonBookScale, 250, 60, TextGet("KinkyDungeonBookLastPage"), "White", "", "");
	}
	if (KinkyDungeonCurrentPage < KinkyDungeonSpells.length-1) {
		DrawButton(canvasOffsetX + 640*KinkyDungeonBookScale - 325, canvasOffsetY + 483*KinkyDungeonBookScale, 250, 60, TextGet("KinkyDungeonBookNextPage"), "White", "", "");
	}
	DrawButton(650, 925, 355, 60, TextGet("KinkyDungeonMagicSpells"), "White", "", "");
}

function KinkyDungeonListSpells(Mode) {
	let i = 0;
	let ii = 0;
	//let maxY = 560;
	let XX = 0;
	let YY = 0;
	let xspacing = 310;
	let yspacing = 100;
	let yPad = KinkyDungeonSpriteSize;
	let xPad = 240;
	let SpellIconDisplay = 72;

	for (let sp of KinkyDungeonLearnableSpells[KinkyDungeonBooks[KinkyDungeonCurrentSpellsPage]]) {
		let spell = KinkyDungeonFindSpell(sp, false);
		if (spell) {

			XX = (spell.level - 1) * xspacing + 25;
			YY = (spell.vpos - 1) * yspacing + 75;

			if (Mode == "Draw") {
				let canLearn = KinkyDungeonCanLearnSpell(spell);

				let color = ["#AAAAAA", "#333333"];
				if (canLearn == "OK") color = ["white", "#0000AA"];
				if (canLearn == "Learnt") color = ["white", "#00AA00"];
				if (canLearn == "NoReq") color = ["#AAAAAA", "#333388"];
				if (canLearn == "NoPoint") color = ["pink", "#550000"];

				if (canLearn == "OK") 
					DrawButton(canvasOffsetX + XX, canvasOffsetY + YY, xPad, yPad, "", color[1]);
				else
					DrawRect(canvasOffsetX + XX, canvasOffsetY + YY, xPad, yPad, color[1]);


				DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Spells/" + sp + ".png",
					MainCanvas, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize,
					canvasOffsetX + XX, canvasOffsetY + YY,
					SpellIconDisplay, SpellIconDisplay, false);


				DrawText(TextGet("KinkyDungeonSpell" + spell.name), canvasOffsetX + XX + SpellIconDisplay/2 + xPad/2, canvasOffsetY + YY + SpellIconDisplay/2, color[0], "silver")

				if (spell.prerequisites) {
					let fromXX = (KinkyDungeonFindSpell(spell.prerequisites, false).level - 1) * xspacing + 25 + xPad;
					DrawLineCorner(canvasOffsetX + fromXX, canvasOffsetY + YY + yPad/2,
						canvasOffsetX + XX, canvasOffsetY + YY + yPad/2,
						canvasOffsetX + XX - 12, canvasOffsetY + YY + yPad/2 - 12,
						3, canLearn.includes("NoReq")?"#555555":"white");
				}
				DrawEmptyRect(canvasOffsetX + XX, canvasOffsetY + YY, xPad, yPad, "white", 2);
			} else if (Mode == "Click") {
				if (MouseIn(canvasOffsetX + XX, canvasOffsetY + YY, xPad, yPad)) return spell;
			}
		}
	}
	return undefined;
}

function KinkyDungeonDrawMagicSpells() {

	DrawRect(canvasOffsetX+20, canvasOffsetY+20, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height+20, "black");
	KinkyDungeonListSpells("Draw");
	MainCanvas.textAlign = "center";
	
	DrawText(TextGet("KinkyDungeonSpellsPage") + KinkyDungeonBooks[KinkyDungeonCurrentSpellsPage], canvasOffsetX + 575, canvasOffsetY + 25, "white", "black");
	DrawText(TextGet("KinkyDungeonSpellsPoints").replace("ELEM", ""+KinkyDungeonSpellPoints.Elements).replace("CONJ", ""+KinkyDungeonSpellPoints.Conjure).replace("ILLU", ""+KinkyDungeonSpellPoints.Illusion), canvasOffsetX + 575, 860, "yellow", "black");

	MainCanvas.textAlign = "center";

	DrawText(TextGet("KinkyDungeonSpellsLevels")
		.replace("ELEMLEVEL", "" + KinkyDungeonSpellLevel.Elements)
		.replace("CONJLEVEL", "" + KinkyDungeonSpellLevel.Conjure)
		.replace("ILLULEVEL", "" + KinkyDungeonSpellLevel.Illusion), canvasOffsetX + 600, 900, "white", "black");

	DrawButton(canvasOffsetX + 50, canvasOffsetY, 250, 50, TextGet("KinkyDungeonSpellsPageBack"), "White", "", "");
	DrawButton(canvasOffsetX + 850, canvasOffsetY, 250, 50, TextGet("KinkyDungeonSpellsPageNext"), "White", "", "");

	DrawButton(650, 925, 355, 60, TextGet("KinkyDungeonMagicSpellsBack"), "White", "", "");
}


function KinkyDungeonHandleMagicSpells() {

	if (MouseIn(650, 925, 355, 60)) {
		KinkyDungeonDrawState = "Magic";
		return true;
	} else if (MouseIn(canvasOffsetX + 50, canvasOffsetY, 250, 50)) {
		if (KinkyDungeonCurrentSpellsPage > 0) KinkyDungeonCurrentSpellsPage -= 1;
		else KinkyDungeonCurrentSpellsPage = KinkyDungeonBooks.length - 1;
		return true;
	} else if (MouseIn(canvasOffsetX + 850, canvasOffsetY, 250, 50)) {
		if (KinkyDungeonCurrentSpellsPage < KinkyDungeonBooks.length - 1) KinkyDungeonCurrentSpellsPage += 1;
		else KinkyDungeonCurrentSpellsPage = 0;
		return true;
	}

	let spell = KinkyDungeonListSpells("Click");
	if (spell) {
		KinkyDungeonSetPreviewSpell(spell);
		return true;
	}

	return true;
}

function KinkyDungeonSpellIndex(Name) {
	for (let i = 0; i < KinkyDungeonSpells.length; i++) {
		if (KinkyDungeonSpells[i].name == Name) return i;
	}
	return -1;
}

function KinkyDungeonSetPreviewSpell(spell) {
	let index = KinkyDungeonSpellIndex(spell.name);
	KinkyDungeonPreviewSpell = index >= 0 ? null : spell;
	if (!KinkyDungeonPreviewSpell) KinkyDungeonCurrentPage = index;
	KinkyDungeonDrawState = "Magic";
}

function KinkyDungeonDiscoverSpell(book, Level, logtobook = false) {
	let list = [];
	for (let Spell of KinkyDungeonSpellList[book]) {
		if (!KinkyDungeonLearnableSpells[book].includes(Spell.name) && Level>=Spell.level) list.push(Spell);
	}
	let spell = list?list[Math.floor(Math.random() * list.length)]:null;
	if (spell && logtobook) KinkyDungeonLearnableSpells[book].push(spell.name);
	return spell;
}
