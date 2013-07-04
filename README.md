# Hey there

	var basicTest = jsongen([
		"{{repeat(2,30)}}",
		"{{lorem()}}"
	]);

	$(example).html(JSON.stringify(basicTest, null, '\t'));

So cool