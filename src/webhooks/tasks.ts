import express from 'express';
import Task from "../models/Task";

const router = express.Router();

router.get('/', async (req, res) => {
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).send({message: 'Invalid api key'});
    }
    const apiKey = req.headers.authorization.substring('Bearer '.length);
    if(!apiKey) {
        return res.status(401).send({message: 'Invalid api key'});
    }

    try {
        const tasks = await Task.findAll({
            where: {
                serverId: req.query.server,
                apiKey
            },
            limit: 5
        })

        return res.status(200).send(tasks.map(t => t.task));
    }
    catch(err) {
        console.error(err);
        return res.status(500).send({message: 'Error'});
    }
});

export default router;