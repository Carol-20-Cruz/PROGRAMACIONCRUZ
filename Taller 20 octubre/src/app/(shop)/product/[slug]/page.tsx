import { QuantitySelector, SizeSelector, SlideShowProduct, SlideShowProductMobile } from "@/components";
import { titleFont } from "@/config/fonts";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

export default async function ({ params }: Props) {
  const { slug } = await params;

  const product = initialData.products.find((product) => product.slug === slug);

  if (!product) {
    notFound();
  }
  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* SLIDE SHOW MOBILE */}
      <SlideShowProductMobile
        title={product.title}
        images = {product.images}
        className="block md:hidden"
        />

      {/* SLIDE SHOW DESKTOP */}

      <div className="col-span-1 md:col-span-2">
        <SlideShowProduct
        title= {product.title}
        images= {product.images}
        className="hiddem md:block"
        />
      </div>


      {/* SlideShow*/}
      <div className="col-span-1 md:col-span-2">
        <SlideShowProduct 
        title={product.title}
        images={product.images}
      
      />
      </div>

      {/* Detalles*/}
      <div className="col-span-1 px-5">
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>

        {/* Tallas*/}
        <SizeSelector 
          selectedSize={product.sizes[0]}
          availablesSizes={product.sizes}
        />
        {/* Cantidad*/}

        <QuantitySelector 
          quantity={2}
        />

        {/* Botón del Carrito*/}
        <button className="btn-primary my-5">Agregar al Carrito</button>

        {/* Descripción*/}

        <h3 className="font-bold text-sm">
          Descripción
        </h3>
        <p className="font-light">
          {product.description}
        </p>
      </div>
    </div>
  );
}
