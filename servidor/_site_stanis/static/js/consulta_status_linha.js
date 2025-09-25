let funcao_atualizar_linha_em_execucao = false;

function funcao_atualizar_linha(numero_tarefa = '', col = 0) {

    if (funcao_atualizar_linha_em_execucao) {
        alert("Aguarde a conclusão da chamada anterior antes de fazer novas chamadas.");
        return;
    }
    funcao_atualizar_linha_em_execucao = true;


    if (!numero_tarefa) {
        alert('FALHA: NÃO RECEBEU O ID DA TAREFA!');
        funcao_atualizar_linha_em_execucao = false;
        return;
    }

    const pagina = "consulta_linha";
    const linha_tabela = $(`#tbl_1 tr`).filter(function(){
        return $(this).find("td:eq(0)").text() === String(numero_tarefa);
    });

    if (linha_tabela.length === 0){
         console.error("Linha da tabela não encontrada para o ID:", numero_tarefa);
        funcao_atualizar_linha_em_execucao = false;
        return;
    }
    
    let celulaResultado = linha_tabela.find("td:eq(" + col + ")");

    if (celulaResultado.length === 0) {
        console.error("Célula da coluna não encontrada para o ID:", numero_tarefa, "e coluna:", col);
        funcao_atualizar_linha_em_execucao = false;
        return;
    }
    
    const loadingHtml = `<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
    celulaResultado.html(loadingHtml); // exibe o loading imediatamente

    setTimeout(function() {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: pagina,
            data: {
                id_tarefa: numero_tarefa
            },
            success: function (data) {
                if (!Array.isArray(data) || data.length === 0) {
                    celulaResultado.replaceWith(`<td></td>`);
                    funcao_atualizar_linha_em_execucao = false;
                    return;
                }
                
                data.forEach(function (dados) {
    
                    if (linha_tabela.length > 0){
                       if (celulaResultado.length > 0){
                           let resultado_tarefa = dados['resultado_tarefa'];
                           let hora_ini_execucao = dados['hora_ini_execucao'];
                           let estado_tarefa = dados['estado_tarefa'];

                           if(estado_tarefa === 'INATIVO'){
                                resultado_tarefa = 'PARADO';
                           }
                           
                           let resultado_html = '';
                           if (resultado_tarefa === 'SUCESSO') {
                               resultado_html = `<td style='background-color: #ABEBC6;font-size:9px;' title='Execução iniciada em: ${hora_ini_execucao}'>${resultado_tarefa}</td>`;
                            } else if (resultado_tarefa === 'FALHA') {
                                resultado_html = `<td style='background-color: #F5B7B1;font-size:9px;' title='Execução iniciada em: ${hora_ini_execucao}'>${resultado_tarefa}</td>`;
                            } else if (resultado_tarefa === 'AGUARDANDO MFT') {
                                resultado_html = `<td style='background-color: #bb8fce;font-size:8px;' title='Execução iniciada em: ${hora_ini_execucao}'>${resultado_tarefa}</td>`;                                
                            } else {
                                resultado_html = `<td style='font-size:8px' title='Execução iniciada em: ${hora_ini_execucao}'>${resultado_tarefa}</td>`;
                            }
                           
                           celulaResultado.replaceWith(resultado_html);
                        }
                    }
                });
                funcao_atualizar_linha_em_execucao = false;
            },
            error: function (xhr, status, error) {
                console.error("Erro na requisição AJAX:", status, error);
                celulaResultado.html("<p style='color:red;'>Erro</p>");
                funcao_atualizar_linha_em_execucao = false;
            }
        });
    }, 1000);
}