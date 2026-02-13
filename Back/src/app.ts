import express from "express";
import morgan from "morgan"
import cors from "cors";

import comisionRouter from './routes/comisionRouter.js';
import usersRouter from './routes/usersRouter.js';
import messagesRouter from './routes/messagesRouter.js';
import galleryRouter from './routes/galleryRouter.js';
/*
import comunidadRouter from './routes/comunidadRouter.js';
import vehiculosRouter from './routes/vehiculosRouter.js';
import clasificadosRouter from './routes/clasificadosRouter.js'; */

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('API en desarrollo')
})

app.use('/api/comision', comisionRouter)
app.use('/api/users', usersRouter)
app.use('/api/messages', messagesRouter);
app.use('/api/gallery', galleryRouter);

/*
app.use('/api/comunidad', comunidadRouter);
app.use('/api/vehiculos', vehiculosRouter);
app.use('/api/clasificados', clasificadosRouter); */

export default app;