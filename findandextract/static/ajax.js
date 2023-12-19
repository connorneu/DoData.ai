$(document).ready(function () {
    //catch the form's submit event
   $('#datafiltersform').submit(function () {
       console.log('ca1 '+ condition_arr)
       console.log('ca2 '+ condition_arr2)
       console.log(primary_file_name)
       console.log(primary_sheet_name)
       console.log(primary_header_row)
       console.log(secondary_file_name)
       console.log(secondary_sheet_name)
       console.log(secondary_header_row)
       const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
       // create an AJAX call
       $.ajax({
           data: {
               'primaryfile' : primary_file_name,
               'primarysheet' : primary_sheet_name,
               'primary_header_row' : primary_header_row,
               'secondaryfile' : secondary_file_name,
               'secondarysheet' : secondary_sheet_name,
               'secondary_header_row' : secondary_header_row,
               'conditions1' : JSON.stringify(condition_arr),
               'conditions2' : JSON.stringify(condition_arr2)
           }, // get the form data        $(this).serialize()
           type: $(this).attr('method'), // GET or POST
           headers: {
               "X-CSRFToken": getCookie("csrftoken")},
           //url: "{% url 'findandextract' %}",
           // on success
           success: function () {
               console.log("data submitted ");
           },
           // on error
           error: function (request, status, error) {
               // alert the error if any error occured
               //alert(response.responseJSON.errors);
               //console.log(response.responseJSON.errors)
               alert(request.responseText);
           }
       });
       return false;
   });   
})

$(document).ready(async function () {
   $(document.body).on('click', '#next_loadedfiles' ,function(){
    //catch the form's submit event
   //$('#next_loadedfiles').submit(function () {
       const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
       var formData = new FormData();
       formData.append('file_1', $('input[type=file]')[0].files[0]); 
       if (typeof $('input[type=file]')[1].files[0] !== "undefined"){
           formData.append('file_2', $('input[type=file]')[1].files[0]);
       }
       if (typeof $('input[type=file]')[2].files[0] !== "undefined"){
           formData.append('file_3', $('input[type=file]')[2].files[0]);
       }
       if (typeof $('input[type=file]')[3].files[0] !== "undefined"){
           formData.append('file_4', $('input[type=file]')[3].files[0]);
       }
       console.log(FormData)
       // create an AJAX call
       $.ajax({
           data: formData, // get the form data        $(this).serialize()
           type: 'POST', // GET or POST
           contentType: false,
           processData: false,
           cache: false,
           enctype: 'multipart/form-data',
           headers: {
               "X-CSRFToken": getCookie("csrftoken")},
           //url: "{% url 'findandextract' %}",
           // on success
           success: function () {
               console.log("file data submitted");
               ajax_get_db()
           },
           // on error
           error: function (request, status, error) {
               // alert the error if any error occured
               //alert(response.responseJSON.errors);
               //console.log(response.responseJSON.errors)
               alert(request.responseText);
           }
       });
       
       return false;
   });   
})

async function ajax_get_db(){
   var db_data = null;
   $.ajax({
       //data: data, 
       type: 'GET',
       headers: {
           "X-CSRFToken": getCookie("csrftoken")},
       success: function (data) {
           console.log("data retreived ");
           start_data_filter(data);
           console.log("ajax_get_db result")
           console.log(data['fande_data_dump'])
       },
       // on error
       error: function (request, status, error) {
           // alert the error if any error occured
           //alert(response.responseJSON.errors);
           //console.log(response.responseJSON.errors)
           alert(request.responseText);
       }
   });
   return false;
}

//submit algorithm parameters
//$(document).ready(function () {
    //catch the form's submit event
    //$(document.body).on('click', '#next_matchfiles' ,function(){
    function submit_extract_algo_parameters(extract_params){
       const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
       // create an AJAX call
       $.ajax({
           data: {   //JSON.stringify(condition_arr2)
               'ajax_name':'submit_extract_parameters',
                'parameters': extract_params,



           }, // get the form data        $(this).serialize()
           type: 'POST', //$(this).attr('method'), // GET or POST
           headers: {
               "X-CSRFToken": getCookie("csrftoken")},
           //url: "{% url 'findandextract' %}",
           // on success
           success: function () {

               console.log("algorithm parameters submitted");
               ajax_get_result_db('extract');

           },
           // on error
           error: function (request, status, error) {

               alert(request.responseText);

           }
       });
       return false;
    }
   //});   
//});

function submit_combine_algo_parameters(combine_type, merge_params_map){
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    // create an AJAX call
    $.ajax({
        data: {   //JSON.stringify(condition_arr2)
            'ajax_name':'combine_merge',
            'parameters': JSON.stringify(merge_params_map),



        }, // get the form data        $(this).serialize()
        type: 'POST', //$(this).attr('method'), // GET or POST
        headers: {
            "X-CSRFToken": getCookie("csrftoken")},
        //url: "{% url 'findandextract' %}",
        // on success
        success: function () {

            console.log("combine algorithm parameters submitted");
            ajax_get_result_db('combine');

        },
        // on error
        error: function (request, status, error) {

            alert(request.responseText);

        }
    });
    return false;
 }


 function submit_update_file_algo_parameters(update_type, update_from_file_map){
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    // create an AJAX call
    $.ajax({
        data: {   //JSON.stringify(condition_arr2)
            'ajax_name':'update_file',
            'parameters': JSON.stringify(update_from_file_map),



        }, // get the form data        $(this).serialize()
        type: 'POST', //$(this).attr('method'), // GET or POST
        headers: {
            "X-CSRFToken": getCookie("csrftoken")},
        //url: "{% url 'findandextract' %}",
        // on success
        success: function () {

            console.log("update file algorithm parameters submitted");
            ajax_get_result_db('update');

        },
        // on error
        error: function (request, status, error) {

            alert(request.responseText);

        }
    });
    return false;
 }

 function submit_reco_algo_parameters(reco_params_map){
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    // create an AJAX call
    $.ajax({
        data: {   //JSON.stringify(condition_arr2)
            'ajax_name':'reconcile',
            'parameters': JSON.stringify(reco_params_map),



        }, // get the form data        $(this).serialize()
        type: 'POST', //$(this).attr('method'), // GET or POST
        headers: {
            "X-CSRFToken": getCookie("csrftoken")},
        //url: "{% url 'findandextract' %}",
        // on success
        success: function () {

            console.log("update file algorithm parameters submitted");
            ajax_get_result_db('reconcile');

        },
        // on error
        error: function (request, status, error) {

            alert(request.responseText);

        }
    });
    return false;
 }


// get data after function applied
async function ajax_get_result_db(algo_type){
   var db_data = null;
   $.ajax({
       //data: data, 
       type: 'GET',
       data: {ajaxid:'result_db'},
       headers: {
           "X-CSRFToken": getCookie("csrftoken")},
       //url: "{% url 'findandextract' %}",
       //url: 'findandextract/',
       // on success
       success: function (data) {
           //print_the_filtered_data(data);
           if(algo_type==='extract'){
            display_extract_result_table(data);
           }
           else if(algo_type==='combine'){
            display_combine_result_table(data);
           }
           else if(algo_type==='update'){
            display_update_result_table(data);
           }
           else if(algo_tpye==='reconcile'){
            display_reconcile_result_table(data);
           }      
       },
       // on error
       error: function (request, status, error) {
           // alert the error if any error occured
           //alert(response.responseJSON.errors);
           //console.log(response.responseJSON.errors)
           alert(request.responseText);
       }
   });
   return false;
}


function ajax_submit_user_input_text(){
       var user_algo_desc = collect_user_input_text();
       console.log('ajax user algo desc')
       console.log(user_algo_desc)
       const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
       // create an AJAX call
       $.ajax({
           data: {   //JSON.stringify(condition_arr2)
               
               'ajax_name' : 'classify_text',
               'user_algo_desc' : user_algo_desc,
               
           }, // get the form data        $(this).serialize()
           type: 'POST', //$(this).attr('method'), // GET or POST
           headers: {
               "X-CSRFToken": getCookie("csrftoken")},
           //url: "{% url 'findandextract' %}",
           // on success
           success: function (model_result) {
               console.log("algorithm parameters submitted");
               convert_text_to_decision(model_result);

           },
           // on error
           error: function (request, status, error) {

               alert(request.responseText);

           }
       });
       return false;
    }

    