import React, { useState, useEffect, useRef } from 'react';

// Função auxiliar para gerar ID único (Privacidade)
const gerarIdUnico = () => {
  return 'user_' + Math.random().toString(36).substr(2, 9);
};

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para abrir/fechar o widget
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Estado do ID do usuário (Recupera do localStorage ou cria novo)
  const [userId] = useState(() => {
    const salvo = localStorage.getItem("chat_user_id");
    return salvo || gerarIdUnico();
  });

  const messagesContainerRef = useRef(null);
  const isFirstLoad = useRef(true);

  // URL da API (Ajuste conforme necessário: localhost ou render)
  const API_URL = "https://cylok-a.onrender.com"; 

  // Salva o ID no navegador para persistência
  useEffect(() => {
    localStorage.setItem("chat_user_id", userId);
  }, [userId]);

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
        // CORREÇÃO PRIVACIDADE: Envia o user_id na URL
        const response = await fetch(`${API_URL}/historico?user_id=${userId}`);
        const data = await response.json(); 
        const textoDoHistorico = data.historico || ""; 
        const historicoFormatado = processarHistoricoDoServidor(textoDoHistorico);
        setMessages(historicoFormatado);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      }
    }
    // Só busca se tiver um userId definido
    if (userId) {
        fetchHistorico();
    }
  }, [userId]);

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
        // CORREÇÃO PRIVACIDADE: Envia o user_id no corpo da requisição
        body: JSON.stringify({ 
            mensagem: input,
            user_id: userId 
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', content: data.resposta }]);
      
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: "Erro ao conectar com o servidor." }]);
    } finally {
      setLoading(false);
    }
  }

  // Função auxiliar para renderizar Negrito (*texto*)
  // Ajustada para pegar **texto** que é o padrão do Gemini
  const formatMessage = (text) => {
    if (!text) return "";
    
    // Divide o texto onde encontrar ** (captura o conteúdo junto)
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove os ** e renderiza em negrito
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      // Retorna o texto normal
      return part;
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 font-sans">
      
      {/* --- JANELA DO CHAT (Só aparece se isOpen for true) --- */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[380px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-fade-in-up">
            
            {/* Cabeçalho do Widget - Verde Escuro (#15803d) */}
            <div className="bg-[#15803d] p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    {/* Avatar da Sellia */}
                    <div className="w-8 h-8 rounded-full bg-white text-[#15803d] flex items-center justify-center font-bold text-sm">
                        S
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Sellia</h3>
                        <p className="text-xs text-[#dcfce7] flex items-center gap-1">
                            <span className="w-2 h-2 bg-[#4ade80] rounded-full animate-pulse"></span> Online
                        </p>
                    </div>
                </div>
                <button onClick={toggleChat} className="text-white hover:text-[#bbf7d0] transition">
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
                        ? 'bg-[#16a34a] text-white rounded-tr-none' // Verde Claro Hex (#16a34a)
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}
                    `}>
                    {/* Aqui aplicamos o formatador */}
                    {formatMessage(msg.content)}
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
                    className='flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#22c55e] text-gray-700' 
                    type="text" 
                    value={input} 
                    onChange={({ target }) => setInput(target.value)} 
                />
                <button 
                    disabled={loading}
                    className='bg-[#15803d] text-white p-2 rounded-full hover:bg-[#166534] transition-all disabled:bg-gray-300 flex items-center justify-center w-10 h-10 shadow-sm'
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
            ${isOpen ? 'bg-gray-500 rotate-90' : 'bg-[#16a34a] hover:bg-[#15803d] animate-bounce-gentle'}
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

export default Chat;