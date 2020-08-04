const express = require('express')
const router = express.Router()

const Post = require('../models/Post.js');


router.get('/add', protected, (req, res)=>{
    res.render('posts/add')
})

router.post('/add', protected, (req, res)=>{
    let title = req.body.title
    let content = req.body.content
    let authorId = res.locals.user._id
    let authorName = res.locals.user.name
    //getting date
    let d = new Date()
    let year = d.getFullYear();//gets year number
    let month = d.getMonth()+1;//gets month number (0-11 where january is 0 and december is 11). I'm adding one to get the correct month number.
    let day = d.getDate();//gets the day of month (1-30/31)
    let date = day+'/'+'0'+month+'/'+year

    let newPost = new Post({title: title, content: content, author_id: authorId, author_name: authorName, date: date})    
    newPost.save((err)=>{
        if(err) return console.log(err)
    })
    req.session.flash = {
        type: 'success',
        intro: 'Post added! ',
        message: 'Your post was added to the database. Keep it going!',
    };
    res.redirect('/posts')
})

router.get('/:id/edit', protected, (req, res)=>{
    Post.findById(req.params.id, (err, post)=>{
        if(res.locals.user.id == post.author_id){
            res.render('posts/edit', {data: post})
        }
        else{
            req.session.flash = {
                type: 'danger',
                intro: 'Permission denied!',
                message: ''
            }
            res.redirect('/dashboard')
        }
    })
    
})
router.post('/:id/edit', protected, (req, res)=>{
    let title = req.body.title
    let content = req.body.content
    Post.findOneAndUpdate({_id: req.params.id}, {title: title, content: content}, (err, post)=>{
        if(err) return console.log(err)

        if(res.locals.user.id == post.author_id){
            req.session.flash = {
                type: 'success',
                intro: 'Post edit!',
                message: 'Your post was edited successfuly.',
            };
            res.redirect('/dashboard')
        }
        else{
            req.session.flash = {
                type: 'danger',
                intro: 'Permission denied',
                message: ''
            }
            res.redirect('/')
        }
        
    })
    
})
router.post('/:id/delete', protected, (req, res)=>{//delete post. Access only bo the user who created the blogpost
    Post.find({_id: req.params.id}, (err, post)=>{
        if(err) return console.log(err)
        
        if(res.locals.user.id == post[0].author_id){
            Post.deleteOne({_id: req.params.id}, (err)=>{
        
                if(err) return console.log(err)
                req.session.flash = {
                    type: 'danger',
                    intro: 'Post deleted!',
                    message: 'Your post was deleted.',
                };
                res.redirect('/dashboard')
            })
        }
        else{
            req.session.flash = {
                type: 'danger',
                intro: 'Permission denied!',
                message: '',
            }
            res.redirect('/dashboard')
        }
    })
    
   
})


router.get('/:id', (req, res)=>{ //Route for individual post, accessed by all users.
    Post.findById(req.params.id, (err, post)=>{
        if(err) return console.log(err)

        if(post){
            if(res.locals.user){
                if(res.locals.user.id == post.author_id){
                    let equal = true;
                    res.render('posts/post', {post: post, equal: equal})
                }
                else{
                    res.render('posts/post', {post: post})
                }
            }
            else{
                res.render('posts/post', {post: post})
            }
        
        }
        else{//If there is no post with that id, then no data will be send to view and a message will be displayed (since there will be no data)
            res.render('posts/post')
        }
        
    })
   
});


//access control function
//This function will be ran each time the routers in this page are called.
function protected(req, res, next){
    if(res.locals.user){
        return next()
    }
    else{
        res.redirect('/login')
    }
}

module.exports = router