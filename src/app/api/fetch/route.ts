import { connectToDatabase } from "../../services/mongo";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { db } = await connectToDatabase()
        const collection = db.collection("tracker")
        const documents = await collection.find( {  } ).toArray()
        console.log(documents)
        return NextResponse.json(documents)
    } catch {
        return NextResponse.json("Error")
    }
}