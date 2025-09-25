import os
import time
import sys
import pythoncom
import re
import unicodedata
from requests_api_stanis import InteracaoAPIStanis
from ftp_sas_classe import FTPStanisSASLocal


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
        self.CLASSE_SAS = None
        self.___usr = None
        self.___pwd = None  


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

def entrega_arquivo_sas(origem=None,destino=None,ini_nome=None,extensao=None,acao=None,n_tar=0):
    pythoncom.CoInitialize()
    if origem == None or destino == None or ini_nome == None or acao == None:
        return '98-FALTA INFORMAÇÕES PARA EXECUTAR A TRANSFERENCIA DO ARQUIVO'

    ini_nome = str(ini_nome).lower()
    extensao = str(extensao).lower()
    ini_nome = ini_nome.replace('*','.*')
    ini_nome = re.compile(ini_nome)    
    extensao = extensao.replace('*','.*')
    extensao = re.compile(extensao)

    arq_dir = os.listdir(origem)
    houve_transferencia = False

    for arq in arq_dir:
        if ini_nome.match(str(str(arq)).lower()) and extensao.match(str(str(arq)[-3:]).lower()):
            try:
                
                resultado = vlt.CLASSE_SAS.adm_enviar_arquivos(dir_sas=destino,dir_local=origem,arq_local=arq,extensao=extensao,acao=acao)
                if resultado == '00':
                    houve_transferencia = True
                    try:
                        dest_arq = str(os.path.join(destino,arq))
                        dest_arq = str(dest_arq).replace('\\','/')
                        vlt.rl.registra_log_transf_arquivo(v_hash=vlt.n_tok,id_tar=n_tar,tp_servico='1',endereco_arq=dest_arq,acao=acao)
                    except:
                        pass
                    
                else:
                    if houve_transferencia == True:
                        msg = f"Falha ao tentar enviar o arquivo {str(arq).upper()} para o servidor SAS na pasta {str(destino)}. Descrição do erro: {str(resultado)}, alguns arquivos podem ter sido transferidos."
                    else:
                        msg = f"Falha ao tentar enviar o arquivo {str(arq).upper()} para o servidor SAS na pasta {str(destino)}. Descrição do erro: {str(resultado)}"
                    return msg                    

            except Exception as e:
                msg = f"Falha ao tentar enviar o arquivo {str(arq).upper()} para o servidor SAS na pasta {str(destino)}. Descrição do erro: {str(e)}"
                return msg
    
    if houve_transferencia == False:
        return 'AGUARDANDO ARQUIVO'
    else:
        return 'SUCESSO'





###################################### MOVER ARQUIVOS DA LISTA PARA A PASTA CORRESPONDENTE ########################################
def executa_tarefa():

    _tarefa = vlt.n_tar
    _origem = vlt.n_ori
    _destino = vlt.n_des
    _ini_arq = vlt.n_ini
    _extensao = vlt.n_ext
    _acao = vlt.n_aca

    if _tarefa != None and _origem != None and _destino != None and _ini_arq != None and _extensao != None and _acao != None:
        if os.path.exists(_origem):

            vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='0', id_tar=_tarefa, cd_resultado='0',descricao='',tempo='')
            vlt.rl.log_pid_tarefa(v_hash=vlt.n_tok, v_tar=vlt.n_tar, v_pid=str(os.getpid()))
            t_ini = time.time()
            resultado = entrega_arquivo_sas(origem=_origem,destino=_destino,ini_nome=_ini_arq,extensao=_extensao,acao=_acao,n_tar=_tarefa)
            print(f'Tarefa: {_tarefa}',end='\r')
            t_fim = time.time() - t_ini
            t_fim_tab = time.strftime("%H:%M:%S",time.gmtime(t_fim))
            print(f'Terminou tarefa: {_tarefa}',end='\r')
            if resultado == 'SUCESSO':
                vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='1',descricao='',tempo=t_fim_tab)
            elif resultado == 'AGUARDANDO ARQUIVO':
                vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='3',descricao='',tempo=t_fim_tab)
            else:
                resultado = sanitizar_texto_para_utf8(resultado)
                vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='2',descricao=resultado,tempo=t_fim_tab)            

        else:

            try:
                t_fim = time.time() - t_ini
                t_fim_tab = time.strftime("%H:%M:%S",time.gmtime(t_fim))
            except:
                t_fim_tab = '00:00:00'

            vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='2',descricao='Não foi possivel acessar o diretorio informado.',tempo=t_fim_tab)

        
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

            vlt.___usr = str(vlt.rl.chave_pw(vlt.n_tok,os.environ['STANIS_LUSAS']))
            vlt.___pwd = str(vlt.rl.chave_pw(vlt.n_tok,os.environ['STANIS_LPSAS']))

            vlt.CLASSE_SAS = FTPStanisSASLocal(vlt.___usr,vlt.___pwd)

            executa_tarefa()
    except Exception as e:
        print(e)
        time.sleep(60)