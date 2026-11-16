import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 5000;

const client = new MongoClient(
  `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-6bz1cgi-shard-00-00.sirnlfh.mongodb.net:27017,ac-6bz1cgi-shard-00-01.sirnlfh.mongodb.net:27017,ac-6bz1cgi-shard-00-02.sirnlfh.mongodb.net:27017/?ssl=true&replicaSet=atlas-jcpjqo-shard-0&authSource=admin`,
);

app.use(express.json());
app.use(cors());

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const connectedClient = await connectToMongoDB();
const database = connectedClient.db("hireloopdb");
const users = database.collection("user");
const jobs = database.collection("jobs");

app.get("/", (req, res) => {
  res.send("Server Working");
});

//users load to Frontend
app.get("/users", async (req, res) => {
  const result = await users.find({}).toArray();
  res.send(result);
});
//New Jobs API
app.post("/jobs", async (req, res) => {
  const job = req.body;
  const result = await jobs.insertOne(job);
  res.send(result);
});

//Jobs Data Find Api
app.get("/jobs", async (req, res) => {
  const cursor = jobs.find();
  const result = await cursor.toArray();
  res.send(result);
});
//Jobs Delete API
app.delete('/jobs/:id',async(req,res)=>{
  const id = req.params.id;
  const query ={_id:new ObjectId(id)};
  const result = await jobs.deleteOne(query);
  res.send(result);
})

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
