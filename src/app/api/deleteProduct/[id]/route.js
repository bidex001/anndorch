import { NextResponse } from "next/server";
import { deleteProduct } from "@/controller/productController";


export async function DELETE(req,{params}) {
    const {id} = await params

    try {
        const data = await deleteProduct(id)
        return NextResponse.json({message:"product deleted succesful",data},{status:200})
    } catch (error) {
       return NextResponse.json(error.message,{status:500}) 
    }
}