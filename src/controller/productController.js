import { productSchema,priceSchema } from "@/schema/productSchema";
import { supabase } from "@/lib/supabase";
export async function getProduct() {
    const {data,error} = await supabase.from("products").select("*")
    if(error){
        throw new Error(error.message)
    }
    return data
}

export async function addProduct(body) {
    const validated = productSchema.parse(body)

    const {data,error} = await supabase.from("products").insert(validated).select()
    if(error){
        throw new Error(error.message)
    }
    return data
}

export async function updateProduct(body,id){
      const price = priceSchema.parse(body)
      const {data,error} = await supabase.from("products").update(price).eq("id",id).select()
      if(error){
        throw new Error(error.message)
      }
      return data
}

export async function deleteProduct(id){
    const {data,error} = await supabase.from("products").delete().eq("id",id).select()
    if(error){
        throw new Error(error.message)
    }
    return data
}
