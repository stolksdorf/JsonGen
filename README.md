# Hey there

	var basicTest = jsongen([
		"{{repeat(2,30)}}",
		"{{num(1,10)}}"
	]);
	$(example).html(JSON.stringify(basicTest, null, '\t'));

So cool