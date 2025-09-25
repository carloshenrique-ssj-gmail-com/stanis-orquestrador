SELECT 
	 a.tipo_servico
    ,a.id_tarefa
    ,a.dir_origem
    ,a.dir_destino
    ,a.acao
    ,a.ini_arq
    ,a.extensao_arq
    ,a.recorrencia
    ,a.dia_mes
    ,a.hora_programada
	,CASE
		WHEN b.id_tarefa IS NULL AND a.id_dependencia IS NOT NULL THEN 'BLOQ'
		ELSE 'LIVRE'
	END AS bloq_dependencia
	,CASE
		WHEN c.id_tarefa IS NULL THEN 'LIVRE'
		WHEN c.log_execucao < CURRENT_DATE THEN 'LIVRE'
		ELSE 'BLOQ'
	END AS tarefa_em_executando
	,CASE
		WHEN a.recorrencia = '1' THEN 'LIVRE'
		WHEN a.recorrencia = '2' AND EXTRACT(DOW FROM CURRENT_DATE) NOT IN (6,0) THEN 'LIVRE'
		WHEN a.recorrencia = '3' AND EXTRACT(DAY FROM CURRENT_DATE) = a.dia_mes::INTEGER THEN 'LIVRE'
		WHEN a.recorrencia = '4' AND EXTRACT(DOW FROM CURRENT_DATE) = a.dia_mes::INTEGER THEN 'LIVRE'
		ELSE 'BLOQ'
	END AS pode_exe_hoje
    ,a.id_chat
	,CASE
		WHEN a.hora_fim_execucao IS NULL AND a.hora_ini_execucao IS NULL THEN '1960-01-01 00:00:01'
		WHEN a.hora_fim_execucao IS NULL AND a.hora_ini_execucao IS NOT NULL THEN a.hora_ini_execucao
		WHEN a.hora_fim_execucao IS NOT NULL AND a.hora_ini_execucao IS NULL THEN a.hora_fim_execucao
		WHEN a.hora_fim_execucao > a.hora_ini_execucao THEN a.hora_fim_execucao
		WHEN a.hora_ini_execucao > a.hora_fim_execucao THEN a.hora_ini_execucao
		ELSE '1960-01-01 00:00:01'
	END AS hr_ultima_execucao
    ,a.wrk_fixo
   FROM tbl_srvs a
   LEFT JOIN ( 
			SELECT 
				id_tarefa
			FROM tbl_srvs
            WHERE tbl_srvs.resultado_tarefa = 'SUCESSO' 
			AND tbl_srvs.hora_ini_execucao >= CURRENT_DATE
			) b ON a.id_dependencia = b.id_tarefa
   LEFT JOIN tbl_srvs_executando c ON a.id_tarefa = c.id_tarefa
   LEFT JOIN tbl_uni_srvs d ON a.id_tarefa = d.id_tarefa::INTEGER
  WHERE (a.estado_tarefa = 'ATIVO'
  AND CURRENT_TIME >= a.hora_programada::TIME
  AND CURRENT_TIME <= a.hora_fim::TIME 
  AND a.resultado_tarefa IN ('SUCESSO','FALHA') AND a.hora_fim_execucao < CURRENT_DATE 
  AND d.id_tarefa IS NOT NULL)
  OR (a.estado_tarefa = 'ATIVO' 
  AND CURRENT_TIME >= a.hora_programada::TIME 
  AND CURRENT_TIME <= a.hora_fim::TIME 
  AND a.resultado_tarefa NOT IN ('SUCESSO','FALHA') 
  AND d.id_tarefa IS NOT NULL)
  OR (a.estado_tarefa = 'ATIVO' 
  AND CURRENT_TIME >= a.hora_programada::TIME 
  AND CURRENT_TIME <= a.hora_fim::TIME 
  AND a.resultado_tarefa IS NULL 
  AND d.id_tarefa IS NOT NULL);