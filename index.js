const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sahbn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const itemCollection = client.db("warehouseManagement").collection("item");
        const reviewCollection = client.db("warehouseManagement").collection("review");

        app.get('/item', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemCollection.findOne(query);
            res.send(item);
        });

        app.post('/item', async (req, res) => {
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result);
        });

        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        });

        
        app.put("/item/:id", async (req, res) => {
            const id = req.params.id;
            const updateItem = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateItemDoc = {
                $inc: {
                    quantity: updateItem.itemQuantity,
                },
            };
            const result = await itemCollection.updateOne(
                filter,
                option,
                updateItemDoc
            );

            res.send(result);
        });


        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = await reviewCollection.findOne(query);
            res.send(review);
        });
        
    }


    
    finally {
    }
}

run().catch(console.dir);


app.get('/', async (req, res) => {
    res.send('Warehouse Management Server running');
})

app.listen(port, () => {
    console.log(`Warehouse Management Server is Listening on port ${port}`)
})
