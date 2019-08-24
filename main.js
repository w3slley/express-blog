/*jshint esversion: 6 */
//The code above tells jshint that i'm using ES6!
const passport = require('passport')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoose = require('mongoose')
const app = express()


//Importing models

let Post = require('./models/Post.js');

//mongoose connection
mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true})
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB database!');
});


//middlewares
app.use(express.static('public')) //setting path for static files
//to use the req.body object I need to use this.
app.use(cookieParser('secret'));
app.use(session({cookie: { maxAge: 60000 }}));

app.use(bodyParser.urlencoded({ extended: false }))
 // parse application/json
app.use(bodyParser.json());
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());
//middleware for cookies
/*
let credentials = require('./credentials.js');
app.use(cookieParser(credentials.cookieSecret));
app.use(expressSession()); //session middleware!*/
//flash-connect middleware



//Passport config
require('./config/passport.js')(passport)



//Authentication middleware - it saves the req.user object into the local object user which makes it accessible for all views.
app.use((req, res, next)=>{
    if(req.user){
        res.locals.user = req.user 
    }
    next()
})

//middleware for flash messages
app.use((req, res, next)=>{
    res.locals.flash = req.session.flash; //This is how you make the flash object accessible to all the routes. The value of the session will be then accessible.
    delete req.session.flash;
    next();
});


//Function that prevents logged users from accessing the /login and /register routes
function protectedWhileLoggedIn(req, res, next){
    if(res.locals.user){
        res.redirect('/dashboard')
    }
    else{
        next()
    }
}


// set up handlebars view engine (used in the book)
var handlebars = require('express3-handlebars').create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);


//Accessing routers from external files
let users = require('./routes/users.js');
let posts = require('./routes/posts.js')
app.use('/user', users);
app.use('/posts', posts);

//Routers 

//Main page routers
app.get('/', (req, res)=>{
    let randomQuote = require('./lib/quotes.js');//created a folder called lib to store all modules
    //res.cookie('user', 'Weslley'); //This is how you create cookies!
    res.render('home'); //that's how you render a webpage inside the view folder!
});

app.get('/about',(req, res)=>{
    //res.type('html'); We no longer need the res.type when rendering webpages.
    let data = res.locals.user
    res.render('about', {user: data});
});
app.get('/contact', (req, res)=>{
    //req.session.userName = "Weslley Victor";//this is how you display session information
    res.render('contact');
});

app.get('/posts', (req, res)=>{
    Post.find({}).sort({date:'desc', id:'desc'}).exec((err, posts)=>{
        if(err){
            return console.log(err)
        }
        else{
            res.render('posts/home', {posts: posts})
        }  
    })
    
})


//Dashboard page. Only logged users can access it. The router does the same thing as the function protected (which is in the posts.js file) does.
app.get('/dashboard', (req, res)=>{
    if(res.locals.user){
        Post.find({author_id: res.locals.user.id}).sort('-date').exec((err, posts)=>{
            res.render('dashboard', {posts: posts})
        })
    }
    else{
        res.redirect('/')
    }
})

//Authorization routes

//Login
app.get('/login', protectedWhileLoggedIn, (req, res)=>{
    
    res.render('auth/login', {csrf: "CSRF goes here"})
     
});

//Register
app.get('/register', protectedWhileLoggedIn, (req, res)=>{
    res.render('auth/register', {csrf: "CSRF goes here"});
});


// custom 404 page
app.use((req, res)=>{
    res.status(404);
    res.render('errors/404');
});

// custom 500 page
app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500);
    res.render('errors/500');
});



app.listen(app.get('port'), function(){
console.log( 'Express started on http://localhost:' +
app.get('port') + '; press Ctrl-C to terminate.' );
});