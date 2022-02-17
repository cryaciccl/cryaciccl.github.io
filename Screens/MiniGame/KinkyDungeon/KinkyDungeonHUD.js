"use strict";
let KinkyDungeonStruggleGroups = [];
let KinkyDungeonStruggleGroupsBase = [
	"ItemHead",
	"ItemHood",
	"ItemM",
	"ItemEars",
	"ItemArms",
	"ItemNeck",
	"ItemHands",
	"ItemNeckRestraints",
	"ItemBreast",
	"ItemNipples",
	"ItemTorso",
	"ItemButt",
	"ItemVulva",
	"ItemVulvaPiercings",
	"ItemPelvis",
	"ItemLegs",
	"ItemFeet",
	"ItemBoots",
];
let KinkyDungeonDrawStruggle = true;
let KinkyDungeonDrawState = "Game";
let KinkyDungeonSpellValid = false;
let KinkyDungeonCamX = 0;
let KinkyDungeonCamY = 0;
let KinkyDungeonTargetX = 0;
let KinkyDungeonTargetY = 0;
let KinkyDungeonLastDraw = 0;
let KinkyDungeonDrawDelta = 0;

const KinkyDungeonLastChatTimeout = 10000;

let KinkyDungeonStatBarHeight = 90;
let KinkyDungeonToggleAutoDoor = true;
let KinkyDungeonToggles = false;
let KinkyDungeonToggleKick = "Auto";
let KinkyDungeonTextLogPriority = 0;

function KinkyDungeonDrawInputs() {

	// Draw the struggle buttons if applicable
	if (KinkyDungeonDrawStruggle && KinkyDungeonStruggleGroups)
		for (let S = 0; S < KinkyDungeonStruggleGroups.length; S++) {
			let sg = KinkyDungeonStruggleGroups[S];
			let ButtonWidth = 60;
			let x = 5 + ((!sg.left) ? (490 - ButtonWidth) : 0);
			let y = 42 + sg.y * (ButtonWidth + 46);

			if (sg.left) {
				MainCanvas.textAlign = "left";
			} else {
				MainCanvas.textAlign = "right";
			}

			let color = "white";
			let locktext = "";
			if (KinkyDungeonPlayer.IsBlind() < 1) {
				if (sg.lock == "Red") {color = "#ff8888"; locktext = TextGet("KinkyRedLockAbr");}
				if (sg.lock == "Green" || sg.lock == "Jammed") {color = "#88ff88"; locktext = TextGet("KinkyGreenLockAbr");}
				if (sg.lock == "Yellow") {color = "#ffff88"; locktext = TextGet("KinkyYellowLockAbr");}
				if (sg.lock == "Blue") {color = "#8888FF"; locktext = TextGet("KinkyBlueLockAbr");}
				if (sg.lock == "Timer") {color = "#444444"; locktext = TextGet("KinkyTimerLockAbr");}
				if (sg.lock == "Goddess") {color = "#88ffff"; locktext = TextGet("KinkyGoddessLockAbr");}
			} else color = "#888888";
			if (sg.curse) color = "#ff88ff";

			let GroupText = sg.name ? ("Restraint" + sg.name) : ("KinkyDungeonGroup"+ sg.group); // The name of the group to draw.

			DrawText(TextGet(GroupText) + locktext, x + ((!sg.left) ? ButtonWidth : 0), y-24, color, "black");
			MainCanvas.textAlign = "center";

			let i = 0;
			if (sg.curse) {
				if (KinkyDungeonCurseAvailable(sg.curse))
					KinkyDungeonDrawButton("GameStruggle3"+S, x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "CurseUnlock.png", ""); i++;
				KinkyDungeonDrawButton("GameStruggle2"+S , x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "CurseInfo.png", ""); i++;
			} else {
				KinkyDungeonDrawButton("GameStruggle1"+S, x, y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "Struggle.png", ""); i++;
				if (!sg.blocked) {
					let toolSprite = (sg.lock != "") ? ((sg.lock != "Jammed") ? "Key" : "LockJam") : "Buckle";
					KinkyDungeonDrawButton("GameStruggle4"+S, x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + toolSprite + ".png", ""); i++;
					if (KinkyDungeonLockpicks > 0 && sg.lock != "") {KinkyDungeonDrawButton("GameStruggle5"+S, x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "UseTool.png", ""); i++;}
					if (KinkyDungeonNormalBlades > 0 || KinkyDungeonWeaponCanCut(true) || KinkyDungeonEnchantedBlades > 0) {KinkyDungeonDrawButton("GameStruggle6"+S, x + ((!sg.left) ? -(ButtonWidth)*i : (ButtonWidth)*i), y, ButtonWidth, ButtonWidth, "", "White", KinkyDungeonRootDirectory + "Cut.png", ""); i++;}
				}
			}
		}

	if (KinkyDungeonTargetTile) {
		if (KinkyDungeonTargetTile.Type == "Lock" || (KinkyDungeonTargetTile.Lock && KinkyDungeonTargetTile.Type == "Door")) {
			let action = false;
			if (KinkyDungeonLockpicks > 0) {
				KinkyDungeonDrawButton("GamePickDoor", 963, 925, 112, 60, TextGet("KinkyDungeonPickDoor"), "White", "", "");
				action = true;
			}

			if ((KinkyDungeonTargetTile.Lock.includes("Red") && KinkyDungeonRedKeys > 0) || (KinkyDungeonTargetTile.Lock.includes("Green") && KinkyDungeonGreenKeys > 0) ||
				(KinkyDungeonTargetTile.Lock.includes("Yellow") && KinkyDungeonRedKeys > 0 && KinkyDungeonGreenKeys > 0) || (KinkyDungeonTargetTile.Lock.includes("Blue") && KinkyDungeonBlueKeys > 0)) {
				KinkyDungeonDrawButton("GameUnlockDoor", 825, 925, 112, 60, TextGet("KinkyDungeonUnlockDoor"), "White", "", "");
				action = true;
			}

			if (!action) DrawText(TextGet("KinkyDungeonLockedDoor"), 950, 950, "white", "silver");

			if (KinkyDungeonTargetTile.Lock.includes("Red"))
				DrawText(TextGet("KinkyRedLock"), 675, 950, "white", "silver");
			else if (KinkyDungeonTargetTile.Lock.includes("Green"))
				DrawText(TextGet("KinkyGreenLock"), 675, 950, "white", "silver");
			else if (KinkyDungeonTargetTile.Lock.includes("Yellow"))
				DrawText(TextGet("KinkyYellowLock"), 675, 950, "white", "silver");
			else if (KinkyDungeonTargetTile.Lock.includes("Blue"))
				DrawText(TextGet("KinkyBlueLock"), 675, 950, "white", "silver");
		} else if (KinkyDungeonTargetTile.Type == "Shrine") {
			KinkyDungeonDrawShrine();
		} else if (KinkyDungeonTargetTile.Type == "Ghost") {
			KinkyDungeonDrawGhost();
		} else if (KinkyDungeonTargetTile.Type == "Door") {
			KinkyDungeonDrawButton("GameCloseDoor", 675, 925, 350, 60, TextGet("KinkyDungeonCloseDoor"), "White");
		}
	}

	KinkyDungeonDrawButton("ToRestart", 1890, 20, 100, 40, TextGet("KinkyDungeonRestart"), "White");

	KinkyDungeonDrawButton("ToInventory", 1140, 925, 165, 60, TextGet("KinkyDungeonInventory"), "White", "", "");
	KinkyDungeonDrawButton("ToInfomation", 1330, 925, 165, 60, TextGet("KinkyDungeonInfomation"), "White", "", "");
	KinkyDungeonDrawButton("ToMagicSpells", 1520, 925, 165, 60, TextGet("KinkyDungeonMagic"), "White", "", "");

	if (KinkyDungeonToggles) {
		KinkyDungeonDrawButton("GameToggleAutoDoor", 1490, 20, 220, 60, TextGet("KinkyDungeonAutoDoor" + (KinkyDungeonToggleAutoDoor ? "On" : "Off")), "white");
		KinkyDungeonDrawButton("GameToggleKick", 1110, 20, 220, 60, TextGet("KinkyDungeonKick" + KinkyDungeonToggleKick), "white");
		KinkyDungeonDrawButton("GameToggleHide", 1350, 20, 120, 60, "", "White", KinkyDungeonRootDirectory + "Hide" + (KinkyDungeonDrawStruggle?"True":"False") + ".png", "");
	}
	KinkyDungeonDrawButton("GameToggles", 1730, 20, 150, 40, TextGet("KinkyDungeonToggle" + (KinkyDungeonToggles ? "Off" : "On")), KinkyDungeonToggles?"#888888":"white");
	
	if (CharacterItemsHavePoseAvailable(KinkyDungeonPlayer, "BodyLower", "Kneel") && !CharacterDoItemsSetPose(KinkyDungeonPlayer, "Kneel") && KinkyDungeonPlayer.IsKneeling())
		KinkyDungeonDrawButton("GameStandup", 510, 925, 60, 60, "", "White", KinkyDungeonRootDirectory + "Icons/Up.png", "");
	if (CharacterItemsHavePoseAvailable(KinkyDungeonPlayer, "BodyLower", "Kneel") && !CharacterDoItemsSetPose(KinkyDungeonPlayer, "Kneel") && !KinkyDungeonPlayer.IsKneeling())
		KinkyDungeonDrawButton("GameKneel", 510, 925, 60, 60, "", "White", KinkyDungeonRootDirectory + "Icons/Down.png", "");
	

	for (let I = 0; I < 3; I++) {
		if (KinkyDungeonSpells[KinkyDungeonSpellChoices[I]] && !KinkyDungeonSpells[KinkyDungeonSpellChoices[I]].passive) {
			let spell = KinkyDungeonSpells[KinkyDungeonSpellChoices[I]];
			let comp = KinkyDungeoCheckComponents(spell);

			MainCanvas.textAlign = "left";
			DrawText(TextGet("KinkyDungeonSpell"+ spell.name), 1845, 763+85*I, "white", "silver");
			if (comp) {
				DrawText(TextGet("KinkyDungeonComponentAbbr"+comp), 1845, 803+85*I, "#AA4040", "silver")
			} else {
				comp = KinkyDungeoCheckComponents(spell,true,false);
				if (comp == "Mana") DrawText(spell.manacost + TextGet("KinkyDungeonComponentCostMana"), 1845, 803+85*I, "#44AAEE", "silver");
				if (comp == "Stamina") DrawText(spell.staminacost + TextGet("KinkyDungeonComponentCostStamina"), 1845, 803+85*I, "#44CC22", "silver");
				if (comp == "Arousal") DrawText(spell.arousalcost + TextGet("KinkyDungeonComponentCostArousal"), 1845, 803+85*I, "#111111", "silver");
				if (comp == "Willpower") DrawText(spell.willcost + TextGet("KinkyDungeonComponentCostWillpower"), 1845, 803+85*I, "#E3E3B0", "silver");
			}
			KinkyDungeonDrawButton({name:("GameSpell" + I), key:KinkyDungeonKeySpell[I]},
				1745, 740+85*I, 76, 76, "", "#333333", KinkyDungeonRootDirectory + "Spells/" + spell.name + ".png", "");
			MainCanvas.textAlign = "center";
		}	
	}

	KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelayPing);

}

/* function KinkyDungeonDrawProgress(x, y, amount, maxWidth, sprite) {
	let iconCount = 6;
	let scale = maxWidth / (72 * iconCount);
	let interval = 1/iconCount;
	let numIcons = amount / interval;
	for (let icon = 0; icon < numIcons && numIcons > 0; icon += 1) {
		DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Icons/" + sprite + ((icon + 0.5 <= numIcons) ? "Full.png" : "Half.png"), MainCanvas, 0, 0, 72, 72, x + 72 * scale * icon, y, 72*scale, 72*scale, false);
	}
}*/

function KinkyDungeonDrawComplexBar(x, y, w, h, color, colorbg, value, valuemax, valueref, colorloss, colorover) {
	if (valuemax < valueref) { // max get decreased
		DrawRect(x, y, w, h, "white");
		DrawRect(x + 2, y + 2, Math.floor((w - 4) * value / valueref), h - 4, color);
		DrawRect(Math.floor(x + 2 + (w - 4) * value / valueref), y + 2, Math.floor((w - 4) * (valuemax - value) / valueref), h - 4, colorbg);
		DrawRect(Math.floor(x + 2 + (w - 4) * valuemax / valueref), y + 2, Math.floor((w - 4) * (valueref - valuemax) / valueref), h - 4, colorloss);
	} else {	// max overcharged
		DrawRect(x, y, w, h, "white");
		DrawRect(x + 2, y + 2, Math.floor((w - 4) * Math.min(value, valueref) / valuemax), h - 4, color);
		if (value > valueref) DrawRect(Math.floor(x + 2 + (w - 4) * valueref / valuemax), y + 2, Math.floor((w - 4) * (value - valueref) / valuemax), h - 4, colorover);
		DrawRect(Math.floor(x + 2 + (w - 4) * value / valuemax), y + 2, Math.floor((w - 4) * (valuemax - value) / valuemax), h - 4, colorbg);
	}
}

function KinkyDungeonDrawStats(x, y, width, heightPerBar) {
	// Draw labels
	let buttonWidth = 48;
	let suff = (KinkyDungeonAttemptConsumableChance()<0) ? "Unavailable" : "";
		
	// Text and button
	DrawText(TextGet("StatArousal").replace("MAX", Math.round(KinkyDungeonStatArousalMax) + "").replace("CURRENT", Math.round(KinkyDungeonStatArousal) + ""), x+width/2 + buttonWidth/2, y + 25, (KinkyDungeonStatArousal < KinkyDungeonStatArousalMax * 0.9) ? "white" : "pink", "silver");
	if (KinkyDungeonStatArousal > 0 && KinkyDungeonItemCount("PotionFrigid")) {
		KinkyDungeonDrawButton("GameUsePotionFrigid", x, y, buttonWidth, buttonWidth, "", "Pink", KinkyDungeonRootDirectory + "UsePotion" + suff + ".png", "");
	}
	DrawText(TextGet("StatWillpower").replace("MAX", Math.round(KinkyDungeonStatWillpowerMax) + "").replace("CURRENT", Math.round(KinkyDungeonStatWillpower) + ""), x+width/2 + buttonWidth/2, y + 25 + heightPerBar, (KinkyDungeonStatWillpower > 15) ? "white" : "pink", "silver");
	if (KinkyDungeonStatWillpower < KinkyDungeonStatWillpowerMax && KinkyDungeonItemCount("PotionHealth"))
		KinkyDungeonDrawButton("GameUsePotionHealth", x, y+heightPerBar, buttonWidth, buttonWidth, "", "#FFFFAA", KinkyDungeonRootDirectory + "UsePotion" + suff + ".png", "");
	DrawText(TextGet("StatStamina").replace("MAX", Math.round(KinkyDungeonStatStaminaMax) + "").replace("CURRENT", Math.round(KinkyDungeonStatStamina) + ""), x+width/2 + buttonWidth/2, y + 25 + heightPerBar * 2, (KinkyDungeonStatStamina > KinkyDungeonStatStaminaMax * 0.3) ? "white" : "pink", "silver");
	if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax && KinkyDungeonItemCount("PotionStamina"))
		KinkyDungeonDrawButton("GameUsePotionStamina", x, y+2*heightPerBar, buttonWidth, buttonWidth, "", "#AAFFAA", KinkyDungeonRootDirectory + "UsePotion" + suff + ".png", "");
	DrawText(TextGet("StatMana").replace("MAX", Math.round(KinkyDungeonStatManaMax) + "").replace("CURRENT", Math.round(KinkyDungeonStatMana) + ""), x+width/2 + buttonWidth/2, y + 25 + heightPerBar * 3, (KinkyDungeonStatMana > 35) ? "white" : "pink", "silver");
	if (KinkyDungeonStatMana < KinkyDungeonStatManaMax && KinkyDungeonItemCount("PotionMana"))
		KinkyDungeonDrawButton("GameUsePotionMana", x, y+3*heightPerBar, buttonWidth, buttonWidth, "", "#AAAAFF", KinkyDungeonRootDirectory + "UsePotion" + suff + ".png", "");

	// Draw arousal
	KinkyDungeonDrawComplexBar(x, y + heightPerBar/2, width, heightPerBar/3.3, "pink", "#111111", KinkyDungeonStatArousal, KinkyDungeonStatArousalMax, 100, "#800000", "#FFE0E0");

	// Draw Stamina/Mana
	KinkyDungeonDrawComplexBar(x, y + heightPerBar + heightPerBar/2, width, heightPerBar/3.3, "#E3E3B0", "#881111", KinkyDungeonStatWillpower, KinkyDungeonStatWillpowerMax, 100, "#C00000", "#FFFFC0");
	KinkyDungeonDrawComplexBar(x, y + 2*heightPerBar + heightPerBar/2, width, heightPerBar/3.3, "#44CC22", "#111111", KinkyDungeonStatStamina, KinkyDungeonStatStaminaMax, 100, "#800000", "#C0FFA0");
	KinkyDungeonDrawComplexBar(x, y + 3*heightPerBar + heightPerBar/2, width, heightPerBar/3.3, "#44AAEE", "#111111", KinkyDungeonStatMana, KinkyDungeonStatManaMax, 100, "#800000", "#A0C0FF");

	KinkyDungeonDrawButton("GameSleep", x, 692, width, 40, TextGet("KinkyDungeonSleep"), "White");

	let basic = [
		{name:"Gold",		number: KinkyDungeonGold,				show:true,	x:0, y:0},
		{name:"Pick",		number: KinkyDungeonLockpicks,			show:true,	x:0, y:1},
		{name:"Knife",		number: KinkyDungeonNormalBlades,		show:true,	x:1, y:1},
		{name:"RedKey",		number: KinkyDungeonRedKeys,			show:false,	x:0, y:2},
		{name:"EnchKnife",	number: KinkyDungeonEnchantedBlades,	show:false,	x:1, y:2},
		{name:"GreenKey",	number: KinkyDungeonGreenKeys,			show:false,	x:0, y:3},
		{name:"BlueKey",	number: KinkyDungeonBlueKeys,			show:false,	x:0, y:4},
	];
	let heightPerItem = 54;
	MainCanvas.textAlign = "left";
	for (let I = 0; I < basic.length; I++) {
		if (basic[I].number > 0 || basic[I].show) {
			DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Items/" + basic[I].name + ".png", MainCanvas, 0, 0, 72, 72,
				x + 2 + width/2*basic[I].x, y -5 + 4* heightPerBar + basic[I].y*heightPerItem, heightPerItem-2, heightPerItem-2, false);			
			DrawText(": " + basic[I].number, x + heightPerItem + 5 + width/2*basic[I].x, y + 20 + 4* heightPerBar + basic[I].y*heightPerItem, "white", "silver");
		}
	}
	MainCanvas.textAlign = "center";
}
function KinkyDungeonButtonGame(button) {
	if (!KinkyDungeonIsPlayer()) return false;
	if (button.tag == "Toggles") {
		KinkyDungeonToggles = !KinkyDungeonToggles;
		return true;
	} else if (button.tag == "ToggleKick") {
		if (KinkyDungeonToggleKick == "Auto") KinkyDungeonToggleKick = "On";
		else if (KinkyDungeonToggleKick == "On") KinkyDungeonToggleKick = "Off";
		else if (KinkyDungeonToggleKick == "Off") KinkyDungeonToggleKick = "Auto";
		KinkyDungeonUpdateAttacks();
		return true;
	} else if (button.tag == "ToggleHide") {
		KinkyDungeonDrawStruggle = !KinkyDungeonDrawStruggle;
		return true;
	} else if (button.tag == "Standup") {
		CharacterSetActivePose(KinkyDungeonPlayer, "BaseLower", false);
		KinkyDungeonCalculateSlowLevel();
		KinkyDungeonDoAction("Struggle");
		return true;w
	} else if (button.tag == "Kneel") {
		CharacterSetActivePose(KinkyDungeonPlayer, "Kneel", false);
		KinkyDungeonCalculateSlowLevel();
		KinkyDungeonDoAction("Interact");
		return true;
	} else if (button.tag == "PickDoor") {
		if (KinkyDungeonPickAttempt()) {
			if (KinkyDungeonTargetTile.Type == "Door") KinkyDungeonTargetTile.Lock = undefined;
			else delete KinkyDungeonTiles[KinkyDungeonTargetTileLocation];
			KinkyDungeonTargetTile = null;
		}
		KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
		return true;
	} else if (button.tag == "UnlockDoor") {
		KinkyDungeonDoAction("Interact");				
		if (KinkyDungeonUnlockAttempt(KinkyDungeonTargetTile.Lock)) {
			if (KinkyDungeonTargetTile.Type == "Door") KinkyDungeonTargetTile.Lock = undefined;
			else delete KinkyDungeonTiles[KinkyDungeonTargetTileLocation];
			KinkyDungeonTargetTile = null;
		}
		KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
		return true;
	} else if (button.tag == "CloseDoor") {
		KinkyDungeonDoAction("Interact");				
		KinkyDungeonTargetTile = null;
		let x = KinkyDungeonTargetTileLocation.split(',')[0];
		let y = KinkyDungeonTargetTileLocation.split(',')[1];
		KinkyDungeonMapSet(parseInt(x), parseInt(y), "D");
		KinkyDungeonPlaySound(KinkyDungeonRootDirectory + "/Audio/DoorClose.ogg");
		KinkyDungeonSendMessage(3, TextGet("KinkyDungeonCloseDoorDone"), "white", 1);
		KinkyDungeonMultiplayerUpdate(KinkyDungeonNextDataSendTimeDelay);
		return true;
	} else if (button.tag == "ToggleAutoDoor") {
		KinkyDungeonToggleAutoDoor = !KinkyDungeonToggleAutoDoor;
		if (!KinkyDungeonToggleAutoDoor) KinkyDungeonDoorCloseTimer = 0;
		return true;
	} else if (button.tag.startsWith("UsePotion")) {
		let potion = button.tag.slice(9);
		KinkyDungeonAttemptConsumable("Potion" + potion, 1);
		return true;
	} else if (button.tag == "Sleep") {
		KinkyDungeonDoAction("Sleep");
		KinkyDungeonSleepTurns = KinkyDungeonActions.Sleep.Time;
		KinkyDungeonAlert = 4; // Alerts nearby enemies; intent is that the enemies are searching while you sleep;
		return true;
	} else if (button.tag.startsWith("Struggle")) {
		let method = parseInt(button.tag.slice(8,9));
		let sg = KinkyDungeonStruggleGroups[parseInt(button.tag.slice(9))];
		if (method == 1) KinkyDungeonStruggle(sg, "Struggle");
		else if (method == 2) KinkyDungeonCurseInfo(sg.curse);
		else if (method == 3) KinkyDungeonCurseUnlock(sg);
		else if (method == 4) KinkyDungeonStruggle(sg, (sg.lock != "") ? "Unlock" : "Remove");
		else if (method == 5) KinkyDungeonStruggle(sg, "Pick");
		else if (method == 6) KinkyDungeonStruggle(sg, "Cut");
		return true;
	} else if (button.tag.startsWith("Spell")) {
		return KinkyDungeonHandleSpell(KinkyDungeonHandleSpellChoice(KinkyDungeonSpellChoices[parseInt(button.tag.slice(5))]));
	} else if (button.tag.startsWith("Shrine")) {
		return KinkyDungeonHandleShrine(button.tag.slice(6));
	}
	return false;
}
function KinkyDungeonHandleHUD() {
	if (KinkyDungeonDrawState == "Game") {
		if (MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height))
			KinkyDungeonSetTargetLocation();
	} else if (KinkyDungeonDrawState == "Magic") {
		return KinkyDungeonHandleMagic();
	} else if (KinkyDungeonDrawState == "MagicSpells") {
		return KinkyDungeonHandleMagicSpells();
	} else if (KinkyDungeonDrawState == "Inventory") {
		return KinkyDungeonHandleInventory();
	} else if (KinkyDungeonDrawState == "Reputation") {
		return KinkyDungeonHandleReputation();
	} else if (KinkyDungeonDrawState == "Lore") {
		return KinkyDungeonHandleLore();
	}
	return false;
}


function KinkyDungeonUpdateStruggleGroups() {
	let struggleGroups = KinkyDungeonStruggleGroupsBase;
	KinkyDungeonStruggleGroups = [];

	for (let S = 0; S < struggleGroups.length; S++) {
		let sg = struggleGroups[S];
		let Group = sg;
		if (sg == "ItemM") {
			if (InventoryGet(KinkyDungeonPlayer, "ItemMouth3")) Group = "ItemMouth3";
			else if (InventoryGet(KinkyDungeonPlayer, "ItemMouth2")) Group = "ItemMouth2";
			else Group = "ItemMouth";
		}

		let restraint = KinkyDungeonGetRestraintItem(Group);

		if (restraint) {
			KinkyDungeonStruggleGroups.push(
				{
					group:Group,
					left: S % 2 == 0,
					y: Math.floor(S/2),
					icon:sg,
					name:(restraint.restraint) ? restraint.restraint.name : "",
					lock:restraint.lock,
					curse:restraint.curse,
					blocked: InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, Group)});
		}
	}
}

function KinkyDungeonDrawInfomation() {
	KinkyDungeonDrawButton("ToReputation", 1530, 925, 165, 60, TextGet("KinkyDungeonReputation"), "White", "", "");
	KinkyDungeonDrawButton("ToTextLog", 1130, 925, 165, 60, TextGet("KinkyDungeonTextLog"), "White", "", "");
	DrawRect(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height, 1000,"black");
	//Atck dmgs | Movement Costs
	//buffs |
	DrawImageZoomCanvas(KinkyDungeonRootDirectory + "Weapons/" + KinkyDungeonPlayerDamage.name + ".png", MainCanvas, 0, 0, 200, 200,
		canvasOffsetX + 60, canvasOffsetY + 40, 120, 120, false);			
	MainCanvas.textAlign = "left"
	DrawText("Damage " + KinkyDungeonPlayerDamage.dmg, canvasOffsetX + 220, canvasOffsetY + 70, "white", "silver");
	DrawText("HitChance " + KinkyDungeonPlayerDamage.chance, canvasOffsetX + 220, canvasOffsetY + 130, "white", "silver");
	MainCanvas.textAlign = "center";
}
function KinkyDungeonDrawTextLog() {
	DrawRect(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height, 1000,"black");
	KinkyDungeonDrawButton("ToInfomation", 1530, 925, 165, 60, TextGet("KinkyDungeonInfomation"), "White", "", "");
	for (let I = 0; I < 11; I++) {
		KinkyDungeonDrawButton("TextLogPriority"+I, 500 + I*75, 925, 60, 60, ""+I, (I==KinkyDungeonTextLogPriority?"Green":"White"), "", "");
	}
	let X = 1150;
	let Y = 850;
	let H = 48;
	let MaxLines = 17;
	let L = 0;
	MainCanvas.textAlign = "center";
	
	for (let I = 0; I < KinkyDungeonMessageLog.length; I++) {
		if (KinkyDungeonTextLogPriority <= KinkyDungeonMessageLog[I].priority) {
			DrawText(KinkyDungeonMessageLog[I].text, X, Y-H*L, KinkyDungeonMessageLog[I].color, "black");
			L++;
			if (L>=MaxLines) break;
		}
	}
	
	return true;
}
function KinkyDungeonButtonTextLog(button) {
	let tag = button.tag;
	if (tag.startsWith("Priority")) {
		KinkyDungeonTextLogPriority = parseInt(tag.slice(8));
	}
	
}