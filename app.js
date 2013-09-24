// MODEL
var Monster = Backbone.Model.extend({
    defaults: {
        name: '',
        health: '',
        defense: '',
        attack: '',
        damage: '',
        gold: 0,
        xp: 0
        //items: []
    },
    attackMonster: function() {
    	var newHealth = this.get('health') - 4;
    	if (newHealth <= 0) {
    		this.destroy();
    	} else {
    		this.set({'health': newHealth});
    	}
    }
});

var Booty = Backbone.Model.extend({
	defaults: {
		gold: 0,
		xp: 0
	},
	addBooty: function(monster) {
		var gold = this.get('gold') + monster.gold;
		this.set({'gold': gold});
		var xp = this.get('xp') + monster.xp;
		this.set({'xp': xp});
		if(monster.items) {
			var item;
			if (this.get('items') === undefined) {
				items = [];
			} else {
				items = this.get('items');
			}
			if(Array.isArray(monster.items)) {
				_.each(monster.items, function(item) {
					items.push(item);
				});
			} else {
				items.push(monster.items);
			}	
			this.set({'items': items});
		}
	}
});

var Character = Backbone.Model.extend({
	defaults: {
		name: 'The unnamed one',
		level: 1,
		xp: 0,
		gold: 0,
		health: 0,
		mana: 0,
		attack: 0,
		defense: 0,
		speed: 0,
		damage: 0
	}
});

var character = new Character({
	name: 'The One', level: 1, xp: 50, gold: 20, health: 20,
	mana: 10,attack: 10, defense: 8, speed: 4, damage: 6
});

// COLLECTION
var Encounter = Backbone.Collection.extend({
    model: Monster,
    url: '/monsters',
    booty: new Booty(),
    initialize: function() {
        this.on('remove', this.hideModel);
        this.on('add', this.addBooty);
        this.on('reset', this.initiateBooty);
    },
    addBooty: function(monster) {
    	this.booty.addBooty(monster.toJSON());
    },
    initiateBooty: function() {
    	this.models.forEach(this.addBooty, this);
    },
    hideModel: function(model) {
        model.trigger('fadeOut');
        if (this.length === 0) {
        	console.log("They're all dead!");
        	this.trigger('endEncounter');
        }
    }
});

var encounter = new Encounter();

var monsters = [
    {name: 'Gobby', health: 10, defense: 10, attack: 5, damage: 4, gold: 2, xp: 4, items: 'car'},
    {name: 'Clobber', health: 15, defense: 10, attack: 7, damage: 4, gold: 3, xp: 4, items: 'rock'},
    {name: 'Gumms', health: 9, defense: 10, attack: 5, damage: 2, gold: 2, xp: 4, items: ['club', 'laser']}
];

encounter.reset(monsters);

// VIEWS

var MonsterView = Backbone.View.extend({
	events: {
		'click button': 'attackMonster'
	},
    template: _.template('<table class="table table-bordered table-condensed">' +
        '<th><%= name %></th>' +
        '<tr><td>Health</td> <td><%= health %></td>' +
        '<td>Defense</td><td><%= defense %></td></tr>' +
        '<tr><td>Attack</td><td><%= attack %></td>' +
        '<td>Damage</td><td><%= damage %></td><tr>' +
        '<tr><td><button type="button" class="btn btn-danger">Attack!</button></td></tr>' +
        '</table>'
        ),
    initialize: function() {
        this.model.on('fadeOut', this.remove, this);
        this.model.on('change', this.render, this);
    },
    attackMonster: function() {
    	this.model.attackMonster();
    },
    remove: function() {
        this.$el.fadeOut();
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var BootyView = Backbone.View.extend({
	template: _.template(
		"<h3>You've defeated the enemy! Here's what you got:</h3>" +
		'<table class="table table-bordered">' +
		'<tr><td>Gold</td><td><%= gold %></td>' +
		'<td>XP</td><td><%= xp %></td></tr>' +
		'<tr><td>Items</td><% _.each(items, function(item) { %>' +
		'<td><%= item %></td><% }); %></tr>' +
		'</table>'
	),
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var EncounterView = Backbone.View.extend({
  	el: '#encounter',
    initialize: function() {
        this.collection.on('add', this.addOne, this);
        this.collection.on('reset', this.addAll, this);
        this.collection.on('endEncounter', this.bootyView, this);
    },
    bootyView: function() {
    	console.log('Okay, the view knows it is over');
    	var bootyView = new BootyView({model: this.collection.booty});
    	this.$el.append(bootyView.render().el);
    },
    addOne: function(monster) {          
        var monsterView = new MonsterView({model: monster});
        this.$el.append(monsterView.render().el);
    },
    addAll: function() {
        this.collection.forEach(this.addOne, this);
    },
    render: function() {
        this.addAll();
    }
});

var CharacterView = Backbone.View.extend({
	el: '#character',
	template: _.template(
		'<h3><%= name %></h3>' +
		'<table class="table table-bordered">' +
	  	'<tr><td>Level</td><td> <%= level %> </td></tr>' +
	   	'<tr><td>XP</td><td> <%= xp %> </td>' +
	    '<td>Gold</td><td> <%= gold %> </td></tr>' +
	  	'<tr><td>Health</td><td> <%= health %> </td>' +
	    '<td>Mana</td><td> <%= mana %> </td></tr>' +
	  	'<tr><td>Attack</td><td> <%= attack %> </td>' +
	    '<td>Defense</td><td> <%= defense %> </td></tr>' +
	  	'<tr><td>Speed</td><td> <%= speed %> </td>' + 
	    '<td>Damage</td><td> <%= damage %> </td></tr>' +
		'</table>'
	),
	initialize: function() {
		this.model.on('change', this.render, this);
	},
	render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var characterView = new CharacterView({model: character});
characterView.render();
var encounterView = new EncounterView({collection: encounter});
encounterView.render();












