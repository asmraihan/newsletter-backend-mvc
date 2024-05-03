import express from 'express';
import "dotenv/config"
const app = express();
const port = process.env.PORT || 5000;

//import routes
import authRouter from './routes/auth.router.js';


//Middleware 
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//routes 
app.use("/api/auth", authRouter);



app.get('/', (req, res) => {
    return res.json({ message: 'Hello World!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

