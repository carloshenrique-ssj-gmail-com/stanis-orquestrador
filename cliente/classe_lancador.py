import os
import http.client
import socket
import json
from time import sleep
import time

class LancadorStanis:
    def __init__(self):
        self.token = None
        self.chave_va = None
        self.url_auth = '/login_maquina_remota_stanis'
        self.url_find = '/buscar_tarefa'
        self.host_api = os.environ['HOST_STANIS_SERV']

        self.acao = None
        self.dir_origem = None
        self.dir_destino = None
        self.extensao_arq = None
        self.id_chat = None
        self.id_tarefa = None
        self.ini_arq = None
        self.tipo_servico = None


    def testa_conexao_rede(self):
        ini = time.strftime('%Y-%m-%d %H:%M:%S')
        while True:
            ten = time.strftime('%Y-%m-%d %H:%M:%S')
            try:
                socket.gethostbyname(self.host_api)
                break
            except Exception as e:
                print(f"\rHora inicio da falha {ini}, ultima tentativa {ten} - Erro ao tentar acessar servidor da aplicação no endereço: {self.host_api} - Descrição do erro: {e} - Novo teste em 2 minutos.", end="")
                sleep(120)
        return True


    def barra_final(self,texto):
        if texto is None or texto == '' or texto == 'None':
            return ''
        
        if str(texto)[-1:] == '\\':
            return str(texto)[:-1]
        else:
            return str(texto)

    def authenticator_api(self):
        data = {'hostname': str(os.getenv('COMPUTERNAME')).upper()}
        json_data = json.dumps(data)
        headers = {'Content-Type': 'application/json','Content-Length': len(json_data)} 
        while True:
            try:
                self.testa_conexao_rede()
                conn = http.client.HTTPConnection(self.host_api, 5010)
                conn.request('POST', self.url_auth, body=json_data, headers=headers)

                response = conn.getresponse()
                response_data = response.read().decode('utf-8')

                self.token = None

                if response_data:
                    response_json = json.loads(response_data)    

                if response.status == 200:

                    self.token = response_json['token']
                    self.chave_va = response_json['chave_variaveis_ambiente']
                    if self.chave_va is None or self.chave_va == '':
                        self.chave_va = 'ND'
                    print('*** MAQUINA AUTENTICADA ***')
                    conn.close()
                    sleep(2)
                    return True
                
                elif response.status == 204:
                        self.token = None
                        print(f"AUTENTICAÇÃO DESTA MAQUINA NEGADA. \nNova tentativa em 60 segundos.")
                elif response.status == 400:
                        self.token = None
                        print(f"AUTENTICAÇÃO NEGADA, ERRO NOS PARAMETROS DE SOLICITAÇÃO: {str(response_json['mensagem'])}. \nNova tentativa em 60 segundos.")
                else:
                    self.token = None
                    print(f"ERRO - RESPOSTA API NÃO CLASSIFICADA NA CHAMADA DE AUTENTICAÇÃO: {response.status}. \nNova tentativa em 60 segundos.")

            except Exception as e:
                self.token = None
                print(f'ERRO ESTRUTURAL CHAMADA API AUTENTICAÇÃO: {str(e)}. \nNova tentativa em 60 segundos.')
            finally:
                conn.close()  
                sleep(2)  
            
            sleep(120)

    def busca_tarefa(self):
        if self.token is None:
            print('CHAMADA NA API DE BUSCA DAS TAREFAS SEM AUTENTICAÇÃO PREVIA.')
            return False

        self.acao = None
        self.dir_origem = None
        self.dir_destino = None
        self.extensao_arq = None
        self.id_chat = None
        self.id_tarefa = None
        self.ini_arq = None
        self.tipo_servico = None
        self.tempo_atualizacao = 60

        try:
            data = {'hash_maquina': self.token}
            json_data = json.dumps(data)
            headers = {'Content-Type': 'application/json',}
            self.testa_conexao_rede()
            conn = http.client.HTTPConnection(self.host_api, 5010)    
            conn.request('POST', self.url_find, body=json_data, headers=headers)    
            response = conn.getresponse() 
            response_data = response.read().decode('utf-8')
            if response_data:
                response_json = json.loads(response_data)             

            if response.status == 200:
                self.acao = str(response_json['acao'])
                self.dir_origem = self.barra_final(str(response_json['dir_origem']))
                self.dir_destino = self.barra_final(str(response_json['dir_destino']))
                self.extensao_arq = self.barra_final(str(response_json['extensao_arq']))
                self.id_chat = str(response_json['id_chat'])
                self.id_tarefa = str(response_json['id_tarefa'])
                self.ini_arq = self.barra_final(str(response_json['ini_arq']))
                self.tipo_servico = str(response_json['tipo_servico'])
                
                try:
                    self.tempo_atualizacao = int(response_json['tempo_atualizacao'])
                except:
                    self.tempo_atualizacao = 60
                    
                conn.close()
                sleep(2)
                return True
            elif response.status == 204:
                conn.close()
                sleep(2)
                return False
            elif response.status == 400:
                print(f"PESQUISA TAREFA, ERRO NOS PARAMETROS DE SOLICITAÇÃO: {str(response_json['mensagem'])}.")
                conn.close()
                sleep(2)
                return False
            else:
                print(f"ERRO - RESPOSTA API NÃO CLASSIFICADA: {str(response_json['mensagem'])}.")
                conn.close()
                sleep(2)
                return False
        except Exception as e:
            print(f'ERRO ESTRUTURAL CHAMADA API BUSCAR TAREFA: {str(e)}.')
            try:
                conn.close()
                sleep(2)
            except:
                pass
            return False