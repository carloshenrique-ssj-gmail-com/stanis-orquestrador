import os
import sys
import time
from bk_scripts import BackupArquivos
import instalar_bibliotecas_requeridas as ibr
import re
import unicodedata
import importlib.util
from requests_api_stanis import InteracaoAPIStanis
from open_va import VariaveisAmbiente
from localizador_python import ExecutavelPython


class VariaveisLocaisTarefas:
    def __init__(self):
        self.n_tok = None 
        self.n_tar = None
        self.n_srv = None
        self.n_aca = None
        self.n_ori = None
        self.n_des = None
        self.n_ini = None
        self.n_ext = None
        self.n_cha = None
        self.n_cva = None
        self.rl = None
        self.LOCAL_JSON = None


def sanitizar_texto_para_utf8(texto):
    if texto is None:
        return None

    texto_norm = unicodedata.normalize("NFKC", texto)

    def permitido(c: str) -> bool:
        cat = unicodedata.category(c)
        return cat[0] in ("L", "N", "P") or cat == "Zs" or c in ("\n", "\r", "\t")

    novo = "".join(c if permitido(c) else " " for c in texto_norm)
    novo = novo.replace("'", " ")
    novo = novo.replace("\\", "/")
    novo = str(novo)[:9999]
    return novo.strip()

def transformar_texto(texto=''):
    if texto == '':
        return ''
    elif texto == None:
        return None
    
    texto_transformado = re.sub(r'[^a-zA-Z0-9]', '_', texto, re.IGNORECASE)
    return texto_transformado


def setar_variaveis_ambiente(dict_variaveis_ambiente):
    if dict_variaveis_ambiente == '' or dict_variaveis_ambiente is None:
        return
    if len(dict_variaveis_ambiente) == 0:
        return
    
    try:
        for chave, valor in dict_variaveis_ambiente.items():
            os.environ[chave] = valor    
    except Exception as e:
        print(f'ERRO AO TENTAR SETAR VARIAVEIS DE AMBIENTE: {str(e)}')
        

def exec_func_remota_python(caminho_arquivo_python='',variavel_nome_funcao=''):
    if caminho_arquivo_python == '' or variavel_nome_funcao == '':
        return 'FALHA: Falta parametros'
    if caminho_arquivo_python == None or variavel_nome_funcao == None:
        return 'FALHA: Falta parametros'   
    if not os.path.exists(caminho_arquivo_python):
        return 'FALHA: Arquivo não localizado'      
    if not os.path.isfile(caminho_arquivo_python):
        return 'FALHA: Arquivo não localizado'  
    if not str(str(caminho_arquivo_python)[-3:]).lower() == '.py':
        return 'FALHA: Não é um arquivo Python' 

    nome_arquivo = str(transformar_texto(str(os.path.basename(caminho_arquivo_python))))[:-3]


    try:
        spec = importlib.util.spec_from_file_location(nome_arquivo, caminho_arquivo_python)
        arquivo_python_remoto = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(arquivo_python_remoto)
    except Exception as e:
        msg = f"FALHA: Não foi possível tentar setar o arquivo: {str(e)}"
        return msg

       
    try:
        funcao_dinamica = getattr(arquivo_python_remoto, variavel_nome_funcao)
    except Exception as e:
        msg = f"FALHA: Não foi localizado a função: {str(e)}"
        return msg
    
    try:
        BackupArquivos().bk_arquivo(caminho_arquivo_python)
    except:
        pass

    # ------------------------------
    # ------------------------------
    # CRIANDO A VARIAVEL DE AMBIENTE   
    lista_variaveis_ambiente = vlt.rl.variaveis_ambiente_tarefa(v_hash=vlt.n_tok,v_tar=vlt.n_tar)
    if lista_variaveis_ambiente:
        if len(lista_variaveis_ambiente) > 0:
            va = VariaveisAmbiente()
            lista_variaveis_ambiente = va.retornar_variaveis_script(lista_variaveis_ambiente,vlt.n_cva)
            if len(lista_variaveis_ambiente) > 0:
                try:
                    for chave, valor in lista_variaveis_ambiente.items():
                        os.environ[chave] = valor    
                except Exception as e:
                    print(f'ERRO AO TENTAR SETAR VARIAVEIS DE AMBIENTE: {str(e)}')
                time.sleep(3)
    # ------------------------------
    # ------------------------------

    try:
        resultado = funcao_dinamica()
        print(resultado)
        if resultado == True:
            return 'SUCESSO'
        else:
            return 'Condição não satisfeita'
    except Exception as e:
        msg = f"FALHA: {str(e)}"
        return msg


###################################### MOVER ARQUIVOS DA LISTA PARA A PASTA CORRESPONDENTE ########################################
def executa_tarefa():

    _tarefa = vlt.n_tar
    _origem = vlt.n_ori
    _funcao = vlt.n_des

    if _tarefa != None and _origem != None:

            vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='0', id_tar=_tarefa, cd_resultado='0',descricao='',tempo='')
            vlt.rl.log_pid_tarefa(v_hash=vlt.n_tok, v_tar=vlt.n_tar, v_pid=str(os.getpid()))
            t_ini = time.time()
            print(f'Tarefa: {_tarefa}',end='\r')
            executavel_python = ExecutavelPython().localizar()
            try:
                ibr.instalar_requerimentos(_origem,executavel_python)
                print('Terminou o teste de bibliotecas, segue a execução do script.')
            except:
                pass
            resultado = exec_func_remota_python(caminho_arquivo_python=_origem,variavel_nome_funcao=_funcao)
            print(f'Terminou tarefa: {_tarefa}',end='\r')
            t_fim = time.time() - t_ini
            t_fim_tab = time.strftime("%H:%M:%S",time.gmtime(t_fim))
            if resultado == 'SUCESSO':
                vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='1',descricao='',tempo=t_fim_tab)
            elif resultado == 'Condição não satisfeita':
                vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='4',descricao=str(resultado),tempo=t_fim_tab)                       
            else:
                resultado = sanitizar_texto_para_utf8(resultado)
                vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='2',descricao=resultado,tempo=t_fim_tab)           

    else:

        try:
            t_fim = time.time() - t_ini
            t_fim_tab = time.strftime("%H:%M:%S",time.gmtime(t_fim))
        except:
            t_fim_tab = '00:00:00'

        vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='2',descricao='Falha no processo!',tempo=t_fim_tab)


####################################################### EXECUTA #####################################################
      
if __name__ == '__main__':
    dado_tarefa = sys.argv

    try:

        if len(dado_tarefa) != 11:
            for i, par in enumerate(dado_tarefa):
                print(f'parametro: {str(i)} = {str(par)}')
            print(f'ERRO NOS PARAMETROS ENVIADOS: {len(dado_tarefa)}')
            time.sleep(60)
        else:
            for i, par in enumerate(dado_tarefa):
                dado_tarefa[i] = str(par).replace('¥',' ')              
            vlt = VariaveisLocaisTarefas()
            vlt.n_tok = dado_tarefa[1]
            vlt.n_tar = dado_tarefa[2]
            vlt.n_srv = dado_tarefa[3]
            vlt.n_aca = dado_tarefa[4]
            vlt.n_ori = dado_tarefa[5]
            vlt.n_des = dado_tarefa[6]
            vlt.n_ini = dado_tarefa[7]
            vlt.n_ext = dado_tarefa[8]
            vlt.n_cha = dado_tarefa[9]
            vlt.n_cva = dado_tarefa[10] # chave key variaveis ambiente não utilizada neste contexto
            vlt.rl = InteracaoAPIStanis()
            executa_tarefa()

    except Exception as e:
        print(e)
        time.sleep(60)
