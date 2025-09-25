import os
import time
import win32com.client
from classe_lancador import LancadorStanis
import instalar_bibliotecas_requeridas as ibr
from controle_pid_stanis import ControlePIDs
from localizador_python import ExecutavelPython

raiz = str(__file__).replace(os.path.basename(str(__file__)),'')

def trata_espacos(texto):
    return texto.replace(' ','¥')

def call_script(executavel_python:str):
    
    if str(lancador.tipo_servico) == '1': 
        _script = os.path.join(raiz,'wrk_local','work_file_transf_00.py')
    elif str(lancador.tipo_servico) == '2':
        _script = os.path.join(raiz,'wrk_upload_gcp','work_file_upload_gcp_00.py')           
    elif str(lancador.tipo_servico) == '3':
        _script = os.path.join(raiz,'wrk_download_gcp','work_file_download_gcp_00.py')
    elif str(lancador.tipo_servico) == '4':
        _script = os.path.join(raiz,'wrk_procedure_gcp','work_procedure_gcp_00.py')
    elif str(lancador.tipo_servico) == '5':
        _script = os.path.join(raiz,'wrk_script_py','work_script_py_00.py')          
    elif str(lancador.tipo_servico) == '6':
        _script = os.path.join(raiz,'wrk_script_sas','work_script_sas_00.py')           
    elif str(lancador.tipo_servico) == '7':
        _script = os.path.join(raiz,'wrk_script_vba','work_script_vba_00.py')             
    elif str(lancador.tipo_servico) == '8':
        _script = os.path.join(raiz,'wrk_upload_serv_sas','work_up_file_sas_00.py')   
    elif str(lancador.tipo_servico) == '9':
        _script = os.path.join(raiz,'wrk_download_serv_sas','work_down_file_sas_00.py') 
    elif str(lancador.tipo_servico) == '10':
        _script = os.path.join(raiz,'wrk_script_vbs','work_script_vbs_00.py') 
    elif str(lancador.tipo_servico) == '11':
        _script = os.path.join(raiz,'wrk_func_py_gatilho','work_func_py_true_00.py')        
    elif str(lancador.tipo_servico) == '12':
        _script = os.path.join(raiz,'wrk_csv_bucket_into_table','work_read_uri_csv_00.py')     
        lancador.dir_origem = str(lancador.dir_origem).replace('"',"'")  
        lancador.dir_destino = str(lancador.dir_destino).replace('"',"'")   
    elif str(lancador.tipo_servico) == '13':
        _script = os.path.join(raiz,'wrk_arquivos_mft','work_mft_files_00.py')                                                  
    else:
        print(f'TIPO DE SERVIÇO NÃO PROGRAMADO: {lancador.tipo_servico}')
        time.sleep(60)

    if not os.path.isfile(_script): _script = f'{_script}c'
    endereco = _script
    print(f"Tipo: {str(endereco)}")
    print(f"Tarefa: {str(lancador.id_tarefa)}")
    try:
        shell = win32com.client.Dispatch("WScript.Shell")
        executar = (
            fr'"{executavel_python}" "{endereco}" "{str(lancador.token)}" "{str(lancador.id_tarefa)}"'
            fr' "{str(lancador.tipo_servico)}" "{str(lancador.acao)}" "{trata_espacos(str(lancador.dir_origem))}"'
            fr' "{trata_espacos(str(lancador.dir_destino))}" "{trata_espacos(str(lancador.ini_arq))}" '
            fr' "{trata_espacos(str(lancador.extensao_arq))}" "{str(lancador.id_chat)}" "{str(lancador.chave_va).strip()}"'
        )
        shell.Run(executar,6)
    except Exception as e:
        print(str(e))
        time.sleep(30000)



if __name__ == '__main__':

    try:
        print('Sistama vai tentar instalar as bibliotecas do arquivo requirements.txt')
        ibr.instalar_requerimentos()
        time.sleep(5)
    except Exception as e:
        print(str(e))
        time.sleep(600)


    local_executavel_python = ExecutavelPython().localizar()
    if local_executavel_python == '' or local_executavel_python is None or local_executavel_python == 'None':
        print('#' * 100)
        print("ERRO AO TENTAR OBTER O ENDERECO DO EXECUTAVEL PYTHON! VERIFIQUE A VERSAO DO PYTHON INSTALADA NESTA MAQUINA CORRESPONDE A VERSAO SINALIZADA NO ARQUIVO 'python_version_installed_required.txt' JUNTO A ESTE ARQUIVO OU PROCURE O DESENVOLVEDOR.")
        print('#' * 100)
        time.sleep(12000)

    lancador = LancadorStanis()
    autenticado = lancador.authenticator_api()
    print(f'GERENCIADOR DE SERVICOS - AUTENTICADO')
    time.sleep(2)

    if autenticado:
        os.system('cls')
        print('*'*100)
        print(f'GERENCIADOR DE SERVICOS - ONLINE')
        print('*'*100)

        controle_pids_maquina = ControlePIDs(str(lancador.token))
        srv_transf_arqs = 0

        while True:
            try:
                controle_pids_maquina.derrubar_pid()
            except Exception:
                pass
            
            retorno = lancador.busca_tarefa()
            
            os.system('cls')
            print('*' * 100)
            print('GERENCIADOR DE SERVICOS - ONLINE')
            print('*' * 100)    
    
            if retorno:            
                print(f'Tarefa: {str(lancador.id_tarefa)}')
                call_script(executavel_python=local_executavel_python)
                
                if str(lancador.tipo_servico) in ('1','2','3','4','9','10','12'):
                    srv_transf_arqs += 1
                    time.sleep(15 if srv_transf_arqs <= 3 else lancador.tempo_atualizacao)
                    srv_transf_arqs %= 3
                else:
                    srv_transf_arqs = 0
                    time.sleep(15)
            else:
                print(f"Ultima pesquisa de tarefa: {str(time.strftime('%H:%M:%S'))}")
                time.sleep(lancador.tempo_atualizacao)