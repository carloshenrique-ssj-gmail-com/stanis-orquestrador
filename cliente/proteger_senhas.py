from cryptography.fernet import Fernet
import binascii
from base64 import urlsafe_b64encode

def informacoes():
    print('-'*100)
    print('*** Usuario SAS ***')
    print('Usado para chamada no FTP do SAS')
    print('STANIS_LUSAS: Usuário do SAS')
    print('STANIS_LPSAS: Senha do SAS\n')


    print('*** Usuario Maquina ***')
    print('Usado para chamada http Google API')
    print('STANIS_LU: Usuário do Maquina')
    print('STANIS_LP: Senha do usuário da Maquina')
    print('-'*100)
    print('\n')
    
def criptografar(chave_maquina_stanis,texto):
    try:
        chave_stanis_bin = binascii.unhexlify(chave_maquina_stanis)
        chave_stanis_bin = urlsafe_b64encode(chave_stanis_bin)
        algoritimo = Fernet(chave_stanis_bin)
        texto = str(texto).encode('utf-8')
        texto_criptografado = algoritimo.encrypt(texto)
        return True,str(texto_criptografado)
    except Exception as e:
        return False,f'ERRO: {str(e)}'


while True:
    print('1 - GERAR SENHA SEGURA')
    print('2 - O QUE PRECISA CADASTRAR')
    print('3 - SAIR')
    print(' ')
    acao = input('INFORME A AÇÃO DESEJADA: ')


    if acao not in ('1','2','3'):
        print('OPÇÃO INVALIDA')
    elif acao == '1':

        chave_stanis = input('INFORME A CHAVE DE PROTEÇÃO DE SENHA, IGUAL A DO STANIS PARA ESSA MAQUINA: ')
        senha = input('INFORME A SENHA A SER PROTEGIDA: ')
        if chave_stanis == '' or chave_stanis is None:
            print('NÃO RECEBEU A CHAVE DO STANIS PARA A AÇÃO')
        elif senha == '' or senha is None:
            print('NÃO RECEBEU A SENHA PARA PROTEGER')
        else:
            chave_stanis = str(chave_stanis).strip()
            senha = str(senha).strip()
            resultado, senha_protegida = criptografar(chave_stanis,senha)
            if resultado == True:
                print('Segue a senha protegida no padrão do Stanis')
                print('Armazene ela na variavel de ambiente da conta do Windows')
                print('-'*100)
                print(senha_protegida)
                print('-'*100)
            else:
                print('-'*100)
                print(senha_protegida)
                print('-'*100)

    elif acao == '2':

        informacoes()

    elif acao == '3':
        break