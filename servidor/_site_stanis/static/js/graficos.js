function obterParamentrosInformado() {
  const data_ini = document.getElementById('data_ini').value;
  const data_fim = document.getElementById('data_fim').value;
  const assuntos = Array.from(document.getElementById('assuntos').selectedOptions).map(o => o.value);
  const cadeias = Array.from(document.getElementById('cadeias').selectedOptions).map(o => o.value);
  const maquinas = Array.from(document.getElementById('maquinas').selectedOptions).map(o => o.value);
  const servicos = Array.from(document.getElementById('servicos').selectedOptions).map(o => o.value);
  return { data_ini, data_fim, assuntos, cadeias, maquinas, servicos };
}

const delay = ms => new Promise(r => setTimeout(r, ms));
// lista de funções na ordem
const graficos = [ graf_1_5, graf_2_4, graf_3, graf_6, graf_10, graf_8, graf_7];

async function enviarParametros() {
    const $el = $('#recebe_gif_processando');
    $el.html(`<br><br><div class="loader"><b>Processando&nbsp</b>  <div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`);
      
    try {
        for (const fn of graficos) {
            await Promise.resolve(fn());
            await delay(1500);
        }
        $el.empty();
    } catch (err) {
        console.error(err);
        $el.html(`
        <span style="color:#d32f2f;font-weight:600;">
            Erro ao gerar gráficos: ${err.message || err}
        </span>
        `);
    }
}



function graf_1_5() {
  const { data_ini, data_fim, assuntos, cadeias, maquinas, servicos } = obterParamentrosInformado();
  if (!data_ini || !data_fim) {
    alert('Informe a Data inicial e Final.');
    return;
  }
    let pagina = "grafico_hora_hora_hist";
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: pagina,
        data: {
            data_ini: data_ini,
            data_fim: data_fim,
            assuntos: assuntos,
            cadeias: cadeias,
            maquinas: maquinas,
            servicos: servicos
        },
        success: function (resposta, textStatus, jqXHR){
            const { categories, series } = gerarSerieGraficoAuto(resposta,'hr_execucao','resultado');
            console.log('Categories geradas:', categories);
            console.log('Series geradas:', series);            
            atualizar_grafico_chart1_chart5(categories, series);                
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Erro na requisição:', textStatus, errorThrown);
            let mensagem = jqXHR.responseText || errorThrown;
            alert(mensagem);
            document.getElementById('btEnviar').disabled = false; 
        },    
        complete: () => {
            document.getElementById('btEnviar').disabled = false;       
        } 
    })   
}


function graf_2_4() {
  const { data_ini, data_fim, assuntos, cadeias, maquinas, servicos } = obterParamentrosInformado();
  if (!data_ini || !data_fim) {
    alert('Informe a Data inicial e Final.');
    return;
  }
    let pagina = "grafico_hora_hora_exe_maquinas";
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: pagina,
        data: {
            data_ini: data_ini,
            data_fim: data_fim,
            assuntos: assuntos,
            cadeias: cadeias,
            maquinas: maquinas,
            servicos: servicos
        },
        success: function (resposta, textStatus, jqXHR){
            const { categories, series } = gerarSerieGraficoAuto(resposta,'hr_execucao','host_name');          
            atualizar_grafico_chart2_chart4(categories, series);                
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Erro na requisição:', textStatus, errorThrown);
            let mensagem = jqXHR.responseText || errorThrown;
            alert(mensagem);
            document.getElementById('btEnviar').disabled = false; 
        },    
        complete: () => {
            document.getElementById('btEnviar').disabled = false;       
        } 
    })   
}



function graf_7(){
  const { data_ini, data_fim, assuntos, cadeias, maquinas, servicos } = obterParamentrosInformado();
  if (!data_ini || !data_fim) {
    alert('Informe a Data inicial e Final.');
    return;
  }
    let pagina = "grafico_resultados_mes_mes";
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: pagina,
        data: {
            data_ini: data_ini,
            data_fim: data_fim,
            assuntos: assuntos,
            cadeias: cadeias,
            maquinas: maquinas,
            servicos: servicos
        },
        success: function (resposta, textStatus, jqXHR){
            const { categories, series } = gerarSerieGraficoAuto(resposta,'mes','resultado');        
            atualizar_grafico_chart7(categories, series);                
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Erro na requisição:', textStatus, errorThrown);
            let mensagem = jqXHR.responseText || errorThrown;
            alert(mensagem);
            document.getElementById('btEnviar').disabled = false; 
        },    
        complete: () => {
            document.getElementById('btEnviar').disabled = false;       
        } 
    })   
}


function graf_8(){
  const { data_ini, data_fim, assuntos, cadeias, maquinas, servicos } = obterParamentrosInformado();
  if (!data_ini || !data_fim) {
    alert('Informe a Data inicial e Final.');
    return;
  }
    let pagina = "grafico_tipo_servico_mes_mes";
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: pagina,
        data: {
            data_ini: data_ini,
            data_fim: data_fim,
            assuntos: assuntos,
            cadeias: cadeias,
            maquinas: maquinas,
            servicos: servicos
        },
        success: function (resposta, textStatus, jqXHR){
            const { categories, series } = gerarSerieGraficoAuto(resposta,'mes','tipo_servico');         
            atualizar_grafico_chart8(categories, series);                
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Erro na requisição:', textStatus, errorThrown);
            let mensagem = jqXHR.responseText || errorThrown;
            alert(mensagem);
            document.getElementById('btEnviar').disabled = false; 
        },    
        complete: () => {
            document.getElementById('btEnviar').disabled = false;       
        } 
    })   
}



function graf_10(){
  const { data_ini, data_fim, assuntos, cadeias, maquinas, servicos } = obterParamentrosInformado();
  if (!data_ini || !data_fim) {
    alert('Informe a Data inicial e Final.');
    return;
  }
    let pagina = "grafico_tempo_tipo_servico_mes_mes";
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: pagina,
        data: {
            data_ini: data_ini,
            data_fim: data_fim,
            assuntos: assuntos,
            cadeias: cadeias,
            maquinas: maquinas,
            servicos: servicos
        },
        success: function (resposta, textStatus, jqXHR){
            const { categories, series } = gerarSerieGraficoAuto(resposta,'mes','tipo_servico');         
            atualizar_grafico_chart10(categories, series);                
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Erro na requisição:', textStatus, errorThrown);
            let mensagem = jqXHR.responseText || errorThrown;
            alert(mensagem);
            document.getElementById('btEnviar').disabled = false; 
        },    
        complete: () => {
            document.getElementById('btEnviar').disabled = false;       
        } 
    })   
}



function graf_3(){
  const { data_ini, data_fim, assuntos, cadeias, maquinas, servicos } = obterParamentrosInformado();
  if (!data_ini || !data_fim) {
    alert('Informe a Data inicial e Final.');
    return;
  }
    let pagina = "grafico_tempo_tipo_servico_hr_hr";
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: pagina,
        data: {
            data_ini: data_ini,
            data_fim: data_fim,
            assuntos: assuntos,
            cadeias: cadeias,
            maquinas: maquinas,
            servicos: servicos
        },
        success: function (resposta, textStatus, jqXHR){
            const { categories, series } = gerarSerieGraficoAuto(resposta,'hr_execucao','tipo_servico');         
            atualizar_grafico_chart3(categories, series);                
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Erro na requisição:', textStatus, errorThrown);
            let mensagem = jqXHR.responseText || errorThrown;
            alert(mensagem);
            document.getElementById('btEnviar').disabled = false; 
        },    
        complete: () => {
            document.getElementById('btEnviar').disabled = false;       
        } 
    })   
}



function graf_6(){
  const { data_ini, data_fim, assuntos, cadeias, maquinas, servicos } = obterParamentrosInformado();
  if (!data_ini || !data_fim) {
    alert('Informe a Data inicial e Final.');
    return;
  }
    let pagina = "grafico_tempo_tipo_servico";
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: pagina,
        data: {
            data_ini: data_ini,
            data_fim: data_fim,
            assuntos: assuntos,
            cadeias: cadeias,
            maquinas: maquinas,
            servicos: servicos
        },
        success: function (resposta, textStatus, jqXHR){       
            atualizar_grafico_chart6(resposta);                
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Erro na requisição:', textStatus, errorThrown);
            let mensagem = jqXHR.responseText || errorThrown;
            alert(mensagem);
            document.getElementById('btEnviar').disabled = false; 
        },    
        complete: () => {
            document.getElementById('btEnviar').disabled = false;       
        } 
    })   
}



function atualizarVisualizacao() {
  const { data_ini, data_fim, assuntos, cadeias, maquinas, servicos } = obterParamentrosInformado();
  const container = document.getElementById('visualFiltro');
  container.innerHTML = `
    <br>
    <b>Parâmetros do Filtro</b><br><br>
    <b>Intervalo:</b> ${data_ini} - ${data_fim}<br>
    <b>Assuntos:</b> ${assuntos.join(', ') || ''}<br>
    <b>Cadeias:</b> ${cadeias.join(', ') || ''}<br>
    <b>Máquinas:</b> ${maquinas.join(', ') || ''}<br>
    <b>Serviços:</b> ${servicos.join(', ') || ''}<br>
  `;
}

// atualização visual
document.addEventListener('DOMContentLoaded', () => {
  const ids = ['data_ini','data_fim','assuntos','cadeias','maquinas','servicos'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', atualizarVisualizacao);
    }
  });
  atualizarVisualizacao();
});







function gerarSerieGraficoAuto(data, categoryKey, groupKey=null) {
  let arr = typeof data==='string'?JSON.parse(data):data;
  if(arr&&arr.data&&Array.isArray(arr.data)) arr=arr.data;
  if(!Array.isArray(arr)||!arr.length) return {categories:[],series:[]};
  const keys=Object.keys(arr[0]);
  if(!keys.includes(categoryKey)) throw new Error(`Categoria ${categoryKey} não existe`);
  const categories=[...new Set(arr.map(i=>i[categoryKey]))];
  const grp = groupKey && keys.includes(groupKey)
    ? groupKey
    : keys.find(k=>k!==categoryKey&&typeof arr[0][k]==='string');
  if(!grp) throw new Error("Não encontrei campo de agrupamento");
  const numKeys=keys.filter(k=>typeof arr[0][k]==='number'&&k!==categoryKey);
  if(!numKeys.length) throw new Error("Não há campo numérico para valor");
  const yKey=numKeys[0];
  const grouped=arr.reduce((a,i)=>{
    const g=i[grp];
    (a[g]||(a[g]=[])).push(i);
    return a;
  },{});
  const series=Object.entries(grouped).map(([g,items])=>({
    name:g,
    data:categories.map(cat=>{
      const m=items.find(i=>i[categoryKey]===cat);
      return m?m[yKey]:null;
    })
  }));
  return {categories,series};
}










// atualizar grafico 1
function atualizar_grafico_chart1_chart5(dados_categoria_sem_duplicidade_g1,dados_series_g1){
        var options = {
            chart: {
                type: 'line', 
                zoom:{enabled:false}, 
                height: 250,
            },
            series: [
                {
                    name: 'Sucesso',
                    data: dados_series_g1[1].data,
                },
                {
                    name: 'Falha',
                    data: dados_series_g1[0].data,
                    color: '#E74C3C',
                }
            ],    
            stroke: {
                curve: 'smooth'
            },
            dataLabels: {
                enabled: true
            },                
            title: {
                text: 'Qtd. Tarefas Executadas Hora a Hora',
                align: 'left'
            },                
            xaxis: {
                type: 'category',
                categories: dados_categoria_sem_duplicidade_g1
            },
            yaxis: [
            {
                seriesName: "Sucesso",
            },
            {
                seriesName: "Falha",
                opposite: true

                }                  
            ]
        };


        try {
            window.chart1.updateOptions(options);
        } catch (err) {
            window.chart1 = new ApexCharts(document.querySelector('#chart1'), options);
            window.chart1.render();
        }      

            
            var options = {
            chart: {
                type: 'radar',
                height: 250,
                zoom:{enabled:false},
                stacked: true,
                toolbar: {
                    show: true
                }
            },
            series: [
                {
                    name: 'Sucesso',
                    data: dados_series_g1[1].data,
                },
                {
                    name: 'Falha',
                    data: dados_series_g1[0].data,
                    color: '#E74C3C',
                }
            ],              
            xaxis: {
                type: 'category',
                categories: dados_categoria_sem_duplicidade_g1
            }
        };

        try {
            window.chart5.updateOptions(options);
        } catch (err) {
            window.chart5 = new ApexCharts(document.querySelector('#chart5'), options);
            window.chart5.render();
        } 
}


function atualizar_grafico_chart2_chart4(dados_categoria_sem_duplicidade_g2,dados_series_g2){
        var options = {
            chart: {
                type: 'bar',         
                height: 250,
                zoom:{enabled:false},
                stacked: true,
                toolbar: {
                    show: true
                }
            },
            series: dados_series_g2,
            plotOptions: {
            bar: {
                horizontal: false,
                dataLabels: {
                total: {
                    enabled: true,
                }
                }
            },
            },        
            title: {
                text: 'Qtd. Tarefas Executadas por Maquina',
                align: 'left'
            },                
            xaxis: {
                type: 'category',
                categories: dados_categoria_sem_duplicidade_g2
            }
        };

        try {
            window.chart2.updateOptions(options);
        } catch (err) {
            window.chart2 = new ApexCharts(document.querySelector('#chart2'), options);
            window.chart2.render();
        } 


            var options = {
            chart: {
                type: 'radar',
                height: 250,
                zoom:{enabled:false},
                stacked: true,
                toolbar: {
                    show: true
                }
            },
            series: dados_series_g2,                   
            xaxis: {
                type: 'category',
                categories: dados_categoria_sem_duplicidade_g2
            }
        };

    try {
        window.chart4.updateOptions(options);
    } catch (err) {
        window.chart4 = new ApexCharts(document.querySelector('#chart4'), options);
        window.chart4.render();
    }  
}


function atualizar_grafico_chart7(dados_categoria_sem_duplicidade_g7,dados_series_g7){
    var options = {
        chart: {
            type: 'line', 
            zoom:{enabled:false},
            height: 250,
            id: 'A01'      
        },
        series: [
            {
                name: 'Sucesso',
                data: dados_series_g7[1].data,
            },
            {
                name: 'Falha',
                data: dados_series_g7[0].data,
                color: '#E74C3C',
            }
        ],    
        stroke: {
            curve: 'smooth'
        },
        dataLabels: {
            enabled: true
        },        
        title: {
            text: 'Qtd. Tarefas Executadas',
            align: 'left'
        },                
        xaxis: {
            type: 'category',
            categories: dados_categoria_sem_duplicidade_g7
        },
        yaxis: [
        {
            seriesName: "Sucesso",
        },
        {
            seriesName: "Falha",
            opposite: true

            }                  
        ]
    };
    try {
        window.chart7.updateOptions(options);
    } catch (err) {
        window.chart7 = new ApexCharts(document.querySelector('#chart7'), options);
        window.chart7.render();
    }        

}



function atualizar_grafico_chart8(dados_categoria_sem_duplicidade_g8,dados_series_g8){
        var options = {
            chart: {
                type: 'bar',           
                height: 250,
                zoom:{enabled:false},
                stacked: true,
                toolbar: {
                    show: true
                }                
            },
            series: dados_series_g8,  
            plotOptions: {
            bar: {
                horizontal: false,
                dataLabels: {
                    total: {
                        enabled: true,
                        }
                    }
                }
            },                 
            title: {
                text: 'Qtd. Tarefas Exe. por Serviço',
                align: 'left'
            },                
            xaxis: {
                type: 'category',
                categories: dados_categoria_sem_duplicidade_g8
            }
        };

        try {
            window.chart8.updateOptions(options);
        } catch (err) {
            window.chart8 = new ApexCharts(document.querySelector('#chart8'), options);
            window.chart8.render();
        }    

}



function decHorasParaHHMM(v) {
  if (typeof v !== 'number' || isNaN(v)) return ;
  let h = Math.floor(v);
  let m = Math.round((v - h) * 60);
  if (m === 60) { h += 1; m = 0; }
  return `${h}:${m.toString().padStart(2, '0')}`;
}

function atualizar_grafico_chart10(categorias, dados_series_g10) {
     var options = {
            chart: {
                type: 'line',           
                height: 250,
                zoom:{enabled:false},
                id: 'A02'                
            },
            series: dados_series_g10,
            dataLabels: {
                enabled: true,
                formatter: decHorasParaHHMM
            },
            tooltip: {
                y: { formatter: decHorasParaHHMM }
            },             
            stroke: {
                curve: 'smooth'
            },                                   
            title: {
                text: 'Qtd. Horas Exe. por Serviço',
                align: 'left'
            },                
            xaxis: {
                type: 'category',
                categories: categorias
            }
        };
        try {
            window.chart10.updateOptions(options);
        } catch (err) {
            window.chart10 = new ApexCharts(document.querySelector('#chart10'), options);
            window.chart10.render();
        }   
}



function prepararRankingHoras(dados) {
  const totais = dados.reduce((acc, { tempo, tipo_servico }) => {
    acc[tipo_servico] = (acc[tipo_servico] || 0) + tempo; // tempo já é número
    return acc;
  }, {});

  const ordenado = Object.entries(totais)
    .map(([tipo_servico, total]) => ({ tipo_servico, total }))
    .sort((a, b) => b.total - a.total); // desc

  return {
    series: [
      {
        name: 'Horas',
        data: ordenado.map(o => o.total)
      }
    ],
    categories: ordenado.map(o => o.tipo_servico)
  };
}

function atualizar_grafico_chart3(dados_categoria_sem_duplicidade_g3, dados_series_g3) {
        var options = {
            chart: {
                type: 'line',           
                height: 250,
                zoom:{enabled:false}
            },
            series: dados_series_g3,
            dataLabels: {
                enabled: true,
                formatter: decHorasParaHHMM
            },
            tooltip: {
                y: { formatter: decHorasParaHHMM }
            },            
            stroke: {
                curve: 'smooth'
            },                                   
            title: {
                text: 'Qtd. Horas por Serviço',
                align: 'left'
            },                
            xaxis: {
                type: 'category',
                categories: dados_categoria_sem_duplicidade_g3
            }
        };

        try {
            window.chart3.updateOptions(options);
        } catch (err) {
            window.chart3 = new ApexCharts(document.querySelector('#chart3'), options);
            window.chart3.render();
        }     
}


function montarSerieScatter(resumo) {
  return [
    {
      name: 'Horas',
      data: resumo.map(r => ({ x: r.tipo_servico, y: r.tempo }))
    }
  ];
}

function atualizar_grafico_chart6(dados_series_g6) {
        console.log(dados_series_g6)
        novo = montarSerieScatter(dados_series_g6)
        var options = {
            chart: {
                type: 'scatter',  
                zoom:{enabled:false},         
                height: 250      
            },      
            series: novo,                     
            dataLabels: {
                enabled: false,
                formatter: decHorasParaHHMM
            },
            tooltip: {
                y: { formatter: decHorasParaHHMM }
            },  
            yaxis:  {
                labels: { show: false },   
                axisBorder: { show: false },
                axisTicks:  { show: false }
                },                                
            title: {
                text: 'Rank Horas por Serviço',
                align: 'left'
            },   			
            legend: {
                show: false
            }
        };
        try {
            window.chart6.updateOptions(options);
        } catch (err) {
            window.chart6 = new ApexCharts(document.querySelector('#chart6'), options);
            window.chart6.render();
        }       
}