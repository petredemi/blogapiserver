import { name } from 'ejs';
import { prisma } from '../../lib/prisma.js';

async function getUsers(){
    const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          profile: true
        }
    })
  //  console.log(users)
    return users
  } 
async function getNames() {
    const usernames = await prisma.user.findMany({
      select:{
        id: true,
        name: true
      }
    })
    console.log(usernames)
    return usernames
  
}
async function addUser(x, y, z){
    const user = await prisma.user.create({
    data: {
      name: x,
      email: y,
      password: z,
    },
    include: {
      posts: true,
    },
  })
 return { id: user.id, name: user.name, email: user.email}
    
}
async function logUser(email) {
      const user = await prisma.user.findUnique({
        where: {
            email: email,
      //      password: password
            },
        })
     //   console.log(user)
     return user
}
async function uploadimgDb(xfile, iduser){
          const profile = await prisma.user.update({
                    data: {
                      profile: xfile
                    },
                    where:{
                      id: iduser
                    }
          })
      console.log('ergewrgvrew')
}




function verifyToken(req, res, next){
  //get autorisation token
  const bearerHeader = req.headers['authorization']
  // check if bearer is undefined
  if (typeof bearerHeader !== 'undefined'){
    //split at the space
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    //console.log(bearerToken)
    req.token = bearerToken
    next()

  }else {
    //forbidden
    res.sendStatus(403)
  }
}


  export {getUsers, addUser, logUser, verifyToken, getNames, uploadimgDb}