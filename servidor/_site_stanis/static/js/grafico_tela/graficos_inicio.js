function atualizar_grafico_hora_hora(cor_fundo = '', cor_texto = '') {
    let backgroundColor, textColor;

    if (cor_fundo === '' || cor_texto === '') {
        const rootStyles = getComputedStyle(document.documentElement);
        backgroundColor = rootStyles.getPropertyValue('--bg2').trim();
        textColor = rootStyles.getPropertyValue('--fonttext').trim();
    } else {
        backgroundColor = cor_fundo.trim();
        textColor = cor_texto.trim();
    }

    const dataAtual = new Date().toISOString().split('T')[0];

    $.ajax({
        url: 'graficos_inicio_func',
        type: 'GET',
        data: {
            txt_dt_ini: dataAtual,
            txt_dt_fim: dataAtual
        },
        dataType: 'json',
        success: function(data) {
            const horas = Array.from({ length: 24 }, (_, i) => i);
            const sucessos = Array(24).fill(0);
            const falhas = Array(24).fill(0);

            data.forEach(item => {
                const hora = item.hr_execucao;
                if (item.resultado === 'SUCESSO') {
                    sucessos[hora] = item.qtd;
                } else if (item.resultado === 'FALHA') {
                    falhas[hora] = item.qtd;
                }
            });

            const options = {
                chart: {
                    type: 'area',
                    zoom: { enabled: false },
                    height: 250,
                    background: backgroundColor,
                    foreColor: textColor,
                },
                 plotOptions: {
                    area: {
                        borderRadius: 5,
                    },
                },
                series: [
                    {
                        name: 'Sucesso',
                        data: sucessos,
                    },
                    {
                        name: 'Falha',
                        data: falhas,
                        color: '#E74C3C',
                    }
                ],
                stroke: {
                    curve: 'smooth',
                },
                title: {
                    text: 'Qtd. Execuções por Hora',
                    align: 'left',
                    style: {
                        color: textColor,
                    }
                },
                xaxis: {
                    categories: horas,
                    title: {
                        text: 'Hora de Execução',
                        style: {
                            color: textColor,
                        },
                    },
                    labels: {
                        style: {
                            colors: textColor,
                        },
                    },
                },
                yaxis: [
                    {
                        seriesName: 'Sucesso',
                        title: {
                            text: 'Quantidade de Sucessos',
                            style: {
                                color: textColor,
                            },
                        },
                        labels: {
                            formatter: function(val) {
                                return val.toFixed(0);
                            },
                            style: {
                                colors: textColor,
                            },
                        },
                    },
                    {
                        seriesName: 'Falha',
                        opposite: true,
                        title: {
                            text: 'Quantidade de Falhas',
                            style: {
                                color: textColor,
                            },
                        },
                        labels: {
                            formatter: function(val) {
                                return val.toFixed(0);
                            },
                            style: {
                                colors: textColor,
                            },
                        },
                    },
                ],
                tooltip: {
                    shared: true,
                    intersect: false,
                    y: {
                        formatter: function(val) {
                            return val.toFixed(0) + ' ocorrências';
                        },
                    },
                    style: {
                        color: textColor,
                    },
                },
            };

            const grafico = document.querySelector("#chart1");
            if (grafico.chartInstance) {
                grafico.chartInstance.destroy();
                grafico.chartInstance = null;
            }
            
            const chart = new ApexCharts(grafico, options);
            chart.render();
            grafico.chartInstance = chart;
        },
        error: function(xhr, status, error) {
            console.error('Erro ao carregar o gráfico:', error);
            alert('Erro ao carregar o gráfico: ' + error);
        }
    });
}