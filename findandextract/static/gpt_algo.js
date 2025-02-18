"use strict";

$(document.body).on('click', '#receive-followup' ,async function(){ 
    $('#receive-followup').hide();
    $('#followup-spinner').show();
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
    $('#hidden-original-followup').val(followupquestions)
    $('#followup-spinner').hide();
    $('#submit-desc-txt').show();
    $('#hidden-followup').animate({ 'opacity': '1' }, 1500);
}

$(document.body).on('input propertychange', '#gpt-desc', async function(){
    if($(this).length > 0){
      $('#desc-prompt').css('visibility', 'hidden');;
    }
  }); 


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
 

 $(document.body).on('click', '#submit-desc-txt' ,async function(){ 
    $('#submit-desc-txt').hide();
    $('#followup-spinner').show();


    setTimeout(async function(){
        
        $('#followup-spinner').hide();
        $('#gpt-txt-wrap').hide();
        hide_containers(3);
        await add_to_carousel('Your app is downloading', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);  
        //await add_to_carousel('', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, false);   
        $('#downloaded-file').show();
        
    }, 5000);
    

});