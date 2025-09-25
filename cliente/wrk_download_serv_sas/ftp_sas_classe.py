import os
from ftplib import FTP_TLS
import re
import paramiko

class FTPStanisSASLocal():
    def __init__(self,usuario_sas,senha_sas) -> None:
        self.___usr = usuario_sas
        self.___pwd = senha_sas

        if not str(os.getenv('COMPUTERNAME')).lower().startswith('psgazrv'):
            self.tipo = 0 # set ftplib
        else:
            self.tipo = 1 # set paramiko

        # configurações para conexão da classe
        if self.tipo == 0: 
            self.host = 'li4885'
            self.porta = 990
        elif self.tipo == 1: 
            self.host = 'li5426'
            self.porta = 22        

        self.arquivos = []
        self.arquivos_encontrados = []
        self.conectado = False
        self.set_pasta = False
        self.msg_erro = ''

    def _inicia_conn(self):
        """
        Esta é uma função que não deve ser utilizada externamente.
        Tem a finalidade de iniciar a conexão com o FTP para a classe.
        """
        try:
            if self.tipo == 0:
                self.ftp = FTP_TLS()
                self.ftp.connect(self.host, self.porta)
                self.ftp.login(self.___usr, self.___pwd)
                self.ftp.prot_p()
            elif self.tipo == 1:
                self.transport = paramiko.Transport((self.host, self.porta))
                self.transport.connect(username=self.___usr, password=self.___pwd)
                self.ftp = paramiko.SFTPClient.from_transport(self.transport)

            self.conectado = True
            return True
        except Exception as e:
            self.conectado = False
            print(f'Houve um erro ao tentar iniciar a conexão com o FTP: {e}')
            self.msg_erro = f'Houve um erro ao tentar iniciar a conexão com o FTP: {e}'
            return False    

    def _acessa_pasta(self,pasta):
        """
        Esta é uma função que não deve ser utilizada externamente.
        Tem a finalidade de setar a pasta no construtor da classe.
        """        
        try:
            if self.conectado == False:
                if self._inicia_conn():
                    if self.tipo == 0:
                        self.ftp.cwd(pasta)
                    elif self.tipo == 1:
                        self.ftp.chdir(pasta)
                    self.set_pasta = True
                    return True
            else:
                if self.tipo == 0:
                    self.ftp.cwd(pasta)
                elif self.tipo == 1:
                    self.ftp.chdir(pasta)
                self.set_pasta = True
                return True
        except Exception as e:
            print(f'Houve um erro ao tentar acessar a pasta solicitada: {e}')
            self.msg_erro = f'Houve um erro ao tentar acessar a pasta solicitada: {e}'
            return False                

    def _encerra_conn(self):
        """
        Esta é uma função que não deve ser utilizada externamente.
        Tem a finalidade de fechar a conexão com o FTP para a classe.
        """         
        try:
            if self.conectado == True:
                if self.tipo == 0:
                    self.ftp.quit()
                elif self.tipo == 1:
                    self.ftp.close()
                self.conectado = False
            return True
        except:
            pass

    def _lista_arquivos_pasta(self):
        """
        Esta é uma função que não deve ser utilizada externamente.
        Tem a finalidade de listar arquivos em um diretório do servidor FTP do SAS para classe.
        """        
        try:
            if self.conectado == False:
                self._inicia_conn()
            if self.set_pasta == False:
                print('ERRO: Necessário chamar uma pasta antes de usar esse comando.')
                return False
            self.arquivos.clear()
            if self.tipo == 0:
                self.arquivos = self.ftp.nlst()
            elif self.tipo == 1:
                self.arquivos = self.ftp.listdir()
            return True
        except Exception as e:
            print(f'Houve um erro ao tentar listar os arquivos: {e}')
            self.msg_erro = f'Houve um erro ao tentar listar os arquivos: {e}'
            return False            



    def _baixarArquivo(self,arq_origem_sas,arq_destino_local): 
        """
        Esta é uma função que não deve ser utilizada externamente.
        Tem a finalidade de baixar um arquivo do diretório no servidor FTP do SAS para uma pasta local.
        """                
        if arq_origem_sas == '' or arq_destino_local == '':
            return False
        
        if not os.path.exists(os.path.dirname(arq_destino_local)):
            try:
                os.mkdir(os.path.dirname(arq_destino_local))
            except:
                pass
        
        try:


            if self.tipo == 0:
                def callback(data):
                    arquivo_local.write(data)   

                with open(arq_destino_local, 'wb') as arquivo_local:
                    self.ftp.retrbinary(f'RETR {arq_origem_sas}', callback)

            elif self.tipo == 1:
                self.ftp.get(arq_origem_sas, arq_destino_local)

            print('Arquivo baixado: ', arq_origem_sas)
            
            return True
        except Exception as e:
            self.msg_erro = f'Houve um erro ao tentar baixar o arquivo: {e}'
            return False



    def _enviarArquivo(self,arquivo_origem, pasta_destino):
        """
        Esta é uma função que não deve ser utilizada externamente.
        Tem a finalidade de enviar um arquivo local para o diretório no servidor FTP do SAS.
        """           
        if arquivo_origem == '' or pasta_destino == '':
            return False
        
        if not os.path.exists(arquivo_origem):
            return False


        try:

            if self.tipo == 0:

                with open(arquivo_origem, 'rb') as arquivo_local:
                    self.ftp.storbinary(f'STOR {os.path.basename(arquivo_origem)}', arquivo_local)

            elif self.tipo == 1:
                pasta_destino = str(os.path.join(pasta_destino,os.path.basename(arquivo_origem))).replace('\\','/')
                self.ftp.put(arquivo_origem, pasta_destino)

            print('O arquivo enviado ao servidor SAS: ', arquivo_origem)
            return True
        
        except Exception as e:
            self.msg_erro = f'Falha ao tentar enviar o arquivo {arquivo_origem} para o SAS: {e}'
            return False
        

    def _deletarArquivo(self, endereco_arquivo=''):
        """
        Esta é uma função que não deve ser utilizada externamente.
        Tem a finalidade de apagar um arquivo no diretório no servidor FTP do SAS.
        """          
        if endereco_arquivo == '':
            return False
        
        pasta = str(os.path.dirname(endereco_arquivo))
        arquivo_procurado = os.path.basename(endereco_arquivo)

        try:
            if self.tipo == 0:

                self.ftp.delete(arquivo_procurado)

            elif self.tipo == 1:

                self.ftp.remove(arquivo_procurado)

            print(f'O arquivo "{endereco_arquivo}" foi removido da pasta no servidor FTP.')
            return True
        except Exception as e:
            print(f'Falha ao tentar deletar o arquivo "{arquivo_procurado}" da pasta no SAS: {e}')
            self.msg_erro = f'Falha ao tentar deletar o arquivo "{arquivo_procurado}" da pasta no SAS: {e}'
            return False



    def adm_baixar_arquivos(self,dir_sas='',dir_local='',arq_sas='',extensao='',acao='C'):
        """
        Esta é uma função usada para gerenciar a ação de baixar arquivos do diretório no servidor FTP do SAS 
        para uma pasta local. Esta função retorna o resultado da tarefa e uma lista com os arquivos baixados.
        """       
        lista_arquivos_baixados = []   
        if arq_sas == '' or dir_sas == '' or extensao == '' or dir_local == '':
            return '98-Erro de envio de parametros na chamada da função.', lista_arquivos_baixados # erro na estrutura da chamada
        if arq_sas == None or dir_sas == None or extensao == None or dir_local == None:
            return '98-Erro de envio de parametros na chamada da função.', lista_arquivos_baixados # erro na estrutura da chamada
        if acao not in ('C','M'):
            return '98-Erro de envio de parametros na chamada da função.', lista_arquivos_baixados # erro na estrutura da chamada     

        if not os.path.exists(dir_local):
            return '94-A pasta de destino não foi encontrada.', lista_arquivos_baixados           

        if str(dir_sas)[-1:] == '/':
            dir_sas = str(dir_sas)[:-1]

        padrao_regex = arq_sas.replace('*', '.*')
        padrao_nome_arq = re.compile(padrao_regex,re.IGNORECASE)
        extensao = extensao.replace('*','.*')
        extensao = re.compile(extensao,re.IGNORECASE)

        self.arquivos_encontrados.clear()

        if self._acessa_pasta(dir_sas):
            if self._lista_arquivos_pasta():
                for arquivo in self.arquivos:
                    if extensao.match(str(str(arquivo)[-3:]).lower()):
                        if padrao_nome_arq.match(arquivo):
                            self.arquivos_encontrados.append(arquivo)
                
                # se for encontrado arquivos aplicamos a instrução
                if len(self.arquivos_encontrados) > 0:
                    for arq in self.arquivos_encontrados:
                        if acao == 'C':
                            arq_sas = str(os.path.join(dir_sas,arq)).replace('\\','/')
                            arq_local = os.path.join(dir_local,arq)
                            resultado = self._baixarArquivo(arq_origem_sas=arq_sas,arq_destino_local=arq_local)
                            if resultado == False:
                                return f'96-Erro ao tentar baixar o arquivo do servidor: {str(self.msg_erro)}', lista_arquivos_baixados # falha ao tentar baixar o arquivo
                            else:
                                lista_arquivos_baixados.append(arq)
                        elif acao == 'M':
                            arq_sas = str(os.path.join(dir_sas,arq)).replace('\\','/')
                            arq_local = os.path.join(dir_local,arq)
                            resultado = self._baixarArquivo(arq_origem_sas=arq_sas,arq_destino_local=arq_local)
                            if resultado == False:
                                return f'96-Erro ao tentar baixar o arquivo do servidor: {str(self.msg_erro)}', lista_arquivos_baixados # falha ao tentar baixar o arquivo
                            else:
                                resultado = self._deletarArquivo(endereco_arquivo=arq_sas) 
                                if resultado == False:
                                    return f'97-Erro ao tentar apagar o arquivo do servidor do SAS: {str(self.msg_erro)}', lista_arquivos_baixados # sem permissão de escrita na pasta do SAS             
                                else:
                                    lista_arquivos_baixados.append(arq)
                    self._encerra_conn()
                    return '00', lista_arquivos_baixados # ação realizada com sucesso
                else:
                    self._encerra_conn()
                    return '01', lista_arquivos_baixados  # ação realizada com sucesso, mas nenhuma correspondência encontrada entre os arquivos
            else:
                self._encerra_conn()
                return '01', lista_arquivos_baixados # Não há nenhum arquivo na pasta do SAS           
        else:
            self._encerra_conn()
            return f'94-O diretório não foi localizado no servidor do SAS: {str(self.msg_erro)}', lista_arquivos_baixados # pasta não localizada no SAS



    def adm_enviar_arquivos(self,dir_sas='',dir_local='',arq_local='',extensao='',acao='C'):
        """
        Esta é uma função usada para gerenciar a ação de enviar arquivos locais para um diretório no servidor FTP do SAS.
        """          
        if arq_local == '' or dir_sas == '' or extensao == '' or dir_local == '':
            return '98-Erro de envio de parametros na chamada da função.' 
        if arq_local == None or dir_sas == None or extensao == None or dir_local == None:
            return '98-Erro de envio de parametros na chamada da função.' 
        if acao not in ('C','M'):
            return '98-Erro de envio de parametros na chamada da função.'       


        if str(dir_sas)[-1:] == '/':
            dir_sas = str(dir_sas)[:-1]
        if str(dir_local)[-1:] == '\\':
            dir_local = str(dir_local)[:-1]            

        if not os.path.exists(dir_local):
            return '94-O diretório local não foi encontrado.' # erro na estrutura da chamada

        if self._acessa_pasta(dir_sas):

            if acao == 'C':
                arq_local = str(os.path.join(dir_local,arq_local))
                resultado = self._enviarArquivo(arquivo_origem=arq_local,pasta_destino=dir_sas)
                if resultado == False:
                    return f'96-Erro ao tentar enviar o arquivo ao servidor: {str(self.msg_erro)}' 
            elif acao == 'M':
                arq_local = str(os.path.join(dir_local,arq_local))
                try:
                    resultado = self._enviarArquivo(arquivo_origem=arq_local,pasta_destino=dir_sas)
                    if resultado == True:
                        print(f'Arquivo enviado ao servidor do SAS: {str(arq_local)}')
                        try:
                            os.remove(arq_local)
                        except:
                            return f'97-Arquivo enviado, mas não foi possível remover o arquivo de origem: {str(self.msg_erro)}' 
                    else:
                        return f'96-Erro ao tentar enviar o arquivo ao servidor: {str(self.msg_erro)}' 
                except:
                    return f'99-Erro: {str(self.msg_erro)}'        

            self._encerra_conn()
            return '00' # ação realizada com sucesso
        else:
            self._encerra_conn()
            return f'95-Não foi possivel definir a pasta no servidor do SAS: {str(self.msg_erro)}'