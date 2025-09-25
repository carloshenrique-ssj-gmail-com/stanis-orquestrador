import os
from google.cloud import bigquery
from time import sleep
from gcp_json import Json_GCP
from requests_api_stanis import InteracaoAPIStanis

json_gcp = Json_GCP()

def tenta_registra_falha_procedure(texto_erro,v_hash,v_tar,proxy_x=None,porta_x=None):

    request_api_stanis = InteracaoAPIStanis()
    ___usr = str(request_api_stanis.chave_pw(v_hash,os.environ['STANIS_LU']))
    ___pwd = str(request_api_stanis.chave_pw(v_hash,os.environ['STANIS_LP']))

    os.environ["http_proxy"] = f'http://{___usr}:{___pwd}@{proxy_x}:{porta_x}'
    os.environ["https_proxy"] = f'http://{___usr}:{___pwd}@{proxy_x}:{porta_x}'
    os.environ["no_proxy"] = "localhost,127.0.0.1"

    if texto_erro == '' or texto_erro == None:
        return
    if v_hash == '' or v_hash == None:
        return  
    if v_tar == '' or v_tar == None:
        return          

    try:
        n_char_ini = (str(texto_erro).find('File:') + 6)
        if n_char_ini >= 0:
            parte2 = str(texto_erro)[n_char_ini:]
            parte3 = str(parte2).find(' ')
            if parte3 >= 0:
                parte4 = str(parte2)[:parte3]
                parte5 = str(parte4).replace('gs://ps-atlas-dl-finan-20220615_staging/','')
                caminho = str(parte5).replace(os.path.basename(parte5),'')
                arquivo = os.path.basename(parte5)

                if caminho != '' and caminho != None:
                    if arquivo != '' and arquivo != None:
                        LOCAL_JSON = json_gcp.criar_arquivo_json_temp(v_hash,v_tar,'')
                        with bigquery.Client.from_service_account_json(LOCAL_JSON) as bq:
                            try:
                                json_gcp.remover_temp_json(LOCAL_JSON)
                                sql = f"""
                                UPDATE `ps-atlas-dl-finan-20220615.PRD00FINANCEIRO.CONTROLE_PASTA_IN` 
                                SET status_arquivo = 'ERRO' 
                                WHERE nome_arquivo = '{arquivo}' 
                                AND local_bucket =  '{caminho}' 
                                AND status_arquivo IS NULL"""
                                sql = str(sql).replace('\n','')
                                bq.query(sql).result()
                                return ''
                            except Exception as e:
                                print('ERRO NA TENTATIVA DE FAZER UM UPDATE NA TABELA CONTROLE_PASTA_IN:')
                                print(str(e))
                                print(sql)
                                sleep(120) 
                                return ''
                                
    except Exception as e:
        print('ERRO NA TENTATIVA DE FAZER UM UPDATE NA TABELA controle_pasta_in:')
        print(str(e))
        sleep(120)     
        return ''   
