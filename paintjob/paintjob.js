jQuery.fn.sticky = function(topOverride){
	var element = this;
	var oldTop = topOverride || element.offset().top;

	jQuery(window).scroll(function() {
		if(element.hasScrolledPast()) {
			element.css({
				'position':'fixed',
				'top'     :'0px'})
				.addClass('stuck');
		}
		if(oldTop > element.offset().top){
			element.css({
				'position':'absolute',
				'top'     : oldTop + 'px'})
				.removeClass('stuck');
		}
	});
	element.parent().css('position', 'relative');
	return this;
};

jQuery.fn.hasScrolledPast = function(){
	return this.offset().top <= jQuery(window).scrollTop();
}

jQuery.fn.scrollTo = function(duration){
	duration = duration || 800;
	$('html, body').animate({scrollTop: $(this).offset().top}, duration);
};

CreatePaintJob = function(projectData){
	return Object.create(PaintJob_Block_Project).initialize(projectData);
};
