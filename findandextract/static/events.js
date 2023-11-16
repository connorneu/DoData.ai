
// click start after algorithm description
$(document).ready(async function () {
    $(document.body).on('click', '#start_algoselect' , async function(){       
        document.getElementById('algo-desc-graph').style.display = 'none';
        hide_containers(2);

        await add_to_carousel('Algorithm Type: ' + algorithm_type, standard_color, [], true, false);
        await add_to_carousel('\xa0\xa0\xa0$' + input_type, standard_color, [], true, false);
        await add_to_carousel('\xa0\xa0\xa0$' + input_num, standard_color, [], true, false);
        await add_to_carousel(['File Selection'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
        add_to_carousel(['Select files to include in algorithm.'], fyi_color, ['display_multiple_file_drops()', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
        
    });
});

 // make dropdown value equal to selected value
$(document.body).on('click', '.dropdown-menu li a' ,function(){      
    var selected_dropdown_value = $(this).text();
    $(this).parents(".dropdown").find('.btn').html($(this).text() + '<span class="caret"></span>');
    $(this).parents(".dropdown").find('.btn').val($(this).data('value')); 
});


// ! moved to extract_path.js
 // if primary file is selected hide dropdown + hide header + print selection
//$(document.body).on('click', '#primaryfile_ul' ,async function(){ 
//    hide_containers(2);
//    document.getElementById('primaryfiledrop').style.display = 'none'; // file selection dropdown 
//    document.getElementById('extractinputfile').style.display = 'none';
//    var user_selection =  $(this).parents(".dropdown").find('.btn').text();
//    primary_file_name = user_selection;
//    primary_file_sheets = get_file_sheets(primary_file_name); 
//    await add_to_carousel('Input File: ', input_color, ['update_item_text_params(primary_file_name)', 'primary_sheet_selection()'], true, false);    
//});

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
    const cell = e.target.closest('td');
    if (!cell) {return;} // Quit, not clicked on a cell
    const row = cell.parentElement; // row user clicked on
    primary_header_row = row.rowIndex;
    //unique_file_names = uniq_fast(data_json, 'file_name');  // calcualte file names   
    //$("#loadedfile1").text(unique_file_names[0]); // text value of Data Accordion 1
   // var selected_data1_sheet_dropdown = $('#data1selectsheetbutton').val($(this).text()).text() // get current data1 sheet value
    var repivoted_data = repivot_keyval(data_json, primary_file_name, primary_sheet_name); // create array original table dimension from key value table
    createTable_values1 = createTable(repivoted_data, 'data1_tableid', row.rowIndex); // create html table for data 1 from repivoted key value table
    var col_headers = createTable_values1[0];
    var createTable_html = createTable_values1[1];
    table_html_obj_arr = parse_table_column_values(createTable_html);
    //populate_obj_list("data1selectedcolumnvalues", table_html_obj_arr);
    populate_drop_down("#data1columns", col_headers, true); // populate data column selection with header update
    document.getElementById("data1_table_reset").style.display = "block";
    $("tr").css({ 'background-color' : '#2b2b2b'});  //once column has been selected change the background of the table - only works with coral color for some reason + if user clicks again they get bad result
    //console.log(cell.innerHTML, row.rowIndex, cell.cellIndex);
});

// when col header for table 2 is adjusted
$(document.body).on('click', '#data2_tableid' ,function(e){  
    const cell = e.target.closest('td');
    if (!cell) {return;} // Quit, not clicked on a cell
    const row = cell.parentElement; // row user clicked on
    secondary_header_row = row.rowIndex;
    var repivoted_data = repivot_keyval(data_json, secondary_file_name, secondary_sheet_name); // create array original table dimension from key value table
    createTable_values2 = createTable(repivoted_data, 'data2_tableid', row.rowIndex); // create html table for data 1 from repivoted key value table
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
    console.log("si")
    console.log(third_file_name)
    console.log(third_sheet_name)
    var repivoted_data = repivot_keyval(data_json, third_file_name, third_sheet_name); // create array original table dimension from key value table
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
    var repivoted_data = repivot_keyval(data_json, fourth_file_name, fourth_sheet_name); // create array original table dimension from key value table
    createTable_values4 = createTable(repivoted_data, 'data4_tableid', row.rowIndex); // create html table for data 1 from repivoted key value table
    var col_headers = createTable_values4[0];
    var createTable_html = createTable_values4[1];
    table_html_obj_arr4 = parse_table_column_values(createTable_html);
    populate_drop_down("#data4columns", col_headers, true); // populate data column selection with header update
    document.getElementById("data4_table_reset").style.display = "block";
    $("tr").css({ 'background-color' : '#2b2b2b'});  //once column has been selected change the background of the table - only works with coral color for some reason + if user clicks again they get bad result
});

// reset table 1
$(document.body).on('click', '#data1_table_reset' ,function(e){
    var col_headers = populate_table_element(primary_sheet_name, 1, 'data1_tableid') // populate table with selected values
    document.getElementById("data1_table_reset").style.display = "none";
    primary_header_row = 0;
});

// reset table 2
$(document.body).on('click', '#data2_table_reset' ,function(e){
    var col_headers = populate_table_element(secondary_sheet_name, 2, 'data2_tableid') // populate table with selected values
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
    var col_headers = populate_table_element(third_sheet_name, 3, 'data4_tableid') // populate table with selected values
    document.getElementById("data4_table_reset").style.display = "none";
    fourth_header_row = 0;
});

// ! moved to extract_path.js
// next after adjusting col headers primary data
//$(document.body).on('click', '#data1_next_colheader' ,function(){
//    hide_containers(2);
//    document.getElementById("colselecttablediv1").style.display = "none";
//    add_to_carousel(['Filter data?'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
//    add_to_carousel(['[' + primary_file_name + ' ' + primary_sheet_name + ']'], 'urgent', ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionsubtext')"], false, false)
//    add_to_carousel(['These conditions will limit the rows imported into the algorithm.', 'If some of the data is not relevant then exclude it here.'], fyi_color, ['display_add_conditions_btn()', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);    
//});

// next after adjusting col headers secondary data
$(document.body).on('click', '#data2_next_colheader' ,function(){
    hide_containers(3);
    document.getElementById("colselecttablediv2").style.display = "none";
    add_to_carousel(['Filter data?'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    add_to_carousel(['[' + secondary_file_name + ' ' + secondary_sheet_name + ']'], 'urgent', ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionsubtext')"], false, false)
    add_to_carousel(['These conditions will limit the rows imported into the algorithm.', 'If some of the data is not relevant then exclude it here.'], fyi_color, ['display_add_conditions_btn2()', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);    
});

// next after adjusting col headers secondary data
$(document.body).on('click', '#data3_next_colheader' ,function(){
    hide_containers(2);
    document.getElementById("colselecttablediv3").style.display = "none";
    add_to_carousel(['Filter data?'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    add_to_carousel(['[' + third_file_name + ' ' + third_sheet_name + ']'], 'urgent', ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionsubtext')"], false, false)
    add_to_carousel(['These conditions will limit the rows imported into the algorithm.', 'If some of the data is not relevant then exclude it here.'], fyi_color, ['display_add_conditions_btn3()', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);    
});

// next after adjusting col headers secondary data
$(document.body).on('click', '#data4_next_colheader' ,function(){
    hide_containers(2);
    document.getElementById("colselecttablediv4").style.display = "none";
    add_to_carousel(['Filter data?'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    add_to_carousel(['[' + fourth_file_name + ' ' + fourth_sheet_name + ']'], 'urgent', ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionsubtext')"], false, false)
    add_to_carousel(['These conditions will limit the rows imported into the algorithm.', 'If some of the data is not relevant then exclude it here.'], fyi_color, ['display_add_conditions_btn4()', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);    
})

// when add condition is clicked
$(document.body).on('click', '#addconditionprimary' ,function(){
    var current_selection = $('#cond1_col_drop').find('.btn').text()
    if (current_selection === 'Select Column'){
        var primary_col_headers = createTable_values1[0];
        populate_drop_down('#conditiondropdowncols1', primary_col_headers, true)
        document.getElementById('cond1_col_drop').style.display = 'inline-block';
        document.getElementById('primaryconditions').style.display = 'block';
        document.getElementById('primarycondition1').style.display = 'block';  
        document.getElementById('cond1_action1').style.display = 'inline-block';
    }
    else{  
        // add more conditions by cloning previous and reseting values
        var $last_condition = $('#primarycondition-container div[id^="primarycondition"]:last');
        var condition_num = $last_condition.prop("id").slice(-1);
        condition_num++;
        var $condition_klon = $last_condition.clone(false).prop('id', 'primarycondition'+condition_num);
        // change id to current condition num
        $condition_klon.find('.dropdown.condition-dropdown').prop('id', 'cond' + condition_num + '_col_drop');
        $condition_klon.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').prop('id', 'conditioncolselect' + condition_num);
        $condition_klon.find('.dropdown-menu').prop('id', 'conditiondropdowncols' + condition_num);
        $condition_klon.find('.dropdown.condition-dropdown-col').prop('id', 'cond' + condition_num + 'action' + condition_num);
        $condition_klon.find('.condition-input-div').prop('id', 'condition' + condition_num + 'and');
        $condition_klon.find('.condition-dropdown-andor').prop('id', 'andor' + condition_num);        
        
        // change dropdown value back to Select Column
        $condition_klon.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').html('Select Column');
        $condition_klon.find('.btn.btn-outline-secondary.dropdown-toggle.condition-dropdown-btn').html('Equals');
        $condition_klon.find('.form-control.condition-input').val('');
        $condition_klon.find('.form-control.condition-input-and').val('');
        $condition_klon.find('.condition-dropdown-btn-andor').html('And');
        $condition_klon.find('.condition-input-div').css('display','none');
        $condition_klon.find('.condition-dropdown-andor').css('visibility','visible');
        $condition_klon.appendTo('#primaryconditions');          
    }
});

// when add condition is added for secondary
$(document.body).on('click', '#addconditionsecondary' ,function(){
    var current_selection = $('#secondarycond1_col_drop').find('.btn').text()
    if (current_selection === 'Select Column'){
        var secondary_col_headers = createTable_values2[0];
        populate_drop_down('#secondaryconditiondropdowncols1', secondary_col_headers, true)
        document.getElementById('secondarycond1_col_drop').style.display = 'inline-block';
        document.getElementById('secondaryconditionsq').style.display = 'block';
        document.getElementById('secondaryconditions1').style.display = 'block';  
        document.getElementById('secondarycond1_action1').style.display = 'inline-block';
    }
    else{       
        // add more conditions by cloning previous and reseting values
        var $last_condition = $('#secondarycondition-container div[id^="secondaryconditions"]:last');
        var condition_num = $last_condition.prop("id").slice(-1);
        condition_num++;
        var $condition_klon = $last_condition.clone(false).prop('id', 'secondaryconditions'+condition_num);
        // change id to current condition num
        $condition_klon.find('.dropdown.condition-dropdown').prop('id', 'secondarycond' + condition_num + '_col_drop');
        $condition_klon.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').prop('id', 'secondaryconditioncolselect' + condition_num);
        $condition_klon.find('.dropdown-menu').prop('id', 'secondaryconditiondropdowncols' + condition_num);
        $condition_klon.find('.dropdown.condition-dropdown-col').prop('id', 'secondarycond' + condition_num + 'action' + condition_num);
        $condition_klon.find('.condition-input-div').prop('id', 'secondarycondition' + condition_num + 'and');
        $condition_klon.find('.condition-dropdown-andor').prop('id', 'secondaryandor' + condition_num);        
        
        // change dropdown value back to Select Column
        $condition_klon.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').html('Select Column');
        $condition_klon.find('.btn.btn-outline-secondary.dropdown-toggle.condition-dropdown-btn').html('Equals');
        $condition_klon.find('.form-control.condition-input').val('');
        $condition_klon.find('.form-control.condition-input-and').val('');
        $condition_klon.find('.condition-dropdown-btn-andor').html('And');
        $condition_klon.find('.condition-input-div').css('display','none');
        $condition_klon.find('.condition-dropdown-andor').css('visibility','visible');
        $condition_klon.appendTo('#secondaryconditionsq');          
    }
});






// when add condition is added for third
$(document.body).on('click', '#addconditionthird' ,function(){
    var current_selection = $('#thirdcond1_col_drop').find('.btn').text()
    if (current_selection === 'Select Column'){
        var third_col_headers = createTable_values3[0];
        populate_drop_down('#thirdconditiondropdowncols1', third_col_headers, true)
        document.getElementById('thirdcond1_col_drop').style.display = 'inline-block';
        document.getElementById('thirdconditionsq').style.display = 'block';
        document.getElementById('thirdconditions1').style.display = 'block';  
        document.getElementById('thirdcond1_action1').style.display = 'inline-block';
    }
    else{       
        // add more conditions by cloning previous and reseting values
        var $last_condition = $('#thirdcondition-container div[id^="thirdconditions"]:last');
        var condition_num = $last_condition.prop("id").slice(-1);
        condition_num++;
        var $condition_klon = $last_condition.clone(false).prop('id', 'thirdconditions'+condition_num);
        // change id to current condition num
        $condition_klon.find('.dropdown.condition-dropdown').prop('id', 'thirdcond' + condition_num + '_col_drop');
        $condition_klon.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').prop('id', 'thirdconditioncolselect' + condition_num);
        $condition_klon.find('.dropdown-menu').prop('id', 'thirdconditiondropdowncols' + condition_num);
        $condition_klon.find('.dropdown.condition-dropdown-col').prop('id', 'thirdcond' + condition_num + 'action' + condition_num);
        $condition_klon.find('.condition-input-div').prop('id', 'thirdcondition' + condition_num + 'and');
        $condition_klon.find('.condition-dropdown-andor').prop('id', 'thirdandor' + condition_num);        
        
        // change dropdown value back to Select Column
        $condition_klon.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').html('Select Column');
        $condition_klon.find('.btn.btn-outline-secondary.dropdown-toggle.condition-dropdown-btn').html('Equals');
        $condition_klon.find('.form-control.condition-input').val('');
        $condition_klon.find('.form-control.condition-input-and').val('');
        $condition_klon.find('.condition-dropdown-btn-andor').html('And');
        $condition_klon.find('.condition-input-div').css('display','none');
        $condition_klon.find('.condition-dropdown-andor').css('visibility','visible');
        $condition_klon.appendTo('#thirdconditionsq');          
    }
});


// when add condition is added for fourth
$(document.body).on('click', '#addconditionfourth' ,function(){
    var current_selection = $('#fourthcond1_col_drop').find('.btn').text()
    if (current_selection === 'Select Column'){
        var fourth_col_headers = createTable_values4[0];
        populate_drop_down('#fourthconditiondropdowncols1', fourth_col_headers, true)
        document.getElementById('fourthcond1_col_drop').style.display = 'inline-block';
        document.getElementById('fourthconditionsq').style.display = 'block';
        document.getElementById('fourthconditions1').style.display = 'block';  
        document.getElementById('fourthcond1_action1').style.display = 'inline-block';
    }
    else{       
        // add more conditions by cloning previous and reseting values
        var $last_condition = $('#fourthcondition-container div[id^="fourthconditions"]:last');
        var condition_num = $last_condition.prop("id").slice(-1);
        condition_num++;
        var $condition_klon = $last_condition.clone(false).prop('id', 'fourthconditions'+condition_num);
        // change id to current condition num
        $condition_klon.find('.dropdown.condition-dropdown').prop('id', 'fourthcond' + condition_num + '_col_drop');
        $condition_klon.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').prop('id', 'fourthconditioncolselect' + condition_num);
        $condition_klon.find('.dropdown-menu').prop('id', 'fourthconditiondropdowncols' + condition_num);
        $condition_klon.find('.dropdown.condition-dropdown-col').prop('id', 'fourthcond' + condition_num + 'action' + condition_num);
        $condition_klon.find('.condition-input-div').prop('id', 'fourthcondition' + condition_num + 'and');
        $condition_klon.find('.condition-dropdown-andor').prop('id', 'fourthandor' + condition_num);        
        
        // change dropdown value back to Select Column
        $condition_klon.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').html('Select Column');
        $condition_klon.find('.btn.btn-outline-secondary.dropdown-toggle.condition-dropdown-btn').html('Equals');
        $condition_klon.find('.form-control.condition-input').val('');
        $condition_klon.find('.form-control.condition-input-and').val('');
        $condition_klon.find('.condition-dropdown-btn-andor').html('And');
        $condition_klon.find('.condition-input-div').css('display','none');
        $condition_klon.find('.condition-dropdown-andor').css('visibility','visible');
        $condition_klon.appendTo('#fourthconditionsq');          
    }
});

// if between is selected from condition dropdown update relevant andcondition
$(document.body).on('click', '.input-group.mb-3' ,function(){
    var cond_action = $(this).find('.btn').text();
    if (cond_action === 'Between'){
        $(this).parent('.conditiondiv').find('.condition-input-div').css('display','inline-block');
    }
    else{
        $(this).parent('.conditiondiv').find('.condition-input-div').css('display','none');
    }
});

// ! moved to extract_path.js
// next after conditions primary
//$(document.body).on('click', '#conditionnextprimary' ,function(){
//    var $last_condition = $('div[id^="primarycondition"]:last'); //find last condition
//    var condition_num = $last_condition.prop("id").slice(-1);
//    while (condition_num >= 1){
//        var current_primary_condition = 'primarycondition' + condition_num;
//        $last_condition = $('#'+current_primary_condition);
//        var andor = $last_condition.find('.condition-dropdown-btn-andor').text();
//        var column_name = $last_condition.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').text();        
//        var action = $last_condition.find('.btn.btn-outline-secondary.dropdown-toggle.condition-dropdown-btn').text();
//        var action_value = $last_condition.find('.form-control.condition-input').val();
//        var between_and = $last_condition.find('.form-control.condition-input-and').val();
//        condition_arr.push([andor, column_name, action, action_value, between_and]);
//        condition_num--;        
//    } 
//    document.getElementById('primarycondition-container').style.display = 'none';
//    //table_html_obj_arr = filter_data('table1');
//    display_conditions();
//});

// next after conditions secondary
$(document.body).on('click', '#conditionnextsecondary' , function(){
    var $last_condition = $('div[id^="secondaryconditions"]:last'); //find last condition
    var condition_num = $last_condition.prop("id").slice(-1);
    while (condition_num >= 1){
        var current_secondary_condition = 'secondaryconditions' + condition_num;
        $last_condition = $('#'+current_secondary_condition);
        var andor = $last_condition.find('.condition-dropdown-btn-andor').text();
        var column_name = $last_condition.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').text();        
        var action = $last_condition.find('.btn.btn-outline-secondary.dropdown-toggle.condition-dropdown-btn').text();
        var action_value = $last_condition.find('.form-control.condition-input').val();
        var between_and = $last_condition.find('.form-control.condition-input-and').val();
        condition_arr2.push([andor, column_name, action, action_value, between_and]);
        condition_num--;        
    } 
    document.getElementById('secondarycondition-container').style.display = 'none';
    display_conditions2();
});

// next after conditions third
$(document.body).on('click', '#conditionnextthird' ,function(){
    var $last_condition = $('div[id^="thirdconditions"]:last'); //find last condition
    var condition_num = $last_condition.prop("id").slice(-1);
    while (condition_num >= 1){
        var current_secondary_condition = 'thirdconditions' + condition_num;
        $last_condition = $('#'+current_secondary_condition);
        var andor = $last_condition.find('.condition-dropdown-btn-andor').text();
        var column_name = $last_condition.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').text();        
        var action = $last_condition.find('.btn.btn-outline-secondary.dropdown-toggle.condition-dropdown-btn').text();
        var action_value = $last_condition.find('.form-control.condition-input').val();
        var between_and = $last_condition.find('.form-control.condition-input-and').val();
        condition_arr3.push([andor, column_name, action, action_value, between_and]);
        condition_num--;        
    } 
    document.getElementById('thirdcondition-container').style.display = 'none';
    display_conditions3();
});


// next after conditions fourth
$(document.body).on('click', '#conditionnextfourth' ,function(){
    var $last_condition = $('div[id^="fourthconditions"]:last'); //find last condition
    var condition_num = $last_condition.prop("id").slice(-1);
    while (condition_num >= 1){
        var current_secondary_condition = 'fourthconditions' + condition_num;
        $last_condition = $('#'+current_secondary_condition);
        var andor = $last_condition.find('.condition-dropdown-btn-andor').text();
        var column_name = $last_condition.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').text();        
        var action = $last_condition.find('.btn.btn-outline-secondary.dropdown-toggle.condition-dropdown-btn').text();
        var action_value = $last_condition.find('.form-control.condition-input').val();
        var between_and = $last_condition.find('.form-control.condition-input-and').val();
        condition_arr4.push([andor, column_name, action, action_value, between_and]);
        condition_num--;        
    } 
    document.getElementById('fourthcondition-container').style.display = 'none';
    display_conditions4();
});


// add conditions to match
$(document.body).on('click', '#matchaddcondition' ,function(){
    var $last_condition = $('#matchcondition-container div[id^="matchcondition1"]:last');
    var condition_num = $last_condition.prop("id").slice(-1); 
    console.log(condition_num)
    if (document.getElementById('matchcondition-container').style.display === 'none'){   
        document.getElementById('matchcondition-container').style.display = 'block';
        document.getElementById('matchcondition1').style.display = 'block';
        $('#matchprimaryheader').text(primary_file_name);
        $('#matchsecondaryheader').text(secondary_file_name);
        var col_headers = createTable_values1[0];
        populate_drop_down("#match_primary_col_dropdown", col_headers, true);
        var col_headers = createTable_values2[0];
        populate_drop_down("#match_secondary_col_dropdown", col_headers, true);
    }
    else{
        condition_num++;
        var $klon = $last_condition.clone(false).prop('id', 'matchcondition'+condition_num);
        $klon.find('.dropdown.condition-dropdown').prop('id', 'secondarycond' + condition_num + '_col_drop');
        $klon.appendTo('#matchconditioncontainer'); 

    }
});

$(document.body).on('dragenter focus click', '.file-input' ,function(e){
    $(e.target.parentNode).addClass('is-active');
});

$(document.body).on('dragenter focus click', '.file-input' ,function(e){
    $(e.target.parentNode).removeClass('is-active');
});

//unhide add additional file and next buttons
$(document.body).on('change', '.file-input' ,function(){
    var filesCount = $(this)[0].files.length;
    var $textContainer = $(this).prev();
    if (filesCount === 1) {
    // if single file is selected, show file name
    var fileName = $(this).val().split('\\').pop();  
    $textContainer.text(fileName);
    } else {
    // otherwise show number of files
    $textContainer.text(filesCount + ' files selected');
    }
    document.getElementById('addfiles').style.display = 'block';
});

// unhide additional file drop box
$(document.body).on('click', '#addsecondfile' ,function(){    
    if(document.getElementById('filetwo').style.display == 'none'){
        document.getElementById('filetwo').style.display = 'inline-block';       
    }
    else if(document.getElementById('file3').style.display == 'none'){
        document.getElementById('file3').style.display = 'inline-block';
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

$(document.body).on('click', '#runcode' , async function(){     
    document.getElementById('typingtextcontainer').style.display = 'none';
    document.getElementById('executeorrun').style.display = 'none';
    
    load_summary_carousel();
    setTimeout(function() {
        submit_algo_parameters();
        document.getElementById('page').style.display = 'none';
    }, 5000);
    
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
    document.getElementById("textbox-algo-desc-wrap").style.display = "none";
    document.getElementById("descriptionhelp").style.display = "none";
    document.getElementById("describeheader-text").style.display = "none";
    document.getElementById("submitloadersvg").style.display = "block"; 
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