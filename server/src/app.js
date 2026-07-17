import express from 'express';
import cors from 'cors';
import path from 'path';
import {fileURLToPath} from 'url';
import authRoutes from './routes/authRoutes.js';
import sessionRotes from './routes/sessionRotes.js';
import imageRoutes from './routes/imageRoutes.js';
import {errorHandler} from './middlewares/errorHandler.js';

const__filename =fileURLToPath(import.meta.url);
const__dirname=path.dirname(__filename);

const app =express();

app.use(cors({origin:process.env.CLIENT_URL||'*',credentials:true}));
app.use(express.json({limmit:'10mb'}));
app.use('/uploads',express.static(path.join(__dirname,'..','uploads')));
app.get('/api/health',(req,res)=>res.json({status:'ok'}));
app.use('/api/sessions',sessionRoutes);
app.use('/api//images',imageRoutes);

app.use(errorHandler);

export default app;
