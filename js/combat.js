var uva_mangina = {
	health: 20, 
	attack: 50, 
	defense: 5, 
	speed: 6,
	damage: 4
};

var goblin = {
	health: 10,
	attack: 40,
	defense: 3,
	speed: 7,
	damage: 2
};

var attack = function(attack, defense) {
	if(Math.random() > (defense/attack)) {
		return true;
	} else {
		return false;
	}
}

var combat = function(character, monster) {
	var i = 0;
	while (character.health > 0 && monster.health > 0) {
		if (i % character.speed == 0 && attack(character.attack, monster.defense)) {
			monster.health = monster.health - character.damage;
			console.log("Ouch! You just bitch slapped the goblin for " 
						+ character.damage + "!");
			alert("You: " + character.health + " Him: " + monster.health);
		}
		if (i % monster.speed == 0 && attack(monster.attack, character.defense)) {
			character.health = character.health - monster.damage;
			console.log("Wow, you just got owned for " + monster.damage + "!");
			alert("You: " + character.health + " Him: " + monster.health);
		}
		i = i + 1;
	}

	if (character.health <= 0) {
		console.log("You're dead! You suck.")
	} else {
		console.log("You defeated the enemy! He was a pussy anyway...")
	}
};

combat(uva_mangina, goblin);