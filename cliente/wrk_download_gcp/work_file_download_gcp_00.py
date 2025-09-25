import os
import time
import sys
from google.cloud import storage # pip install google-cloud-storage
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

def baixar_arquivo_gcp(origem=None,destino=None,ini_nome=None,extensao=None,n_tar=0):
    if origem == None or destino == None or ini_nome == None:
        return 'FALHA: FALTA INFORMAÇÕES PARA EXECUTAR A TRANSFERENCIA DO ARQUIVO'


    if os.path.exists(destino) == False:
        return 'FALHA: O local de destino não foi localizado.'

    try:
        houve_transferencia = False


        ini_nome = str(ini_nome).lower()
        extensao = str(extensao).lower()
        ini_nome = ini_nome.replace('*','.*')
        ini_nome = re.compile(ini_nome)    
        extensao = extensao.replace('*','.*')
        extensao = re.compile(extensao)

        if origem[-1:] == '/':
            pasta_gcp = origem
            origem = origem[:-1] 
        else:
            pasta_gcp = origem
            pasta_gcp += '/' 


        vlt.AUT_GCP = json_gcp.obter_credenciais_gcp(vlt.n_tok,vlt.n_tar,vlt.AUT_GCP)
        storage_cliente = storage.Client(credentials=vlt.AUT_GCP)
        _itens = storage_cliente.list_blobs(bucket_or_name='ps-atlas-dl-finan-20220615_staging'
                                            ,prefix=str(pasta_gcp)
                                            , delimiter="/")
        bucket = storage_cliente.get_bucket('ps-atlas-dl-finan-20220615_staging')
        for _item in _itens:
            
            diretorio = str(_item.name).lower()
            arquivo = str(os.path.basename(_item.name)).lower()
            diretorio = str(diretorio).replace(os.path.basename(diretorio),'')
            if diretorio[-1:] == '/':
                diretorio = diretorio[:-1]

            if str(destino)[-1:] == '\\':
                destino = str(destino)[:-1]

            if diretorio == origem:
                if extensao.match(str(str(arquivo)[-3:]).lower()):
                    if ini_nome.match(str(str(arquivo)).lower()):
                        blob = bucket.blob(str(_item.name))
                        nome_novo_arq = os.path.basename(str(_item.name))
                        nome_novo_arq = os.path.join(destino,nome_novo_arq)
                        blob.download_to_filename(nome_novo_arq)                        
                        blob.delete()
                        vlt.rl.registra_log_transf_arquivo(v_hash=vlt.n_tok,id_tar=n_tar,tp_servico='3',endereco_arq=nome_novo_arq,acao='M')
                        houve_transferencia=True
        
        storage_cliente.close()       


    except Exception as e:
        if houve_transferencia == True:
            msg = f"Falha ao tentar enviar o arquivo para a pasta. Descrição do erro: {str(e)}, alguns arquivos podem ter sido transferidos."
        else:
            msg = f"Falha ao tentar enviar o arquivo para a pasta. Descrição do erro: {str(e)}"
        return msg

    if houve_transferencia == False:
        return 'SEM CORRESPONDENCIA'
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
            if os.path.exists(_destino) == True:

                vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='0', id_tar=_tarefa, cd_resultado='0',descricao='',tempo='')
                vlt.rl.log_pid_tarefa(v_hash=vlt.n_tok, v_tar=vlt.n_tar, v_pid=str(os.getpid()))
                t_ini = time.time()
                print(f'Tarefa: {_tarefa}',end='\r')
                resultado = baixar_arquivo_gcp(origem=_origem,destino=_destino,ini_nome=_ini_arq,extensao=_extensao,n_tar=_tarefa)
                print(f'Terminou tarefa: {_tarefa}',end='\r')
                t_fim = time.time() - t_ini
                t_fim_tab = time.strftime("%H:%M:%S",time.gmtime(t_fim))
                if resultado == 'SUCESSO':
                    vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='1',descricao='',tempo=t_fim_tab)
                elif resultado == 'SEM CORRESPONDENCIA':
                    vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='3',descricao='',tempo=t_fim_tab)
                else:
                    resultado = sanitizar_texto_para_utf8(resultado)
                    vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='2',descricao=resultado,tempo=t_fim_tab)                              

            else:
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