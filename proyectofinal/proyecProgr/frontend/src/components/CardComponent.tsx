
import React from "react";
 interface Props{
    id:number 
    nombre: string;
    descripcion: string;
    meta_frecuencia: string;

 }

 export const CardComponent = ({ id, nombre, descripcion, meta_frecuencia }: Props) => {
  return (
    <div className='bg-white shadow-lg rounded-lg p-2 mb-2 hover:bg-gray-100'>
        <div className='text-sm text-gray-600'>Id: {id}</div> 
        <div className='text-lg text-gray-800 font-semibold'>Nombre: {nombre}</div>
        <div className='text-md text-gray-700'>Descripción: {descripcion}</div>
        <div className='text-sm text-gray-700 italic'>Meta: {meta_frecuencia}</div>
    </div>
  )
}

export default CardComponent;