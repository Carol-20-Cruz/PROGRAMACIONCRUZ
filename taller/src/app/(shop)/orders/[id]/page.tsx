import { QuantitySelector } from "@/components";
import { Title } from "@/components/ui/title/Title";
import { initialData } from "@/seed/seed";
import Image from "next/image";
import clsx from "clsx";
import { IoCardOutline } from "react-icons/io5";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

interface Props {
  params: {
    id: string;
  };
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params;

  const isPaid = true; // cámbialo a false si quieres que se vea “Pendiente de Pago”

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden # ${id}`} />

        {/* Estado del pago */}
        <div className="flex flex-col mt-5">
          <div
            className={clsx(
              "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
              {
                "bg-red-500": !isPaid,
                "bg-green-500": isPaid,
              }
            )}
          >
            <IoCardOutline size={30} />
            <span className="mx-2">
              {isPaid ? "Pagada" : "Pendiente de Pago"}
            </span>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Productos */}
          <div>
            {productsInCart.map((product) => (
              <div key={product.slug} className="flex mb-5">
                <Image
                  src={`/products/${product.images[0]}`}
                  width={100}
                  height={100}
                  alt={product.title}
                  className="rounded"
                />
                <div className="flex flex-col ml-5">
                  <span>{product.title}</span>
                  <span>${product.price} x 2</span>
                  <span className="font-bold">
                    Subtotal: ${product.price * 2}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen y dirección */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">Julian Quimbayo</p>
              <p>Avenida Prado Alto</p>
              <p>Barrio Prado Alto</p>
              <p>Alcaldía de Neiva</p>
              <p>Neiva - Huila</p>
              <p>3158070863</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Resumen de la orden</h2>

            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">3 artículos</span>

              <span>Subtotal</span>
              <span className="text-right">$100</span>

              <span>Impuestos (15%)</span>
              <span className="text-right">$15</span>

              <span className="text-2xl mt-5">Total:</span>
              <span className="text-right text-2xl mt-5">$115</span>
            </div>

            {/* Estado inferior */}
            <div className="mt-5 mb-2 w-full">
              <div
                className={clsx(
                  "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                  {
                    "bg-red-500": !isPaid,
                    "bg-green-500": isPaid,
                  }
                )}
              >
                <IoCardOutline size={30} />
                <span className="mx-2">
                  {isPaid ? "Pagada" : "Pendiente de Pago"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

