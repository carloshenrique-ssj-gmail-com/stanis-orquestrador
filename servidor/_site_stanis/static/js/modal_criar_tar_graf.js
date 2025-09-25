
// funções para edição campos da tela 
var filtroTeclas = function(event) {
    return ((event.charCode >= 48 && event.charCode <= 57) || (event.keyCode == 124 || event.charCode == 46))
};

// vba tag bloq
function novo_valor_select(p_indice, p_combo) {
    if (p_indice === 1) {
        let strOpcao = prompt('Digite a opção a ser inserida (máximo 10 caracteres)', '');

        if (strOpcao === null || strOpcao.trim() === '' || strOpcao.trim() === '[CRIAR TAG]') {
            alert('Digite um valor válido para a opção');
            p_combo.options[0].selected = true;
            return;
        }

        strOpcao = strOpcao.toUpperCase().replace(' ', '_').replace(',', '_').replace(';', '_').trim();

        if (strOpcao.length > 10) {
            alert('O valor deve ter no máximo 10 caracteres.');
            p_combo.options[0].selected = true;
            return;
        }

        for (let i = 0; i < p_combo.length; i++) {
            if (p_combo.options[i].value.toUpperCase() === strOpcao) {
                alert('Este valor já existe na lista');
                p_combo.options[i].selected = true;
                return;
            }
        }

        let intTamanho = p_combo.length;
        p_combo.length = intTamanho + 1;
        p_combo.options[intTamanho].text = strOpcao;
        p_combo.options[intTamanho].value = strOpcao;
        p_combo.options[intTamanho].selected = true;
    }
}

// frequencia
function funcao_frequencia_grafico(){
    const txt_recorrencia = document.getElementById('recorrencia');
    const txt_dia_mes = document.getElementById('dia_mes');

    if(txt_recorrencia.value == '3')
      {
            txt_dia_mes.removeAttribute('disabled');
            txt_dia_mes.value = '1';
            document.getElementById('dia_mes').setAttribute('min', '1');
            document.getElementById('dia_mes').setAttribute('max', '31');
            document.getElementById('dia_mes').setAttribute('onkeyup', "if(value<1 || value>31) value='';");
            return;

      }else if(txt_recorrencia.value == '4')
      {
            txt_dia_mes.removeAttribute('disabled');
            txt_dia_mes.value = '0';
            document.getElementById('dia_mes').setAttribute('min', '0');
            document.getElementById('dia_mes').setAttribute('max', '6');
            document.getElementById('dia_mes').setAttribute('onkeyup', "if(value<0 || value>6) value='';");
            return;
      } else 
      {
        txt_dia_mes.value = '';
        txt_dia_mes.disabled = true;
        return;
      };
};



// função salvar:
function preparar_dados(containerId, optionalFields, ignoredFields,tp_servico) {
  const container = document.getElementById(containerId);
  if (!container) {
    return { success: false, error: `Container com id "${containerId}" não encontrado.` };
  }

  const selector = 'input[type="text"],input[type="number"],input[type="time"],select,textarea';
  const fields = Array.from(container.querySelectorAll(selector));
  const data = {};
  const missing = [];

  // coleta e validação basica
  for (const field of fields) {
    const { id, value } = field;
    if (!id || ignoredFields.includes(id)) continue;
    if (!value && !optionalFields.includes(id)) {
      missing.push(id);
    } else {
      data[id] = value;
    }
  }

  if (missing.length) {
    return { success: false, missing };
  }

  // agrupamento especifico quando tipo_servico for "12"
  if (tp_servico === '12') {
    const origemKeys = ['txt_bucket_dir','txt_ini_arq','txt_lista_header','txt_seperador'];
    const destinoKeys = ['txt_tabela_destino','txt_recriar_tabela','txt_linha_cabecalho','txt_lista_validar_duplicidade'];
    
    data.dir_origem = {};
    origemKeys.forEach(key => {
      if (key in data) {
        data.dir_origem[key] = data[key];
        delete data[key];
      }
    });
    
    data.dir_destino = {};
    destinoKeys.forEach(key => {
      if (key in data) {
        data.dir_destino[key] = data[key];
        delete data[key];
      }
    });
  }

  return { success: true, data };
}


function salvar_tarefa() {
  let resposta = prompt(`\CONFIRMAÇÃO\n\nPara confirmar esta ação escreva a palavra "Salvar"\n`);
  resposta = String(resposta).trim();

  if(resposta !== "Salvar"){
    alert('\nCANCELADO\n\nA informação recebida não atendeu aos requisitos.\n')
    return;
  }


  const containerId    = 'nova_tarefa';
  const optionalFields = ['dia_mes','obs','id_dependencia','tag_bloq','id_chat','txt_lista_validar_duplicidade'];
  const ignoredFields  = ['intervalo_cadeia','resultado_tarefa','mensagem_resultado_tarefa'];
  const tipo_req = document.getElementById('type_id').value;
  const tp_servico = document.getElementById('n_tp_servico');
  const assunto = document.getElementById("txt_sel_assunto").value;
  const cadeia = document.getElementById("txt_sel_cadeia");

  if(cadeia.selectedOptions.length > 1){
    alert(`\nFALHA\n\nApenas uma cadeia pode estar selecionada para gerar alteração ou criação de tarefas.\n`);
    return;    
  }

  const cadeia_selecionada = cadeia.selectedOptions[0];
  const opt = tp_servico.selectedOptions[0];
  
  if(opt.value == ''){
    alert(`\nFALHA\n\nFalta informações para realizar essa ação.\n`);
    return;
  }



  const result = preparar_dados(containerId, optionalFields, ignoredFields, opt.value);

  if (!result.success) {
    if (result.error) {
      alert(result.error);
    } else {
      alert(`\nFALHA\n\nFalta informações para realizar essa ação.\n`);
    }
    return;
  }

  let destino = '';
  let id_tarefa = '0';
  if(tipo_req === 'ALTERAR'){
     destino = '1';
     id_tarefa = document.getElementById('selected_id').value;
  }else if (tipo_req === 'NOVO'){
    destino = '2';
  }else{
    alert(`\nFALHA\n\nFalta informações para realizar essa ação.\n`);
    return;
  }
  // Se chegou aqui, todos os obrigatórios foram preenchidos
  enviarSalvarTarefaGrafico(result.data,id_tarefa,opt.value,destino,assunto,cadeia_selecionada.value,opt.text);
}



async function enviarSalvarTarefaGrafico(dadosJson, idTarefa, tipoServico, tipoDestino, assunto, cadeiaSelecionada, textoServico) {
  const pagina = 'criar_alterar_tarefa_tela_grafico';
  const container = document.getElementById('local-mensagens');
  container.innerHTML = `
    <div class="loader">
      <div class="dot"></div><div class="dot"></div><div class="dot"></div>
    </div>
  `;

  const params = new URLSearchParams({
    obj_campos: JSON.stringify(dadosJson),
    id_tarefa: idTarefa,
    tipo_servico: tipoServico,
    destino: tipoDestino,
    assunto: assunto,
    cadeia: cadeiaSelecionada
  });

  try {
    const response = await fetch(`${pagina}?${params.toString()}`, { method: 'GET' });
    const text = await response.text();

    if (response.ok) {
      if (tipoDestino === '1') {
        atualizarGraficoVisJSAposSucesso(dadosJson, assunto, cadeiaSelecionada, idTarefa, textoServico, '1');
      } else if (tipoDestino === '2') {
        const match = text.match(/\b\d+\b/);
        const novoId = match ? match[0] : 'desconhecido';
        if (novoId === 'desconhecido') {
          alert('\nFALHA\n\nO sistema não recebeu o ID da nova tarefa. Verifique se ela foi criada na página correspondente ao serviço.\n');
        } else {
          atualizarGraficoVisJSAposSucesso(dadosJson, assunto, cadeiaSelecionada, novoId, textoServico, '2');
        }
      }
    } else {
      throw new Error(`Status HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert(error.message || error);
  } finally {
    container.innerHTML = '';
  }
}



function atualizarGraficoVisJSAposSucesso(dados_json,assunto,cadeia_selecionada,id_tarefa,texto_servico,origem){
  const obj_json = dados_json;
  const obj_para_visjs = {
        assunto: assunto,
        cadeia: cadeia_selecionada,
        descricao: obj_json.descricao,
        id_dependencia: obj_json.id_dependencia,
        id_tarefa: id_tarefa,
        stt:'VAZIO',
        tipo: texto_servico,
        origem: origem
    };    
    adicionarEmCachedData(obj_para_visjs);
    funcao_pesquisa_flow(true);     
    if(origem == '1'){
      alert('\nSUCESSO\n\nTarefa alterada com sucesso!\n')
    }else{
      alert('\nSUCESSO\n\nTarefa criada com sucesso!\n\nAtenção: Tarefas recem criadas nascem com estado INATIVO, para permitir que a tarefa seja executada na fila clique no botão REINICIAR.')
    }
    
    fechar_modal_alt();
};



function funcao_remover_tarefa_grafico(){
    const numeroTarefa = document.getElementById('selected_id').value;
    const tipo = document.getElementById('type_id').value;

    if(tipo === 'NOVO'){
        alert('REMOVER\n\n\FALHA: Não é possivel remover uma tarefa ainda não salva!');
        return;      
    }

    if (!numeroTarefa) {
        alert('REMOVER\n\n\FALHA: Não recebeu o ID da tarefa!');
        return false;
    }
    if (numeroTarefa === '' || numeroTarefa == '0') {
        alert('REMOVER\n\n\FALHA: Não recebeu o ID da tarefa!');
        return false;
    }    

    let texto_digitado = '';
    texto_digitado = prompt(`\CONFIRMAÇÃO\n\nEscreva exatamente a palavra "Remover"\n`); 
    texto_digitado = String(texto_digitado).trim()

    if(texto_digitado !== 'Remover'){
        alert('\nCANCELADO\n\nA informação recebida não atendeu aos requisitos.');
        return false;
    }

    $.ajax({
        url: 'remover_tarefa',
        method: 'GET',
        data: { id_tarefa: numeroTarefa },
        dataType: 'text',
        beforeSend: () => {
            $('#local-mensagens').html(`<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`);
        }
    })
    .done((responseText, textStatus, jqXHR) => {
        removerDeCachedData(numeroTarefa);
        funcao_pesquisa_flow(true);
        alert('REMOVER\n\nTarefa removida.\n');
        fechar_modal_alt();
        $('#local-mensagens').html(""); 
            
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
        $('#local-mensagens').html("");
    });

    return true;

};











// modal de alteração


// abrir modal de alterações
function abrir_modal_alt(){
  const selectX = document.getElementById('n_tp_servico');
  const modal2 = document.getElementById('modal2');
  const tipo_origem = document.getElementById('type_id');

  modal2.classList.add('active');
  if (!selectX){return;};
  selectX.disabled = false;         
  generateTela('','nova_tarefa');
  gerar_id_temp();
  tipo_origem.value = 'NOVO';
}
// fechar modal de alterações
function fechar_modal_alt(){
  const modal2 = document.getElementById('modal2');
        modal2.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  // 1) captura os elementos
  const btnOpen2  = document.getElementById('btnOpenModal2');
  const modal2    = document.getElementById('modal2');
  const btnClose2 = document.getElementById('btnCloseModal2');
  const btnOk2    = document.getElementById('btnOkModal2');

  if (!btnOpen2 || !modal2 || !btnClose2 || !btnOk2) {
    console.error('Modal2: elemento não encontrado', {
      btnOpen2, modal2, btnClose2, btnOk2
    });
    return;
  }

  // 3) configura os listeners
  btnOpen2.addEventListener('click', () => {
      if(cachedData === null){
        alert('\nATENÇÃO!\n\nÉ necessário uma cadeia para criar uma tarefa.')
        return; 
      }   

      let assunto = document.getElementById("txt_sel_assunto").value;
      let cadeiaElement = document.getElementById("txt_sel_cadeia");  

      if(cadeiaElement.selectedOptions.length > 1 || assunto === '' || cadeiaElement.value === ''){
        alert('\nATENÇÃO!\n\nFalta informações para seguir ou você selecionou mais de uma cadeia.')
        return;        
      }
    abrir_modal_alt();
  });

  btnClose2.addEventListener('click', () => {
    fechar_modal_alt();
  });
/* 
  // aqui fecha o modal se clicar fora
  modal2.addEventListener('click', e => {
    if (e.target === modal2) {
      fechar_modal_alt();
    }
  });
  */
});

// fim modal de alteração


// adicionar novas caixas no grafico

function adicionarEmCachedData(item) {
  const camposObrigatorios = [
    'assunto','cadeia','descricao',
    'id_dependencia','id_tarefa','stt',
    'tipo','origem'
  ];

  const faltando = camposObrigatorios.filter(c => !(c in item));
  if (faltando.length) {
    alert(`Não foi possível adicionar: campos faltando → ${faltando.join(', ')}`);
    return false;
  }

  if (!Array.isArray(cachedData)) {
    cachedData = [];
  }
  const idStr = String(item.id_tarefa);
  const idx = cachedData.findIndex(d => String(d.id_tarefa) === idStr);

  if (idx !== -1) {
    cachedData.splice(idx, 1, { ...item });
  } else {
    cachedData.push({ ...item });
  }

  return true;
}


function removerDeCachedData(id_tarefa) {
  if (!Array.isArray(cachedData)) {
    alert('O gráfico ainda não foi inicializado.');
    return false;
  }

  const idStr = String(id_tarefa);
  const index = cachedData.findIndex(d => String(d.id_tarefa) === idStr);

  if (index === -1) {
    console.info(`Nenhum registro encontrado para id_tarefa = ${idStr}.`);
    return false;
  }

  cachedData.splice(index, 1);
  return true;
}


// fim adicionar novas caixas no grafico


function gerar_id_temp(id){
  if(!id){
    document.getElementById('selected_id').value = "0";
  }else{
    document.getElementById('selected_id').value = String(id);  
  }
}


function abrir_modal_geral(id){
    if (isNaN(id)){
        alert('Não é um id válido!');
        return;
    };
    const modal2 = document.getElementById('modal2');
    modal2.classList.add('active');
    document.getElementById("selected_id").value = String(id);
    buscarInformacoesTarefa(String(id))
};


// preencher modal com dados retornados do servidor
function buscarInformacoesTarefa(idTarefa) {
  if (!idTarefa) {
      alert('Não recebeu ID da tarefa.');
      $('#local-mensagens').text('Parâmetros inválidos.');
      return;
  }

  const $container = $('#local-mensagens');
  $.ajax({
      url: 'flow_pesq_id',
      method: 'GET',
      data: { id_tarefa: idTarefa },
      dataType: 'json',
      beforeSend() {
          $container.html(`
              <div class="loader">
                  <div class="dot"></div><div class="dot"></div><div class="dot"></div>
              </div>
          `);
      },
      success(response) {

          const registros = Array.isArray(response) ? response : [];

          if (registros.length === 0) {
            alert('Nenhum registro encontrado.');
            $container.text('Nenhum registro encontrado.');
            return;
          }

          const [{ tipo_servico: tipoServico } = {}] = registros;
          if (!tipoServico) {
            alert('FALHA!\n\nNão recebeu tipo_servico.');
            $container.text('Campo tipo_servico ausente.');
            return;
          }          


          const selectServico = document.getElementById('n_tp_servico');
                selectServico.value = tipoServico;
                selecionaCamposServico('1');
                
          const dados = registros[0];



          Object.entries(dados).forEach(([chave, valor]) => {
            // serviço 12 em dir_destino/origem
            if (dados.tipo_servico === '12' && (chave === 'dir_destino' || chave === 'dir_origem')) {
              let objInterno;
              try {
                objInterno = JSON.parse(valor);
              } catch (e) {
                console.error(`JSON inválido em ${chave}:`, e);
                return;
              }

              Object.entries(objInterno).forEach(([innerKey, innerVal]) => {
                const innerEl = document.getElementById(innerKey);
                if (!innerEl) return;
                const tag = innerEl.tagName.toLowerCase();

                if (tag === 'input') {
                  const tipo = innerEl.type.toLowerCase();
                  if (['text', 'time', 'number'].includes(tipo)) {
                    innerEl.value = innerVal;
                  }
                }
                else if (tag === 'textarea') {
                  innerEl.value = innerVal;
                }
                else if (tag === 'select') {
                  let option = innerEl.querySelector(`option[value="${innerVal}"]`);
                  if (option) {
                    innerEl.value = innerVal;
                  } else {
                    innerEl.add(new Option(innerVal, innerVal, true, true));
                  }
                  innerEl.dispatchEvent(new Event('change'));
                }
              });
              return;
            }

            // fluxo padrao para outros campos
            const el = document.getElementById(chave);
            if (!el) return;
            const tag = el.tagName.toLowerCase();
            const valorFinal = valor;

            if (tag === 'input') {
              const tipo = el.type.toLowerCase();
              if (['text', 'time', 'number'].includes(tipo)) {
                el.value = valorFinal;
              }
            }
            else if (tag === 'textarea') {
              el.value = valorFinal;
            }
            else if (tag === 'select') {
              const option = Array.from(el.options).find(opt => opt.value === valorFinal);

              if (option) {
                el.value = valorFinal;      // atribuição correta
              } else {
                el.add(new Option(valorFinal, valorFinal, true, true));
              }

              el.dispatchEvent(new Event('change'));
            }
          });

          document.getElementById('type_id').value = "ALTERAR";

          
          $container.html("");


      },
      error(xhr, status, err) {
          console.error('Erro de comunicação ou processamento:', err);
          $('#container-tabela').text('Erro ao buscar detalhes da tarefa.');
      }
  });
}




function popula_selects(){
    const id_chat = document.getElementById('id_chat');
    if(id_chat){
      id_chat.innerHTML = '';
      const livreOption = new Option('', '');  
      id_chat.appendChild(livreOption);         
      v_chats.forEach(item => {
          const option = document.createElement('option');
          option.value = item.codigo;
          option.textContent = item.nome_grupo;
          id_chat.appendChild(option);
          }); 
    }   
    const host_fixo = document.getElementById('host_fixo');
    if(host_fixo){
      host_fixo.innerHTML = '';
      const livreOption = new Option('Livre', '0');
      host_fixo.appendChild(livreOption);          
      v_hosts.forEach(item => {
          const option = document.createElement('option');
          option.value = item.nome_maquina;
          option.textContent = item.nome_maquina;
          host_fixo.appendChild(option);
          }); 
    }   
    
    const tag_bloq = document.getElementById('tag_bloq');
    if(tag_bloq){
      tag_bloq.innerHTML = '';

      const livreOption = new Option('', '');
      tag_bloq.appendChild(livreOption);      

      const livreOption2 = new Option('[CRIAR TAG]', '[CRIAR TAG]');
      tag_bloq.appendChild(livreOption2);            
      
      
      v_tag_bloq.forEach(item => {
          const option = document.createElement('option');
          option.value = item.tag_bloq;
          option.textContent = item.tag_bloq;
          tag_bloq.appendChild(option);
          }); 
    }    

}



function generateTela(identidade, containerId) {
  const telasDataObject = window.telasData;
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  const tela = telasDataObject.telas.find(t => t.identidade === Number(identidade));
  if (!tela) return;

  const fragment = document.createDocumentFragment();

  tela.campos.forEach(field => {
    // Cria o container do campo com a classe campo-bloco
    const wrapper = document.createElement("div");
    wrapper.classList.add("campo-bloco");

    // Cria o label
    const label = document.createElement("label");
    label.setAttribute("for", field.id);
    label.textContent = field.label;
    wrapper.appendChild(label);

    // Cria o elemento de entrada conforme o tipo
    let el;
    switch (field.type) {
      case "select":
        el = document.createElement("select");
        if (field.options) {
          field.options.forEach(opt => {
            const option = document.createElement("option");
            option.value = opt.value;
            option.textContent = opt.text;
            el.appendChild(option);
          });
        }
        break;

      case "textarea":
        el = document.createElement("textarea");
        if (field.rows) el.rows = field.rows;
        if (field.cols) el.cols = field.cols;
        break;

      default:
        el = document.createElement("input");
        el.type = field.type;
        break;
    }

    // Atribui os atributos do JSON ao elemento criado
    Object.entries(field).forEach(([key, value]) => {
      if (["label", "options", "optionsSource"].includes(key)) return;
      if (value !== "") el.setAttribute(key, value);
    });

    wrapper.appendChild(el);
    fragment.appendChild(wrapper);
  });


  // --- INÍCIO: Campos adicionais ---
    const extras = [
      { id: "intervalo_cadeia", label: "Intervalo Cadeia", type: "text" },
      { id: "resultado_tarefa", label: "Resultado Tarefa", type: "text" },
      { id: "mensagem_resultado_tarefa", label: "Mensagem Resultado Tarefa", type: "textarea", rows: 3, cols: 30 }
      
    ];

    extras.forEach(field => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("campo-bloco","campo-extra");

      const label = document.createElement("label");
      label.setAttribute("for", field.id);
      label.textContent = field.label;
      wrapper.appendChild(label);

      let el;
      if (field.type === "textarea") {
        el = document.createElement("textarea");
        if (field.rows) el.rows = field.rows;
        if (field.cols) el.cols = field.cols;
      } else {
        el = document.createElement("input");
        el.type = field.type;
      }
      el.id = field.id;
      el.disabled = true;
      wrapper.appendChild(el);
      fragment.appendChild(wrapper);
    });
    // --- FIM: Campos adicionais ---  


  container.appendChild(fragment);
  popula_selects();
}



function selecionaCamposServico(tipo){
  const selectX = document.getElementById('n_tp_servico');
  
  if (!selectX){return;};
  if(selectX.value == ''){return;};

  generateTela(selectX.value,'nova_tarefa');

  selectX.disabled = (Number(tipo) === 1); 
    
}



function link_para_tela_id(){
  let tipo = document.getElementById('type_id').value
  let id_selecionado = document.getElementById('selected_id').value
  let tipo_serv = document.getElementById('n_tp_servico').value;

  const host = `http://${location.host}`;
  const tiposLinks = {
    '1':'wrk_01_tf','2':'wrk_02_up_gcp','3':'wrk_03_down_gcp',
    '4':'wrk_04_procedure_gcp','5':'wrk_05_script_py','6':'wrk_06_script_sas',
    '7':'wrk_07_excel_vba','8':'wrk_08_up_srv_sas','9':'wrk_09_down_srv_sas',
    '10':'wrk_10_script_vbs','11':'wrk_11_funcao_true_py',
    '12':'wrk_12_gcp_csv_tbl','13':'wrk_13_tf_mft'
  };

  if (tipo === 'ALTERAR' && tipo_serv !== ''){
    const caminho = tiposLinks[tipo_serv];
    if (!caminho) {
      alert('Tipo de serviço não programado (' + tipo_serv + ')');
      return;
    }    
    window.open(`${host}/${caminho}?linha=${id_selecionado}`, '_blank');
  }
}










function funcao_consultar_historico_no_modal(){
    const numeroTarefa = document.getElementById('selected_id').value;
    const tipo = document.getElementById('type_id').value;

    if(tipo === 'NOVO'){
        alert('ATENÇÃO\n\n\FALHA: Não é possivel consultar histórico de uma tarefa ainda não criada!');
        return;      
    }

    if (!numeroTarefa) {
        alert('ATENÇÃO\n\n\FALHA: Não recebeu o ID da tarefa!');
        return false;
    }
    if (numeroTarefa === '' || numeroTarefa == '0') {
        alert('ATENÇÃO\n\n\FALHA: Não recebeu o ID da tarefa!');
        return false;
    }    

    document.getElementById('numero_pesquisado').innerHTML = numeroTarefa;
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'listar_historico_tarefa',
        beforeSend: function () {
            document.getElementById('abrirModal').click();
            $('#modal_icone_pesquisando').html(`<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`);
        },
        data: {
            id_tarefa: numeroTarefa,
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

};