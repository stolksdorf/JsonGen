Number.prototype.round = function(digits) {
    var digits = digits || 0;
    if(digits === 0){
        return Math.round(this);
    }
    return Math.round(this * Math.pow(10,digits)) / Math.pow(10,digits);
};

Number.prototype.addCommas = function(number)
{
    number = number || ("" + this);
    return number.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
};

Number.prototype.formatMoney = function()
{
    return "$" + this.addCommas(this.round(2).toFixed(2));
};

Array.prototype.random = function()
{
    return this[Math.floor(Math.random()*this.length)];
};

//Returns a random element from the array and removes it
Array.prototype.randomAndRemove = function()
{
    var index = Math.floor(Math.random()*this.length);
    var val = this[index];
    this.splice(index, 1);
    return val;
};

//returns true when they both share all values, but not order
Array.prototype.hasSameValues = function(arr)
{
    return this.length == arr.length && _.difference(this, arr).length == 0;
};

Array.prototype.implode = function(seperator)
{
    seperator = seperator || '';
    return this.join(seperator);
};


String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.explode = function(delimiter){
    delimiter = delimiter || ',';
    return this.split(delimiter);
};

String.prototype.capitalize = function(){
	return this.charAt(0).toUpperCase() + this.slice(1);
};