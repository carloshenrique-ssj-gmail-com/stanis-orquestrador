import threading
from pywinauto.application import Application
from pywinauto.findwindows import ElementNotFoundError
import time

class VBAMonitorErro(threading.Thread):
    def __init__(self, intervalo=3):
        super().__init__()
        self.intervalo = intervalo   
        self.encerrar = False # flag para encerrar a thread
        self.erro_encontrado = False
        self.mensagem_erro_identificada = False

    def clicar(self,janela_erro):

        try:
            janela_erro.set_focus()
        except:
            pass
        
        # em PT-BR
        botoes = ['Fim','Encerrar','Fechar','Cancelar','Finalizar']
        for botao in botoes:
            try:
                nome = f".*{botao}.*"
                janela_erro.child_window(title_re=nome, class_name="Button").click()
                return True
            except:
                pass
        return False
        
    def run(self):
        while not self.encerrar:
            try:
                app = Application(backend="win32").connect(title_re=".*Microsoft Visual Basic.*")
                # print('Localizou a aplicação Microsoft Visual Basic')
                janela_erro = app.window(title_re=".*Microsoft Visual Basic.*")
                # print('Localizou a janela Microsoft Visual Basic')
                # janela_erro.print_control_identifiers()
                controle_texto = janela_erro.child_window(title_re=".*",class_name="Static")  # identificando mensagem de erro do vba            
                self.mensagem_erro_identificada = str(controle_texto.window_text())
                if self.clicar(janela_erro) == True:  
                    self.erro_encontrado = True
                    print("Janela de erro do VBA foi encontrada e fechada automaticamente.")
                    break 
            except ElementNotFoundError:
                pass
            except Exception as e:
                print(f"Erro inesperado ao tentar fechar a janela de erro do VBA: {e}")
                break

            time.sleep(self.intervalo)