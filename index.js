$(document).ready(function(){

	jsongen.definitions.firstNames = ['bill', 'ted'];

	jsongen.functions.test = function(){
		return 6;
	}


	myCodeMirror = CodeMirror.fromTextArea($('.input')[0],{
		mode:  "javascript",
		lineNumbers : true,
		indentWithTabs : true
	});

	myCodeMirror.on ('change', function(){
		update();
	});
	update();

});

function update(){
	try{
		var result = eval('var jsongen_result=jsongen(' + myCodeMirror.getValue() + ');jsongen_result');
		$('.result').html(JSON.stringify(result, null, '\t'));
	} catch(e){
		$('.result').html("Error");
	}
}