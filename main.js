/*jshint esversion: 6 */
//The code above tells jshint that i'm using ES6!

let express = require('express');
let app = express();

app.use(express.static('public')); //setting path for static files

function getPost(){ //function that returns the data we are goint to use in the partial.
    return {
        post:[
            {
                title: 'Blogpost 1',
                author: 'Weslley',
                date: '10/08/2019',
                content: 'This is the content of the blogpost 1!'
            },
            {
                title: 'Blogpost 2',
                author: 'Weslley',
                date: '11/08/2019',
                content: 'This is the content of the blogpost 2!'
            }
        ]
    };
}


//middlewares
//middleware necessary for the partial to work. What is does is check if there's any data in the res.locals.partials object. It it doesn't, it gives the value {}. Then it assigns the object res.locals.partials.blogspot to the data we created (and will come from an API on a real website). This then can be accessed from the partials file and it can be called from the view file.
app.use(function(req, res, next){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.blogposts = getPost();
    next();
});
 


// set up handlebars view engine (used in the book)
var handlebars = require('express3-handlebars').create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);


//This is how you use routing in express!
app.get('/', (req, res)=>{
    let randomQuote = require('./lib/quotes.js');//created a folder called lib to store all modules
    res.render('home', {quote:randomQuote.getQuotes()}); //that's how you render a webpage inside the view folder!
});

app.get('/about',(req, res)=>{
    //res.type('html'); We no longer need the res.type when rendering webpages.
    res.render('about');
});
app.get('/contact', (req, res)=>{
    res.render('contact');
});

app.get('/blog', (req, res)=>{
    res.render('posts/home');
});

app.get('/login', (req, res)=>{
    res.render('auth/login');
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