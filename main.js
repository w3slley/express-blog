let express = require('express');
let app = express();

app.use(express.static(__dirname + '/public')); //setting path for static files

// set up handlebars view engine (used in the book)
var handlebars = require('express3-handlebars').create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

//This is how you use routing in express!
app.get('/', (req, res)=>{
    res.render('home'); //that's how you render a webpage inside the view folder!
});

app.get('/about',(req, res)=>{
    //res.type('html'); We no longer need the res.type when rendering webpages.
    res.render('about');
});
app.get('/contact', (req, res)=>{
    res.render('contact');
});

// custom 404 page
app.use((req, res)=>{
    res.status(404);
    res.render('404');
});

// custom 500 page
app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
console.log( 'Express started on http://localhost:' +
app.get('port') + '; press Ctrl-C to terminate.' );
});