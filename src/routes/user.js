import {Router} from 'express'
import {addUser, getUsers, verifyToken} from '../controllers/users.js'
import { prisma } from '../../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router()
router.post('/', async (req, res) => {
    const {name, email, password} = await req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await addUser(name, email, hashedPassword)
  if(name == '' || email == '' || password == ''){return}
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

export default router