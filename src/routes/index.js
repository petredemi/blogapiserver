import { Router } from 'express';
import jwt from "jsonwebtoken"
import {getUsers, verifyToken, getUsersAuth} from '../controllers/users.js'
import { getMessages} from '../controllers/messages.js';
import { getComments } from '../controllers/commentsscripts.js';
import user from './user.js'
import message from './message.js'
import login from './session.js'
import picture from './pictures.js'
//import comments from './comment.js'

const firstpage = Router()

firstpage.get("/",verifyToken, async (req, res) => {
 
 jwt.verify(req.token, 'secretekey', async (err, authData) =>{
  if(authData == undefined){return}
  let loggeduser = authData.user.email
  async function checkIfAuth(){
    if (loggeduser == 'petrudem@yahoo.com'){
      return  await getUsers(loggeduser)
    }else{
      return await getUsersAuth(loggeduser)
    }
  }
   const allUsers =  await checkIfAuth()
    //const allUsers = 
  const allMessages = await getMessages()
   console.log(authData)
     if(err){
       res.sendStatus(403)
     }else{
      res.setHeader( 'Content-Type', 'application/json')
        res.json({
        users: allUsers.users,
        authuser: allUsers.authUser,
        messages: allMessages.messages,
        authData: authData
        })
     }
  })
})

export default {
    firstpage,
    user,
    message,
    login,
    picture,
   // comments

}