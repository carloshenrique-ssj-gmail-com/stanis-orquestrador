import os
import time
import sys
import win32com.client as win32
import pythoncom
import unicodedata
from bk_scripts import BackupArquivos
import valida_log_erro_sas
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
        self.LOCAL_JSON = None

global tarefa_executando
tarefa_executando = None

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

def executa_SAS(projeto_sas=''):
    pythoncom.CoInitialize()
    if str(projeto_sas) == '':
        return 'FALHA: NENHUM ARQUIVO ENCONTRADO'
    
    if str(str(projeto_sas)[-3:]).lower() != 'egp':
        return 'FALHA: O ARQUIVO INFORMADO NÃO É UM ARQUIVO DO PROJETO SAS'

    if os.path.isfile(projeto_sas) == False:
        return 'FALHA: O ARQUIVO INFORMADO NÃO FOI LOCALIZADO NO ENDEREÇO'
    
    try:
        
        try:
            BackupArquivos().bk_arquivo(projeto_sas)
        except:
            pass        

        eg = win32.Dispatch('SASEGObjectModel.Application.7.1')
        project = eg.Open(projeto_sas, "")
        project.Run()
        project.SaveAs(projeto_sas) 
        project.Close()
        return 'SUCESSO'
    except Exception as e:
        return f'FALHA-{str(e)}'


###################################### MOVER ARQUIVOS DA LISTA PARA A PASTA CORRESPONDENTE ########################################
def executa_tarefa():

    _tarefa = vlt.n_tar
    _origem = str(vlt.n_ori).replace('\t','')
    
    if _tarefa != None and _origem != None:

            vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='0', id_tar=_tarefa, cd_resultado='0',descricao='',tempo='')
            vlt.rl.log_pid_tarefa(v_hash=vlt.n_tok, v_tar=vlt.n_tar, v_pid=str(os.getpid()))
            print(f'Tarefa: {_tarefa}',end='\r')
            t_ini = time.time()
            resultado = executa_SAS(projeto_sas=_origem)
            t_fim = time.time() - t_ini
            print(f'Terminou tarefa: {_tarefa}',end='\r')
            t_fim_tab = time.strftime("%H:%M:%S",time.gmtime(t_fim))
            if resultado == 'SUCESSO':
                # tenta ler o log dentro do EGP para procurar erros.
                resultado = valida_log_erro_sas.ler_log_arq_sas(caminho_arquivo_egp=_origem)
                if resultado != 'OK':
                    resultado = sanitizar_texto_para_utf8(resultado)
                    vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='2',descricao=resultado,tempo=t_fim_tab)                 
                else:
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
            time.sleep(60)
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
        time.sleep(60)