function func_pesq_id_tarefa_inicio() {
    const txtIdTarefa = document.getElementById("searchInput").value.trim();
    if (!txtIdTarefa) return;
  
    const pagina = "inicio_modal";
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: pagina,
      data: { txt_id_tarefa: txtIdTarefa },
      beforeSend: () => {
        $('#recebe_gif_processando').html(
          `<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`
        );
      },
      success: (resultados, textStatus, xhr) => {
        console.log("Sucesso! Código de retorno:", xhr.status);
        $('#recebe_gif_processando').empty();
        $('#searchInput').val("");
        
        if(xhr.status==200){

            let html = `
            <div style="max-height:400px;" class="rolagem_modal_pesquisa">
                <table border="1" class="rolagem_modal_pesquisa" style="max-height:380px">
            `;
    
            resultados.forEach(item => {
            html += `
                <tr></tr>
                <tr>
                <td><b>Id tarefa:</b></td>
                <td><b><a class="cls_a" style="font-size:12px; color:var(--fonttext);" href="${item.link}" target="_blank" title="Clique para acessar a tarefa">${item.id_tarefa}</a></b></td>
                </tr>
                <tr>
                <td><b>Assunto:</b></td>
                <td><a class="cls_a" style="font-size:11px; color:var(--fonttext);" href="javascript:void(0)" onclick="abrirGrafico('${item.assunto}','${item.cadeia}')">${item.assunto}</a></td>
                </tr>
                <tr>
                <td><b>Cadeia:</b></td>
                <td><a class="cls_a" style="font-size:11px; color:var(--fonttext);" href="javascript:void(0)" onclick="abrirGrafico('${item.assunto}','${item.cadeia}')">${item.cadeia}</a></td>
                </tr>
                <tr>
                <td><b>Tipo Serviço:</b></td>
                <td>${item.tipo}</td>
                </tr>
                <tr>
                <td><b>Descrição:</b></td>
                <td>${item.descricao}</td>
                </tr>
                <tr>
                <td><b>Nome responsável:</b></td>
                <td>${item.nome}</td>
                </tr>
            `;
            });
    
            html += `
                </table>
            </div>
            `;
    
            $('#retorno').html(html);

        }else if (xhr.status==204){
            alert('A pesquisa não retornou resultado.')
            $('#retorno').html("");

        }else if (xhr.status==400){
            alert(`A solicitação foi chegou corretamente ao servidor.\n\n${resultados}`)
            $('#retorno').html("");
        }else if (xhr.status==500){
            alert(`ERRO: ${resultados}`)
            $('#retorno').html("");
        }
      },
      error: (xhr, textStatus, errorThrown) => {
        if(resultados){
            detalhe_erro = String(resultados).trim()
        }
        
        $('#recebe_gif_processando').html(
          `<p>Erro ao processar a requisição (código ${xhr.status}).</p>${detalhe_erro}`
        );
      },
      complete: (xhr, textStatus) => {
        console.log("Requisição finalizada com status:", xhr.status);
      }
    });
  }
  