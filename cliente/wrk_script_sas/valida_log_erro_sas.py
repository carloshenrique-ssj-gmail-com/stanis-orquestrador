import zipfile
import os
import re

padrao = re.compile(r"^[A-Za-z0-9|/\\+.\-=()\n]+$")

def ler_log_arq_sas(caminho_arquivo_egp=''):

    if caminho_arquivo_egp == '' or caminho_arquivo_egp == None:
        return 'OK'

    if not os.path.exists(caminho_arquivo_egp):
        return 'OK'

    houve_erro = False
    try:
        with zipfile.ZipFile(caminho_arquivo_egp, "r") as zip_ref:
            for item in zip_ref.infolist():
                if not item.is_dir():
                    sub_item_path = item.filename
                    if '.git' not in sub_item_path and 'CodeTask' in sub_item_path:
                        lista_pastas = os.path.dirname(sub_item_path).split('/')
                        for pasta in lista_pastas:
                            if pasta.startswith('Log-'):
                                if os.path.basename(sub_item_path) == 'result.log':
                                    with zip_ref.open(sub_item_path) as file:
                                        erros_encontrados = ''
                                        for line in file:
                                            line_text = line.decode().strip()
                                            if str(line_text)[:8] == 'e ERROR:' or str(line_text)[:8] == 'd ERROR:':
                                                if erros_encontrados == '':
                                                    erros_encontrados = str(line_text)
                                                else:
                                                    erros_encontrados += f'\n{str(line_text)}'

                                            if str(line_text)[:8] == 'e ERROR:':
                                                houve_erro = True

                                        if houve_erro == True:
                                            erros_encontrados = ''.join([letra if padrao.match(letra) else ' ' for letra in erros_encontrados])
                                            erros_encontrados = str(erros_encontrados)[:9999]
                                            return str(erros_encontrados).strip()
    except:
        return 'OK'

    if houve_erro == False:
        return 'OK'