import { getProduct } from "@/controller/productController";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const products = await getProduct()
        return  NextResponse.json(products)
    } catch (error) {
        return NextResponse.json({error:error.message},{status:500})
    }

}

