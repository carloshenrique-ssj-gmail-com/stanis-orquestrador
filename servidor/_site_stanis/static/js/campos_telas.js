window.telasData = {
    "telas":[
                {
                    "identidade": 1,
                    "campos": [
                                {
                                    "type": "text",
                                    "id": "dir_origem",
                                    "name": "dir_origem",
                                    "required": "",
                                    "maxlength": "600",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Dir. Origem"
                                },
                                {
                                    "type": "text",
                                    "id": "dir_destino",
                                    "name": "dir_destino",
                                    "required": "",
                                    "maxlength": "600",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Dir. Destino"
                                },
                                {
                                    "type": "select",
                                    "id": "acao",
                                    "name": "acao",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Ação",
                                    "options": [
                                    {
                                        "value": "M",
                                        "text": "Mover"
                                    },
                                    {
                                        "value": "C",
                                        "text": "Copiar"
                                    }
                                    ]
                                },
                                {
                                    "type": "text",
                                    "id": "ini_arq",
                                    "name": "ini_arq",
                                    "maxlength": "150",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:94%",
                                    "label": "Inicio Arq"
                                },
                                {
                                    "type": "text",
                                    "id": "extensao_arq",
                                    "name": "extensao_arq",
                                    "maxlength": "3",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "3 Caract. Fim Arq"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_programada",
                                    "name": "hora_programada",
                                    "min": "00:01",
                                    "max": "23:00",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Hora Execução"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_fim",
                                    "name": "hora_fim",
                                    "min": "00:02",
                                    "max": "23:59",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Hora Limite"
                                },
                                {
                                    "type": "select",
                                    "id": "recorrencia",
                                    "name": "recorrencia",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "onChange": "funcao_frequencia_grafico();",
                                    "label": "Recorrencia",
                                    "options": [
                                    {
                                        "value": "1",
                                        "text": "Diaria"
                                    },
                                    {
                                        "value": "2",
                                        "text": "Seg-Sex"
                                    },
                                    {
                                        "value": "3",
                                        "text": "Mensal"
                                    },
                                    {
                                        "value": "4",
                                        "text": "Semanal"
                                    }
                                    ]
                                },
                                {
                                    "type": "number",
                                    "disabled": "",
                                    "id": "dia_mes",
                                    "name": "dia_mes",
                                    "min": "1",
                                    "max": "31",
                                    "value": "",
                                    "onKeyUp": "if(value<0 || value>31) value='';",
                                    "maxlength": "2",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Dia"
                                },
                                {
                                    "type": "text",
                                    "id": "id_dependencia",
                                    "name": "id_dependencia",
                                    "value": "",
                                    "onKeyPress": "return filtroTeclas(event);",
                                    "maxlength": "50",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Depende da Tarefa"
                                },
                                {
                                    "type": "select",
                                    "id": "id_chat",
                                    "name": "id_chat",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Chat",
                                    "optionsSource": {
                                    "collection": "chats",
                                    "valueField": "codigo",
                                    "textField": "nome_grupo",
                                    "includeEmpty": true
                                    }
                                },
                                {
                                    "type": "text",
                                    "id": "descricao",
                                    "name": "descricao",
                                    "maxlength": "100",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Nome Tarefa"
                                },
                                {
                                    "type": "number",
                                    "id": "wrk_fixo",
                                    "name": "wrk_fixo",
                                    "min": "0",
                                    "max": "9999",
                                    "value": "0",
                                    "onKeyUp": "if(value<0 || value>9999) value='';",
                                    "maxlength": "7",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Worker"
                                },
                                {
                                    "type": "select",
                                    "id": "host_fixo",
                                    "name": "host_fixo",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "title": "Só informe um Host Fixo se for obrigatório a tarefa rodar nesta maquina.",
                                    "label": "Host Fixo",
                                    "options": [
                                    {
                                        "value": "0",
                                        "text": "Livre"
                                    }
                                    ]
                                },
                                {
                                    "type": "textarea",
                                    "title": "Este campo, no momento, não é obrigatório, mas é uma boa prática de controle de atividades descrever o que será executado neste processo.",
                                    "id": "obs",
                                    "name": "obs",
                                    "value": "",
                                    "maxlength": "4000",
                                    "cols": "150",
                                    "rows": "2",
                                    "class": "txt",
                                    "style": "width:100%",
                                    "label": "Doc"
                                }
                        ]
                },
                {
                    "identidade": 2,
                    "campos":[

                                {
                                    "type": "text",
                                    "id": "dir_origem",
                                    "name": "dir_origem",
                                    "required": "",
                                    "maxlength": "600",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Dir. Origem"
                                },
                                {
                                    "type": "text",
                                    "id": "dir_destino",
                                    "name": "dir_destino",
                                    "required": "",
                                    "maxlength": "600",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Dir. Destino GCP"
                                },
                                {
                                    "type": "text",
                                    "id": "ini_arq",
                                    "name": "ini_arq",
                                    "maxlength": "150",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Inicio Arq"
                                },
                                {
                                    "type": "text",
                                    "id": "extensao_arq",
                                    "name": "extensao_arq",
                                    "maxlength": "3",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "3 Caract. Fim Arq"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_programada",
                                    "name": "hora_programada",
                                    "min": "00:01",
                                    "max": "23:00",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Hora Execução"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_fim",
                                    "name": "hora_fim",
                                    "min": "00:02",
                                    "max": "23:59",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Hora Limite"
                                },
                                {
                                    "type": "select",
                                    "id": "recorrencia",
                                    "name": "recorrencia",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "onChange": "funcao_frequencia_grafico();",
                                    "label": "Recorrencia",
                                    "options": [
                                    {
                                        "value": "1",
                                        "text": "Diaria"
                                    },
                                    {
                                        "value": "2",
                                        "text": "Seg-Sex"
                                    },
                                    {
                                        "value": "3",
                                        "text": "Mensal"
                                    },
                                    {
                                        "value": "4",
                                        "text": "Semanal"
                                    }
                                    ]
                                },
                                {
                                    "type": "number",
                                    "disabled": "",
                                    "id": "dia_mes",
                                    "name": "dia_mes",
                                    "min": "1",
                                    "max": "31",
                                    "value": "",
                                    "onKeyUp": "if(value<0 || value>31) value='';",
                                    "maxlength": "2",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Dia"
                                },
                                {
                                    "type": "text",
                                    "id": "id_dependencia",
                                    "name": "id_dependencia",
                                    "value": "",
                                    "onKeyPress": "return filtroTeclas(event);",
                                    "maxlength": "50",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Depende da Tarefa"
                                },
                                {
                                    "type": "select",
                                    "id": "id_chat",
                                    "name": "id_chat",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Chat",
                                    "optionsSource": {
                                    "collection": "chats",
                                    "valueField": "codigo",
                                    "textField": "nome_grupo",
                                    "includeEmpty": true
                                    }
                                },
                                {
                                    "type": "text",
                                    "id": "descricao",
                                    "name": "descricao",
                                    "maxlength": "100",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Nome Tarefa"
                                },
                                {
                                    "type": "number",
                                    "id": "wrk_fixo",
                                    "name": "wrk_fixo",
                                    "min": "0",
                                    "max": "9999",
                                    "value": "0",
                                    "onKeyUp": "if(value<0 || value>9999) value='';",
                                    "maxlength": "4",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Worker"
                                },
                                {
                                    "type": "select",
                                    "id": "host_fixo",
                                    "name": "host_fixo",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "title": "Só informe um Host Fixo se for obrigatório a tarefa rodar nesta maquina.",
                                    "label": "Host Fixo",
                                    "options": [
                                    {
                                        "value": "0",
                                        "text": "Livre"
                                    }
                                    ]
                                },
                                {
                                    "type": "textarea",
                                    "title": "Este campo, no momento, não é obrigatório, mas é uma boa prática de controle de atividades descrever o que será executado neste processo.",
                                    "id": "obs",
                                    "name": "obs",
                                    "value": "",
                                    "maxlength": "4000",
                                    "cols": "150",
                                    "rows": "2",
                                    "class": "txt",
                                    "style": "width:100%",
                                    "label": "Doc"
                                }
                                                       
                    ]                    
                },
                {   
                    "identidade": 3,
                    "campos":[

                                {
                                    "type": "text",
                                    "id": "dir_origem",
                                    "name": "dir_origem",
                                    "required": "",
                                    "maxlength": "600",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Dir. Origem GCP"
                                },
                                {
                                    "type": "text",
                                    "id": "dir_destino",
                                    "name": "dir_destino",
                                    "required": "",
                                    "maxlength": "600",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Dir. Destino"
                                },
                                {
                                    "type": "text",
                                    "id": "ini_arq",
                                    "name": "ini_arq",
                                    "maxlength": "150",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Inicio Arq"
                                },
                                {
                                    "type": "text",
                                    "id": "extensao_arq",
                                    "name": "extensao_arq",
                                    "maxlength": "3",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "3 Caract. Fim Arq"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_programada",
                                    "name": "hora_programada",
                                    "min": "00:01",
                                    "max": "23:00",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Hora Execução"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_fim",
                                    "name": "hora_fim",
                                    "min": "00:02",
                                    "max": "23:59",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Hora Limite"
                                },
                                {
                                    "type": "select",
                                    "id": "recorrencia",
                                    "name": "recorrencia",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "onChange": "funcao_frequencia_grafico();",
                                    "label": "Recorrencia",
                                    "options": [
                                    {
                                        "value": "1",
                                        "text": "Diaria"
                                    },
                                    {
                                        "value": "2",
                                        "text": "Seg-Sex"
                                    },
                                    {
                                        "value": "3",
                                        "text": "Mensal"
                                    },
                                    {
                                        "value": "4",
                                        "text": "Semanal"
                                    }
                                    ]
                                },
                                {
                                    "type": "number",
                                    "disabled": "",
                                    "id": "dia_mes",
                                    "name": "dia_mes",
                                    "min": "1",
                                    "max": "31",
                                    "value": "",
                                    "onKeyUp": "if(value<0 || value>31) value='';",
                                    "maxlength": "2",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Dia"
                                },
                                {
                                    "type": "text",
                                    "id": "id_dependencia",
                                    "name": "id_dependencia",
                                    "value": "",
                                    "onKeyPress": "return filtroTeclas(event);",
                                    "maxlength": "50",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Depende da Tarefa"
                                },
                                {
                                    "type": "select",
                                    "id": "id_chat",
                                    "name": "id_chat",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Chat",
                                    "optionsSource": {
                                    "collection": "chats",
                                    "valueField": "codigo",
                                    "textField": "nome_grupo",
                                    "includeEmpty": true
                                    }
                                },
                                {
                                    "type": "text",
                                    "id": "descricao",
                                    "name": "descricao",
                                    "maxlength": "100",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Nome Tarefa"
                                },
                                {
                                    "type": "number",
                                    "id": "wrk_fixo",
                                    "name": "wrk_fixo",
                                    "min": "0",
                                    "max": "9999",
                                    "value": "0",
                                    "onKeyUp": "if(value<0 || value>9999) value='';",
                                    "maxlength": "4",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Worker"
                                },
                                {
                                    "type": "select",
                                    "id": "host_fixo",
                                    "name": "host_fixo",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "title": "Só informe um Host Fixo se for obrigatório a tarefa rodar nesta maquina.",
                                    "label": "Host Fixo",
                                    "options": [
                                    {
                                        "value": "0",
                                        "text": "Livre"
                                    }
                                    ]
                                },
                                {
                                    "type": "textarea",
                                    "title": "Este campo, no momento, não é obrigatório, mas é uma boa prática de controle de atividades descrever o que será executado neste processo.",
                                    "id": "obs",
                                    "name": "obs",
                                    "value": "",
                                    "maxlength": "4000",
                                    "cols": "150",
                                    "rows": "2",
                                    "class": "txt",
                                    "style": "width:100%",
                                    "label": "Doc"
                                }
                    ]
                },
                {
                    "identidade": 4,
                    "campos": [
                                {
                                    "type": "text",
                                    "title": "Parâmetros da procedure podem ser enviados separados por pipe \"|\"",
                                    "id": "dir_origem",
                                    "name": "dir_origem",
                                    "required": "",
                                    "maxlength": "600",
                                    "class": "txt",
                                    "style": "width:99%",
                                    "label": "Procedure GCP"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_programada",
                                    "name": "hora_programada",
                                    "min": "00:01",
                                    "max": "23:00",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Hora Execução"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_fim",
                                    "name": "hora_fim",
                                    "min": "00:02",
                                    "max": "23:00",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Hora Limite"
                                },
                                {
                                    "type": "select",
                                    "id": "recorrencia",
                                    "name": "recorrencia",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:99%",
                                    "onChange": "funcao_frequencia_grafico();",
                                    "label": "Recorrencia",
                                    "options": [
                                    {
                                        "value": "1",
                                        "text": "Diaria"
                                    },
                                    {
                                        "value": "2",
                                        "text": "Seg-Sex"
                                    },
                                    {
                                        "value": "3",
                                        "text": "Mensal"
                                    },
                                    {
                                        "value": "4",
                                        "text": "Semanal"
                                    }
                                    ]
                                },
                                {
                                    "type": "number",
                                    "disabled": "",
                                    "id": "dia_mes",
                                    "name": "dia_mes",
                                    "min": "1",
                                    "max": "31",
                                    "value": "",
                                    "onKeyUp": "if(value<0 || value>31) value='';",
                                    "maxlength": "2",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Dia"
                                },
                                {
                                    "type": "text",
                                    "id": "id_dependencia",
                                    "name": "id_dependencia",
                                    "value": "",
                                    "onKeyPress": "return filtroTeclas(event);",
                                    "maxlength": "50",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Depende da Tarefa"
                                },
                                {
                                    "type": "select",
                                    "id": "id_chat",
                                    "name": "id_chat",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:99%",
                                    "label": "Chat",
                                    "optionsSource": {
                                    "collection": "chats",
                                    "valueField": "codigo",
                                    "textField": "nome_grupo",
                                    "includeEmpty": true
                                    }
                                },
                                {
                                    "type": "text",
                                    "id": "descricao",
                                    "name": "descricao",
                                    "maxlength": "100",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Nome Tarefa"
                                },
                                {
                                    "type": "number",
                                    "id": "wrk_fixo",
                                    "name": "wrk_fixo",
                                    "min": "0",
                                    "max": "9999",
                                    "value": "0",
                                    "onKeyUp": "if(value<0 || value>9999) value='';",
                                    "maxlength": "4",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Worker"
                                },
                                {
                                    "type": "select",
                                    "id": "host_fixo",
                                    "name": "host_fixo",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "title": "Só informe um Host Fixo se for obrigatório a tarefa rodar nesta maquina.",
                                    "label": "Host Fixo",
                                    "options": [
                                    {
                                        "value": "0",
                                        "text": "Livre"
                                    }
                                    ]
                                },
                                {
                                    "type": "textarea",
                                    "title": "Este campo, no momento, não é obrigatório, mas é uma boa prática de controle de atividades descrever o que será executado neste processo.",
                                    "id": "obs",
                                    "name": "obs",
                                    "value": "",
                                    "maxlength": "4000",
                                    "cols": "150",
                                    "rows": "2",
                                    "class": "txt",
                                    "style": "width:100%",
                                    "label": "Doc"
                                }                        
                    ]
                },
                {
                    "identidade": 5,
                    "campos": [
                                {
                                    "type": "text",
                                    "id": "dir_origem",
                                    "name": "dir_origem",
                                    "required": "",
                                    "maxlength": "600",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Caminho completo script Python"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_programada",
                                    "name": "hora_programada",
                                    "min": "00:01",
                                    "max": "23:00",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Hora Execução"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_fim",
                                    "name": "hora_fim",
                                    "min": "00:02",
                                    "max": "23:59",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Hora Limite"
                                },
                                {
                                    "type": "select",
                                    "id": "recorrencia",
                                    "name": "recorrencia",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "onChange": "funcao_frequencia_grafico();",
                                    "label": "Recorrencia",
                                    "options": [
                                    {
                                        "value": "1",
                                        "text": "Diaria"
                                    },
                                    {
                                        "value": "2",
                                        "text": "Seg-Sex"
                                    },
                                    {
                                        "value": "3",
                                        "text": "Mensal"
                                    },
                                    {
                                        "value": "4",
                                        "text": "Semanal"
                                    }
                                    ]
                                },
                                {
                                    "type": "number",
                                    "disabled": "",
                                    "id": "dia_mes",
                                    "name": "dia_mes",
                                    "min": "1",
                                    "max": "31",
                                    "value": "",
                                    "onKeyUp": "if(value<0 || value>31) value='';",
                                    "maxlength": "2",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Dia"
                                },
                                {
                                    "type": "text",
                                    "id": "id_dependencia",
                                    "name": "id_dependencia",
                                    "value": "",
                                    "onKeyPress": "return filtroTeclas(event);",
                                    "maxlength": "50",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Depende da Tarefa"
                                },
                                {
                                    "type": "select",
                                    "id": "id_chat",
                                    "name": "id_chat",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Chat",
                                    "optionsSource": {
                                    "collection": "chats",
                                    "valueField": "codigo",
                                    "textField": "nome_grupo",
                                    "includeEmpty": true
                                    }
                                },
                                {
                                    "type": "text",
                                    "id": "descricao",
                                    "name": "descricao",
                                    "maxlength": "100",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Nome Tarefa"
                                },
                                {
                                    "type": "number",
                                    "id": "wrk_fixo",
                                    "name": "wrk_fixo",
                                    "min": "0",
                                    "max": "9999",
                                    "value": "0",
                                    "onKeyUp": "if(value<0 || value>9999) value='';",
                                    "maxlength": "4",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Worker"
                                },
                                {
                                    "type": "select",
                                    "id": "tag_bloq",
                                    "name": "tag_bloq",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "onChange": "novo_valor_select(this.selectedIndex, this);",
                                    "label": "Tag Bloq",
                                    "optionsSource": {
                                    "collection": "tags",
                                    "valueField": "tag_bloq",
                                    "textField": "tag_bloq",
                                    "includeEmpty": true
                                    }
                                },
                                {
                                    "type": "select",
                                    "id": "host_fixo",
                                    "name": "host_fixo",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "title": "Só informe um Host Fixo se for obrigatório a tarefa rodar nesta maquina.",
                                    "label": "Host Fixo",
                                    "options": [
                                    {
                                        "value": "0",
                                        "text": "Livre"
                                    }
                                    ]
                                },
                                {
                                    "type": "textarea",
                                    "title": "Este campo, no momento, não é obrigatório, mas é uma boa prática de controle de atividades descrever o que será executado neste processo.",
                                    "id": "obs",
                                    "name": "obs",
                                    "value": "",
                                    "maxlength": "4000",
                                    "cols": "150",
                                    "rows": "2",
                                    "class": "txt",
                                    "style": "width:100%",
                                    "label": "Doc"
                                }                        
                    ]   
                },
                {
                    "identidade": 6,
                    "campos":
                    [
                            {
                                "type": "text",
                                "id": "dir_origem",
                                "name": "dir_origem",
                                "required": "",
                                "maxlength": "600",
                                "class": "txt",
                                "style": "width:99%",
                                "label": "Caminho completo do SAS EGP"
                            },
                            {
                                "type": "time",
                                "id": "hora_programada",
                                "name": "hora_programada",
                                "min": "00:01",
                                "max": "23:00",
                                "required": "",
                                "class": "txt",
                                "style": "width:97%",
                                "label": "Hora Execução"
                            },
                            {
                                "type": "time",
                                "id": "hora_fim",
                                "name": "hora_fim",
                                "min": "00:02",
                                "max": "23:59",
                                "required": "",
                                "class": "txt",
                                "style": "width:97%",
                                "label": "Hora Limite"
                            },
                            {
                                "type": "select",
                                "id": "recorrencia",
                                "name": "recorrencia",
                                "required": "",
                                "class": "txt",
                                "style": "width:97%",
                                "onChange": "funcao_frequencia_grafico();",
                                "label": "Recorrencia",
                                "options": [
                                {
                                    "value": "1",
                                    "text": "Diaria"
                                },
                                {
                                    "value": "2",
                                    "text": "Seg-Sex"
                                },
                                {
                                    "value": "3",
                                    "text": "Mensal"
                                },
                                {
                                    "value": "4",
                                    "text": "Semanal"
                                }
                                ]
                            },
                            {
                                "type": "number",
                                "disabled": "",
                                "id": "dia_mes",
                                "name": "dia_mes",
                                "min": "1",
                                "max": "31",
                                "value": "",
                                "onKeyUp": "if(value<0 || value>31) value='';",
                                "maxlength": "2",
                                "class": "txt",
                                "style": "width:97%",
                                "label": "Dia"
                            },
                            {
                                "type": "text",
                                "id": "id_dependencia",
                                "name": "id_dependencia",
                                "value": "",
                                "onKeyPress": "return filtroTeclas(event);",
                                "maxlength": "50",
                                "class": "txt",
                                "style": "width:97%",
                                "label": "Depende da Tarefa"
                            },
                            {
                                "type": "select",
                                "id": "id_chat",
                                "name": "id_chat",
                                "required": "",
                                "class": "txt",
                                "style": "width:97%",
                                "label": "Chat",
                                "optionsSource": {
                                "collection": "chats",
                                "valueField": "codigo",
                                "textField": "nome_grupo",
                                "includeEmpty": true
                                }
                            },
                            {
                                "type": "text",
                                "id": "descricao",
                                "name": "descricao",
                                "maxlength": "100",
                                "required": "",
                                "class": "txt",
                                "style": "width:99%",
                                "label": "Nome Tarefa"
                            },
                            {
                                "type": "number",
                                "id": "wrk_fixo",
                                "name": "wrk_fixo",
                                "min": "0",
                                "max": "9999",
                                "value": "0",
                                "onKeyUp": "if(value<0 || value>9999) value='';",
                                "maxlength": "4",
                                "class": "txt",
                                "style": "width:96%",
                                "label": "Worker"
                            },
                            {
                                "type": "select",
                                "id": "host_fixo",
                                "name": "host_fixo",
                                "required": "",
                                "class": "txt",
                                "style": "width:97%",
                                "title": "Só informe um Host Fixo se for obrigatório a tarefa rodar nesta maquina.",
                                "label": "Host Fixo",
                                "options": [
                                {
                                    "value": "0",
                                    "text": "Livre"
                                }
                                ]
                            },
                            {
                                "type": "textarea",
                                "title": "Este campo, no momento, não é obrigatório, mas é uma boa prática de controle de atividades descrever o que será executado neste processo.",
                                "id": "obs",
                                "name": "obs",
                                "value": "",
                                "maxlength": "4000",
                                "cols": "150",
                                "rows": "2",
                                "class": "txt",
                                "style": "width:100%",
                                "label": "Obs"
                            }                       
                    ]
                },
                {
                    "identidade": 7,
                    "campos":[

                                {
                                    "type": "text",
                                    "id": "dir_origem",
                                    "name": "dir_origem",
                                    "required": "",
                                    "maxlength": "600",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Endereço Arquivo Excel (xlsm)"
                                },
                                {
                                    "type": "text",
                                    "id": "dir_destino",
                                    "name": "dir_destino",
                                    "required": "",
                                    "maxlength": "600",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Mome da Macro"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_programada",
                                    "name": "hora_programada",
                                    "min": "00:01",
                                    "max": "23:00",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Hora Execução"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_fim",
                                    "name": "hora_fim",
                                    "min": "00:02",
                                    "max": "23:59",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Hora Limite"
                                },
                                {
                                    "type": "select",
                                    "id": "recorrencia",
                                    "name": "recorrencia",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "onChange": "funcao_frequencia_grafico();",
                                    "label": "Recorrencia",
                                    "options": [
                                    {
                                        "value": "1",
                                        "text": "Diaria"
                                    },
                                    {
                                        "value": "2",
                                        "text": "Seg-Sex"
                                    },
                                    {
                                        "value": "3",
                                        "text": "Mensal"
                                    },
                                    {
                                        "value": "4",
                                        "text": "Semanal"
                                    }
                                    ]
                                },
                                {
                                    "type": "number",
                                    "disabled": "",
                                    "id": "dia_mes",
                                    "name": "dia_mes",
                                    "min": "1",
                                    "max": "31",
                                    "value": "",
                                    "onKeyUp": "if(value<0 || value>31) value='';",
                                    "maxlength": "2",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Dia"
                                },
                                {
                                    "type": "text",
                                    "id": "id_dependencia",
                                    "name": "id_dependencia",
                                    "value": "",
                                    "onKeyPress": "return filtroTeclas(event);",
                                    "maxlength": "50",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Depende da Tarefa"
                                },
                                {
                                    "type": "select",
                                    "id": "id_chat",
                                    "name": "id_chat",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:96%",
                                    "label": "Chat",
                                    "optionsSource": {
                                    "collection": "chats",
                                    "valueField": "codigo",
                                    "textField": "nome_grupo",
                                    "includeEmpty": true
                                    }
                                },
                                {
                                    "type": "text",
                                    "id": "descricao",
                                    "name": "descricao",
                                    "maxlength": "100",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Nome Tarefa"
                                },
                                {
                                    "type": "number",
                                    "id": "wrk_fixo",
                                    "name": "wrk_fixo",
                                    "min": "0",
                                    "max": "9999",
                                    "value": "0",
                                    "onKeyUp": "if(value<0 || value>9999) value='';",
                                    "maxlength": "4",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Worker"
                                },
                                {
                                    "type": "select",
                                    "id": "tag_bloq",
                                    "name": "tag_bloq",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "onChange": "novo_valor_select(this.selectedIndex, this);",
                                    "label": "Tag Bloq",
                                    "optionsSource": {
                                    "collection": "tags",
                                    "valueField": "tag_bloq",
                                    "textField": "tag_bloq",
                                    "includeEmpty": true
                                    }
                                },
                                {
                                    "type": "select",
                                    "id": "host_fixo",
                                    "name": "host_fixo",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "title": "Só informe um Host Fixo se for obrigatório a tarefa rodar nesta maquina.",
                                    "label": "Host Fixo",
                                    "options": [
                                    {
                                        "value": "0",
                                        "text": "Livre"
                                    }
                                    ]
                                },
                                {
                                    "type": "textarea",
                                    "title": "Este campo, no momento, não é obrigatório, mas é uma boa prática de controle de atividades descrever o que será executado neste processo.",
                                    "id": "obs",
                                    "name": "obs",
                                    "value": "",
                                    "maxlength": "4000",
                                    "cols": "150",
                                    "rows": "2",
                                    "class": "txt",
                                    "style": "width:100%",
                                    "label": "Doc"
                                }                        

                    ]
                }
                ,
                {
                    "identidade": 8,
                    "campos":[

                                {
                                    "type": "text",
                                    "id": "dir_origem",
                                    "name": "dir_origem",
                                    "required": "",
                                    "maxlength": "600",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Dir. Origem"
                                },
                                {
                                    "type": "text",
                                    "id": "dir_destino",
                                    "name": "dir_destino",
                                    "required": "",
                                    "maxlength": "600",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Dir. Destino SAS"
                                },
                                {
                                    "type": "select",
                                    "id": "acao",
                                    "name": "acao",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Ação",
                                    "options": [
                                    {
                                        "value": "M",
                                        "text": "Mover"
                                    },
                                    {
                                        "value": "C",
                                        "text": "Copiar"
                                    }
                                    ]
                                },
                                {
                                    "type": "text",
                                    "id": "ini_arq",
                                    "name": "ini_arq",
                                    "maxlength": "150",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Inicio Arq"
                                },
                                {
                                    "type": "text",
                                    "id": "extensao_arq",
                                    "name": "extensao_arq",
                                    "maxlength": "3",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:50%",
                                    "label": "3 Caract. Fim Arq"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_programada",
                                    "name": "hora_programada",
                                    "min": "00:01",
                                    "max": "23:00",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Hora Execução"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_fim",
                                    "name": "hora_fim",
                                    "min": "00:02",
                                    "max": "23:59",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Hora Limite"
                                },
                                {
                                    "type": "select",
                                    "id": "recorrencia",
                                    "name": "recorrencia",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "onChange": "funcao_frequencia_grafico();",
                                    "label": "Recorrencia",
                                    "options": [
                                    {
                                        "value": "1",
                                        "text": "Diaria"
                                    },
                                    {
                                        "value": "2",
                                        "text": "Seg-Sex"
                                    },
                                    {
                                        "value": "3",
                                        "text": "Mensal"
                                    },
                                    {
                                        "value": "4",
                                        "text": "Semanal"
                                    }
                                    ]
                                },
                                {
                                    "type": "number",
                                    "disabled": "",
                                    "id": "dia_mes",
                                    "name": "dia_mes",
                                    "min": "1",
                                    "max": "31",
                                    "value": "",
                                    "onKeyUp": "if(value<0 || value>31) value='';",
                                    "maxlength": "2",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Dia"
                                },
                                {
                                    "type": "text",
                                    "id": "id_dependencia",
                                    "name": "id_dependencia",
                                    "value": "",
                                    "onKeyPress": "return filtroTeclas(event);",
                                    "maxlength": "50",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Depende da Tarefa"
                                },
                                {
                                    "type": "select",
                                    "id": "id_chat",
                                    "name": "id_chat",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Chat",
                                    "optionsSource": {
                                    "collection": "chats",
                                    "valueField": "codigo",
                                    "textField": "nome_grupo",
                                    "includeEmpty": true
                                    }
                                },
                                {
                                    "type": "text",
                                    "id": "descricao",
                                    "name": "descricao",
                                    "maxlength": "100",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Nome Tarefa"
                                },
                                {
                                    "type": "number",
                                    "id": "wrk_fixo",
                                    "name": "wrk_fixo",
                                    "min": "0",
                                    "max": "9999",
                                    "value": "0",
                                    "onKeyUp": "if(value<0 || value>9999) value='';",
                                    "maxlength": "4",
                                    "class": "txt",
                                    "style": "width:100%",
                                    "label": "Worker"
                                },
                                {
                                    "type": "select",
                                    "id": "host_fixo",
                                    "name": "host_fixo",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "title": "Só informe um Host Fixo se for obrigatório a tarefa rodar nesta maquina.",
                                    "label": "Host Fixo",
                                    "options": [
                                    {
                                        "value": "0",
                                        "text": "Livre"
                                    }
                                    ]
                                },
                                {
                                    "type": "textarea",
                                    "title": "Este campo, no momento, não é obrigatório, mas é uma boa prática de controle de atividades descrever o que será executado neste processo.",
                                    "id": "obs",
                                    "name": "obs",
                                    "value": "",
                                    "maxlength": "4000",
                                    "cols": "150",
                                    "rows": "2",
                                    "class": "txt",
                                    "style": "width:100%",
                                    "label": "Obs"
                                }                        
                        
                    ]
                },
                {
                    "identidade":9,
                    "campos":[

                                {
                                    "type": "text",
                                    "id": "dir_origem",
                                    "name": "dir_origem",
                                    "required": "",
                                    "maxlength": "600",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Dir. Origem SAS"
                                },
                                {
                                    "type": "text",
                                    "id": "dir_destino",
                                    "name": "dir_destino",
                                    "required": "",
                                    "maxlength": "600",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Dir. Destino Local"
                                },
                                {
                                    "type": "select",
                                    "id": "acao",
                                    "name": "acao",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Ação",
                                    "options": [
                                    {
                                        "value": "M",
                                        "text": "Mover"
                                    },
                                    {
                                        "value": "C",
                                        "text": "Copiar"
                                    }
                                    ]
                                },
                                {
                                    "type": "text",
                                    "id": "ini_arq",
                                    "name": "ini_arq",
                                    "maxlength": "150",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Inicio Arq"
                                },
                                {
                                    "type": "text",
                                    "id": "extensao_arq",
                                    "name": "extensao_arq",
                                    "maxlength": "3",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:50%",
                                    "label": "3 Caract. Fim Arq"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_programada",
                                    "name": "hora_programada",
                                    "min": "00:01",
                                    "max": "23:00",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Hora Execução"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_fim",
                                    "name": "hora_fim",
                                    "min": "00:02",
                                    "max": "23:59",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Hora Limite"
                                },
                                {
                                    "type": "select",
                                    "id": "recorrencia",
                                    "name": "recorrencia",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "onChange": "funcao_frequencia_grafico();",
                                    "label": "Recorrencia",
                                    "options": [
                                    {
                                        "value": "1",
                                        "text": "Diaria"
                                    },
                                    {
                                        "value": "2",
                                        "text": "Seg-Sex"
                                    },
                                    {
                                        "value": "3",
                                        "text": "Mensal"
                                    },
                                    {
                                        "value": "4",
                                        "text": "Semanal"
                                    }
                                    ]
                                },
                                {
                                    "type": "number",
                                    "disabled": "",
                                    "id": "dia_mes",
                                    "name": "dia_mes",
                                    "min": "1",
                                    "max": "31",
                                    "value": "",
                                    "onKeyUp": "if(value<0 || value>31) value='';",
                                    "maxlength": "2",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Dia"
                                },
                                {
                                    "type": "text",
                                    "id": "id_dependencia",
                                    "name": "id_dependencia",
                                    "value": "",
                                    "onKeyPress": "return filtroTeclas(event);",
                                    "maxlength": "50",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Depende da Tarefa"
                                },
                                {
                                    "type": "select",
                                    "id": "id_chat",
                                    "name": "id_chat",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Chat",
                                    "optionsSource": {
                                    "collection": "chats",
                                    "valueField": "codigo",
                                    "textField": "nome_grupo",
                                    "includeEmpty": true
                                    }
                                },
                                {
                                    "type": "text",
                                    "id": "descricao",
                                    "name": "descricao",
                                    "maxlength": "100",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Nome Tarefa"
                                },
                                {
                                    "type": "number",
                                    "id": "wrk_fixo",
                                    "name": "wrk_fixo",
                                    "min": "0",
                                    "max": "9999",
                                    "value": "0",
                                    "onKeyUp": "if(value<0 || value>9999) value='';",
                                    "maxlength": "4",
                                    "class": "txt",
                                    "style": "width:100%",
                                    "label": "Worker"
                                },
                                {
                                    "type": "select",
                                    "id": "host_fixo",
                                    "name": "host_fixo",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "title": "Só informe um Host Fixo se for obrigatório a tarefa rodar nesta maquina.",
                                    "label": "Host Fixo",
                                    "options": [
                                    {
                                        "value": "0",
                                        "text": "Livre"
                                    }
                                    ]
                                },
                                {
                                    "type": "textarea",
                                    "title": "Este campo, no momento, não é obrigatório, mas é uma boa prática de controle de atividades descrever o que será executado neste processo.",
                                    "id": "obs",
                                    "name": "obs",
                                    "value": "",
                                    "maxlength": "4000",
                                    "cols": "150",
                                    "rows": "2",
                                    "class": "txt",
                                    "style": "width:100%",
                                    "label": "Doc"
                                }                        

                    ]
                },
                {
                    "identidade":10,
                    "campos":[

                                {
                                    "type": "text",
                                    "id": "dir_origem",
                                    "name": "dir_origem",
                                    "required": "",
                                    "maxlength": "600",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Caminho completo script VBS"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_programada",
                                    "name": "hora_programada",
                                    "min": "00:01",
                                    "max": "23:00",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Hora Execução"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_fim",
                                    "name": "hora_fim",
                                    "min": "00:02",
                                    "max": "23:59",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Hora Limite"
                                },
                                {
                                    "type": "select",
                                    "id": "recorrencia",
                                    "name": "recorrencia",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "onChange": "funcao_frequencia_grafico();",
                                    "label": "Recorrencia",
                                    "options": [
                                    {
                                        "value": "1",
                                        "text": "Diaria"
                                    },
                                    {
                                        "value": "2",
                                        "text": "Seg-Sex"
                                    },
                                    {
                                        "value": "3",
                                        "text": "Mensal"
                                    },
                                    {
                                        "value": "4",
                                        "text": "Semanal"
                                    }
                                    ]
                                },
                                {
                                    "type": "number",
                                    "disabled": "",
                                    "id": "dia_mes",
                                    "name": "dia_mes",
                                    "min": "1",
                                    "max": "31",
                                    "value": "",
                                    "onKeyUp": "if(value<0 || value>31) value='';",
                                    "maxlength": "2",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Dia"
                                },
                                {
                                    "type": "text",
                                    "id": "id_dependencia",
                                    "name": "id_dependencia",
                                    "value": "",
                                    "onKeyPress": "return filtroTeclas(event);",
                                    "maxlength": "50",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Depende da Tarefa"
                                },
                                {
                                    "type": "select",
                                    "id": "id_chat",
                                    "name": "id_chat",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Chat",
                                    "optionsSource": {
                                    "collection": "chats",
                                    "valueField": "codigo",
                                    "textField": "nome_grupo",
                                    "includeEmpty": true
                                    }
                                },
                                {
                                    "type": "text",
                                    "id": "descricao",
                                    "name": "descricao",
                                    "maxlength": "100",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Nome Tarefa"
                                },
                                {
                                    "type": "number",
                                    "id": "wrk_fixo",
                                    "name": "wrk_fixo",
                                    "min": "0",
                                    "max": "9999",
                                    "value": "0",
                                    "onKeyUp": "if(value<0 || value>9999) value='';",
                                    "maxlength": "4",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Worker"
                                },
                                {
                                    "type": "select",
                                    "id": "host_fixo",
                                    "name": "host_fixo",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "title": "Só informe um Host Fixo se for obrigatório a tarefa rodar nesta maquina.",
                                    "label": "Host Fixo",
                                    "options": [
                                    {
                                        "value": "0",
                                        "text": "Livre"
                                    }
                                    ]
                                },
                                {
                                    "type": "textarea",
                                    "title": "Este campo, no momento, não é obrigatório, mas é uma boa prática de controle de atividades descrever o que será executado neste processo.",
                                    "id": "obs",
                                    "name": "obs",
                                    "value": "",
                                    "maxlength": "4000",
                                    "cols": "150",
                                    "rows": "2",
                                    "class": "txt",
                                    "style": "width:100%",
                                    "label": "Doc"
                                }                        

                    ]
                },
                {
                    "identidade":11,
                    "campos":[

                                {
                                    "type": "text",
                                    "id": "dir_origem",
                                    "name": "dir_origem",
                                    "required": "",
                                    "maxlength": "600",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Endereço Arquivo Python"
                                },
                                {
                                    "type": "text",
                                    "id": "dir_destino",
                                    "name": "dir_destino",
                                    "required": "",
                                    "maxlength": "600",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Nome Função"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_programada",
                                    "name": "hora_programada",
                                    "min": "00:01",
                                    "max": "23:00",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Hora Execução"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_fim",
                                    "name": "hora_fim",
                                    "min": "00:02",
                                    "max": "23:59",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Hora Limite"
                                },
                                {
                                    "type": "select",
                                    "id": "recorrencia",
                                    "name": "recorrencia",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "onChange": "funcao_frequencia_grafico();",
                                    "label": "Recorrencia",
                                    "options": [
                                    {
                                        "value": "1",
                                        "text": "Diaria"
                                    },
                                    {
                                        "value": "2",
                                        "text": "Seg-Sex"
                                    },
                                    {
                                        "value": "3",
                                        "text": "Mensal"
                                    },
                                    {
                                        "value": "4",
                                        "text": "Semanal"
                                    }
                                    ]
                                },
                                {
                                    "type": "number",
                                    "disabled": "",
                                    "id": "dia_mes",
                                    "name": "dia_mes",
                                    "min": "1",
                                    "max": "31",
                                    "value": "",
                                    "onKeyUp": "if(value<0 || value>31) value='';",
                                    "maxlength": "2",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Dia"
                                },
                                {
                                    "type": "text",
                                    "id": "id_dependencia",
                                    "name": "id_dependencia",
                                    "value": "",
                                    "onKeyPress": "return filtroTeclas(event);",
                                    "maxlength": "50",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Depende da Tarefa"
                                },
                                {
                                    "type": "select",
                                    "id": "id_chat",
                                    "name": "id_chat",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Chat",
                                    "optionsSource": {
                                    "collection": "chats",
                                    "valueField": "codigo",
                                    "textField": "nome_grupo",
                                    "includeEmpty": true
                                    }
                                },
                                {
                                    "type": "text",
                                    "id": "descricao",
                                    "name": "descricao",
                                    "maxlength": "100",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Nome Tarefa"
                                },
                                {
                                    "type": "number",
                                    "id": "wrk_fixo",
                                    "name": "wrk_fixo",
                                    "min": "0",
                                    "max": "9999",
                                    "value": "0",
                                    "onKeyUp": "if(value<0 || value>9999) value='';",
                                    "maxlength": "4",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Worker"
                                },
                                {
                                    "type": "select",
                                    "id": "host_fixo",
                                    "name": "host_fixo",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "title": "Só informe um Host Fixo se for obrigatório a tarefa rodar nesta maquina.",
                                    "label": "Host Fixo",
                                    "options": [
                                    {
                                        "value": "0",
                                        "text": "Livre"
                                    }
                                    ]
                                },
                                {
                                    "type": "textarea",
                                    "title": "Este campo, no momento, não é obrigatório, mas é uma boa prática de controle de atividades descrever o que será executado neste processo.",
                                    "id": "obs",
                                    "name": "obs",
                                    "value": "",
                                    "maxlength": "4000",
                                    "cols": "150",
                                    "rows": "2",
                                    "class": "txt",
                                    "style": "width:100%",
                                    "label": "Doc"
                                }                        

                    ]
                },
                {
                    "identidade":12,
                    "campos":[

                                {
                                    "type": "text",
                                    "title": "Inicie o endereço a partir do diretório \"in\", exemplo: \"in/subpasta/\"",
                                    "id": "txt_bucket_dir",
                                    "name": "txt_bucket_dir",
                                    "required": "",
                                    "maxlength": "300",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Local Bucket"
                                },
                                {
                                    "type": "text",
                                    "title": "Informe o endereço da tabela de destino DATASET.TABELA",
                                    "id": "txt_tabela_destino",
                                    "name": "txt_tabela_destino",
                                    "required": "",
                                    "maxlength": "300",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Dataset.Tabela_Destino"
                                },
                                {
                                    "type": "text",
                                    "title": "Informe o inicio do arquivo a ser procurado",
                                    "id": "txt_ini_arq",
                                    "name": "txt_ini_arq",
                                    "required": "",
                                    "maxlength": "300",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Inicio do arquivo"
                                },
                                {
                                    "type": "text",
                                    "title": "Informe um caractere para ser considerado o separador do arquivo csv\"",
                                    "id": "txt_seperador",
                                    "name": "txt_seperador",
                                    "required": "",
                                    "maxlength": "1",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Separador"
                                },
                                {
                                    "type": "text",
                                    "title": "Liste as colunas do cabeçalho para criar a tabela. Não use acentos ou caracteres especiais. Separe as colunas apenas por ponto e virgula.",
                                    "id": "txt_lista_header",
                                    "name": "txt_lista_header",
                                    "required": "",
                                    "maxlength": "4500",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Colunas do Cabeçalho"
                                },
                                {
                                    "type": "text",
                                    "title": "Neste campo você informa uma ou mais colunas onde o sistema deve cruzar com a tabela já existe para evitar que a carga seja duplicada. Descreva as colunas, se necessário, sob as mesmas regras do item anterior: Liste as colunas do cabeçalho para criar a tabela. Não use acentos ou caracteres especiais. Separe as colunas apenas por ponto e virgula.",
                                    "id": "txt_lista_validar_duplicidade",
                                    "name": "txt_lista_validar_duplicidade",
                                    "required": "",
                                    "maxlength": "3000",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Colunas Para Evitar Duplicidade"
                                },
                                {
                                    "type": "select",
                                    "id": "txt_recriar_tabela",
                                    "name": "txt_recriar_tabela",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:100%",
                                    "title": "Neste campo você informa se o sistema deve recriar a tabela para cada arquivo lido. Se você informar \"Não\", todos os arquivo serão empilhados dentro da mesma tabela. Ao informar \"Sim\", você terá apenas o ultimo arquivo lido ao final do processo na tabela.",
                                    "label": "Recriar Tabela",
                                    "options": [
                                    {
                                        "value": "0",
                                        "text": "Não"
                                    },
                                    {
                                        "value": "1",
                                        "text": "Sim"
                                    }
                                    ]
                                },
                                {
                                    "type": "number",
                                    "id": "txt_linha_cabecalho",
                                    "name": "txt_linha_cabecalho",
                                    "min": "0",
                                    "max": "9999",
                                    "value": "0",
                                    "onKeyUp": "if(value<0 || value>9999) value='1';",
                                    "maxlength": "4",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "title": "Neste campo você informa a linha que o sistema deve considerar como a primeira linha que contém os dados depois do cabeçalho, se o arquivo não tiver cabeçalho informe 0 (zero).",
                                    "label": "Linha Inicio Dados"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_programada",
                                    "name": "hora_programada",
                                    "min": "00:01",
                                    "max": "23:00",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Hora Execução"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_fim",
                                    "name": "hora_fim",
                                    "min": "00:02",
                                    "max": "23:59",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Hora Limite"
                                },
                                {
                                    "type": "select",
                                    "id": "recorrencia",
                                    "name": "recorrencia",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "onChange": "funcao_frequencia_grafico();",
                                    "label": "Recorrencia",
                                    "options": [
                                    {
                                        "value": "1",
                                        "text": "Diaria"
                                    },
                                    {
                                        "value": "2",
                                        "text": "Seg-Sex"
                                    },
                                    {
                                        "value": "3",
                                        "text": "Mensal"
                                    },
                                    {
                                        "value": "4",
                                        "text": "Semanal"
                                    }
                                    ]
                                },
                                {
                                    "type": "number",
                                    "disabled": "",
                                    "id": "dia_mes",
                                    "name": "dia_mes",
                                    "min": "1",
                                    "max": "31",
                                    "value": "",
                                    "onKeyUp": "if(value<0 || value>31) value='';",
                                    "maxlength": "2",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Dia"
                                },
                                {
                                    "type": "text",
                                    "id": "id_dependencia",
                                    "name": "id_dependencia",
                                    "value": "",
                                    "onKeyPress": "return filtroTeclas(event);",
                                    "maxlength": "50",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Depende da Tarefa"
                                },
                                {
                                    "type": "select",
                                    "id": "id_chat",
                                    "name": "id_chat",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:99%",
                                    "label": "Chat",
                                    "optionsSource": {
                                    "collection": "chats",
                                    "valueField": "codigo",
                                    "textField": "nome_grupo",
                                    "includeEmpty": true
                                    }
                                },
                                {
                                    "type": "text",
                                    "id": "descricao",
                                    "name": "descricao",
                                    "maxlength": "100",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Nome Tarefa"
                                },
                                {
                                    "type": "number",
                                    "id": "wrk_fixo",
                                    "name": "wrk_fixo",
                                    "min": "0",
                                    "max": "9999",
                                    "value": "0",
                                    "onKeyUp": "if(value<0 || value>9999) value='';",
                                    "maxlength": "4",
                                    "class": "txt",
                                    "style": "width:100%",
                                    "label": "Worker"
                                },
                                {
                                    "type": "select",
                                    "id": "host_fixo",
                                    "name": "host_fixo",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "title": "Só informe um Host Fixo se for obrigatório a tarefa rodar nesta maquina.",
                                    "label": "Host Fixo",
                                    "options": [
                                    {
                                        "value": "0",
                                        "text": "Livre"
                                    }
                                    ]
                                },
                                {
                                    "type": "textarea",
                                    "title": "Este campo, no momento, não é obrigatório, mas é uma boa prática de controle de atividades descrever o que será executado neste processo.",
                                    "id": "obs",
                                    "name": "obs",
                                    "value": "",
                                    "maxlength": "4000",
                                    "cols": "150",
                                    "rows": "2",
                                    "class": "txt",
                                    "style": "width:100%",
                                    "label": "Doc"
                                }                        

                    ]
                },
                {
                    "identidade":13,
                    "campos":[

                                {
                                    "type": "text",
                                    "id": "dir_origem",
                                    "name": "dir_origem",
                                    "required": "",
                                    "maxlength": "600",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Dir. Origem"
                                },
                                {
                                    "type": "select",
                                    "id": "dir_destino",
                                    "name": "dir_destino",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Destino MFT",
                                    "options": [
                                    {
                                        "value": "",
                                        "text": ""
                                    },
                                    {
                                        "value": "\\\\pfs01\\financeiro\\dados_diretoria_financeira\\mft\\miscelanea",
                                        "text": "Miscelanea"
                                    },
                                    {
                                        "value": "\\\\pfs01\\financeiro\\dados_diretoria_financeira\\mft\\api",
                                        "text": "API"
                                    },
                                    {
                                        "value": "\\\\pfs01\\financeiro\\dados_diretoria_financeira\\mft\\cnab",
                                        "text": "CNAB"
                                    },
                                    {
                                        "value": "\\\\pfs01\\financeiro\\dados_diretoria_financeira\\mft\\ftp",
                                        "text": "SFTP"
                                    },
                                    {
                                        "value": "\\\\pfs01\\financeiro\\dados_diretoria_financeira\\mft\\recupera",
                                        "text": "Recupera"
                                    },
                                    {
                                        "value": "\\\\pfs01\\financeiro\\dados_diretoria_financeira\\mft\\google_drive",
                                        "text": "GoogleDrive"
                                    }
                                    ]
                                },
                                {
                                    "type": "text",
                                    "id": "ini_arq",
                                    "name": "ini_arq",
                                    "maxlength": "150",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:94%",
                                    "label": "Inicio Arq"
                                },
                                {
                                    "type": "select",
                                    "id": "extensao_arq",
                                    "name": "extensao_arq",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Ext.",
                                    "options": [
                                    {
                                        "value": "",
                                        "text": ""
                                    },
                                    {
                                        "value": "csv",
                                        "text": "CSV"
                                    }
                                    ]
                                },
                                {
                                    "type": "time",
                                    "id": "hora_programada",
                                    "name": "hora_programada",
                                    "min": "00:01",
                                    "max": "23:00",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Hora Execução"
                                },
                                {
                                    "type": "time",
                                    "id": "hora_fim",
                                    "name": "hora_fim",
                                    "min": "00:02",
                                    "max": "23:59",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Hora Limite"
                                },
                                {
                                    "type": "select",
                                    "id": "recorrencia",
                                    "name": "recorrencia",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "onChange": "funcao_frequencia_grafico();",
                                    "label": "Recorrencia",
                                    "options": [
                                    {
                                        "value": "1",
                                        "text": "Diaria"
                                    },
                                    {
                                        "value": "2",
                                        "text": "Seg-Sex"
                                    },
                                    {
                                        "value": "3",
                                        "text": "Mensal"
                                    },
                                    {
                                        "value": "4",
                                        "text": "Semanal"
                                    }
                                    ]
                                },
                                {
                                    "type": "number",
                                    "disabled": "",
                                    "id": "dia_mes",
                                    "name": "dia_mes",
                                    "min": "1",
                                    "max": "31",
                                    "value": "",
                                    "onKeyUp": "if(value<0 || value>31) value='';",
                                    "maxlength": "2",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Dia"
                                },
                                {
                                    "type": "text",
                                    "id": "id_dependencia",
                                    "name": "id_dependencia",
                                    "value": "",
                                    "onKeyPress": "return filtroTeclas(event);",
                                    "maxlength": "50",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Depende da Tarefa"
                                },
                                {
                                    "type": "select",
                                    "id": "id_chat",
                                    "name": "id_chat",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "label": "Chat",
                                    "optionsSource": {
                                    "collection": "chats",
                                    "valueField": "codigo",
                                    "textField": "nome_grupo",
                                    "includeEmpty": true
                                    }
                                },
                                {
                                    "type": "text",
                                    "id": "descricao",
                                    "name": "descricao",
                                    "maxlength": "100",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:98%",
                                    "label": "Nome Tarefa"
                                },
                                {
                                    "type": "number",
                                    "id": "wrk_fixo",
                                    "name": "wrk_fixo",
                                    "min": "0",
                                    "max": "9999",
                                    "value": "0",
                                    "onKeyUp": "if(value<0 || value>9999) value='';",
                                    "maxlength": "7",
                                    "class": "txt",
                                    "style": "width:95%",
                                    "label": "Worker"
                                },
                                {
                                    "type": "select",
                                    "id": "host_fixo",
                                    "name": "host_fixo",
                                    "required": "",
                                    "class": "txt",
                                    "style": "width:97%",
                                    "title": "Só informe um Host Fixo se for obrigatório a tarefa rodar nesta maquina.",
                                    "label": "Host Fixo",
                                    "options": [
                                    {
                                        "value": "0",
                                        "text": "Livre"
                                    }
                                    ]
                                },
                                {
                                    "type": "textarea",
                                    "title": "Este campo, no momento, não é obrigatório, mas é uma boa prática de controle de atividades descrever o que será executado neste processo.",
                                    "id": "obs",
                                    "name": "obs",
                                    "value": "",
                                    "maxlength": "4000",
                                    "cols": "150",
                                    "rows": "2",
                                    "class": "txt",
                                    "style": "width:100%",
                                    "label": "Doc"
                                }                        

                    ]
                }
            ]

};