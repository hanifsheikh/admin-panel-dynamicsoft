import mongoose from "mongoose";

type Connection = {
  isConnected: boolean;
}
const connection:Connection = {isConnected:false};

async function connect() {
  if (connection.isConnected) {   
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState === 1;
    if (connection.isConnected) {   
      return;
    }
    await mongoose.disconnect();
  }
  await mongoose
    .connect(process.env.MONGODB_URI || '', {
      authSource: "admin",
    })
    .then(() => {    
      connection.isConnected = true;
    });  
}

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;    
    }
  }
}
function convertDocToObj(doc:any) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

const db = { connect, disconnect, convertDocToObj };
export default db;
