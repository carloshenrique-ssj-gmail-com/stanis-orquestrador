import os
import sys
import time
import pythoncom
from bk_scripts import BackupArquivos
import subprocess
import unicodedata
import uuid
from requests_api_stanis import InteracaoAPIStanis

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

def remove_msgbox_vbs(script_vbs_original=''):
    if script_vbs_original == '' or script_vbs_original == None:
        return None

    arquivo_saida_temp_vbs = os.path.dirname(script_vbs_original)
    arquivo_saida_temp_vbs = os.path.join(arquivo_saida_temp_vbs,f'{str(os.path.basename(script_vbs_original))[:-4]}_executando.vbs')
    remover_palavras = ["MsgBox", "InputBox"]
    try:
        with open(script_vbs_original, "r") as input_file:
            lines = input_file.readlines()

        filtered_lines = [line for line in lines if not any(word in line for word in remover_palavras)]

        with open(arquivo_saida_temp_vbs, "w") as output_file:
            output_file.writelines(filtered_lines)
        return arquivo_saida_temp_vbs
    except FileNotFoundError:
        print(f"Arquivo VBS '{script_vbs_original}' não encontrado.")
        return None
    except Exception as e:
        print(f"Erro ao processar o arquivo VBS: {e}")
        return None


def execute_vbs_script(endereco_script_vbs=''):
    if endereco_script_vbs == '' or endereco_script_vbs == None:
        return 'FALHA: Erro na chamada do serviço.'


    if not os.path.isfile(endereco_script_vbs):
        return 'FALHA: Arquivo não encontrado'

    if str(endereco_script_vbs)[-3:].lower() != 'vbs':
        return 'FALHA: Não é um script VBS'

    try:
        BackupArquivos().bk_arquivo(endereco_script_vbs)
    except:
        pass

    endereco_script_vbs = remove_msgbox_vbs(endereco_script_vbs)

    if endereco_script_vbs == None:
        return 'FALHA: Erro ao tentar converter o arquivo.'

    pythoncom.CoInitialize() 

    try:

        cmd = ['cscript.exe',endereco_script_vbs]

        arquivo_saida_temp_vbs = os.path.dirname(endereco_script_vbs)
        nome_arquivo_saida_temp_vbs = f"{str(uuid.uuid4())}.txt"
        arquivo_saida_temp_vbs = os.path.join(arquivo_saida_temp_vbs,nome_arquivo_saida_temp_vbs)

        with open(arquivo_saida_temp_vbs, "w", encoding='latin-1') as arq_saida_terminal:
            processo = subprocess.Popen(cmd, stderr=arq_saida_terminal)
            if not processo.pid is None:
                vlt.rl.log_pid_tarefa(v_hash=vlt.n_tok, v_tar=vlt.n_tar, v_pid=str(processo.pid))


        _, erro = processo.communicate()
        
        if processo.returncode == 0:
            print('TERMINOU COM SUCESSO')
        else:
            print('FALHOU O SCRIPT VBS')

        msg_terminal = ''
        with open(arquivo_saida_temp_vbs, "r", encoding='latin-1') as ff:
            conteudo_arquivo = ff.read()
            if conteudo_arquivo:
                msg_terminal = str(conteudo_arquivo)
                msg_terminal = sanitizar_texto_para_utf8(conteudo_arquivo)         

        try:
            os.remove(arquivo_saida_temp_vbs)
        except:
            pass

        try:
            os.remove(endereco_script_vbs)
        except:
            pass

        if len(msg_terminal) == 0 or msg_terminal == '' or msg_terminal == None or msg_terminal == False:
            return 'SUCESSO'
        else:
            print('Erro na execução do script VBS: ',str(conteudo_arquivo))
            msg = f'FALHA: Erro ao executar o script: {str(conteudo_arquivo)}'
            return msg
    except subprocess.CalledProcessError as e:
        print(f"Erro ao executar o script VBS: {e}")
        msg = f'FALHA: Erro no processamento do script: {str(e)}'
        return msg        
    except Exception as e:
        print("Erro: ", e)
        msg = f'FALHA: Erro de processamento: {str(e)}'
        return msg


###################################### MOVER ARQUIVOS DA LISTA PARA A PASTA CORRESPONDENTE ########################################
def executa_tarefa():

    _tarefa = vlt.n_tar
    _origem = vlt.n_ori

    if _tarefa != None and _origem != None:

            vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='0', id_tar=_tarefa, cd_resultado='0',descricao='',tempo='')
            t_ini = time.time()
            print(f'Tarefa: {_tarefa}',end='\r')
            resultado = execute_vbs_script(endereco_script_vbs=_origem)
            print(f'Terminou tarefa: {_tarefa}',end='\r')
            t_fim = time.time() - t_ini
            t_fim_tab = time.strftime("%H:%M:%S",time.gmtime(t_fim))
            if resultado == 'SUCESSO':
                vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='1',descricao='',tempo=t_fim_tab)
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
            time.sleep(5)
        else:
            for i, par in enumerate(dado_tarefa):
                dado_tarefa[i] = str(par).replace('¥',' ')              
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
            vlt.n_cva = dado_tarefa[10] # chave key variaveis ambiente não utilizada neste contexto
            vlt.rl = InteracaoAPIStanis()
            executa_tarefa()
    except Exception as e:
        print(e)
        time.sleep(5)