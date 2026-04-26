import { Router } from "express"
import { prisma } from '../../lib/prisma.js';
import {addMessage, getMessages, getPost, updatePostx} from '../controllers/messages.js'
import { addComment, getComments } from "../controllers/commentsscripts.js";
import jwt from 'jsonwebtoken'
import { verifyToken, getNames } from "../controllers/users.js"
const router = Router()

router.post('/', verifyToken, async (req, res) => {
  const {title, content} = await req.body
  if(title == '' || content == ''){return}
jwt.verify(req.token, 'secretekey', async (err, authData) =>{
  console.log(authData)
  if(authData == undefined || !authData.user.blogauthor){
    res.json('expired')
    return
  }
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
 // console.log(authData)
  if(authData == undefined){return}
    if(err){
      res.sendStatus(403)
    }else{
      // let xx =  await getComments(979)
      //   const usernames = await getNames() 
         const messages = await getMessages()
       //  console.log(messages)
         res.json({
            messages: messages.messages,
            authornames: messages.authorname,
      //      usernames
          })
      }
    })
})
router.get('/:getId', verifyToken, async (req, res) => {
  const x = await req.params.getId
jwt.verify(req.token, 'secretekey', async (err, authData) =>{
   // console.log(authData.user.name)
    const aut = await prisma.post.findUnique({
          where: { id: Number(x)}
        })
    if(Number(aut.authorId != authData.user.id)){return; }

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
    const updatex = await updatePostx(Number(x), title, content)
    if(err){
      res.sendStatus(403)
    }else{
     //  console.log(updatex)
        res.json(updatex)
      }
    })
});
router.delete('/:messageId', verifyToken, async (req, res, next) =>{
    const x =  await req.params.messageId
    jwt.verify(req.token, 'secretekey', async (err, authData) =>{

    const aut = await prisma.post.findUnique({
          where: { id: Number(x)}
        })
    if(Number(aut.authorId != authData.user.id) && authData.user.email != 'petrudem@yahoo.com'){
      res.json('denied')
      return 
    }

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
        await prisma.comment.deleteMany({
            where: {
            postId: Number(x),
            },
          });

        await prisma.post.delete({
            where: {
              id: Number(x),
            }
          });
          res.json('1success')
      }
    })
});

router.get('/:postId/comments', verifyToken, async (req, res) => {
  let idx = await req.params.postId
    jwt.verify(req.token, 'secretekey', async (err, authData) =>{
      let x = await getComments(Number(idx))
       if(err){
        res.sendStatus(403)
    }else{
      res.json(x)
    }
  })
});
router.post('/:postId/comment', verifyToken, async (req, res) => {
     const {commenttext} = await req.body
     const postid = await req.params.postId
     if(commenttext == ''){return}
  jwt.verify(req.token, 'secretekey', async (err, authData) =>{
    if (authData == undefined){return}
      let authx = await authData.user.id
      let authName = authData.user.name
  //    console.log(authx)
    let comment = await addComment(commenttext, Number(postid), authx, authName)
    if(err){
        res.sendStatus(403)
    }else{
        console.log(comment)
        res.json('dfewrgwerg')
      }
  })
});
router.put('/:postId/comment',async (req, res) => {
      console.log('dsvsdfv')    
      res.json('hello world')
});
router.delete('/:postId/comments/:commentId',async (req, res) => {
      let postid = await req.params.postId
      let commentid = await req.params.commentId
      console.log('dsvsdfv') 
      await prisma.comment.delete({
            where: {
              id: Number(commentid),
            }
          });
      res.json('successed')
});

//router.get('/:postId/comments/:commentId', async (req, res) => {
//  const x = await req.params.postId
//  const y = await req.params.commentId;
////jwt.verify(req.token, 'secretekey', async (err, authData) =>{
// //   console.log(authData.user.name)
//   //const postx = await getPost(Number(x))
//    if(err){
//      res.sendStatus(403)
//    }else{
//       console.log('dfvbdsfvdf')
//        res.json('hello ')
//      }
//  //  })
//});


export default router
