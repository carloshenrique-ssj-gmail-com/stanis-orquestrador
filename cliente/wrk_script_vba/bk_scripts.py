import os
import hashlib
import shutil
from datetime import datetime


class BackupArquivos:
    def __init__(self) -> None:
        self.LOCAL_BKS = None
        self.__criar_pastas_backup()


    def __criar_pastas_backup(self):
        raiz_backup = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))

        self.LOCAL_BKS = {
            0: os.path.join(raiz_backup,'backups_scripts','last_00'),
            30: os.path.join(raiz_backup,'backups_scripts','last_30'),
            60: os.path.join(raiz_backup,'backups_scripts','last_60')
            }        
        
        for k, path in self.LOCAL_BKS.items():
            if not os.path.exists(path):
                os.makedirs(path)

    def __calcular_sha256(self, caminho_arquivo: str):
        sha256_hash = hashlib.sha256()
        with open(caminho_arquivo, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()

    def __existe_arquivo_backup(self, arquivo: str, num_local: int):
        local_arquivo = os.path.join(self.LOCAL_BKS[num_local], os.path.basename(arquivo))
        return os.path.exists(local_arquivo)

    def __arquivo_backup_vencido(self, arquivo: str, num_local: int):
        local_arquivo = os.path.join(self.LOCAL_BKS[num_local], os.path.basename(arquivo))
        dt_m_arq = datetime.fromtimestamp(os.path.getmtime(local_arquivo))
        tempo = (datetime.now() - dt_m_arq)
        return abs(tempo.days) >= num_local

    def __copia_arquivo_backup(self, arquivo: str, num_local: int):
        destino = os.path.join(self.LOCAL_BKS[num_local], os.path.basename(arquivo))
        try:
            shutil.copy2(arquivo, destino)
            print("Backup realizado com sucesso.")
        except Exception as e:
            print("O sistema não conseguiu fazer o backup do arquivo:", str(e))

    def bk_arquivo(self, arquivo: str):
        if not os.path.exists(arquivo):
            return 
        
        assinatura_arq_atual = self.__calcular_sha256(arquivo)
        
        for num_local in [0,30,60]:
            assinatura_arq_backup = False

            if self.__existe_arquivo_backup(arquivo, num_local):
                assinatura_arq_backup = self.__calcular_sha256(os.path.join(self.LOCAL_BKS[num_local], os.path.basename(arquivo)))
                if assinatura_arq_backup:
                    if self.__arquivo_backup_vencido(arquivo, num_local) and assinatura_arq_atual != assinatura_arq_backup:
                        self.__copia_arquivo_backup(arquivo, num_local)
            else:
                self.__copia_arquivo_backup(arquivo, num_local)