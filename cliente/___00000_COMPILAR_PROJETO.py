import os
import py_compile
import sys
import shutil
import datetime

diretorio = str(os.path.dirname(__file__))
novo_diretorio = 'ClientStanis'
este_script = str(os.path.basename(__file__))


os.makedirs(os.path.join(diretorio,novo_diretorio), exist_ok=True)

with open(os.path.join(diretorio,novo_diretorio,'INFORMACOES_DA_COMPILACAO.TXT'),'w',encoding='utf-8') as f:
    texto = f"A VERSÃO DO PYTHON USADA NA COMPILAÇÃO DOS ARQUIVOS DESSE PROJETO: {str(sys.version)}\nDATA DA COMPILAÇÃO: {str(datetime.datetime.today())}"
    f.write(texto)

def compilar_arquivos_pasta(origem,destino):
    os.makedirs(destino, exist_ok=True)
    for filename in os.listdir(origem):
        if filename.endswith('.py') and filename != este_script:
            arquivo_pyc = py_compile.compile(os.path.join(origem, filename))
            novo_nome_arquivo_pyc = str(os.path.basename(arquivo_pyc)).split('.')[0]
            novo_nome_arquivo_pyc += '.pyc'
            shutil.copy2(arquivo_pyc,os.path.join(destino,novo_nome_arquivo_pyc))
    print(f'CRIADO PASTA: {destino}')


for root, dirs, files in os.walk(diretorio):
    if str(root).find(novo_diretorio) >= 0 or str(root).find('__pycache__') >= 0 or str(root).find('.git') >= 0 or str(root).find('__conf_va_client') >= 0:
        continue
    
    rel_path = os.path.relpath(root, diretorio)
    if rel_path == '.':
        novo_dir = os.path.join(diretorio,novo_diretorio)
    else:
        novo_dir = os.path.join(diretorio,novo_diretorio, rel_path)
        
    compilar_arquivos_pasta(root,novo_dir)
          