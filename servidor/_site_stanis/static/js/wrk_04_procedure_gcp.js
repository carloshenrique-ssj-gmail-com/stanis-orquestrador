function funcao_valida_salvamento_tarefa_proc_gcp(){
    let txt_dir_origem = document.getElementById('txt_dir_origem');
    let txt_hr_exe = document.getElementById('txt_hr_exe');
    let txt_hr_limit = document.getElementById('txt_hr_limit');
    let txt_recorrencia = document.getElementById('txt_recorrencia');
    let txt_dia_mes = document.getElementById('txt_dia_mes');
    let txt_depend_tar = document.getElementById('txt_depend_tar');
    let txt_descicao_tar = document.getElementById('txt_descicao_tar');
    let txt_id_chat = document.getElementById('txt_id_chat');
    let txt_work_fixo = document.getElementById('txt_work_fixo');
    let txt_obs_tar = document.getElementById('txt_obs_tar');
    let txt_host_fixo = document.getElementById('txt_host_fixo');

    if(txt_dir_origem.value == '' 
        || txt_hr_exe.value == ''
        || txt_hr_limit.value == ''
        || txt_recorrencia.value == ''
        || txt_descicao_tar.value == ''
        || txt_work_fixo.value == ''){
          alert('Falta informação para criar da tarefa!');
          return;
      };

      if(txt_recorrencia.value == '3' &  txt_dia_mes.value == ''){
            alert('Para recorrencia mensal é obrigatório informar o numero do dia no mês.');
            return;
        };
        if(txt_recorrencia.value == '4' &  txt_dia_mes.value == ''){
            alert('Para recorrencia semanal é obrigatório informar o numero do dia da semana. De 0 a 6, onde domindo é zero e sábado é seis.');
            return;
        };
        if(valida_padrao_dependencia(txt_depend_tar.value) === 'erro'){
            alert('A configuração de dependencia está fora do padrão.');
            return;
        }

        let pagina = "salvar_proc_gcp";
        $.ajax({
            type: 'GET',
            dataType: 'text',
            url: pagina,
            beforeSend: function () {
                document.getElementById('btSalvar').disabled = true;
                $('#recebe_gif_processando').html(`<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`);
            },
            data: {
                txt_dir_origem: txt_dir_origem.value,
                txt_hr_exe: txt_hr_exe.value,
                txt_hr_limit: txt_hr_limit.value,
                txt_recorrencia: txt_recorrencia.value,
                txt_dia_mes: txt_dia_mes.value,
                txt_depend_tar: txt_depend_tar.value,
                txt_descicao_tar: txt_descicao_tar.value,
                txt_id_chat: txt_id_chat.value,
                txt_work_fixo: txt_work_fixo.value,
                txt_obs_tar: txt_obs_tar.value.trim().replace("'",'').replace(";",'-'),
                txt_host_fixo: txt_host_fixo.value      
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
};


function funcao_limpa_campos(){
    document.getElementById('txt_dir_origem').value='';
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





function funcao_listar_tarefas_proc_gcp(){
    let pagina = "listar_tarefas_proc_gcp";
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
            tableHtml += "<td><strong>Procedure</strong></td>";
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
                        tableHtml += "<td colspan='20' style='border: 2px; border-style: solid dashed; border-color: #09F; text-align: center; white-space: nowrap;'>";
                        tableHtml += "<a style='color:var(--fonttext);' href='javascript:void(0)' onclick=\"abrirGrafico('" + dados['assunto'] + "', '" + dados['cadeia'] + "')\" style='font-size: 1.0em;'>";
                        tableHtml += maiuscula(dados['assunto']) + " - " + maiuscula(dados['cadeia']);
                        tableHtml += "</a></td></thead>";
                        cadeia = dados['cadeia'];
                    }
                    if(dados['id_chat'] === null){dados['id_chat'] = ''};
                    if(dados['dia_mes'] === null){dados['dia_mes'] = ''};
                    if(dados['id_dependencia'] === null){dados['id_dependencia'] = ''};
                    
                    tableHtml += "<tr id='" + dados['id_tarefa'] + "' style='font-size: 10px;'>";
                    tableHtml += "<td style='cursor: pointer;' onclick=\"funcao_atualizar_linha("+ dados['id_tarefa'] + ",10);\">" + dados['id_tarefa'] + "</td>";
                    
                    tableHtml += "<td><p style='font-size:9px'>" + dados['descricao'] + "</p></td>";
                    tableHtml += "<td><span title='" + dados['nome'] + "'>" + dados['usuario'] + "</span></td>";
                    tableHtml += "<td><p style='font-size:5px'>" + dados['dir_origem'] + "</p></td>";

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
                        // It's safe to call replace on dados['obs']
                        tableHtml += "<td class='arq_desc'><p style='font-size:1px; margin:0; line-height:2px; max-height:20px;'>" + dados['obs'].replace(/\n/g, '<br>') + "</p></td>";
                    } else {
                        tableHtml += "<td></td>";
                    }
                    

                    tableHtml += "<td>" + dados['host_fixo'] + "</td>";

                    // criar botões
                    tableHtml += "<td><span title='Consultar histórico'><button type='button' id='" + dados['id_tarefa'] + "' class='btn_tab logs' onclick='identificaBtn(this.id,1,0);'>Historico</button></span></td>";
                    tableHtml += "<td><span title='Parar'><button type='button' id='" + dados['id_tarefa'] + "' class='btn_tab parar' onclick='if(identificaBtn(this.id,5,1) === true){funcao_atualizar_linha(id,10)};'>Parar</button></span></td>";
                    tableHtml += "<td><span title='Reiniciar'><button type='button' id='" + dados['id_tarefa'] + "' class='btn_tab reiniciar' onclick='if(identificaBtn(this.id,2,1) === true){funcao_atualizar_linha(id,10)};'>Reiniciar</button></span></td>";
                    tableHtml += "<td><span title='Remover'><button type='button' id='" + dados['id_tarefa'] + "' class='btn_tab remover' onclick='identificaBtn(this.id,3,1);'>Remover</button></span></td>";
                    tableHtml += "<td><span title='Alterar'><button type='button' id='" + dados['id_tarefa'] + "' class='btn_tab alterar' onclick='tela_alteracao(this.id,1);'>Alterar</button></span></td>";
                    tableHtml += "<td><span title='Forçar inicio'><button type='button' id='" + dados['id_tarefa'] + "' class='btn_tab iniciar' onclick='funcao_forcar_inicio_tarefa(this.id);'>Iniciar</button></span></td>";
                    tableHtml += "</tr>";
                });

                tableHtml += "</table>";
            }

            // Insert the table into the desired container
            $('#conteiner-tabela').html(tableHtml); 
            $('#recebe_gif_processando').html("");
        }
    });
}