import express from 'express';
import Task from "../models/Task";

const router = express.Router();

// TODO add api key and server authentication
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: {
                serverId: req.query.server,
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