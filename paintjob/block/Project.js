PaintJob_Block_Project = Object.create(Block).blueprint({
	block : 'project',

	initialize : function(projectData)
	{
		this.projectData = projectData;
		this.dom = {
			block : jQuery('[data-block="' + this.block + '"]')
		};
		this.getElements();
		this.fetchRepoData();
		return this;
	},

	fetchRepoData : function()
	{
		var self = this;

		//Used for testing if I want to grab the local readme.md instead of the repos
		if(this.projectData.use_local){
			$.get('readme.md', function(result){
				self.projectData.readme = result;
				self.projectData.name = self.projectData.repo;
				self.render();
			});
			return this;
		}

		$.ajax({
			url : 'https://api.github.com/repos/' + this.projectData.user + '/' + this.projectData.repo,
			type : 'GET',
			error  : function(result){
				console.error(result.responseText);
				alert('There was an error gathering the repo data\n\n' + result.responseText);
			},
			success : function(result){
				self.projectData.name        = result.name;
				self.projectData.github_url  = result.owner.html_url;
				self.projectData.description = result.description;
				if(typeof self.projectData.readme !== 'undefined'){self.render();}
			}
		});

		$.ajax({
			url : 'https://api.github.com/repos/' + this.projectData.user + '/' + this.projectData.repo + '/readme',
			type : 'GET',
			headers: { 'Accept': 'application/vnd.github.raw' },
			error  : function(result){
				console.error(result.responseText);
				alert('There was an error gathering the repo readme\n\n' + result.responseText);
			},
			success : function(result){
				self.projectData.readme = result;
				if(typeof self.projectData.name !== 'undefined'){self.render();}
			}
		});
		return this;
	},

	render : function(){
		var self = this;
		this.dom.name.html(this.projectData.name);
		this.dom.description.html(this.projectData.description);

		this.sideBar = Object.create(PaintJob_Block_Sidebar).initialize(this.projectData);

		this.buildDocumentation(this.projectData.readme);
		this.buildCodeBlocks();
		this.buildNav();
		this.buildIcons();
		this.buildExample();
		return this;
	},

	buildDocumentation : function(markdown)
	{
		var newHTML = new Markdown.Converter().makeHtml(markdown);
		newHTML = newHTML.replace(/<h1>/g, '</div><div class="docblock"><h1>' );
		this.dom.documentation.html(newHTML + '</div>');
		return this;
	},

	buildCodeBlocks : function()
	{
		var self = this;
		this.dom.documentation.find('pre code').each(function(index, codeBlock){
			Object.create(Paintjob_Block_Example).initialize($(codeBlock), index, self.projectData);
		});
		return this;
	},

	buildNav : function()
	{
		var self = this;
		var colors = ['teal','orange', 'green','blue','red','purple','steel','yellow'];
		this.dom.documentation.find('.docblock').each(function(index, docBlock){
			var docBlock = $(docBlock);
			var color = colors[index%colors.length];
			docBlock.addClass(color);

			self.sideBar.addNavItem(docBlock.find('h1').html(), docBlock, color);
		});

		return this;
	},

	buildExample : function()
	{
		exampleHtml =jQuery('[data-schematic="example_html"]').html();

		if(exampleHtml && exampleHtml !== ""){
			this.dom.example.html(exampleHtml);
		}
		if(typeof this.projectData.example_initialize === 'function'){
			this.projectData.example_initialize();
		}

		return this;
	},

	buildIcons : function()
	{
		var self = this;
		_.each(this.projectData.icons, function(iconData){
			Object.create(PaintJob_Block_Icon)
				.initialize(iconData)
				.injectInto(self.dom.iconContainer);
		})
		return this;
	},


});
