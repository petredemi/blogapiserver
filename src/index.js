import express from 'express'
import cors from 'cors'
import routes from './routes/index.js';
//import jwt from 'jsonwebtoken'

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const whitelist = ['https://european-cuisine.netlify.app',  'https://blogabout-cuisine.netlify.app'];
app.use(cors({
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
/*
app.get('/api', verifyToken, (req, res) =>{
  //console.log(req.me)
   jwt.verify(req.token, 'secretekey', (err, authData) =>{
  //  console.log(authData)
    res.setHeader( 'Content-Type', 'application/json')
      if(err){
      res.sendStatus(403)
    }else{
        res.json({message: 'welcomme to api'})
      }
  })
})
app.get('/api/posts',verifyToken, (req, res) =>{
  jwt.verify(req.token, 'secretekey', (err, authData) =>{
    console.log(authData)
  // console.log(req.me)
    if(err){
      res.sendStatus(403)
    }else{
       res.json({
        message: 'post created',
       // authData
        })
    }
  }) 
})
app.post('/api/login', (req, res) =>{
  const user = {
    id: 1,
    username: 'brad',
    email: 'brad@gmail.com'
  }
  jwt.sign({user}, 'secretekey', {expiresIn: '1h'}, (err, token) =>{
  res.json({
      token
    })
  })
}) */
// format of token
//authorization : Bearer <access_token>
/*
function verifyToken(req, res, next){
  //get autorisation token
  const bearerHeader = req.headers['authorization']
  // check if bearer is undefined
  if (typeof bearerHeader !== 'undefined'){
    //split at the space
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    //console.log(bearerToken)
    req.token = bearerToken
    next()

  }else {
    //forbidden
    res.sendStatus(403)
  } 
} */
app.use('/',routes.firstpage)
app.use('/user', routes.user)
app.use('/message', routes.message)
app.use('/log-in', routes.login)
app.use('/picture', routes.picture)

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`My first Express app - listening on port ${PORT}!`)
})

