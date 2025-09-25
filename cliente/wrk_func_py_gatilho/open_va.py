from base64 import b64decode
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import time

class VariaveisAmbiente:
    def __init__(self):
        pass
    
    def ___decodificar_aes256(self,texto_protegido_base64, chave_hex):
        chave = bytes.fromhex(chave_hex)
        dados = b64decode(texto_protegido_base64)
        iv = dados[:AES.block_size]
        texto_protegido = dados[AES.block_size:]
        cipher = AES.new(chave, AES.MODE_CBC, iv)
        texto_original = unpad(cipher.decrypt(texto_protegido), AES.block_size)
        texto_saida = str(texto_original.decode('latin-1'))
        if texto_saida == None:
            texto_saida = '' 
        return texto_saida

    def retornar_variaveis_script(self,dicionario_protegido,chave_variavel_ambiente):
        if len(dicionario_protegido) == 0 or dicionario_protegido is None or dicionario_protegido == '':
            return {}
        if chave_variavel_ambiente is None or chave_variavel_ambiente == '': 
            print('O SCRIPT NÃO RECEBEU A CHAVE PARA ABRIR AS SENHAS DAS VARIVEIS DE AMBIENTE')
            return {}
        
        try:
            for chave, valor in dicionario_protegido.items():
                valor_decodificado = self.___decodificar_aes256(valor, chave_variavel_ambiente)
                dicionario_protegido[chave] = valor_decodificado

            return dicionario_protegido
        except Exception as e:
            print('ERRO AO TENTAR ABRIR AS VARIAVEIS DE AMBIENTE', str(e))
            time.sleep(900)
            return {}