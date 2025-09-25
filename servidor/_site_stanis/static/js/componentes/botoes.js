function identificaBtn(id_bt,acao,tela){
    if(acao == '3'){
        alert(`REMOVER\n\nA ação selecionada irá remover a terefa ${id_bt} de forma permanente.`);
        funcao_remover_tarefa(id_bt);
        funcao_listar_tarefas();
        return;
    };
    if(acao == '2'){
        alert(`REINICIAR\n\nA ação selecionada irá recolocar a tarefa ${id_bt} nos padrões configurados.`);
        resultado = funcao_resetar_tarefa(id_bt);
        return resultado;
    };
    if(acao == '1'){
        funcao_chamar_modal_hist(id_bt,tela);
        return;
    };   
    if(acao == '5'){
        resultado = funcao_parar_tarefa(id_bt);
        return resultado;
    };     
    
};  

var filtroTeclas = function(event) {
    return ((event.charCode >= 48 && event.charCode <= 57) || (event.keyCode == 124 || event.charCode == 46))
};


// REMOVER TAREFA DA LISTA
function funcao_remover_tarefa(numero_tarefa){
    let numeroTarefa = numero_tarefa;

    if (!numeroTarefa) {
        alert('REMOVER\n\n\FALHA: Não recebeu o ID da tarefa!');
        return false;
    }
    if (numeroTarefa === '') {
        alert('REMOVER\n\n\FALHA: Não recebeu o ID da tarefa!');
        return false;
    }    

    let texto_digitado = '';
    texto_digitado = prompt("Escreva exatamente a palavra Remover: "); 
    texto_digitado = String(texto_digitado).trim()

    if(texto_digitado !== 'Remover'){
        alert('REMOVER\n\nFALHA: A palavra digitada não atendeu aos requisitos.\n\nSolicitação CANCELADA!');
        return false;
    }

    $.ajax({
        url: 'remover_tarefa',
        method: 'GET',
        data: { id_tarefa: numeroTarefa },
        dataType: 'text',
        beforeSend: () => {
            $('#recebe_gif_processando').html(`<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`);
        }
    })
    .done((responseText, textStatus, jqXHR) => {
        alert('REMOVER\n\nO cadastro da tarefa foi removido!');
        $('#recebe_gif_processando').html("");
        $(`tr[id="${numeroTarefa}"]`).remove();      
    })
    .fail((jqXHR, textStatus, errorThrown) => {
        let mensagem;
        switch (jqXHR.status) {
            case 401:
                mensagem = 'NÃO AUTORIZADO – faça login e tente novamente.';
                break;
            case 500:
                mensagem = `ERRO INTERNO (500): ${jqXHR.responseText}`;
                break;
            default:
                mensagem = `ERRO ${jqXHR.status}: ${errorThrown}`;
        }
        alert(mensagem);
        $('#recebe_gif_processando').html("");
    });

    return true;

};


// RESETAR TAREFA 
function funcao_resetar_tarefa(numeroTarefa) {
    if (!numeroTarefa) {
        alert('REINICIAR\n\n\FALHA: Não recebeu o ID da tarefa!');
        return false;
    }
    if (numeroTarefa === '') {
        alert('REINICIAR\n\n\FALHA: Não recebeu o ID da tarefa!');
        return false;
    }    

    // 2. Confirmação do usuário
    if (!confirm(`REINICIAR\n\nConfirma a ação de reiniciar a tarefa ${numeroTarefa}?`)) {
        return false;
    }

    // 3. Chamada AJAX
    $.ajax({
        url: 'reiniciar_tarefa',
        method: 'GET',
        data: { id_tarefa: numeroTarefa },
        dataType: 'text',
        beforeSend: () => {
            $('#recebe_gif_processando').html(`<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`);
        }
    })
    .done((responseText, textStatus, jqXHR) => {
        alert('REINICIAR\n\nSolicitação enviada! \n\nO sistema enviou um pedido para a ultima maquina que processou esta tarefa para tentar derrubar o script se ele ainda estiver em execução, esta ação pode demorar até 10 minutos.\n\nA tarefa está de volta a fila normal para processamento.');
        $('#recebe_gif_processando').html("");
    })
    .fail((jqXHR, textStatus, errorThrown) => {
        let mensagem;
        switch (jqXHR.status) {
            case 401:
                mensagem = 'NÃO AUTORIZADO – faça login e tente novamente.';
                break;
            case 500:
                mensagem = `ERRO INTERNO (500): ${jqXHR.responseText}`;
                break;
            default:
                mensagem = `ERRO ${jqXHR.status}: ${errorThrown}`;
        }
        alert(mensagem);
        $('#recebe_gif_processando').html("");
    });

    return true;
};

function funcao_forcar_inicio_tarefa(numeroTarefa){
    if (!numeroTarefa) {
        alert('FORÇAR INICIO\n\n\FALHA: Não recebeu o ID da tarefa!');
        return false;
    }
    if (numeroTarefa === '') {
        alert('FORÇAR INICIO\n\n\FALHA: Não recebeu o ID da tarefa!');
        return false;
    }    

    if (!confirm(`FORÇAR INICIO\n\nA ação solicitada irá forçar o inicio da tarefa o mais breve possível.\n\nAinda assim, o processo estará limitado as configurações e limitações das maquinas.\n\nDeseja realmente FORÇAR o inicio da tarefa ${numeroTarefa} ignorando qualquer configuração para ela?`) == true){
        return false;
    };

    
    $.ajax({
        url: 'forcar_inicio',
        method: 'GET',
        data: { id_tarefa: numeroTarefa },
        dataType: 'text',
        beforeSend: () => {
            $('#recebe_gif_processando').html(`<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`);
        }
    })
    .done((responseText, textStatus, jqXHR) => {
        alert(`FORÇAR INICIO\n\n${jqXHR.responseText}`);
        $('#recebe_gif_processando').html("");
    })
    .fail((jqXHR, textStatus, errorThrown) => {
        let mensagem;
        switch (jqXHR.status) {
            case 401:
                mensagem = 'NÃO AUTORIZADO – faça login e tente novamente.';
                break;
            case 500:
                mensagem = `ERRO INTERNO (500): ${jqXHR.responseText}`;
                break;
            default:
                mensagem = `ERRO ${jqXHR.status}: ${errorThrown}`;
        }
        alert(mensagem);
        $('#recebe_gif_processando').html("");
    });

    return true;


};


// CHAMAR HISTORICO
function funcao_chamar_modal_hist(numero_tarefa = '', tipo = 0) {
    const txt_num_tarefa = numero_tarefa;
    if (txt_num_tarefa === '') {
        alert('FALHA: NÃO RECEBEU O ID DA TAREFA!');
        return;
    }
    document.getElementById('numero_pesquisado').innerHTML = txt_num_tarefa;
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'listar_historico_tarefa',
        beforeSend: function () {
            document.getElementById('abrirModal').click();
            $('#modal_icone_pesquisando').html(`<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`);
        },
        data: {
            id_tarefa: txt_num_tarefa,
            tipo: tipo
        },
        success: function (data) {
            $('#recebe_gif_processando').html("");
            let tableHtml = '<table border="1" id="tbl_4" class="tabela"><thead><tr>';
            tableHtml += "<td><strong>Resultado</strong></td>";
            tableHtml += "<td><strong>Hora registro</strong></td>";
            tableHtml += "<td><strong>Tempo</strong></td>";
            tableHtml += "<td><strong>Host/Detalhe</strong></td>";
            tableHtml += "</tr></thead>";
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(function (dados) {
                    tableHtml += "<tr style='padding: 0;'>";
                    if (dados['registro'] === 'SUCESSO') {
                        tableHtml += "<td style='background-color: #ABEBC6;font-size:10px;'>" + dados['registro'] + "</td>";
                    } else if (dados['registro'] === 'FALHA') {
                        tableHtml += "<td style='background-color: #F5B7B1;font-size:10px;'>" + dados['registro'] + "</td>";
                    } else {
                        tableHtml += "<td><p style='font-size:10px'>" + dados['registro'] + "</p></td>";
                    }
                    tableHtml += "<td><p style='font-size:9px'>" + dados['hora_registro'] + "</p></td>";
                    tableHtml += "<td><p style='font-size:9px'>" + dados['tempo_exe'] + "</p></td>";
                    if (dados['descricao'] === '') {
                        tableHtml += "<td><p style='font-size:9px'>" + dados['host_name'] + "</p></td>";
                    } else {
                        tableHtml += "<td><p style='font-size:11px'>" + dados['host_name'] + ": " + dados['descricao'] + "</p></td>";
                    }
                    tableHtml += "</tr>";
                });
            } else {
                tableHtml += "<tr><td colspan='4'>Nenhum registro para hoje encontrado, clique no ícone de consultar histórico acima caso deseje pesquisar todos os registros para a tarefa.</td></tr>";
            }
            tableHtml += "</table>";
            $('#modal_historico_registros_tabela').html(tableHtml);
            $('#modal_icone_pesquisando').html("");
            if (tipo === 1) {
                //alert('A pesquisa levou em consideração registros já arquivados.');
            }
        },
        error: function (xhr, status, error) {
            console.error("Erro na requisição AJAX:", status, error);
            $('#recebe_gif_processando').html("<p>Erro ao carregar o histórico.</p>");
        }
    });
}



// PARAR TAREFA 
function funcao_parar_tarefa(numeroTarefa) {
    if (!numeroTarefa) {
        alert('PARAR\n\n\FALHA: Não recebeu o ID da tarefa!');
        return false;
    }
    if (numeroTarefa === '') {
        alert('PARAR\n\n\FALHA: Não recebeu o ID da tarefa!');
        return false;
    }    

    // 2. Confirmação do usuário
    if (!confirm(`PARAR\n\nDeseja realmente paralizar a tarefa ${numeroTarefa}?`)) {
        return false;
    }

    // 3. Chamada AJAX
    $.ajax({
        url: 'parar_tarefa',
        method: 'GET',
        data: { id_tarefa: numeroTarefa },
        dataType: 'text',
        beforeSend: () => {
            $('#recebe_gif_processando').html(`<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`);
        }
    })
    .done((responseText, textStatus, jqXHR) => {
        alert('PARAR\n\nSolicitação de parada processada!\n\nSe a tarefa estiver em execução, um pedido será enviado à máquina remota para interromper o script, esta ação pode demorar alguns minutos.');
        $('#recebe_gif_processando').html("");
    })
    .fail((jqXHR, textStatus, errorThrown) => {
        let mensagem;
        switch (jqXHR.status) {
            case 401:
                mensagem = `NÃO AUTORIZADO – faça login e tente novamente.`;
                break;
            case 500:
                mensagem = `ERRO INTERNO (500): ${jqXHR.responseText}`;
                break;
            default:
                mensagem = `ERRO ${jqXHR.status}: ${errorThrown}`;
        }
        alert(mensagem)
        $('#recebe_gif_processando').html("");
    });

    return true;
}

function isNumber(val) {
    return !isNaN(val);
}

function valida_padrao_dependencia(str) {
    str = String(str);
    if (str === '') {
      return true;
    };
    
    if (isNumber(str) === true) {
        if(Number.isInteger(parseInt(str)) === true){
            return true;
        }else{
            return false;
        }
    };

    if(str.indexOf("|") >= 0){
        let arr = str.split('|');
        for (let i = 0; i < arr.length; i++) {
            if (isNaN(arr[i]) === true) {
               return false;
            }
            if (String(arr[i]) === '') {
                return false;
             }            
          }
    }else{
        return false;
    }

    
    return true;
  };  
  

function valida_id_dependencia_e_id_chat(campo){

    if(valida_padrao_dependencia(campo) === false){
        return 'erro';
    }else{;
        return campo;
    };
};


// FIM FUNCÕES DE VALIDAÇÃO DOS CAMPOS EDITAVEIS

// EXTRATOR CSV LOGS 
function extrair_tabela_2() {
  const botao = document.getElementById("btExtrair1");
  const tabela = document.getElementById("tbl_4");
  const linhas = Array.from(tabela.rows);
  if (linhas.length <= 1) return;

  botao.disabled = true;
  if (!confirm("Gerar CSV?")) {
    botao.disabled = false;
    return;
  }

  const dados = linhas
    .filter(row => row.cells.length > 1)
    .map(row => {
      return Array.from(row.cells)
        .map(cell => `"${cell.innerText.trim().replace(/"/g, '""')}"`)
        .join(";");
    })
    .join("\n");

  const bom = "\uFEFF";
  const blob = new Blob([bom + dados], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.style.display = "none";
  link.href = url;
  link.download = "logs_tarefa.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  botao.disabled = false;
}


// FIM EXTRATOR CSV LOGS

// FIM FILTRO

function funcao_wrk_ativos() {
    const pagina = "verifica_wkr_ativos"; // Nova URL da rota Flask

    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: pagina,
        success: function (dados) {
            const container = $('#wrks_ativos');
            container.empty();
			container.append('<div style="flex-basis: 100%;height: -25px;"><font color="#17A7F9"><p><b>  Máquinas:</b></p></font></div>'); // forçar quebra de linha
            dados.forEach(item => {
                const { worker, status, nome_maquina, nome_amigavel } = item;

                let nome = '';
                if (worker.startsWith('Sistema: ')) {
                    const parteNegrito = worker.split('Sistema: ')[1];
                    nome = `Sistema: <b>${parteNegrito}</b> `;
                } else {
                    nome = 'Wrk ' + worker + ' ';
                }
                nome += nome_amigavel || '';

                const statusIcon = status === 'ATIVO' ? 'verificado.png' : 'falha.png';
                const statusColor = status === 'ATIVO' ? '#000' : '#EC7063';
                const iconSize = status === 'ATIVO' ? '12px' : '15px';

                const html = `
                    <br><div style="border: 1px solid #ddd; box-shadow: 1px 1px 2px #cccccc; border-radius: 5px; padding: 5px; text-align: center; width: 120px; margin: 3px;">
                        <img src="static/images/static_img/${statusIcon}" width="${iconSize}">
                        <span style="font-size: 10px;color:var(--fonttext);" title="${nome_maquina}" style="color: ${statusColor};"> ${nome}</span>
                    </div><br>
                `;

                container.append(html);

            });
        },
        error: function (xhr, status, error) {
            console.error('Erro ao buscar dados:', error);
        }
    });
}



function funcao_tars_executando() {
    const pagina = "verifica_tars_exec";

    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: pagina,
        success: function (dados) {
            const tabela = document.getElementById('tbl_1');
            tabela.innerHTML = `
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Reiniciar</th>
                        <th>Histórico</th>
                        <th>Wrk</th>
                        <th>Tipo</th>
                        <th>Assunto</th>
                        <th>Cadeia</th>
                        <th>Nome</th>
                        <th>Tempo Exec.</th>
                    </tr>
                </thead>
                <tbody>
            `;

            const hostlocal = 'http://' + location.host;
            const tipos_links = {
                '1': 'wrk_01_tf',
                '2': 'wrk_02_up_gcp',
                '3': 'wrk_03_down_gcp',
                '4': 'wrk_04_procedure_gcp',
                '5': 'wrk_05_script_py',
                '6': 'wrk_06_script_sas',
                '7': 'wrk_07_excel_vba',
                '8': 'wrk_08_up_srv_sas',
                '9': 'wrk_09_down_srv_sas',
                '10': 'wrk_10_script_vbs',
                '11': 'wrk_11_funcao_true_py',
                '12': 'wrk_12_gcp_csv_tbl',
				'13': 'wrk_13_tf_mft'
            };
            let link_grafico = '';
            dados.forEach((linha) => {
                const link_stanis = tipos_links[linha.nu_tipo_srv]
                    ? `${hostlocal}/${tipos_links[linha.nu_tipo_srv]}?linha=${linha.num_tar}`
                    : `${hostlocal}/inicio`;
				
                const tempoExecStr = linha.tempo_exec || '00:00:00.000000';
                const tempoExec = tempoExecStr.split('.')[0];

                let bgColor = '';
				
                const [horas, minutos, segundos] = tempoExec.split(':').map(Number);
                const totalSegundos = horas * 3600 + minutos * 60 + segundos;
				
                if (totalSegundos < 1800) {
                    bgColor = '';
                } else if (totalSegundos < 3600) {
                    bgColor = '#F4FA58';
                } else if (totalSegundos < 7200) {
                    bgColor = '#FACC2E';
                } else {
                    bgColor = '#FE2E2E';
                }

                link_grafico = `<a style="font-size: 11px;color:var(--fonttext);" href='javascript:void(0)' onclick=\"abrirGrafico('${linha.assunto}','${linha.cadeia}')\" style='font-size: 1.0em;'>`;
                tabela.innerHTML += `
                    <tr>
                        <td><a style="font-size: 12px;color:var(--fonttext);" href="${link_stanis}" target="_blank">${linha.num_tar}</a></td>
                        <td><button type="button" class="btn_tab reiniciar" onclick="if(identificaBtn('${linha.num_tar}', 2, 1)===true){buscar_dados('icon1')};">Reiniciar</button></td>
                        <td><button type="button" class="btn_tab logs" onclick="identificaBtn('${linha.num_tar}', 1, 0);">Histórico</button></td>
                        <td style="font-size: 11px;">${linha.wrk_fixo}</td>
                        <td style="font-size: 11px;">${linha.tipo_srv}</td>
                        <td style="font-size: 11px;">${link_grafico}${linha.assunto}</a></td>
                        <td style="font-size: 11px;">${link_grafico}${linha.cadeia}</a></td>
                        <td style="font-size: 11px;">${link_grafico}${linha.descricao} ${linha.tag_bloq ? `<img src='static/images/static_img/tag.png' title='Utiliza tag: ${linha.tag_bloq}'>` : ''}</a></td>
                        <td style="background-color: ${bgColor};">${tempoExec}</td>
                    </tr>
                `;
            });

            tabela.innerHTML += '</tbody>';
        },
        error: function (xhr, status, error) {
            console.error("Erro na requisição:", error);
        }
    });
}




function funcao_tars_executadas() {
    const pagina = "verifica_tars_executados";

    fetch(pagina, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const table = document.getElementById('tbl_2');
        table.innerHTML = '';
        const headers = [
            "Id", "Reiniciar", "Histórico", "Wrk", "Tipo",
            "Responsável", "Assunto", "Cadeia", "Nome",
            "Tempo Exec.", "Hora Fim", "Resultado"
        ];
        
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Criar corpo da tabela
        const tbody = document.createElement('tbody');
        let link_grafico = '';
        data.forEach(row => {
            const tr = document.createElement('tr');


            const hostlocal = 'http://' + location.host;
            const tipos_links = {
                '1': 'wrk_01_tf',
                '2': 'wrk_02_up_gcp',
                '3': 'wrk_03_down_gcp',
                '4': 'wrk_04_procedure_gcp',
                '5': 'wrk_05_script_py',
                '6': 'wrk_06_script_sas',
                '7': 'wrk_07_excel_vba',
                '8': 'wrk_08_up_srv_sas',
                '9': 'wrk_09_down_srv_sas',
                '10': 'wrk_10_script_vbs',
                '11': 'wrk_11_funcao_true_py',
                '12': 'wrk_12_gcp_csv_tbl',
				'13': 'wrk_13_tf_mft'
            };
			const linkStanis = tipos_links[row.nu_tipo_srv]
				? `${hostlocal}/${tipos_links[row.nu_tipo_srv]}?linha=${row.id_tarefa}`
				: `${hostlocal}/inicio`;

            const formatarTempoExecucao = (tempoExec) => {
                const tempoFormatado = tempoExec.split('.')[0];
                const [hora, minuto, segundo] = tempoFormatado.split(':');
                return `${hora.padStart(2, '0')}:${minuto.padStart(2, '0')}:${segundo.padStart(2, '0')}`;
            };
            
            const getColorByResult = (resultado) => {
                return resultado === 'FALHA' ? '#FE2E2E' : '#FFFFFF';
            };
            link_grafico = `<a style="font-size: 11px;color:var(--fonttext);" href='javascript:void(0)' onclick=\"abrirGrafico('${row.assunto}','${row.cadeia}')\" style='font-size: 1.0em;'>`;
            tr.innerHTML = `
                <td><a style="font-size: 11px;" href="${linkStanis}" target="_blank">${row.id_tarefa}</a></td>
                <td><button class='btn_tab reiniciar' onclick="if(identificaBtn(${row.id_tarefa}, 2, 1) === true){buscar_dados('icon3')};">Reiniciar</button></td>
                <td><button class='btn_tab logs' onclick="identificaBtn(${row.id_tarefa}, 1, 0);">Histórico</button></td>
                <td style="font-size: 11px;color:var(--fonttext);">${row.maquina}</td>
                <td style="font-size: 11px;color:var(--fonttext);">${row.tipo_srv}</td>
                <td style="font-size: 11px;color:var(--fonttext);">${row.nome}</td>
                <td style="font-size: 11px;color:var(--fonttext);">${link_grafico}${row.assunto}</a></td>
                <td style="font-size: 11px;color:var(--fonttext);">${link_grafico}${row.cadeia}</a></td>
                <td style="font-size: 11px;color:var(--fonttext);">${link_grafico}${row.descricao}</a</td>
                <td>${formatarTempoExecucao(row.tempo_exec)}</td>
                <td>${formatarTempoExecucao(row.hora_fim)}</td>
                <td style="background-color: ${getColorByResult(row.resultado_tarefa)};">${row.resultado_tarefa}</td>
            `;
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
    })
    .catch(error => console.error('Erro ao buscar dados:', error));
}


function funcao_proximas_tars() {
    let pagina = "verifica_proximas_tars";

    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: pagina,
        success: function (dados) {
            const tabela = $('#tbl_3');
            tabela.empty();

            // Cabeçalho da tabela
            const cabecalho = `
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Wrk</th>
                        <th>Tipo</th>
                        <th>Assunto</th>
                        <th>Cadeia</th>
                        <th>Nome</th>
                        <th>Dep.</th>
                    </tr>
                </thead>
            `;
            tabela.append(cabecalho);

            // Corpo da tabela
            const corpo = $('<tbody></tbody>');

            dados.forEach(dado => {
                const hostlocal = 'http://' + location.host;
                const tipos_links = {
                    '1': 'wrk_01_tf',
                    '2': 'wrk_02_up_gcp',
                    '3': 'wrk_03_down_gcp',
                    '4': 'wrk_04_procedure_gcp',
                    '5': 'wrk_05_script_py',
                    '6': 'wrk_06_script_sas',
                    '7': 'wrk_07_excel_vba',
                    '8': 'wrk_08_up_srv_sas',
                    '9': 'wrk_09_down_srv_sas',
                    '10': 'wrk_10_script_vbs',
                    '11': 'wrk_11_funcao_true_py',
                    '12': 'wrk_12_gcp_csv_tbl',
					'13': 'wrk_13_tf_mft'
                };

                const link = `${hostlocal}/${tipos_links[dado.nu_tipo_srv] || 'inicio'}?linha=${dado.id_tarefa}`;

                const linha = `
                    <tr>
                        <td><a style="font-size:10px;color:var(--fonttext);" class="cls_a" href="${link}" target="_blank">${dado.id_tarefa}</a></td>
                        <td><p style="font-size:10px;color:var(--fonttext);">${dado.wrk_fixo}</p></td>
                        <td><p style="font-size:10px;color:var(--fonttext);">${dado.tipo_srv}</p></td>
                        <td><p style="font-size:10px;color:var(--fonttext);">${dado.assunto}</p></td>
                        <td><p style="font-size:10px;color:var(--fonttext);">${dado.cadeia}</p></td>
                        <td><p style="font-size:11px;color:var(--fonttext);">${dado.descricao}</p></td>
                        <td><p style="font-size:11px;color:var(--fonttext);">${dado.dependencia_em_executando}</p></td>
                    </tr>
                `;
                corpo.append(linha);
            });

            tabela.append(corpo);
        },
        error: function (xhr, status, error) {
            console.error("Erro ao buscar os dados:", error);
        }
    });
}


//setInterval(funcao_wrk_ativos, 120000);
//setInterval(funcao_tars_executando, 60000);