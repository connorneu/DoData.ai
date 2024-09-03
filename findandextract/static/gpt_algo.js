"use strict";

function submit_gpt_text(){
    var user_description = $('#gpt-desc').val();
    var col_heads = $('#desc-col-headers').val();
    var gpt_desc_params = {
                            user_description: user_description,
                            col_heads: col_heads
                        }
    ajax_submit_gpt_text(gpt_desc_params);
}

function ajax_submit_gpt_text(desc_params){
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    // create an AJAX call
    $.ajax({
        data: {
            'ajax_name':'gpt_algo_desc',
            'parameters': JSON.stringify(desc_params)
        }, 
        type: 'POST',
        headers: {
            "X-CSRFToken": getCookie("csrftoken")},
        success: function () {
            //ajax_get_result_db('describe');
            console.log('done');
            

        },
        // on error
        error: function (request, status, error) {
            // $('#submit-calculate').show();
            // $('#calculatespinner').hide();
            alert(request.responseText)
        }
    });
    return false;
 }