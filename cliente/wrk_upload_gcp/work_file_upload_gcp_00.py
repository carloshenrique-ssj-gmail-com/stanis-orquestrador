import os
import time
import sys
from google.cloud import storage, bigquery # pip install google-cloud-storage
from datetime import datetime
import re
import unicodedata
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

def registra_tbl_bq_up(origem_arq='',destino_arq=''):
    if destino_arq == '' or origem_arq == '':
        return 'A CHAMADA DA FUNÇÃO ESTÁ INCOMPLETA!'

    if os.path.exists(origem_arq) == True:
        dt_c_arq = str(os.path.getctime(origem_arq))
        dt_c_arq = str(datetime.fromtimestamp(float(dt_c_arq)))
        dt_m_arq = str(os.path.getmtime(origem_arq))
        dt_m_arq = str(datetime.fromtimestamp(float(dt_m_arq)))
        tamnho_arq = str(os.path.getsize(origem_arq))
    
    nome_arquivo = str(os.path.basename(origem_arq)).lower()
    end_dest_arq = str(destino_arq).replace(os.path.basename(destino_arq),'').replace('\\','/')
    
    

    vlt.AUT_GCP = json_gcp.obter_credenciais_gcp(vlt.n_tok,vlt.n_tar,vlt.AUT_GCP)
    with bigquery.Client(credentials=vlt.AUT_GCP) as bq:
        try:
            sql = f"""
            DELETE FROM `ps-atlas-dl-finan-20220615.PRD00FINANCEIRO.CONTROLE_PASTA_IN` 
            WHERE nome_arquivo = '{nome_arquivo}' 
            AND local_bucket =  '{end_dest_arq}'"""
            sql = str(sql).replace('\n','')
            bq.query(sql).result()


            sql = f"""
            INSERT INTO `ps-atlas-dl-finan-20220615.PRD00FINANCEIRO.CONTROLE_PASTA_IN` (nome_arquivo,dt_criacao_arquivo,dt_ult_alt_arquivo,local_bucket,data_entrada,size_file) 
            VALUES (
                '{nome_arquivo}'
                ,'{dt_c_arq}'
                ,'{dt_m_arq}'
                ,'{end_dest_arq}'
                ,CURRENT_DATETIME("UTC-3")
                ,'{tamnho_arq}'
            )"""
        
            sql = str(sql).replace('\n','')
            bq.query(sql).result()
            
            return '00'
        except Exception as e:
            return f'99-FALHA: {str(e)}'


def listar_dir_gcp(destino):
    try:
        vlt.AUT_GCP = json_gcp.obter_credenciais_gcp(vlt.n_tok,vlt.n_tar,vlt.AUT_GCP)
        storage_cliente = storage.Client(credentials=vlt.AUT_GCP)

        if not destino[-1:] == '/':
            destino += '/'

        __itens = storage_cliente.list_blobs(bucket_or_name='ps-atlas-dl-finan-20220615_staging'
                                            ,prefix=destino
                                            ,delimiter='/')
        lista_diretorios = []
        for _item in __itens:
            diretorio = str(_item.name).replace(os.path.basename(_item.name),'').strip()

            if diretorio[-1:] == '/':
                diretorio = diretorio[:-1]

            if str(diretorio) not in lista_diretorios:
                lista_diretorios.append(str(diretorio).lower())
                

        storage_cliente.close()
        return lista_diretorios
    except Exception as e:
        print(e)
        try:
            storage_cliente.close()
        except:
            pass
        return f'99-{str(e)}'


def envia_arquivos_gcp(origem=None,destino=None,ini_nome=None,extensao=None,n_tar=0,n_wrk=0):
    if origem == None or destino == None or ini_nome == None:
        return 'FALHA: FALTA INFORMAÇÕES PARA EXECUTAR A TRANSFERENCIA DO ARQUIVO'

    arq_dir = os.listdir(origem)
    if len(arq_dir) <= 0:
        return 'AGUARDANDO ARQUIVO'


    ini_nome = str(ini_nome).lower()
    extensao = str(extensao).lower()
    ini_nome = ini_nome.replace('*','.*')
    ini_nome = re.compile(ini_nome)    
    extensao = extensao.replace('*','.*')
    extensao = re.compile(extensao)

    diretorios_gcp = listar_dir_gcp(destino)
    if diretorios_gcp[:2] != '99':
        if str(destino).lower() not in diretorios_gcp:
            if str(destino).find('\\') >=0:
               return 'FALHA: Verifique o tipo de diretório de destino na GCP.'
    else:
        return f'FALHA: Problema no acesso a GCP: {diretorios_gcp}'

    vlt.AUT_GCP = json_gcp.obter_credenciais_gcp(vlt.n_tok,vlt.n_tar,vlt.AUT_GCP)
    storage_cliente = storage.Client(credentials=vlt.AUT_GCP)
    bucket = storage_cliente.get_bucket('ps-atlas-dl-finan-20220615_staging')


    houve_transferencia = False
    for arq in arq_dir:
        if ini_nome.match(str(str(arq)).lower()) and extensao.match(str(str(arq)[-3:]).lower()):
            try:
                orig_arq = os.path.join(origem,arq)
                dest_arq = destino
                if str(dest_arq)[-1:] == '/':
                    dest_arq += arq
                else:
                    dest_arq += '/'
                    dest_arq += arq

                endereco_arq_gcp = str(dest_arq).lower()
                blob = bucket.blob(endereco_arq_gcp)

                # PARA LIMITAR A TRANSFERENCIA EM 50MB
                blob._DEFAULT_CHUNKSIZE = (50 * 1024 * 1024) # 50MB
                blob._MAX_MULTIPART_SIZE = (50 * 1024 * 1024) # 50MB

                with open(orig_arq,'rb') as f:
                    blob.upload_from_file(f,timeout=2700) #ATÉ 45 MINUTOS DE TRANSFERENCIA
                vlt.rl.registra_log_transf_arquivo(v_hash=vlt.n_tok,id_tar=n_tar,tp_servico='2',endereco_arq=dest_arq,acao='M')

                try:
                    registra_tbl_bq_up(orig_arq,endereco_arq_gcp)
                except:
                    pass
                
                os.remove(orig_arq)
                houve_transferencia = True

            except Exception as e:
                print(e)
                if houve_transferencia == True:
                    msg = f"Falha ao tentar enviar o arquivo {str(arq).upper()} para a pasta {str(destino)}. Descrição do erro: {str(e)}, alguns arquivos podem ter sido transferidos."
                else:
                    msg = f"Falha ao tentar enviar o arquivo {str(arq).upper()} para a pasta {str(destino)}. Descrição do erro: {str(e)}"
                return msg
                
    storage_cliente.close()
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

    if _tarefa != None and _origem != None and _destino != None and _ini_arq != None and _extensao != None:
        if os.path.exists(_origem) == True:

            vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='0', id_tar=_tarefa, cd_resultado='0',descricao='',tempo='')
            vlt.rl.log_pid_tarefa(v_hash=vlt.n_tok, v_tar=vlt.n_tar, v_pid=str(os.getpid()))
            print(f'Tarefa: {_tarefa}',end='\r')
            t_ini = time.time()
            resultado = envia_arquivos_gcp(origem=_origem,destino=_destino,ini_nome=_ini_arq,extensao=_extensao,n_tar=_tarefa)
            t_fim = time.time() - t_ini
            print(f'Terminou tarefa: {_tarefa}',end='\r')
            t_fim_tab = time.strftime("%H:%M:%S",time.gmtime(t_fim))
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