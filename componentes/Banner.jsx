import React from 'react'
// 1. Importe a imagem aqui
import bannerImg from '../src/assets/foto.jpeg'

export const Banner = () => {
  return (
    <section className="w-full">
        {/* 2. Use a prop 'style' para a imagem de fundo */}
        <div 
            className='h-[80vh] w-full bg-cover bg-center'
            style={{ backgroundImage: `url(${bannerImg})` }}
        >
            {/* Conteúdo do banner aqui */}
        </div>
    </section>
  )
}