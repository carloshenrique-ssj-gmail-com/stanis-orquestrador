import hashlib
import base64

class Calcular_Hash:
    def __init__(self, dado:None) -> None:
        self.dado = str(dado) if dado and dado != '' else None 
 
    def calcular_md5_arquivo(self) -> str:
        if self.dado is None:
            print('Nenhum arquivo recebido na função calcular_md5')
            return 'Nenhum arquivo recebido na função calcular_md5'
        try:
            md5_hasher = hashlib.md5()
            with open(self.dado, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    md5_hasher.update(chunk)
            return base64.b64encode(md5_hasher.digest()).decode('utf-8')
        except Exception as e:
            msg_erro = f'Erro ao tentar assinar MD5 no arquivo: {self.dado}'
            return msg_erro

    def calcular_sha256_texto(self) -> str:
        if self.dado is None:
            print('Nenhuma informação foi recebida na função calcular_sha256')
            return 'Nenhuma informação foi recebida na função calcular_sha256'
        try:
            sha256_hasher = hashlib.sha256()
            sha256_hasher.update(str(self.dado).encode('utf-8'))
            return base64.b64encode(sha256_hasher.digest()).decode('utf-8')
        except Exception as e:
            msg_erro = f'Erro ao tentar assinar SHA256 no texto: {self.dado}'
            return msg_erro
