import {Router} from 'express'
import {addUser, getUsers, getNames, verifyToken} from '../controllers/users.js'
import { prisma } from '../../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router()
router.post('/', async (req, res) => {
    const {name, email, password, profession, authorreq} = await req.body
    console.log(authorreq)
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await addUser(name, email, hashedPassword, profession, authorreq)
  if(name == '' || email == '' || password == '' || profession == ''){return}
   jwt.sign({user}, 'secretekey',{expiresIn: '1h'}, async(err, token) =>{
              res.json({
                token,
                user,
            })
   })
});
router.delete('/:userId', verifyToken, async (req, res) =>{
    const x =  await req.params.userId
    console.log(typeof x)
    jwt.verify(req.token, 'secretekey', async (err, authData) =>{
    if(err){
      res.sendStatus(403)
    }else{
        await prisma.post.deleteMany({
            where: {
              authorId: Number(x),
            },
          });
        await prisma.user.delete({
            where: {
              id: Number(x),
            },
          });
        res.json('success')
      }
    })
 
});

router.get('/', verifyToken, async (req, res) => {
jwt.verify(req.token, 'secretekey', async (err, authData) =>{
    if(err){
      res.sendStatus(403)
    }else{
         const users = await getUsers()
        res.json({
          authData,
          users,
        })
      }
    })
})
router.get('/blogrequest', verifyToken, async (req, res) => {
jwt.verify(req.token, 'secretekey', async (err, authData) =>{
    if(err){
      res.sendStatus(403)
    }else{
         const users = await getNames()
        res.json(users)
      }
    })
})
router.post('/blogrequest/:reqId',verifyToken, async (req, res) => {
      let x = await req.params.reqId
     // let {blogauthor, requestauth} = await req.body
      let {blogauthor} = await req.body || {}
      let {requestauth} = await req.body || {}
      console.log(blogauthor)
      console.log(requestauth)
     jwt.verify(req.token, 'secretekey', async (err, authData) =>{
       if(err){
         res.sendStatus(403)
       }else{
             const users = await prisma.user.update({
              where:{ id: Number(x)},
              data: {
                blogauthor: Boolean(blogauthor),
                requestauth: Boolean(requestauth)
              }

             })
             res.json(users)
         }
       })
     // res.send('dsvevewr')
})


export default router