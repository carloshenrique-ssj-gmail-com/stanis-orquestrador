import shutil
import subprocess
import winreg
from pathlib import Path
import os
from typing import Optional, Callable



class ExecutavelPython:
    def __init__(self):
        self.arquivo_versao_esperada = str(os.path.abspath(__file__)).replace(os.path.basename(__file__),'python_version_installed_required.txt')
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
        for nome in (f"python{self.versao}", f"python{self.versao}.exe"):
            if (c := shutil.which(nome)):
                return Path(c)

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
            raise ValueError("Erro ao tentar ler o arquivo 'python_version_installed_required.txt'!")
        except Exception as e:
            raise ValueError(f"Erro ao tentar ler o arquivo 'python_version_installed_required.txt': {e}")
