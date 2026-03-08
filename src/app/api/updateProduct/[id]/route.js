import { NextResponse } from "next/server";
import { updateProduct } from "@/controller/productController";

export async function PATCH(req,{params}){
    const body = await req.json()
    const {id} =  await params
    try {
        const data = await updateProduct(body,id)
        return NextResponse.json({message:"price updated succesful",data},{status:200})
    } catch (error) {
        return NextResponse.json(error.message,{status:500})
    }
}