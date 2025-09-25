
function formatarColunas(txt_colunas) {
    txt_colunas = txt_colunas.replace(/[\r\n]+/g, '');
    txt_colunas = txt_colunas.replace(/[^a-zA-Z0-9,;_]/g, '');
    txt_colunas = txt_colunas.replace(/\s/g, '');
    txt_colunas = txt_colunas.replace(/;/g, ',');
    txt_colunas = txt_colunas.replace('NOME_ARQUIVO_STANIS', 'NOME_ARQUIVO_STANIS_9999');
    txt_colunas = txt_colunas.replace('DT_CARREGAMENTO_STANIS', 'DT_CARREGAMENTO_STANIS_9999');
    if (/\s/.test(txt_colunas) && !/[;,]/.test(txt_colunas)) {
        return 'XXX-ERRO';
    };
    txt_colunas = txt_colunas.replace(/[;,]$/g, '');
    txt_colunas = txt_colunas.trim().toUpperCase();
    return txt_colunas;

}

function funcao_valida_salvamento_tarefa_ler_arq_uri(){
    
    let txt_bucket_dir = document.getElementById('txt_bucket_dir').value;
    let txt_ini_arq = document.getElementById('txt_ini_arq').value; 
    let txt_lista_header = document.getElementById('txt_lista_header').value;
    let txt_seperador = document.getElementById('txt_seperador').value; 
    
    let txt_tabela_destino = document.getElementById('txt_tabela_destino').value;
    let txt_recriar_tabela = document.getElementById('txt_recriar_tabela').value;
    let txt_linha_cabecalho = document.getElementById('txt_linha_cabecalho').value; 
    let txt_lista_validar_duplicidade = document.getElementById('txt_lista_validar_duplicidade').value; 
    
    let txt_hr_exe = document.getElementById('txt_hr_exe').value;
    let txt_hr_limit = document.getElementById('txt_hr_limit').value;
    let txt_recorrencia = document.getElementById('txt_recorrencia').value;
    let txt_dia_mes = document.getElementById('txt_dia_mes').value;
    let txt_depend_tar = document.getElementById('txt_depend_tar').value;
    let txt_descicao_tar = document.getElementById('txt_descicao_tar').value;
    let txt_id_chat = document.getElementById('txt_id_chat').value;
    let txt_work_fixo = document.getElementById('txt_work_fixo').value;
    let txt_obs_tar = document.getElementById('txt_obs_tar').value;
    let txt_host_fixo = document.getElementById('txt_host_fixo').value;
    
    txt_lista_header = formatarColunas(txt_lista_header.trim().toUpperCase());
    if(txt_linha_cabecalho == 'XXX-ERRO'){
        alert("FALHA: Nenhum ';' ou ',' foi encontrado no cabeçalho.");
    };
    
    let campos = {
        'Bucket Dir': txt_bucket_dir.trim(),
        'Tabela Destino': txt_tabela_destino.trim(),
        'Lista Header': txt_lista_header.trim(),
        'Recriar Tabela': txt_recriar_tabela.trim(),
        'Linha Cabeçalho': txt_linha_cabecalho.trim(),
        'Separador': txt_seperador.trim(),
        'Hora Execução': txt_hr_exe.trim(),
        'Hora Limite': txt_hr_limit.trim(),
        'Recorrência': txt_recorrencia.trim(),
        'Work Fixo': txt_work_fixo.trim(),
        'Início do Arquivo': txt_ini_arq.trim()
    };
    
    for (let campo in campos) {
        if (!campos[campo]) {
            alert('Falta informação para criar a tarefa! Campo vazio: ' + campo);
            return;
        }
    }
    
      if(txt_recorrencia == '3' &  txt_dia_mes == '')
        {alert('Para recorrencia mensal é obrigatório informar o numero do dia no mês.');return;};
        if(txt_recorrencia == '4' &  txt_dia_mes == ''){
            alert('Para recorrencia semanal é obrigatório informar o numero do dia da semana. De 0 a 6, onde domindo é zero e sábado é seis.');
            return;};
        
        if(valida_padrao_dependencia(txt_depend_tar) === false){
            alert('A configuração de dependencia está fora do padrão.');
            return;};
        
        txt_lista_validar_duplicidade = formatarColunas(txt_lista_validar_duplicidade.trim().toUpperCase());
        if(txt_lista_validar_duplicidade == 'XXX-ERRO'){
            alert("FALHA: Nenhum ';' ou ',' foi encontrado nas colunas de validar a duplicidade.");
        };

        obj_origem = {
            txt_bucket_dir:txt_bucket_dir,
            txt_ini_arq: txt_ini_arq,
            txt_lista_header: txt_lista_header,
            txt_seperador: txt_seperador
        };
        let json_origem = JSON.stringify(obj_origem);

        obj_destino = {
            txt_tabela_destino: txt_tabela_destino,
            txt_recriar_tabela: txt_recriar_tabela,
            txt_linha_cabecalho: txt_linha_cabecalho,
            txt_lista_validar_duplicidade: txt_lista_validar_duplicidade
        };
        let json_destino = JSON.stringify(obj_destino);
        

        let pagina = "salvar_gcp_csv_tbl";
        $.ajax({
            type: 'GET',
            dataType: 'text',
            url: pagina,
            beforeSend: function () {
                document.getElementById('btSalvar').disabled = true;
                $('#recebe_gif_processando').html(`<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`);
            },
            data: {
                origem: json_origem,
                destino: json_destino,
                txt_hr_exe: txt_hr_exe,
                txt_hr_limit: txt_hr_limit,
                txt_recorrencia: txt_recorrencia,
                txt_dia_mes: txt_dia_mes,
                txt_depend_tar: txt_depend_tar.trim(),
                txt_descicao_tar: txt_descicao_tar.trim().toLowerCase(),
                txt_id_chat: txt_id_chat,
                txt_work_fixo: txt_work_fixo.trim(),
                txt_obs_tar: txt_obs_tar.trim().replace("'","").replace(";"," "),
                txt_host_fixo: txt_host_fixo.trim()       
            },
            success: function (resposta, textStatus, jqXHR){
                let status = jqXHR.status
                alert(resposta);
                if (status === 200) {
                    funcao_limpa_campos();
                    window.location.reload();
                  }                   
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.error('Erro na requisição:', textStatus, errorThrown);
                let mensagem = jqXHR.responseText || errorThrown;
                alert(mensagem);
                $('#recebe_gif_processando').html("");
                document.getElementById('btSalvar').disabled = false; 
            },    
            complete: () => {
                $('#recebe_gif_processando').html("");
                document.getElementById('btSalvar').disabled = false; 
                    
            } 
        })
        document.getElementById('btSalvar').disabled = false;

};


function funcao_limpa_campos(){
    document.getElementById('txt_lista_validar_duplicidade').value='';
    document.getElementById('txt_linha_cabecalho').value='1';
    document.getElementById('txt_tabela_destino').value='';
    document.getElementById('txt_seperador').value='';
    document.getElementById('txt_lista_header').value='';
    document.getElementById('txt_bucket_dir').value='';
    document.getElementById('txt_ini_arq').value='';
    document.getElementById('txt_hr_exe').value='';
    document.getElementById('txt_hr_limit').value='';
    document.getElementById('txt_depend_tar').value='';
    document.getElementById('txt_descicao_tar').value='';
    document.getElementById('txt_id_chat').value='';
    document.getElementById('txt_obs_tar').value='';
    document.getElementById('txt_host_fixo').value='';
};

function funcao_frequencia(){
    let txt_recorrencia = document.getElementById('txt_recorrencia');
    let txt_dia_mes = document.getElementById('txt_dia_mes');

    if(txt_recorrencia.value == '3')
      {
            txt_dia_mes.removeAttribute('disabled');
            txt_dia_mes.value = '1';
            document.getElementById('txt_dia_mes').setAttribute('min', '1');
            document.getElementById('txt_dia_mes').setAttribute('max', '31');
            document.getElementById('txt_dia_mes').setAttribute('onkeyup', "if(value<1 || value>31) value='';");
            return;

      }else if(txt_recorrencia.value == '4')
      {
            txt_dia_mes.removeAttribute('disabled');
            txt_dia_mes.value = '0';
            document.getElementById('txt_dia_mes').setAttribute('min', '0');
            document.getElementById('txt_dia_mes').setAttribute('max', '6');
            document.getElementById('txt_dia_mes').setAttribute('onkeyup', "if(value<0 || value>6) value='';");
            return;
      } else 
      {
        txt_dia_mes.value = '';
        txt_dia_mes.disabled = true;
        return;
      };


};


function extrair_tabela(){
	var qtd = document.getElementById("tbl_1").rows;
	var vItens = null;
	var vTexto = '';
	var vVazio = ' ';
	document.getElementById("btExtrair1").disabled = true;
	if(qtd.length > 1){
	if(confirm("Gerar CSV?")){    
	for (var i=0;i<qtd.length;i++){
		vItens =  qtd[i].cells;
        for (var j=0;j<vItens.length;j++){
            if(vItens[j].innerText !==''){vTexto = vTexto + '"' + vItens[j].innerText + '";';}else{vTexto = vTexto + '"' + vVazio + '";'} 
        }		
        vTexto = vTexto + '\n';
	}    

	var mylink = document.createElement('a');
		mylink.download = 'cadastro_tarefas.csv';
		mylink.href = "data:text/csv;charset=utf-8," + encodeURIComponent(vTexto);
		mylink.click();
	}    
	}        
	document.getElementById("btExtrair1").disabled = false;
};



function funcao_listar_tarefas_csv_table_gcp(){
    let pagina = "listar_tarefas_gcp_csv_tbl";
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: pagina,
        beforeSend: function () {
            $('#recebe_gif_processando').html(`<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`);
        },
        data: {},
        success: function (data){
            let tableHtml = '';          
            tableHtml += "<table border='1' id='tbl_1' class='tabela'><thead><tr>";
            tableHtml += "<td><strong>Id</strong></td>";
            tableHtml += "<td><strong>Desc</strong></td>";
            tableHtml += "<td><strong>Resp</strong></td>";
            tableHtml += "<td><strong>Origem</strong></td>";
            tableHtml += "<td><strong>Dest</strong></td>";
            tableHtml += "<td><strong>Hr ini</strong></td>";
            tableHtml += "<td><strong>Hr fim</strong></td>";
            tableHtml += "<td><strong>Repet</strong></td>";
            tableHtml += "<td><strong>Dia</strong></td>";
            tableHtml += "<td><strong>Depend</strong></td>";
            tableHtml += "<td><strong>Chat</strong></td>";
            tableHtml += "<td><strong>Exec.</strong></td>";
            tableHtml += "<td><strong>Wrk</strong></td>";
            tableHtml += "<td><strong>Doc</strong></td>";
            tableHtml += "<td><strong>Fixo</strong></td>";
            tableHtml += "<td><strong>Logs</strong></td>";
            tableHtml += "<td><strong>Stop</strong></td>";
            tableHtml += "<td><strong>Restart</strong></td>";
            tableHtml += "<td><strong>Remove</strong></td>";
            tableHtml += "<td><strong>Change</strong></td>";
            tableHtml += "<td><strong>Play</strong></td>";                
            tableHtml += "</tr></thead>";
            if (data.length > 0){
                let cadeia = "";

                function maiuscula(string){
                    if (string == null || !string){return ''};
                    string = string.toLowerCase().trim().replace(/\s+/g, ' ');
                    let palavras = string.split(' ');
                    for (let i = 0; i < palavras.length; i++){
                        palavras[i] = palavras[i].charAt(0).toUpperCase() + palavras[i].slice(1);
                    }
                    return palavras.join(' ');
                }

                data.forEach(function(dados){
                    if (cadeia !== dados['cadeia']){
                        if (cadeia !== ""){
                            tableHtml += "</thead>";
                        }
                        tableHtml += "<thead class='agrupar_linhas'>";
                        tableHtml += "<td colspan='21' style='border: 2px; border-style: solid dashed; border-color: #09F; text-align: center; white-space: nowrap;'>";
                        tableHtml += "<a style='color:var(--fonttext);' href='javascript:void(0)' onclick=\"abrirGrafico('" + dados['assunto'] + "', '" + dados['cadeia'] + "')\" style='font-size: 1.0em;'>";
                        tableHtml += maiuscula(dados['assunto']) + " - " + maiuscula(dados['cadeia']);
                        tableHtml += "</a></td></thead>";
                        cadeia = dados['cadeia'];
                    }
                    if(dados['id_chat'] === null){dados['id_chat'] = ''};
                    if(dados['dia_mes'] === null){dados['dia_mes'] = ''};
                    if(dados['id_dependencia'] === null){dados['id_dependencia'] = ''};

                    tableHtml += "<tr id='" + dados['id_tarefa'] + "' style='font-size: 10px;'>";
                    tableHtml += "<td style='cursor: pointer;' onclick=\"funcao_atualizar_linha("+ dados['id_tarefa'] + ",11);\">" + dados['id_tarefa'] + "</td>";
                    tableHtml += "<td><p style='font-size:3px'>" + dados['descricao'] + "</p></td>";

                    if(dados['cadastrada_va'] == 1){
                        tableHtml += "<td><span title='" + dados['nome'] + "'>" + dados['usuario'] + "<img title='Variável de ambiente' src='PastaEstilo/static_img/chave_16px.png'></td></span>";
                    }else{
                        tableHtml += "<td><span title='" + dados['nome'] + "'>" + dados['usuario'] + "</td></span>";
                    }
                    

                    tableHtml += "<td><p style='font-size:1px'>" + dados['dir_origem'] + "</p></td>";
                    tableHtml += "<td><p style='font-size:1px'>" + dados['dir_destino'] + "</p></td>";
                    tableHtml += "<td>" + dados['hora_programada'].substr(0,5) + "</td>";
                    tableHtml += "<td>" + dados['hora_fim'].substr(0,5) + "</td>";
                    tableHtml += "<td>" + dados['recorrencia'] + "</td>";
                    tableHtml += "<td>" + dados['dia_mes'] + "</td>";
                    tableHtml += "<td>" + dados['id_dependencia'] + "</td>";
                    tableHtml += "<td>" + dados['id_chat'] + "</td>";
                    
                    // cor resultado
                    if (dados['resultado'] === 'SUCESSO'){
                        tableHtml += "<td style='background-color: #ABEBC6;font-size: 9px;'>" + dados['resultado'] + "</td>";
                    } else if (dados['resultado'] === 'FALHA'){
                        tableHtml += "<td style='background-color: #F5B7B1;font-size: 9px;'>" + dados['resultado'] + "</td>";
                    } else {
                        tableHtml += "<td style='font-size: 9px;'>" + dados['resultado'] + "</td>";
                    }

                    tableHtml += "<td>" + dados['wrk_fixo'] + "</td>";

                    // tratando obs
                    if (dados['obs'] != null && dados['obs'] !== ""){
                        tableHtml += "<td class='arq_desc'><p style='font-size:1px; margin:0; line-height:2px; max-height:20px;'>" + dados['obs'].replace(/\n/g, '<br>') + "</p></td>";
                    } else {
                        tableHtml += "<td></td>";
                    }
                    
                    tableHtml += "<td>" + dados['host_fixo'] + "</td>";

                    // criar botões
                    tableHtml += "<td><span title='Consultar histórico'><button type='button' id='" + dados['id_tarefa'] + "' class='btn_tab logs' onclick='identificaBtn(this.id,1,0);'>Historico</button></span></td>";
                    tableHtml += "<td><span title='Parar'><button type='button' id='" + dados['id_tarefa'] + "' class='btn_tab parar' onclick='if(identificaBtn(this.id,5,1) === true){funcao_atualizar_linha(id,11)};'>Parar</button></span></td>";
                    tableHtml += "<td><span title='Reiniciar'><button type='button' id='" + dados['id_tarefa'] + "' class='btn_tab reiniciar' onclick='if(identificaBtn(this.id,2,1) === true){funcao_atualizar_linha(id,11)};'>Reiniciar</button></span></td>";
                    tableHtml += "<td><span title='Remover'><button type='button' id='" + dados['id_tarefa'] + "' class='btn_tab remover' onclick='identificaBtn(this.id,3,1);'>Remover</button></span></td>";
                    tableHtml += "<td><span title='Alterar'><button type='button' id='" + dados['id_tarefa'] + "' class='btn_tab alterar' onclick='tela_alteracao(this.id,1);'>Alterar</button></span></td>";
                    tableHtml += "<td><span title='Forçar inicio'><button type='button' id='" + dados['id_tarefa'] + "' class='btn_tab iniciar' onclick='funcao_forcar_inicio_tarefa(this.id);'>Iniciar</button></span></td>";
                    tableHtml += "</tr>";
                });

                tableHtml += "</table>";
            }
            $('#conteiner-tabela').html(tableHtml); 
            $('#recebe_gif_processando').html("");
        }
    });
}

function extrair_tabela_1() {
    var tabela = document.getElementById("tbl_1");
    var linhas = tabela.rows;
    var vTexto = '';
    document.getElementById("btExtrair1").disabled = true;

    if (linhas.length > 1) {
        if (confirm("Gerar CSV?")) {
            for (var i = 0; i < linhas.length; i++) {
                var celulas = linhas[i].cells;
                
                if (celulas.length <= 1) {
                    continue; 
                }

                var linhaTexto = '';
                for (var j = 0; j < celulas.length; j++) {
                    var conteudo = celulas[j].innerText.trim();
                    conteudo = conteudo.replace(/"/g, '""'); 
                    linhaTexto += '"' + conteudo + '";';
                }

                linhaTexto = linhaTexto.slice(0, -1);
                vTexto += linhaTexto + '\n';
            }

            var mylink = document.createElement('a');
            mylink.download = 'tabela_cadastro_tarefas.csv';
            mylink.href = "data:text/csv;charset=utf-8," + encodeURIComponent(vTexto);
            mylink.click();
        }
    }
    document.getElementById("btExtrair1").disabled = false;
}