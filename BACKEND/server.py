from fastapi import FastAPI, UploadFile, File, HTTPException # cria o servidor e define tipos de dados
from fastapi.middleware.cors import CORSMiddleware # libera o acesso para o Front não ser bloqueado
from pydantic import BaseModel # certeza que o json enviado pelo chat tenha os campos certos
import shutil #mover arquivos - upload
import os # comandos do sistema - criar pastas, essas coisas
import sys # configs do sistema Python
import glob # buca arquivos em pastas 
from datetime import datetime # hora exata para o banco de dados
import sqlite3 # db local

# --- IMPORTS ---
# traz a ia e o leitor de arquivos
from agent import consultar_ia, gerar_insights_ia
from until import carregar_dados_como_txt

app = FastAPI()

# --- CORS ---
# O "*" todos os acessos. O ideal seria o domínio do site, mas vai serv
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"], # Libera GET, POST, DELETE, etc.
    allow_headers=["*"],
)

# --- MODELO DE DADOS ---
# O Front tem que mandar um JSON com mensagem e id
class ChatRequest(BaseModel):
    mensagem: str 
    user_id: str = "anonimo"

# --- ORGANIZAÇÃO DE PASTAS ---
PASTA_UPLOADS = "uploads" # Onde fica o catálogo (Excel/CSV)
PASTA_LOGS = "logs"       # Onde ficam os históricos em TXT

# cria pastas automaticamente se elas nao existirem
os.makedirs(PASTA_UPLOADS, exist_ok=True)
os.makedirs(PASTA_LOGS, exist_ok=True) 

# --- BD ---
NOME_BANCO = "banco_de_dados.db"

def iniciar_banco():
   #roda assim que inciar, se os arquivos nao existirem ele cria
    try:
        conn = sqlite3.connect(NOME_BANCO) # conecta o arquivo .db
        cursor = conn.cursor()

        # cria a tabela para guardar as conversas
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS respostas_chat (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                pergunta TEXT,
                resposta TEXT,
                timestamp TEXT
            );
        """)
        conn.commit() # salva a estrutura
        conn.close()  # fecha a conexao
    except Exception as e:
        print(f"Erro ao iniciar banco SQLite: {e}")

# executa a criacao do banco
iniciar_banco()

# --- FUNÇOES AUXILIARES ---

def salvar_resposta_local(pergunta: str, resposta: str, user_id: str):

    #salva os logs
    arquivo = os.path.join(PASTA_LOGS, f"historico_{user_id}.txt")
    try:
        with open(arquivo, "a", encoding="utf-8") as f:
            f.write(f"Pergunta: {pergunta}\n")
            f.write(f"Resposta: {resposta}\n")
            f.write("-" * 20 + "\n") # separador visual
    except Exception as e:
        print(f"Erro ao salvar local: {e}")

    #envia para o banco de dados
def enviar_para_banco_sql(pergunta: str, resposta: str, user_id: str):
    try:
        conn = sqlite3.connect(NOME_BANCO)
        cursor = conn.cursor()

        # insere a nova linha na tabela
        cursor.execute("INSERT INTO respostas_chat (user_id, pergunta, resposta, timestamp) VALUES (?, ?, ?, ?)", 
                      (user_id, pergunta, resposta, str(datetime.now())))
        conn.commit()
        conn.close()
    except Exception as e:
        print("Erro ao salvar no SQLite:", e)

def carregar_historico_sql(user_id):
    #memoria do chat, le as ultimas 10 mensagens
    try:
        conn = sqlite3.connect(NOME_BANCO)
        cursor = conn.cursor()
        
        # Pega as ultimas 10
        cursor.execute("""
            SELECT pergunta, resposta 
            FROM respostas_chat 
            WHERE user_id = ? 
            ORDER BY id DESC 
            LIMIT 10
        """, (user_id,))
        
        dados = cursor.fetchall()
        conn.close()
        
        if not dados: return "" # se nao falou nada antes, retorna vazio

        # inverte a lista para ficar na ordem passado -> presente
        memoria_formatada = "HISTÓRICO DE CONVERSA:\n"
        for pergunta, resposta in reversed(dados):
            memoria_formatada += f"Cliente: {pergunta}\nAgente: {resposta}\n----------------\n"
            
        return memoria_formatada

    except Exception as e:
        print(f"Erro memória: {e}")
        return ""


# --- ENDPOINTS ---

@app.get("/")
def home():
    """Rota de teste para ver se o servidor está vivo."""
    return {"status": "Servidor ON (SQLite + Logs Organizados)"}

@app.post("/upload")
async def upload_catalogo(file: UploadFile = File(...)):
    """
    Rota de Upload.
    Recebe o arquivo (Excel/CSV) e salva na pasta 'uploads'.
    É a base de conhecimento do vendedor.
    """
    try:
        caminho_arquivo = os.path.join(PASTA_UPLOADS, file.filename)

        # Copia do buffer da memória para o disco rígido
        with open(caminho_arquivo, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {"mensagem": f"arquivo {file.filename} recebido com sucesso!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"erro ao salvar arquivo: {str(e)}")

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    O CÉREBRO.
    1. Lê o catálogo.
    2. Lê a memória do banco.
    3. Chama a IA.
    4. Salva a resposta no Banco e no TXT.
    """
    try:
        # 1. Carrega dados do produto (RAG)
        texto_catalogo = carregar_dados_como_txt()
        if "ERRO" in texto_catalogo:
            return {"resposta": texto_catalogo}
        
        # 2. Carrega memória do usuário (Contexto)
        historico = carregar_historico_sql(request.user_id)

        # 3. Chama o Agente Inteligente (Mangaba/Gemini)
        resposta_ia = consultar_ia(request.mensagem, texto_catalogo, historico)

        # 4. Salva o resultado (Persistência)
        salvar_resposta_local(request.mensagem, resposta_ia, request.user_id)
        enviar_para_banco_sql(request.mensagem, resposta_ia, request.user_id)
        
        return {"resposta": resposta_ia}

    except Exception as e:
        print(f"Erro no chat: {e}") # Mostra erro no terminal para debug
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/historico")
async def get_historico(user_id: str = "anonimo"):

    try:
        # Caminho exato do arquivo deste usuário
        caminho_arquivo = os.path.join(PASTA_LOGS, f"historico_{user_id}.txt")
        
        # Verifica se existe antes de tentar ler
        if not os.path.exists(caminho_arquivo):
            return {"historico": ""} # Retorna vazio se for novo usuário
            
        with open(caminho_arquivo, "r", encoding="utf-8") as file:
            dados = file.read()
        
        return {"historico": dados}
        
    except Exception as e:
        # Não trava o sistema, só retorna vazio se der erro
        return {"historico": ""}

@app.get("/insights")
async def get_insights():
    """Lê todos os logs e pede para a IA analisar padrões (Agente Analista)."""
    try:
        dados = ""
        # Busca apenas dentro da pasta LOGS
        padrao = os.path.join(PASTA_LOGS, "historico_*.txt")
        arquivos = glob.glob(padrao)
        
        for f in arquivos:
            with open(f, "r", encoding="utf-8") as file:
                dados += file.read()
        
        if not dados: return {"relatorio": "Sem dados."}
        
        # Chama o segundo agente (Analista)
        relatorio = gerar_insights_ia(dados)
        return {"relatorio": relatorio}
    except: return {"erro": "Falha insights"}

