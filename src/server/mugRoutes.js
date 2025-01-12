import express from 'express';
import pool from './pool.js';
import axios from 'axios';
import Redis from 'redis';

const redisClient = Redis.createClient();
await redisClient.connect();

const router = express.Router();
  
router.get('/', async (req, res) => {
    try {
        const mugsData = await getOrSetCache(`mugs`, async () => {
            console.log(`axios get instead`);
            const {data} = await axios.get('https://fec-project-tjyl.onrender.com/mugs');
            return data;
        });
        console.log(mugsData);
        res.json(mugsData);
    }
    catch(err){
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})                   
                        
router.get('/:id', async (req, res) => {
    const id = Number.parseInt(req.params.id);

    try {
        const mugsData = await getOrSetCache(`mug?id=${id}`, async () => {
            const {data} = await axios.get(`https://fec-project-tjyl.onrender.com/mugs/${id}`);
            return data;
        });
        console.log(mugsData);
        res.json(mugsData);
    }
    catch(err){
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.post('/', async (req, res) => {
    const { mug_name, mug_description_1, mug_cost } = req.body
    try {
        const data = await pool.query(
            `INSERT INTO mugs (mug_name, mug_description_1, mug_cost) VALUES
            ($1, $2, $3) RETURNING *`,
            [mug_name, mug_description_1, mug_cost]
        )
        console.log("Result of post request: ", data.rows[0]);
        res.json(data.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

router.patch('/:id', async (req, res) => {
    const id = Number.parseInt(req.params.id);
    const {
        mug_name,
        mug_description_1,
        mug_description_2,
        mug_shipping, 
        mug_cost
    } = req.body;
    try {
        const data = await pool.query(
            `UPDATE mugs SET
            mug_name = COALESCE($1, mug_name), 
            mug_description_1 = COALESCE($2, mug_description_1),
            mug_description_2 = COALESCE($3, mug_description_2), 
            mug_shipping = COALESCE($4, mug_shipping), 
            mug_cost = COALESCE($5, mug_cost) WHERE
            mug_id = $6 RETURNING *`,
            [mug_name, mug_description_1, mug_description_2, mug_shipping, mug_cost, id]
        );
        console.log("Results of patch request: ", data.rows[0]);
        res.json(data.rows[0]);
    }
    catch(err){
        console.error(err);
        res.sendStatus(500);
    }
})

router.delete('/:id', async (req, res) => {
    const id = Number.parseInt(req.params.id);
    try {
        const data = await pool.query(
            `DELETE FROM mugs
            WHERE mug_id = $1`,
            [id]
        )

        if (data.rowCount > 0) {
            res.status(200).json({ message: 'Resource deleted successfully' });
        } else {
            res.status(404).json({ message: 'Resource not found' });
        }
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

const getOrSetCache = (key, cb) => {
    return new Promise((resolve, reject) => {
        redisClient.get(key)
        .then(async (mugsData) => {
            if (mugsData !== null) {
                resolve(JSON.parse(mugsData));
            }
            else {
                const freshData = await cb();
                console.log(freshData);
                redisClient.setEx(key, 30, JSON.stringify(freshData));
                resolve(freshData);
            }
        })
    })
}

export default router;