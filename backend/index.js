
const express = require('express'),
    app = express(),
    passport = require('passport'),
    port = process.env.PORT || 80,
    cors = require('cors'),
    cookie = require('cookie')

const bcrypt = require('bcrypt')

const db = require('./database.js')
let users = db.users

require('./passport.js')

const router = require('express').Router(),
    jwt = require('jsonwebtoken')

app.use('/api', router)
router.use(cors({ origin: 'http://localhost:3000', credentials: true }))
// router.use(cors())
router.use(express.json())
router.use(express.urlencoded({ extended: false }))


router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        console.log('Login: ', req.body, user, err, info)
        if (err) return next(err)
        if (user) {
            const token = jwt.sign(user, db.SECRET, {
                expiresIn: '1d'
            })
            // req.cookie.token = token
            res.setHeader(
                "Set-Cookie",
                cookie.serialize("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    maxAge: 60 * 60,
                    sameSite: "strict",
                    path: "/",
                })
            );
            res.statusCode = 200
            return res.json({ user, token })
        } else
            return res.status(422).json(info)
    })(req, res, next)
})

router.get('/logout', (req, res) => { 
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", '', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: -1,
            sameSite: "strict",
            path: "/",
        })
    );
    res.statusCode = 200
    return res.json({ message: 'Logout successful' })
})

/* GET user profile. */
router.get('/profile',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        res.send(req.user)
    });

router.post('/register',
    async (req, res) => {
        try {
            const SALT_ROUND = 10
            const { username, email, password } = req.body 
            if (!username || !email || !password)
                return res.json( {message: "Cannot register with empty string"})
            if (db.checkExistingUser(username) !== db.NOT_FOUND)
                return res.json({ message: "Duplicated user" })

            let id = (users.users.length) ? users.users[users.users.length - 1].id + 1 : 1
            hash = await bcrypt.hash(password, SALT_ROUND)
            users.users.push({ id, username, password: hash, email })
            res.status(200).json({ message: "Register success" })
        } catch {
            res.status(422).json({ message: "Cannot register" })
        }
    })
router.get('/alluser', (req,res) => res.json(db.users.users))

router.get('/', (req, res, next) => {
    res.send('Respond without authentication');
});
let articles = {
    list : [
        {id:1,name:"anime",topic:"Ijiranaide, Nagatoro-san",treatise:"High schooler Hayase Nagatoro loves to spend her free time doing one thing, and that is to bully her Senpai! After Nagatoro and her friends stumble upon the aspiring artist's drawings, they find enjoyment in mercilessly bullying the timid Senpai. Nagatoro resolves to continue her cruel game and visits him daily so that she can force Senpai into doing whatever interests her at the time, especially if it makes him uncomfortable."
        ,score:3.73,author:"jaku"},
        {id:2,name:"anime",topic:"Kumo Desu ga, Nani ka?",treatise:"The day is as normal as it can be in high school as the students peacefully go about their everyday activities until an unprecedented catastrophe strikes the school, killing every person in its wake. Guided by what seems to be a miracle, a handful of students are fortunate enough to be reincarnated into another world as nobles, princes, and other kinds of people with prestigious backgrounds."
        ,score:2.73,author:"MAL_Rewrite"},
        {id:3,name:"movie ",topic:"The Shawshank Redemption",treatise:"Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
        ,score:4.00,author:"kiko"}
        
    ]
    
}
router.route('/articles')
 .get ((req,res)=>{
     res.send(articles);
 })

 .post ((req,res)=>{
    let id = (articles.list.length)?articles.list[articles.list.length-1].id+1:1
     let name = req.body.name
     let topic = req.body.topic
     let treatise = req.body.treatise
     let score = req.body.score
     let author = req.body.author
     articles.list = [...articles.list,{id,name,topic,treatise,score,author}]
     res.json(articles);
 })

 router.route('/articles/:std_id')
  .get((req,res)=>{
    let id = articles.list.findIndex((item) => (item.id === +req.params.std_id))
    res.json(articles.list[id]);
  })

  .put((req,res)=>{
      let id = articles.list.findIndex((item) => (item.id === +req.params.std_id))
      articles.list[id].name = req.body.name
      articles.list[id].topic = req.body.topic
      articles.list[id].treatise = req.body.treatise
      articles.list[id].score = req.body.score
      articles.list[id].author = req.body.author
      res.json(articles)
  })

  .delete((req,res)=>{
      articles.list = articles.list.filter((item) => item.id !== +req.params.std_id)
      res.json(articles);
  })


// Error Handler
app.use((err, req, res, next) => {
    let statusCode = err.status || 500
    res.status(statusCode);
    res.json({
        error: {
            status: statusCode,
            message: err.message,
        }
    });
});

// Start Server
app.listen(port, () => console.log(`Server is running on port ${port}`))

