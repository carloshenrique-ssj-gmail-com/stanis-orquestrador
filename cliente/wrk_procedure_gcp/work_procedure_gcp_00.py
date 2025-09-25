import os
import time
import sys
import unicodedata
from google.cloud import bigquery
import tenta_registrar_log_erro_procedure_gcp as trlep_gcp
from requests_api_stanis import InteracaoAPIStanis
from gcp_json import Json_GCP

json_gcp = Json_GCP()

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
        self.AUT_GCP = None
        self.___usr = None
        self.___pwd = None        


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


def executa_procedure_bq(procedimento=''):
    if procedimento == '' or procedimento == None:
        return 'A CHAMADA DA FUNÇÃO ESTÁ INCOMPLETA!'

    procedimento = str(procedimento).split('|')
    if len(procedimento) == 1:
        sql = f"CALL `{procedimento[0]}`();"
    else:
        parametros = ','.join(["'{}'".format(item) for item in procedimento[1:]])
        sql = f"CALL `{procedimento[0]}`({parametros});"    

    vlt.AUT_GCP = json_gcp.obter_credenciais_gcp(vlt.n_tok,vlt.n_tar,vlt.AUT_GCP)
    with bigquery.Client(credentials=vlt.AUT_GCP) as bq:
        try:
            time.sleep(10)
            sql = str(sql).replace('\n','')
            bq.query(sql).result()
            return 'SUCESSO'
        except Exception as e:
            # TENTA REGISTRAR NA TABELA DE CONTROLE DA PASTA IN QUE DEU ERRO PARA PROCESSAR O ARQUIVO
            trlep_gcp.tenta_registra_falha_procedure(str(e),vlt.n_tok,vlt.n_tar)
            return f'FALHA: {str(e)}'



###################################### MOVER ARQUIVOS DA LISTA PARA A PASTA CORRESPONDENTE ########################################
def executa_tarefa():

        _tarefa = vlt.n_tar
        _origem = vlt.n_ori
        
        if _tarefa != None and _origem != None:

                vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='0', id_tar=_tarefa, cd_resultado='0',descricao='',tempo='')
                vlt.rl.log_pid_tarefa(v_hash=vlt.n_tok, v_tar=vlt.n_tar, v_pid=str(os.getpid()))
                t_ini = time.time()
                print(f'Tarefa: {_tarefa}',end='\r')
                resultado = executa_procedure_bq(procedimento=_origem)
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

            vlt.___usr = str(vlt.rl.chave_pw(vlt.n_tok,os.environ['STANIS_LU']))
            vlt.___pwd = str(vlt.rl.chave_pw(vlt.n_tok,os.environ['STANIS_LP']))
            proxy_x = os.environ['proxy_x'] 
            porta_x = os.environ['porta_x']
            os.environ["http_proxy"] = f'http://{vlt.___usr}:{vlt.___pwd}@{proxy_x}:{porta_x}'
            os.environ["https_proxy"] = f'http://{vlt.___usr}:{vlt.___pwd}@{proxy_x}:{porta_x}'
            os.environ["no_proxy"] = "localhost,127.0.0.1"

            executa_tarefa()
    except Exception as e:
        print(e)
        time.sleep(60)