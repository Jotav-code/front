import React from 'react'

const depoimentosData = [
  {
    id: 1,
    nome: "Ricardo Souza",
    titulo: "Corredor Amador",
    texto: "O atendimento foi impecável. O tênis chegou em 2 dias e a qualidade do amortecimento do Nike Pegasus superou minhas expectativas. Recomendo demais!",
    nota: 5,
  },
  {
    id: 2,
    nome: "Mariana Costa",
    titulo: "Apaixonada por Moda",
    texto: "Estava procurando o Dunk Low há meses. A loja não só tinha o meu tamanho como a entrega foi super cuidadosa. A caixa chegou intacta.",
    nota: 5,
  },
  {
    id: 3,
    nome: "Felipe Oliveira",
    titulo: "Crossfit Athlete",
    texto: "O Metcon 9 é robusto e perfeito para LPO. O guia de tamanhos do site funcionou perfeitamente, serviu como uma luva. Comprarei novamente.",
    nota: 4,
  }
]

export const Depoimentos = () => {
  return (
    <section className="w-full py-16 bg-gray-50">
        <div className='w-full max-w-[1240px] mx-auto px-4 sm:px-8'>
            
            {/* Cabeçalho da Seção */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-green-900 mb-4">
                    O que dizem nossos clientes
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Junte-se a milhares de clientes satisfeitos que elevaram seu estilo e performance com nossos produtos.
                </p>
            </div>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {depoimentosData.map((item) => (
                    <div 
                        key={item.id} 
                        className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 relative flex flex-col"
                    >
                        {/* Ícone de Aspas Decorativo */}
                        <div className="absolute top-6 right-8 text-green-100">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14.017 21L14.017 18C14.017 16.896 14.321 15.923 14.929 15.081C15.537 14.239 16.354 13.714 17.38 13.506V11.166H15.006V4H21V11.166C21 16.896 17.971 19.89 14.017 21ZM5.01699 21L5.01699 18C5.01699 16.896 5.32099 15.923 5.92899 15.081C6.53699 14.239 7.35399 13.714 8.37999 13.506V11.166H6.00599V4H12V11.166C12 16.896 8.97099 19.89 5.01699 21Z" />
                            </svg>
                        </div>

                        {/* Estrelas */}
                        <div className="flex mb-4">
                            {[...Array(5)].map((_, i) => (
                                <svg 
                                    key={i} 
                                    className={`w-5 h-5 ${i < item.nota ? 'text-yellow-400' : 'text-gray-300'}`} 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>

                        {/* Texto do Depoimento */}
                        <p className="text-gray-600 mb-6 leading-relaxed flex-grow italic">
                            "{item.texto}"
                        </p>

                        {/* Perfil do Usuário */}
                        <div className="flex items-center gap-4 mt-auto border-t border-gray-100 pt-4">
                            {/* Avatar Gerado Automaticamente */}
                            <img 
                                src={`https://ui-avatars.com/api/?name=${item.nome}&background=14532d&color=fff`} 
                                alt={item.nome} 
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <h4 className="font-bold text-green-900 text-sm">{item.nome}</h4>
                                <span className="text-xs text-green-600 font-medium">{item.titulo}</span>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}