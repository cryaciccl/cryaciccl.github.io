"use strict";
// occupy this file for move, attack etc events

let KinkyDungeonActions = {
	"Wait":		{SP: 3.5,	BaseSP: 3.5,	Time: 1},
	"Sleep":	{SP: 5,		BaseSP: 5,		Time: 21},
	"Move":		{SP: 3,		BaseSP: 3,		Time: 1,	SPperSlow:-2.5, Cantmove:false, Slow:0, SlowTime:0, FreezeTime:0},
	"Attack":	{SP: -5,	BaseSP: null,	Time: 1,	APChance:0.6},
	"Interact":	{SP: 0,		BaseSP: 0,		Time: 1,	APChance:0.5},
	"Struggle":	{SP: -7,	BaseSP: -7,		Time: 1,	APChance:0.8},
	"UseTool":	{SP: -2,	BaseSP: -2,		Time: 1,	APChance:0.5},	
};

let KinkyDungeonEvents = [];

function KinkyDungeonNewLevelEvent(clockdiff) {
	for (let I = 0; I < KinkyDungeonEvents; I++) {
		KinkyDungeonEvents[I].clock -= clockddiff;
	}
}

function KinkyDungeonPushEvent(Event) {
	if (!Event || !Event.clock) return false;
	if (KinkyDungeonEvents.length == 0) {
		KinkyDungeonEvents.push(Event);
	} else {
		for (let I = 0; I < KinkyDungeonEvents.length; I++) {
			if (Event.clock < KinkyDungeonEvents[I].clock) {
				KinkyDungeonEvents.splice(I, 0, Event);
				return;
			}
		}
	}
}
function KinkyDungeonRemoveEvent(Event, checkContent = true) {
	for (let I = 0; I < KinkyDungeonEvents.length; I++) if (KinkyDungeonEvents[I].id == Event.id) {
		if (!checkContent || KinkyDungeonEvents[I].content == Event.content) {
			KinkyDungeonEvents.splice(I, 1);
			I--;
		}
	}
}
function KinkyDungeonDoAction(action) {
	KinkyDungeonStatStamina += KinkyDungeonActions[action].SP;
	KinkyDungeonAction += KinkyDungeonActions[action].Time;
	if (KinkyDungeonActions[action].AP || KinkyDungeonActions[action].APPercent)
		if (!(KinkyDungeonActions[action].APChance && Math.random() > KinkyDungeonActions[action].APChance))
			KinkyDungeonStatArousal += KinkyDungeonActions[action].AP?KinkyDungeonActions[action].AP:(-KinkyDungeonActions[action].APPercent*KinkyDungeonActions[action].SP);
	if (KinkyDungeonActions[action].VibeCharge)
		if (!(KinkyDungeonActions[action].VibeChance && Math.random() > KinkyDungeonActions[action].VibeChance))
			KinkyDungeonChargeVibrators(KinkyDungeonActions[action].VibeCharge);
	KinkyDungeonUpdateLightGrid	= true;
	let rest = KinkyDungeonRestraintList().length;
	if (Math.random() < (rest - 5)/10) KinkyDungeonChangeRep("Ghost", 1);
	KinkyDungeonAdvanceTime(Math.min(0.5, KinkyDungeonActions[action].Time));
}
function KinkyDungeonSleepAwake(forced = false, setposeonly = false) {
	if (KinkyDungeonSleepTurns <= 0) return;
	KinkyDungeonSleepTurns = 0;
	if (!setposeonly) KinkyDungeonAction = Math.min(KinkyDungeonAction, KinkyDungeonClock);

	if (CharacterItemsHavePoseAvailable(KinkyDungeonPlayer, "BodyLower", "Kneel") && !CharacterDoItemsSetPose(KinkyDungeonPlayer, "Kneel") && KinkyDungeonPlayer.IsKneeling()) {
		CharacterSetActivePose(KinkyDungeonPlayer, "BaseLower", false);
		KinkyDungeonCalculateSlowLevel();
	}
	KinkyDungeonUpdateLightGrid = true;
}
function KinkyDungeonEventRemoveSlow() {
	KinkyDungeonActions.Move.SlowTime = 0;
	return KinkyDungeonCalculateSlowLevel();
}
function KinkyDungeonEventRemoveFreeze() {
	KinkyDungeonActions.Move.FreezeTime = 0;
	return KinkyDungeonCalculateSlowLevel();
}
function KinkyDungeonEventVibeChange(vibe) {
	if (vibe) {
		if (!vibe.battery) {
			vibe.battery = vibe.restraint.battery;
			vibe.intensity = 0;
		}
		if (vibe.battery > 0) {
			let oldintensity = vibe.intensity;
			if (vibe.restraint.vibeType.includes("Teaser") && Math.random() < 0.4) vibe.intensity = 0;
			else if (vibe.restraint.vibeType.includes("Random")) vibe.intensity = Math.ceil(Math.random() * vibe.restraint.intensity);
			else vibe.intensity = vibe.restraint.intensity;
			if (oldintensity == 0 && vibe.intensity > 0) {
				KinkyDungeonPlaySound("Audio/VibrationTone4Long3.mp3");
				KinkyDungeonSendMessage(4, TextGet("KinkyDungeonStartVibe"), "#FFaadd", 2);
			} else {
				KinkyDungeonCalculateVibeLevel();
			}
			if (vibe.restraint.vibeType.includes("Teaser") || vibe.restraint.vibeType.includes("Random") )
				KinkyDungeonPushEvent({clock:KinkyDungeonClock + Math.floor(10 + Math.random() * 40), id:"VibeChange", content:vibe});
		}
	}
}
function KinkyDungeonEventVibeChangeRemove(vibe) {
	KinkyDungeonRemoveEvent({id:"VibeChange", content:vibe}, true);
}
function KinkyDungeonEventRestraintShock(shocker) {
	if (shocker) {
		let dmg = shocker.restraint.dmg;
		KinkyDungeonDealDamage({damage:dmg, type:"electric"});
		KinkyDungeonSendMessage(7, TextGet("KinkyDungeonRestraintShockTrigger"), "red", 2);
		KinkyDungeonPushEvent({clock:KinkyDungeonClock + Math.floor(50 + Math.random() * 100), id:"RestraintShock", content:shocker});
	}
}
function KinkyDungeonEventRestraintShockRemove(shocker) {
	KinkyDungeonRemoveEvent({id:"RestraintShock", content:shocker}, true);
}

let KinkyDungeonSlimeParts = [
	{group: "ItemHead", restraint: "SlimeHead"},
	{group: "ItemArms", restraint: "SlimeArms"},
	{group: "ItemHands", restraint: "SlimeHands"},
	{group: "ItemLegs", restraint: "SlimeLegs"},
	{group: "ItemFeet", restraint: "SlimeFeet"},
	{group: "ItemBoots", restraint: "SlimeBoots"},
];

function KinkyDungeonEventslimeSpread(slime) {
	let willspread = (!slime);
	let slimedParts = [];
	let slimePower = 0;	// should be 1-10
	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.restraint && inv.restraint.slimeLevel > 0) {
			slimedParts.push({name: inv.restraint.name, group: inv.restraint.Group, level: inv.restraint.slimeLevel});
			slimePower += inv.restraint.slimelevel;
		}
	}
	if (slimePower == 0) return ; // no longer will spread slime
	if (willspread) {
		let potentialSlimeParts = [];
		for (let slime of slimedParts) {
			let index = -1;
			for (let i = 0; i < KinkyDungeonSlimeParts.length; i++) if (KinkyDungeonSlimeParts[i].group == slime.group) {index = i; break;}
			if (index >= 0) {
				let slime2 = undefined;
				let slime3 = undefined;
				if (index > 0) {
					for (let s of potentialSlimeParts) if (s.group == KinkyDungeonSlimeParts[index-1].group && !s.level > slime.level) {slime2 = s; break;}
					if (!slime2) potentialSlimeParts.push({group: KinkyDungeonSlimeParts[index-1].group, restraint: KinkyDungeonSlimeParts[index-1].restraint, level: slime.level});
				}
				if (index < KinkyDungeonSlimeParts.length - 1) {
					for (let s of potentialSlimeParts) if (s.group == KinkyDungeonSlimeParts[index+1].group && !s.level > slime.level) {slime3 = s; break;}
					if (!slime3) potentialSlimeParts.push({group: KinkyDungeonSlimeParts[index+1].group, restraint: KinkyDungeonSlimeParts[index+1].restraint, level: slime.level});
				}
			}
		}
		let slimed = false;
		while (potentialSlimeParts.length > 0) {
			let newSlime = potentialSlimeParts[Math.floor(Math.random() * potentialSlimeParts.length)];
			if (newSlime) {
				let added = KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName(newSlime.restraint), 0, true);
				if (added) {
					slimePower += newSlime.restraint.slimelevel;										
					KinkyDungeonSendMessage(7, TextGet("KinkyDungeonSlimeSpread"), "#ff44ff", 3);
					potentialSlimeParts = [];
					slimed = true;
				}
			}
			potentialSlimeParts.splice(potentialSlimeParts.indexOf(newSlime), 1);
		}
		if (!slimed && potentialSlimeParts.length == 0) {
			let slime = slimedParts[Math.floor(Math.random() * slimedParts.length)];
			slimePower -= slime.restraint.slimelevel;										
			if (KinkyDungeonAddRestraintIfWeaker(KinkyDungeonGetRestraintByName("Hard" + slime.name), 0, true)) {
				KinkyDungeonSendMessage(7, TextGet("KinkyDungeonSlimeHarden"), "#ff44ff", 3);
			}
		}
	}
	// remove other slime events
	KinkyDungeonRemoveEvent({id:"slimeSpread"}, false);
	if (slimePower > 0) {
		KinkyDungeonPushEvent({clock:KinkyDungeonClock + Math.floor(3 + Math.random() * (5 + 100 / slimePower)), id:"slimeSpread", content:false});
	}
}
function KinkyDungeonEventslimeSpreadRemove(slime) {
	let slimePower = 0;	// should be 1-10
	for (let inv of KinkyDungeonRestraintList()) {
		if (inv.restraint && inv.restraint.slimeLevel > 0) {
			slimePower += inv.restraint.slimelevel;
		}
	}
	if (slimePower == 0) {	// last slime removed
		KinkyDungeonRemoveEvent({id:"slimeSpread"}, false);
	}
}

function KinkyDungeonHandleBuffEvent(Event, buff, entity, data) {

}
