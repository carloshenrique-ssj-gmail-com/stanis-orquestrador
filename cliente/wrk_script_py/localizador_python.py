import shutil
import subprocess
import winreg
from pathlib import Path
import os
from typing import Optional, Callable

class ExecutavelPython:
    def __init__(self):
        self.arquivo_versao_esperada = str(os.path.dirname(__file__)).replace(os.path.basename(os.path.dirname(__file__)),'python_version_installed_required.txt')
        self.versao:str = self._obter_versao_python_no_arquivo()

    def localizar(self) -> Optional[Path]:
        estrategias: list[Callable[[], Optional[Path]]] = [
            self._por_shutil,
            self._por_py_launcher,
            self._por_registro,
        ]
        for estrategia in estrategias:
            if (cam := estrategia()) and cam.exists():
                return str(cam).strip()
        return None

    def _por_shutil(self) -> Optional[Path]:
        try:
            for nome in (f"python{self.versao}", f"python{self.versao}.exe"):
                if (c := shutil.which(nome)):
                    return Path(c)
            return None
        except Exception as e:
            print('ERRO NA EXECUÇÃO DA FUNCAO _por_shutil DA CLASSE ExecutavelPython UTILIZADA PARA IDENTIFICAR O EXECUTAVEL DO PYTHON')
            print(e)
            return None

    def _por_py_launcher(self) -> Optional[Path]:
        try:
            saida = subprocess.check_output(
                ["py", f"-{self.versao}", "-c", "import sys;print(sys.executable)"],
                text=True, stderr=subprocess.DEVNULL
            ).strip()
            return Path(saida) if saida else None
        except (subprocess.CalledProcessError, FileNotFoundError):
            return None

    def _por_registro(self) -> Optional[Path]:
        chave = rf"SOFTWARE\Python\PythonCore\{self.versao}\InstallPath"
        for hive in (winreg.HKEY_CURRENT_USER, winreg.HKEY_LOCAL_MACHINE):
            try:
                with winreg.OpenKey(hive, chave) as key:
                    dir_instal, _ = winreg.QueryValueEx(key, "")
                    return Path(dir_instal) / "python.exe"
            except OSError:
                continue
        return None
    
    def _obter_versao_python_no_arquivo(self):
        try:
            with open(self.arquivo_versao_esperada,'r',encoding='utf-8') as f:
                texto_arquivo = f.read()
            if texto_arquivo:
                return str(texto_arquivo).strip()
            print("Erro ao tentar ler o arquivo 'python_version_installed_required.txt'!")
            return None
        except Exception as e:
            print(f"Erro ao tentar ler o arquivo 'python_version_installed_required.txt': {e}")
            return None
