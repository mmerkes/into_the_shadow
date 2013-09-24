// MODEL
var Monster = Backbone.Model.extend({
    defaults: {
        name: '',
        health: '',
        defense: '',
        attack: '',
        damage: ''
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

// COLLECTION
var Encounter = Backbone.Collection.extend({
    model: Monster,
    url: '/monsters',
    initialize: function() {
        this.on('remove', this.hideModel);
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
    {name: 'Gobby', health: 10, defense: 10, attack: 5, damage: 4},
    {name: 'Clobber', health: 15, defense: 10, attack: 7, damage: 4},
    {name: 'Gumms', health: 9, defense: 10, attack: 5, damage: 2}
];

encounter.reset(monsters);

// VIEW

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
        console.log(this.model);
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

var EncounterView = Backbone.View.extend({
  	el: '#encounter',
    initialize: function() {
        this.collection.on('add', this.addOne, this);
        this.collection.on('reset', this.addAll, this);
        this.collection.on('endEncounter', this.bootyView, this);
    },
    bootyView: function() {
    	console.log('Okay, the view knows it is over');
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

var encounterView = new EncounterView({collection: encounter});
encounterView.render();












