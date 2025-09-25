import http.client
import json
from time import sleep
import time
import socket
import base64
import binascii
from cryptography.fernet import Fernet
import os


class InteracaoAPIStanis:
    def __init__(self):
        self.url_reg = '/registro'
        self.url_reg_arq = '/registro_arquivos'
        self.url_json_gcp = '/json_auth_gcp'
        self.url_chave = '/chave_maquina_pw'
        self.log_pid = '/log_pid'
        self.variaveis_ambiente = '/variaveis_script'
        self.registro_mft = '/registro_mft'
        self.chave_arquivo_mft = '/chave_arquivo_mft'
        self.host_api = os.environ['HOST_STANIS_SERV']

    def __testa_conexao_rede(self):
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

    def __obj_conexao_api(self,dados,tipo):
        try:
            json_data = json.dumps(dados)
            headers = {'Content-Type': 'application/json','Content-Length': len(json_data)}
            self.__testa_conexao_rede()
            conn = http.client.HTTPConnection(self.host_api, 5010)

            if tipo == 0:
                conn.request('POST', self.url_reg, body=json_data, headers=headers)
            elif tipo == 1:
                conn.request('POST', self.url_reg_arq, body=json_data, headers=headers)
            elif tipo == 2:
                conn.request('POST', self.url_json_gcp, body=json_data, headers=headers)
            elif tipo == 3:
                conn.request('POST', self.url_chave, body=json_data, headers=headers)
            elif tipo == 4:
                conn.request('POST', self.log_pid, body=json_data, headers=headers)
            elif tipo == 5:
                conn.request('POST', self.variaveis_ambiente, body=json_data, headers=headers)
            elif tipo == 6:
                conn.request('POST', self.registro_mft, body=json_data, headers=headers)                
            elif tipo == 7:
                conn.request('POST', self.chave_arquivo_mft, body=json_data, headers=headers)  
                                
            retorno =  conn.getresponse()
            status = retorno.status
            dados_retorno = retorno.read().decode('utf-8')
            conn.close()
            sleep(3)
            if dados_retorno != '':
               dados_retorno = json.loads(dados_retorno) 
            return status, dados_retorno
        except Exception as e:
            print(f'ERRO AO TENTAR CHAMAR A API: {e}')
            try:
                conn.close()
            except:
                pass
            return False, str(e)

    def __desembaralhar_texto(self, chave, texto):
        dec = []
        texto = base64.urlsafe_b64decode(texto).decode()
        for i in range(len(texto)):
            key_c = chave[i % len(chave)]
            dec_c = chr((256 + ord(texto[i]) - ord(key_c)) % 256)
            dec.append(dec_c)
        return "".join(dec)


    def __descriptografar(self, chave_maquina_stanis,texto):
        try:
            chave_stanis_bin = binascii.unhexlify(chave_maquina_stanis)
            chave_stanis_bin = base64.urlsafe_b64encode(chave_stanis_bin)
            algoritimo = Fernet(chave_stanis_bin)
            texto_descriptografado = algoritimo.decrypt(texto)
            return True, texto_descriptografado
        except Exception as e:
            return False, f'ERRO: {str(e)}'

    def registra_log_tarefa(self, v_hash, soltar_tarefa='1',id_tar=None, cd_resultado='',descricao='',tempo=''):
        if id_tar == None or cd_resultado == '':
            return False
        
        while True:

            try:
                data = {
                     'hash_maquina': v_hash
                    ,'soltar_tarefa': soltar_tarefa
                    ,'numero_tarefa': id_tar
                    ,'codigo_resultado': cd_resultado
                    ,'tempo_execucao': tempo
                    ,'descricao': descricao
                }
                status, dados = self.__obj_conexao_api(data,0)
                if status == 200:
                    print(f'SUCESSO AO REGISTRAR O LOG DA TAREFA NA API: {str(dados)}')
                    sleep(2)
                    return True
                else:
                    print(f'HOUVE UMA FALHA NA TENTATIVA DE REGISTRAR O LOG DA TAREFA NA API: {str(dados)}')
                    sleep(60)

            except Exception as e:
                print(f"ERRO ESTRUTURAL NA TENTATIVA DE REGISTRO NA API DE LOG: {str(e)}.\nNova tentativa em 120 segundos.")

            sleep(120)


    def registra_log_transf_arquivo(self, v_hash, id_tar, tp_servico, endereco_arq,acao):
        if v_hash == None or v_hash == '':
            return False
        if id_tar == None or id_tar == '':
            return False
        if tp_servico == None or tp_servico == '':
            return False        
        if endereco_arq == None or endereco_arq == '':
            return False  
        
        while True:
            try:
                data = {
                    'hash_maquina': v_hash
                    ,'tarefa': id_tar
                    ,'tipo_servico': tp_servico
                    ,'endereco_arq': endereco_arq
                    ,'acao': acao
                }
                status, dados = self.__obj_conexao_api(data,1)
                if status == 200:
                    print(f'SUCESSO AO REGISTRAR O ARQUIVO TRANSFERIDO NA API: {str(dados)}')
                    return True
                else:
                    print(f'HOUVE UMA FALHA AO TENTAR REGISTRAR NA API O ARQUIVO TRANSFERIDO: {str(dados)}')

            except Exception as e:
                print(f"ERRO ESTRUTURAL NA TENTATIVA DE REGISTRO NA API DE LOG TRANSFERENCIA ARQUIVO: {str(e)}.\nNova tentativa em 120 segundos.")
            sleep(120)            



    def json_gcp(self, v_hash, id_tar):
        if v_hash == None or v_hash == '':
            return False
        if id_tar == None or id_tar == '':
            return False
        
        while True:
            try:
                data = {
                    'hash_maquina': v_hash
                    ,'tarefa': id_tar
                }
                status, dados = self.__obj_conexao_api(data,2)
                if status == 200:
                    print(f'SUCESSO NA AO OBTER OS DADOS PARA CONEXAO COM A GCP ATRAVES DA API')
                    dados = self.__desembaralhar_texto(v_hash,dados)
                    dados = str(dados).replace(r"\r\n","").replace(r'\\n',r'\n').replace("'",'').replace('(','').replace(')','')
                    return str(str(dados)[1:])[:-1]
                else:
                    print(f'HOUVE UMA FALHA AO TENTAR OBTER OS DADOS DE CONEXAO COM A GCP ATRAVES DA API: {str(dados)}')

            except Exception as e:
                print(f"ERRO ESTRUTURAL NA TENTATIVA DE CHAMADA DA API DE JSON GCP: {str(e)}.\nNova tentativa em 120 segundos.")
            sleep(120)    


    def chave_pw(self, v_hash, v_texto):
        if v_hash == None or v_hash == '':
            return False
        
        while True:
            try:
                data = {
                    'hash_maquina': v_hash
                }
                status, dados = self.__obj_conexao_api(data,3)
                if status == 200:
                    print(f'SUCESSO AO OBTER A CHAVE DE SEGURANCA DAS SENHAS LOCAIS ATRAVES DA API')
                    resultado, dados_saida = self.__descriptografar(dados['chave'], v_texto)

                    if resultado == True:
                        return str(dados_saida.decode('utf-8'))
                    else:
                        print(f'ERRO NA TENTATIVA DE ABRIR O DADO PROTEGIDO COM A CHAVE RECEBIDA DA API: {dados_saida}')
                        return False
                else:
                    print(f'HOUVE UMA FALHA NA CHAMADA DA API PARA OBTER A CHAVE DAS SENHAS LOCAIS: {str(dados)}')

            except Exception as e:
                print(f"ERRO ESTRUTURAL NA TENTATIVA DE OBTER CHAVE DE SENHAS LOCAIS ATRAVES DA API: {str(e)}.\nNova tentativa em 120 segundos.")
                
            sleep(120)           


    def log_pid_tarefa(self, v_hash, v_tar, v_pid):
        if v_hash == None or v_hash == '':
            return False
        if v_tar == None or v_tar == '':
            return False
        if v_pid == None or v_pid == '':
            return False        

        while True:
            try:
                data = {
                    'hash_maquina': v_hash,
                    'tarefa': v_tar,
                    'tarefa_pid': v_pid
                }
                status, dados = self.__obj_conexao_api(data,4)
                if status == 200:
                    print(f'SUCESSO AO REGISTRAR O PID DA TAREFA EXECUTADA ATRAVES DA API')
                    return True
                else:
                    print(f'HOUVE UMA FALHA NA TENTATIVA DE REGISTRAR O PID DA TAREFA ATRAVES DA API: {str(dados)}')

            except Exception as e:
                print(f"ERRO ESTRUTURAL NA TENTATIVA DE REGISTRO DO PID NA API: {str(e)}.\nNova tentativa em 60 segundos.")
                
            sleep(120)        



    def variaveis_ambiente_tarefa(self, v_hash, v_tar):
        if v_hash == None or v_hash == '':
            return False
        if v_tar == None or v_tar == '':
            return False
    

        while True:
            try:
                data = {
                    'hash_maquina': v_hash,
                    'tarefa': v_tar
                }
                status, dados = self.__obj_conexao_api(data,5)
                if status == 200:
                    print(f'SUCESSO AO OBTER VARIAVEIS DE AMBIENTE PARA O SCRIPT ATRAVES DA API')
                    return dados
                elif status == 204:
                    print('SUCESSO NA VALIDACAO DAS VARIAVEIS DE AMBIENTE NECESSARIA PARA A TAREFA ATRAVES DA API')
                    return {}
                else:
                    print(f'HOUVE UMA FALHA AO TENTAR VALIDAR AS VARIAVEIS DE AMBIENTE ESPERADAS PARA ESTE SCRIPT PELA API: {str(dados)}')

            except Exception as e:
                print(f"ERRO ESTRUTURAL NA CHAMADA DA API VARIAVEIS DE AMBIENTE PARA A TAREFA: {str(e)}.\nNova tentativa em 120 segundos.")
                
            sleep(120)


    def registra_log_mft_transf_arquivo(self, v_hash=None, id_tar=None, dados_arquivo=None,identificador_mft=None):
        if v_hash == None or v_hash == '':
            print('FALHA: A CHAMADA DA API NÃO ENVIOU O HASH DE IDENTIFICAÇÃO DA MAQUINA')
            return False
        if id_tar == None or id_tar == '':
            print('FALHA: A CHAMADA DA API NÃO ENVIOU O NUMERO DA TAREFA')
            return False      
        if dados_arquivo == None or dados_arquivo == '':
            print('FALHA: A CHAMADA DA API NÃO ENVIOU OS DADOS DO ARQUIVO')
            return False       
        if identificador_mft == None or identificador_mft == '':
            print('FALHA: A CHAMADA DA API NÃO ENVIOU OS DADOS DO ARQUIVO')
            return False                                      

        if not isinstance(dados_arquivo, dict) or not dados_arquivo:
            print('FALHA: A CHAMADA DA API TENTOU ENVIAR OS DADOS DO ARQUIVO EM FORMATO DIFERENTE DO DICIONARIO ESPERADO')
            return False

        while True:
            try:
                data = {
                     'hash_maquina': v_hash
                    ,'numero_tarefa': id_tar
                    ,'dados_arquivo': dados_arquivo
                    ,'identificador_mft': identificador_mft
                }
                status, dados = self.__obj_conexao_api(data,6)
                if status == 200:
                    print(f'SUCESSO AO REGISTRAR O ARQUIVO TRANSFERIDO PARA MFT NA API: {str(dados)}')
                    return True
                else:
                    print(f'HOUVE UMA FALHA AO TENTAR REGISTRAR NA API DE CONTROLE MFT DO ARQUIVO TRANSFERIDO: {str(dados)}')

            except Exception as e:
                print(f"ERRO ESTRUTURAL NA TENTATIVA DE REGISTRO NA API DE CONTROLE MFT DE LOG TRANSFERENCIA ARQUIVO: {str(e)}.\nNova tentativa em 120 segundos.")
            sleep(120)               
            
    def solicita_chave_arquivo_mft(self, v_hash, id_tar):
        if v_hash == None or v_hash == '':
            return False
        if id_tar == None or id_tar == '':
            return False      

        while True:
            try:
                data = {
                     'hash_maquina': v_hash
                    ,'numero_tarefa': id_tar
                }
                status, dados = self.__obj_conexao_api(data,7)
                if status == 200:
                    print(f'SUCESSO AO OBTER A CHAVE PARA USAR NO NOME DO ARQUIVO A SER TRANSFERIDO PARA MFT NA API')
                    return dados
                else:
                    print(f'HOUVE UMA FALHA AO TENTAR OBTER A CHAVE PARA USAR NO NOME DO ARQUIVO A SER TRANSFERIDO PARA MFT NA API: {str(dados)}')

            except Exception as e:
                print(f"ERRO ESTRUTURAL NA TENTATIVA DE OBTER A CHAVE PARA USAR NO NOME DO ARQUIVO A SER TRANSFERIDO PARA MFT NA API: {str(e)}.\nNova tentativa em 120 segundos.")
            sleep(120)                