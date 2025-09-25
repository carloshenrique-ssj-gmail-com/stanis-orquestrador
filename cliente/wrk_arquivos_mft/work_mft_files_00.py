import os
import shutil
import time
import sys
import re
from datetime import datetime
import win32security
import uuid
import unicodedata
import calcular_hash_arquivo
from requests_api_stanis import InteracaoAPIStanis

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


def pegar_informacoes_arquivo(caminho_arquivo=None):
    if caminho_arquivo is None or caminho_arquivo == '':
        return False, '98-NÃO RECEBEU PARAMENTRO ARQUIVO PARA CALCULAR'
    if not os.path.isfile(caminho_arquivo):
        return False, '97-NÃO RECEBEU O ARQUIVO PARA CALCULAR'    
    try:
        
        informacao_arq = {}
        informacao_arq["FILE_SIZE"] = os.path.getsize(caminho_arquivo)
        informacao_arq["CREATION_DATE"] = datetime.fromtimestamp(os.path.getctime(caminho_arquivo)).strftime("%Y-%m-%d %H:%M:%S")
        informacao_arq["LAST_MODIFIED"] = datetime.fromtimestamp(os.path.getmtime(caminho_arquivo)).strftime("%Y-%m-%d %H:%M:%S")
        informacao_arq["FILE_NAME"] = os.path.basename(caminho_arquivo)
        informacao_arq["FULL_NAME"] = caminho_arquivo
        
        try:
            sd = win32security.GetFileSecurity(caminho_arquivo, win32security.OWNER_SECURITY_INFORMATION)
            owner_sid = sd.GetSecurityDescriptorOwner()
            owner_name, owner_domain, _ = win32security.LookupAccountSid(None, owner_sid)
            informacao_arq["CREATED_BY"] = f"{owner_domain}\\{owner_name}"
        except Exception as e:
            print('FALHOU AO TENTAR IDENTIFICAR O NOME DO CRIADOR DO ARQUIVO:', str(e))
            informacao_arq["CREATED_BY"] = None   
        
        return True, informacao_arq     
    except Exception as e:
        msg_erro = f"99- FALHA AO TENTAR OBTER DADOS DO ARQUIVO {caminho_arquivo} PARA CALCULO DO MFT. ERRO INTERNO:  {str(e)}"
        return False, msg_erro


def move_arquivo_pasta_mft(orig_arq: str, dest_arq: str):
    if not os.path.isfile(orig_arq):
        return False, f'O ARQUIVO NÃO ESTÁ NA PASTA PARA O MFT MOVER: {orig_arq}'
    
    try:

        with open(orig_arq, 'rb+') as f:

            try:

                with open(dest_arq, 'wb') as dest_f:
                    shutil.copyfileobj(f, dest_f, length=1024*1024*5)  # copia 5MB por vez
                shutil.copystat(orig_arq, dest_arq)  # copia metadados

            except Exception as e:

                try:
                    os.remove(dest_arq)
                except:
                    pass         

                return False, f'FALHA AO TENTAR COPIAR O ARQUIVO PARA A PASTA DE DESTINO MFT: {orig_arq} | {str(e)}'

            if not os.path.isfile(dest_arq) or os.path.getsize(dest_arq) != os.path.getsize(orig_arq):
                try:
                    os.remove(dest_arq)
                except:
                    pass
                return False, f'FALHA NA CÓPIA COMPLETA DO ARQUIVO: {orig_arq}'

            
    except Exception as e_open:
        return False, f'FALHA AO TENTAR COLOCAR O ARQUIVO EM MODO EXCLUSIVO PARA INICIAR O PROCESSO: {orig_arq} | {str(e)}'

    try:
        os.remove(orig_arq)
    except Exception as e_rm:
        try:
            os.remove(dest_arq)
        except:
            pass
        return False, f'FALHA AO TENTAR REMOVER O ARQUIVO ORIGINAL: {orig_arq} | {e_rm}'
    
    return True, None
    
  

def entrega_arquivo_mft(origem=None,destino=None,ini_nome=None,extensao='csv',tar=0,wrk=0):
    if origem == None or destino == None or ini_nome == None:
        return '98-FALTA INFORMAÇÕES PARA EXECUTAR A TRANSFERENCIA MFT DO ARQUIVO'
    
    ini_nome = str(ini_nome).lower()
    ini_nome = ini_nome.replace('*','.*')
    ini_nome = re.compile(ini_nome)    
    
    houve_transferencia = False
    dados = vlt.rl.solicita_chave_arquivo_mft(v_hash=vlt.n_tok,id_tar=tar)      
    inicio_arq = ''
    try:
        if dados['resultado'] == 'SUCESSO':
            inicio_arq = dados['usar_chave']
        else:
            print('Erro ao tentar identificar a chave para usar no inicio do arquivo: NENHUMA CHAVE RETORNOU DA CHAMADA DA API:', dados)
            return 'FALHA AO TENTAR IDENTIFICAR A CHAVE PARA USAR NO INICIO DO ARQUIVO'
    except Exception as e:
        print('Erro ao tentar identificar a chave para usar no inicio do arquivo: ', str(e))
        return 'FALHA AO TENTAR IDENTIFICAR A CHAVE PARA USAR NO INICIO DO ARQUIVO'

    identificador_transf_arquivos = str(uuid.uuid4()) 
    
    arq_dir = os.listdir(origem)
    for arq in arq_dir:
        arq = str(arq).lower()
        if ini_nome.match(arq) and arq.endswith(extensao):
            try:
                
                novo_nome_arq = f'{inicio_arq}_{arq}'
                orig_arq = os.path.join(origem,arq)
                dest_arq = os.path.join(destino,novo_nome_arq)
                ini_transf = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                resultado_movimento, mensagem_movimento = move_arquivo_pasta_mft(orig_arq, dest_arq)
                if resultado_movimento == False:
                    return f'FALHA: {mensagem_movimento}'
                fim_transf = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                resultado, info_arquivo = pegar_informacoes_arquivo(dest_arq)
                if resultado == True and info_arquivo:
                    info_arquivo['ASSINATURA_MD5'] = calcular_hash_arquivo.Calcular_Hash(dest_arq).calcular_md5_arquivo()
                    info_arquivo['ASSINATURA_LOG_SHA256'] = calcular_hash_arquivo.Calcular_Hash(info_arquivo).calcular_sha256_texto()
                    info_arquivo['HR_INI_TRANSFERENCIA'] = ini_transf
                    info_arquivo['HR_FIM_TRANSFERENCIA'] = fim_transf
                    
                    retorno_api = vlt.rl.registra_log_mft_transf_arquivo(v_hash=vlt.n_tok, id_tar=tar, dados_arquivo=info_arquivo,identificador_mft=identificador_transf_arquivos)
                    
                    if not retorno_api == True:
                        try: # tenta devolver o arquivo.
                            time.sleep(3)
                            shutil.move(dest_arq,orig_arq)
                            devolvido = '[O ARQUIVO FOI DEVOLVIDO PARA A PASTA DE ORIGEM.]'
                        except Exception as e:
                            devolvido = f'[O SISTEMA NÃO CONSEGUIU DEVOLVER O ARQUIVO ORIGEM: {str(e)}]'
                        

                        if resultado_movimento == True:
                            msg = f"FALHA: O ARQUIVO FOI MOVIDO PARA PASTA DO MFT, MAS O SISTEMA NÃO CONSEGUIU REGISTRAR O ARQUIVO NA TABELA DE CONTROLE DO STANIS: {str(arq)} {devolvido}"
                        else:
                            msg = f"FALHA: O SISTEMA NÃO CONSEGUIU REGISTRAR O ARQUIVO NA TABELA DE CONTROLE DO STANIS: {str(arq)} {devolvido}"
                        return msg
                            
                    
                    vlt.rl.registra_log_transf_arquivo(v_hash=vlt.n_tok,id_tar=tar,tp_servico='13',endereco_arq=dest_arq,acao='M')
                    houve_transferencia = True
                else:
                    msg = f"Falha ao tentar obter os dados do arquivo para o controle o arquivo MFT: {str(arq)}"
                    return msg
                    
            except Exception as e:
                if houve_transferencia == True:
                    msg = f"Falha ao tentar enviar o arquivo {str(arq).upper()} para a pasta MFT {str(destino)}. Descrição do erro: {str(e)}, alguns arquivos podem ter sido transferidos."
                else:
                    msg = f"Falha ao tentar enviar o arquivo {str(arq).upper()} para a pasta MFT {str(destino)}. Descrição do erro: {str(e)}"
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
    print('Tarefa:', _tarefa)
    if _tarefa != '' and _origem != '' and _destino != '' and _ini_arq != '' and _extensao != '':
        if os.path.exists(_origem) == True:

            vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='0', id_tar=_tarefa, cd_resultado='0',descricao='',tempo='')
            vlt.rl.log_pid_tarefa(v_hash=vlt.n_tok, v_tar=vlt.n_tar, v_pid=str(os.getpid()))
            t_ini = time.time()
            print(f'Tarefa: {_tarefa}')
            resultado = entrega_arquivo_mft(origem=_origem,destino=_destino,ini_nome=_ini_arq,extensao=_extensao,tar=_tarefa)
            t_fim = time.time() - t_ini
            t_fim_tab = time.strftime("%H:%M:%S",time.gmtime(t_fim))
            if resultado == 'SUCESSO':
                time.sleep(3)
                vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='5',descricao='',tempo=t_fim_tab)
            elif resultado == 'SEM CORRESPONDENCIA':
                time.sleep(3)
                vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='3',descricao='',tempo=t_fim_tab)
            else:
                time.sleep(3)
                resultado = sanitizar_texto_para_utf8(resultado)
                vlt.rl.registra_log_tarefa(v_hash=vlt.n_tok,soltar_tarefa='1', id_tar=_tarefa, cd_resultado='2',descricao=resultado,tempo=t_fim_tab)           
            print(f'Terminou tarefa: {_tarefa}')
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
            time.sleep(600)
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
            executa_tarefa()
    except Exception as e:
        print(e)
        time.sleep(600)
