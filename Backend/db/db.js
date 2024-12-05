import mongoose from "mongoose";

const connectToMongo = async () => {
  await mongoose
    .connect("mongodb+srv://mongodb:mongodb@cluster0.rlfty.mongodb.net/mongodb?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("DB Connected"))
    .catch((err) => console.error("DB Connection Error: ", err));
};

export default connectToMongo;
