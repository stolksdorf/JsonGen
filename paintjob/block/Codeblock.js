Paintjob_Block_Example = Object.create(Block).blueprint({
	schematic : 'code_block',

	initialize : function(preCodeElement, id, projectData)
	{
		var self = this;
		this.id = 'codeblock' + id;
		this.projectData = projectData
		this.super('initialize');

		this.dom = {
			block : this.getSchematic()
		};

		var code = preCodeElement.text();
		preCodeElement.parent().replaceWith(this.dom.block);
		this.getElements();


		this.editor = CodeMirror(function(elt) {
			self.dom.editor[0].parentNode.replaceChild(elt, self.dom.editor[0]);
		}, {
			value          : code,
			mode           : 'javascript',
			viewportMargin : Infinity,
			lineNumbers    : true,
			matchBrackets  : true,
			tabMode        : 'indent'
		});

		this.render();
		return this;
	},
	render : function()
	{
		var self = this;

		if(!this.projectData.runnable_code_blocks){
			this.dom.runButton.hide();
			this.dom.outputContainer.hide();
			return this;
		}

		this.dom.runButton.click(function(){
			self.executeCodeBlock();
		});
		return this;
	},

	executeCodeBlock : function()
	{
		var self = this;

		var codeBlockHtml        = jQuery('[data-schematic="code_html"]');
		var codeBlockHtmlElement = jQuery(jQuery('<div>').append(codeBlockHtml.clone().removeAttr('data-schematic')).html());

		if(codeBlockHtmlElement && codeBlockHtmlElement !== ""){
			this.dom.output.replaceWith(codeBlockHtmlElement);
			this.dom.output = codeBlockHtmlElement;
			this.dom.output.show().attr('id', this.id);
			this.dom.outputError.hide()
			this.dom.outputContainer.show();
		} else{
			this.dom.outputContainer.hide();
		}

		try{
			eval('(function(){var example = $("#' + self.id + '");'+self.editor.getValue()+'})();');
		}catch(e){
			self.dom.outputContainer.show();
			self.dom.output.hide();
			self.dom.outputError.html(e.toString()).show();
		}

		return this;
	},
});
