/* util.js */

if(!Array.prototype.contains) {
	Array.prototype.contains  = function (o) {
		for (i in this)	{
			if(this[i]==o) return true;
		}
		return false;
	};
}