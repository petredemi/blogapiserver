import { Router } from 'express';
import jwt from "jsonwebtoken"
import {getUsers, verifyToken} from '../controllers/users.js'
import { getMessages} from '../controllers/messages.js';
import user from './user.js'
import message from './message.js'
import login from './session.js'
import picture from './pictures.js'

const firstpage = Router()

firstpage.get("/",verifyToken, async (req, res) => {
  const allUsers = await getUsers()
  const allMessages = await getMessages()
  console.log(allUsers)
   // function findName(y){
    //    let us = allUsers.find(x => x.id == y)
     //   return us.name
   // }
 jwt.verify(req.token, 'secretekey', async (err, authData) =>{
   console.log(authData)
     if(err){
       res.sendStatus(403)
     }else{
      res.setHeader( 'Content-Type', 'application/json')
        res.json({
        users: allUsers,  
        messages: allMessages,
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
    picture
}