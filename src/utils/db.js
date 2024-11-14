import mongoose from 'mongoose'
import { NextResponse } from 'next/server'
import { cookies } from "next/headers";

const config = {
    isConnected: 0
}

export async function dbConnect(){
    console.log("config", config.isConnected)
    if(config.isConnected){
        return;
    }


    try{


        // console.log(process.env.URL)
        const {connection} = await mongoose.connect(process.env.MONGO_URL,{
            dbName:"Work",})
        console.log("db Connected")
        config.isConnected = connection._readyState
        return connection


    }
    catch(error){
        console.log("error found")
        console.log(error)
    }
    
}