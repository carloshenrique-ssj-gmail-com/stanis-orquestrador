import subprocess
import os
import sys
from time import sleep

def valida_biblioteca_instalada(nome_biblioteca, python_exec):
    if python_exec is None:
        python_exec = sys.executable

    cmd = [
        python_exec,
        "-c",
        (
            "import importlib.metadata as md; "
            f"md.version({nome_biblioteca!r})"
        ),
    ]

    proc = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
    )
    return proc.returncode == 0

def verifica_versao_biblioteca(nome_biblioteca, versao_biblioteca, python_exec):
    if python_exec is None:
        python_exec = sys.executable

    cmd = [
        python_exec,
        "-c",
        (
            "import importlib.metadata as md; "
            f"versao = md.version({nome_biblioteca!r}); "
            "print(versao)"
        ),
    ]

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=True
        )
        installed_version = result.stdout.strip()
    except subprocess.CalledProcessError:
        return False

    return installed_version == versao_biblioteca

def install_biblioteca(biblioteca,executavel_python):
    try:
        print('Tentando instalar a biblioteca pelo comando:',comando_cmd)
        comando_cmd = f'"{executavel_python}" -m pip install --proxy http://prxwg.portoseguro.brasil:3128 {biblioteca}'
        subprocess.check_call(comando_cmd)
        return True
    except subprocess.CalledProcessError:
        return False


def requerimentos(biblioteca,local_executavel_python):
    if biblioteca is None or str(biblioteca).strip() == '':
        return None, None
    
    _biblioteca = str(biblioteca).split('==')
    nome_biblioteca = str(_biblioteca[0])
    
    if len(_biblioteca) > 1:
        versao = str(_biblioteca[1])
    else:
        versao = None


    if valida_biblioteca_instalada(nome_biblioteca,local_executavel_python):
        print(f"A biblioteca '{nome_biblioteca}' está instalada.")
        if not versao is None: 
            if verifica_versao_biblioteca(nome_biblioteca, versao, local_executavel_python):
                print(f"A biblioteca '{nome_biblioteca}' está na versão desejada ({versao}).")
                return True, ''
            else:
                print(f"A biblioteca '{nome_biblioteca}' está instalada, mas não na versão desejada.")
                return True, f'A biblioteca solicitada {nome_biblioteca}=={versao} existe na maquina em outra versão.'
        else:
            return True, ''
    else:
        print(f"A biblioteca '{nome_biblioteca}' não está instalada.")
        if install_biblioteca(biblioteca,local_executavel_python) == True:
            return True, ''
        else:
            return False, f'Não foi possível instalar a biblioteca {biblioteca}. Tente a instalação manualmente.'        



def instalar_requerimentos(arquivo_py,local_executavel_python):
    if arquivo_py is None and arquivo_py != '':
        print('Nenhum arquivo de requerimentos localizado')
        return ''

    if os.path.exists(arquivo_py):
        if os.path.isfile(arquivo_py):
            if str(arquivo_py).lower().endswith('requirements.txt'):
                
                with open(arquivo_py, 'r', encoding='utf-8') as f:
                    dados_arquivo = f.read()
                linhas = dados_arquivo.split('\n')
                
                respostas = ''
                for linha in linhas:
                    if str(linha) != '' and str(linha) != 'None': 
                        instalado, texto_retorno = requerimentos(linha, local_executavel_python)
                        if str(texto_retorno) != '':
                            respostas += f'{str(texto_retorno)}\n'
                
                if respostas != '':
                    log_requirements = str(arquivo_py).replace(str(os.path.basename(arquivo_py)),'log_install_requirements.txt')
                    try:
                        with open(log_requirements,'w',encoding='utf-8-sig') as f:
                            f.writelines(respostas)
                    except Exception as e:
                        print('ERRO AO TENTAR GERAR LOG DE FALHAS NA INSTALAÇÃO DE BIBLIOTECAS')
                        print(str(e))    
                        sleep(60)
                print('Fim da validação de requerimentos.')
        