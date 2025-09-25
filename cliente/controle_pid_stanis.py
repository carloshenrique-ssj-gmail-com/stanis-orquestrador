import http.client
import json
from time import sleep
import os
import psutil

class ControlePIDs:
    def __init__(self,token):
        self.v_hash = token
        self.pid_derrubar = '/pid_derrubar'
        self.resultado_pid_derrubar = '/resultado_pid_derrubar'
        self.pids_ativos = '/pids_ativos'
        self.host_api = os.environ['HOST_STANIS_SERV']

    def __obj_conexao_api(self,dados,tipo):
        try:
            json_data = json.dumps(dados)
            headers = {'Content-Type': 'application/json','Content-Length': len(json_data)}
            conn = http.client.HTTPConnection(self.host_api, 5010)

            if tipo == 0:
                conn.request('POST', self.pid_derrubar, body=json_data, headers=headers)
            elif tipo == 1:
                conn.request('POST', self.resultado_pid_derrubar, body=json_data, headers=headers)
            elif tipo == 2:
                conn.request('POST', self.pids_ativos, body=json_data, headers=headers)
            retorno = conn.getresponse()
            status = retorno.status
            dados_retorno = retorno.read().decode('utf-8')
            conn.close()
            sleep(2)
            if dados_retorno != '' and not dados_retorno is None:
                dados_retorno = json.loads(dados_retorno) 
                return status, dados_retorno
            else:
                dados_retorno = ''
                return status, dados_retorno 
        except Exception as e:
            os.system('cls')
            print(f'ERRO NA CHAMADA DA API: {e}')
            sleep(10)
            try:
                conn.close()
            except:
                pass
            return False, str(e)

    def __listar_pids_maquina(self):
        lista_pids = ''
        try:
            processos = psutil.process_iter(['pid', 'name'])
            for processo in processos:
                if lista_pids == '':
                    lista_pids = str(processo.info["pid"])
                else:
                    lista_pids += f',{str(processo.info["pid"])}'

            return lista_pids
        except Exception as e:
            print(f"Ocorreu um erro: {e}")
            sleep(15)
            return None

    def __finalizar_tarefa_por_pid(self,pid):
        try:
            list_pid_num = []
            list_pid = str(pid).split('|')
            for n in list_pid:
                if not n is None and n != '':
                    list_pid_num.append(int(n))
            if len(list_pid_num) <= 0:
                return None, None
        except:
            return None, None
        try:
            for v_pid in list_pid_num:
                if psutil.pid_exists(v_pid):
                    processo = psutil.Process(v_pid)
                    if processo.is_running():
                        try:
                            processo.terminate()
                        except psutil.NoSuchProcess:
                            processo.kill()
                        processo.wait(timeout=5)
                        if not processo.is_running():
                            v1 = '1'
                            v2 = 'O comando para encerrar a tarefa obteve sucesso.'
                        else:
                            v1 = '3'
                            v2 = 'Falha ao tentar encerrar a tarefa na maquina.'
                    else:
                        v1 = '2'
                        v2 = 'A tarefa não foi localizada na maquina.'
                else:
                    v1 = '2'
                    v2 = 'A tarefa não está ativa.'
        except Exception as e:
            v1 = '9'
            v2 = f'Erro ao tentar encerrar a tarefa: {str(e)}'

        return v1, v2

    # BUSCAR PID PARA DERRUBAR
    def __busca_pid_derrubar(self):
        
        try:
            data = {'hash_maquina': self.v_hash}
            status, dados = self.__obj_conexao_api(data,0)

            if status == 200:
                print(f'SUCESSO NA CHAMADA DA API: {str(dados)}')
                if str(dados['resultado']) == 'SUCESSO':
                    return True, str(dados['id_tarefa']), str(dados['pid']) 
                else:
                    return False, 'NENHUMA TAREFA PARA DERRUBAR', None
            elif status == 403 or status == 204:
                print('NENHUMA TAREFA PARA DERRUBAR')
                return False, None, None
            else:
                os.system('cls')
                print('-'*100)
                print(f'HOUVE UMA FALHA NA CHAMADA DA API CONTROLE DE PID: {str(dados)}')
                sleep(60)
                return False, None, None

        except Exception as e:
            os.system('cls')
            print(f"ERRO CRITICO NA CHAMADA DA API CONTROLE DE PID __busca_pid_derrubar: {str(e)}.")
            sleep(5)
            return False, None, None



    def __registra_resultado_pid_derrubar(self, v_tar, v_resultado, v_descricao):
        if v_tar == None or v_tar == '':
            return False
        if v_resultado == None or v_resultado == '':
            return False     
        if v_descricao is None:
            v_descricao = ''
        try:

            data = {
                'hash_maquina': self.v_hash,
                'tarefa': v_tar,
                'resultado': v_resultado,
                'descricao': v_descricao
            }
            status, dados = self.__obj_conexao_api(data,1)
            if status == 200:
                print(f'SUCESSO NA CHAMADA DA API')
                sleep(2)
                return True
            else:
                os.system('cls')
                print(f'HOUVE UMA FALHA NA CHAMADA DA API CONTROLE DE PID: {str(dados)}')
                sleep(60)

        except Exception as e:
            os.system('cls')
            print(f"ERRO ESTRUTURAL NA TENTATIVA DE REGISTRO NA API CONTROLE PID : {str(e)}.")
            sleep(60)


    



    # FUNÇÕES A SER CHAMADAS
    def informa_pids_ativos(self):
        if self.v_hash == None or self.v_hash == '':
            return        
         
        lista = self.__listar_pids_maquina()

        if not lista is None and lista != '':
            try:
                data = {'hash_maquina': self.v_hash,
                        'lista_pid':lista}
            
                status, dados = self.__obj_conexao_api(data,2)

                if status == 200:
                    print(f'SUCESSO NA CHAMADA DA API: {str(dados)}')
                    sleep(2)
                else:
                    os.system('cls')
                    print('-'*100)
                    print(f'HOUVE UMA FALHA NA CHAMADA DA API CONTROLE DE PID informa_pids_ativos: {str(dados)}')
                    sleep(60)

            except Exception as e:
                os.system('cls')
                print(f"ERRO ESTRUTURAL NA TENTATIVA DE REGISTRO NA API CONTROLE DE PID informa_pids_ativos: {str(e)}.")
                sleep(60)      


    def derrubar_pid(self):
        if self.v_hash == None or self.v_hash == '':
            return    
                
        v0, v1, v2 = self.__busca_pid_derrubar()
        if v0 == True:
            r0, r1 = self.__finalizar_tarefa_por_pid(v2)
            if r0:
                self.__registra_resultado_pid_derrubar(v_tar=v1,v_resultado=r0,v_descricao=r1)

