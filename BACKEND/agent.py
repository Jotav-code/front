# Cria a lore do bot e acessa a key
import os
import sys

# força terminal a aceitar UTF-8, caso a ia use algum emoji
sys.stdout.reconfigure(encoding='utf-8')

os.environ["LLM_PROVIDER"] = "google"
os.environ["MODEL_NAME"] = "gemini-2.0-flash" 
os.environ["GOOGLE_API_KEY"] = "chave"

from mangaba import Agent, Task, Crew

def consultar_ia(pergunta_cliente, texto_catalogo, historico):
    
    # agente
    vendedor = Agent(
        role="atendente virtual especialista",
        goal="vender produtos usando o catalogo e manter coerencia na conversa.",
        backstory="Você e um vendedor útil. Se não tiver o produto, avise. Use o histórico para lembrar do que foi falado.",
        verbose=True 
    )

    # tarefa
    tarefa = Task(
        description=f"""
        CONTEXTO ANTERIOR (MEMÓRIA):
        ---
        {historico}
        ---

        CATÁLOGO ATUAL:
        ---
        {texto_catalogo}
        ---

        CLIENTE PERGUNTOU: '{pergunta_cliente}'

        responda sugerindo o produto e preço.
        """,
        expected_output="resposta curta, mas carismatica e que solucione a problematica.",
        agent=vendedor
    )

    # executa
    equipe = Crew(agents=[vendedor], tasks=[tarefa], verbose=True)
    resultado = equipe.kickoff()

    return str(resultado)

# agente do dashboard
def gerar_insights_ia(dados_historico):
    analista = Agent(
        role="Especialista em BI",
        goal="Gerar relatorios de vendas a partir de logs.",
        backstory="Você analisa dados sobre estoque, analisa o pefil de clientes e o perfil de procura.",
        verbose=True
    )

    tarefa = Task(
        description=f"""
        ANALISE ESTES DADOS:
        {dados_historico}
        ---
        Gere um relatório com: Produtos mais buscados e Oportunidades perdidas, e outros dados interessantes para o vendedor.
        """,
        expected_output="Relatório Markdown.",
        agent=analista
    )

    #executa
    equipe = Crew(agents=[analista], tasks=[tarefa], verbose=True)
    return str(equipe.kickoff())
