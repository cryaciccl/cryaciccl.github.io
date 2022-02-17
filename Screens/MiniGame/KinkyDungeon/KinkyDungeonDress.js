"use strict";

var KinkyDungeonDressesList = {};

let KinkyDungeonDresses = {
	"Default" : [
		{Item: "WitchHat1", Group: "Hat", Color: "Default", Lost: false},
		{Item: "LeatherCorsetTop1", Group: "Cloth", Color: "Default", Lost: false},
		{Item: "LatexSkirt1", Group: "ClothLower", Color: "Default", OverridePriority: 17, Lost: false, Skirt: true},
		{Item: "Socks4", Group: "Socks", Color: "#444444", Lost: false},
		{Item: "Heels3", Group: "Shoes", Color: "#222222", Lost: false},
		{Item: "KittyPanties1", Group: "Panties", Color: "#222222", Lost: false},
		{Item: "FrameBra2", Group: "Bra", Color: "Default", Lost: false},
		{Item: "LatexElbowGloves", Group: "Gloves", Color: "Default", Lost: false},
		{Item: "Necklace4", Group: "Necklace", Color: "#222222", Lost: false},
	],
	"Prisoner" : [
		{Item: "SleevelessCatsuit", Group: "Suit", Color: "#8A120C", Lost: false},
		{Item: "CatsuitPanties", Group: "SuitLower", Color: "#8A120C", Lost: false},
		{Item: "Heels1", Group: "Shoes", Color: "#8A120C", Lost: false},
		{Item: "Socks4", Group: "Socks", Color: "#222222", Lost: false},
	],
	"Leotard" : [
		{Item: "SleevelessCatsuit", Group: "Suit", Color: "#53428D", Lost: false},
		{Item: "CatsuitPanties", Group: "SuitLower", Color: "#53428D", Lost: false},
	],
	"Bikini" : [
		{Item: "KittyPanties1", Group: "Panties", Color: "#050505", Lost: false},
		{Item: "FullLatexBra", Group: "Bra", Color: "Default", Lost: false},
	],
	"Lingerie" : [
		{Item: "LaceBabydoll", Group: "Cloth", Color: "Default", Lost: false},
		{Item: "Bandeau1", Group: "Bra", Color: "Default", Lost: false},
		{Item: "FloralPanties2", Group: "Panties", Color: ['#303030', '#F0F0F0'], Lost: false},
	],
	"LatexPrisoner" : [
		{Item: "LatexPanties2", Group: "Panties", Color: "Default", Lost: false},
		{Item: "LatexCorset1", Group: "Corset", Color: "Default", Lost: false},
		{Item: "FullLatexBra", Group: "Bra", Color: "Default", Lost: false},
		{Item: "Heels1", Group: "Shoes", Color: "#222222", Lost: false},
		{Item: "LatexSocks1", Group: "Socks", Color: "Default", Lost: false},
	],
	"Dungeon" : [
		{Item: "Bandeau1", Group: "Bra", Color: "Default", Lost: false},
		{Item: "Pantyhose1", Group: "SuitLower", Color: "Default", Lost: false},
		{Item: "Corset5", Group: "Corset", Color: "#777777", Lost: false},
		{Item: "AnkleStrapShoes", Group: "Shoes", Color: "#2D2D2D", Lost: false},
		{Item: "FloralPanties2", Group: "Panties", Color: ['#303030', '#F0F0F0'], Lost: false},
	],
	"Egyptian" : [
		{Item: "Sarashi1", Group: "Bra", Color: "Default", Lost: false},
		{Item: "Panties7", Group: "Panties", Color: "#ffffff", Lost: false},
		{Item: "Sandals", Group: "Shoes", Color: "Default", Lost: false},
		{Item: "FaceVeil", Group: "Mask", Color: "#ffffff", Lost: false},
		{Item: "HaremPants", Group: "ClothLower", Color: "Default", OverridePriority: 28, Lost: false},
	],
};

var KinkyDungeonCheckClothesLoss = false;

function KinkyDungeonInitializeDresses() {
	KinkyDungeonCheckClothesLoss = true;
	KinkyDungeonUndress = 0;
	if (Object.values(KinkyDungeonDresses).length > 0) {
		for (let d of Object.values(KinkyDungeonDresses)) {
			for (let dd of d) {
				if (dd.Lost) dd.Lost = false;
			}
		}
	}

}

let KinkyDungeonNewDress = false;

// Sets the player's dress to whatever she is wearing
function KinkyDungeonDressSet() {
	if (KinkyDungeonNewDress) {
		KinkyDungeonDresses.Default = [];
		let C = KinkyDungeonPlayer;
		for (let A = 0; A < C.Appearance.length; A++) {
			let save = false;
			if (C.Appearance[A].Asset.Group.BodyCosplay || C.Appearance[A].Asset.BodyCosplay) save = true;
			else if (C.Appearance[A].Asset.Group.Underwear) save = true;
			else if (C.Appearance[A].Asset.Group.Clothing) save = true;
			if (save) {
				KinkyDungeonDresses.Default.push({
					Item: C.Appearance[A].Asset.Name,
					Group: C.Appearance[A].Asset.Group.Name,
					Color: (C.Appearance[A].Color) ? C.Appearance[A].Color : (C.Appearance[A].Asset.DefaultColor ? C.Appearance[A].Asset.DefaultColor : "Default"),
					Lost: false,
				},);
			}
		}
	}
	KinkyDungeonNewDress = false;
}

function KinkyDungeonSetDress(Dress) {
	KinkyDungeonCurrentDress = Dress;
	for (let C = 0; C < KinkyDungeonDresses[KinkyDungeonCurrentDress].length; C++) {
		let clothes = KinkyDungeonDresses[KinkyDungeonCurrentDress][C];
		clothes.Lost = false;
	}
	KinkyDungeonCheckClothesLoss = true;
	KinkyDungeonDressPlayer();
	CharacterRefresh(KinkyDungeonPlayer);
}

function KinkyDungeonDressPlayer() {
	if (KinkyDungeonCheckClothesLoss) {
		CharacterNaked(KinkyDungeonPlayer);
		KinkyDungeonUndress = 0;
	}

	for (let C = 0; C < KinkyDungeonDresses[KinkyDungeonCurrentDress].length; C++) {
		let clothes = KinkyDungeonDresses[KinkyDungeonCurrentDress][C];
		let PreviouslyLost = clothes.Lost;

		if (!clothes.Lost && KinkyDungeonCheckClothesLoss) {
			if (clothes.Group == "Necklace") {
				if (KinkyDungeonGetRestraintItem("ItemTorso") && KinkyDungeonGetRestraintItem("ItemTorso").restraint.harness) clothes.Lost = true;
				if (KinkyDungeonGetRestraintItem("ItemArms") && InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ItemBreast")) clothes.Lost = true;
			}
			if (clothes.Group == "Bra") {
				if (KinkyDungeonGetRestraintItem("ItemBreast")) clothes.Lost = true;
			}
			if (clothes.Group == "ClothLower" && clothes.Skirt) {
				//if (KinkyDungeonGetRestraintItem("ItemTorso") && KinkyDungeonGetRestraintItem("ItemTorso").restraint.harness) clothes.Lost = true;
				if (KinkyDungeonGetRestraintItem("ItemPelvis")) clothes.Lost = true;
				if (InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ItemLegs")) clothes.Lost = true;
				if (InventoryGroupIsBlockedForCharacter(KinkyDungeonPlayer, "ClothLower")) clothes.Lost = true;
			}
			if (clothes.Group == "Shoes") {
				if (KinkyDungeonGetRestraintItem("ItemBoots")) clothes.Lost = true;
			}
			for (let inv of KinkyDungeonRestraintList()) {
				if (inv.restraint && inv.restraint.remove) {
					for (let remove of inv.restraint.remove) {
						if (remove == clothes.Group) clothes.Lost = true;
					}
				}
			}

			if (clothes.Lost) KinkyDungeonUndress += 1/KinkyDungeonDresses[KinkyDungeonCurrentDress].length;
		}

		if (clothes.Lost != PreviouslyLost) KinkyDungeonStatArousal += KinkyDungeonStatArousalMax/2/KinkyDungeonDresses[KinkyDungeonCurrentDress].length;

		if (!clothes.Lost) {
			if (KinkyDungeonCheckClothesLoss) {
				InventoryWear(KinkyDungeonPlayer, clothes.Item, clothes.Group);
				if (clothes.OverridePriority) {
					let item = InventoryGet(KinkyDungeonPlayer, clothes.Group);
					if (item) {
						if (!item.Property) item.Property = {OverridePriority: clothes.OverridePriority};
						else item.Property.OverridePriority = clothes.OverridePriority;
					}
				}
				CharacterAppearanceSetColorForGroup(KinkyDungeonPlayer, clothes.Color, clothes.Group);
			}
		}

		if (clothes.Group == "Panties" && !KinkyDungeonGetRestraintItem("ItemPelvis")) clothes.Lost = false; // A girl's best friend never leaves her
	}

	KinkyDungeonCheckClothesLoss = false;


	let BlushCounter = 0;
	let Blush = "";
	let Eyes = "";
	let Eyes2 = "";
	let Eyebrows = "";

	if (KinkyDungeonStatMana < KinkyDungeonStatManaMax*0.45) Eyes = "Sad";
	if (KinkyDungeonStatStamina <= KinkyDungeonStatStamina * 0.35 || KinkyDungeonArousalRate() > 0.5) Eyes = "Dazed";

	if (KinkyDungeonArousalRate() > 0.2 || KinkyDungeonStatMana < KinkyDungeonStatManaMax*0.33) Eyebrows = "Soft";
	if (KinkyDungeonArousalRate() > 0.7 && KinkyDungeonStatStamina > KinkyDungeonStatStaminaMax*0.5) Eyebrows = "Angry";

	if (KinkyDungeonArousalRate() >= 0.8) Eyes = (Eyebrows != "Angry" && KinkyDungeonArousalRate(true) > 0.99) ? "Lewd" : "Scared";

	if (KinkyDungeonArousalRate() > 0.1) Eyes2 = "Closed";

	if (KinkyDungeonStatStamina <= KinkyDungeonStatStaminaMax * 0.1) {
		Eyes = "Dazed";
		Eyes2 = "";
	}

	if (KinkyDungeonStatArousal > 0.01) BlushCounter += 1;
	if (KinkyDungeonArousalRate() > 0.33) BlushCounter += 1;
	if (KinkyDungeonArousalRate(true) > 0.65) BlushCounter += 1;

	if (KinkyDungeonUndress > 0.4) BlushCounter += 1;
	if (KinkyDungeonUndress > 0.8) BlushCounter += 1;

	if (BlushCounter == 1) Blush = "Low";
	else if (BlushCounter == 2) Blush = "Medium";
	else if (BlushCounter == 3) Blush = "High";
	else if (BlushCounter == 4) Blush = "VeryHigh";
	else if (BlushCounter == 5) Blush = "Extreme";

	for (let A = 0; A < KinkyDungeonPlayer.Appearance.length; A++) {
		if (KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Blush") {
			let property = KinkyDungeonPlayer.Appearance[A].Property;
			if (!property || property.Expression != Blush) {
				KinkyDungeonPlayer.Appearance[A].Property = { Expression: Blush };
				CharacterRefresh(KinkyDungeonPlayer);
			}
		}
		if (KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Eyebrows") {
			let property = KinkyDungeonPlayer.Appearance[A].Property;
			if (!property || property.Expression != Eyebrows) {
				KinkyDungeonPlayer.Appearance[A].Property = { Expression: Eyebrows };
				CharacterRefresh(KinkyDungeonPlayer);
			}
		}
		if (KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Eyes" || KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Eyes2") {
			let property = KinkyDungeonPlayer.Appearance[A].Property;
			if (!property || property.Expression != ((KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Eyes2" && Eyes2) ? Eyes2 : Eyes)) {
				KinkyDungeonPlayer.Appearance[A].Property = { Expression: ((KinkyDungeonPlayer.Appearance[A].Asset.Group.Name == "Eyes2" && Eyes2) ? Eyes2 : Eyes) };
				CharacterRefresh(KinkyDungeonPlayer);
			}
		}

	}

}
