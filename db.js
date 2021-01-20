//db.js
const ObjectId = require("mongodb").ObjectId;

const mongoClient = require("mongodb").MongoClient;

const connectDatabase = () => {
  if (!global.connection) {
    mongoClient
      .connect(process.env.MONGODB_CONNECTION, { useUnifiedTopology: true })
      .then((connection) => {
        global.connection = connection.db("projetoejsexpress");
        console.log("Conectado!!!");
      })
      .catch((error) => {
        console.log(error);
        global.connection = null;
      });
  }
};

const findCustomers = () => {
  connectDatabase();
  return global.connection.collection("customers").find({}).toArray();
};

const findCustomer = (id) => {
  connectDatabase();
  const objectId = new ObjectId(id);
  return global.connection.collection("customers").findOne({ _id: objectId });
};

const insertCustomer = (customer) => {
  connectDatabase();
  return global.connection.collection("customers").insertOne(customer);
};

const updateCustomer = (id, customer) => {
  connectDatabase();
  const objectId = new ObjectId(id);
  return global.connection
    .collection("customers")
    .updateOne({ _id: objectId }, { $set: customer });
};

const deleteCustomer = (id) => {
  connectDatabase();
  const objectId = new ObjectId(id);
  return global.connection.collection("customers").deleteOne({ _id: objectId });
};

module.exports = {
  findCustomers,
  insertCustomer,
  updateCustomer,
  findCustomer,
  deleteCustomer,
};
