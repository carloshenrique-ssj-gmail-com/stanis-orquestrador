import base64 
import os

___usr = os.environ['SAS_U']
___usr = base64.b64decode(___usr).decode('ascii')
___pwd = os.environ['SAS_P']
___pwd = base64.b64decode(___pwd).decode('ascii')

SAS_config_names = ['sasporto']

SAS_config_options = {
    'lock_down': False,
    'verbose': True
}

# SAS_output_options = {'output': 'html5'} 

sasporto  = {
    #em agluns casos pode ser necessário comentar a linha do java
    # 'java': '/usr/bin/java',
    'iomhost': 'li5426.portoseguro.brasil',
    'iomport': 8597,
    'class_id': '440196d4-90f0-11d0-9f41-00a024bb830c',
    'provider': 'sas.iomprovider',
    'encoding': 'latin_1',
    'compress': 'yes',
    'reuse': 'yes',
    'validVarName':'any',
	'options': ["-fullstimer", "IOMLOGAUTOFLUSH"],
    'timeout':30000,
    'omruser':___usr,
    'omrpw':___pwd   
}