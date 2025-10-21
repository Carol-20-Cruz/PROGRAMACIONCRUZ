import { ProductGrid, Title } from "@/components";
import { titleFont } from "@/config/fonts";
import { initialData } from "@/seed/seed";

const products = initialData.products;


export default function Home() {
  return (
    <>
      <Title
        title="Corhuila SHOP"
        subtitle="El ecommerce para todos"
        className="mb-2"
      
      />

      <ProductGrid
        products={products}
      
      />
    </>
  );
}
