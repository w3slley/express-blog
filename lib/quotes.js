
let quotes = ['Change the world by being yourself', 'Every moment is a fresh beginning', 'Fall seven times, get up eight',"Conquer your fears or they will conquer you", "The cosmos is all that is, or ever was, or ever will be", "Every marathon starts with a first step"];

exports.getQuotes = function(){ //by using exports you are allowing outside access to this method.
    var idx = Math.floor(Math.random() * quotes.length);
    return quotes[idx];
}