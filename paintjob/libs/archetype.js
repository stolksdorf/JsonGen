(function(){

	Archetype = {
		initialize : function(){
			return this;
		},
		blueprint : function(methods){
			for(var methodName in methods){
				this[methodName] = methods[methodName];
			}
			this.__blueprint__ = this;
			return this;
		},

		//Experimental
		extend : function(methods)
		{
			return Object.create(this).blueprint(methods);
		},


		super : function(methodName){
			return Object.getPrototypeOf(this.__blueprint__)[methodName].apply(this, Array.prototype.slice.apply(arguments).slice(1));
		},

		on : function(eventName, event){
			this.__events__ = this.__events__ || {};
			this.__events__[eventName] = this.__events__[eventName] || [];
			this.__events__[eventName].push(event);
			return this;
		},
		trigger : function(eventName){
			if(this.__muted__){return;}
			this.__events__ = this.__events__ || {};
			if(this.__events__[eventName]){
				for(var i = 0; i < this.__events__[eventName].length; i++) {
					this.__events__[eventName][i].apply(this, Array.prototype.slice.apply(arguments).slice(1));
				}
			}
			return this;
		},
		mute : function(){
			this.__muted__ = true;
			return this;
		},
		unmute : function(){
			this.__muted__ = false;
			return this;
		},
	};

	/*********************************************
						PROMISE
	**********************************************/
	Promise = Object.create(Archetype).blueprint({

		then : function(success, fail)
		{
			try{


			}catch(error){
				if(typeof fail === 'function'){fail(error);}
			}

			return this;
		},

		and : function(success, fail)
		{

			return this;
		},



	});



	/*********************************************
						MODEL
	**********************************************/
	Model = Object.create(Archetype).blueprint({
		defaults : {},
		initialize : function(attributes)
		{
			this.reset(attributes);
			return this;
		},
		get : function(attrName)
		{
			return this.attributes[attrName];
		},
		set : function(attrName, val)
		{
			this.attributes[attrName] = val;
			this.trigger('change:'+attrName);
			this.trigger('change');
			return this;
		},
		has : function(attrName)
		{
			return typeof this.attributes[attrName] !== 'undefined';
		},
		toJSON : function()
		{
			return JSON.stringify(this.attributes);
		},
		reset : function(newAttributes)
		{
			this.attributes = this.defaults;
			for(var attrName in newAttributes){
				this.attributes[attrName] = newAttributes[attrName];
			}
			this.trigger('reset');
			return this;
		}
	});

	/*********************************************
						COLLECTION
	**********************************************/
	Collection = Object.create(Archetype).blueprint({
		model : Model,

		initialize : function(modelData)
		{
			this.reset(modelData);
			return this;
		},
		add : function(modelData)
		{
			var newModel = modelData;
			if(!(modelData instanceof this.model)){
				newModel = Object.create(this.model).initialize(modelData);
			}
			this.models.push(newModel);
			this.trigger('add', newModel);
			return this;
		},
		remove : function(modelId)
		{
			if(modelId instanceof this.model){
				modelId = modelId.get('id');
			}
			for(var i=0;i<this.models.length;i++){
				if(this.models[i].get('id') === modelId){
					this.models.splice(i,1);
					this.trigger('remove', this.models[i]);
					return this;
				}
			}
			return this;
		},
		reset : function(modelData)
		{
			this.models = [];
			for (var i=0;i<modelData.length;i++){
				this.add(modelData[i]);
			}
			this.trigger('reset');
			return this;
		},
		map : function(fn)
		{
			var result = [];
			for(var i=0;i<this.models.length;i++){
				result.push(fn(this.models[i]));
			}
			return result;
		},
		reduce : function(fn, memo)
		{
			for(var i=0;i<this.models.length;i++){
				memo = fn(this.models[i], memo);
			}
			return memo;
		},
		toJSON : function()
		{
			return this.map(function(model){
				return model.toJSON();
			});
		},
	});


	/*********************************************
						BLOCK
	**********************************************/


	Block = Object.create(Archetype).blueprint({
		block     : '',
		schematic : '',

		initialize : function()
		{
			this.dom = this.dom || {};
			if(this.block !== ''){
				this.dom.block = jQuery('[data-block="' + this.block + '"]');
				this.getElements();
				this.render();
			}
			return this;
		},

		injectInto : function(injectionPoint)
		{
			this.dom = this.dom || {};
			this.trigger('before:inject', this);
			this.dom.block       = this.getSchematic().appendTo(injectionPoint);

			this.getElements().render();
			this.trigger('inject', this);
			return this;
		},

		getSchematic : function()
		{
			var schematicElement = jQuery('[data-schematic="' + this.schematic + '"]');
			var schematicCode    = jQuery('<div>').append(schematicElement.clone().removeAttr('data-schematic')).html();
			return jQuery(schematicCode);
		},

		getElements : function()
		{
			var self = this;
			this.dom.block.find('[data-element]').each(function(index, element){
				element = jQuery(element);
				self.dom[element.data('element')] = element;
			});
			return this;
		},

		render : function()
		{
			return this;
		},

		mapActions : function(actionMap)
		{
			for(var key in actionMap){
				var elementName = key.split(' ')[0];
				var actionName  = key.split(' ')[1];
				this.dom[elementName].on(actionName, actionMap[key]);
			}
			return this;
		},
	});

/*
	hideSchematics = function(){
		var css = document.createElement("style");
		css.type = "text/css";
		css.innerHTML = '[data-schematic]{display :none !important;}';

		alert(typeof document.body);

		document.body.appendChild(css);
	}();

	*/
})();









