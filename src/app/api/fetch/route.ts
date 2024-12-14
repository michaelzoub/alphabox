import { connectToDatabase } from "../../services/mongo";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { db } = await connectToDatabase()
        const collection = db.collection("tracker")
        const document = await collection.findOne({ address: body })
        if (!document) {
            await collection.insertOne({ address: body })
        }
        console.log("success")
        return NextResponse.json("success")
    } catch (error) {
        console.log(error)
        return NextResponse.json("Error")
    }
}