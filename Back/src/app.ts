import express from "express";
import morgan from "morgan"
import cors from "cors";

import comisionRouter from './routes/comisionRouter.js';
import usersRouter from './routes/usersRouter.js';
import messagesRouter from './routes/messagesRouter.js'
/*
import comunidadRouter from './routes/comunidadRouter.js';
import galeriaRouter from './routes/galeriaRouter.js';
import vehiculosRouter from './routes/vehiculosRouter.js';
import usuariosRouter from './routes/usuariosRouter.js';
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
/*
app.use('/api/comunidad', comunidadRouter);
app.use('/api/galeria', galeriaRouter);
app.use('/api/vehiculos', vehiculosRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/clasificados', clasificadosRouter); */

export default app;