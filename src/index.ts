import express, {Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();
import { ConnectDB } from './MongoBD/ConnectDB'


const app = express();


app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true}))

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Gym API');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

ConnectDB()