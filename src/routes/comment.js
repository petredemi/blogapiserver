
import { Router } from "express"
import { prisma } from '../../lib/prisma.js';
//import {addMessage, getMessages, getPost, updatePostx} from '../controllers/messages.js'
import jwt from 'jsonwebtoken'
import { verifyToken, getNames } from "../controllers/users.js"
const router = Router()

//router.get('/:postId/comments', (req, res) =>{
//        console.log('rthrtyjhyujnyu5jy5')
//        res.send('hello')
//
//})
//router.get('/:postId/comments/:commentId', (req, res) =>{
//        let x = req.params.postId
//        let y = req.params.commentId
//        console.log(x)
//        console.log(y)
//        res.send('hello rld')
//
//})
//export default router

