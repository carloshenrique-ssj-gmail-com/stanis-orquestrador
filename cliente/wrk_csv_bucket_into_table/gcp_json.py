import json
from google.oauth2 import service_account
from requests_api_stanis import InteracaoAPIStanis

class Json_GCP:
    def __init__(self):
        pass

    def obter_credenciais_gcp(self,token,tarefa,json_aut):

        if json_aut is not None:
            return json_aut
        if token == '' or tarefa == '':
            return None
        if token is None or tarefa is None:
            return None

                
        rl = InteracaoAPIStanis()
        dados_json = rl.json_gcp(v_hash=token, id_tar=tarefa)
        informacoes = json.loads(str(dados_json))
        credenciais = service_account.Credentials.from_service_account_info(informacoes)
        
        return credenciais
