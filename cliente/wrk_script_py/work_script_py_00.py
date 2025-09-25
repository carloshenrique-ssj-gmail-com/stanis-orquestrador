import os
import sys
import time
import pythoncom
from bk_scripts import BackupArquivos
import subprocess
import instalar_bibliotecas_requeridas as ibr
import uuid
import unicodedata
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

########################################################################################################################################

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

def executa_script_python(arquivo='', py_exe=None):
    if arquivo == '':
        return

    if py_exe is None or py_exe == '' or py_exe == 'None' or os.path.isfile(py_exe) == False:
        return 'FALHA: NÃO RECEBEU O EXECUTAVEL DO PYTHON PARA UTILIZAR NA EXECUÇÃO - CONTATE O DESENVOLVEDOR'


    if not os.path.isfile(arquivo):
        return 'FALHA: Arquivo não encontrado'

    if str(str(arquivo)[-2:]).lower() != 'py':
        return 'FALHA: Não é um script Python'

    try:
        BackupArquivos().bk_arquivo(arquivo)
    except:
        pass
    
    pythoncom.CoInitialize() 

    cmd = f'"{py_exe}" "{arquivo}"'
    uuid_str = str(uuid.uuid4())
    arquivo_temp_terminal = f'output_script_py_{uuid_str}.txt'
    arquivo_temp_terminal = os.path.join(os.environ['TEMP'],arquivo_temp_terminal)
    
    # ------------------------------
    # ------------------------------
    # CRIANDO A VARIAVEL DE AMBIENTE
    lista_variaveis_ambiente = vlt.rl.variaveis_ambiente_tarefa(v_hash=vlt.n_tok,v_tar=vlt.n_tar)
    env = os.environ.copy()
    if lista_variaveis_ambiente:
        if len(lista_variaveis_ambiente) > 0:
            va = VariaveisAmbiente()
            lista_variaveis_ambiente = va.retornar_variaveis_script(lista_variaveis_ambiente,vlt.n_cva)
            env = os.environ.copy()
            env.update(lista_variaveis_ambiente)
            time.sleep(3)
    # ------------------------------
    # ------------------------------
    try:
        with open(arquivo_temp_terminal, 'w') as f:
            processo = subprocess.run(cmd, stdout=f, stderr=subprocess.STDOUT, shell=True, universal_newlines=True, env=env)

        if not processo.returncode == 0:
            print("Falha no script Python executado.")    
            with open(arquivo_temp_terminal, 'r') as f:
                arq_terminal = f.read()
                if arq_terminal:
                    msg_terminal = str(arq_terminal)
                    msg_terminal = sanitizar_texto_para_utf8(arq_terminal)
                    return f'FALHA: {str(msg_terminal)}'
                else:
                    return 'FALHA: NÃO FOI POSSIVEL IDENTIFICAR O LOG DO ERRO NO SCRIPT.'
                
        return 'SUCESSO'
    except subprocess.CalledProcessError as e:
        return 'FALHA: ERRO DESCONHECIDO.'
    finally:
        if os.path.exists(arquivo_temp_terminal):
            try:
                os.remove(arquivo_temp_terminal)
            except:
                pass


###################################### MOVER ARQUIVOS DA LISTA PARA A PASTA CORRESPONDENTE ########################################
def executa_tarefa():

    _tarefa = vlt.n_tar
    _origem = vlt.n_ori

    if _tarefa != None and _origem != None:

            vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='0', id_tar=_tarefa, cd_resultado='0',descricao='',tempo='')
            vlt.rl.log_pid_tarefa(v_hash=vlt.n_tok, v_tar=vlt.n_tar, v_pid=str(os.getpid()))
            t_ini = time.time()
            print(f'Tarefa: {_tarefa}',end='\r')
            executavel_python = ExecutavelPython().localizar()
            try:
                print('Verificando arquivo requirements.txt')
                ibr.instalar_requerimentos(_origem, executavel_python)
            except:
                pass
            resultado = executa_script_python(arquivo=_origem, py_exe = executavel_python)
            print(f'Terminou tarefa: {_tarefa}',end='\r')
            t_fim = time.time() - t_ini
            t_fim_tab = time.strftime("%H:%M:%S",time.gmtime(t_fim))
            if resultado == 'SUCESSO':
                vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='1',descricao='',tempo=t_fim_tab)
            else:
                vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='2',descricao=str(resultado).replace('\\','/'),tempo=t_fim_tab)           

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
            time.sleep(340)
        else:
            for i, par in enumerate(dado_tarefa):
                dado_tarefa[i] = str(par).replace('¥',' ')    
            
            time.sleep(2)
                         
            vlt = VariaveisLocaisTarefas()
            vlt.n_tok = dado_tarefa[1] # 
            vlt.n_tar = dado_tarefa[2] #
            vlt.n_srv = dado_tarefa[3] #
            vlt.n_aca = dado_tarefa[4]
            vlt.n_ori = dado_tarefa[5]
            vlt.n_des = dado_tarefa[6]
            vlt.n_ini = dado_tarefa[7]
            vlt.n_ext = dado_tarefa[8]
            vlt.n_cha = dado_tarefa[9] #
            vlt.n_cva = dado_tarefa[10] # chave key variaveis ambiente
            vlt.rl = InteracaoAPIStanis()
            executa_tarefa()
    except Exception as e:
        print(e)
        time.sleep(5)
