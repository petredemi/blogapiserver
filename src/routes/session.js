import { Router } from "express";
import { logUser } from "../controllers/users.js";
import passport from "passport";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { profile } from "console";

const login = Router()
login.post('/', async (req, res) => {
    const {email, password} = await req.body
    if (email == '' || password == ''){return}
    const loguserx = await logUser(email)
    console.log(loguserx)
    console.log(password)
    if( loguserx == undefined){return}
    const match =  await bcrypt.compare(password, loguserx.password);
    if(!match){ return  res.json({message: 'incorect password'})}
    else{ 
        const user = { id: loguserx.id, email: loguserx.email, name: loguserx.name, 
            blogauthor: loguserx.blogauthor, profile: loguserx.profile }
        
        jwt.sign({user}, 'secretekey',{expiresIn: '1h'}, (err, token) =>{
             if(err){
                res.sendStatus(403)
            }else{
                res.json({
                token: token                
                })
            }
        })
    }
})

export default login 