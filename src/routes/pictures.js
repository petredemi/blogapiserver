import multer from 'multer'
import { v2 as cloudinary} from 'cloudinary'
import path from 'path'
import "dotenv"
import {Router} from 'express'
import jwt from 'jsonwebtoken';
import fs from 'fs-extra'
import { uploadimgDb, verifyToken } from '../controllers/users.js';
import { uploadPostPic } from '../controllers/messages.js'

const picture = Router()
cloudinary.config({
    cloud_name:"ddexeovxi",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})
var errorMessages = {
  LIMIT_PART_COUNT: 'Too many parts',
  LIMIT_FILE_SIZE: 'File too large',
  LIMIT_FILE_COUNT: 'Too many files',
  LIMIT_FIELD_KEY: 'Field name too long',
  LIMIT_FIELD_VALUE: 'Field value too long',
  LIMIT_FIELD_COUNT: 'Too many fields',
  LIMIT_UNEXPECTED_FILE: 'Unexpected field',
  MISSING_FIELD_NAME: 'Field name missing'
}

//const upload = multer({ 
//  dest: './uploads',
//  filename: function (req, file, cb) {
//   // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//   // cb(null, file.fieldname + '-' + uniqueSuffix)
//   cb(null, req.file.filename =  'fgbgbge.jpg')
//   console.log(req.file)
//  }
//
//})
//async function uploadPictures(){


 // picture.post('/', async (req, res, next) =>{
      const storage = multer.diskStorage({
              destination: '/tmp/uploads',
              filename: function (req, file, cb) {
                  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                  cb(null, uniqueSuffix + path.extname(file.originalname))
                  }
            })
            function fileFilter(req, file, cb){
                if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
                  cb(null, true)
                  }else {
                  cb(new Error('invalid file type') )
                  }
            }
const upload = multer({ storage: storage, fileFilter:fileFilter, limits:{fileSize: 2 * 1024 * 1024}}).single('profileimg')
            
picture.post('/',verifyToken, async (req, res, next) =>{
        jwt.verify(req.token, 'secretekey', async (err, authData) =>{
            if(err){
              res.sendStatus(403)
            }else{

        upload(req, res, async function (err){
              if (err instanceof multer.MulterError){
                  console.log(err.message)
              }else if(err){
                  console.log(err.message)
                }
              let x = req.file
              console.log(x)
                let xx = await uploadImage(x.path)
                console.log(xx)
                await uploadimgDb(xx.secure_url, authData.user.id)
                next()             
            })    
          }
      })
        res.json('dvgervgrt')
})
    async function uploadImage(imagePath){
                // Use the uploaded file's name as the asset's public ID and 
                // allow overwriting the asset with new versions
            const options = {
                    use_filename: true,
                    unique_filename: false,
                    overwrite: true,
                  };
              try {
                  // Upload the image
                    const result = await cloudinary.uploader.upload(imagePath, options);
                    return result;
                  } catch (error) {
                    console.error(error);
                  }
        }

    picture.post('/:postId',verifyToken, async (req, res, next) =>{
      let y = await req.params.postId
      console.log(y)
        jwt.verify(req.token, 'secretekey', async (err, authData) =>{
            if(err){
              res.sendStatus(403)
            }else{

        upload(req, res, async function (err){
              if (err instanceof multer.MulterError){
                  console.log(err.message)
              }else if(err){
                  console.log(err.message)
                }
              let x = req.file
              console.log(x)
                let xx = await uploadImage(x.path)
                console.log(xx)
                await uploadPostPic(xx.secure_url, Number(y))
                next()             
            })    
          }
      })
        res.json('dvgervgrt')
})
      
export default picture