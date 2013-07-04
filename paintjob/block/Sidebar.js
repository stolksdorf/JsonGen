PaintJob_Block_Sidebar = Object.create(Block).blueprint({
	block : 'sideBar',

	initialize : function(projectData)
	{
		this.super('initialize');

		this.dom.logo.addClass(projectData.logo_color);
		this.dom.logoIcon.addClass(projectData.logo_class);

		return this;
	},

	render : function()
	{
		var self = this;

		this.dom.block.sticky(150);

		this.dom.logo.click(function(){
			$('body').scrollTo();
		});


		this.dom.logo.mouseover(function(){
			if(self.dom.block.hasClass('stuck')){
				self.dom.logoIcon.hide();
				self.dom.logoUp.show();
			}
		}).mouseout(function(){
			self.dom.logoIcon.show();
			self.dom.logoUp.hide();
		});


		return this;
	},

	addNavItem : function(name, docblock, color)
	{
		var navElement = $('<div></div>').appendTo(this.dom.nav);
		navElement.addClass('sideBar__nav__item').addClass(color).html(name).click(function(){
			docblock.scrollTo();
		});

		$(window).scroll(function() {
			if(docblock.hasScrolledPast()){ navElement.addClass('scrolled'); }
			else { navElement.removeClass('scrolled'); }
		});
		return this;
	},


});