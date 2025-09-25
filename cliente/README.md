# Stanis Cliente - Sistema de Orquestração de Tarefas

## Descrição
Este sistema, construído em Python 3.10, atua como um orquestrador de tarefas do lado do cliente. Sua principal função é coordenar a execução de tarefas e scripts em Python, VBA, SAS, VBS, além de facilitar o movimento de arquivos localmente e entre a GCP (Google Cloud Platform).

## Requisitos
Certifique-se de ter Python 3.10 instalado no seu ambiente Windows 10. Além disso, é necessário acesso às APIs do servidor e configurações adequadas para interagir com a GCP.

## Instalação
1. Clone este repositório.
2. Instale as dependências necessárias usando o comando: `pip install -r requirements.txt`.
3. **Configurações do Servidor:** Certifique-se de configurar as credenciais necessárias para acessar a API do servidor e a GCP. Estas configurações devem ser realizadas do lado do servidor.
4. **Variáveis de Ambiente e Proteção de Senhas:**
   - `STANIS_LU`: Usuário da máquina.
   - `STANIS_LP`: Senha para o usuário da máquina.
   - `STANIS_LUSAS`: Usuário do SAS.
   - `STANIS_LPSAS`: Senha para o usuário do SAS.
   - Utilize o script "proteger_senhas.py" para criptografar os dados. Uma chave deve ser fornecida pelo servidor do Stanis para ser usada na criptografia dos dados de senhas.

## Uso
Execute o script principal "lancador_v2.py" para iniciar o orquestrador.
