# Stanis Servidor - Sistema de Orquestração de Tarefas

## Descrição do Sistema

Este sistema, desenvolvido em Python 3.10 e PostgreSQL v15, atua como um servidor de API e orquestrador de tarefas. Aqui é gerenciado a ordem e o momento de execução de tarefas e scripts. Suas principais funcionalidades incluem:

- **Validação de Requisições**: Valida as requisições recebidas das máquinas clientes.
- **Consulta ao Banco de Dados**: Realiza consultas ao banco de dados PostgreSQL para fornecer respostas conforme as configurações definidas.
- **Serviço de Aplicação Web**: Disponibiliza uma aplicação web que permite configurações e o controle de cadastros de tarefas.

Esse conjunto de funcionalidades assegura uma integração eficiente entre as máquinas clientes e o sistema central, garantindo a execução correta e o gerenciamento das tarefas.

## Requisitos
Certifique-se de ter Python 3.10 ao 3.13 instalado no seu ambiente Windows 10 ou 11. PostgreSQL v.15.

## Instalação
1. Instale o Python 3.10 (ao 3.13) e suas dependências:
   - waitress
   - psycopg2
   - python-http-client
   - requests
   - httplib2
   - PySocks
   - Flask
   - pycryptodome
3. Google Chart (https://developers.google.com/chart/interactive/docs/basic_load_libs?hl=pt-br)
4. Viz Js (https://visjs.github.io/vis-network/docs/network/)
5. Jquery 3.6.3 (https://blog.jquery.com/2022/12/20/jquery-3-6-3-released-a-quick-selector-fix/)
6. PostgreSQL v15  
   - Diversas tabelas estão envolvidas da criação do banco de dados, é recomendado realizar um restore com o arquivo de base modelo fornecido pelo desenvolvedor.
   - Algumas configurações necessárias do banco precisam ser realizadas com acesso direto ao banco.  
7. Servidor de Aplicação Flask sob Waitress 
8. Variáveis de Ambiente
   - `COD_API_EMAIL`: Client_Id e Client_Secret formatado pela biblioteca Base64 do Python - este é o codigo fornecido para acesso a API de envio de emails da Porto.
   - `POSTGRESQL_MIS_USER`: Usuário do PostgreSQL.
   - `POSTGRESQL_MIS_PWD`: Senha do usuário PostgreSQL.
   - `PORTA`: Porta utilizada no Flask
   - `XXX_U`: Usuário da maquina Windows formatado pela biblioteca Base64 do Python.
   - `XXX_P`: Senha do usuário do Windows formatado pela biblioteca Base64 do Python.

## Uso
   - Inicie o arquivo "_api_stanis/api_stanis_host.pyc", na maquina servidor.
   - Inicie o arquivo "_site_stanis/api_stanis_site.pyc", na maquina servidor.   
   - Inicie o arquivo "ClientStanis/lancador_v2.pyc", nas maquinas clientes.  