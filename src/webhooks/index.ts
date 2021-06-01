import http from 'http';
import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

import chatRouter from './chat';
import statusRouter from './status';
import taskRouter from './tasks';

app.use('/chat', chatRouter);
app.use('/status', statusRouter);
app.use('/tasks', taskRouter);

export default function init() {
    const port = process.env.PORT || '3000';

    const server = http.createServer(app);
    server.listen(port);

    return app;
}