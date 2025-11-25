import React from 'react'

const categoriasData = [
  {
    id: 1,
    nome: "Corrida",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    id: 2,
    nome: "Basquete",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 3,
    nome: "Futebol",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  },
  {
    id: 4,
    nome: "Academia",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    )
  },
  {
    id: 5,
    nome: "Casual",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 6,
    nome: "Skate",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
]

export const Categorias = () => {
  return (
    <section className="w-full py-10 bg-white">
        <div className='w-full max-w-[1280px] mx-auto px-4 sm:px-8'>
            
            {/* Título da Seção */}
            <div className="mb-8 text-center sm:text-left">
                {/* Cor fixa: Verde Escuro (#14532d) */}
                <h2 className="text-2xl font-medium text-[#14532d]">
                    Navegue por Categorias
                </h2>
            </div>

            {/* Grid de Categorias */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                
                {categoriasData.map((cat) => (
                    <a 
                        key={cat.id} 
                        href="#" 
                        // Cor fixa no Hover: Verde Claro (#4ade80)
                        className="group flex flex-col items-center justify-center p-6 rounded-xl bg-[#f5f5f5] hover:bg-[#4ade80] transition-all duration-300 cursor-pointer"
                    >
                        {/* Ícone - Cor fixa: Verde Escuro (#14532d) */}
                        <div className="text-[#14532d] group-hover:text-white transition-colors duration-300 mb-3">
                            {cat.icon}
                        </div>
                        
                        {/* Nome da Categoria */}
                        <span className="font-medium text-gray-700 group-hover:text-white transition-colors duration-300">
                            {cat.nome}
                        </span>
                    </a>
                ))}

            </div>
        </div>
    </section>
  )
}