
let quotes = ['Change the world by being yourself', 'Every moment is a fresh beginning', 'Fall seven times, stand up eight',"Conquer your fears or they will conquer you"];

exports.getQuotes = function(){ //by using exports you are allowing outside access to this method.
    var idx = Math.floor(Math.random() * quotes.length);
    return quotes[idx];
}