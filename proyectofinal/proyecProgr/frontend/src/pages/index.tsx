import React from "react";
import UserInterface from "@/components/HabitoInterface";
import RegistroInterface from "@/components/RegistroInterface";
import HabitoRegistroTable from "@/components/HabitoRegistroTable";

const Home: React.FC = () => {
  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50 p-6 space-y-12">
      {/* --- Sección de Hábitos --- */}
      <section className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-md">
        <UserInterface backendName="go" />
      </section>

      {/* --- Sección de Registro de Actividades --- */}
      <section className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-md">
        <RegistroInterface backendName="go" />
      </section>

      {/* --- Sección de Tabla Combinada --- */}
      <section className="w-full max-w-6xl bg-white p-6 rounded-2xl shadow-md">
        <HabitoRegistroTable />
      </section>
    </main>
  );
};

export default Home;



