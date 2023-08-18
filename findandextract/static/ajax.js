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
        //url: "{% url 'findandextract' %}",
        //url: 'findandextract/',
        // on success
        success: function (data) {
            console.log("data retreived ");
            start_data_filter(data);
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