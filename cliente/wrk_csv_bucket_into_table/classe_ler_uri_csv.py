from google.cloud import bigquery
from google.cloud.exceptions import NotFound
import datetime
import os

class BigQueryLoader:
    
    def __init__(self,json_authentication=None,usuario=None,senha=None,proxy_x=None,porta_x=None):
        self.client_bq = None
        self.local_json = json_authentication
        if usuario and senha:
            os.environ["http_proxy"] = f'http://{usuario}:{senha}@{proxy_x}:{porta_x}'
            os.environ["https_proxy"] = f'http://{usuario}:{senha}@{proxy_x}:{porta_x}'
            os.environ["no_proxy"] = "localhost,127.0.0.1"        
   
    def __enter__(self):
        self.client_bq = bigquery.Client(credentials=self.local_json)
        return self
    
    def __exit__(self, exc_type, exc_value, traceback):
        if self.client_bq:
            self.client_bq.close()
    
    def create_temporary_table_name(self, nome=''):
        agora = datetime.datetime.now()
        nova_tab = 'temp_' + str(agora.strftime('%y%m%d%H%M%S') + str(agora.microsecond // 1000)) + '_' + nome
        return nova_tab

    def my_truncate_table(self, tabela):
        try:
            sql = f"TRUNCATE TABLE `{tabela}`;"
            self.client_bq.query(sql).result()
            return True
        except Exception as e:
            print(f'FALHA AO TENTAR TRUNCAR A TABELA {str(tabela)}: {str(e)}')
            return False

    def builder_list_schema(self, colunas_header):
        return [bigquery.SchemaField(str(coluna).upper().replace('.', '_').replace(',', '_').replace('-', '_'), 'STRING') for coluna in colunas_header]


    def my_get_schema_from_table(self,tabela):
        if len(str(tabela).split('.')) == 2:
            ds, tbl = str(tabela).split('.')
        elif len(str(tabela).split('.')) == 3:
            _, ds, tbl = str(tabela).split('.')
            
        dataset_ref = self.client_bq.dataset(ds)
        table_ref = dataset_ref.table(tbl)
        table = self.client_bq.get_table(table_ref)
        return table.schema

    def my_compare_schemas(self, schema1, schema2):
        if len(schema1) != len(schema2):
            return False

        for col1, col2 in zip(schema1, schema2):
            if col1 != col2:
                return False
            
        return True


    def my_builder_scheme_from_loader(self, colunas_header, linha_header, delimitador):
        try:
            schema_texto = self.builder_list_schema(colunas_header)
            configuracoes_job = bigquery.LoadJobConfig(
                autodetect=False,
                source_format=bigquery.SourceFormat.CSV,
                skip_leading_rows=linha_header,
                field_delimiter=delimitador,
                encoding='UTF-8',
                allow_jagged_rows=False,
                schema=schema_texto
            )
            configuracoes_job._properties["load"]["preserve_ascii_control_characters"] = True   
            return configuracoes_job 
        except Exception as e:
            print(f'Erro ao criar esquema de carregamento: {str(e)}')
            return None

    def create_sql_instruct_restrict_duplicate(self, colunas_header, colunas_validar_duplicidade, endereco_tabela_temp, endereco_tabela_fim, nome_arquivo):
        try:
            condicao = "\n".join(f"AND COALESCE(A.{campo},'0') = COALESCE(B.{campo},'0')" for campo in colunas_validar_duplicidade)
            colunas = "\n,".join(colunas_header)
            colunas_fim = f"{colunas}\n,NOME_ARQUIVO_STANIS\n,DT_CARREGAMENTO_STANIS"

            if colunas_validar_duplicidade:
                sql = f"""
                INSERT INTO `{endereco_tabela_fim}` 
                (
                    {colunas_fim}
                )
                SELECT 
                      {colunas}
                    ,'{nome_arquivo}'
                    ,CAST(FORMAT_DATE('%Y-%m-%d %H:%M:%S',CURRENT_DATETIME('UTC-3')) AS DATETIME)
                FROM `{endereco_tabela_temp}` AS A 
                WHERE NOT EXISTS (
                    SELECT 1 
                    FROM `{endereco_tabela_fim}` AS B 
                    WHERE 1 = 1 
                    {condicao}
                );"""
            else:
                sql = f"""
                INSERT INTO `{endereco_tabela_fim}` 
                (
                    {colunas_fim}
                )
                SELECT 
                      {colunas}
                    ,'{nome_arquivo}'
                    ,CAST(FORMAT_DATE('%Y-%m-%d %H:%M:%S',CURRENT_DATETIME('UTC-3')) AS DATETIME)
                FROM `{endereco_tabela_temp}`;"""
            return sql
        except Exception as e:
            print(f'Erro ao criar instrução SQL: {str(e)}')
            return None

    def table_exists(self, endereco_tabela):
        try:
            self.client_bq.get_table(endereco_tabela)
            return True
        except NotFound:
            return False
        except Exception as e:
            print(f"Erro inesperado ao verificar a tabela: {e}")
            return False

    def my_load_csv_file_to_table(self, uri_arq, tabela,conf_job):
        try:
            self.client_bq.load_table_from_uri(uri_arq, tabela, job_config=conf_job).result()
            return True, None
        except Exception as e:
            self.client_bq.delete_table(tabela, not_found_ok=True)
            return False, f'ERRO AO TENTAR CARREGAR O ARQUIVO: {str(e)}'

    def load_data_from_uri_into_table(self, uri_file, header, linha_header, delimitador, dataset_id_with_table, recriar_tabela=0, colunas_validar_duplicidade=None):
        try:
            if ',' in header:
                colunas_header = header.split(',')
            elif ';' in header:
                colunas_header = header.split(';')
            else:
                return 'ERRO: HEADER NÃO ESTA DEFINIDO CORRETAMENTE'

            if not isinstance(colunas_header, list):
                return 'ERRO: HEADER NÃO ESTA DEFINIDO CORRETAMENTE'

            table_id = dataset_id_with_table.split('.')
            if len(table_id) == 3:
                projeto, dataset_id, tabela = table_id
            elif len(table_id) == 2:
                projeto = 'ps-atlas-dl-finan-20220615'
                dataset_id, tabela = table_id
            else:
                return 'ERRO: ENDEREÇO DA TABELA NÃO ESTA DEFINIDO CORRETAMENTE'
            tabela = tabela.upper()

            if colunas_validar_duplicidade:
                if ',' in colunas_validar_duplicidade:
                    colunas_valida_duplicidade = colunas_validar_duplicidade.split(',')
                elif ';' in colunas_validar_duplicidade:
                    colunas_valida_duplicidade = colunas_validar_duplicidade.split(';')
                else:
                    colunas_valida_duplicidade = [colunas_validar_duplicidade]
            else:
                colunas_valida_duplicidade = []

            colunas_valida_duplicidade = [coluna.upper().replace('.', '_').replace(',', '_').replace('-', '_') for coluna in colunas_valida_duplicidade]

            configuracoes_job = self.my_builder_scheme_from_loader(colunas_header, linha_header, delimitador)
            if configuracoes_job is None:
                return 'ERRO: NÃO FOI POSSÍVEL CRIAR CONFIGURAÇÕES DE JOB'

            table_temp = self.create_temporary_table_name(nome=tabela)
           
            # tenta importar a tabela temporaria
            passou, mensagem = self.my_load_csv_file_to_table(uri_file, f"{projeto}.{dataset_id}.{table_temp}", configuracoes_job)
            if passou == False:
                self.record_file_result_read(uri_file,0) # se houve erro registra problema no arquivo
                return f'FALHA: {mensagem}'

            sql = self.create_sql_instruct_restrict_duplicate(
                colunas_header=colunas_header, 
                colunas_validar_duplicidade=colunas_valida_duplicidade,
                endereco_tabela_temp=f"{projeto}.{dataset_id}.{table_temp}",
                endereco_tabela_fim=f"{projeto}.{dataset_id}.{tabela}",
                nome_arquivo=os.path.basename(uri_file)
            )
            if sql is None:
                return 'FALHA: NÃO FOI POSSÍVEL CRIAR INSTRUÇÃO SQL'

            if str(recriar_tabela) == '1':
                schema = None
                schema = self.builder_list_schema(colunas_header)
                schema.append(bigquery.SchemaField('NOME_ARQUIVO_STANIS', 'STRING'))
                schema.append(bigquery.SchemaField('DT_CARREGAMENTO_STANIS', 'DATETIME')) 
                if self.table_exists(f"{projeto}.{dataset_id}.{tabela}") == True:
                    schema_tabela_original = self.my_get_schema_from_table(f"{projeto}.{dataset_id}.{tabela}") 
                else:
                    schema_tabela_original = []
                if self.my_compare_schemas(schema_tabela_original,schema) == True: # analisa se precisa destruir a tabela completamento ou pode usar o trunc   
                    self.my_truncate_table(f"{projeto}.{dataset_id}.{tabela}")
                else:
                    self.client_bq.delete_table(f"{projeto}.{dataset_id}.{tabela}", not_found_ok=True)
 
            if self.table_exists(f"{projeto}.{dataset_id}.{tabela}") == False:
                schema = None
                schema = self.builder_list_schema(colunas_header)
                schema.append(bigquery.SchemaField('NOME_ARQUIVO_STANIS', 'STRING'))
                schema.append(bigquery.SchemaField('DT_CARREGAMENTO_STANIS', 'DATETIME'))
                                
                dataset_ref = self.client_bq.dataset(dataset_id)
                table_ref = dataset_ref.table(tabela)
                table = bigquery.Table(table_ref, schema=schema)
                self.client_bq.create_table(table)

            self.client_bq.query(sql).result()
            self.client_bq.delete_table(f"{projeto}.{dataset_id}.{table_temp}", not_found_ok=True)
            
            self.record_file_result_read(uri_file,1)
            
            return 'SUCESSO'
        except Exception as e:
            erro = str(e)
            try:
                self.client_bq.delete_table(f"{projeto}.{dataset_id}.{table_temp}", not_found_ok=True)
            except:
                pass
            return f'FALHA: {erro}'


    def record_file_result_read(self, uri_arq, resultado=1):
        try:
            endereco = "gs://ps-atlas-dl-finan-20220615_staging/"
            nome_arquivo = os.path.basename(uri_arq)
            local_bucket = str(uri_arq).replace(nome_arquivo,'').replace(endereco,'')
            
            if resultado == 1:
                resultado = 'SUCESSO'
            else:
                resultado = 'FALHA'
            
            sql = f"""
            UPDATE `ps-atlas-dl-finan-20220615.PRD00FINANCEIRO.CONTROLE_PASTA_IN` 
            SET STATUS_ARQUIVO = '{str(resultado)}'
            WHERE 1 = 1
            AND LOWER(LOCAL_BUCKET) = '{local_bucket.lower()}' 
            AND LOWER(NOME_ARQUIVO) = '{nome_arquivo.lower()}';"""
            self.client_bq.query(sql).result()
            return True
        except Exception as e:
            print(f'FALHA AO TENTAR REGISTRAR TABELA CONTROLE_PASTA_IN: {str(e)}')
            return False


    def record_sucess_update_table(self, tabela):
        try:
           
            sql = f"""
            INSERT INTO `ps-atlas-dl-finan-20220615.PRD00FINANCEIRO.CONTROLE` 
            (
              DT_EXECUCAO
             ,NOME_TABELA
             ,DT_ATUALIZACAO
             ,CHECK
            ) 
            SELECT 
                  CURRENT_DATETIME('UTC-3')
                ,'{str(tabela).upper()}'
                ,CURRENT_DATE('UTC-3')
                , TRUE;
            """
            self.client_bq.query(sql).result()
            return True
        except Exception as e:
            print(f'FALHA AO TENTAR REGISTRAR TABELA CONTROLE: {str(e)}')
            return False


    def find_file_to_process(self, local_bucket, inicio_arq):
        try:
            if str(local_bucket)[-1:] != '/':
                local_bucket += '/'
                
            endereco = "gs://ps-atlas-dl-finan-20220615_staging/"

            if str(inicio_arq)[-1] != '*':
                inicio_arq = f"{inicio_arq[0:-1]}%"

            if str(inicio_arq).find('*') >= 0:
                inicio_arq = str(inicio_arq).replace('*','%')
            
            sql = f"""
            SELECT 
                 LOCAL_BUCKET
                ,NOME_ARQUIVO
            FROM `ps-atlas-dl-finan-20220615.PRD00FINANCEIRO.CONTROLE_PASTA_IN` 
            WHERE SIZE_FILE <> '0' 
            AND STATUS_ARQUIVO IS NULL 
            AND LOWER(LOCAL_BUCKET) = '{str(local_bucket).lower()}' 
            AND LOWER(NOME_ARQUIVO) LIKE '{str(inicio_arq).lower()}.csv'  
            ORDER BY DT_ULT_ALT_ARQUIVO ASC, DATA_ENTRADA ASC, NOME_ARQUIVO ASC 
            LIMIT 1
            """
            retorno = self.client_bq.query(sql).result() 
            find_file = False
            for row in retorno:
                endereco += str(row[0]) 
                endereco += str(row[1]) 
                find_file = True
                break
            
            if find_file:
                return endereco
            else:
                return ''
        except Exception as e:
            return f'FALHA: {str(e)}'