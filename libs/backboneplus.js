Block = Backbone.View.extend( {
	setSchematic : function(schematicName)
	{
		this._schematicHtml = this.findSchematic(schematicName);
		return this;
	},

	setBlock : function(blockName)
	{
		var block = this.findBlock(blockName);
		this.dom = this.dom || {};
		this.dom.block = block;
		return this;
	},

	findSchematic : function(schematicName)
	{
		var schematic = $('[data-schematic="'+ schematicName + '"]');
		if(schematic.length === 0) {
			console.error('BBP : Can not find schematic with name: ' + schematicName);
		} else if(schematic.length > 1) {
			console.error('BBP : Multiple schematics with name: ' + schematicName);
		}
		//creates a string of the entire html object, including container
		return $('<div>').append($(schematic[0]).clone().removeAttr('data-schematic')).html();
	},

	findBlock : function(blockName)
	{
		var block = $('[data-block="'+ blockName + '"]');
		if(block.length === 0) {
			console.error( 'BBP : Can not find block with name of ' + blockName);
		}
		return block;
	},

	findElement : function(elementName)
	{
		var element = this.dom.block.find('[data-element="'+ elementName + '"]');
		if(element.length === 0) {
			console.error('BBP : Can not find element with name of ' + elementName);
		}
		return element;
	},

	setElements : function(elementObj)
	{
		var self = this;
		_.each(elementObj, function(elementName, variableName){
			self.dom[variableName] = self.findElement(elementName);
		});
		return this;
	},

	setModelEvents : function(eventObj, triggerImmeadately)
	{
		var self = this;
		_.each(eventObj, function(func, event){
			if(typeof func === 'function'){
				self.model.on(event, func);
			} else if(typeof func === 'string'){
				if(typeof self[func] === 'function'){
					self.model.on(event, self[func]);
				}
			}
			if(triggerImmeadately){
				self.model.trigger(event);
			}
		});
		return this;
	},

	injectIntoTop : function(injectionPoint)
	{
		this._beforeInject();
		if(typeof this._schematicHtml === 'undefined'){
			throw 'BBP : Schematic for this block is not set';
		}
		if(!injectionPoint instanceof $ || typeof injectionPoint === 'undefined') {
			throw 'BBP : injectionPoint is not a jQuery object';
		}
		if(injectionPoint.length === 0 ){
			throw 'BBP : Could not find the injection point';
		}
		this.dom = this.dom || {};
		this.dom.block = $(this._schematicHtml).prependTo(injectionPoint);
		this._afterInject();
		return this;
	},

	injectInto : function(injectionPoint)
	{
		this._beforeInject();
		if(typeof this._schematicHtml === 'undefined'){
			throw 'BBP : Schematic for this block is not set';
		}
		if(!injectionPoint instanceof $ || typeof injectionPoint === 'undefined') {
			throw 'BBP : injectionPoint is not a jQuery object';
		}
		if(injectionPoint.length === 0 ){
			throw 'BBP : Could not find the injection point';
		}
		this.dom = this.dom || {};
		this.dom.block = $(this._schematicHtml).appendTo(injectionPoint);
		this._afterInject();
		return this;
	},

	/**
	 * Called before the block has been injected into a location.
	 * used for setting up templates from the phtml
	 */
	_beforeInject: function()
	{
		return this;
	},

	/**
	 * Called after the block has been injected into a location.
	 * This is called when the this.dom.block instance is alive and can be worked with.
	 * used for attaching events to dom elements
	 */
	_afterInject: function()
	{
		return this;
	},

	show : function()
	{
		this.dom.block.show();
		return this;
	},

	hide : function()
	{
		this.dom.block.hide();
		return this;
	},

	remove : function()
	{
		this.dom.block.remove();
		this.stopListening();
		return this;
	}
});


Model = Backbone.Model.extend({

	fetch : function(callback)
	{
		var self = this;
		$.ajax({
			url : self.url(),
			type : 'GET',
			success : function(response){
				self.set(response);
				self.trigger('fetch', self);
				if(typeof callback === 'function'){
					callback(self, response);
				}
			},
			error : function(){
				self.trigger('error:fetch', self);
			}
		});
		return this;
	},

	save : function(callback)
	{
		var self = this;
		console.log(self.url());
		$.ajax({
			url : self.url(),
			type : 'POST',
			data : self.toJSON(),
			success : function(response){
				self.set(response);
				self.trigger('save', self);
				if(typeof callback === 'function'){
					callback(self, response);
				}
			},
			error : function(){
				self.trigger('error:save', self);
			}
		});
		return this;
	},

	destroy : function(callback)
	{
		var self = this;
		console.log('calling this', self.url() + '/delete');
		$.ajax({
			url : self.url() + '/delete',
			type : 'POST',
			success : function(response){
				self.trigger('destroy', self);
				if(typeof callback === 'function'){
					callback(self, response);
				}
			},
			error : function(){
				self.trigger('error:destroy', self);
			}
		});
		return this;
	},

	toJSONString: function()
	{
		return JSON.stringify(this.toJSON(), null, '    ');
	}
});

Controller = Backbone.Router.extend({ });
Collection = Backbone.Collection.extend({ });