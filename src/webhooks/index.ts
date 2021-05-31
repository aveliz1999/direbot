import http from 'http';
import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

import chatRouter from './chat';
app.use('/chat', chatRouter);

export default function init() {
    const port = process.env.PORT || '3000';

    const server = http.createServer(app);
    server.listen(port);

    return app;
}