
import { ProductGrid, Title } from "@/components";
import { titleFont } from "@/config/fonts";
import { Category } from "@/interfaces";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

const seedProducts = initialData.products;

interface Props{
  params:{
    id:Category;
  }
}


export  default async function({params}:Props) {
const{id}=await params;

const products = seedProducts.filter(product => product.gender === id);

const labels:Record<Category, string> = {
  'men':'Hombres',
  'women':'Mujeres',
  'kid': 'Niños',
  'unisex':'Todos'
}

/*if(id==='kids'){
  notFound();
}*/

  return (
    <>
          <Title
            title={`Artículos para ${labels[id]}`}
            subtitle="El ecommerce para todos"
            className="mb-2"
          
          />
    
          <ProductGrid
            products={products}
          
          />
        </>
  );
}
