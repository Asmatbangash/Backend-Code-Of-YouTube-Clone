import mongoose from "mongoose"
import { DB_NAME } from "../constent.js"

const ConnectDB = async () => {
    try {
     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    } catch (error) {
        console.log('MongoDb connection Faild', error)
        process.exit(1)
    }
    
}

export default ConnectDB