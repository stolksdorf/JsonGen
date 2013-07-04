# Hey there

	var basicTest = jsongen([
		"{{repeat(2,30)}}",
		"{{lorem()}}"
	]);

	$(example).html(JSON.stringify(basicTest, null, '\t'));

So cool

# Commands

repeat
index
guid
name
firstname
lastname
email
company
phone
street
city
date
now
utc
utc_now
bool
num
rand
lorem

# Functions

	var basicTest = jsongen([
		"{{repeat(2,30)}}",
		function(){
			if(this.bool()) return 'male';
			return 'female';
		}
	]);

	$(example).html(JSON.stringify(basicTest, null, '\t'));


# External Libraries

Jsongen will pick up additional functionality if certain libraries are included on your page

## Faker.js

[Faker.js](https://github.com/marak/Faker.js/) is a fantastic library written by Matthew Bergman & Marak Squires. It greatly increases the types of data you can generate with Jsongen.

Every Faker.js function is accessible using the `Faker` prefix. Check out the full documentation [here](https://github.com/marak/Faker.js/#api)

	var FakerIsCool = jsongen({
		bs : '{{Faker.random.bs_adjective()}} {{Faker.random.bs_noun()}}',
		catchPhrase : '{{Faker.Company.catchPhrase()}}',
		user : function(){
			return this.Faker.Helpers.userCard();
		}
	});

	$(example).html(JSON.stringify(FakerIsCool, null, '  '));

## Moment.js

[Moment.js]() is a complete Javascript date library for parsing, validating, manipulating, and formatting dates. If youe have Moment.js on your page, then Jsongen will update the `now` and the `date` functions to use Moment.js's formatting.

Check out full documentation on Moment.js's formating [here](http://momentjs.com/docs/#/parsing/string-format/)

	var MomentIsAlsoCool = jsongen([
		'{{now("YYYY-MM-DD HH:mm Z")}}',
		'{{now("YYYY-MM-DD HH:mm Z")}}'
	]);

	$(example).html(JSON.stringify(MomentIsAlsoCool, null, '  '));

