'use client';

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

// --- Interfaces ---
interface Habito {
  id: number;
  nombre: string;
  descripcion: string;
  meta_frecuencia: string;
}

interface Registro {
  habito_nombre: string;
  id?: number;
  habito_id: number;
  fecha: string;
  completado: boolean;
  notas: string;
}

interface RegistroInterfaceProps {
  backendName: string;
}

const RegistroInterface: React.FC<RegistroInterfaceProps> = ({ backendName }) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // --- Estados ---
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [nuevoRegistro, setNuevoRegistro] = useState({
  habito_id: habitos[0]?.id || 0, // o null si prefieres
  fecha: new Date().toISOString().substring(0, 10),
  completado: true,
  notas: "",
});


  const colorThemes: Record<string, string> = {
    go: "bg-blue-100 border-blue-300",
  };

  // --- Mapeo de hábitos ---
  const habitoMap = useMemo(() => {
    const map: Record<number, Habito> = {};
    habitos.forEach((h) => {
      map[h.id] = h;
    });
    return map;
  }, [habitos]);

  // --- Obtener hábitos ---
  const obtenerHabitos = async () => {
    setLoadingError(null);
    try {
      const res = await axios.get(`${baseUrl}/api/habitos`);
      setHabitos(res.data);
      console.log("✅ Hábitos cargados:", res.data);
    } catch (error) {
      console.error("Error obteniendo hábitos:", error);
      setLoadingError("🔴 Error de conexión con el backend.");
    }
  };

  // --- Obtener registros ---
  const obtenerRegistros = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/registros`);

const dataNormalizada = res.data.map((r: any, index: number) => ({
  ...r,
  habito_id: Number(r.habito_id), // asegurar que sea número
  id: r.id ?? index + 1, // si no viene id, le damos uno temporal
}));

const sorted = [...dataNormalizada].sort((a, b) => b.id - a.id);
setRegistros(sorted);

console.log("📋 Registros cargados (normalizados):", sorted);

    } catch (error) {
      console.error("Error obteniendo registros:", error);
    }
  };

  useEffect(() => {
    obtenerHabitos();
    obtenerRegistros();
  }, []);



  useEffect(() => {
  if (habitos.length > 0 && nuevoRegistro.habito_id === 0) {
    setNuevoRegistro((prev) => ({
      ...prev,
      habito_id: habitos[0].id, // asigna automáticamente el primer hábito
    }));
  }
}, [habitos]);


  // --- Manejadores ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNuevoRegistro({
      ...nuevoRegistro,
      [name]: name === "habito_id" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevoRegistro.habito_id === 0) {
      alert("Selecciona un hábito antes de guardar");
      return;
    }

    try {
      await axios.post(`${baseUrl}/api/registros`, nuevoRegistro);
      obtenerRegistros();
      setNuevoRegistro({
        habito_id: 0,
        fecha: new Date().toISOString().substring(0, 10),
        completado: true,
        notas: "",
      });
    } catch (error) {
      console.error("Error creando registro:", error);
      alert("Error al guardar el registro. Revisa la consola (F12) para detalles.");
    }
  };

  // --- Renderizado ---
  return (
    <div
      className={`max-w-3xl mx-auto mt-8 p-8 rounded-3xl shadow-xl border ${
        colorThemes[backendName] || "bg-gray-100 border-gray-300"
      }`}
    >
      {/* ENCABEZADO */}
      <div className="text-center mb-8">
        <img src="/logo.png" alt="Logo" className="w-20 h-20 mx-auto mb-3" />
        <h2 className="text-3xl font-bold text-gray-800">Registrar Actividad</h2>
        <p className="text-gray-600 text-lg mt-1">
          Registra tus hábitos y sigue tu progreso diario
        </p>
      </div>

      {/* ERROR DE CARGA */}
      {loadingError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4">
          <p className="font-bold">Error de Carga</p>
          <p className="text-sm">{loadingError}</p>
        </div>
      )}

      {/* FORMULARIO */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md space-y-5 max-w-md mx-auto border border-gray-100"
      >
        {/* Hábito */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Hábito</label>
          <select
            name="habito_id"
            value={nuevoRegistro.habito_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
            disabled={habitos.length === 0 && loadingError === null}
          >
            <option value={0}>
              {habitos.length === 0 && !loadingError
                ? "Cargando hábitos..."
                : "Selecciona un hábito"}
            </option>
            {habitos.map((h) => (
              <option key={h.id} value={h.id}>
                ID: {h.id} — 👤 {h.nombre} — 💪 {h.descripcion}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={nuevoRegistro.fecha}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>

        {/* Completado */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">¿Completado?</label>
          <select
            name="completado"
            value={nuevoRegistro.completado ? "true" : "false"}
            onChange={(e) =>
              setNuevoRegistro({
                ...nuevoRegistro,
                completado: e.target.value === "true",
              })
            }
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Nota */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Nota/Detalle</label>
          <textarea
            name="notas"
            value={nuevoRegistro.notas}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Ej: Me sentí con mucha energía hoy"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          Guardar Registro
        </button>
      </form>

      {/* HISTORIAL */}
      {/* HISTORIAL */}
<div className="mt-12">
  <h3 className="text-2xl font-bold mb-5 text-center text-gray-700">
    Historial de Registros
  </h3>

  {registros.length === 0 ? (
    <p className="text-center text-gray-500">No hay registros guardados.</p>
  ) : (
    <div className="space-y-3 max-w-2xl mx-auto">
      {registros.map((r) => {
        const habito = habitoMap[r.habito_id];
        return (
          <div
            key={r.id}
            className="border border-gray-300 rounded-lg p-4 bg-white hover:shadow-md transition"
          >
            <p className="font-bold text-lg text-blue-700 mb-1">
              ID: {r.habito_id || "N/A"} — 👤 {r.habito_nombre || habito?.nombre || "Sin nombre"} — 💪{" "}
              {habito?.descripcion || "Sin descripción"}
            </p>
            <p className="text-gray-700 text-sm italic mb-2">
              Meta: {habito?.meta_frecuencia || "No definida"}
            </p>
            <p className="text-sm text-gray-600">📅 Fecha: {r.fecha}</p>
            <p className="text-sm mt-1">📝 Nota: {r.notas || "Sin notas"}</p>
            <p className="text-sm mt-1">
              ✅ Estado: {r.completado ? "Completado" : "Pendiente"}
            </p>
          </div>
        );
      })}
    </div>
    )}
   </div>
    </div> 
  );
};


export default RegistroInterface;
