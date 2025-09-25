from classe_ler_uri_csv import BigQueryLoader
from gcp_json import Json_GCP
from requests_api_stanis import InteracaoAPIStanis
import time
import sys
import os
import json
import unicodedata

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
        
        self.txt_bucket_dir = None  
        self.txt_ini_arq = None
        self.txt_lista_header = None
        self.txt_seperador = None

        self.txt_tabela_destino = None
        self.txt_recriar_tabela = None
        self.txt_linha_cabecalho = None
        self.txt_lista_validar_duplicidade = None

    
    def preparar_variaveis_origem(self):
        self.n_ori = str(self.n_ori).replace("'",'"')
        dicionario = json.loads(self.n_ori)
        self.txt_bucket_dir = dicionario.get('txt_bucket_dir') or ''
        self.txt_ini_arq = dicionario.get('txt_ini_arq') or ''
        self.txt_lista_header = dicionario.get('txt_lista_header') or ''
        self.txt_seperador = dicionario.get('txt_seperador') or ';'        

    def preparar_variaveis_destino(self):
        self.n_des = str(self.n_des).replace("'",'"')
        dicionario = json.loads(self.n_des)
        self.txt_tabela_destino = dicionario.get('txt_tabela_destino') or ''
        self.txt_recriar_tabela = dicionario.get('txt_recriar_tabela') or '0'
        self.txt_linha_cabecalho = dicionario.get('txt_linha_cabecalho') or '1'
        self.txt_lista_validar_duplicidade = dicionario.get('txt_lista_validar_duplicidade') or ''  
        


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


def call_read_csv_file_from_bucket(cabecalho:str,colunas_validar_duplicidade:str,dataset_id_e_tabela:str,endereco_bucket:str,inicio_arq:str, linha_cabecalho:int,delimitador:str,recriar_tabela:int):
    
    variaveis = {
        'cabecalho': cabecalho,
        'dataset_id_e_tabela': dataset_id_e_tabela,
        'endereco_bucket': endereco_bucket,
        'inicio_arq': inicio_arq,
        'linha_cabecalho': linha_cabecalho,
        'delimitador': delimitador,
        'recriar_tabela': recriar_tabela
    }
    
    for nome, valor in variaveis.items():
        if valor is None or (isinstance(valor, str) and not valor.strip()):
            return False, f"A variável '{nome}' não pode estar vazia."        

    if linha_cabecalho:
        try:
            linha_cabecalho = int(linha_cabecalho)
        except:
            return False, "A variável 'linha_cabecalho' deve ser do tipo int."
    else:
        linha_cabecalho = 1
    
    if recriar_tabela not in ('0','1'):
        return False, "A variável 'recriar_tabela' deve ser 0 ou 1."
            
    try:
        vlt.AUT_GCP = json_gcp.obter_credenciais_gcp(vlt.n_tok,vlt.n_tar,vlt.AUT_GCP)
        with BigQueryLoader(json_authentication=vlt.AUT_GCP,usuario=vlt.___usr,senha=vlt.___pwd) as loader:
            list_files_sucess = []
            list_files_failed = []
    
            while True:
                endereco_csv = loader.find_file_to_process(endereco_bucket, inicio_arq) 
            
                if str(endereco_csv) == '' or str(endereco_csv).startswith('FALHA') == True:
                    break
                else:
                    resultado = loader.load_data_from_uri_into_table(
                        uri_file=endereco_csv,
                        header=cabecalho,
                        linha_header=linha_cabecalho,
                        delimitador=delimitador,
                        dataset_id_with_table=dataset_id_e_tabela,
                        recriar_tabela=recriar_tabela,
                        colunas_validar_duplicidade=colunas_validar_duplicidade
                    )

                    if resultado == 'SUCESSO':
                        list_files_sucess.append(str(endereco_csv))
                    else:
                        msg = f"""FALHA AO TENTAR CARREGAR ARQUIVO.
                        {str(endereco_csv)}
                        {str(resultado)}"""
                        list_files_failed.append(msg)
                        break
            
            
            if len(list_files_failed) == 0 and len(list_files_sucess) > 0:
                tabela_fim = str(dataset_id_e_tabela).split('.')[-1]
                loader.record_sucess_update_table(tabela_fim)
                resultado, mensagem = 'SUCESSO', None
            elif len(list_files_failed) == 0 and len(list_files_sucess) == 0:
                resultado, mensagem = 'FALHA', 'NENHUM ARQUIVO FOI ENCONTRADO PARA PROCESSAMENTO NA CONTROLE_PASTA_IN.'
            elif endereco_csv.startswith('FALHA'):
                resultado, mensagem = 'FALHA',f'FALHA AO TENTAR OBTER O ARQUIVO PARA PROCESSAR: {str(endereco_csv)}' 
            else:
                resultado, mensagem = 'FALHA','\n'.join(list_files_failed)
            
        if len(list_files_sucess) > 0:
            for arquivo in list_files_sucess:
                texto_registro = f"{arquivo}|{dataset_id_e_tabela}"
                vlt.rl.registra_log_transf_arquivo(v_hash=vlt.n_tok,id_tar=vlt.n_tar,tp_servico='12',endereco_arq=texto_registro,acao='T')
        
        return resultado, mensagem
                                
    except Exception as e:
        return 'FALHA', f'FALHA GERADA NO SISTEMA: {str(e)}'



###################################### MOVER ARQUIVOS DA LISTA PARA A PASTA CORRESPONDENTE ########################################
def executa_tarefa():

        _tarefa = vlt.n_tar
        _origem = vlt.n_ori
        
        if _tarefa != None and _origem != None:

                vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='0', id_tar=_tarefa, cd_resultado='0',descricao='',tempo='')
                vlt.rl.log_pid_tarefa(v_hash=vlt.n_tok, v_tar=vlt.n_tar, v_pid=str(os.getpid()))
                t_ini = time.time()
                print(f'Tarefa: {_tarefa}',end='\r')
                resultado,mensagem = call_read_csv_file_from_bucket(cabecalho=vlt.txt_lista_header,
                               colunas_validar_duplicidade=vlt.txt_lista_validar_duplicidade,
                               dataset_id_e_tabela=vlt.txt_tabela_destino,
                               endereco_bucket=vlt.txt_bucket_dir,
                               inicio_arq=vlt.txt_ini_arq,
                               linha_cabecalho=vlt.txt_linha_cabecalho,
                               delimitador=vlt.txt_seperador,
                               recriar_tabela=vlt.txt_recriar_tabela)
                print(f'Terminou tarefa: {_tarefa}',end='\r')
                t_fim = time.time() - t_ini
                t_fim_tab = time.strftime("%H:%M:%S",time.gmtime(t_fim))
                if resultado == 'SUCESSO':
                    vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='1',descricao='',tempo=t_fim_tab)
                else:
                    mensagem = sanitizar_texto_para_utf8(mensagem)
                    vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='2',descricao=mensagem,tempo=t_fim_tab)      

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
            vlt.n_ori = dado_tarefa[5] # objeto dados origem
            vlt.n_des = dado_tarefa[6] # objeto dados destino
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

            vlt.preparar_variaveis_origem()
            vlt.preparar_variaveis_destino()
            executa_tarefa()
    except Exception as e:
        print(e)
        time.sleep(60)