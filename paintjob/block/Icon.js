PaintJob_Block_Icon = Object.create(Block).blueprint({
	schematic : 'project_icon',

	initialize : function(iconData)
	{
		this.iconData = iconData;
		return this;
	},
	render : function()
	{
		if(this.iconData.link){
			if(typeof this.iconData.link === 'function'){
				this.dom.block.attr('href', this.iconData.link());
			} else {
				this.dom.block.attr('href', this.iconData.link);
			}
		}

		if(this.iconData.tooltip){
			this.dom.block.attr('data-hint', this.iconData.tooltip);
		}

		if(this.iconData.color){
			this.dom.block.addClass(this.iconData.color);
		}
		if(this.iconData.icon_class){
			this.dom.iconElement.addClass(this.iconData.icon_class);
		}
		return this;
	},


})