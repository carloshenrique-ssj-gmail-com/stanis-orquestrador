import os
import time
from win32com import client
import win32process
import pythoncom
import sys
import unicodedata
from bk_scripts import BackupArquivos
from requests_api_stanis import InteracaoAPIStanis
from cls_limpeza_excel import DerrubarExcelVazio
from cls_monitor_vba_erro import VBAMonitorErro

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

def pegar_excel_pid(xl):
    """Retorna o número do pid para o Excel aberto."""
    try:
        hwnd = xl.Hwnd
        _, pid = win32process.GetWindowThreadProcessId(hwnd)
        return pid
    except:
        return None

def teste_somente_leiturta(endereco_completo:str = ''):
    try:
        with open(endereco_completo, "r+b"):
            pass
        return True, None
    except PermissionError:
        return False, "O ARQUIVO ESTÁ EM MODO SOMENTE LEITURA."
    except Exception as e:
        msg = f'O SISTEMA NÃO CONSEGUIU TESTAR SE O ARQUIVO ESTÁ EM MODO SOMENTE LEITURA: {str(e)}'
        return False, msg


def executa_excel_vba(endereco_completo='',nome_da_macro=''):
    pythoncom.CoInitialize()
    if endereco_completo == '':
        return 'FALHA: NENHUM DADO FOI ENVIADO'

    if nome_da_macro == '':
        return 'FALHA: NÃO FOI ENVIADO O NOME DA MACRO'

    if not os.path.exists(endereco_completo):
        return 'FALHA: ARQUIVO NÃO LOCALIZADO'

    if str(str(endereco_completo)[-4:]).lower() not in ('xlsm','xlsb'):
        return 'FALHA: NÃO É UM ARQUIVO XLSM'

    somente_leitura, msg = teste_somente_leiturta(endereco_completo)
    if somente_leitura == False:
        return f'FALHA: {msg}'
    
    try:
        try:
            BackupArquivos().bk_arquivo(endereco_completo)
        except:
            pass
        
        xl = client.DispatchEx("Excel.Application")
        numero_pid_identificado = pegar_excel_pid(xl)
        # depois de instanciar verifica os pids
        if numero_pid_identificado:
            numero_pid_identificado = f'{str(os.getpid())}|{numero_pid_identificado}'
            vlt.rl.log_pid_tarefa(v_hash=vlt.n_tok, v_tar=vlt.n_tar, v_pid=numero_pid_identificado)
        else:
            print('Não foi possível obter o PID do processo.')  


        wb = xl.Workbooks.Open(
            os.path.abspath(endereco_completo),
            ReadOnly=False,
            IgnoreReadOnlyRecommended=False
        )
        xl.Visible = True
        xl.DisplayAlerts = False
        xl.Interactive = False  
        xl.EnableEvents = False 
            
        wb.DoNotPromptForConvert = True
        wb.CheckCompatibility = False
        
        nome_arquivo = os.path.basename(endereco_completo)
        chamada = f"{nome_arquivo}!{nome_da_macro}"
        time.sleep(10)

        thread_monitor_erros_vba = VBAMonitorErro(intervalo=3)
        thread_monitor_erros_vba.start()        
        
        try:
            xl.Application.Run(chamada)
        except:
            xl.Application.Run(nome_da_macro)

        wb.Save()
        wb.Close(False)
        xl.Application.Quit() 
        del xl
        del wb
        return 'SUCESSO'
    except Exception as e1:
        try:
            wb.Close(False)
            xl.Application.Quit()
            msg_erro = f"|{str(thread_monitor_erros_vba.mensagem_erro_identificada)}" if thread_monitor_erros_vba.erro_encontrado == True else ''
            return f'FALHA: {str(e1)}{msg_erro}'
        except Exception as e2:
            msg_erro = f"|{str(thread_monitor_erros_vba.mensagem_erro_identificada)}" if thread_monitor_erros_vba.erro_encontrado == True else ''
            return f'FALHA: {str(e2)}{msg_erro}'
    finally:
        thread_monitor_erros_vba.encerrar = True
        thread_monitor_erros_vba.join()
        derrubar_excel_vazio = DerrubarExcelVazio()
        derrubar_excel_vazio.procurar_excels_fechar()


###################################### MOVER ARQUIVOS DA LISTA PARA A PASTA CORRESPONDENTE ########################################
def executa_tarefa():

    _tarefa = vlt.n_tar
    _origem = str(vlt.n_ori).replace('\t','')
    _destino = str(vlt.n_des)
    
    if _tarefa != None and _origem != None:

            vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='0', id_tar=_tarefa, cd_resultado='0',descricao='',tempo='')
            print(f'Tarefa: {_tarefa}',end='\r')
            t_ini = time.time()
            resultado = executa_excel_vba(endereco_completo=_origem,nome_da_macro=_destino)
            t_fim = time.time() - t_ini
            print(f'Terminou tarefa: {_tarefa}',end='\r')
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