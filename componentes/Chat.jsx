import React, { useState, useEffect, useRef } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 1. Mudamos a referência para o CONTAINER das mensagens, não um div vazio no final
  const messagesContainerRef = useRef(null);
  
  // 2. Criamos uma "bandeira" para saber se é o primeiro carregamento
  const isFirstLoad = useRef(true);

  const scrollToBottom = () => {
    // Essa lógica rola apenas o container do chat, sem pular a página inteira
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Se for o primeiro carregamento (histórico), a gente marca como falso e NÃO rola
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    // Só roda o scroll se NÃO for o primeiro carregamento (ou seja, quando user digita)
    scrollToBottom();
  }, [messages]);


  const processarHistoricoDoServidor = (textoBruto) => {
    if (!textoBruto) return [];
    const blocos = textoBruto.split('--------------------');
    const mensagensProcessadas = [];

    blocos.forEach(bloco => {
      const limpo = bloco.trim();
      if (!limpo) return;
      const partes = limpo.split(/\nResposta:/);
      if (partes.length >= 2) {
        const pergunta = partes[0].replace('Pergunta:', '').trim();
        const resposta = partes[1].trim();
        if (pergunta) mensagensProcessadas.push({ role: 'user', content: pergunta });
        if (resposta) mensagensProcessadas.push({ role: 'bot', content: resposta });
      }
    });
    return mensagensProcessadas;
  };

  useEffect(() => {
    async function fetchHistorico() {
      try {
        const response = await fetch('http://127.0.0.1:8000/historico');
        const data = await response.json(); 
        const textoDoHistorico = data.historico || ""; 
        const historicoFormatado = processarHistoricoDoServidor(textoDoHistorico);
        
        setMessages(historicoFormatado);
        
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      }
    }

    fetchHistorico();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!input.trim()) return;

    const novaPergunta = { role: 'user', content: input };
    
    setMessages(prev => [...prev, novaPergunta]);
    setLoading(true);
    setInput("");

    // Força o scroll imediatamente quando o usuário envia
    setTimeout(scrollToBottom, 100);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: input }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', content: data.resposta }]);
      
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: "Erro ao conectar com o servidor." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full mx-auto flex flex-col items-center h-screen py-10 px-10">
      <h1 className="text-1xl font-bold mb-4 text-green-600">Tem alguma dúvida?</h1>

      {/* 3. Adicionamos a ref 'messagesContainerRef' aqui no container principal 
         e garantimos que o 'scroll-behavior' seja smooth via classe CSS se possível,
         ou controlado pela função JS.
      */}
      <div 
        ref={messagesContainerRef}
        className="w-full max-w-2xl flex-1 overflow-y-auto border border-gray-300 rounded-xl p-4 bg-gray-50 shadow-inner mb-4 scroll-smooth"
      >
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div className={`
              max-w-[70%] px-4 py-2 rounded-2xl whitespace-pre-wrap
              ${msg.role === 'user' 
                ? 'bg-green-600 text-white rounded-tr-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'}
            `}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 text-gray-500 px-4 py-2 rounded-2xl rounded-tl-none animate-pulse">
              Digitando...
            </div>
          </div>
        )}
        {/* Removemos o chatEndRef daqui pois estamos controlando pelo container */}
      </div>

      <form onSubmit={handleSubmit} className='w-full max-w-2xl flex gap-2'>
        <input 
          placeholder='O que você deseja?' 
          className='flex-1 border-2 border-green-600 rounded-xl outline-none px-4 py-2 text-black' 
          type="text" 
          value={input} 
          onChange={({ target }) => setInput(target.value)} 
        />
        <button 
          disabled={loading}
          className='bg-green-800 text-white px-6 py-2 rounded-xl hover:bg-green-400 transition-all disabled:bg-blue-300'
          type="submit"
        >
          Enviar
        </button>
      </form>
    </div>
  )
}

export default Chat