'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Habito {
  id: number;
  nombre: string;
  descripcion: string;
  meta_frecuencia: string;
}

interface Registro {
  id?: number;
  habito_id: number;
  fecha: string;
  completado: boolean;
  notas: string;
}

interface Props {
  refreshTrigger?: number; // <- cada vez que cambia, se recarga la tabla
}

const HabitoRegistroTable: React.FC<Props> = ({ refreshTrigger }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabitos = async () => {
    try {
      const res = await axios.get<Habito[]>(`${apiUrl}/api/habitos`);
      setHabitos(res.data.reverse());
    } catch (error) {
      console.error("Error al cargar hábitos:", error);
    }
  };

  const fetchRegistros = async () => {
    try {
      const res = await axios.get<Registro[]>(`${apiUrl}/api/registros`);
      const normalizados = res.data.map((r: any, i: number) => ({
        ...r,
        id: r.id ?? i + 1,
        habito_id: Number(r.habito_id),
      }));
      setRegistros(normalizados);
    } catch (error) {
      console.error("Error al cargar registros:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await fetchHabitos();
    await fetchRegistros();
    setLoading(false);
  };

  // Se ejecuta al montar y cuando cambia refreshTrigger
  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  // --- Combinar hábitos con registros ---
  const combinedData = React.useMemo(() => {
    return habitos.map((h) => {
      const registro = registros.find((r) => r.habito_id === h.id);
      return {
        nombre: h.nombre || "-",
        habito: h.descripcion || "-",
        meta: h.meta_frecuencia || "-",
        fecha: registro?.fecha || "-",
        completado: registro ? (registro.completado ? "✅" : "❌") : "❌",
        nota: registro?.notas || "-",
        id: h.id,
      };
    });
  }, [habitos, registros]);

  return (
    <div className="w-full overflow-x-auto p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
        Tabla de Hábitos y Registros
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Cargando datos...</p>
      ) : (
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Nombre</th>
              <th className="py-2 px-4 border-b text-left">Hábito</th>
              <th className="py-2 px-4 border-b text-left">Meta</th>
              <th className="py-2 px-4 border-b text-left">Fecha</th>
              <th className="py-2 px-4 border-b text-left">Completado</th>
              <th className="py-2 px-4 border-b text-left">Nota</th>
            </tr>
          </thead>
          <tbody>
            {combinedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">
                  No hay registros
                </td>
              </tr>
            ) : (
              combinedData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition">
                  <td className="py-2 px-4 border-b">{row.nombre}</td>
                  <td className="py-2 px-4 border-b">{row.habito}</td>
                  <td className="py-2 px-4 border-b">{row.meta}</td>
                  <td className="py-2 px-4 border-b">{row.fecha}</td>
                  <td className="py-2 px-4 border-b text-center">
                    {row.completado}
                  </td>
                  <td className="py-2 px-4 border-b">{row.nota}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HabitoRegistroTable;