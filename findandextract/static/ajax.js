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

async function submit_files(){

    //catch the form's submit event 
       const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
       var formData = new FormData();
       formData.append('file_1', $('input[type=file]')[0].files[0]);
       formData.append('file_1_sheet', $('#fileone_col_ul').closest('.dropdown').find('.btn').text());
       formData.append('file_1_delimiter', $('#file1-delimiter').find(":selected").val());
       if (typeof $('input[type=file]')[1].files[0] !== "undefined"){
           formData.append('file_2', $('input[type=file]')[1].files[0]);
           formData.append('file_2_sheet', $('#filetwo_col_ul').closest('.dropdown').find('.btn').text())
           formData.append('file_2_delimiter', $('#file2-delimiter').find(":selected").val());
       }
       if (typeof $('input[type=file]')[2].files[0] !== "undefined"){
           formData.append('file_3', $('input[type=file]')[2].files[0]);
           formData.append('file_3_sheet', $('#filethree_col_ul').closest('.dropdown').find('.btn').text())
           formData.append('file_3_delimiter', $('#file3-delimiter').find(":selected").val());
       }
       if (typeof $('input[type=file]')[3].files[0] !== "undefined"){
           formData.append('file_4', $('input[type=file]')[3].files[0]);
           formData.append('file_4_sheet', $('#filefour_col_ul').closest('.dropdown').find('.btn').text())
           formData.append('file_4_delimiter', $('#file4-delimiter').find(":selected").val());
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
               alert('There was an error reading your data. Please ensure the file is not corrupt or malformed.');
           }
       });
       
       return false;
}

async function ajax_get_db(){
   var db_data = null;
   $.ajax({
       //data: data, 
       type: 'GET',
       headers: {
           "X-CSRFToken": getCookie("csrftoken")},
       success: function (data) {
           console.log("data retreived ");
           console.log(data)
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

function submit_extract_algo_parameters(extract_params){
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    // create an AJAX call
    $.ajax({
        data: {   //JSON.stringify(condition_arr2)
            'ajax_name':'extract',
            'parameters': JSON.stringify(extract_params),



        }, // get the form data        $(this).serialize()
        type: 'POST', //$(this).attr('method'), // GET or POST
        headers: {
            "X-CSRFToken": getCookie("csrftoken")},
        //url: "{% url 'findandextract' %}",
        // on success
        success: function () {
            ajax_get_result_db('extract');

        },
        // on error
        error: function (request, status, error) {
            console.log('extrct error')
            alert(request.responseText);

        }
    });
    return false;
}



// I couldn't just return sheets from success so i had to create me_sheets and return it twice
async function ajax_check_file_names(file){
    var me_sheets = null;
    var formData = new FormData();
    formData.append('file', file); 
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    // create an AJAX call
    // data: formData,
    await $.ajax({
        data: formData, 
        type: 'POST', // GET or POST
        contentType: false,
        processData: false,
        cache: false,
        enctype: 'multipart/form-data',
        headers: {
            "X-CSRFToken": getCookie("csrftoken")},
        //url: "{% url 'findandextract' %}",
        // on success
        success: function (sheets) {
            console.log("ajax check file names");
            console.log('sheets: ' + sheets)
            me_sheets = JSON.stringify(sheets);
            // update_choose_file_btn(sheets);
            return me_sheets;
        },
        // on error
        error: function (request, status, error) {
            // alert the error if any error occured
            //alert(response.responseJSON.errors);
            //console.log(response.responseJSON.errors)
            alert(request.responseText);
        }
    });
    return me_sheets;
 }

function submit_combine_algo_parameters(combine_type, merge_params_map){
    console.log('startcombine sbmt')
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
            ajax_get_result_db('combine');

        },
        // on error
        error: function (request, status, error) {

            alert(request.responseText);

        }
    });
    return false;
 }


 function submit_update_file_algo_parameters(update_params){
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    // create an AJAX call
    $.ajax({
        data: {   //JSON.stringify(condition_arr2)
            'ajax_name':'update_file',
            'parameters': JSON.stringify(update_params),



        }, // get the form data        $(this).serialize()
        type: 'POST', //$(this).attr('method'), // GET or POST
        headers: {
            "X-CSRFToken": getCookie("csrftoken")},
        //url: "{% url 'findandextract' %}",
        // on success
        success: function () {
            ajax_get_result_db('update');

        },
        // on error
        error: function (request, status, error) {
            $('#submit-update-file').show();
            $('#updatespinner').hide();
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
        },
        type: 'POST', 
        headers: {
            "X-CSRFToken": getCookie("csrftoken")},
        success: function () {

            ajax_get_result_db('reconcile');

        },
        // on error
        error: function (request, status, error) {
            $('#submit-reco').show();
            $('#recospinner').hide();
            alert(request.responseText);

        }
    });
    return false;
 }


 function submit_calc_algo_parameters(calc_params){
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    // create an AJAX call
    $.ajax({
        data: {
            'ajax_name':'calculate',
            'parameters': JSON.stringify(calc_params)
        }, 
        type: 'POST',
        headers: {
            "X-CSRFToken": getCookie("csrftoken")},
        success: function () {
            ajax_get_result_db('calculate');

        },
        // on error
        error: function (request, status, error) {
            $('#submit-calculate').show();
            $('#calculatespinner').hide();
            alert(request.responseText)


        }
    });
    return false;
 }

 
 function submit_user_formula(column_params){
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    // create an AJAX call
    $.ajax({
        data: { 
            'ajax_name':'submit_user_formula',
            'parameters': JSON.stringify(column_params) 
        }, 
        type: 'POST', 
        headers: {
            "X-CSRFToken": getCookie("csrftoken")},
        //url: "{% url 'findandextract' %}",
        // on success
        success: function () {

            console.log("update file algorithm parameters submitted");
            ajax_get_result_db('column');

        },
        // on error
        error: function (request, status, error) {
            $('#send_input_formula').show();
            $('#columnspinner').hide();
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
           console.log('get result ajax')
           console.log(data['result_table'])
            if(algo_type==='extract'){
                if (data['result_table'].length === 0){
                    alert('The parameters you\'ve described don\'t match any of your data. Please ensure the values you\'re describing exist in your data.');
                    $('#submit-extract').show();
                    $('#extractspinner').hide();
                }
                else{
                    display_extract_result_table(data);
                }
            }
            else if(algo_type==='combine'){
                if (data['result_table'].length === 0){
                    combines_error();
                }
                else{
                    display_combine_result_table(data);
                }                
            }
            else if(algo_type==='update'){
                display_update_result_table(data);
            }
            else if(algo_type==='reconcile'){
                display_reconcile_result_table(data);
            }    
            else if(algo_type==='calculate'){
                console.log(data)
                display_calculate_result_table(data);
            }    
            else if(algo_type==='column'){
                console.log('retreive column data')
                console.log(data)
                display_column_result_table(data);
            }
            else if(algo_type==='filter'){
                console.log("here?")
                display_filter_result_table(data)
            }            
       },
       // on error
       error: function (request, status, error) {
            console.log('failure')
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
               
           },
           type: 'POST', 
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

function ajax_submit_filters(conds, header_row, table_name, sheet_name, algo_type){
    console.log('ajax submit filters')
    console.log(conds)
    console.log(header_row)
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    // create an AJAX call
    $.ajax({
        data: {
            
            'ajax_name' : 'filter_data',
            'conds' : JSON.stringify(conds),
            'header_row' : header_row,
            'table_name' : table_name,
            'sheet_name' : sheet_name,
            'algo_type' : algo_type
            
        },
        type: 'POST',
        headers: {
            "X-CSRFToken": getCookie("csrftoken")},
        success: async function (db_data) {
            console.log("applied conditions to data");
            //convert_text_to_decision(model_result);
            data_json = db_data['fande_data_dump'];
            console.log("here")
            //hide_containers(3); 
            $('#editdataspinner').hide();
            await display_conditions(condition_arr, header_row, table_name, sheet_name);
            if (algo_type === 'Filter'){
                ajax_get_result_db('filter');
            }
            else{
                edit_data();
            }           
        },
        // on error
        error: function (request, status, error) {
            hide_containers(3);
            $('#editdataspinner').hide();
            alert(request.responseText);
            edit_data();  

        }
    });
    return false;
    }
    