(function(){
	var addedExternals = false;

	//underscore Shim
	var _ = _ || {
		extend : function(obj1, obj2){
			for(var propName in obj2){
				if(obj2.hasOwnProperty(propName)){ obj1[propName] = obj2[propName]; }
			}
			return obj1;
		},
		each : function(obj, fn){
			for(var propName in obj){
				if(obj.hasOwnProperty(propName)){ fn(obj[propName], propName); }
			}
		},
		isArray : Array.isArray || function(obj) {
			return toString.call(obj) == '[object Array]';
		},
		isNaN : function(obj){
			return toString.call(obj) == '[object Number]' && obj != +obj;
		},
		isObject : function(obj) {
			return obj === Object(obj);
		},
		random : function(min, max){
			if (max == null) {
				max = min;
				min = 0;
			}
			return min + Math.floor(Math.random() * (max - min + 1));
		}
	};

	jsongen = function(blueprint){
		if(!addedExternals) {addExternalLibraries(); }

		var processLayer = function(obj, index){
			var result;
			if(_.isArray(obj)){
				result = [];
				for(var i= 0; i < obj.length; i++){
					if(typeof obj[i] === 'string' && startsWith(obj[i], '{{repeat(') && endsWith(obj[i], '}}')){
						var number = obj[i].replace('{{repeat(', '').replace(')}}', '');
						if(number.indexOf(',') !== -1){
							number = _.random(parseInt(number.split(',')[0]),parseInt(number.split(',')[1]));
						}
						var nextObj = obj[i+1];
						for(var t_index = 0; t_index < number; t_index++){
							result.push(processLayer(nextObj, t_index));
						}
						i++;
					} else {
						result.push(processLayer(obj[i], index));
					}
				}
			}else if(typeof obj === 'function'){
				result = obj.call(jsongen.functions, index);
			}else if(typeof obj === 'string'){
				result = processString.call(_.extend(jsongen.functions, {t_index: index}), obj, index);
			}else if(_.isObject(obj)){
				result={};
				_.each(obj, function(val, key){
					result[key] = processLayer(val, index);
				});
			}else{
				result = obj;
			}
			return result;
		};
		return processLayer(blueprint);
	};

	/**
	 * Checks to see if Faker or/and Moment is installed and adds extra functionality
	 */
	var addExternalLibraries = function(){
		if(typeof Faker !== 'undefined'){
			jsongen.functions.Faker = Faker;
		}
		if(typeof moment !== 'undefined'){
			jsongen.functions.date = function(format)
			{
				format = format || '';
				return moment(this.utc()).format(format);
			};
			jsongen.functions.now = function(format)
			{
				format = format||'';
				return moment().format(format);
			};
		}
		addedExternals = true;
	}

	var startsWith = function(str, target){
		return str.indexOf(target) === 0;
	};

	var endsWith = function(str, suffix) {
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	};

	var randomFromArray = function(arr){
		return arr[Math.floor(Math.random()*arr.length)];
	};

	/**
	 * Takes a string and returns an array of all the substrings that exist between the two delimiters
	 */
	var hunt = function(target, startDelimiter, endDelimiter){
		var i = 0;
		var result = [];
		while(1){
			var s = target.indexOf(startDelimiter, i);
			var e = target.indexOf(endDelimiter, s);
			if(s === -1 || e === -1 || e >= target.length){
				break;
			}
			result.push(target.substring(s + startDelimiter.length,e));
			i = e;
		}
		return result;
	};

	/**
	 * if the value was a string, attempt to parse out commands wrapped in '{{ }}'
	 * if it's a normal string just return
	 */
	var processString = function(target, index){
		var self = this;
		_.each(hunt(target, '{{', '}}'), function(code){
			try{
				var result = eval('var jsongen_result=self.' + code + ';jsongen_result');
				target = target.replace('{{' + code + '}}', result);
			} catch(error){
				target = target.replace('{{' + code + '}}', error);
			}
		});
		if(!_.isNaN(Number(target))){
			target = Number(target);
		} else if(target === 'true'){
			target = true;
		} else if(target === 'false'){
			target = false;
		}
		return target;
	};

	jsongen.definitions = {
		loremWordBank : ['lorem','ipsum','dolor','sit','amet,','consectetur','adipisicing','elit,','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua.','enim','ad','minim','veniam,','quis','nostrud','exercitation','ullamco','laboris','nisi','ut','aliquip','ex','ea','commodo','consequat.','duis','aute','irure','dolor','in','reprehenderit','in','voluptate','velit','esse','cillum','dolore','eu','fugiat','nulla','pariatur.','excepteur','sint','occaecat','cupidatat','non','proident,','sunt','in','culpa','qui','officia','deserunt','mollit','anim','id','est','laborum.','sed','ut','perspiciatis,','unde','omnis','iste','natus','error','sit','voluptatem','accusantium','doloremque','laudantium,','totam','rem','aperiam','eaque','ipsa,','quae','ab','illo','inventore','veritatis','et','quasi','architecto','beatae','vitae','dicta','sunt,','explicabo.','nemo','enim','ipsam','voluptatem,','quia','voluptas','sit,','aspernatur','aut','odit','aut','fugit,','sed','quia','consequuntur','magni','dolores','eos,','qui','ratione','voluptatem','sequi','nesciunt,','neque','porro','quisquam','est,','qui','dolorem','ipsum,','quia','dolor','sit,','amet,','consectetur,','adipisci','velit,','sed','quia','non','numquam','eius','modi','tempora','incidunt,','ut','labore','et','dolore','magnam','aliquam','quaerat','voluptatem.','ut','enim','ad','minima','veniam,','quis','nostrum','exercitationem','ullam','corporis','suscipit','laboriosam,','nisi','ut','aliquid','ex','ea','commodi','consequatur?','quis','autem','vel','eum','iure','reprehenderit,','qui','in','ea','voluptate','velit','esse,','quam','nihil','molestiae','consequatur,','vel','illum,','qui','dolorem','eum','fugiat,','quo','voluptas','nulla','pariatur?','at','vero','eos','et','accusamus','et','iusto','odio','dignissimos','ducimus,','qui','blanditiis','praesentium','voluptatum','deleniti','atque','corrupti,','quos','dolores','et','quas','molestias','excepturi','sint,','obcaecati','cupiditate','non','provident,','similique','sunt','in','culpa,','qui','officia','deserunt','mollitia','animi,','id','est','laborum','et','dolorum','fuga.','harum','quidem','rerum','facilis','est','et','expedita','distinctio.','Nam','libero','tempore,','cum','soluta','nobis','est','eligendi','optio,','cumque','nihil','impedit,','quo','minus','id,','quod','maxime','placeat,','facere','possimus,','omnis','voluptas','assumenda','est,','omnis','dolor','repellendus.','temporibus','autem','quibusdam','aut','officiis','debitis','aut','rerum','necessitatibus','saepe','eveniet,','ut','et','voluptates','repudiandae','sint','molestiae','non','recusandae.','itaque','earum','rerum','hic','tenetur','a','sapiente','delectus,','aut','reiciendis','voluptatibus','maiores','alias','consequatur','aut','perferendis','doloribus','asperiores','repellat'],
		firstNames    : ['Sophia','Emma','Olivia','Isabella','Ava','Lily','Zoe','Chloe','Mia','Madison','Emily','Ella','Madelyn','Abigail','Aubrey','Addison','Avery','Layla','Hailey','Amelia','Hannah','Charlotte','Kaitlyn','Harper','Kaylee','Sophie','Mackenzie','Peyton','Riley','Grace','Brooklyn','Sarah','Aaliyah','Anna','Arianna','Ellie','Natalie','Isabelle','Lillian','Evelyn','Elizabeth','Lyla','Lucy','Claire','Makayla','Kylie','Audrey','Maya','Leah','Gabriella','Annabelle','Savannah','Nora','Reagan','Scarlett','Samantha','Alyssa','Allison','Elena','Stella','Alexis','Victoria','Aria','Molly','Maria','Bailey','Sydney','Bella','Mila','Taylor','Kayla','Eva','Jasmine','Gianna','Alexandra','Julia','Eliana','Kennedy','Brianna','Ruby','Lauren','Alice','Violet','Kendall','Morgan','Caroline','Piper','Brooke','Elise','Alexa','Sienna','Reese','Clara','Paige','Kate','Nevaeh','Sadie','Quinn','Isla','Eleanor','Aiden','Jackson','Ethan','Liam','Mason','Noah','Lucas','Jacob','Jayden','Jack','Logan','Ryan','Caleb','Benjamin','William','Michael','Alexander','Elijah','Matthew','Dylan','James','Owen','Connor','Brayden','Carter','Landon','Joshua','Luke','Daniel','Gabriel','Nicholas','Nathan','Oliver','Henry','Andrew','Gavin','Cameron','Eli','Max','Isaac','Evan','Samuel','Grayson','Tyler','Zachary','Wyatt','Joseph','Charlie','Hunter','David','Anthony','Christian','Colton','Thomas','Dominic','Austin','John','Sebastian','Cooper','Levi','Parker','Isaiah','Chase','Blake','Aaron','Alex','Adam','Tristan','Julian','Jonathan','Christopher','Jace','Nolan','Miles','Jordan','Carson','Colin','Ian','Riley','Xavier','Hudson','Adrian','Cole','Brody','Leo','Jake','Bentley','Sean','Jeremiah','Asher','Nathaniel','Micah','Jason','Ryder','Declan','Hayden','Brandon','Easton','Lincoln','Harrison'],
		lastNames     : ['Smith','Johnson','Williams','Jones','Brown','Davis','Miller','Wilson','Moore','Taylor','Anderson','Thomas','Jackson','White','Harris','Martin','Thompson','Garcia','Martinez','Robinson','Clark','Rodriguez','Lewis','Lee','Walker','Hall','Allen','Young','Hernandez','King','Wright','Lopez','Hill','Scott','Green','Adams','Baker','Gonzalez','Nelson','Carter','Mitchell','Perez','Roberts','Turner','Phillips','Campbell','Parker','Evans','Edwards','Collins','Stewart','Sanchez','Morris','Rogers','Reed','Cook','Morgan','Bell','Murphy','Bailey','Rivera','Cooper','Richardson','Cox','Howard','Ward','Torres','Peterson','Gray','Ramirez','James','Watson','Brooks','Kelly','Sanders','Price','Bennett','Wood','Barnes','Ross','Henderson','Coleman','Jenkins','Perry','Powell','Long','Patterson','Hughes','Flores','Washington','Butler','Simmons','Foster','Gonzales','Bryant','Alexander','Russell','Griffin','Diaz','Hayes'],
		companyNames  : ['Royal Dutch Shell','Exxon Mobil','WalMart Stores','BP','Sinopec Group','China National Petroleum','State Grid','Chevron','ConocoPhillips','Toyota Motor','Total','Volkswagen','Japan Post Holdings','Glencore International','Gazprom','EON','ENI','ING Group','General Motors','Samsung Electronics','Daimler','General Electric','Petrobras','Berkshire Hathaway','AXA','Fannie Mae','Ford Motor','Allianz','Nippon Telegraph','BNP Paribas','HewlettPackard','ATT','GDF Suez','Pemex','Valero Energy','PDVSA','McKesson','Hitachi','Carrefour','Statoil','JX Holdings','Nissan Motor','Hon Hai Precision Industry','Banco Santander','EXOR Group','Bank of America','Siemens','Assicurazioni Generali','Lukoil','Verizon Communications','JP Morgan','Enel','HSBC Holdings','Industrial Bank of China','Apple','CVS Caremark','International Business Machines','Credit Agricole','Tesco','Citigroup','Cardinal Health','BASF','UnitedHealth Group','Honda Motor','SK Holdings','Panasonic','Societe Generale','Petronas','BMW','ArcelorMittal','Nestle','Metro','Electricite de France','Nippon Life Insurance','Kroger','Munich Re Group','China Construction Bank','Costco Wholesale','Freddie Mac','Wells Fargo','China Mobile Communications','Telefonica','Indian Oil','Agricultural Bank of China','Peugeot','Procter Gamble','Sony','Banco do Brasil','Deutsche Telekom','Repsol YPF','Noble Group','Archer Daniels Midland','Bank of China','AmerisourceBergen','PTT','Meiji Yasuda Life Insurance','Toshiba','Deutsche Post','Reliance Industries','China State Construction Engineering'],
		streetNames   : ["Crampton Link", "Montgomery Passage", "Fishamble Croft", "King's Fish Pond Yard", "Little Ship Hill", "Parliament Alley", "Grafton Square", "Gardiner Drive", "Keating Walk", "Fleshmonger Close", "Bye Promenade", "Holles Avenue", "Shandon Circus", "Townsend Side", "King Promenade", "Exchequer Pavement", "Strandside South Way", "Church Circus", "Jewry Embankment", "Market Buildings", "Strandside South Pavement", "Fitzwilliam Mead", "Ellis Close", "Grope Avenue", "Clare Crescent", "Milk Arcade", "Gardiner Boulevard", "Cox's Mews", "Foss Cottages", "Arnott Hill", "Rope Maker's Quay", "Parliament Walk", "Essex Brow", "Merrion Alley", "Jacknell Brow", "Trinity Crescent", "Shyte Brow", "Werburgh Side", "Ardee Brow", "Milk Promenade", "Coolagh View", "Hume Passage", "Moore Approach", "Butcher Avenue", "Merrion Hill", "Bolton Square", "Constitution Link", "Friar's Link", "Moor Close", "O'Connell Causeway", "Moore Link", "Adelaide Arcade", "Westland Drive", "Conduit Street", "Inns Parade", "Sheare's Row", "Clare Close", "Moor Wall", "Western Place", "Rice Circus", "Dean Lane", "Harry Road", "Parnell Quay", "Suffolk Promenade", "Foss Islands Quay", "Essex Place", "Clarence Grove", "Barker Gardens", "Thompson's Square", "Hatch Wall", "Adelaide Villas", "Strand Bank", "Exchequer Mead", "Essex Parade", "Essex Cottages", "Grope Row", "Eden Lawn", "Fishmonger Lane", "Pearse Gate", "Montgomery Mews", "Clarendon Walk", "Sir John Rogerson Grove", "Earl Villas", "Grattan Yard", "Jervis Hill", "Rope Maker's Mews", "Rope Maker's Boulevard", "Cork Circus", "Horse Esplanade", "Grope Terrace", "Parnell View", "Carpenter's Walk", "Westland Terrace", "Milk Gardens", "Grope Villas", "Davitt's Brow", "Constitution Approach", "Lady Avenue", "Leinster Croft", "New Chapel Esplanade", "Lady Terrace", "Shieldmaker Parade", "Capel Arcade", "Shieldmaker Side", "Horse Mill Mount", "Pipewell Lawn", "Frederick Square", "Bath Mews", "Benburb Walk", "Usher's Pavement", "Water Esplanade", "South Anne Way", "Wellington Arcade", "Carpenter's Court", "Leeson Mount", "Grafton Way", "Shyte Way", "Fosters Road", "Henry Wall", "Rope Maker's Way", "Merrion Parade", "Christ Church Drive", "Baggot Causeway", "Adelaide Street", "College Green Bank", "Shandon Avenue", "Holles Road", "Inns Drive", "O'Connell Alley", "Exchange Side", "Thomas Crescent", "Carpenter's Wall", "Essex Gate", "Cecelia Link", "Holles Street", "Patrick Circus", "Aungier Lane", "D'Olier Drive", "Usher's Island Street", "Common Hill", "Adelaide Circus", "Harbour Bay Gardens", "Keating Side", "Little Ship Gardens", "Thomas Court", "Merrion Avenue", "Suffolk Yard", "Eustace Mount", "Hume Walk", "Earl Arcade"],
		cityNames     : ['Alamo Lake', 'Allenwood', 'Alloway', 'Archer', 'Ashippun', 'Ashley', 'Aspen Park', 'August', 'Bedford Hills', 'Belvedere Park', 'Blessing', 'Bonanza Hills', 'Boothville', 'Burke', 'Buttonwillow', 'Cairnbrook', 'Calimesa', 'Cambridge Springs', 'Carlsborg', 'Casas Adobes', 'Catoosa', 'Cement City', 'Charlton Heights', 'Clawson', 'Correctionville', 'Coulee City', 'Darby', 'Dendron', 'Donaldson', 'East Pittsburgh', 'Edgemere', 'Egegik', 'Eielson', 'Elbert', 'Elk River', 'Elkhorn', 'Emmet', 'Erie', 'Fircrest', 'Fiskdale', 'Foreman', 'Fort Collins', 'Fort Green', 'Fort Pierce North', 'Fowler', 'Freeland', 'Gila', 'Highwood', 'Hills', 'Huntley', 'Keewatin', 'Kemps Mill', 'Kinston', 'Lehr', 'Lennon', 'Lithium', 'Love Valley', 'Meadview', 'Melvin Village', 'Middlebourne', 'Murrells Inlet', 'Naches', 'Nesquehoning', 'New Haven', 'New Houlka', 'North Loup', 'North Palm Beach', 'Painter', 'Parkin', 'Plainsboro Center', 'Popponesset', 'Port Huron', 'Radar Base', 'Rafael Hernandez', 'Refugio', 'Riceboro', 'Ridgeley', 'Royalton', 'Russellton', 'Sandpoint', 'Sandy Ridge', 'Schoeneck', 'South Toms River', 'Spring Creek', 'St. Hedwig', 'St. Joe', 'St. Lucas', 'Stewartstown', 'Sweden Valley', 'Tekoa', 'Temperanceville', 'Toast', 'Topton', 'Van Horne', 'Vaughnsville', 'West Valley', 'Westover Hills', 'Wilkes', 'Winlock', 'Yates City'],
		websiteDomains: ['.org', '.net', '.com', '.com', '.com', '.biz', '.info']
	};

	jsongen.functions = {
		index : function()
		{
			return this.t_index;
		},
		guid : function()
		{
			var s4 = function() {
				return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
			};
			return (s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+s4()+s4()+s4());
		},
		name : function(){
			return this.firstname() + ' ' + this.lastname();
		},
		firstname : function()
		{
			return randomFromArray(jsongen.definitions.firstNames);
		},
		lastname : function()
		{
			return randomFromArray(jsongen.definitions.lastNames);
		},
		email : function()
		{
			var domain = randomFromArray(jsongen.definitions.websiteDomains);
			return (this.firstname().substring(0,1) + this.lastname() + '@' + this.company().replace(new RegExp(' ', 'g'),'') + domain).toLowerCase();
		},
		company : function()
		{
			return randomFromArray(jsongen.definitions.companyNames);
		},
		phone : function()
		{
			return _.random(100, 999) + '-' + _.random(100, 999) + '-' + _.random(1000, 9999);
		},
		street : function()
		{
			return randomFromArray(jsongen.definitions.streetNames);
		},
		city : function()
		{
			return randomFromArray(jsongen.definitions.cityNames);
		},
		date : function(){
			return new Date(this.utc()).toDateString();
		},
		now : function()
		{
			return new Date().toDateString();
		},
		utc : function()
		{
			return _.random(987019508999, this.utc_now());
		},
		utc_now : function()
		{
			return Date.now();
		},
		bool : function()
		{
			if(_.random(0,1) === 1){
				return true;
			}
			return false;
		},
		num : function(min, max)
		{
			if(typeof min === 'undefined'){
				min = 10;
			}
			if(typeof max === 'undefined'){
				max = min;
				min = 1;
			}
			return _.random(min,max);
		},
		rand : function()
		{
			return randomFromArray(arguments);
		},
		lorem : function(min, max)
		{
			var numWords = this.num(min,max),
				result = '';
			for(i = 0; i < numWords; i++) {
				var newTxt = jsongen.definitions.loremWordBank[Math.floor(Math.random() * (jsongen.definitions.loremWordBank.length - 1))];
				if (result.substring(result.length-1,result.length) == '.' || result.substring(result.length-1,result.length) == '?') {
					newTxt = newTxt.substring(0,1).toUpperCase() + newTxt.substring(1, newTxt.length);
				}
				if(result === ''){
					result = newTxt;
				} else {
					result += ' ' + newTxt;
				}
			}
			result = result.substring(0,1).toUpperCase()+ result.substring(1, result.length);
			return result;
		}
	};
})();