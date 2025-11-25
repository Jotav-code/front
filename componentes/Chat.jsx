import React, { useState, useEffect, useRef } from 'react';

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para abrir/fechar o widget
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const messagesContainerRef = useRef(null);
  const isFirstLoad = useRef(true);

  // URL da API (Ajuste conforme necessário: localhost ou render)
  const API_URL = "https://cylok-a.onrender.com"; 

  // Alternar visibilidade do chat
  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    // Só rola se o chat estiver aberto
    if (isOpen) {
        scrollToBottom();
    }
  }, [messages, isOpen]);


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
        const response = await fetch(`${API_URL}/historico`);
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

    setTimeout(scrollToBottom, 100);

    try {
      const response = await fetch(`${API_URL}/chat`, {
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
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 font-sans">
      
      {/* --- JANELA DO CHAT (Só aparece se isOpen for true) --- */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[380px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-fade-in-up">
            
            {/* Cabeçalho do Widget */}
            <div className="bg-green-700 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    {/* Avatar da Sellia */}
                    <div className="w-8 h-8 rounded-full bg-white text-green-700 flex items-center justify-center font-bold text-sm">
                        S
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Sellia</h3>
                        <p className="text-xs text-green-100 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                        </p>
                    </div>
                </div>
                <button onClick={toggleChat} className="text-white hover:text-green-200 transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            {/* Área de Mensagens */}
            <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-gray-50 scroll-smooth"
            >
                {/* Mensagem de Boas-vindas Inicial */}
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 text-sm mt-10">
                        <p>Olá! Eu sou a Sellia. 👋</p>
                        <p>Como posso te ajudar hoje?</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                <div 
                    key={index} 
                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
                >
                    <div className={`
                    max-w-[85%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap shadow-sm
                    ${msg.role === 'user' 
                        ? 'bg-green-600 text-white rounded-tr-none' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}
                    `}>
                    {msg.content}
                    </div>
                </div>
                ))}
                
                {loading && (
                    <div className="flex justify-start mb-2">
                        <div className="bg-gray-200 text-gray-500 px-3 py-1.5 rounded-2xl rounded-tl-none text-xs animate-pulse">
                        Sellia está digitando...
                        </div>
                    </div>
                )}
            </div>

            {/* Área de Input */}
            <form onSubmit={handleSubmit} className='p-3 bg-white border-t border-gray-100 flex gap-2'>
                <input 
                    placeholder='Digite sua dúvida...' 
                    className='flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-green-500 text-gray-700' 
                    type="text" 
                    value={input} 
                    onChange={({ target }) => setInput(target.value)} 
                />
                <button 
                    disabled={loading}
                    className='bg-green-700 text-white p-2 rounded-full hover:bg-green-800 transition-all disabled:bg-gray-300 flex items-center justify-center w-10 h-10 shadow-sm'
                    type="submit"
                >
                    <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
            </form>
        </div>
      )}

      {/* --- BOTÃO FLUTUANTE (FAB) --- */}
      <button 
        onClick={toggleChat}
        className={`
            w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110
            ${isOpen ? 'bg-gray-500 rotate-90' : 'bg-green-600 hover:bg-green-700 animate-bounce-gentle'}
        `}
      >
        {isOpen ? (
            // Ícone X (Fechar)
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
            // Ícone Chat (Abrir)
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>

    </div>
  )
}

export default Chat