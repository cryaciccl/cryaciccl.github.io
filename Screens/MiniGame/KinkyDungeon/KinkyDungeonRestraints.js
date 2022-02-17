"use strict";
// Escape chances
// Struggle : How difficult it is to struggle out of the item. Shouldn't be below 0.1 as that would be too tedious. Negative values help protect against spells.
// Cut : How difficult it is to cut with a knife. Metal items should have 0, rope and leather should be low but possible, and stuff like tape should be high
// Remove : How difficult it is to get it off by unbuckling. Most items should have a high chance if they have buckles, medium chance if they have knots, and low chance if they have a difficult mechanism.
// Pick : How hard it is to pick the lock on the item. Higher level items have more powerful locks. The general formula is 0.33 for easy items, 0.1 for medium items, 0.05 for hard items, and 0.01 for super punishing items
// Unlock : How hard it is to reach the lock. Should be higher than the pick chance, and based on accessibility. Items like the

// Note that there is a complex formula for how the chances are manipulated based on whether your arms are bound. Items that bind the arms are generally unaffected, and items that bind the hands are unaffected, but they do affect each other

// Power is a scale of how powerful the restraint is supposed to be. It should roughly match the difficulty of the item, but can be higher for special items. Power 10 or higher might be totally impossible to struggle out of.

// These are groups that the game is not allowed to remove because they were tied at the beginning
let KinkyDungeonRestraintsLocked = [];

let KinkyDungeonMultiplayerInventoryFlag = false;
let KinkyDungeonItemDropChanceArmsBound = 0.2; // Chance to drop item with just bound arms and not bound hands.

let KinkyDungeonKeyJamChance = 0.33;
let KinkyDungeonKeyPickBreakAmount = 5; // Number of tries per pick on average
let KinkyDungeonPickBreakProgress = 0;
let KinkyDungeonKnifeBreakAmount = 8; // Number of tries per knife on average
let KinkyDungeonKnifeBreakProgress = 0;
let KinkyDungeonEnchKnifeBreakAmount = 24; // Number of tries per knife on average
let KinkyDungeonEnchKnifeBreakProgress = 0;

let KinkyDungeonMaxImpossibleAttempts = 3; // base, more if the item is close to being impossible

let KinkyDungeonEnchantedKnifeBonus = 0.1; // Bonus whenever you have an enchanted knife

var KinkyDungeonRestraints = [
	{name: "DuctTapeArms", 				removePrison: true, Asset: "DuctTape", 														Color: "#AA2222", Group: "ItemArms", playerTags: {"ItemArmsFull":8}, 																					power: -2, 	escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0}, 											minLevel: 0,weight: 0, 		enemyTags: {"ribbonRestraints":5}, 																shrine: ["Undead"]},
	{name: "DuctTapeFeet", 				removePrison: true, Asset: "DuctTape", 														Color: "#AA2222", Group: "ItemFeet", playerTags: {"ItemLegsFull":8}, 																					power: -2, 	escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0}, 											minLevel: 0,weight: 0, 		enemyTags: {"ribbonRestraints":5}, 																shrine: ["Undead"]},
	{name: "DuctTapeBoots", 			removePrison: true, Asset: "ToeTape", Type: "Full", 										Color: "#AA2222", Group: "ItemBoots", playerTags: {"ItemFeetFull":8}, 																					power: -2, 	escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0}, 											minLevel: 0,weight: 0, 		enemyTags: {"ribbonRestraints":5}, 																shrine: ["Undead"], 					slowboots: 0.4},
	{name: "DuctTapeLegs", 				removePrison: true, Asset: "DuctTape", 														Color: "#AA2222", Group: "ItemLegs", playerTags: {"ItemFeetFull":8}, 																					power: -2, 	escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0}, 											minLevel: 0,weight: 0, 		enemyTags: {"ribbonRestraints":5}, 																shrine: ["Undead"]},
	{name: "DuctTapeHead", 				removePrison: true, Asset: "DuctTape", Type: "Wrap", 										Color: "#AA2222", Group: "ItemHead", playerTags: {}, 																									power: -2, 	escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0}, 											minLevel: 0,weight: 0, 		enemyTags: {"ribbonRestraints":5}, 																shrine: ["Undead"]},
	{name: "DuctTapeMouth", 			removePrison: true, Asset: "DuctTape", 														Color: "#AA2222", Group: "ItemMouth2", playerTags: {"ItemMouth1Full":8}, 																				power: -2, 	escapeChance: {"Struggle": 0.3, "Cut": 0.9, "Remove": 0}, 											minLevel: 0,weight: 0, 		enemyTags: {"ribbonRestraints":5}, 																shrine: ["Undead"]},
	{name: "DuctTapeHeadMummy", 		removePrison: true, Asset: "DuctTape", Type: "Mummy", 										Color: "#AA2222", Group: "ItemHead", playerTags: {"ItemMouth1Full":2, "ItemMouth2Full":1}, 																power: 1,  	escapeChance: {"Struggle": 0.1, "Cut": 0.8, "Remove": 0}, 											minLevel: 0,weight: 0, 		enemyTags: {"UndeadAnger":99, "ribbonRestraints":1}, 											shrine: ["Undead"]},
	{name: "DuctTapeArmsMummy", 		removePrison: true, Asset: "DuctTape", Type: "Complete", remove: ["Cloth", "ClothLower"], 	Color: "#AA2222", Group: "ItemArms", playerTags: {"ItemArmsFull":3}, 																					power: 1,  	escapeChance: {"Struggle": 0.1, "Cut": 0.8, "Remove": 0}, 											minLevel: 0,weight: 0, 		enemyTags: {"UndeadAnger":99, "ribbonRestraints":1}, 											shrine: ["Undead"]},
	{name: "DuctTapeLegsMummy", 		removePrison: true, Asset: "DuctTape", Type: "CompleteLegs", remove: ["ClothLower"], 		Color: "#AA2222", Group: "ItemLegs", playerTags: {"ItemLegsFull":3}, 																					power: 1,  	escapeChance: {"Struggle": 0.1, "Cut": 0.8, "Remove": 0}, 											minLevel: 0,weight: 0, 		enemyTags: {"UndeadAnger":99, "ribbonRestraints":1}, 											shrine: ["Undead"]},
	{name: "DuctTapeFeetMummy", 		removePrison: true, Asset: "DuctTape", Type: "CompleteFeet", 								Color: "#AA2222", Group: "ItemFeet", playerTags: {"ItemFeetFull":3}, 																					power: 1,  	escapeChance: {"Struggle": 0.1, "Cut": 0.8, "Remove": 0}, 											minLevel: 0,weight: 0, 		enemyTags: {"UndeadAnger":99, "ribbonRestraints":1}, 											shrine: ["Undead"]},
	{name: "MysticDuctTapeHead", 		removePrison: true, Asset: "DuctTape", Type: "Wrap", 										Color: "#55AA22", Group: "ItemHead", playerTags: {"ItemMouth2Full":99, "ItemArmsFull":99, "ItemLegsFull":99, "ItemFeetFull":99, "ItemBootsFull":99}, 	power: 2,  	escapeChance: {"Struggle": 0.2, "Cut": 0.6, "Remove": 0}, 											minLevel: 0,weight: 0, 		enemyTags: {"mummyRestraints":-399}, 															shrine: ["Undead"]},
	{name: "MysticDuctTapeMouth", 		removePrison: true, Asset: "DuctTape", 														Color: "#55AA22", Group: "ItemMouth2", playerTags: {"ItemArmsFull":99, "ItemLegsFull":99, "ItemFeetFull":99, "ItemBootsFull":99}, 						power: 2,  	escapeChance: {"Struggle": 0.2, "Cut": 0.6, "Remove": 0}, 											minLevel: 0,weight: 0, 		enemyTags: {"mummyRestraints":-299}, 															shrine: ["Undead"]},
	{name: "MysticDuctTapeArmsMummy", 	removePrison: true, Asset: "DuctTape", Type: "Complete", remove: ["Cloth", "ClothLower"], 	Color: "#55AA22", Group: "ItemArms", playerTags: {"ItemLegsFull":99, "ItemFeetFull":99, "ItemBootsFull":99}, 											power: 4,  	escapeChance: {"Struggle": 0.05, "Cut": 0.5, "Remove": 0}, 											minLevel: 0,weight: 0, 		enemyTags: {"mummyRestraints":-199}, 															shrine: ["Undead"]},
	{name: "MysticDuctTapeLegsMummy", 	removePrison: true, Asset: "DuctTape", Type: "CompleteLegs", remove: ["ClothLower"], 		Color: "#55AA22", Group: "ItemLegs", playerTags: {"ItemFeetFull":99, "ItemBootsFull":99}, 																power: 4,  	escapeChance: {"Struggle": 0.05, "Cut": 0.5, "Remove": 0}, 											minLevel: 0,weight: 0, 		enemyTags: {"mummyRestraints":-99}, 															shrine: ["Undead"]},
	{name: "MysticDuctTapeFeetMummy", 	removePrison: true, Asset: "DuctTape", Type: "CompleteFeet", 								Color: "#55AA22", Group: "ItemFeet", playerTags: {"ItemBootsFull":99}, 																					power: 4,  	escapeChance: {"Struggle": 0.05, "Cut": 0.5, "Remove": 0}, 											minLevel: 0,weight: 0, 		enemyTags: {"mummyRestraints":-1}, 																shrine: ["Undead"]},
	{name: "MysticDuctTapeBoots", 		removePrison: true, Asset: "ToeTape", Type: "Full", 										Color: "#55AA22", Group: "ItemBoots", playerTags: {}, 																									power: 4,  	escapeChance: {"Struggle": 0.05, "Cut": 0.5, "Remove": 0}, 											minLevel: 0,weight: 0, 		enemyTags: {"mummyRestraints":100}, 															shrine: ["Undead"]},
	{name: "DuctTapeHands", 								Asset: "DuctTape", 														Color: "Default", Group: "ItemHands", playerTags: {"ItemHandsFull": -4}, 																				power: 0,  	escapeChance: {"Struggle": 0, "Cut": 0.4, "Remove": 0.1}, 											minLevel: 0,weight: 0, 		enemyTags: {"tapeRestraints":8}, 																shrine: ["Undead"]},
	/* ---																																																																							   	 																																																													*/
	{name: "WeakMagicRopeArms", 							Asset: "HempRope", 														Color: "#ff88AA", Group: "ItemArms", playerTags: {}, 																									power: 3,  	escapeChance: {"Struggle": 0.2, "Cut": 0.67, "Remove": 0.3}, 										minLevel: 0,weight: 1, 		enemyTags: {"ropeMagicWeak":2}, 																shrine: ["Rope"]},
	{name: "WeakMagicRopeLegs", 							Asset: "HempRope", Type: "FullBinding", 								Color: "#ff88AA", Group: "ItemLegs", playerTags: {}, 																									power: 3,  	escapeChance: {"Struggle": 0.2, "Cut": 0.67, "Remove": 0.3}, 										minLevel: 0,weight: 1, 		enemyTags: {"ropeMagicWeak":2}, 																shrine: ["Rope"]},
	{name: "StrongMagicRopeArms", 							Asset: "HempRope", 														Color: "#ff00dd", Group: "ItemArms", playerTags: {}, 																									power: 6,  	escapeChance: {"Struggle": 0.15, "Cut": 0.2, "Remove": -0.1}, 										minLevel: 0,weight: 1, 		enemyTags: {"RopeAnger":99, "ConjureAnger":99, "ropeMagicStrong":2, "trap": 5,},				shrine: ["Rope"]},
	{name: "StrongMagicRopeLegs", 							Asset: "HempRope", Type: "FullBinding", 								Color: "#ff00dd", Group: "ItemLegs", playerTags: {}, 																									power: 6,  	escapeChance: {"Struggle": 0.15, "Cut": 0.2, "Remove": -0.1}, 										minLevel: 0,weight: 1, 		enemyTags: {"RopeAnger":99, "ConjureAnger":99, "ropeMagicStrong":2, "trap": 5,},				shrine: ["Rope"]},
	{name: "StrongMagicRopeFeet", 							Asset: "HempRope", 														Color: "#ff00dd", Group: "ItemFeet", playerTags: {}, 																									power: 6,  	escapeChance: {"Struggle": 0.15, "Cut": 0.2, "Remove": -0.1}, 										minLevel: 0,weight: 1, 		enemyTags: {"RopeAnger":99, "ConjureAnger":99, "ropeMagicStrong":2, "trap": 5,},				shrine: ["Rope"]},
	{name: "StrongMagicRopeCrotch", 						Asset: "HempRope", Type: "OverPanties", OverridePriority: 26, 			Color: "#ff00dd", Group: "ItemPelvis", playerTags: {}, 																									power: 6,  	escapeChance: {"Struggle": 0.15, "Cut": 0.2, "Remove": -0.1}, 										minLevel: 0,weight: 1, 		enemyTags: {"RopeAnger":99, "ConjureAnger":99, "ropeMagicStrong":2, "trap": 5,},				shrine: ["Rope"]},
	{name: "StrongMagicRopeToe", 							Asset: "ToeTie", OverridePriority: 26, 									Color: "#ff00dd", Group: "ItemBoots", playerTags: {}, 																									power: 6,  	escapeChance: {"Struggle": 0.15, "Cut": 0.2, "Remove": -0.1}, 										minLevel: 0,weight: 1, 		enemyTags: {"RopeAnger":99, "ConjureAnger":99, "ropeMagicStrong":2, "trap": 5,},				shrine: ["Rope"]},
	{name: "RopeSnakeArms", 								Asset: "HempRope", 														Color: "Default", Group: "ItemArms", playerTags: {"ItemArmsFull":-1}, 																					power: 2,  	escapeChance: {"Struggle": 0.2, "Cut": 0.67, "Remove": 0.3}, 										minLevel: 0,weight: 0, 		enemyTags: {"ropeRestraints":4}, 																shrine: ["Rope"]},
	{name: "RopeSnakeArmsWrist", 							Asset: "HempRope", Type: "WristElbowHarnessTie", 						Color: "Default", Group: "ItemArms", playerTags: {"ItemArmsFull":-1}, 																					power: 2,  	escapeChance: {"Struggle": 0.2, "Cut": 0.67, "Remove": 0.3}, 										minLevel: 0,weight: 0, 		enemyTags: {"ropeRestraintsWrist":4}, 															shrine: ["Rope"]},
	{name: "RopeSnakeFeet", 								Asset: "HempRope", 														Color: "Default", Group: "ItemFeet", playerTags: {"ItemLegsFull":-1}, 																					power: 2,  	escapeChance: {"Struggle": 0.2, "Cut": 0.67, "Remove": 0.3}, 										minLevel: 0,weight: 0, 		enemyTags: {"ropeRestraints":4}, 																shrine: ["Rope"]},
	{name: "RopeSnakeLegs", 								Asset: "HempRope", Type: "FullBinding", 								Color: "Default", Group: "ItemLegs", playerTags: {"ItemFeetFull":-1}, 																					power: 2,  	escapeChance: {"Struggle": 0.2, "Cut": 0.67, "Remove": 0.3}, 										minLevel: 0,weight: 0, 		enemyTags: {"ropeRestraints":4}, 																shrine: ["Rope"]},
	{name: "RopeSnakeTorso", 								Asset: "HempRopeHarness", Type: "Waist", OverridePriority: 26, 			Color: "Default", Group: "ItemTorso", playerTags: {"ItemTorsoFull":-3}, 																				power: 2,  	escapeChance: {"Struggle": 0.1, "Cut": 0.67, "Remove": 0.3}, 										minLevel: 0,weight: 0, 		enemyTags: {"ropeRestraints2":4}, 																shrine: ["Rope"], 						harness: true, arousal:0.08},
	{name: "RopeSnakeCrotch", 								Asset: "HempRope", Type: "OverPanties", OverridePriority: 26, 			Color: "Default", Group: "ItemPelvis", playerTags: {"ItemPelvisFull":-3}, 																				power: 2,  	escapeChance: {"Struggle": 0.1, "Cut": 0.67, "Remove": 0.3}, 										minLevel: 0,weight: 0, 		enemyTags: {"ropeRestraints2":4}, 																shrine: ["Rope"], 						chastity: true, harness: true, arousal:0.08},
	{name: "RopeVibe", 					inventory: true, 	Asset: "HempRopeBelt", OverridePriority: 26, 							Color: "Default", Group: "ItemVulva", playerTags: {"ItemPelvisFull":-5}, 																				power: 2,  	escapeChance: {"Struggle": 0.1, "Cut": 0.67, "Remove": 0.3}, 										minLevel: 0,weight: 2, 		enemyTags: {"ElementsAnger":99, "ConjureAnger":99, "IllusionAnger":99, "ropeRestraints2":3}, 	shrine: ["Rope", "Vibe"],				harness: true, vibeType: "Charging", events: {name:"VibeChange"}, intensity: 1, battery: 0, maxbattery: 5},
	{name: "VinePlantArms", 			removePrison: true, Asset: "HempRope", 														Color: "#00FF44", Group: "ItemArms", playerTags: {"ItemArmsFull":-1}, 																					power: 4,	escapeChance: {"Struggle": 0.3, "Cut": 0.8, "Remove": 0.4}, 										minLevel: 0,weight: 0, 		enemyTags: {"ElementsAnger":99, "vineRestraints":4}, 											shrine: ["Rope"]},
	{name: "VinePlantFeet", 			removePrison: true, Asset: "HempRope", 														Color: "#00FF44", Group: "ItemFeet", playerTags: {"ItemLegsFull":-1}, 																					power: 4,	escapeChance: {"Struggle": 0.3, "Cut": 0.8, "Remove": 0.4}, 										minLevel: 0,weight: 0, 		enemyTags: {"ElementsAnger":99, "vineRestraints":4}, 											shrine: ["Rope"]},
	{name: "VinePlantLegs", 			removePrison: true, Asset: "HempRope", 														Color: "#00FF44", Group: "ItemLegs", playerTags: {"ItemFeetFull":-1}, 																					power: 4,	escapeChance: {"Struggle": 0.3, "Cut": 0.8, "Remove": 0.4}, 										minLevel: 0,weight: 0, 		enemyTags: {"ElementsAnger":99, "vineRestraints":4}, 											shrine: ["Rope"]},
	{name: "VinePlantTorso", 			removePrison: true, Asset: "HempRopeHarness", Type: "Diamond", OverridePriority: 26, 		Color: "#00FF44", Group: "ItemTorso", playerTags: {"ItemTorsoFull":-3}, 																				power: 4,	escapeChance: {"Struggle": 0.3, "Cut": 0.8, "Remove": 0.4}, 										minLevel: 0,weight: 0, 		enemyTags: {"ElementsAnger":99, "vineRestraints":4}, 											shrine: ["Rope"], 						harness: true, arousal:0.12},
	/* ---																																																																																																																																					*/
	{name: "Stuffing", 										Asset: "ClothStuffing",													Color: "Default", Group: "ItemMouth", playerTags: {}, 																									power: -20,	escapeChance: {"Struggle": 10, "Cut": 10, "Remove": 10}, 											minLevel: 0,weight: 0, 		enemyTags: {"stuffedGag": 100, "clothRestraints":10, "ribbonRestraints":6},       				shrine: []},
	{name: "ClothGag", 					inventory: true, 	Asset: "ClothGag", Type: "OTN", 										Color: "#888888", Group: "ItemMouth2", playerTags: {}, 																									power: 0,	escapeChance: {"Struggle": 0.5, "Cut": 1.0, "Remove": 0.8}, 										minLevel: 0,weight: 2, 		enemyTags: {"IllusionAnger":99, "clothRestraints":8}, 											shrine: ["Leather", "Gag"]},
	{name: "ClothBlindfold", 			inventory: true, 	Asset: "ClothBlindfold", 												Color: "#888888", Group: "ItemHead", playerTags: {}, 																									power: 0,	escapeChance: {"Struggle": 0.5, "Cut": 1.0, "Remove": 0.8}, 										minLevel: 0,weight: 2, 		enemyTags: {"IllusionAnger":99, "clothRestraints":8}, 											shrine: ["Leather", "Blindfold"]},
	{name: "SturdyLeatherBeltsArms", 						Asset: "SturdyLeatherBelts", Type: "Three", 							Color: "Default", Group: "ItemArms", playerTags: {"ItemArmsFull":-2}, 																					power: 2,  	escapeChance: {"Struggle": 0.0, "Cut": 0.5, "Remove": 0.8}, 										minLevel: 0,weight: 0, 		enemyTags: {"IllusionAnger":99, "leatherRestraints":6}, 										shrine: ["Leather", "Belt"]},
	{name: "SturdyLeatherBeltsFeet", 						Asset: "SturdyLeatherBelts", Type: "Three", 							Color: "Default", Group: "ItemFeet", playerTags: {"ItemLegsFull":-2}, 																					power: 2,  	escapeChance: {"Struggle": 0.0, "Cut": 0.5, "Remove": 0.8}, 										minLevel: 0,weight: 0, 		enemyTags: {"IllusionAnger":99, "leatherRestraints":6}, 										shrine: ["Leather", "Belt"]},
	{name: "SturdyLeatherBeltsLegs", 						Asset: "SturdyLeatherBelts", Type: "Two", 								Color: "Default", Group: "ItemLegs", playerTags: {"ItemFeetFull":-2}, 																					power: 2,  	escapeChance: {"Struggle": 0.2, "Cut": 0.5, "Remove": 0.8}, 										minLevel: 0,weight: 0, 		enemyTags: {"IllusionAnger":99, "leatherRestraints":6}, 										shrine: ["Leather", "Belt"]},
	{name: "KittyGag", 										Asset: "HarnessPanelGag", 												Color: "Default", Group: "ItemMouth2", playerTags: {}, 																									power: 5,  	escapeChance: {"Struggle": 0, "Cut": 0.3, "Remove": 0.4, "Pick": 0.2}, DefaultLock: "Red", 			minLevel: 0,weight: 2, 		enemyTags: {"kittyRestraints":8}, 																shrine: ["Leather", "Gag"]},
	{name: "KittyPaws", 									Asset: "PawMittens", 													Color: ["#444444","#444444","#444444","#B38295"], Group: "ItemHands", playerTags: {}, 																	power: 5,  	escapeChance: {"Struggle": 0.1, "Cut": 0.3, "Remove": 0.4, "Pick": 0.2}, 							minLevel: 6,weight: 2, 		enemyTags: {"kittyRestraints":8}, 																shrine: ["Leather"],					fistdmg:1.5},
	/* ---																																																																							   	 																																																													*/
	{name: "NormalBlindfold", 			inventory: true, 	Asset: "LeatherBlindfold", 												Color: "Default", Group: "ItemHead", playerTags: {}, 																									power: 3,  	escapeChance: {"Struggle": 0.3, "Cut": 0.6, "Remove": 0.65, "Pick": 0.5}, 							minLevel: 0,weight: 2, 		enemyTags: {"LeatherAnger":99, "trap":25, "leatherRestraintsHeavy":6, "ropeAuxiliary": 4}, 		shrine: ["Leather", "Blindfold"]},
	{name: "NormalGag", 				inventory: true, 	Asset: "BallGag", Type: "Tight", 										Color: ["Default", "Default"], Group: "ItemMouth", playerTags: {}, 																						power: 4,  	escapeChance: {"Struggle": 0.15, "Cut": 0.55, "Remove": 0.65, "Pick": 0.5}, 						minLevel: 0,weight: 2, 		enemyTags: {"trap":20, "leatherRestraintsHeavy":6}, 											shrine: ["Leather", "Gag"]},
	{name: "PanelGag", 					inventory: true, 	Asset: "HarnessPanelGag", 												Color: "#888888", Group: "ItemMouth2", playerTags: {}, 																									power: 5,  	escapeChance: {"Struggle": 0, "Cut": 0.3, "Remove": 0.4, "Pick": 0.5}, 								minLevel: 0,weight: 2, 		enemyTags: {"LeatherAnger":99, "leatherRestraintsHeavy":8, "ropeAuxiliary": 4, "trap":5}, 		shrine: ["Leather", "Gag"]},
	{name: "NormalArmbinder", 			inventory: true, 	Asset: "LeatherArmbinder", Type: "WrapStrap",							Color: "Default", Group: "ItemArms", playerTags: {}, 																									power: 8,  	escapeChance: {"Struggle": 0.1, "Cut": 0.5, "Remove": 0.35, "Pick": 0.0}, 							minLevel: 0,weight: 2, 		enemyTags: {"LeatherAnger":99, "trap":20}, 														shrine: ["Leather", "Armbinder"]},
	{name: "NormalCuffs", 				inventory: true, 	Asset: "MetalCuffs",													Color: "Default", Group: "ItemArms", playerTags: {}, 																									power: 4,  	escapeChance: {"Struggle": 0.0, "Cut": -0.1, "Remove": 10, "Pick": 2.5}, DefaultLock: "Red", 		minLevel: 0,weight: 2, 		enemyTags: {"LockAnger":99, "MetalAnger":99, "trap":15}, 										shrine: ["Metal", "Cuffs"]},
	{name: "NormalBoots", 				inventory: true, 	Asset: "BalletHeels", 													Color: "Default", Group: "ItemBoots", playerTags: {}, 																									power: 3,  	escapeChance: {"Struggle": 0.15, "Cut": 0.45, "Remove": 0.4, "Pick": 0.9}, 							minLevel: 0,weight: 2, 		enemyTags: {"LeatherAnger":99, "trap":20}, 														shrine: ["Leather", "Boots"], 			bootdmg:1.5, slowboots: 0.6},
	{name: "NormalLegirons", 			inventory: true, 	Asset: "Irish8Cuffs", 													Color: "Default", Group: "ItemFeet", playerTags: {}, 																									power: 4,  	escapeChance: {"Struggle": 0.0, "Cut": -0.4, "Remove": 10, "Pick": 2.5}, 							minLevel: 0,weight: 2, 		enemyTags: {"trap":10}, 																		shrine: ["Metal", "Cuffs"]},
	{name: "NormalHarness", 			inventory: true, 	Asset: "LeatherStrapHarness", OverridePriority: 26, 					Color: "#222222", Group: "ItemTorso", playerTags: {}, 																									power: 3,  	escapeChance: {"Struggle": 0.0, "Cut": 0.5, "Remove": 0.8, "Pick": 1.0}, 							minLevel: 0,weight: 2, 		enemyTags: {"LeatherAnger":99, "trap":25}, 														shrine: ["Leather"], 					harness: true, arousal:0.05},
	{name: "NormalBelt", 				inventory: true, 	Asset: "PolishedChastityBelt", OverridePriority: 27, 					Color: "Default", Group: "ItemPelvis", playerTags: {}, 																									power: 4,  	escapeChance: {"Struggle": 0.0, "Cut": -0.10, "Remove": 100.0, "Pick": 0.5}, 						minLevel: 0,weight: 2, 		enemyTags: {"DelightAnger":99, "LockAnger":99, "MetalAnger":99, "trap":25}, 					shrine: ["Metal", "Chastity"], 			chastity: true, trapAdd: "NormalVibe", arousal:0.06},
	{name: "NormalVibe", 				inventory: true, 	Asset: "TapedClitEgg", 													Color: "Default", Group: "ItemVulvaPiercings", playerTags: {}, 																							power: 1,  	escapeChance: {"Struggle": 0.1, "Cut": -10, "Remove": 10}, 											minLevel: 0,weight: 2, 		enemyTags: {"DelightAnger":99, },			 													shrine: ["Vibe"], 						vibeType: "ChargingRandom", events: {name:"VibeChange", remove:true}, intensity: 2, battery: 0, maxbattery: 25},
	{name: "NormalBra", 				inventory: true, 	Asset: "PolishedChastityBra", OverridePriority: 27, 					Color: "Default", Group: "ItemBreast", playerTags: {}, 																									power: 4,  	escapeChance: {"Struggle": 0.0, "Cut": -0.10, "Remove": 100.0, "Pick": 0.5}, 						minLevel: 0,weight: 2, 		enemyTags: {"DelightAnger":99, "LockAnger":99, "MetalAnger":99, "trap":25}, 					shrine: ["Metal", "Chastity"], 			chastity: true, trapAdd: "NormalBreastVibe", arousal:0.05},
	{name: "NormalBreastVibe", 			inventory: true, 	Asset: "TapedVibeEggs", 												Color: "Default", Group: "ItemNipples", playerTags: {}, 																								power: 1,  	escapeChance: {"Struggle": 0.1, "Cut": -10, "Remove": 10}, 											minLevel: 0,weight: 2, 		enemyTags: {"DelightAnger":99, }, 																shrine: ["Vibe"], 						vibeType: "ChargingRandom", events: {name:"VibeChange", remove:true}, intensity: 1, battery: 0, maxbattery: 5},
	{name: "NormalMittens", 			inventory: true, 	Asset: "LeatherMittens", 												Color: "Default", Group: "ItemHands", playerTags: {"ItemHandsFull":-2}, 																				power: 6,  	escapeChance: {"Struggle": 0.05, "Cut": 0.8, "Remove": 0.15, "Pick": 1.0}, 							minLevel: 0,weight: 0, 		enemyTags: {"leatherRestraintsHeavy":6}, 														shrine: ["Leather"],					fistdmg:1},
	/* ---																																																																							   	 																																																													*/
	{name: "FutuBlindfold", 			inventory: true, 	Asset: "InteractiveVisor", Type: "Blind", 								Color: ["#800000"], Group: "ItemHead", playerTags: {}, 																									power: 6,  	escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.5, "Pick": 0.0},  DefaultLock: "Blue",	minLevel: 0,weight: 1, 		enemyTags: {"trap":1},											 								shrine: ["Metal", "Blindfold"],			buffs:[{id:"FutuVision", type:"TerrainVision", power:6, img:"TerrainDigital"}]},
	{name: "FutuGag", 					inventory: true, 	Asset: "FuturisticHarnessBallGag", 										Color: ["#800000"], Group: "ItemMouth", playerTags: {}, 																								power: 5,  	escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.6, "Pick": 0.0},  DefaultLock: "Blue", 	minLevel: 2,weight: 1, 		enemyTags: {"trap":1}, 																			shrine: ["Metal", "Gag"],				buffs:[{id:"FutuMana", type:"restore_mp", power:0.3}]},
	{name: "FutuCuffs", 				inventory: true, 	Asset: "FuturisticCuffs", Type: "Both", 								Color: ["#800000"], Group: "ItemArms", playerTags: {}, 																									power: 9,  	escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.6, "Pick": 0.0},  DefaultLock: "Blue",	minLevel: 4,weight: 1, 		enemyTags: {"trap":1}, 																			shrine: ["Metal", "Cuffs"],				buffs:[{id:"FutuMagicalArmor", type:"MagicalArmor", power:3}]},
	{name: "FutuLegCuffs", 				inventory: true, 	Asset: "FuturisticLegCuffs", Type: "Closed", 							Color: ["#800000"], Group: "ItemLegs", playerTags: {}, 																									power: 6,  	escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.6, "Pick": 0.0},  DefaultLock: "Blue",	minLevel: 3,weight: 1, 		enemyTags: {"trap":1}, 																			shrine: ["Metal", "Cuffs"],				buffs:[{id:"FutuSpellLeg", type:"SpellDmg", power:2}]},
	{name: "FutuAnkleCuffs", 			inventory: true, 	Asset: "FuturisticAnkleCuffs", Type: "Closed", 							Color: ["#800000"], Group: "ItemFeet", playerTags: {}, 																									power: 6,  	escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.6, "Pick": 0.0},  DefaultLock: "Blue",	minLevel: 3,weight: 1, 		enemyTags: {"trap":1}, 																			shrine: ["Metal", "Cuffs"],				buffs:[{id:"FutuSpellAnkle", type:"SpellDmg", power:2}]},
	{name: "FutuArmbinder", 			inventory: true, 	Asset: "FuturisticArmbinder", Type: "Tight", 							Color: ["#800000"], Group: "ItemArms", playerTags: {}, 																									power: 9,  	escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.6, "Pick": 0.0},  DefaultLock: "Blue",	minLevel: 5,weight: 1, 		enemyTags: {"trap":1}, 																			shrine: ["Metal", "Armbinder"],			buffs:[{id:"FutuSlaveArmor", type:"SlaveArmor", power:3}]},
	{name: "FutuBoots", 				inventory: true, 	Asset: "FuturisticHeels2", 												Color: ["#800000"], Group: "ItemBoots", playerTags: {}, 																								power: 6,  	escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.6, "Pick": 0.0},  DefaultLock: "Blue",	minLevel: 3,weight: 1, 		enemyTags: {"trap":1}, 																			shrine: ["Metal", "Boots"], 			buffs:[{id:"FutuEvasion", type:"Evasion", power:1.5}], bootdmg:2.5, slowboots: 0.7},
	{name: "FutuHarn", 					inventory: true, 	Asset: "FuturisticHarness", Type: "Full", OverridePriority: 26, 		Color: ["#800000"], Group: "ItemTorso", playerTags: {}, 																								power: 5,  	escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.6, "Pick": 0.0},  DefaultLock: "Blue",	minLevel: 2,weight: 1, 		enemyTags: {"trap":1}, 																			shrine: ["Metal"], 						buffs:[{id:"FutuSkeleton", type:"MoveSpeedBoost", power:0.5}], harness: true, arousal:0.15},
	{name: "FutuBelt", 					inventory: true, 	Asset: "FuturisticChastityBelt",OverridePriority:26,Modules:[1,1,1,0,0],Color: ["#800000", "#800000"], Group: "ItemPelvis", playerTags: {}, 																					power: 5,  	escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.6, "Pick": 0.0},  DefaultLock: "Blue",	minLevel: 2,weight: 1, 		enemyTags: {"trap":1}, 																			shrine: ["Metal", "Chastity"], 			buffs:[{id:"FutuWarning", type:"AttackAcc", power:0.4}], vibeType: "ChargingTeaser", events: {name:"VibeChange", remove:true}, intensity:4, chastity: true, battery:50, maxbattery:50},
	{name: "FutuBelt2",					inventory: true, 	Asset: "FuturisticChastityBelt",OverridePriority:26,Modules:[3,1,1,0,0],Color: ["#800000", "#800000"], Group: "ItemPelvis", playerTags: {}, 																					power: 5,  	escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.6, "Pick": 0.0},  DefaultLock: "Blue",	minLevel: 3,weight: 1, 		enemyTags: {"trap":1}, 																			shrine: ["Metal", "Chastity"], 			buffs:[{id:"FutuWarning", type:"AttackAcc", power:0.4}], vibeType: "ChargingTeaser", events: {name:"VibeChange", remove:true}, intensity:4, chastity: true, orgasm:"edge", battery:25, maxbattery:50, tamperstruggle:0.3, dmg:3},
	{name: "FutuBra", 					inventory: true, 	Asset: "FuturisticBra",OverridePriority:26, Type: "Show2",				Color: ["#800000"], Group: "ItemBreast", playerTags: {}, 																								power: 5,  	escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.6, "Pick": 0.0},  DefaultLock: "Blue",	minLevel: 2,weight: 1, 		enemyTags: {"trap":1}, 																			shrine: ["Metal", "Chastity"], 			buffs:[{id:"FutuLife", type:"restore_sp", power:1}], vibeType: "ChargingTeaser", events: {name:"VibeChange", remove:true}, intensity:3, chastity: true, battery:50, maxbattery:50, tamperspell:0.2, dmg:2},
	{name: "FutuMittens", 				inventory: true, 	Asset: "FuturisticMittens", Type: "Mittens", 							Color: ["#800000"], Group: "ItemHands", playerTags: {}, 																								power: 9,  	escapeChance: {"Struggle": 0.0, "Cut": -0.25, "Remove": 0.7, "Pick": 0.0},  DefaultLock: "Blue",	minLevel: 5,weight: 1, 		enemyTags: {"trap":1}, 																			shrine: ["Metal"],						buffs:[{id:"FutuMitt", type:"AtkSpeedBoost", power:0.6}], fistdmg:2},
	/* ---																																																																							   	 																																																													*/
	{name: "ChainArms", 									Asset: "Chains", Type: "WristElbowHarnessTie", 							Color: "Default", Group: "ItemArms", playerTags: {"ItemArmsFull":-1}, 																					power: 5,  	escapeChance: {"Struggle": 0.1, "Cut": -0.1, "Remove": 0.5, "Pick": 1.5}, 							minLevel: 0,weight: 0, 		enemyTags: {"chainRestraints":2}, 																shrine: ["Chain", "Metal"]},
	{name: "ChainLegs", 									Asset: "Chains", Type: "Strict", 										Color: "Default", Group: "ItemLegs", playerTags: {"ItemLegsFull":-1}, 																					power: 5,  	escapeChance: {"Struggle": 0.1, "Cut": -0.1, "Remove": 0.5, "Pick": 1.5}, 							minLevel: 0,weight: 0, 		enemyTags: {"chainRestraints":2}, 																shrine: ["Chain", "Metal"]},
	{name: "ChainFeet", 									Asset: "Chains", 														Color: "Default", Group: "ItemFeet", playerTags: {"ItemFeetFull":-1}, 																					power: 5,  	escapeChance: {"Struggle": 0.0, "Cut": -0.1, "Remove": 0.5, "Pick": 1.5}, 							minLevel: 0,weight: 0, 		enemyTags: {"chainRestraints":2}, 																shrine: ["Chain", "Metal"]},
	{name: "ChainCrotch", 									Asset: "CrotchChain", OverridePriority: 26, 							Color: "Default", Group: "ItemTorso", playerTags: {"ItemPelvisFull":-1}, 																				power: 5,  	escapeChance: {"Struggle": 0.0, "Cut": -0.1, "Remove": 0.5, "Pick": 1.5}, 							minLevel: 0,weight: 0, 		enemyTags: {"chainRestraints":2}, 																shrine: ["Chain", "Metal"], 			chastity: true, harness: true},
	{name: "WristShackles", 			inventory: true, 	Asset: "WristShackles", Type: "Behind", 								Color: "Default", Group: "ItemArms",playerTags: {"ItemArmsFull":-1}, 																					power: 3,  	escapeChance: {"Struggle": 0.1, "Cut": -0.25, "Remove": 10, "Pick": 5},  DefaultLock: "Red",		minLevel: 0,weight: 2, 		enemyTags: {"CuffsAnger":99, "shackleRestraints":2, "trap":5}, 									shrine: ["Metal", "Cuffs"]},
	{name: "AnkleShackles", 			inventory: true, 	Asset: "AnkleShackles", 												Color: "Default", Group: "ItemFeet",playerTags: {"ItemFeetFull":-1}, 																					power: 2,  	escapeChance: {"Struggle": 0.1, "Cut": -0.3, "Remove": 10, "Pick": 5}, 	 DefaultLock: "Red",		minLevel: 0,weight: 2, 		enemyTags: {"LockAnger":99, "MetalAnger":99, "shackleRestraints":2, "trap":25}, 				shrine: ["Metal", "Cuffs"]},
	{name: "LegShackles", 				inventory: true, 	Asset: "OrnateLegCuffs", Type: "Closed", 								Color: ["#777777", "#AAAAAA"], Group: "ItemLegs", playerTags: {"ItemLegsFull":-1}, 																		power: 3,  	escapeChance: {"Struggle": 0.2, "Cut": -0.3, "Remove": 10, "Pick": 5}, 	 DefaultLock: "Red",		minLevel: 0,weight: 2, 		enemyTags: {"CuffsAnger":99, "shackleRestraints":2, "trap":5}, 									shrine: ["Metal", "Cuffs"]},
	{name: "FeetShackles", 				inventory: true, 	Asset: "OrnateAnkleCuffs", Type: "Closed", 								Color: ["#777777", "#AAAAAA"], Group: "ItemFeet", playerTags: {"ItemFeetFull":-1}, 																		power: 5,  	escapeChance: {"Struggle": 0.15, "Cut": -0.3, "Remove": 10, "Pick": 5},  DefaultLock: "Red",		minLevel: 0,weight: 2, 		enemyTags: {"CuffsAnger":99, "shackleRestraints":2, "trap":5}, 									shrine: ["Metal", "Cuffs"]},
	{name: "SteelMuzzleGag", 			inventory: true, 	Asset: "MuzzleGag", 													Color: "#999999", Group: "ItemMouth2", playerTags: {"ItemMouthFull":1}, 																				power: 3,  	escapeChance: {"Struggle": 0.2, "Cut": -0.25, "Remove": 10, "Pick": 5},  DefaultLock: "Red",		minLevel: 0,weight: 2, 		enemyTags: {"LockAnger":99, "MetalAnger":99, "shackleGag":1, "trap":5}, 						shrine: ["Metal", "Gag"]},
	/* ---																																																																							   	 																																																													*/
	{name: "GhostCollar", 				 	 	 	 	 	Asset: "OrnateCollar",  												Color: ["#777777", "#AAAAAA"], Group: "ItemNeck", playerTags: {}, 																						power: 20, 	escapeChance: {"Struggle": -100, "Cut": -0.8, "Remove": -100}, 										minLevel: 0,weight: 0, 		enemyTags: {"DisciplineAnger":99}, 																shrine: [], 							magic: true, difficultyBonus: 30, DefaultCurse:"Shrine", DefaultCurseType:"Discipline"},
	{name: "BasicCollar", 									Asset: "LeatherCollar", 												Color: ["#000000", "Default"], Group: "ItemNeck", playerTags: {"ItemNeckFull":-2}, 																		power: 1,  	escapeChance: {"Struggle": 0.0, "Cut": 0.15, "Remove": 0.5, "Pick": 0.75}, 							minLevel: 0,weight: 0, 		enemyTags: {"leashing":2}, 																		shrine: ["Leather"]},
	{name: "BasicLeash", 				removePrison: true, Asset: "CollarLeash", 													Color: "Default", Group: "ItemNeckRestraints", playerTags: {"ItemNeckRestraintsFull":-2, "ItemNeckFull":99},											power: 1,  	escapeChance: {"Struggle": 0.0, "Cut": -0.1, "Remove": 0.5, "Pick": 1.25}, 							minLevel: 0,weight: -99, 	enemyTags: {"leashing":2}, 																		shrine: [], 							leash: true, harness: true},
	/* ---																																																																							   	 																																																													*/
	{name: "StickySlime", 				removePrison: true, Asset: "Web", Type: "Wrapped", 											Color: "#ff77ff", Group: "ItemArms", playerTags: {}, 																									power: 0.1,	escapeChance: {"Struggle": 10, "Cut": 10, "Remove": 10}, 											minLevel: 0,weight: 1, 		enemyTags: {"slime":100}, 																		shrine: ["Slime"], 						freeze: true},
	{name: "TentacleArms", 									Asset: "Tentacles", Type: "OverTheHead", 								Color: "Default", Group: "ItemArms", playerTags: {"ItemArmsFull":-1}, 																					power: 6,  	escapeChance: {"Struggle": 0.6, "Cut": 0.4, "Remove":0.0}, 											minLevel: 0,weight: 0, 		enemyTags: {"DelightAnger":99, "TentacleRestraints":6}, 										shrine: ["Fantasy"], 					arousal:0.06, freeze: true, magic: true, orgasm: "noresist"},
	{name: "TentacleFeet", 									Asset: "Tentacles", Type: "Closed", 									Color: "Default", Group: "ItemFeet", playerTags: {"ItemFeetFull":-1}, 																					power: 6,  	escapeChance: {"Struggle": 0.6, "Cut": 0.4, "Remove":0.0}, 											minLevel: 0,weight: 0, 		enemyTags: {"DelightAnger":99, "TentacleRestraints":6}, 										shrine: ["Fantasy"], 					arousal:0.14, freeze: true, magic: true, orgasm: "noresist"},
	{name: "TentacleMouth", 								Asset: "Tentacles", 													Color: "Default", Group: "ItemMouth3", playerTags: {"ItemMouth3Full":-1}, 																				power: 6,  	escapeChance: {"Struggle": 0.6, "Cut": 0.4, "Remove":0.0}, 											minLevel: 0,weight: 0, 		enemyTags: {"DelightAnger":99, "TentacleRestraints":6},											shrine: ["Fantasy"], 					arousal:0.1, freeze: true, magic: true, orgasm: "noresist"},
	{name: "TentacleHead", 									Asset: "Tentacles", 													Color: "Default", Group: "ItemHead", playerTags: {"ItemHeadFull":-1}, 																					power: 6,  	escapeChance: {"Struggle": 0.6, "Cut": 0.4, "Remove":0.0}, 											minLevel: 0,weight: 0, 		enemyTags: {"DelightAnger":99, "TentacleRestraints":6}, 										shrine: ["Fantasy"], 					arousal:0.08, freeze: true, magic: true, orgasm: "noresist"},
	{name: "TentacleLegs", 									Asset: "Tentacles", 													Color: "Default", Group: "ItemLegs", playerTags: {"ItemLegsFull":-1}, 																					power: 6,  	escapeChance: {"Struggle": 0.6, "Cut": 0.4, "Remove":0.0}, 											minLevel: 0,weight: 0, 		enemyTags: {"DelightAnger":99, "TentacleRestraints":6},											shrine: ["Fantasy"], 					arousal:0.2, freeze: true, magic: true, orgasm: "noresist"},
	{name: "SlimeBoots", 				removePrison: true, Asset: "ToeTape", Type: "Full", 										Color: "#9B49BD", Group: "ItemBoots", playerTags: {}, 																									power: 4,  	escapeChance: {"Struggle": 0.2, "Cut": 0, "Remove": 0},    											minLevel: 0,weight: 0, 		enemyTags: {"slimeRestraints":100}, 															shrine: ["Latex"], 						addTag: ["slime"], events: {name:"slimeSpread", remove:true}, slimeLevel: 1},
	{name: "SlimeFeet", 				removePrison: true, Asset: "DuctTape", Type: "CompleteFeet", OverridePriority: 24, 			Color: "#9B49BD", Group: "ItemFeet", playerTags: {"ItemBootsFull":15}, 																					power: 4,  	escapeChance: {"Struggle": 0.2, "Cut": 0, "Remove": 0},    											minLevel: 0,weight: -100, 	enemyTags: {"slimeRestraints":100}, 															shrine: ["Latex"], 						addTag: ["slime"], events: {name:"slimeSpread", remove:true}, slimeLevel: 1.5},
	{name: "SlimeLegs",  				removePrison: true, Asset: "SeamlessHobbleSkirt", remove: ["ClothLower"], 					Color: "#9B49BD", Group: "ItemLegs", playerTags: {"ItemFeetFull":2, "ItemBootsFull":2}, 																power: 4,  	escapeChance: {"Struggle": 0.15, "Cut": 0, "Remove": 0},   											minLevel: 0,weight: -102, 	enemyTags: {"slimeRestraints":100}, 															shrine: ["Latex"], 						addTag: ["slime"], events: {name:"slimeSpread", remove:true}, slimeLevel: 2},
	{name: "SlimeArms", 				removePrison: true, Asset: "StraitLeotard", remove: ["Bra"], Modules: [0, 0, 0, 0], 		Color: "#9B49BD", Group: "ItemArms", playerTags: {"ItemFeetFull":2, "ItemBootsFull":2, "ItemLegsFull":2}, 												power: 6,  	escapeChance: {"Struggle": 0.15, "Cut": 0, "Remove": 0},											minLevel: 0,weight: -102, 	enemyTags: {"slimeRestraints":100}, 															shrine: ["Latex"], 						addTag: ["slime"], events: {name:"slimeSpread", remove:true}, slimeLevel: 2.5},
	{name: "SlimeHands", 				removePrison: true, Asset: "DuctTape", 														Color: "#9B49BD", Group: "ItemHands", playerTags: {"ItemFeetFull":1, "ItemBootsFull":1, "ItemLegsFull":1, "ItemHeadFull":1}, 							power: 1,  	escapeChance: {"Struggle": 0.3, "Cut": 0, "Remove": 0},    											minLevel: 0,weight: -102, 	enemyTags: {"slimeRestraints":100}, 															shrine: ["Latex"], 						addTag: ["slime"], events: {name:"slimeSpread", remove:true}, slimeLevel: 1.5},
	{name: "SlimeHead", 				removePrison: true, Asset: "LeatherSlimMask", 												Color: "#9B49BD", Group: "ItemHead", playerTags: {"ItemFeetFull":1, "ItemBootsFull":1, "ItemLegsFull":1, "ItemHandsFull":1, "ItemArmsFull":1}, 			power: 4,  	escapeChance: {"Struggle": 0.15, "Cut": 0, "Remove": 0},											minLevel: 0,weight: -102, 	enemyTags: {"slimeRestraints":100}, 															shrine: ["Latex"], 						addTag: ["slime"], events: {name:"slimeSpread", remove:true}, slimeLevel: 1.5},
	{name: "HardSlimeBoots", 			removePrison: true, Asset: "ToeTape", Type: "Full", 										Color: "#9B49BD", Group: "ItemBoots", playerTags: {}, 																									power: 6,  	escapeChance: {"Struggle": 0, "Cut": 0.1, "Remove": 0}, 											minLevel: 0,weight: 0, 		enemyTags: {"LatexAnger":99, }, 																shrine: ["Latex"]},
	{name: "HardSlimeFeet", 			removePrison: true, Asset: "DuctTape", Type: "CompleteFeet", OverridePriority: 24, 			Color: "#9B49BD", Group: "ItemFeet", playerTags: {}, 																									power: 6,  	escapeChance: {"Struggle": 0, "Cut": 0.1, "Remove": 0}, 											minLevel: 0,weight: -100, 	enemyTags: {"LatexAnger":99, }, 																shrine: ["Latex"]},
	{name: "HardSlimeLegs", 			removePrison: true, Asset: "SeamlessHobbleSkirt", remove: ["ClothLower"], 					Color: "#9B49BD", Group: "ItemLegs", playerTags: {}, 																									power: 6,  	escapeChance: {"Struggle": 0, "Cut": 0.1, "Remove": 0}, 											minLevel: 0,weight: -102, 	enemyTags: {"LatexAnger":99, }, 																shrine: ["Latex"]},
	{name: "HardSlimeArms", 			removePrison: true, Asset: "StraitLeotard", remove: ["Bra"], Modules: [0, 0, 0, 0], 		Color: "#9B49BD", Group: "ItemArms", playerTags: {}, 																									power: 7,  	escapeChance: {"Struggle": 0, "Cut": 0.1, "Remove": 0}, 											minLevel: 0,weight: -102, 	enemyTags: {"LatexAnger":99, }, 																shrine: ["Latex"]},
	{name: "HardSlimeHands", 			removePrison: true, Asset: "DuctTape", 														Color: "#9B49BD", Group: "ItemHands", playerTags: {}, 																									power: 3,  	escapeChance: {"Struggle": 0.0, "Cut": 0.1, "Remove": 0}, 											minLevel: 0,weight: -102, 	enemyTags: {"LatexAnger":99, }, 																shrine: ["Latex"]},
	{name: "HardSlimeHead", 			removePrison: true, Asset: "LeatherSlimMask", 												Color: "#9B49BD", Group: "ItemHead", playerTags: {}, 																									power: 5,  	escapeChance: {"Struggle": 0.0, "Cut": 0.1, "Remove": 0}, 											minLevel: 0,weight: -102, 	enemyTags: {"LatexAnger":99, }, 																shrine: ["Latex"]},
	/* ---																																																																							   	 																																																													*/
	{name: "HighsecCollar", 			inventory: true, 	Asset: "AutoShockCollar",				 								Color: "#333333", Group: "ItemNeck", playerTags: {}, 																									power: 10, 	escapeChance: {"Struggle": 0.00, "Cut": 0.1, "Remove": 0.35, "Pick": 0.25}, DefaultLock: "Red", 	minLevel: 0,weight: 2, 		enemyTags: {"ElementsAnger":99, }, 																shrine: ["Leather"],					events: {name:"RestraintShock", remove:true}, orgasm: "ruin", tamperspell:0.3, dmg:2},
	{name: "HighsecArmbinder", 			inventory: true, 	Asset: "LeatherArmbinder", Type: "Strap", 								Color: "#333333", Group: "ItemArms", playerTags: {}, 																									power: 15, 	escapeChance: {"Struggle": 0.00, "Cut": 0.1, "Remove": 0.35, "Pick": 0.25}, DefaultLock: "Red", 	minLevel: 0,weight: 2, 		enemyTags: {"SacrificeAnger":99, }, 															shrine: ["Leather", "Armbinder"]},
	{name: "HighsecShackles", 			inventory: true, 	Asset: "AnkleShackles", 												Color: "Default", Group: "ItemFeet", playerTags: {}, 																									power: 12, 	escapeChance: {"Struggle": 0.00, "Cut": -0.5, "Remove": 1.1, "Pick": 0.4}, DefaultLock: "Red", 		minLevel: 0,weight: 2, 		enemyTags: {"FreezeAnger":99, "BootsAnger":99, }, 												shrine: ["Metal", "Cuffs"]},
	{name: "HighsecBallGag", 			inventory: true, 	Asset: "HarnessBallGag", Type: "Tight", 								Color: ["Default", "Default"], Group: "ItemMouth", playerTags: {}, 																						power: 8,  	escapeChance: {"Struggle": 0.00, "Cut": 0.0, "Remove": 0.5, "Pick": 0.25}, DefaultLock: "Red", 		minLevel: 0,weight: 2, 		enemyTags: {"GagAnger":99, "SilenceAnger":99, }, 												shrine: ["Leather", "Gag"]},
	{name: "HighsecLegbinder", 			inventory: true, 	Asset: "LegBinder", 													Color: "Default", Group: "ItemLegs", playerTags: {}, 																									power: 8,  	escapeChance: {"Struggle": 0.00, "Cut": 0.1, "Remove": 0.35, "Pick": 0.25}, DefaultLock: "Red", 	minLevel: 0,weight: 2, 		enemyTags: {"FreezeAnger":99, }, 																shrine: ["Leather", "Hobbleskirt"]},
	{name: "HighsecBlindfold", 			inventory: true,	Asset: "PrisonLockdownBlindfold", 										Color: "Default", Group: "ItemHead", playerTags: {}, 																									power: 25, 	escapeChance: {"Struggle": 0.0, "Cut": -1, "Remove": 1, "Pick": 0}, 								minLevel: 0,weight: 0, 		enemyTags: {"BlindfoldAnger":99, "BlindnessAnger":99}, 											shrine: []},
	{name: "PrisonVibe", 				inventory: true, 	Asset: "VibratingDildo", 												Color: "Default", Group: "ItemVulva", playerTags: {}, 																									power: 4,  	escapeChance: {"Struggle": 0.1, "Cut": -10, "Remove": 10}, 											minLevel: 0,weight: 2, 		enemyTags: {}, 																					shrine: ["Vibe"], 						plugSize: 1.0, vibeType: "ChargingTeaser", events: {name:"VibeChange", remove:true}, intensity: 3, orgasm: "ruin", battery: 30, maxbattery: 30},
	{name: "PrisonBelt", 				inventory: true, 	Asset: "PolishedChastityBelt", OverridePriority: 26, 					Color: "#444444", Group: "ItemPelvis", playerTags: {}, 																									power: 8,  	escapeChance: {"Struggle": 0.0, "Cut": -0.30, "Remove": 100.0, "Pick": 0.25}, DefaultLock: "Red",	minLevel: 0,weight: 2, 		enemyTags: {}, 																					shrine: ["Metal", "Chastity"], 			chastity: true, arousal:0.03},
	{name: "PrisonBelt2", 				inventory: true, 	Asset: "OrnateChastityBelt", OverridePriority: 26, 						Color: ["#272727", "#AA0000"], Group: "ItemPelvis", playerTags: {}, 																					power: 9,  	escapeChance: {"Struggle": 0.0, "Cut": -0.30, "Remove": 100.0, "Pick": 0.22}, DefaultLock: "Red",	minLevel: 0,weight: 2, 		enemyTags: {}, 																					shrine: ["Metal", "Chastity"], 			chastity: true, arousal:0.03},
	/* ---																																																																							   	 																																																													*/
	{name: "SacrificeYoke", 								Asset: "Yoke", 															Color: ["#003555", "#00FFFF"], Group: "ItemArms", playerTags: {}, 																						power: 20, 	escapeChance: {"Struggle": 0.0, "Cut": -1, "Remove": 1, "Pick": 0}, 								minLevel: 0,weight: 0, 		enemyTags: {"shrineSacrifice":100}, 															shrine: [],								buffs:[{id:"GoddessSacrificeAP", type:"restore_ap", power:3}, {id:"GoddessSacrifice", type:"MoveSpeedBoost", power:7}],},
	{name: "SilenceGag", 									Asset: "WiffleGag", Type: "Tight", 										Color: ["#003555", "#00FFFF"], Group: "ItemMouth", playerTags: {}, 																						power: 20, 	escapeChance: {"Struggle": 0.0, "Cut": -1, "Remove": 1, "Pick": 0}, 								minLevel: 0,weight: 0, 		enemyTags: {"shrineSilence":100}, 																shrine: [],								buffs:[{id:"GoddessSilenceDmg", type:"AttackDmg", power:4}, {id:"GoddessSilence", type:"AtkSpeedBoost", power:1}, {id:"GoddessSilenceMana", type:"Silence", power:1}],},
	{name: "BlindnessBlindfold", 							Asset: "PaddedBlindfold", 												Color: ["#003555", "#00FFFF"], Group: "ItemHead", playerTags: {}, 																						power: 20, 	escapeChance: {"Struggle": 0.0, "Cut": -1, "Remove": 1, "Pick": 0}, 								minLevel: 0,weight: 0, 		enemyTags: {"shrineBlindness":100}, 															shrine: [],								buffs:[{id:"GoddessBlindness", type:"AttackAcc", power:6}, {id:"GoddessBlindnessEva", type:"Evasion", power:6}],},
	{name: "FreezeSkirt", 									Asset: "HobbleSkirt", 													Color: ["#00A0A0", "#003555"], Group: "ItemLegs", playerTags: {}, 																						power: 20, 	escapeChance: {"Struggle": 0.0, "Cut": -1, "Remove": 1, "Pick": 0}, 								minLevel: 0,weight: 0, 		enemyTags: {"shrineFreeze":100}, 																shrine: [],								buffs:[{id:"GoddessFreeze", type:"SpellDmg", power:6}],},
	/* ---																																																																							   	 																																																													*/
	

];

function KinkyDungeonNewLevelRestraints() {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		if (KinkyDungeonInventory[I].restraint && KinkyDungeonInventory[I].lock == "Timer") {
			KinkyDungeonInventory[I].lockTimer -= 1;
			if (KinkyDungeonInventory[I].lockTimer <= 0) {
				KinkyDungeonInventory[I].lock = "";
				KinkyDungeonSendMessage(4, TextGet("KinkyDungeonTimerClockOpen"), "green", 3);
			}
		}
	}
	KinkyDungeonUpdateStruggleGroups();
}

function KinkyDungeonKeyGetPickBreakChance(modifier) {
	let mult = (modifier) ? modifier : 1.0;
	let chance = 0;

	KinkyDungeonPickBreakProgress += mult;

	if (KinkyDungeonPickBreakProgress > KinkyDungeonKeyPickBreakAmount/2) chance = (KinkyDungeonPickBreakProgress - KinkyDungeonKeyPickBreakAmount/2) / (KinkyDungeonKeyPickBreakAmount + 1); // Picks last anywhere from 2-7 uses

	return chance;
}
function KinkyDungeonGetKnifeBreakChance(modifier) {
	let mult = (modifier) ? modifier : 1.0;
	let chance = 0;

	KinkyDungeonKnifeBreakProgress += mult;

	if (KinkyDungeonKnifeBreakProgress > KinkyDungeonKnifeBreakAmount/2) chance = (KinkyDungeonKnifeBreakProgress - KinkyDungeonKnifeBreakAmount/2) / (KinkyDungeonKnifeBreakAmount + 1); // Knifes last anywhere from 4-12 uses

	return chance;
}
function KinkyDungeonGetEnchKnifeBreakChance(modifier) {
	let mult = (modifier) ? modifier : 1.0;
	let chance = 0;

	KinkyDungeonEnchKnifeBreakProgress += mult;

	if (KinkyDungeonEnchKnifeBreakProgress > KinkyDungeonEnchKnifeBreakAmount/2) chance = (KinkyDungeonEnchKnifeBreakProgress - KinkyDungeonEnchKnifeBreakAmount/2) / (KinkyDungeonEnchKnifeBreakAmount + 1);

	return chance;
}

function KinkyDungeonLock(item, lock) {
	item.lock = lock;
	item.pickProgress = 0;	
	if (lock == "Timer") item.lockTimer = 3+Math.random()*(KinkyDungeonGoddessRep.Ghost+50)/25;

	if (item.restraint && InventoryGet(KinkyDungeonPlayer, item.restraint.Group) && lock != "") {
		InventoryLock(KinkyDungeonPlayer, InventoryGet(KinkyDungeonPlayer, item.restraint.Group), "IntricatePadlock", Player.MemberNumber, true);
		if (!KinkyDungeonRestraintsLocked.includes(item.restraint.Group)) {
			if (lock.includes("Timer")) {
				InventoryLock(Player, InventoryGet(Player, item.restraint.Group), "TimerPadlock", null, true);
				for (let E = 0; E < Player.Appearance.length; E++)
					if (Player.Appearance[E].Asset.Group.Name == item.restraint.Group) {
					if (Player.Appearance[E].Property == null) Player.Appearance[E].Property = {};
					Player.Appearance[E].Property.RemoveTimer = Math.round(CurrentTime + 3600 * 1000);
					Player.Appearance[E].Property.RemoveItem = true;
					break;
				}
			}
			else if (lock.includes("Blue")) InventoryLock(Player, InventoryGet(Player, item.restraint.Group), "ExclusivePadlock", null, true);
			else InventoryLock(Player, InventoryGet(Player, item.restraint.Group), "IntricatePadlock", null, true);
		}
	} else {
		InventoryUnlock(KinkyDungeonPlayer, item.restraint.Group);
		if (!KinkyDungeonRestraintsLocked.includes(item.restraint.Group))
			InventoryUnlock(Player, item.restraint.Group);
	}
	KinkyDungeonUpdateStruggleGroups();
}

function KinkyDungeonGenerateLockRestraint(restraint, Floor, always = false) {
	if (restraint.escapeChance.Pick == undefined) return "";
	let level = (Floor) ? Floor : MiniGameKinkyDungeonLevel;

	let chance = (level == 0) ? 0 : KinkyDungeonBaseLockChance;
	chance += KinkyDungeonScalingLockChance * level / 10;

	if (always) chance = 1;

	if (Math.random() < chance || restraint.DefaultLock) {
		let locktype = Math.random();

		let modifiers = "";

		let GreenChance = Math.min(KinkyDungeonGreenLockChance + level * KinkyDungeonGreenLockChanceScaling, KinkyDungeonGreenLockChanceScalingMax);
		let YellowChance = Math.min(KinkyDungeonYellowLockChance + level * KinkyDungeonYellowLockChanceScaling, KinkyDungeonYellowLockChanceScalingMax);
		let BlueChance = Math.min(KinkyDungeonBlueLockChance + level * KinkyDungeonBlueLockChanceScaling, KinkyDungeonBlueLockChanceScalingMax);
		let TimerChance = Math.min(KinkyDungeonBlueLockChance + level * KinkyDungeonBlueLockChanceScaling, KinkyDungeonBlueLockChanceScalingMax) / 3;

		if (locktype < TimerChance) return "Timer" + modifiers;
		if (locktype < BlueChance || restraint.DefaultLock == "Blue") return "Blue" + modifiers;
		if (locktype < YellowChance || restraint.DefaultLock == "Yellow") return "Yellow" + modifiers;
		if (locktype < GreenChance || restraint.DefaultLock == "Green") return "Green" + modifiers;
		return "Red" + modifiers;
	}
	return "";
}

function KinkyDungeonGetRestraintArousal() {
	let ret = 0;
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let item = KinkyDungeonInventory[I];
		if (item.restraint && item.restraint.arousal) {
			ret += item.restraint.arousal;
		}
	}
	return ret;
}


function KinkyDungeonUnlockRestraintsWithShrine(shrine) {
	let count = 0;

	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let item = KinkyDungeonInventory[I];
		if (item.restraint && item.lock && item.restraint.shrine && item.restraint.shrine.includes(shrine)) {

			KinkyDungeonLock(item, "");
			count++;
		}
	}

	return count;
}

function KinkyDungeonPlayerGetLockableRestraints() {
	let ret = [];

	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let item = KinkyDungeonInventory[I];
		if (!item.lock && item.restraint && item.restraint.escapeChance && item.restraint.escapeChance.Pick != null) {
			ret.push(item);
		}
	}

	return ret;
}


function KinkyDungeonRemoveKeys(lock) {
	if (lock.includes("Red")) KinkyDungeonRedKeys -= 1;
	if (lock.includes("Green") && Math.random() < 0.2) KinkyDungeonGreenKeys -= 1;
	if (lock.includes("Yellow")) {KinkyDungeonRedKeys -= 1; KinkyDungeonGreenKeys -= 1; }
	if (lock.includes("Blue")) KinkyDungeonBlueKeys -= 1;
}

function KinkyDungeonGetKey(lock) {
	if (lock.includes("Red")) return "Red";
	if (lock.includes("Green")) return "Green";
	if (lock.includes("Yellow")) {return Math.random() > 0.5 ? "Red" : "Green";}
	if (lock.includes("Blue")) return "Blue";
	return "";
}

function KinkyDungeonHasGhostHelp() {
	if (KinkyDungeonTargetTile && KinkyDungeonTargetTile.Type == "Ghost" && KinkyDungeonGhostDecision <= 1) return "Ghost";
	let enemy = KinkyDungeonEnemyAt(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y);
	if (enemy && enemy.Enemy && enemy.Enemy.helpStruggle) return "Summoned";
	return false;
}

function KinkyDungeonIsHandsBound(ApplyGhost) {
	return (!ApplyGhost || !KinkyDungeonHasGhostHelp()) &&
		(InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemHands"), "Block", true) || InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ItemHands"));
}

function KinkyDungeonIsArmsBound(ApplyGhost) {
	return (!ApplyGhost || !KinkyDungeonHasGhostHelp()) &&
		(InventoryItemHasEffect(InventoryGet(KinkyDungeonPlayer, "ItemArms"), "Block", true) || InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ItemArms"));
}

function KinkyDungeonGetPickBaseChance() {
	return 0.33 / (1.0 + 0.02 * MiniGameKinkyDungeonLevel);
}

// Note: This is for tiles (doors, chests) only!!!
function KinkyDungeonPickAttempt() {
	let Pass = "Fail";
	let escapeChance = KinkyDungeonGetPickBaseChance();
	let lock = KinkyDungeonTargetTile.Lock;
	if (!KinkyDungeonTargetTile.pickProgress) KinkyDungeonTargetTile.pickProgress = 0;

	if (lock.includes("Blue")) {
		if (KinkyDungeonPlayer.IsBlind() > 0)
			KinkyDungeonSendMessage(7, TextGet("KinkyDungeonStruggleUnlockNoUnknownKey"), "orange", 2);
		else
			KinkyDungeonSendMessage(7, TextGet("KinkyDungeonStruggleCantPickBlueLock"), "orange", 2);
		Pass = "Fail";
	}

	let handsBound = KinkyDungeonIsHandsBound();
	let armsBound = KinkyDungeonIsArmsBound();
	if (!KinkyDungeonPlayer.CanInteract()) escapeChance /= 2;
	if (armsBound) escapeChance = Math.max(0.0, escapeChance - 0.25);
	if (handsBound) escapeChance = Math.max(0, escapeChance - 0.5);

	escapeChance /= 1.0 + KinkyDungeonArousalRate(true)*KinkyDungeonArousalUnlockSuccessMod;

	if (!KinkyDungeonHasStamina(-KinkyDungeonActions.UseTool.SP, true)) {
		KinkyDungeonWaitMessage(true);
		return false;
	} else if (KinkyDungeonTargetTile && KinkyDungeonTargetTile.pickProgress >= 1){//Math.random() < escapeChance
		Pass = "Success";
		KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Unlock.ogg");
	} else if (Math.random() < KinkyDungeonKeyGetPickBreakChance() || lock.includes("Blue")) { // Blue locks cannot be picked or cut!
		Pass = "Break";
		KinkyDungeonLockpicks -= 1;
		KinkyDungeonPickBreakProgress = 0;
		KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/PickBreak.ogg");
	} else if (handsBound || (armsBound && Math.random() < KinkyDungeonItemDropChanceArmsBound)) {
		KinkyDungeonDropItem({name: "Pick"});
		KinkyDungeonLockpicks -= 1;
		KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
	} else {
		KinkyDungeonTargetTile.pickProgress += escapeChance;
		KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Pick.ogg");
	}
	KinkyDungeonDoAction("UseTool");
	KinkyDungeonSendMessage(4, TextGet("KinkyDungeonAttemptPick" + Pass).replace("TargetRestraint", TextGet("KinkyDungeonObject")), (Pass == "Success") ? "lightgreen" : "red", 1);
	return Pass == "Success";
}

function KinkyDungeonUnlockAttempt(lock) {
	let Pass = "Fail";
	let escapeChance = 1.0;

	let handsBound = KinkyDungeonIsHandsBound();
	let armsBound = KinkyDungeonIsArmsBound();
	if (!KinkyDungeonPlayer.CanInteract()) escapeChance /= 2;
	if (armsBound) escapeChance = Math.max(0.1, escapeChance - 0.25);
	if (handsBound) escapeChance = Math.max(0, escapeChance - 0.5);

	if (Math.random() < escapeChance)
		Pass = "Success";
	KinkyDungeonSendMessage(4, TextGet("KinkyDungeonStruggleUnlock" + Pass).replace("TargetRestraint", TextGet("KinkyDungeonObject")), (Pass == "Success") ? "lightgreen" : "red", 1);
	if (Pass == "Success") {
		KinkyDungeonRemoveKeys(lock);
		KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Unlock.ogg");
		return true;
	} else if (handsBound || (armsBound && Math.random() < KinkyDungeonItemDropChanceArmsBound)) {
		let keytype = KinkyDungeonGetKey(lock);
		KinkyDungeonDropItem({name: keytype+"Key"});
		if (keytype == "Blue") KinkyDungeonBlueKeys -= 1;
		else if (keytype == "Red") KinkyDungeonRedKeys -= 1;
		else if (keytype == "Green") KinkyDungeonGreenKeys -= 1;
		KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
	} else {
		KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Pick.ogg");
	}
	return false;
}


// Lockpick = use tool or cut
// Otherwise, just a normal struggle
function KinkyDungeonStruggle(struggleGroup, StruggleType) {
	var restraint = KinkyDungeonGetRestraintItem(struggleGroup.group);
	var cost = (StruggleType == "Pick" || StruggleType == "Cut" || StruggleType == "Unlock") ? KinkyDungeonActions.UseTool.SP : KinkyDungeonActions.Struggle.SP;
	let Pass = "Fail";
	let escapeChance = (restraint.restraint.escapeChance[StruggleType] != null) ? restraint.restraint.escapeChance[StruggleType] : 1.0;
	if (StruggleType == "Cut" && KinkyDungeonPlayerWeapon && KinkyDungeonPlayerWeapon.cutBonus) escapeChance += KinkyDungeonPlayerWeapon.cutBonus;
	if (StruggleType == "Cut" && KinkyDungeonEnchantedBlades > 0) escapeChance += KinkyDungeonEnchantedKnifeBonus;
	if (!restraint.removeProgress) restraint.removeProgress = 0;
	if (!restraint.pickProgress) restraint.pickProgress = 0;
	if (!restraint.struggleProgress) restraint.struggleProgress = 0;
	if (!restraint.unlockProgress) restraint.unlockProgress = 0;
	if (!restraint.cutProgress) restraint.cutProgress = 0;

	let increasedAttempts = false;

	if (escapeChance <= 0) {
		if (!restraint.attempts) restraint.attempts = 0;
		if (restraint.attempts < KinkyDungeonMaxImpossibleAttempts) {
			increasedAttempts = true;
			restraint.attempts += 0.5;
			if (escapeChance <= -0.5) restraint.attempts += 0.5;
		} else {
			let typesuff = "";
			if (restraint.restraint.escapeChance[StruggleType] < 0) typesuff = "2";
			KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
			KinkyDungeonSendMessage(8, TextGet("KinkyDungeonStruggle" + StruggleType + "Impossible" + typesuff), "red", 2);
			if (restraint.attempts < 99) { KinkyDungeonStatWillpower -= 1.5; restraint.attempts = 99; }
			return false;
		}
	}

	let tampered = KinkyDungeonStruggleTampered();

	let handsBound = KinkyDungeonIsHandsBound(true);
	let armsBound = KinkyDungeonIsArmsBound(true);

	// Struggling is unaffected by having arms bound
	if (!KinkyDungeonHasGhostHelp() && StruggleType != "Struggle" && (struggleGroup.group != "ItemArms" && struggleGroup.group != "ItemHands" ) && !KinkyDungeonPlayer.CanInteract()) escapeChance /= 1.5;
	if (StruggleType != "Struggle" && struggleGroup.group != "ItemArms" && armsBound) escapeChance = Math.max(0.1 - Math.max(0, 0.01*restraint.restraint.power), escapeChance - 0.3);

	// Finger extensions will help if your hands are unbound. Some items cant be removed without them!
	if (StruggleType == "Remove" && !handsBound && (KinkyDungeonNormalBlades > 0 || KinkyDungeonEnchantedBlades > 0 || KinkyDungeonLockpicks > 0))
		escapeChance = Math.min(1, escapeChance + 0.15);

	// Covered hands makes it harder to unlock, and twice as hard to remove
	if ((StruggleType == "Pick" || StruggleType == "Unlock" || StruggleType == "Remove") && struggleGroup.group != "ItemHands" && handsBound)
		escapeChance = (StruggleType == "Remove") ? escapeChance / 2 : Math.max(0, escapeChance - 0.5);

	if (!KinkyDungeonHasGhostHelp() && (StruggleType == "Pick" || StruggleType == "Unlock")) escapeChance /= 1.0 + KinkyDungeonArousalRate(true)*KinkyDungeonArousalUnlockSuccessMod;

	// Items which require a knife are much harder to cut without one
	if (StruggleType == "Cut" && KinkyDungeonNormalBlades <= 0 && KinkyDungeonEnchantedBlades <= 0 && restraint.restraint.escapeChance[StruggleType] > 0.01) escapeChance/= 5;

	if (InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, struggleGroup.group)) escapeChance = 0;

	// Blue locks make it harder to escape an item
	if (restraint.lock == "Blue" && (StruggleType == "Cut" || StruggleType == "Remove" || StruggleType == "Struggle")) escapeChance = Math.max(0, escapeChance - 0.15);

	if (StruggleType == "Cut" && struggleGroup.group != "ItemHands" && handsBound)
		escapeChance = escapeChance / 2;

	// Struggling is affected by tightness
	if (escapeChance > 0 && StruggleType == "Struggle") {
		for (let T = 0; T < restraint.tightness; T++) {
			escapeChance *= 0.8; // Tougher for each tightness, however struggling will reduce the tightness
		}
	}

	if (StruggleType == "Pick") escapeChance *= KinkyDungeonGetPickBaseChance();

	// jammed lock can't easily picked
	if (StruggleType == "Pick" && restraint.lock == "Jammed") escapeChance /= 3;

	let belt = null;
	let bra = null;

	if (struggleGroup.group == "ItemVulva" || struggleGroup.group == "ItemVulvaPiercings" || struggleGroup.group == "ItemButt") belt = KinkyDungeonGetRestraintItem("ItemPelvis");
	if (belt && belt.restraint.chastity) escapeChance = 0.0;

	if (struggleGroup.group == "ItemNipples" || struggleGroup.group == "ItemNipplesPiercings") bra = KinkyDungeonGetRestraintItem("ItemBreast");
	if (bra && bra.restraint.chastity) escapeChance = 0.0;

	if (escapeChance <= 0) {
		if (!restraint.attempts) restraint.attempts = 0;
		if (restraint.attempts < KinkyDungeonMaxImpossibleAttempts || increasedAttempts) {
			if (!increasedAttempts) {
				restraint.attempts += 0.5;
				if (escapeChance <= -0.5) restraint.attempts += 0.5;
			}
		} else {
			KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
			KinkyDungeonSendMessage(8, TextGet("KinkyDungeonStruggle" + StruggleType + "ImpossibleBound"), "red", 2);
			if (restraint.attempts < 99) { KinkyDungeonStatWillpower -= 2.5; restraint.attempts = 99; }
			return false;
		}
	}

	if (escapeChance > 0) escapeChance *= ((KinkyDungeonGoddessRep.Ghost+50)/200+1);

	if (tampered) escapeChance = Math.max(0.0, escapeChance - 0.5);

	// Handle cases where you can't even attempt to unlock
	if (StruggleType == "Unlock" && !((restraint.lock == "Red" && KinkyDungeonRedKeys > 0) || (restraint.lock == "Green" && KinkyDungeonGreenKeys > 0)
		|| (restraint.lock == "Yellow" && KinkyDungeonRedKeys > 0 && KinkyDungeonGreenKeys > 0) || (restraint.lock == "Blue" && KinkyDungeonBlueKeys > 0))
		|| (StruggleType == "Pick" && (restraint.lock == "Blue"))) {
		if ((KinkyDungeonPlayer.IsBlind() > 0) || !restraint.lock.includes("Blue"))
			KinkyDungeonSendMessage(7, TextGet("KinkyDungeonStruggleUnlockNo" + ((KinkyDungeonPlayer.IsBlind() > 0) ? "Unknown" : restraint.lock) + "Key"), "orange", 2);
		else
			KinkyDungeonSendMessage(7, TextGet("KinkyDungeonStruggleCantPickBlueLock"), "orange", 2);
	} else {

		// Main struggling block
		if (!KinkyDungeonHasStamina(-cost, true)) {
			KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
			KinkyDungeonWaitMessage(true);
		} else {
			// Pass block
			if (((StruggleType == "Cut" && restraint.cutProgress >= 1 - escapeChance)
					|| (StruggleType == "Pick" && restraint.pickProgress >= 1 - escapeChance)
					|| (StruggleType == "Unlock" && restraint.unlockProgress >= 1 - escapeChance)
					|| (StruggleType == "Remove" && restraint.removeProgress >= 1 - escapeChance)
					|| (restraint.struggleProgress >= 1 - escapeChance))
				&& !(restraint.lock == "Blue" && (StruggleType == "Pick"  || StruggleType == "Cut" ))) {
				Pass = "Success";
				if (StruggleType == "Pick" || StruggleType == "Unlock") {
					if (StruggleType == "Unlock") {
						if ((restraint.lock == "Red" && KinkyDungeonRedKeys > 0) || (restraint.lock == "Green" && KinkyDungeonGreenKeys > 0) || (restraint.lock == "Yellow" && KinkyDungeonRedKeys > 0 && KinkyDungeonGreenKeys > 0) || (restraint.lock == "Blue" && KinkyDungeonBlueKeys > 0)) {
							if (restraint.lock != "Green" || (Math.random() > KinkyDungeonKeyJamChance)) {
								KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Unlock.ogg");
								KinkyDungeonRemoveKeys(restraint.lock);
								KinkyDungeonLock(restraint, "");
							} else {
								Pass = "Jammed";
								restraint.lock = "Jammed";
								KinkyDungeonGreenKeys -= 1;
								restraint.pickProgress = 0;
								restraint.unlockProgress = 0;
							}
						}
					} else {
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Unlock.ogg");
						KinkyDungeonLock(restraint, "");
					}
					if (KinkyDungeonHasGhostHelp() == "Ghost")
						KinkyDungeonChangeRep("Ghost", 1);
					KinkyDungeonDoAction("UseTool");
				} else {
					if (StruggleType == "Cut") {
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Cut.ogg");
						KinkyDungeonDoAction("UseTool");
					} else if (StruggleType == "Remove") {
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Unbuckle.ogg");
						KinkyDungeonDoAction("Struggle");
					} else {
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
						KinkyDungeonDoAction("Struggle");
					}
					KinkyDungeonRemoveRestraint(restraint.restraint.Group, StruggleType != "Cut");
					if (KinkyDungeonHasGhostHelp() == "Ghost")
						KinkyDungeonChangeRep("Ghost", 2);
				}
			} else {
				// Failure block for the different failure types
				if (StruggleType == "Cut") {
					if (restraint.restraint.magic && KinkyDungeonEnchantedBlades == 0) Pass = "Fail";
					let breakchance = 0;
					if (KinkyDungeonNormalBlades > 0 && !restraint.restraint.magic) breakchance = KinkyDungeonGetKnifeBreakChance();
					else if (KinkyDungeonEnchantedBlades > 0) breakchance = KinkyDungeonGetEnchKnifeBreakChance();
					if (Math.random() < breakchance || restraint.lock == "Blue") { // Blue locks cannot be picked or cut!
						Pass = "Break";
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/PickBreak.ogg");
						if (restraint.restraint.magic && KinkyDungeonEnchantedBlades > 0) KinkyDungeonEnchantedBlades -= 1;
						else {
							if (KinkyDungeonNormalBlades > 0) {
								KinkyDungeonNormalBlades -= 1;
								KinkyDungeonKnifeBreakProgress = 0;
							} else if (KinkyDungeonEnchantedBlades > 0) {
								KinkyDungeonEnchantedBlades -= 1;
								KinkyDungeonEnchKnifeBreakProgress = 0;
							}
						}
					} else if ((handsBound && Math.random() < KinkyDungeonItemDropChanceArmsBound) || (armsBound && Math.random() < KinkyDungeonItemDropChanceArmsBound)) {
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
						if (restraint.restraint.magic && KinkyDungeonEnchantedBlades > 0) {
							KinkyDungeonDropItem({name: "EnchKnife"});
							KinkyDungeonEnchantedBlades -= 1;
						} else {
							if (KinkyDungeonNormalBlades > 0) {
								KinkyDungeonDropItem({name: "Knife"});
								KinkyDungeonNormalBlades -= 1;
							} else if (KinkyDungeonEnchantedBlades > 0) {
								KinkyDungeonDropItem({name: "EnchKnife"});
								KinkyDungeonEnchantedBlades -= 1;
							}
						}
					} else {
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Cut.ogg");
						restraint.cutProgress += escapeChance * (0.3 + 0.2 * Math.random() + 0.6 * Math.max(0, (KinkyDungeonStatStamina)/KinkyDungeonStatStaminaMax));
					}
					KinkyDungeonDoAction("UseTool");
				} else if (StruggleType == "Pick") {
					if (Math.random() < KinkyDungeonKeyGetPickBreakChance() || restraint.lock == "Blue") { // Blue locks cannot be picked or cut!
						Pass = "Break";
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/PickBreak.ogg");
						KinkyDungeonLockpicks -= 1;
						KinkyDungeonPickBreakProgress = 0;
					} else if (handsBound || (armsBound && Math.random() < KinkyDungeonItemDropChanceArmsBound)) {
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
						KinkyDungeonDropItem({name: "Pick"});
						KinkyDungeonLockpicks -= 1;
					} else {
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Pick.ogg");
						if (!restraint.pickProgress) restraint.pickProgress = 0;
						restraint.pickProgress += escapeChance * (0.5 + 1.0 * Math.random());
					}
					KinkyDungeonDoAction("UseTool");
				} else if (StruggleType == "Unlock") {
					if (handsBound || (armsBound && Math.random() < KinkyDungeonItemDropChanceArmsBound)) {
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Miss.ogg");
						let keytype = KinkyDungeonGetKey(restraint.lock);
						KinkyDungeonDropItem({name: keytype+"Key"});
						if (keytype == "Blue") KinkyDungeonBlueKeys -= 1;
						else if (keytype == "Red") KinkyDungeonRedKeys -= 1;
						else if (keytype == "Green") KinkyDungeonGreenKeys -= 1;
					} else {
						KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Pick.ogg");
						restraint.unlockProgress += escapeChance * (0.75 + 0.5 * Math.random());
					}
					KinkyDungeonDoAction("UseTool");
				} else if (StruggleType == "Remove") {
					KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
					restraint.removeProgress += escapeChance * (0.55 + 0.2 * Math.random() + 0.35 * Math.max(0, (KinkyDungeonStatWillpower)/KinkyDungeonStatWillpowerMax) - 0.7 * Math.max(0, Math.min(0.5, KinkyDungeonArousalRate(true))));
					KinkyDungeonDoAction("Struggle");
				} else if (StruggleType == "Struggle") {
					KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
					restraint.struggleProgress += escapeChance * (0.4 + 0.3 * Math.random() + 0.4 * Math.max(0, (KinkyDungeonStatStamina)/KinkyDungeonStatStaminaMax));
					KinkyDungeonDoAction("Struggle");
				}
			}

			// Aftermath
			KinkyDungeonSendMessage(7, TextGet("KinkyDungeonStruggle" + StruggleType + Pass).replace("TargetRestraint", TextGet("Restraint" + restraint.restraint.name)), (Pass == "Success") ? "lightgreen" : "red", 2);

			if (Pass != "Success") {
				KinkyDungeonStatWillpower -= Math.max(0, (0.1 - escapeChance)*3);

				// Reduce the progress
				if (StruggleType == "Struggle") {
					restraint.pickProgress = Math.max(0, restraint.pickProgress - 0.01);
					restraint.removeProgress = Math.max(0, restraint.removeProgress * 0.9 - 0.01);
					restraint.unlockProgress = Math.max(0, restraint.unlockProgress * 0.8 - 0.01);
				} else if (StruggleType == "Pick") {
					restraint.struggleProgress = Math.max(0, restraint.struggleProgress * 0.8 - 0.01);
					restraint.removeProgress = Math.max(0, restraint.removeProgress * 0.8 - 0.01);
					restraint.unlockProgress = Math.max(0, restraint.unlockProgress * 0.9 - 0.01);
				} else if (StruggleType == "Unlock") {
					restraint.pickProgress = Math.max(0, restraint.pickProgress - 0.01);
					restraint.removeProgress = Math.max(0, restraint.removeProgress * 0.8 - 0.01);
					restraint.struggleProgress = Math.max(0, restraint.struggleProgress * 0.8 - 0.01);
				} if (StruggleType == "Remove") {
					restraint.pickProgress = Math.max(0, restraint.pickProgress - 0.01);
					restraint.struggleProgress = Math.max(0, restraint.struggleProgress * 0.8 - 0.01);
					restraint.unlockProgress = Math.max(0, restraint.unlockProgress * 0.9 - 0.01);
				}

				let tightness_reduction = 1;
				if (tampered) {
					tightness_reduction = 0;
					restraint.pickProgress = Math.max(0, restraint.pickProgress - 0.01);
					restraint.removeProgress = Math.max(0, restraint.removeProgress * 0.8 - 0.01);
					restraint.struggleProgress = Math.max(0, restraint.struggleProgress * 0.8 - 0.01);
					restraint.unlockProgress = Math.max(0, restraint.unlockProgress * 0.9 - 0.01);
					KinkyDungeonDealDamage({damage:tampered.restraint.dmg, type:"electric"});
					tampered.battery = Math.max(0, tampered.battery - 1);
					KinkyDungeonSendMessage(8, TextGet("KinkyDungeonStruggleTampered"), "red", 2);
				}

				// reduces the tightness of the restraint slightly
				if (StruggleType == "Struggle") {

					for (let I = 0; I < KinkyDungeonInventory.length; I++) {
						if (KinkyDungeonInventory[I].restraint) {
							tightness_reduction *= 0.8; // Reduced tightness reduction for each restraint currently worn
						}
					}

					restraint.tightness = Math.max(0, restraint.tightness - tightness_reduction);
				}
			}
		}

		return true;
	}
	return false;
}

function KinkyDungeonSpellTampered() {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let item = KinkyDungeonInventory[I];
		if (item.restraint && item.restraint.tamperspell && Math.random() < item.restraint.tamperspell) {
			return item;
		}
	}
}
function KinkyDungeonStruggleTampered() {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let item = KinkyDungeonInventory[I];
		if (item.restraint && item.restraint.tamperstruggle && item.battery > 0 && Math.random() < item.restraint.tamperstruggle) {
			return item;
		}
	}
}


function KinkyDungeonGetRestraintItem(group) {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let item = KinkyDungeonInventory[I];
		if (item.restraint && item.restraint.Group == group) {
			return item;
		}
	}
	return null;
}

function KinkyDungeonGetLockedRestraint(lock = "") {
	let ret = [];

	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let item = KinkyDungeonInventory[I];
		if (item.restraint && item.lock && item.lock != "" && (lock=="" || item.lock==lock)) {
			ret.push(item);
		}
	}

	return ret;
}


function KinkyDungeonGetRestraintByName(Name) {
	for (let L = 0; L < KinkyDungeonRestraints.length; L++) {
		let restraint = KinkyDungeonRestraints[L];
		if (restraint.name == Name) return restraint;
	}
	return null;
}

function KinkyDungeonGetRestraintPower(restraint, lock = true, ignorebasic = false) {
	let ret = 1;
	if (!ignorebasic) {
		ret = restraint.restraint.power;
		if (restraint.curse) ret = restraint.curse.power;
	}
	let lockMult = 1.0;
	if (lock) {
		let Lock = restraint.lock;
		if (Lock == "Red" || Lock == "Green" || Lock == "Yellow" || Lock == "Jammed") lockMult = 2.0;
		if (Lock == "Blue" || Lock == "Timer") lockMult = 3.0;
		if (Lock == "Goddess") lockMult = 10.0;
	}
	return ret * lockMult;
}

function KinkyDungeonGetRestraint(enemy, Level, Index, Bypass, Lock) {
	let restraintWeightTotal = 0;
	let restraintWeights = [];

	for (let L = 0; L < KinkyDungeonRestraints.length; L++) {
		let restraint = KinkyDungeonRestraints[L];
		let currentRestraint = KinkyDungeonGetRestraintItem(restraint.Group);
		let lock = Lock?Lock:restraint.DefaultLock;
		if (Level >= restraint.minLevel && (!InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, restraint.Group) || Bypass) && (!currentRestraint || 
			!currentRestraint.restraint || KinkyDungeonGetRestraintPower(currentRestraint) < KinkyDungeonGetRestraintPower({restraint:restraint, lock:lock}))) {

			let weight = 0;
			let enabled = false;
			for (let T = 0; T < enemy.attacktags.length; T++)
				if (restraint.enemyTags[enemy.attacktags[T]] != undefined) {
					weight += restraint.enemyTags[enemy.attacktags[T]];
					enabled = true;
				}
			if (enabled) {
				restraintWeights.push({restraint: restraint, weight: restraintWeightTotal});
				weight += restraint.weight;
				if (restraint.playerTags)
					for (let tag in restraint.playerTags)
						if (KinkyDungeonPlayerTags.includes(tag)) weight += restraint.playerTags[tag];
				restraintWeightTotal += Math.max(0, weight);
			}
		}
	}

	let selection = Math.random() * restraintWeightTotal;

	for (let L = restraintWeights.length - 1; L >= 0; L--) {
		if (selection > restraintWeights[L].weight) {
			return restraintWeights[L].restraint;
		}
	}

}

function KinkyDungeonUpdateRestraints(delta) {
	var playerTags = [];
	for (let G = 0; G < KinkyDungeonPlayer.Appearance.length; G++) {
		if (KinkyDungeonPlayer.Appearance[G].Asset) {
			var group = KinkyDungeonPlayer.Appearance[G].Asset.Group;
			if (group) {
				if (InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, group.Name)) playerTags.push(group.Name + "Blocked");
				if (InventoryGet(KinkyDungeonPlayer, group.Name)) playerTags.push(group.Name + "Full");
			}
		}
	}
	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.restraint && inv.restraint.addTag) {
			for (let tag of inv.restraint.addTag) {
				if (!playerTags.includes(tag)) playerTags.push(tag);
			}
		}
	}
	KinkyDungeonPlayerTags = playerTags;
	return playerTags;
}


function KinkyDungeonAddRestraintIfWeaker(restraint, Tightness, Bypass, Lock) {
	let r = KinkyDungeonGetRestraintItem(restraint.Group);
	if (!Lock) Lock = restraint.DefaultLock;
	if (!r || (r.restraint && KinkyDungeonGetRestraintPower(r) < KinkyDungeonGetRestraintPower({restraint:restraint, lock:Lock}))) {
		return KinkyDungeonAddRestraint(restraint, Tightness, Bypass, Lock);
	}
	return 0;
}

function KinkyDungeonAddRestraint(restraint, Tightness, Bypass, Lock) {
	var tight = (Tightness) ? Tightness : 0;
	if (restraint) {
		if (!InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, restraint.Group) || Bypass) {
			KinkyDungeonRemoveRestraint(restraint.Group);
			if (restraint.remove)
				for (let remove of restraint.remove) {
					InventoryRemove(KinkyDungeonPlayer, remove);
				}
			InventoryWear(KinkyDungeonPlayer, restraint.Asset, restraint.Group, restraint.power);
			let placed = InventoryGet(KinkyDungeonPlayer, restraint.Group);
			let placedOnPlayer = false;
			if (!placed) console.log(`Error placing ${restraint.name} on player!!!`);
			if (placed && ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable() && !KinkyDungeonRestraintsLocked.includes(restraint.Group) && restraint.Group != "ItemHead" && InventoryAllow(
				Player, placed.Asset) &&
				(!InventoryGetLock(InventoryGet(Player, restraint.Group))
				|| (InventoryGetLock(InventoryGet(Player, restraint.Group)).Asset.OwnerOnly == false && InventoryGetLock(InventoryGet(Player, restraint.Group)).Asset.LoverOnly == false))) {
				InventoryWear(Player, restraint.Asset, restraint.Group, restraint.Color, MiniGameKinkyDungeonLevel);
				placedOnPlayer = true;
			}
			if (placed && !placed.Property) placed.Property = {};
			if (restraint.Type) {
				KinkyDungeonPlayer.FocusGroup = AssetGroupGet("Female3DCG", restraint.Group);
				var options = window["Inventory" + ((restraint.Group.includes("ItemMouth")) ? "ItemMouth" : restraint.Group) + restraint.Asset + "Options"];
				if (!options) options = TypedItemDataLookup[`${restraint.Group}${restraint.Asset}`].options; // Try again
				const option = options.find(o => o.Name === restraint.Type);
				ExtendedItemSetType(KinkyDungeonPlayer, options, option);
				if (placedOnPlayer) {
					Player.FocusGroup = AssetGroupGet("Female3DCG", restraint.Group);
					ExtendedItemSetType(Player, options, option);
					Player.FocusGroup = null;
				}
				KinkyDungeonPlayer.FocusGroup = null;
			}
			if (restraint.Modules) {
				let data = ModularItemDataLookup[restraint.Group + restraint.Asset];
				let asset = data.asset;
				let modules = data.modules;
				// @ts-ignore
				InventoryGet(KinkyDungeonPlayer, restraint.Group).Property = ModularItemMergeModuleValues({ asset, modules }, restraint.Modules);
				if (placedOnPlayer) {
					// @ts-ignore
					InventoryGet(Player, restraint.Group).Property = ModularItemMergeModuleValues({ asset, modules }, restraint.Modules);
				}
			}
			if (restraint.OverridePriority) {
				if (!InventoryGet(KinkyDungeonPlayer, restraint.Group).Property) InventoryGet(KinkyDungeonPlayer, restraint.Group).Property = {OverridePriority: restraint.OverridePriority};
				else InventoryGet(KinkyDungeonPlayer, restraint.Group).Property.OverridePriority = restraint.OverridePriority;
			}
			if (restraint.Color) {
				CharacterAppearanceSetColorForGroup(KinkyDungeonPlayer, restraint.Color, restraint.Group);
				if (placedOnPlayer)
					CharacterAppearanceSetColorForGroup(Player, restraint.Color, restraint.Group);
			}
			let item = {restraint: restraint, tightness: tight, lock: ""};
			KinkyDungeonInventory.push(item);
			if (restraint.DefaultCurse) KinkyDungeonCurseRestraint(item, false, restraint.DefaultCurseType);

			if (restraint.events) {
				if (typeof (window[`KinkyDungeonEvent${restraint.events.name}`]) === "function")	window[`KinkyDungeonEvent${restraint.events.name}`](item);
				else console.log("restraint event unhandle" + restraint.events.name);
			}
			if (restraint.buffs) for (let v of restraint.buffs) KinkyDungeonApplyBuff(KinkyDungeonPlayerBuffs, v);

			if (Lock) KinkyDungeonLock(item, Lock);
			else if (restraint.DefaultLock) KinkyDungeonLock(item, restraint.DefaultLock);

		}

		KinkyDungeonUpdateRestraints(0); // We update the restraints but no time drain on batteries, etc
		KinkyDungeonCheckClothesLoss = true; // We signal it is OK to check whether the player should get undressed due to restraints
		KinkyDungeonMultiplayerInventoryFlag = true; // Signal that we can send the inventory now
		KinkyDungeonSleepTime = 0;
		KinkyDungeonUpdateStruggleGroups();
		KinkyDungeonCalculateSlowLevel();
		KinkyDungeonBlindLevel = Math.min(4, KinkyDungeonPlayer.GetBlindLevel() + KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Blind"));
		KinkyDungeonUpdateLightGrid = true;
		KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/Struggle.ogg");
		return Math.max(1, restraint.power);
	}
	return 0;
}

function KinkyDungeonRemoveRestraint(Group, Keep) {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		var item = KinkyDungeonInventory[I];
		if (item.restraint && item.restraint.Group == Group && !item.curse) {
			if (ArcadeDeviousChallenge && KinkyDungeonDeviousDungeonAvailable() && !KinkyDungeonRestraintsLocked.includes(Group) && InventoryGet(Player, Group) &&
						(!InventoryGetLock(InventoryGet(Player, Group)) || (InventoryGetLock(InventoryGet(Player, Group)).Asset.OwnerOnly == false && InventoryGetLock(InventoryGet(Player, Group)).Asset.LoverOnly == false))
						&& Group != "ItemHead") {
				InventoryRemove(Player, Group);
				if (Group == "ItemNeck") {
					InventoryRemove(Player, "ItemNeckAccessories");
					InventoryRemove(Player, "ItemNeckRestraints");
				}
			}

			if (item.restraint.events && item.restraint.events.remove) {
				if (typeof (window[`KinkyDungeonEvent${item.restraint.events.name}Remove`]) === "function")	window[`KinkyDungeonEvent${item.restraint.events.name}Remove`](item);
				else console.log("restraint event unhandle" + item.restraint.events.name + "Remove");
			}
			if (item.restraint.buffs) for (let v of item.restraint.buffs) delete KinkyDungeonPlayerBuffs[v.id];

			KinkyDungeonInventory.splice(I, 1);

			if (item.restraint.inventory && Keep && !KinkyDungeonInventoryGet(item.restraint.name)) KinkyDungeonInventory.push({looserestraint: item.restraint});

			InventoryRemove(KinkyDungeonPlayer, Group);
			if (item.restraint.Group == "ItemNeck" && KinkyDungeonGetRestraintItem("ItemNeckRestraints")) KinkyDungeonRemoveRestraint("ItemNeckRestraints", KinkyDungeonGetRestraintItem("ItemNeckRestraints").restraint.inventory);

			KinkyDungeonUpdateRestraints(0);
			KinkyDungeonUpdateStruggleGroups();

			KinkyDungeonMultiplayerInventoryFlag = true;
			KinkyDungeonCalculateSlowLevel();
			KinkyDungeonBlindLevel = Math.min(4, KinkyDungeonPlayer.GetBlindLevel() + KinkyDungeonGetBuffedStat(KinkyDungeonPlayerBuffs, "Blind"));
			KinkyDungeonUpdateLightGrid = true;
			return true;
		}
	}
	return false;
}

function KinkyDungeonRestraintList() {
	let ret = [];

	for (let inv of KinkyDungeonInventory) {
		if (inv.restraint) {
			ret.push(inv);
		}
	}

	return ret;
}

function KinkyDungeonRestraintTypes(ShrineFilter) {
	let ret = [];
	let restraintlist = KinkyDungeonRestraintList();

	for (let shrine of ShrineFilter) {
		for (let inv of restraintlist) {
			if (inv.restraint && inv.restraint.shrine && inv.restraint.shrine.includes(shrine.shrine) && !ret.includes(shrine.shrine)) ret.push(shrine.shrine);
		}
	}
	
	return ret;
}

