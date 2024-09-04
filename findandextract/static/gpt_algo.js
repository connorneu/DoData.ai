"use strict";

$(document.body).on('click', '#receive-followup' ,async function(){ 

    var user_description = $('#gpt-desc').val();
    var col_heads = $('#desc-col-headers').val();
    var gpt_desc_params = {
        user_description: user_description,
        col_heads: col_heads
    }
    ajax_submit_gpt_text(gpt_desc_params);

});

function show_followup_questions(followups_json){
    // var resp = JSON.parse(followups_json);
    var followupquestions = followups_json.followups;
    console.log('followups')
    console.log(followupquestions)
    var original_question = followups_json.original_question
    $('#followup-header').text(followupquestions)
    $('#hidden-original-question').val(original_question)
}


function ajax_submit_gpt_text(desc_params){
    console.log('desc params')
    console.log(desc_params)
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
        success: function (data) {
            //ajax_get_result_db('describe');
            console.log('followupqs');
            console.log(data)
            show_followup_questions(data)

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