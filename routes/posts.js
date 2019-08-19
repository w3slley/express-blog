const express = require('express')
const router = express.Router()

const Post = require('../models/Post.js');


router.get('/add', protected, (req, res)=>{
    res.render('posts/add')
})

router.post('/add', protected, (req, res)=>{
    let title = req.body.title
    let content = req.body.content
    let author = "Weslley"
    let newPost = new Post({title: title, content: content, author: author, date: new Date()})    
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
        res.render('posts/edit', {data: post})
    })
    
})
router.post('/:id/edit', protected, (req, res)=>{
    let title = req.body.title
    let content = req.body.content
    Post.findOneAndUpdate({_id: req.params.id}, {title: title, content: content}, (err, post)=>{
        if(err) return console.log(err)

        req.session.flash = {
            type: 'success',
            intro: 'Post edit!',
            message: 'Your post was edited successfuly.',
        };
        res.redirect('/dashboard')
    })
    
})
router.post('/:id/delete', protected, (req, res)=>{
    Post.deleteOne({_id: req.params.id}, (err)=>{
        if(err) return console.log(err)
        req.session.flash = {
            type: 'danger',
            intro: 'Post deleted!',
            message: 'Your post was deleted.',
        };
        res.redirect('/dashboard')
    })
   
})


router.get('/:id', (req, res)=>{ //Route for individual post
    Post.findById(req.params.id, (err, post)=>{
        if(post){
            res.render('posts/post', {title: post.title, author: post.author,date:post.date, content: post.content})
        }
        else{
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