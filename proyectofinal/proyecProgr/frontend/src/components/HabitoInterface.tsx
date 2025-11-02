'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- Interfaces y Tipos ---
interface Habito {
  id: number;
  nombre: string;
  descripcion: string;
  meta_frecuencia: string;
}

interface Registro {
  id: number;
  fecha: string;
  completado: boolean;
  notas: string;
  habito_id: number;
}

type NuevoHabito = Omit<Habito, 'id'>;
type NuevoRegistro = Omit<Registro, 'id'>;

interface HabitInterfaceProps {
  backendName: string;
}

// Opciones de meta_frecuencia estandarizadas
const FRECUENCIA_OPTIONS = [
  'Diaria', 
  'Semanal', 
  'Mensual', 
  '3 veces/semana'
];

// ---  componente Tarjeta de hábito ---
const CardComponent = ({ habito }: { habito: Habito }) => (
  <div className="grow">
    <p className="text-sm text-gray-500">ID: {habito.id}</p>
    <p className="text-lg font-semibold text-gray-800">{habito.nombre}</p>
    <p className="text-md text-gray-600">{habito.descripcion}</p>
    <p className="text-sm text-gray-700 italic">
      Meta: {habito.meta_frecuencia}
    </p>
  </div>
);

// --- Componente principal ---
const HabitInterface: React.FC<HabitInterfaceProps> = ({ backendName }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const colorThemes: Record<string, { bg: string; btn: string }> = {
    go: { bg: 'bg-cyan-50', btn: 'bg-cyan-700 hover:bg-cyan-600' },
    rust: { bg: 'bg-orange-50', btn: 'bg-orange-600 hover:bg-orange-500' },
    node: { bg: 'bg-green-50', btn: 'bg-green-500 hover:bg-green-400' },
  };
  const theme = colorThemes[backendName] || {
    bg: 'bg-gray-100',
    btn: 'bg-gray-600 hover:bg-gray-500',
  };

  // --- Estados ---
  const [habitos, setHabitos] = useState<Habito[]>([]);
  // Eliminamos el estado registros aquí ya que no se utiliza en esta interfaz.
  // const [registros, setRegistros] = useState<Registro[]>([]); 
  const [nuevoHabito, setNuevoHabito] = useState<NuevoHabito>({
    nombre: '',
    descripcion: '',
    // Establecer un valor por defecto
    meta_frecuencia: FRECUENCIA_OPTIONS[0], 
  });
  // Eliminamos el estado nuevoRegistro ya que no se utiliza en esta interfaz.
  // const [nuevoRegistro, setNuevoRegistro] = useState<NuevoRegistro>({
  //   fecha: '',
  //   completado: false,
  //   notas: '',
  //   habito_id: 0,
  // });
  const [habitoEditar, setHabitoEditar] = useState<Habito | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [editFormError, setEditFormError] = useState<string | null>(null);

  // --- Cargar datos ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const habitosRes = await axios.get<Habito[]>(`${apiUrl}/api/habitos`);
        // Aseguramos que la lista se cargue invertida (nuevos primero)
        setHabitos(habitosRes.data.reverse()); 
        // Eliminamos la carga de registros ya que no es necesaria en esta interfaz
        // await axios.get<Registro[]>(`${apiUrl}/api/registros`),
        // setRegistros(registrosRes.data);
        
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  // --- Crear hábito ---
  const crearHabito = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validamos que todos los campos requeridos estén llenos.
    if (!nuevoHabito.nombre || !nuevoHabito.descripcion || !nuevoHabito.meta_frecuencia) {
      setFormError('Por favor, completa todos los campos.');
      return;
    }

    const nombreExists = habitos.some(
      (h) => h.nombre.toLowerCase() === nuevoHabito.nombre.toLowerCase()
    );
    if (nombreExists) {
      setFormError('Ya existe un hábito con ese nombre.');
      return;
    }

    setFormError(null);
    try {
      const response = await axios.post<Habito>
      (`${apiUrl}/api/habitos`, nuevoHabito);
      // Agregamos el nuevo hábito al inicio de la lista
      setHabitos([response.data, ...habitos]); 
      // Reseteamos el formulario
      setNuevoHabito({ 
          nombre: '', 
          descripcion: '', 
          meta_frecuencia: FRECUENCIA_OPTIONS[0] 
      });
    } catch (error) {
      console.error('Error al crear hábito:', error);
      setFormError('Ocurrió un error al crear el hábito.');
    }
  };

  // --- Actualizar hábito ---
  const handleUpdateHabito = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!habitoEditar) return;

    const nombreExists = habitos.some(
      (h) =>
        h.nombre.toLowerCase() === habitoEditar.nombre.toLowerCase() &&
        h.id !== habitoEditar.id
    );
    if (nombreExists) {
      setEditFormError('El nombre del hábito ya está en uso por otro registro.');
      return;
    }

    setEditFormError(null);
    try {
      await axios.put(`${apiUrl}/api/habitos/${habitoEditar.id}`, habitoEditar);
      setHabitos(habitos.map((h) => (h.id === habitoEditar.id ? habitoEditar : h)));
      setHabitoEditar(null);
    } catch (error) {
      console.error('Error al actualizar hábito:', error);
      setEditFormError('Ocurrió un error al actualizar el hábito.');
    }
  };

  // --- Eliminar hábito ---
  const eliminarHabito = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/api/habitos/${id}`);
      setHabitos(habitos.filter((h) => h.id !== id));
    } catch (error) {
      console.error('Error al eliminar hábito:', error);
    }
  };

  

  // --- Manejadores ---
  const handleNuevoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNuevoHabito({ ...nuevoHabito, [e.target.name]: e.target.value });
    if (formError) setFormError(null);
  };

  const handleEditarChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (habitoEditar) {
      setHabitoEditar({ ...habitoEditar, [e.target.name]: e.target.value });
      if (editFormError) setEditFormError(null);
    }
  };

  
  // --- Render ---
  return (
    <div className={`w-full max-w-6xl p-6 my-4 rounded-lg shadow-lg ${theme.bg}`}>
      <div className="text-center mb-6">
        <img
          src="/logo.png"
          alt="Logo de hábitos"
          className="w-24 h-24 mx-auto mb-3"
        />
        <h2 className="text-3xl font-bold text-gray-800">
          {`APP DE HÁBITOS `}
        </h2>
        <p className="text-gray-600 text-lg">Gestión de Hábitos y Registros</p>
      </div>

      {/* --- Crear hábito --- */}
      <form onSubmit={crearHabito} className="mb-6 space-y-3 max-w-md mx-auto">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={nuevoHabito.nombre}
          onChange={handleNuevoChange}
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={nuevoHabito.descripcion}
          onChange={handleNuevoChange}
          className="border rounded p-2 w-full"
          required
        />
        
        {/* CAMPO SELECT MODIFICADO */}
        <select
          name="meta_frecuencia"
          value={nuevoHabito.meta_frecuencia}
          onChange={handleNuevoChange}
          className="border rounded p-2 w-full"
          required
        >
          {FRECUENCIA_OPTIONS.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        
        {formError && <p className="text-red-500 text-sm">{formError}</p>}
        <button type="submit" className={`text-white px-4 py-2 rounded ${theme.btn} w-full`}>
          Agregar Hábito
        </button>
      </form>

      {/* --- Listado --- */}
      {isLoading ? (
        <p className="text-center">Cargando datos...</p>
      ) : (
        <>
          <h3 className="text-xl font-bold mb-3 text-gray-700 text-center">Hábitos</h3>
          <div className="grid gap-4 max-w-3xl mx-auto mb-6">
            {habitos.map((h) => (
              <div key={h.id} className="border rounded p-4 bg-white flex justify-between items-center">
                {habitoEditar && habitoEditar.id === h.id ? (
                  <form onSubmit={handleUpdateHabito} className="flex flex-col gap-2 w-full">
                    <input type="text" name="nombre" value={habitoEditar.nombre} onChange={handleEditarChange} className="border p-2 rounded" />
                    <input type="text" name="descripcion" value={habitoEditar.descripcion} onChange={handleEditarChange} className="border p-2 rounded" />
                    
                    {/* CAMPO SELECT MODIFICADO EN EDICIÓN */}
                    <select
                        name="meta_frecuencia"
                        value={habitoEditar.meta_frecuencia}
                        onChange={handleEditarChange}
                        className="border rounded p-2 w-full"
                        required
                    >
                        {FRECUENCIA_OPTIONS.map(option => (
                            <option key={option} value={option}>
                            {option}
                            </option>
                        ))}
                    </select>
                    
                    {editFormError && <p className="text-red-500 text-sm">{editFormError}</p>}
                    <div className="flex gap-2">
                      <button type="submit" className={`text-white px-3 py-1 rounded ${theme.btn}`}>Guardar</button>
                      <button type="button" onClick={() => setHabitoEditar(null)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancelar</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <CardComponent habito={h} />
                    <div className="flex gap-2">
                      <button onClick={() => setHabitoEditar(h)} className={`text-white px-3 py-1 rounded ${theme.btn}`}>Editar</button>
                      <button onClick={() => eliminarHabito(h.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500">Eliminar</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

        </>
      )}
    </div>
  );
};

export default HabitInterface;