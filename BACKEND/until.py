import pandas as pd
import os
import glob

#cria a pasta uploads
PASTA_UPLOADS = "uploads"

#encontra os estoques enviados e considera o mais novo
def encontrar_ultimo_catalogo():
    if not os.path.exists(PASTA_UPLOADS):
        try: os.makedirs(PASTA_UPLOADS)
        except: pass
        return None
    arquivos = glob.glob(os.path.join(PASTA_UPLOADS, "*"))
    arquivos = [f for f in arquivos if os.path.isfile(f)]
    if not arquivos: return None
    return max(arquivos, key=os.path.getmtime)

#le o arquvio em csv e considera alguns separadores diferentes
def ler_csv(arquivo):
    separadores = [',', ';', '\t', '|']
    encodings = ['utf-8', 'latin1', 'cp1252']
    for enc in encodings:
        for sep in separadores:
            try:
                df = pd.read_csv(arquivo, sep=sep, encoding=enc, on_bad_lines='skip')
                if df.shape[1] > 1: return df
            except: continue 
    try: return pd.read_csv(arquivo, sep=None, engine='python', on_bad_lines='skip')
    except: return None

#transforma esses dados em txt e trata alguns erros
def carregar_dados_como_txt():
    arquivo = encontrar_ultimo_catalogo() 
    if arquivo is None: return "ERRO: Nenhum catálogo encontrado."
    nome_arquivo = arquivo.lower()
    df = None

    if nome_arquivo.endswith(".xlsx") or nome_arquivo.endswith(".xls"):
        try: df = pd.read_excel(arquivo)
        except: df = ler_csv(arquivo)
    elif nome_arquivo.endswith(".json"):
        try: df = pd.read_json(arquivo)
        except: pass
    else:
        df = ler_csv(arquivo)

    if df is None or df.empty: return "ERRO CRÍTICO: Arquivo ilegível."
    try: return df.to_markdown(index=False)
    except: return str(df)
