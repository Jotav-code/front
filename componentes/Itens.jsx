import React from 'react'

// Certifique-se que o caminho da imagem está correto
import tenisImg from '../src/assets/nike.jpeg' 
import tenisImg2 from '../src/assets/nike2.jpeg' 
import tenisImg3 from '../src/assets/nike3.jpeg' 
import tenisImg4 from '../src/assets/nike4.jpeg' 
import tenisImg5 from '../src/assets/nike5.jpeg' 
import tenisImg6 from '../src/assets/nike.jpeg' 
import tenisImg7 from '../src/assets/nike7.jpeg' 
import tenisImg8 from '../src/assets/nike8.jpeg' 

const listaProdutos = [
  { 
    id: 1, 
    nome: "Nike Air Zoom Pegasus 40", 
    categoria: "Corrida de Estrada",
    descricao: "Uma passada elástica para qualquer corrida, com a sensação familiar do Peg que ajuda você a alcançar seus objetivos.",
    preco: "R$ 899,99", 
    img: tenisImg,
    nota: 5,
    avaliacoes: 128
  },
  { 
    id: 2, 
    nome: "Nike Dunk Low Retro", 
    categoria: "Casual Masculino",
    descricao: "Criado para as quadras, mas levado para as ruas, o ícone do basquete dos anos 80 retorna com detalhes clássicos.",
    preco: "R$ 799,99", 
    img: tenisImg2,
    nota: 4,
    avaliacoes: 342
  },
  { 
    id: 3, 
    nome: "Nike Metcon 9", 
    categoria: "Treino e Academia",
    descricao: "A placa Hyperlift no calcanhar ficou ainda maior para estabilidade em treinos pesados como agachamentos e levantamento terra.",
    preco: "R$ 999,99", 
    img: tenisImg3,
    nota: 5,
    avaliacoes: 89
  },
  { 
    id: 4, 
    nome: "Nike Air Max 90", 
    categoria: "Casual",
    descricao: "O amortecimento Air visível, originalmente criado para corrida de desempenho, coloca a história do conforto sob seus pés.",
    preco: "R$ 849,99", 
    img: tenisImg4,
    nota: 4,
    avaliacoes: 215
  },
  { 
    id: 5, 
    nome: "Nike Revolution 7", 
    categoria: "Corrida Leve",
    descricao: "Carregamos o Revolution 7 com o tipo de amortecimento macio e suporte que pode mudar o seu mundo de corrida.",
    preco: "R$ 399,99", 
    img: tenisImg5,
    nota: 4,
    avaliacoes: 56
  },
  { 
    id: 6, 
    nome: "Nike Court Vision Low", 
    categoria: "Casual",
    descricao: "A mistura de couro genuíno e sintético no cabedal adiciona durabilidade e um visual nítido e clássico.",
    preco: "R$ 499,99", 
    img: tenisImg6,
    nota: 5,
    avaliacoes: 102
  },
  { 
    id: 7, 
    nome: "Nike Zoom Fly 5", 
    categoria: "Corrida de Competição",
    descricao: "Preencha a lacuna entre o seu treino de fim de semana e o dia da corrida com um design durável e propulsivo.",
    preco: "R$ 1.199,99", 
    img: tenisImg7,
    nota: 3,
    avaliacoes: 24
  },
  { 
    id: 8, 
    nome: "Jordan Stay Loyal 3", 
    categoria: "Basquete / Casual",
    descricao: "Inspirado no legado, construído para o futuro. Design minimalista com amortecimento Air no calcanhar.",
    preco: "R$ 699,99", 
    img: tenisImg8,
    nota: 5,
    avaliacoes: 67
  },
]

export const Itens = () => {
  return (
    <section className="w-full py-12 bg-white">
        <div className='w-full max-w-[1280px] mx-auto px-4 sm:px-8'>
            
            <div className="flex justify-between items-end mb-8">
                <h2 className="text-2xl font-medium text-green-900">
                    Lançamentos da Semana
                </h2>
                {/* Link estilo Nike "Ver tudo" */}
                <a href="#" className="text-gray-900 font-medium hover:text-gray-500 transition-colors hidden sm:block">
                    Ver tudo (25)
                </a>
            </div>

            {/* Grid Responsivo */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10'>
                
                {listaProdutos.map((produto) => (
                    <div key={produto.id} className='group flex flex-col h-full'>
                        
                        {/* Imagem com fundo cinza claro (Estilo Nike) */}
                        <div className='relative w-full aspect-square bg-[#f5f5f5] mb-4 overflow-hidden rounded-sm'>
                            <img 
                                src={produto.img} 
                                alt={produto.nome} 
                                className='w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-105 transition-transform duration-500 ease-in-out'
                            />
                            {/* Tag de "Novo" opcional */}
                            {produto.id <= 2 && (
                                <span className="absolute top-2 left-2 bg-white text-xs font-semibold px-2 py-1 text-gray-900">
                                    Lançamento
                                </span>
                            )}
                        </div>

                        {/* Informações do Produto */}
                        <div className='flex flex-col flex-grow'>
                            {/* Título e Categoria */}
                            <div className="mb-1">
                                <h3 className='font-medium text-lg text-gray-900 leading-tight'>
                                    {produto.nome}
                                </h3>
                                <p className='text-gray-500 text-sm mt-1'>
                                    {produto.categoria}
                                </p>
                            </div>

                            {/* --- ÁREA DE AVALIAÇÃO (Estrelas) --- */}
                            <div className="flex items-center mb-3">
                                {/* Lógica simples para renderizar estrelas preenchidas ou cinzas */}
                                {[...Array(5)].map((_, index) => (
                                    <svg 
                                        key={index}
                                        className={`w-4 h-4 ${index < produto.nota ? 'text-yellow-400' : 'text-gray-300'}`} 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <span className="text-xs text-gray-500 ml-2 mt-0.5">
                                    ({produto.avaliacoes})
                                </span>
                            </div>

                            {/* Descrição Fictícia */}
                            <p className='text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2'>
                                {produto.descricao}
                            </p>

                            {/* Preço e Botão (Jogados para o final com mt-auto) */}
                            <div className='mt-auto pt-2 flex flex-col gap-3'>
                                <p className='font-semibold text-gray-900'>
                                    {produto.preco}
                                </p>
                                
                                <button className='w-full bg-green-400 text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300'>
                                    Adicionar ao Carrinho
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    </section>
  )     
}