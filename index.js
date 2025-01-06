const express =require('express')
const app = express()
const port=process.env.PORT || 5000
const cors=require('cors')

//mern-book-store

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://mern-book-store:23E5PNtGFsgu!Ha@yoga-master.tkbyu.mongodb.net/?retryWrites=true&w=majority&appName=yoga-master";

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
      await client.connect();
      const bookCollections = client.db("BookInventory").collection("Books");
  
      app.post("/upload-book", async (req, res) => {
        const data = req.body;
        const result = await bookCollections.insertOne(data);
        res.send(result);
      });

    //   app.get("/all-books", async (req, res) => {
    //          const books = bookCollections.find();
    //          const result = await books.toArray();
    //          res.send(result)
    //      })

         app.patch("/book/:id", async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const updateBookData = req.body;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    ...updateBookData
                }
            }
            const options = { upsert: true };

            // update now
            const result = await bookCollections.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.delete("/book/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await bookCollections.deleteOne(filter);
            res.send(result);
        })

        app.get("/all-books" , async(req,res)=>{
            let query={};
            if(req.query?.category){
                query={category :req.query.category} 
            }
            const result = await bookCollections.find(query).toArray();
            res.send(result);

        })

        //to get single book data

       app.get("/book/:id" ,async(req,res)=>{
        const id= req.params.id;
        const filter ={_id:new ObjectId(id)};
        const result =await bookCollections.findOne(filter);
        res.send(result);
       })
  
      console.log("Connected to MongoDB!");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }
  run().catch(console.dir);
  

app.get('/',(req,res)=>{
    res.send("Hello developers!")
})

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
})