const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

// Midel Ware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dzdlp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

  try {
    await client.connect();
    const database = client.db('apple_user');
    const serviceCollection = database.collection('service');

    //Get Api

    app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find({});
      const service = await cursor.toArray();
      res.send(service);
    })

    //Get Api single service .
   
    app.get('/services/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.json(service);
    })

    // Post Api 
    app.post('/services', async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service)
      console.log(result);
      res.send(result);
    })



  }
  finally {
    // await client.close();
  }


}run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`${port}`)
})