function validarEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

function funcao_cad_usuario(acao){

    let txt_usuario = document.getElementById('txt_usuario');
    let txt_nome_usuario = document.getElementById('txt_nome_usuario');
    let txt_email = document.getElementById('txt_email');
    let txt_perfil_usuario = document.getElementById('txt_perfil_usuario');
    let txt_id_google_chat = document.getElementById('txt_id_google_chat');

    if (acao == 1){
        // criar usuario
        if(txt_usuario.value == '' || txt_nome_usuario.value == '' || txt_email.value == '' || txt_perfil_usuario.value == ''){
            alert('FALHA: Falta informações para realizar essa ação.');
            return;
        }else{
            if (!validarEmail(txt_email.value)){
                alert('FALHA: Formato do email invalido.');
                return;
            }
            if (!confirm("Confirma a criação do usuario?") == true) {
                return;
            };
        }
    }
    
    if (acao == 2){
        // reset senha
        if(txt_usuario.value == ''){
            alert('FALHA: Falta informações para realizar essa ação.');
            return;
        }else{
            if (!confirm("Confirma o reset de senha do usuario '" + txt_usuario.value + "' ?") == true) {
                return;
            };
        }
    }

    if (acao == 3){
        // alterar usuario
        if(txt_usuario.value == '' || txt_nome_usuario.value == '' || txt_email.value == '' || txt_perfil_usuario.value == ''){
            alert('FALHA: Falta informações para realizar essa ação.');
            return;
        }else{
            if (!confirm("Confirma a alteração do usuario '" + txt_usuario.value + "' ?") == true) {
                return;
            };
        }
    }


    if (acao == 4){
        // excluir
        if(txt_usuario.value == ''){
            alert('FALHA: Falta informações para realizar essa ação.');
            return;
        }else{
            if (!confirm("Confirma o EXCLUIR permanentemente o usuario '" + txt_usuario.value + "' ?") == true) {
                return;
            };
        }
    }
    
    txt_usuario = String(txt_usuario.value).toUpperCase().trim()
    txt_nome_usuario = String(txt_nome_usuario.value).toUpperCase().trim()
    txt_email = String(txt_email.value).toLowerCase().trim()
    txt_perfil_usuario = String(txt_perfil_usuario.value).trim()
    txt_id_google_chat = String(txt_id_google_chat.value).trim()
    acao = String(acao)

    let pagina = "cadastro_usuarios";
    $.ajax({
        type: 'GET',
        dataType: 'text',
        url: pagina,
        beforeSend: function () {
            $('#recebe_gif_processando').html(`<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`);
        },
        data: {
            txt_usuario: txt_usuario,
            txt_nome_usuario: txt_nome_usuario,
            txt_email: txt_email,
            txt_perfil_usuario: txt_perfil_usuario,
            txt_id_google_chat: txt_id_google_chat,
            acao: acao
        },
        success: function (dados){  
            $('#recebe_gif_processando').html("");
            alert(dados);
            window.location.reload()               
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.statusText;
            if (xhr.responseText) {
                errorMessage += '\nDetalhes do servidor: ' + xhr.responseText;
            }
            // exibe no console e na página
            console.error('Erro ao processar a requisição:', errorMessage);
            $('#recebe_gif_processando').html(
                '<pre style="color:red;">' + errorMessage + '</pre>'
            );
            alert(xhr.responseText);
        }   
    })   

};




function funcao_cad_hostname(acao){

    let txt_hostname = document.getElementById('txt_hostname');
    let txt_nome_host = document.getElementById('txt_nome_host');
    let txt_transf_arq = document.getElementById('txt_transf_arq');
    let txt_up_gcp = document.getElementById('txt_up_gcp');
    let txt_down_gcp = document.getElementById('txt_down_gcp');
    let txt_proc_gcp = document.getElementById('txt_proc_gcp');
    let txt_script_py = document.getElementById('txt_script_py');
    let txt_egp_sas = document.getElementById('txt_egp_sas')
    let txt_up_sas = document.getElementById('txt_up_sas')
    let txt_down_sas = document.getElementById('txt_down_sas')
    let txt_excel_vba = document.getElementById('txt_excel_vba')
    let txt_script_vbs = document.getElementById('txt_script_vbs');
    let txt_fun_py = document.getElementById('txt_fun_py');
    let txt_read_uri_table = document.getElementById('txt_read_uri_table');
    let txt_trans_file_mft = document.getElementById('txt_trans_file_mft');


    if (acao == 1){
        if(txt_hostname.value == '' || txt_nome_host.value == '' || txt_wrk_fixo.value == ''){
            alert('FALHA: Falta informações para realizar essa ação.');
            return;
        }else{
            if(txt_wrk_fixo.value < 0 || txt_wrk_fixo.value > 99){
                alert('FALHA: O valor do Worker Fixo está invalido.');
                return;
            }
            if (!confirm("Confirma a nomeação do Hostname?") == true) {
                return;
            };
        }
    }
    
    if (acao == 2){
        if(txt_hostname.value == ''){
            alert('FALHA: Falta informações para realizar essa ação.');
            return;
        }else{
            if (!confirm("Confirma a remoção da identificação do Hostname?") == true) {
                return;
            };
        }
    }

    if (acao == 3){
        if(txt_hostname.value == '' 
        || txt_nome_host.value == ''
        || txt_transf_arq.value == ''
        || txt_up_gcp.value == ''
        || txt_down_gcp.value == ''
        || txt_proc_gcp.value == ''
        || txt_script_py.value == ''
        || txt_egp_sas.value == ''
        || txt_up_sas.value == ''
        || txt_down_sas.value == ''
        || txt_excel_vba.value == ''
        || txt_script_vbs.value == ''
        || txt_wrk_fixo.value == ''
        || txt_read_uri_table.value == ''
        || txt_fun_py.value == ''
        || txt_trans_file_mft == ''){
            
            alert('FALHA: Para atualização todos os campos devem ser informados.');
            return;
        }else{
            if (!confirm("Confira todos os parametros antes de salvar, todos os dados de configuração serão substituidos. Confirma a atualização do Hostname?") == true) {
                return;
            };
        }
    }    

    txt_hostname = String(txt_hostname.value).toUpperCase().trim()
    txt_nome_host = String(txt_nome_host.value).toUpperCase().trim()
    acao = String(acao)         

    let pagina = "cadastro_hostname";
    $.ajax({
        type: 'GET',
        dataType: 'text',
        url: pagina,
        beforeSend: function () {
            $('#recebe_gif_processando').html(`<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`);
        },
        data: {
            txt_hostname: txt_hostname,
            txt_nome_host: txt_nome_host,
            acao: acao,
            txt_transf_arq: txt_transf_arq.value,
            txt_up_gcp: txt_up_gcp.value,
            txt_down_gcp: txt_down_gcp.value,
            txt_proc_gcp: txt_proc_gcp.value,
            txt_script_py: txt_script_py.value,
            txt_egp_sas: txt_egp_sas.value,
            txt_up_sas: txt_up_sas.value,
            txt_down_sas: txt_down_sas.value,
            txt_excel_vba: txt_excel_vba.value,
            txt_script_vbs: txt_script_vbs.value,
            txt_fun_py: txt_fun_py.value,
            txt_read_uri_table: txt_read_uri_table.value,
            txt_wrk_fixo: txt_wrk_fixo.value,
            txt_trans_file_mft: txt_trans_file_mft.value 
        },
        success: function (msg){  
            $('#recebe_gif_processando').html();
            alert(msg);            
            window.location.reload()               
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.statusText;
            if (xhr.responseText) {
                errorMessage += '\nDetalhes do servidor: ' + xhr.responseText;
            }
            console.error('Erro ao processar a requisição:', errorMessage);
            $('#recebe_gif_processando').html(
                '<pre style="color:red;">' + errorMessage + '</pre>'
            );
            alert(xhr.responseText);
        }           
    })   

};