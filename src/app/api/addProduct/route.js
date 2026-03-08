import { NextResponse } from "next/server";
import { addProduct } from "@/controller/productController";

export async function POST(req){
    const body =  await req.json()
    try {
        const data = await addProduct(body)
        return NextResponse.json({message:"product added succesful",data},{status:200})
    } catch (error) {
        return NextResponse.json({message:error.message},{status:500})
    }
}