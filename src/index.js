import express from 'express'
import cors from 'cors'
import routes from './routes/index.js';

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const whitelist = ['https://european-cuisine.netlify.app',  'https://blogabout-cuisine.netlify.app'];
//app.use(cors())
app.use(cors({
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
})); 
app.use('/',routes.firstpage)
app.use('/user', routes.user)
app.use('/message', routes.message)
app.use('/log-in', routes.login)
app.use('/picture', routes.picture)

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`My first Express app - listening on port ${PORT}!`)
})

