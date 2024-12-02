import mongoose from "mongoose";

const connectToMongo = async () => {
  await mongoose
    .connect("mongodb+srv://mongodb:mongodb@mycluster.foyhv.mongodb.net/mongodb?retryWrites=true&w=majority&appName=MyCluster")
    .then(() => console.log("DB Connected"))
    .catch((err) => console.error("DB Connection Error: ", err));
};

export default connectToMongo;
