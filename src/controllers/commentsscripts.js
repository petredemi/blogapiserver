import { prisma } from '../../lib/prisma.js';

async function addComment(x, y, z, w){
    const message = await prisma.comment.create({
   data: {
      content: x,
      postId: y,
      authorId: z,
      authorName: w,
      published:true,
      }
  })
 // console.log(message)
  return message
}
async function getComments(x){
    const comments = await prisma.comment.findMany({
      where: { postId: x}
    })
    //console.log(comments)
    return comments
  } 



export { addComment, getComments}