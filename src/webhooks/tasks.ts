import express from 'express';
import Task from "../models/Task";
import validApiKey from "./middleware/validApiKey";

const router = express.Router();

router.use(validApiKey);
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: {
                serverId: req.query.server,
                apiKey: req.apiKey
            },
            limit: 5
        });
        await Promise.all(tasks.map(t => t.destroy()));

        res.status(200).send(tasks.map(t => t.task));
    }
    catch(err) {
        console.error(err);
        return res.status(500).send({message: 'Error'});
    }
});

export default router;