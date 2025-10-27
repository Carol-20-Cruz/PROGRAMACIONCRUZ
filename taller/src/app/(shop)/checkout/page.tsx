export default function CheckoutPage() {
  return (
    <div className="bg-white rounded-xl shadow p-7">
      <h2 className="text-2xl mb-2">Resumen de la Orden</h2>

      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">3 Artículos</span>

        <span>Subtotal</span>
        <span className="text-right">$100</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">$15</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">$115</span>
      </div>

      {/* Dirección de entrega */}
      <h2 className="text-2xl mb-2 mt-10">Dirección de Entrega</h2>
      <div className="mb-10">
        <p>Julian Quimbayo</p>
        <p>Avenida Prado Alto</p>
        <p>Barrio Prado Alto</p>
        <p>Alcaldía de Neiva</p>
        <p>Neiva - Huila</p>
        <p>3158707863</p>
      </div>

      {/* Divisor */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

      {/* Texto de términos y privacidad */}
      <p className="mb-5 text-xs">
        <span>
          Al hacer click en “Colocar Orden”, aceptas nuestros{" "}
          <a href="#" className="underline">
            términos y condiciones
          </a>{" "}
          y{" "}
          <a href="#" className="underline">
            política de privacidad
          </a>
          .
        </span>
      </p>

      <div className="flex btn-primary justify-center">
        <a href="/orders/123">Colocar Orden</a>
      </div>
    </div>
  );
}


