import {Router} from 'express'
import {addUser, getUsers,getAuthors, getNames, verifyToken, updateMemberRequest} from '../controllers/users.js'
import { prisma } from '../../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router()
router.post('/', async (req, res) => {
    const {name, email, password, profession, authorreq} = await req.body
    let n = Number(authorreq)
    console.log(n)
   //  const checkEmail = await prisma.user.findUnique({
   //         select: {
   //           email: true
   //         },
   //         where:{
   //           email: email
   //         }
   //     })
   // if(checkEmail != null){return}
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await addUser(name, email, hashedPassword, profession, Boolean(n))
  //  console.log(user)
 if(name == '' && email == '' && password == ''){return}
   jwt.sign({user}, 'secretekey',{expiresIn: '1h'}, async(err, token) =>{
              res.json({
                token,
                user
            })
        })
  });
router.delete('/:userId', verifyToken, async (req, res) =>{
    const x =  await req.params.userId
    console.log(x)
    jwt.verify(req.token, 'secretekey', async (err, authData) =>{

      const aut = await prisma.user.findUnique({
          where: { id: Number(x)}
        })
       // console.log(authData)
      //if( aut.email != 'petrudem@yahoo.com' || aut.id != authData.user.id ){
      //    res.json('denied')
      //    return 
      //}
      console.log(typeof aut.id)
    if(err){
          res.sendStatus(403)
    }else{
        if(authData.user.email == 'petrudem@yahoo.com'){
             await prisma.comment.deleteMany({
                where: {
                  authorId: Number(x),
                },
              });
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
            console.log('delete success')
            res.json('user deleted')
        }else if(aut.id != authData.user.id){
            console.log('delete denied for another user ')
            res.json('not allowd to delete another user')
            return
        }else{
              await prisma.comment.deleteMany({
                where: {
                  authorId: Number(x),
                },
              });
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
          console.log('del success')
          res.json('success')
        }
      }
    })
   // console.log('dd')
   // res.json('failed')
 
});

router.get('/', verifyToken, async (req, res) => {
jwt.verify(req.token, 'secretekey', async (err, authData) =>{
  let loggeduser = authData.user.email
    if(err){
      res.sendStatus(403)
    }else{
         const users = await getUsers(loggeduser)
        res.json({
          authData,
          users: users.users,
          authuser: users.authUser

        })
      }
    })
})
router.get('/blogauthors', verifyToken, async (req, res) => {
jwt.verify(req.token, 'secretekey', async (err, authData) =>{
  if(authData == undefined){return}
  let idx = authData.user.id
 // console.log(authData.user.id)
    if(err){
      res.sendStatus(403)
    }else{
         const authors = await getAuthors(Number(idx))
       //  console.log(authData)
        res.json({
          authData,
          authors: authors.authors,
          authUser: authors.authUser
        })
      }
    })
})
router.get('/blogrequest', verifyToken, async (req, res) => {
jwt.verify(req.token, 'secretekey', async (err, authData) =>{
    console.log(authData)
    
    if(authData == undefined || authData.user.email != 'petrudem@yahoo.com'){return}
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
      console.log(blogauthor + 'fergverw')
      console.log(requestauth + 'dds')
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
router.post('/memberrequest',verifyToken, async (req, res) => {
      let {profession} = await req.body
      let {requestmember} = await req.body
      console.log(requestmember[1])
    if(profession == ''){ return}
     jwt.verify(req.token, 'secretekey', async (err, authData) =>{
      let idx = authData.user.id
       if(err){
         res.sendStatus(403)
       }else{
            updateMemberRequest(idx, profession, requestmember[1])
             res.json('request sent')
         }
       })
     // res.send('dsvevewr')
})

export default router