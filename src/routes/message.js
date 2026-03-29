import { Router } from "express"
import { prisma } from '../../lib/prisma.js';
import {addMessage, getMessages, getPost, updatePostx, uploadPostPic} from '../controllers/messages.js'
import jwt from 'jsonwebtoken'
import { verifyToken, getNames } from "../controllers/users.js"
const router = Router()

router.post('/', verifyToken, async (req, res) => {
  const {title, content} = await req.body
  if(title == '' || content == ''){return}
jwt.verify(req.token, 'secretekey', async (err, authData) =>{
    if(err){
      res.sendStatus(403)
    }else{
        const message =  await addMessage(title, content, authData.user.id)
          res.json(message)
      }
    })
});
router.get('/', verifyToken, async (req, res) => {
jwt.verify(req.token, 'secretekey', async (err, authData) =>{
  console.log(authData)
    if(err){
      res.sendStatus(403)
    }else{
         const usernames = await getNames() 
         const messages = await getMessages()
         console.log(usernames)
         res.json({
            messages,
            usernames
          })
      }
    })
})
router.get('/:getId', verifyToken, async (req, res) => {
  const x = await req.params.getId
jwt.verify(req.token, 'secretekey', async (err, authData) =>{
    console.log(authData.user.name)
   const postx = await getPost(Number(x))
    if(err){
      res.sendStatus(403)
    }else{
       console.log(postx)
        res.json(postx)
      }
    })
});

router.put('/:postId', verifyToken, async (req, res) => {
  const x = await req.params.postId
  const {title, content} = await req.body
jwt.verify(req.token, 'secretekey', async (err, authData) =>{
    console.log(authData.user.name)
   const updatex = await updatePostx(Number(x), title, content)
    if(err){
      res.sendStatus(403)
    }else{
       console.log(updatex)
        res.json(updatex)
      }
    })
});
router.delete('/:messageId', verifyToken, async (req, res, next) =>{
    const x =  await req.params.messageId
    jwt.verify(req.token, 'secretekey', async (err, authData) =>{

    if(err){
      res.sendStatus(403)
    }else{
      let ex =  await prisma.post.findUnique({
        where: {
              id: Number(x)
            }
        })
     console.log(ex)
     if (ex == null){ return}
        await prisma.post.delete({
            where: {
              id: Number(x),
            }

          });
      }
   //   res.json('success')
    })
    res.json('success')
});

export default router
