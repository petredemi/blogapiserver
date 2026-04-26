
import { name } from 'ejs';
import { prisma } from '../../lib/prisma.js';


async function getMessages(){
    const messages = await prisma.post.findMany()
    const authorname = await prisma.user.findMany({
      select: {
        id: true,
        name:true,
      }
    })
  //  console.log(authorname, messages)
    return {messages, authorname}
  } 
async function addMessage(x, y, w){
    const message = await prisma.post.create({
   data: {
      title:x,
      content: y,
      authorId: w,
      published:true
      }
  })
  console.log(message)
  return message
}
async function getPost(x) {
      const post = await prisma.post.findUnique({
        where: {
            id: x,
      //      password: password
            },
        })
     //   console.log(user)
     return post
}
async function updatePostx(x, y, z){
   let update  = await prisma.post.update({
      where: { id: x},
      data: {title: y, content: z}

    })
    return update
}
async function uploadPostPic(xfile, idpost){
          const picture = await prisma.post.update({
                    data: {
                      picture: xfile
                    },
                    where:{
                      id: idpost
                    }
          })

      return picture
}


  export {getMessages, addMessage, getPost, updatePostx, uploadPostPic}