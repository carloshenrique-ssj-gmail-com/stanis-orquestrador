import os
import subprocess

def set_env_variables(env_vars):
    """
    Configura variáveis de ambiente no nível do usuário no Windows.

    Args:
        env_vars (dict): Dicionário com nomes das variáveis como chave e seus valores como valores.
    """
    for var, value in env_vars.items():
        try:
            os.environ[var] = value # Define a variável de ambiente para a sessão atual           
            command = f'setx {var} "{value}"' # Define a variável de ambiente permanentemente no nível do usuário
            subprocess.run(command, shell=True, check=True, text=True, capture_output=True)
            print(f"Variável '{var}' configurada com sucesso: {value}")
        except subprocess.CalledProcessError as e:
            print(f"Erro ao configurar a variável '{var}': {e.stderr}")

if __name__ == "__main__":
    env_vars = {
        "HOST_STANIS_SERV": "host ou ip da maquina servidor",
        "STANIS_LP": "senha do usuario da maquina criptografada com a chave da maquina",
        "STANIS_LU": "usuario da maquina criptografado com a chave da maquina",
        "STANIS_LPSAS": "senha do usuario SAS confirgurado na maquina criptografada com a chave da maquina",
        "STANIS_LUSAS": "usuario SAS confirgurado na maquina criptografada com a chave da maquina",
        "XXX_P": "senha em base64",
        "XXX_U": "usuario em base64"
    }

    set_env_variables(env_vars)
