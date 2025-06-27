import mongoose from "mongoose"

export const connectDB=async () =>{
    await mongoose.connect('mongodb+srv://ayshareeha719:oRRdTYuX0Ja2FHiX@cluster0.ohhjxkr.mongodb.net/foodorder')
    .then(()=> console.log('DB connected'))
}