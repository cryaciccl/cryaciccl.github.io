"use strict";

function KinkyDungeonNewLevelCurse() {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let item = KinkyDungeonInventory[I];
		if (item && item.restraint && item.curse) {
			let curse = item.curse;
			if (curse.name == "Orgasm") curse.orgasmneed += 1;
			if (curse.name == "Slave") curse.ghostmeet = false;
			if (curse.name == "Lookup") {
				if (curse.needlookup && !curse.lookupdone) curse.lookupneed += 1;
				let pos = KinkyDungeonCurseGenerateLookup();
				if (pos) {
					curse.lookupX = pos.x;
					curse.lookupY = pos.y;
					curse.needlookup = true;
				}
				else {
					curse.needlookup = false;
				}
				curse.lookupdone = false;
			}
		}
	}
}

function KinkyDungeonCurseGenerateLookup() {
	for (let I = 0; I < 30; I++) {
		let X = Math.floor(1+(Math.random() * KinkyDungeonGridWidth - 2));
		let Y = Math.floor(1+(Math.random() * KinkyDungeonGridHeight - 2));
		if (KinkyDungeonMovableTiles.includes(KinkyDungeonMapGet(X, Y))) {
			return {x:X, y:Y};
		}
	}
	return null;
}

function KinkyDungeonCurseRestraint(item, curse = false, affair = null) {
	if (!item || !item.restraint || item.curse) return false;
	let curseComponents = ["Pool", "Slave", "Orgasm", "Residual", "Shrine", "Lookup"]; // removed with many keys, being captured or meet ghosts, gain orgasm, spells, meet shrines, goto location
	if (!curse || !curseComponents.includes(curse)) curse = curseComponents[Math.floor(Math.random() * curseComponents.length)];
	item.curse = {name: curse, power:item.restraint.power * 10};
	if (curse == "Pool") item.curse.poolneed = 1;
	if (curse == "Orgasm") {
		item.curse.orgasmneed = 5 + Math.floor(Math.random() * (KinkyDungeonGoddessRep.Ghost + 50) / 10);
		item.curse.orgasmcount = 0;
	}
	if (curse == "Residual") {
		item.curse.mananeed = 300 + Math.floor(Math.random() * (KinkyDungeonGoddessRep.Ghost + 50) * 6);
		item.curse.manacount = 0;
	}
	if (curse == "Shrine") {
		item.curse.shrine = KinkyDungeonShrineIndex[Math.floor(Math.random()*KinkyDungeonShrineIndex.length)].Type;
		if (affair) item.curse.shrine = affair;
		item.curse.shrineneed = 1;
	}
	if (curse == "Lookup") {
		item.curse.lookupneed = 2 + Math.floor(Math.random() * (KinkyDungeonGoddessRep.Ghost + 50) / 25);
		let pos = KinkyDungeonCurseGenerateLookup();
		if (pos) {
			curse.lookupX = pos.x;
			curse.lookupY = pos.y;
			curse.needlookup = true;
		}
		else {
			curse.needlookup = false;
		}
		curse.lookupdone = false;
	}
	KinkyDungeonUpdateStruggleGroups();
}

function KinkyDungeonCurseInfo(curse) {
	KinkyDungeonSendMessage(8, TextGet("KinkyDungeonCurseInfo" + curse.name)
								  .replace("POOL", "" + curse.poolneed)
								  .replace("ORGASM", "" + Math.ceil(curse.orgasmneed - curse.orgasmcount))
								  .replace("MANA", "" + curse.mananeed - curse.manacount)
								  .replace("SHRINENEED", "" + curse.shrineneed)
								  .replace("SHRINE", "" + TextGet("KinkyDungeonShrine" +curse.shrine))
								  .replace("LOOKUP", "" + curse.lookupneed)
								  , "White", 3);
}
function KinkyDungeonCurseAvailable(curse) {
	if (curse.name == "Pool" && curse.poolneed <= 0) return true;
	if (curse.name == "Slave" && (curse.ghostcollared || (KinkyDungeonSpawnJailers>0 && KinkyDungeonSpawnJailers == KinkyDungeonSpawnJailersMax))) return true;
	if (curse.name == "Orgasm" && curse.orgasmcount >= curse.orgasmneed) return true;
	if (curse.name == "Residual" && curse.manacount >= curse.mananeed) return true;
	if (curse.name == "Shrine" && curse.shrineneed <= 0) return true;
	if (curse.name == "Lookup" && curse.lookupneed <= 0) return true;
	return false;
}

function KinkyDungeonCurseUnlock(sg, unlock = false, remove = false) {//should be no use?
	let curse = sg.curse;
	if (!KinkyDungeonCurseAvailable(curse)) return false;
	let item = KinkyDungeonGetRestraintItem(sg.group);
	item.curse = null;
	if (unlock) KinkyDungeonLock(item, "");
	if (remove) KinkyDungeonRemoveRestraint(sg.group, false );
	KinkyDungeonSendMessage(8, TextGet("KinkyDungeonCurseUnlock" + (remove?"Remove":"")).replace("RESTRAINT", TextGet("Restraint"+sg.name)), "#99FF99", 2);
	KinkyDungeonUpdateStruggleGroups();
}

function KinkyDungeonGetCurse(type = false, affair = false) {
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let item = KinkyDungeonInventory[I];
		if (item && item.restraint && item.curse && (!type || item.curse.name == type) && (!affair || item.curse.shrine == affair)) return item;
	}
	return false;
}

function KinkyDungeonFillCurse(type, affair) {
	let selection = Math.random();
	let ret = null;
	for (let I = 0; I < KinkyDungeonInventory.length; I++) {
		let item = KinkyDungeonInventory[I];
		if (item && item.restraint && item.curse && type == item.curse.name) {
			let curse = item.curse;
			let newed = false;
			if (type == "Pool") {
				if (affair != "Purify") curse.poolneed += 1;
				else curse.poolneed -= 1;
				newed = true;
			} else if (type == "Slave") {
				if (selection < (KinkyDungeonGoddessRep.Ghost + 50)/100) {
					curse.ghostcollared = true;
					ret = true;
					newed = true;
				}
				curse.ghostmeet = true;
			} else if (type == "Orgasm") {
				curse.orgasmcount += affair;
				newed = true;
			} else if (type == "Residual") {
				curse.manacount += affair;
				newed = true;
			} else if (type == "Shrine") {
				if (affair == curse.shrine) curse.shrineneed -= 1;
				else curse.shrineneed += 1;
				newed = true;
			} else if (type == "Lookup" && curse.needlookup && !curse.lookupdone) {
				if (affair.x == curse.lookupX && affair.y == curse.lookupY) {
					curse.lookupdone = true;
					curse.lookupneed -= 1;
					KinkyDungeonSendMessage(8, TextGet("KinkyDungeonCurseLookupHit"), "green", 4);
					newed = true;
				} else {
					let dist = Math.sqrt((affair.x - curse.lookupX) * (affair.x - curse.lookupX) + (affair.y - curse.lookupY) * (affair.y - curse.lookupY));
					if (Math.random() < 1/dist) {
						if (dist<3) KinkyDungeonSendMessage(3, TextGet("KinkyDungeonCurseLookupNear"), "green", 1);
						if (dist<6) KinkyDungeonSendMessage(2, TextGet("KinkyDungeonCurseLookupMed"), "white", 1);
						if (dist<12) KinkyDungeonSendMessage(2, TextGet("KinkyDungeonCurseLookupFar"), "white", 1);
					}
				}
			}
			if (newed) KinkyDungeonUpdateStruggleGroups();
		}
	}
	return ret;
}