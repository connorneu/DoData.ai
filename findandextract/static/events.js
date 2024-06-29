"use strict";
// click start after algorithm description
$(document).ready(async function () {
    $(document.body).on('click', '#start_algoselect' , async function(){       
        document.getElementById('algo-desc-graph').style.display = 'none';
        hide_containers(2);

        await add_to_carousel('Algorithm Type: ' + algorithm_type, standard_color, [], true, false);
        await add_to_carousel('\xa0\xa0\xa0$' + input_type, standard_color, [], true, false);
        await add_to_carousel('\xa0\xa0\xa0$' + input_num, standard_color, [], true, false);
        await add_to_carousel(['File Selection'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
        await add_to_carousel(['Select files to include in algorithm.'], fyi_color, ['display_multiple_file_drops()', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
        
    });
});

// next after adding files - submit data
$(document.body).on('click', '#next_loadedfiles' ,function(){
    if (check_no_incomplete_file_input()){
        $('.warning-box-wrapper').hide();
        $('#warningtext').text('')
        $('#addsecondfile').hide();
        $('#next_loadedfiles').hide();
        $('#loadfilespinner').show();
        submit_files();
    }
});

 // make dropdown value equal to selected value
$(document.body).on('click', '.dropdown-menu li a' ,function(){      
    var selected_dropdown_value = $(this).text();
    $(this).parents(".dropdown").find('.btn').html($(this).text() + '<span class="caret"></span>');
    $(this).parents(".dropdown").find('.btn').val($(this).data('value')); 
});


// on change dropdown-menu
// if Between selected unhide second input box
$(document.body).on('click', '.dropdown-menu li a' ,function(){      
    var selected_dropdown_value = $(this).text();
    if ($(this).closest('div').hasClass('condition-dropdown-col')){
        if (selected_dropdown_value == "Between"){
            console.log("EE")
            var condition_div_parent = $(this).closest('.conditiondiv').find('.condition-input-and').closest('.condition-input-div').show();
        }
        else{
            var condition_div_parent = $(this).closest('.conditiondiv').find('.condition-input-and').closest('.condition-input-div').hide();
        }
    }
});

// if edit mini table selected
// triggers header edit and condition creation
$(document.body).on('click', '.edittable' ,async function(){ 
    hide_containers(2);
    document.getElementById('edit-data-tables').style.display = 'none';
    var edit_table_id = this.id
    console.log(edit_table_id)
    add_to_carousel('Change column headers', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    add_to_carousel('If your column headers are not on the first row, then click on the row containing your column headers.', fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    if (edit_table_id === "edit-mini1"){
        document.getElementById("colselecttablediv1").style.display = "block";
        populate_table_element(primary_sheet_name, 1, 'data1_tableid', null, 5);
    } 
    else if (edit_table_id === "edit-mini2"){
        document.getElementById("colselecttablediv2").style.display = "block";
        populate_table_element(secondary_sheet_name, 2, 'data2_tableid', null, 5);
    }
    else if (edit_table_id === "edit-mini3"){
        document.getElementById("colselecttablediv3").style.display = "block";
        populate_table_element(third_sheet_name, 3, 'data3_tableid', null, 5);
    }
    else if (edit_table_id === "edit-mini4"){
        document.getElementById("colselecttablediv4").style.display = "block";
        populate_table_element(fourth_sheet_name, 4, 'data4_tableid', null, 5);
    }
});


// reset table 1
$(document.body).on('click', '#data1_table_reset' ,function(e){
    populate_table_element(primary_sheet_name, 1, 'data1_tableid', null, 5);
    document.getElementById("data1_table_reset").style.display = "none";
    primary_header_row = 0;
});

// reset table 2
$(document.body).on('click', '#data2_table_reset' ,function(e){
    populate_table_element(secondary_sheet_name, 2, 'data2_tableid', null, 5);
    document.getElementById("data2_table_reset").style.display = "none";
    secondary_header_row = 0;
});

// reset table 3
$(document.body).on('click', '#data3_table_reset' ,function(e){
    var col_headers = populate_table_element(third_sheet_name, 3, 'data3_tableid') // populate table with selected values
    document.getElementById("data3_table_reset").style.display = "none";
    third_header_row = 0;
});

// reset table 4
$(document.body).on('click', '#data4_table_reset' ,function(e){
    var col_headers = populate_table_element(fourth_sheet_name, 4, 'data4_tableid') // populate table with selected values
    document.getElementById("data4_table_reset").style.display = "none";
    fourth_header_row = 0;
});





 // if secondary file is selected hide dropdown + hide header + print selection
$(document.body).on('click', '#secondaryfile_ul' ,async function(){ 
    hide_containers(2)
    document.getElementById('secondaryfiledrop').style.display = 'none'; // file selection dropdown    
    var user_selection =  $(this).parents(".dropdown").find('.btn').text();
    secondary_file_name = user_selection;
    secondary_file_sheets = get_file_sheets(secondary_file_name); 
    await add_to_carousel('Data File: ', second_color, ['update_item_text_params(secondary_file_name)', 'secondary_sheet_selection()'], true, false);
});

 // if third file is selected hide dropdown + hide header + print selection
$(document.body).on('click', '#thirdfile_ul' ,async function(){ 
    hide_containers(2)
    document.getElementById('thirdfiledrop').style.display = 'none'; // file selection dropdown    
    var user_selection =  $(this).parents(".dropdown").find('.btn').text();
    third_file_name = user_selection;
    third_file_sheets = get_file_sheets(third_file_name); 
    await add_to_carousel('Data File: ', third_color, ['update_item_text_params(third_file_name)', 'third_sheet_selection()'], true, false);
});

 // if fourth file is selected hide dropdown + hide header + print selection
$(document.body).on('click', '#fourthfile_ul' ,async function(){ 
    hide_containers(2)
    document.getElementById('fourthfiledrop').style.display = 'none'; // file selection dropdown    
    var user_selection =  $(this).parents(".dropdown").find('.btn').text();
    fourth_file_name = user_selection;
    fourth_file_sheets = get_file_sheets(fourth_file_name); 
    await add_to_carousel('Data File: ', fourth_color, ['update_item_text_params(fourth_file_name)', 'fourth_sheet_selection()'], true, false);
});

// ! moved to extract_path.js
// if primary sheet is selected
$(document.body).on('click', '#primarysheet_ul' ,function(){ 
    hide_containers(2);
    document.getElementById('primarysheetdrop').style.display = 'none';
    var user_selection =  $(this).parents(".dropdown").find('.btn').text();
    primary_sheet_name = user_selection;    
    add_to_carousel('Input Sheet: ', input_color, ['update_item_text_params(primary_sheet_name)', 'adjust_col_header()'], true, false);
});

 // if secondary sheet is selected
$(document.body).on('click', '#secondarysheet_ul' ,function(){ 
    hide_containers(2);
    document.getElementById('secondarysheetdrop').style.display = 'none';
    var user_selection =  $(this).parents(".dropdown").find('.btn').text();
    secondary_sheet_name = user_selection;    
    add_to_carousel('Data File sheet: ', second_color, ['update_item_text_params(secondary_sheet_name)', 'adjust_col_header2()'], true, false);
});

 // if third sheet is selected
$(document.body).on('click', '#thirdsheet_ul' ,function(){ 
    hide_containers(2);
    document.getElementById('thirdsheetdrop').style.display = 'none';
    var user_selection =  $(this).parents(".dropdown").find('.btn').text();
    third_sheet_name = user_selection;    
    add_to_carousel('Data File sheet: ', third_color, ['update_item_text_params(third_sheet_name)', 'adjust_col_header3()'], true, false);
});

 // if fourth sheet is selected
$(document.body).on('click', '#fourthsheet_ul' ,function(){ 
    hide_containers(2);
    document.getElementById('fourthsheetdrop').style.display = 'none';
    var user_selection =  $(this).parents(".dropdown").find('.btn').text();
    fourth_sheet_name = user_selection;    
    add_to_carousel('Data File sheet: ', fourth_color, ['update_item_text_params(fourth_sheet_name)', 'adjust_col_header4()'], true, false);
});



// when col header for table 1 is adjusted
$(document.body).on('click', '#data1_tableid' ,function(e){  
    console.log('he1')
    const cell = e.target.closest('td');
    if (!cell) {return;} // Quit, not clicked on a cell
    const row = cell.parentElement; // row user clicked on
    primary_header_row = row.rowIndex;
    var repivoted_data = repivot_keyval(gv.data_json, primary_file_name, primary_sheet_name); // create array original table dimension from key value table
    createTable_values1 = createTable(repivoted_data, 'data1_tableid', row.rowIndex); // create html table for data 1 from repivoted key value table
    var col_headers = createTable_values1[0];
    var createTable_html = createTable_values1[1];
    table_html_obj_arr = parse_table_column_values(createTable_html);
    populate_drop_down("#data1columns", col_headers, true); // populate data column selection with header update
    document.getElementById("data1_table_reset").style.display = "block";
    $("tr").css({ 'background-color' : '#2b2b2b'});  //once column has been selected change the background of the table - only works with coral color for some reason + if user clicks again they get bad result
});

// when col header for table 2 is adjusted
$(document.body).on('click', '#data2_tableid' ,function(e){  
    console.log('he2')
    const cell = e.target.closest('td');
    if (!cell) {return;} // Quit, not clicked on a cell
    const row = cell.parentElement; // row user clicked on
    secondary_header_row = row.rowIndex;
    var repivoted_data = repivot_keyval(gv.data_json, secondary_file_name, secondary_sheet_name); // create array original table dimension from key value table
    createTable_values2 = createTable(repivoted_data, 'data2_tableid', secondary_header_row); // create html table for data 1 from repivoted key value table
    var col_headers = createTable_values2[0];
    var createTable_html = createTable_values2[1];
    table_html_obj_arr2 = parse_table_column_values(createTable_html);
    populate_drop_down("#data2columns", col_headers, true); // populate data column selection with header update
    document.getElementById("data2_table_reset").style.display = "block";
    $("tr").css({ 'background-color' : '#2b2b2b'});  //once column has been selected change the background of the table - only works with coral color for some reason + if user clicks again they get bad result
});

// when col header for table 3 is adjusted
$(document.body).on('click', '#data3_tableid' ,function(e){  
    const cell = e.target.closest('td');
    if (!cell) {return;} // Quit, not clicked on a cell
    const row = cell.parentElement; // row user clicked on
    third_header_row = row.rowIndex;
    var repivoted_data = repivot_keyval(gv.data_json, third_file_name, third_sheet_name); // create array original table dimension from key value table
    createTable_values3 = createTable(repivoted_data, 'data3_tableid', row.rowIndex); // create html table for data 1 from repivoted key value table
    var col_headers = createTable_values3[0];
    var createTable_html = createTable_values3[1];
    table_html_obj_arr3 = parse_table_column_values(createTable_html);
    populate_drop_down("#data3columns", col_headers, true); // populate data column selection with header update
    document.getElementById("data3_table_reset").style.display = "block";
    $("tr").css({ 'background-color' : '#2b2b2b'});  //once column has been selected change the background of the table - only works with coral color for some reason + if user clicks again they get bad result
});

// when col header for table 4 is adjusted
$(document.body).on('click', '#data4_tableid' ,function(e){  
    const cell = e.target.closest('td');
    if (!cell) {return;} // Quit, not clicked on a cell
    const row = cell.parentElement; // row user clicked on
    fourth_header_row = row.rowIndex;
    var repivoted_data = repivot_keyval(gv.data_json, fourth_file_name, fourth_sheet_name); // create array original table dimension from key value table
    createTable_values4 = createTable(repivoted_data, 'data4_tableid', row.rowIndex); // create html table for data 1 from repivoted key value table
    var col_headers = createTable_values4[0];
    var createTable_html = createTable_values4[1];
    table_html_obj_arr4 = parse_table_column_values(createTable_html);
    populate_drop_down("#data4columns", col_headers, true); // populate data column selection with header update
    document.getElementById("data4_table_reset").style.display = "block";
    $("tr").css({ 'background-color' : '#2b2b2b'});  //once column has been selected change the background of the table - only works with coral color for some reason + if user clicks again they get bad result
});


// next after adjusting col headers primary data
$(document.body).on('click', '#data1_next_colheader' ,async function(){
    create_filter_conditions(1);
});


// next after adjusting col headers secondary data
$(document.body).on('click', '#data2_next_colheader' ,function(){
    create_filter_conditions(2);
});

// next after adjusting col headers secondary data
$(document.body).on('click', '#data3_next_colheader' ,function(){
    create_filter_conditions(3);
});

// next after adjusting col headers secondary data
$(document.body).on('click', '#data4_next_colheader' ,function(){
    create_filter_conditions(4);
    //hide_containers(2);
    //document.getElementById("colselecttablediv4").style.display = "none";
    //add_to_carousel('Filter: ' + fourth_file_name + ' {' + fourth_sheet_name + '}:', fourth_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    //add_to_carousel('These conditions will limit the rows imported into the algorithm.', fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, false);
    //add_to_carousel('If some of the data is not relevant then exclude it here.', fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);  
    //document.getElementById('fourthcondition-container').style.display = 'block';
})


$(document.body).on('click', '#addconditionbtn' ,async function(){
    $('#conditioncontainerwrap').find('.conditiondiv').eq(0).clone().appendTo('.conditiondivcontainer');
    var new_elem = $('#conditioncontainerwrap').find('.conditiondiv:last');
    $(new_elem).find('.condition-dropdown-andor').css('visibility', 'visible');
    $(new_elem).find('.condition-inputs').find('.condition-and-input-wrap').css('visibility', 'hidden');
    $(new_elem).find('.condition-dropdown').find('.btn').text('Select Column');
    $(new_elem).find('.condition-inputs').find('.condition-dropdown-action').find('.btn').text('Equals');
    $(new_elem).find('.condition-inputs').find('.condition-input-wrap').find('input').val('');
    $(new_elem).find('.condition-inputs').find('.condition-and-input-wrap').find('input').val('');
    if ($('#conditioncontainerwrap').find('.conditiondiv').length > 9){
        $('#addconditionbtn').hide();
    }
});


// when between is selected unhide other input 
$(document.body).on('click', '.condition-dropdown-action li a' ,async function(){
    var btn_text = $(this).text();
    if (btn_text.includes('Between')){
        $(this).closest('.condition-inputs').find('.condition-and-input-wrap').css('visibility', 'visible');
    }
});


// check if all conditions dont have Select Column before submitting
function check_submit_dropdowns_populated(){
    var conditions = $('#conditioncontainerwrap').find('.conditiondiv');
    if (conditions.length === 1){
        return true;
    }
    else{
        for (var i=0;i<conditions.length;i++){
            var t = $(conditions[i]).find('.dropdown.condition-dropdown').find('.btn').text();
            console.log(t)
            if ($(conditions[i]).find('.dropdown.condition-dropdown').find('.btn').text().includes("Select Column")){
                $('.warning-box-wrapper').show();
                $('#warningtext').text('You need to select a column for each condition.')
                return false;
            }
        }
        return true;
    }
}


// submit conditions
$(document.body).on('click', '#conditionnext' ,async function(){
    if (check_submit_dropdowns_populated()){
        $('.warning-box-wrapper').hide();
        var condition_arr = [];
        var conditions = $('#conditioncontainerwrap').find('.conditiondiv');
        for (var i=0;i<conditions.length;i++){
            var andor = $(conditions[i]).find('.dropdown.condition-dropdown-andor').find('.btn').text();
            var column_name = $(conditions[i]).find('.dropdown.condition-dropdown').find('.btn').text();
            var action = $(conditions[i]).find('.condition-inputs').find('.dropdown.condition-dropdown-action').find('.btn').text().trim();
            var action_value = $(conditions[i]).find('.condition-inputs').find('.dropdown.condition-dropdown-action').find('.condition-input-wrap').find('input').val();
            var action_value_and = $(conditions[i]).find('.condition-inputs').find('.condition-and-input-wrap').find('input').val();
            condition_arr.push([andor, column_name, action, action_value, action_value_and])
        }
        var dataset_selection = convert_file_num_to_dataset(current_conditions_file);
        var file_sheet = get_file_and_sheet(dataset_selection)
        var cur_header_row = get_header_row_from_filenum(current_conditions_file);
        document.getElementById('conditioncontainerwrap').style.display = 'none';
        $('#editdataspinner').show();
        ajax_submit_filters(condition_arr, cur_header_row, file_sheet[0], file_sheet[1], algorithm_type);
        // display_conditions(condition_arr, cur_header_row, file_sheet[0], file_sheet[1]);
    }
});

// first condition populated -> show add condition button
$(document.body).on('click', '#conditioncontainerwrap .conditiondiv .dropdown.condition-dropdown li a' ,async function(){
    $('#addconditionbtn').show();
    $('#conditionnext').text('Next');
});



// Start Algo Path
$(document.body).on('click', '#next-edit-mini' ,function(){
    decide_algo_path(algorithm_type);
});



$(document.body).on('dragenter focus click', '.file-input' ,function(e){
    var node = $(e.target).parent()
    node.addClass('is-active');
});

// change text of file drop
//unhide add additional file and next buttons
$(document.body).on('change', '.file-input' ,async function(){
    var filesCount = $(this)[0].files.length;
    var $textContainer = $(this).prev().prev();
    var $textbanner = $(this).prev();
    var file_input_index = $(this).closest('.file-drop-area').index();
    var me_sheets = await ajax_check_file_names($('input[type=file]')[file_input_index-1].files[0]);
    me_sheets = JSON.parse(me_sheets);
    me_sheets = me_sheets['sheets'];
    var fileName = $(this).val().split('\\').pop();  
    $textContainer.text(fileName);
    $($textContainer).css({marginTop: '+=6px'});;
    $textbanner.text('');
    //if (me_sheets.length > 1){
    if (Array.isArray(me_sheets)){ 
        var myelm = $(this).closest('.file-drop-area').find('ul');
        var id = '#' + myelm.attr('id');
        populate_drop_down(id, me_sheets, true);
        var a = $(id).closest('.dropdown').css('display', 'block');
    }    
    else{
        $(this).closest('.file-drop-area').find('.dropdown').css('display', 'none');
    }
    
    document.getElementById('addfiles').style.display = 'block';
    if (max_file_upload <= 1){
        document.getElementById('addsecondfile').style.display = 'none';
    }
    if (fileName.includes('.txt')){
        $(this).closest('.file-drop-area').find('.delimiter-wrap').show();
    }
});


// unhide additional file drop box
$(document.body).on('click', '#addsecondfile' ,function(){    
    if(document.getElementById('filetwo').style.display == 'none'){
        document.getElementById('filetwo').style.display = 'inline-block';
        if (max_file_upload <= 2){document.getElementById('addsecondfile').style.display = 'none';}       
    }
    else if(document.getElementById('file3').style.display == 'none'){
        document.getElementById('file3').style.display = 'inline-block';
        if (max_file_upload <= 3){document.getElementById('addsecondfile').style.display = 'none';}  
    }
    else if(document.getElementById('file4').style.display == 'none'){
        document.getElementById('file4').style.display = 'inline-block';
        document.getElementById('addsecondfile').style.display = 'none';
    }
    // next_loadedfiles is next event (ajax.js)
    // start_data_filter is function that starts next steps
});

// clicking back after algorithm description
$(document).ready(async function () {
    $(document.body).on('click', '#back-algoselect' ,function(){
        document.getElementById('search-file-one').style.display = 'none';
        document.getElementById('searchfileone-btns').style.display = 'none';
        var url = window.location.href;
        if( url.indexOf('#') < 0 ) {
            window.location.replace(url + "#");
        } else {
            window.location.replace(url);
        }
    });
});

// Extract: match dataset and column name dropdown controls - third dataset
$(document.body).on('click', '#matchthirddata_ul' , async function(){ 
    var dataset_selection = null;
    dataset_selection =  $(this).parents(".dropdown").find('.btn').text();
    var file_and_sheet = get_file_and_sheet(dataset_selection);
    var col_headers = match_dataset_to_colheaders(file_and_sheet);
    populate_drop_down("#matchthirdcol_ul", col_headers, true);
    //document.getElementById('matchboxcolumn3').style.display = 'flex';
});

// Extract: match dataset and column name dropdown controls - fourth dataset
$(document.body).on('click', '#matchfourthdata_ul' , async function(){ 
    var dataset_selection = null;
    dataset_selection =  $(this).parents(".dropdown").find('.btn').text();
    var file_and_sheet = get_file_and_sheet(dataset_selection);
    var col_headers = match_dataset_to_colheaders(file_and_sheet);
    populate_drop_down("#matchfourthcol_ul", col_headers, true);
    //document.getElementById('matchboxcolumn4').style.display = 'flex';
});



// if span? (which isnt in the right place but still works) or icon is clicked and status is ACTIVE then submit
$(document).ready(function() {
    $("#submiticonwrap").click(function(){
        if(document.getElementById("submittexticon").style.color === "white"){
            //convert_text_to_decision();
            //ajax_submit_user_input_text();
            description_submitted();
        }
        
    });
});
// THESE TWO METHODS DO THE SAME THING
// if ENTER is pressed while cursor is in textobox
$(document).ready(function() {
    $("#textbox-algo-desc").keypress(function (e) {
        if(e.which == 13) {
            if(document.getElementById("submittexticon").style.color === "white"){                
                //convert_text_to_decision();
                description_submitted();
            }
        }
    });
});

// description submitted - hide box and display loading icon
function description_submitted(){
    hide_containers(2);
    document.getElementById("textbox-algo-desc-wrap").style.display = "none";
    document.getElementById("descriptionhelp").style.display = "none";
    document.getElementById("describeheader-text").style.display = "none";
    document.getElementById("submitloadersvg").style.display = "block"; 
    document.getElementById('algo-desc-graph').style.display = 'none';
    ajax_submit_user_input_text();
}

//highlight column on click
$(document.body).on('click', 'td' , function(){     
    var $currentTable = $(this).closest('table');
    if ($currentTable.hasClass('colselect-table')){
        var index = $(this).index();
        $currentTable.find('td').removeClass('selected');
        $currentTable.find('tr').each(function() {
            $(this).find('td').eq(index).addClass('selected');
        });
        var selected_colheader = $(this).closest("td").index();
        document.getElementById("selected-match-col-primary").innerHTML = "Selected Column: " + selected_colheader;
        
    }
});

//highlight column on hover
$(document.body).on('mouseover', 'td' , function(){     
    var $currentTable = $(this).closest('table');
    if ($currentTable.hasClass('colselect-table')){
        var index = $(this).index();
        $currentTable.find('td').removeClass('selected-hover');
        $currentTable.find('tr').each(function() {
            $(this).find('td').eq(index).addClass('selected-hover');
        });
    }
});



$(document.body).on('click', '#changealgorithm' , async function(){   
    console.log('fading in')
    hide_containers(7);
    await add_to_carousel(['Select algorithm type from menu:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    document.getElementsByClassName('changealgorithmwrap')[0].style.display='none';
    var element = document.getElementsByTagName('body')[0];
    element.scroll(-1000,500);
    window.focus();
    window.scrollTo(0,800);
    elem = document.getElementById('algo-desc-graph')

    elem.fadeIn = function(timing) {
        var newValue = 0;

        elem.style.display = 'block';
        elem.style.opacity = 0;

        fadeInInterval = setInterval(function() {

            if (newValue < 1) {
                newValue += 0.01;
            }

            elem.style.opacity = newValue;

        }, timing);

    }

    elem.fadeIn(10);
});


// not sure which algo show description box
$(document.body).on('click', '#not-sure-which-algo' , async function(){  
    try{
        hide_containers(3);
    }
    catch(error){

    }
    document.getElementById('algo-desc-graph').style.display='none';
    //document.getElementById('describe-algo-banner').style.display='none';
    var element = document.getElementsByTagName('body')[0];
    element.scroll(-1000,1000);
    window.focus(); 
    window.scrollTo(0,800); 
    //await add_to_carousel('START', action_color, [null], true, false);
    await add_to_carousel('Describe what you want to do:', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    await add_to_carousel('An algorithm type will be suggested', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    document.getElementById('confirm-algo-select').style.display='block';
    document.getElementById('describe-algo-banner').style.display='block';
    document.getElementById('textbox-algo-desc-wrap').style.display='block';
});


// description help or algo is not what you wanted
$(document.body).on('click', '#descriptionhelp, #confirm-algo-no' , async function(){  
    gently_show_tree();
    
});

// restart
$(document.body).on('click', '#runcode' , async function(){  
    location.reload();
});



/*
$(document.body).on('click', '' , async function(){         
    load_summary_carousel();
    setTimeout(function() {
        download_result()
        document.getElementById('page').style.display = 'none';
    }, 5000);
    
});
*/

$(document.body).on('click', '#resultdownload' ,function(){      
    //$('#resultdownload').hide();
    console.log('hj')
    location.reload();
    console.log('bese')
    return false;
});