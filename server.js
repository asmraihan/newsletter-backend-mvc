import express from 'express';
import "dotenv/config"
import fileUpload from 'express-fileupload';
import cors from 'cors';
import helmet from 'helmet';
import { limiter } from './config/ratelimiter.config.js';
import logger from './utils/logger.js';

const app = express();
const port = process.env.PORT || 5000;

//import routes
import authRouter from './routes/auth.router.js';
import profileRouter from './routes/profile.router.js';
import newsRouter from './routes/news.router.js';


//Middleware 
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload());
app.use(express.static('public'));
app.use(cors(
    // { origin: "https://newsletter.com",}
));
app.use(helmet());
app.use(limiter);


//routes 
app.use("/api/auth", authRouter);
app.use("/api", profileRouter);
app.use("/api", newsRouter);


// queue jobs 
import "./jobs/index.job.js"


app.get('/', (req, res) => {
    return res.json({ message: 'Hello World!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

