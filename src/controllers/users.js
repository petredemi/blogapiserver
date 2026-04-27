import { prisma } from '../../lib/prisma.js';

async function getUsers(x){
    const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          profile: true,
          profession: true,
          blogauthor:true
        }
    })
   
   
       const authUser = await prisma.user.findUnique({
        select: {
            id: true,
            email: true,
            profile: true
        },
        where: {
          email: x,
        }
    })
   //   if (x != 'petrudem@yahoo.com'){
   //         return {authors, authUser}
    //  }else{
  //  console.log(users)
            return {users, authUser}
   //   }
  } 
  async function getUsersAuth(x){
    let users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          profile: true,
          profession: true,
          blogauthor:true
        },
        where: {
          blogauthor: true
        }

      })
       const authUser = await prisma.user.findUnique({
        select: {
            id: true,
            email: true,
            profile: true
        },
        where: {
          email: x,
        }
    })
            return {users, authUser}
  }

  async function getAuthors(x){
    const authors = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          profile: true,
          profession: true,
          blogauthor:true,
          requestauth: true
        },
      // where: {
     //    blogauthor: true,
     //  }
    });
    const authUser = await prisma.user.findUnique({
        select: {
            id: true,
            profile: true
        },
        where: {
          id: x,
        }
    })
    console.log(authUser)
    return {authors, authUser}
  } 
async function getNames() {
    const usernames = await prisma.user.findMany({
      select:{
        id: true,
        name: true,
        blogauthor: true,
        requestauth: true
      }
    })
    return usernames
}
async function addUser(x, y, z, v, w){
      const user = await prisma.user.create({
          data: {
            name: x,
            email: y,
            password: z,
            profession: v,
            requestauth: w,
            profile: null,

          },
          include: {
            posts: true,
          },
        })
    return { id: user.id, name: user.name, email: user.email, profession: user.profession, profile: user.profile}
    
}
async function logUser(email) {
      const user = await prisma.user.findUnique({
        where: {
            email: email,
      //      password: password
            },
        })
     if (user == null){return}
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
}
async function updateMemberRequest(x, y, z){
  const member = await prisma.user.update({
              where:{ id: Number(x)},
              data: {
                profession: y,
                requestauth: Boolean(z)
              }
            })
        return member
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
 export {getUsers,getAuthors, addUser, logUser, verifyToken, getNames, uploadimgDb, updateMemberRequest, getUsersAuth}