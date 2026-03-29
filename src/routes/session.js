import { Router } from "express";
import { logUser } from "../controllers/users.js";
import passport from "passport";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

const login = Router()
login.post('/', async (req, res) => {
    const {email, password} = await req.body
    const loguserx = await logUser(email)
    const match =  await bcrypt.compare(password, loguserx.password);
    const user = { id: loguserx.id, email: loguserx.email, name: loguserx.name, profile: loguserx.profile}
    if(!match){ return  res.json({message: 'incorect password'})}
    else{ 
        jwt.sign({user}, 'secretekey',{expiresIn: '1h'}, (err, token) =>{
            res.json({
                token: token
            //    loguserx: user,
            })
        })
    }
})

export default login