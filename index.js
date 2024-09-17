const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bd0dd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const coffUserCollection = client.db('coffeeDB').collection('coffUser');

        app.get('/user', async (req, res) => {
            const cursor = coffUserCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffUserCollection.findOne(query);
            res.send(result);
        })

        app.post('/user', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffUserCollection.insertOne(newCoffee);
            res.send(result);
        })

        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const options = { upsert: true };
            const filter = { _id: new ObjectId(id) }
            const updateCoffee = req.body;
            const coffee = {
                $set: {
                    name: updateCoffee.name,
                    quantity: updateCoffee.quantity,
                    supplier: updateCoffee.supplier,
                    taste: updateCoffee.taste,
                    category: updateCoffee.category,
                    details: updateCoffee.details,
                    photo: updateCoffee.photo
                }
            }
            const result = await coffUserCollection.updateOne(filter, coffee, options);
            res.send(result);
        })

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffUserCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Coffee making is running')
})

app.listen(port, () => {
    console.log(`Coffee making is running on port, ${port}`)
})