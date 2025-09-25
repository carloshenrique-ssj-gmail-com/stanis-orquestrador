import psutil

class DerrubarExcelVazio:
    def __init__(self) -> None:
        pass   
    
    def __procurar_processos_excel(self):
        excel_processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
            if 'excel' in proc.info['name'].lower():
                excel_processes.append(proc)
        return excel_processes

    def __fechar_processos_excel_vazios(self,excel_processes):
        for proc in excel_processes:
            try:
                cmdline = proc.info['cmdline']
                if len(cmdline) > 1:
                    if str(cmdline[1]).lower().endswith(('xlsx','xls','xlsb','xlsm')):
                        print('Deixando:',proc.info['cmdline'])
                        continue
                    else:
                        print('Fechando:',proc.info['cmdline'])
                        p = psutil.Process(proc.info['pid'])
                        p.kill()
                        continue  
                else:
                    print('Fechando:',proc.info['cmdline'])
                    p = psutil.Process(proc.info['pid'])
                    p.kill()
                    continue                                        
                                                                
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                continue
    
    def procurar_excels_fechar(self):
        processos_excel = self.__procurar_processos_excel()
        self.__fechar_processos_excel_vazios(processos_excel)