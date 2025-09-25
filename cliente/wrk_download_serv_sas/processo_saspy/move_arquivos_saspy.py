import saspy
import os
from time import sleep

def abre_sas():
    global sas
    try:
        sleep(3)
        sas_conf = str(__file__).replace(os.path.basename(str(__file__)),'sascfg_personal.py')
        sas = saspy.SASsession(cfgfile=sas_conf,cfgname='sasporto')
        return '00'
    except Exception as e:
        print(str(e))
        return '50'

def fecha_sas():
    global sas
    try:
        sas.disconnect()
        sas._endsas()
        sas = None
    except:
        pass




def upload_arquivo_para_servidor_sas(origem="",destino=""):
    global sas
    if str(origem) == '' or origem == None:
        return 'FALHA: FALTA DADOS PARA CONCLUIR A SOLICITACAO'
    if str(destino) == '' or destino == None:
        return 'FALHA: FALTA DADOS PARA CONCLUIR A SOLICITACAO'
    
    try:
        t = 1
        conectado = False
        while t < 30: 
            _sas = abre_sas() 
            if _sas == '00':
                conectado = True
                break
            else:
                t += 1 
            sleep(10)
        
        if conectado == False:
            fecha_sas()
            return 'SEM CONEXÃO DISPONIVEL' # CONEXÃO OCUPADA - ERRO SEM CANAIS DO SAS DISPONIVEL

        resultado = sas.upload(localfile=origem,remotefile=destino,overwrite=True)
        fecha_sas()
        return 'SUCESSO'
    except Exception as e:
        fecha_sas()
        print(f'FALHA: {str(e)}')
        return f'FALHA: {str(e)}'


def download_arquivo_do_servidor_sas(origem="",destino=""):
    global sas
    if str(origem) == '' or origem == None:
        return 'FALHA: FALTA DADOS PARA CONCLUIR A SOLICITACAO'
    if str(destino) == '' or destino == None:
        return 'FALHA: FALTA DADOS PARA CONCLUIR A SOLICITACAO'
    
    try:
        _sas = abre_sas() 
        if _sas == '50':
            return '01' # CONEXÃO OCUPADA - ERRO SEM CANAIS DO SAS DISPONIVEL
        
        sas.download(localfile=destino,remotefile=origem,overwrite=True)
        fecha_sas()
        return 'SUCESSO'
    except Exception as e:
        fecha_sas()
        print(f'FALHA: {str(e)}')
        return f'FALHA: {str(e)}'
    


def procurar_arquivo_servidor_sas(origem=""):
    global sas
    if str(origem) == '' or origem == None:
        return 'FALHA: FALTA DADOS PARA CONCLUIR A SOLICITACAO'

    try:
        t = 1
        conectado = False
        while t < 30: 
            _sas = abre_sas() 
            if _sas == '00':
                conectado = True
                break
            else:
                t += 1 
            sleep(10)
        
        if conectado == False:
            fecha_sas()
            return 'SEM CONEXÃO DISPONIVEL' # CONEXÃO OCUPADA - ERRO SEM CANAIS DO SAS DISPONIVEL

        pasta = str(origem).replace(os.path.basename(origem),'')[:-1]
        arquivo_procurado = os.path.basename(origem)
        arquivos = sas.dirlist(pasta)

        if len(arquivos) <= 0:
            fecha_sas()
            print('ARQUIVO NÃO LOCALIZADO NO SERVIDOR DO SAS')
            return 'ARQUIVO NÃO LOCALIZADO'
        else:
            if arquivo_procurado in arquivos:
                fecha_sas()
                print('ARQUIVO LOCALIZADO')
                return 'SUCESSO'
            else:
                fecha_sas()
                print('ARQUIVO NÃO LOCALIZADO NO SERVIDOR DO SAS')
                return 'ARQUIVO NÃO LOCALIZADO'

    except Exception as e:
        fecha_sas()
        print(f'FALHA: {str(e)}')
        return f'FALHA: {str(e)}'




def remover_arquivo_servidor_sas(arquivo=""):
    global sas
    if str(arquivo) == '' or arquivo == None:
        return 'FALHA: FALTA DADOS PARA CONCLUIR A SOLICITACAO'
    
    try:
        t = 1
        conectado = False
        while t < 30: 
            _sas = abre_sas() 
            if _sas == '00':
                conectado = True
                break
            else:
                t += 1 
            sleep(10)
        
        if conectado == False:
            fecha_sas()
            return 'SEM CONEXÃO DISPONIVEL' # CONEXÃO OCUPADA - ERRO SEM CANAIS DO SAS DISPONIVEL

        sas.file_delete(arquivo,quiet=True)
        fecha_sas()
        return 'SUCESSO'
    
    except Exception as e:
        fecha_sas()
        print(f'FALHA: {str(e)}')
        return f'FALHA: {str(e)}'