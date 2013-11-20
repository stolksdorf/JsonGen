Check out a demo [here](http://stolksdorf.github.io/JsonGen).

# What is it?
JsonGen is library for generating random JSON data. It uses a simple markup and handful of included functions. By passing a markup'd JSON object through `jsongen` it will return the randomized data as a JSON object.

	var users = jsongen([
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
					created : '{{date()}}'
				}
			],
			status : '{{rand("new", "processing", "registered")}}',
			user_data : function(){
				var rep = this.num(0,1000),
					userType = 'bronze';
				if(rep >= 300) userType = 'silver';
				if(rep >= 800) userType = 'gold';
				return {
					type : userType,
					reputation : rep
				}
			}
		}
	]);

	$(example).html('<pre>' + JSON.stringify(users, null, '  ') + '</pre>')
			  .css('font-family', 'Courier');

We're generating 2 users with various data: 0 - 3 post objects, a random status, and some user data. You can even embed the markup into strings, like we did with the address. If JsonGen runs into a function, it will just execute it normally and use the result.

Feel free to play around with this example and experiment by adding some of the various other comamnds from below.




# Commands
`index()`    - Returns the current iteration of a repeat loop. Useful for generating unique ids.

`bool()`      - Returns either a true or a false at random.

`num(max), num(min, max)` - If given one parameter returns a random number from 1 to `max`. If given two it will use the range.

`rand(n1,n2,n3,...)` - Given a list of any type of items it will return one of them at random.

`repeat(NumOfTimes), repeat(min, max)` - The repeat command is used as the first element of an array. It will then take the second element of the array and populate the array with that many copies of it. If only one parameter is passed to `repeat` is will repeat the object exactly that many times. If a range is given, JsonGen will chose a random number between those ranges.

`guid()`     - Returns a [Globally Unique Identifier](http://en.wikipedia.org/wiki/Globally_unique_identifier)

`name()`      - Combines a random first and last name

`firstname()` - Returns a first name from the most common North American names

`lastname()`  - Returns a last name from the most common North American names

`email()`     - Takes the first letter for a first name, a last name, @ a random company, with a random domain suffix

`company()`   - Returns one of the top 500 companies in the world

`phone()`     - Returns a randomly generated phone number

`street()`    - Returns a common street name from North America

`city()`      - Returns a common city name from North America

`date()`      - Generates a random date between now and Jan 1st 2010. Returned in [ISO8601 format](http://en.wikipedia.org/wiki/ISO_8601).

`now()`       - Returns the current time in [ISO8601 format](http://en.wikipedia.org/wiki/ISO_8601).

`unix()`      - Generates a random date between now and Jan 1st 2010. Returned in [Unix time](http://en.wikipedia.org/wiki/Unix_timestamp).

`unix_now()`  - Returns the current time in [Unix time](http://en.wikipedia.org/wiki/Unix_timestamp).

`lorem(max), lorem(min,max)` - Returns sentences of random text generated using [Lorem Ipsum](http://en.wikipedia.org/wiki/Lorem_ipsum).





# Functions
If JsonGen comes across a function in your markup, it will not only execute it, but it will scope all of JsonGen's functions onto `this`, letting you use everything in the library from within the function.

This is useful if you need to add logic to your data.

	var embeddedFunctions = jsongen([
		'{{repeat(5)}}',
		function(){
			var rep = this.num(0,1000),
				userType = 'bronze';
			if(rep >= 300) userType = 'silver';
			if(rep >= 800) userType = 'gold';
			return {
				email      : this.email(),
				user_type  : userType,
				reputation : rep,
				gender     : this.rand('male', 'female')
			}
		}
	]);

	$(example).html('<pre>' + JSON.stringify(embeddedFunctions, null, '  ') + '</pre>')
			  .css('font-family', 'Courier');





# Definitions
JsonGen uses arrays of words to generate it's random data stored in the `jsongen.wordbank` variable. You can overwrite these to have your data generation more specific to your needs.

The word banks used are `lorem`, `firstNames`, `lastNames`, `companyNames`, `streetNames`, `cityNames`, and `websiteDomains`

	jsongen.wordbank.firstNames = ['Enzo', 'Dot', 'Bob', 'Megabyte', 'Hexidecimal'];

	var RebootCharacters = jsongen([
		'{{repeat(2)}}',
		'{{firstname()}}'
	]);

	$(example).html('<pre>' + JSON.stringify(RebootCharacters, null, '  ') + '</pre>')
			  .css('font-family', 'Courier');





# External Libraries
JsonGen will pick up additional functionality if certain libraries are included on your page.

## Faker.js

[Faker.js](https://github.com/marak/Faker.js/) is a fantastic library written by Matthew Bergman & Marak Squires. It greatly increases the types of data you can generate with JsonGen.

Every Faker.js function is accessible using the `Faker` prefix. Check out the full documentation [here](https://github.com/marak/Faker.js/#api).

	var FakerIsCool = jsongen({
		bs : '{{Faker.random.bs_adjective()}} {{Faker.random.bs_noun()}}',
		catchPhrase : '{{Faker.Company.catchPhrase()}}',
		user : function(){
			return this.Faker.Helpers.userCard();
		}
	});

	$(example).html('<pre>' + JSON.stringify(FakerIsCool, null, '  ') + '</pre>')
			  .css('font-family', 'Courier');

## Moment.js

[Moment.js](http://momentjs.com/) is a complete Javascript date library for parsing, validating, manipulating, and formatting dates. If you have it on your page, then JsonGen will update the `now()` and the `date()` functions to use Moment.js's formatting.

Check out full documentation on Moment.js's formating [here](http://momentjs.com/docs/#/displaying/format/).

	var MomentIsAlsoCool = jsongen([
		'{{date("dddd, MMMM Do YYYY, h:mm:ssA")}}',
		function(){
			return this.now('dddd MMMM Do[, ] DDDo [day of the year.] SSS[ms]');
		}
	]);

	$(example).html('<pre>' + JSON.stringify(MomentIsAlsoCool, null, '  ') + '</pre>')
			  .css('font-family', 'Courier');

