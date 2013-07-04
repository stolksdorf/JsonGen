# Hey there

	var basicExample = jsongen([
		'{{repeat(2)}}',
		{
			name    : '{{name()}}',
			id      : '{{guid()}}',
			email   : '{{email()}}',
			address : '{{num(1,99)}} {{street()}}, {{city()}}',
			posts   : [
				'{{repeat(0,3)}}',
				{
					content : '{{lorem()}}',
					created : '{{utc()}}'
				}
			],
			status : '{{rand("new", "processing", "registered")}}',
			tags   : [
				'{{repeat(0,10)}}',
				'{{lorem(1)}}'
			]
		}
	]);

	$(example).html(JSON.stringify(basicExample, null, '  '));

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

If Jsongen comes across a function in your markup, it will not only execute t, but it will scope all of Jsongen's functions onto `this`, letting you use everything in the library from within the function.

This is useful if you need to add logic to your data.

	var embeddedFunctions = jsongen([
		'{{repeat(5)}}',
		{
			email : '{{email()}}',
			gender : function(){
				if(this.bool()) return 'male';
				return 'female';
			}
		}
	]);

	$(example).html(JSON.stringify(embeddedFunctions, null, '  '));

# Definitions

Jsongen uses arrays of words to generate it's random data stored in the `jsongen.wordbank` variable. You can overwrite these to have your data generation more specific to your needs.

The word banks used are `lorem`, `firstNames`, `lastNames`, `companyNames`, `streetNames`, `cityNames`, and `websiteDomains`

	jsongen.wordbank.firstNames = ['Enzo', 'Dot', 'Bob', 'Megabyte', 'Hexidecimal'];

	var RebootCharacters = jsongen([
		'{{repeat(2)}}',
		'{{firstname()}}'
	]);

	$(example).html(JSON.stringify(RebootCharacters, null, '  '));

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

[Moment.js](http://momentjs.com/) is a complete Javascript date library for parsing, validating, manipulating, and formatting dates. If you have it on your page, then Jsongen will update the `now` and the `date` functions to use Moment.js's formatting.

Check out full documentation on Moment.js's formating [here](http://momentjs.com/docs/#/parsing/string-format/)

	var MomentIsAlsoCool = jsongen([
		'{{date("YYYY-MM-DD HH:mm Z")}}',
		function(){
			return this.now('dddd MMMM DD[, ] DDD [day of the year.] SSS[ms]');
		}
	]);

	$(example).html(JSON.stringify(MomentIsAlsoCool, null, '  '));

