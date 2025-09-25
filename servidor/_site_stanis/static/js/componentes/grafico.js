function funcao_busca_processos_grafico() {
    const selAssunto = document.getElementById('txt_sel_assunto');
    const selCadeia  = document.getElementById('txt_sel_cadeia');
    const dtPesq      = document.getElementById('dt_pesq');
  
    if (!dtPesq.value || !selAssunto.value || !selCadeia.value
        || selAssunto.value === '1' || selCadeia.value === '1') {
      alert('Falta informações para realizar essa ação!');
      return;
    }
  
    const container = document.getElementById('chart_div');
    if (!container) {
      console.error('Elemento container "chart_div" não encontrado.');
      return;
    }
  
    $('#recebe_gif_processando').html(
      `<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`
    );
  
    $.getJSON('busca_processo_grafico', {
      txt_sel_assunto: selAssunto.value,
      txt_sel_cadeia:  selCadeia.value,
      txt_dt_pesq:     dtPesq.value
    })
    .done(data => {
      $('#recebe_gif_processando').empty();
      google.charts.load('current', { packages: ['orgchart'] });
      google.charts.setOnLoadCallback(() => {
        const assuntos = [...new Set(data.map(item => item.assunto))];
        const cadeiasMap = data.reduce((m, item) => {
          if (!m.has(item.cadeia)) m.set(item.cadeia, item.assunto);
          return m;
        }, new Map());
  
        const rows = [];
        assuntos.forEach(a => rows.push([{ v: a, f: `<b>${a}</b>` }, '', 'Assunto']));
        cadeiasMap.forEach((a, c) => rows.push([{ v: c, f: `<b>${c}</b>` }, a, 'Cadeia']));
  
        data.forEach(item => {
          const baseDesc = item.desc_b || '';
          const erroTxt = item.resultado === 'FALHA'
            ? ' → ' + (item.msg_erro || '').replace(/[,\'";\-:`]/g, '').substring(0, 50) + '...'
            : '';
          const desc = baseDesc + erroTxt;
          const depende = (!item.depende || item.depende === 'NULL') ? item.cadeia : item.depende;
  
          let tooltip;
          if (item.resultado === 'SUCESSO') {
            tooltip = `<b><div style="color:#2471A3;size:10px;">${desc}<br>${item.tipo}: Ok</div></b>`;
          } else if (item.resultado === 'FALHA') {
            tooltip = `<b><div style="color:#CD6155;size:10px;">${desc}<br>${item.tipo}: Falha</div></b>`;
          } else {
            tooltip = `<div style="color:#B2BABB;size:10px;">${desc}<br>${item.tipo}</div>`;
          }
  
          rows.push([
            { v: item.id_tarefa.toString(), f: `${item.id_tarefa} ${tooltip}` },
            depende,
            desc
          ]);
        });
  
        const dataTable = new google.visualization.DataTable();
        dataTable.addColumn('string', 'Name');
        dataTable.addColumn('string', 'Manager');
        dataTable.addColumn('string', 'ToolTip');
        dataTable.addRows(rows);
  
        const chart = new google.visualization.OrgChart(container);
        chart.draw(dataTable, {
          allowHtml:     true,
          allowCollapse: false,
          compactRows:   true,
          size:          'medium'
        });
  
        google.visualization.events.addListener(chart, 'select', () => {
          const sel = chart.getSelection();
          if (sel.length === 1) {
            const name = dataTable.getValue(sel[0].row, 0);
            chamar_modal_id(name);
          }
        });
      });
    })
    .fail((jqxhr, status, error) => {
      $('#recebe_gif_processando').empty();
      console.error('Erro ao obter dados:', status, error);
    });
  }
  