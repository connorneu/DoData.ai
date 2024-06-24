//global variables
createTable_values1 = '';
createTable_values2 = '';
condition_arr = [];
condition_arr2 = [];

// create unique of array -- usage example : myArray.filter(onlyUnique);
function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

function uniq_fast(obj, att) {
    var seen = {};
    var out = [];
    var len = obj.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = obj[i][att];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}

// when page is loaded
//$(window).on('load', function load_json(){ 
 $(document).ready(function() {
    var path = window.location.pathname;
    var page = path.split("/").pop();
    if(page === "reconcile"){
        const data_json = JSON.parse(document.getElementById('data_dump').textContent);  // load json data
        unique_file_names = uniq_fast(data_json, 'file_name');  // calcualte file names   
        $("#loadedfile1").text(unique_file_names[0]); // text value of Data Accordion 1
        $("#loadedfile2").text(unique_file_names[1]); // text value of Data Accordion 1
        $("#firstfileaccordiontext").text("Adjust Data: " + unique_file_names[0]);  // header for first accordion
        $("#secondfileaccordiontext").text("Adjust Data: " + unique_file_names[1]);  // header for second accordion
        $('#adjustdata1header').html('<b>' + unique_file_names[0] + '</b>'); //second filename
        $('#adjustdata2header').html('<b>' + unique_file_names[1] + '</b>'); //first filename
        $("#data1selectsheet").text("Select Worksheet"); // data 1 select worksheet default !! THERE IS NO ID CALLAED      data1selectsheet
        unique_sheets_by_workbook = distinct_val_by_key(data_json, 'file_name', 'sheet_name'); // calculate distinct worksheets by dataset
        data1_sheets = Object.values(unique_sheets_by_workbook[0])[0]; // first dataset worksheets
        data2_sheets = Object.values(unique_sheets_by_workbook[1])[0]; // second dataset worksheets
        populate_drop_down("#file1sheetdropdown", data1_sheets); // populate data 1 sheet name dropdown
        populate_drop_down("#file2sheetdropdown", data2_sheets); // populate data 1 sheet name dropdown
        return data_json, unique_file_names
    }
});

// convert key value into column array 
function repivot_keyval(data_json, file_name, sheet_name) {
    result_table = [];
    // not super sure what this does --- it unpivots to original json object with file_name, sheet_name, key, value
    var entries = Object.entries(data_json);
    var objs = [];
    var col_obj = {};
    // for each record in object of unpivoted
    for(var i=0; i<entries.length; i++)
    {
        // if file_name and sheet_name match required file and sheet
        if(entries[i][1]['file_name'] === file_name && entries[i][1]['sheet_name'] === sheet_name)
        {
            // search list of objects to see if column header exists. if it does then add to it's value array. else create new obj and add to array
            if(objs.some(e => e.col_header === entries[i][1]['key']))
            {
                // get the index of the found object
                const obj_i = objs.findIndex(e => e.col_header === entries[i][1]['key']);
                // double check if index exists
                if(obj_i > -1)
                {
                    // if found. extend its array of values
                    objs[obj_i].vals.push(entries[i][1]['val']) ;
                }
            }
            else
            {   
                // if object doesn't exist in object array then add it
                var obj = {col_header: entries[i][1]['key'], vals : [entries[i][1]['val']]};
                objs.push(obj);
            }
        }
    }
    //for(var i=0; i<objs.length; i++)
    //{
    //    console.log(objs[i])
    //}
    return objs;
}

// populate html table from repivoted key value db table
// specified_header_row is when user clicks on table to change header row
function createTable(objs, table_id, specified_header_row=0, max_col_display=5) {  
    var table_length = objs[0]['vals'].length;
    var tbody = document.getElementById(table_id);
    tbody.innerHTML = '';
    var tr = '<tr>'; 
    var isAllValsCollected = false;
    var maxRowsReached = false;
    var obj_elem_iter = specified_header_row;
    var tr = '<tr>';
    var col_headers = []
    //var max_col_display = 9;
    var col_display = 0;
    var all_html = '';
    // while still iterating thru each objects header + vals
    while(!isAllValsCollected){
        // if === 0 then collect headers
        if (obj_elem_iter === specified_header_row)
        {
            for (var i = 0; i < objs.length; i++) {
                // if header row is row 0 then use col_header object
                if (specified_header_row === 0)
                {
                    if (objs[i].col_header.includes('Unnamed:') || objs[i].col_header === 'nan')
                    {
                        var th = '<th>' + '' + '</th>';
                        //col_headers.push(''); Do not add to column header array if blank
                    }
                    else
                    {
                        var th = '<th>' + objs[i].col_header + '</th>';
                        col_headers.push(objs[i].col_header);
                    }
                }
                else
                {
                    // if header row is not 0 then use object value at specified_header_row
                    var th = '<th>' + objs[i].vals[specified_header_row-1] + '</th>';
                    if (objs[i].vals[specified_header_row-1].includes('Unnamed:') || objs[i].vals[specified_header_row-1] === 'nan')
                    {
                        var th = '<th>' + ' ' + '</th>';
                        //col_headers.push('');  Do not add to column header array if blank
                    }
                    else
                    {
                        var th = '<th>' + objs[i].vals[specified_header_row-1] + '</th>';
                        col_headers.push(objs[i].vals[specified_header_row-1]);
                    }
                }
                
                tr += th;
            }
            tr += '</tr>';
            // append header to inner html
            if(!maxRowsReached)
            {
                tbody.innerHTML += tr;
            }
            all_html += tr;
        }
        else
        {   
            // if not header collect object and append to inner html
            var tr = '<tr>';
            for (var i = 0; i < objs.length; i++) {
                if(objs[i].vals[obj_elem_iter-1] === 'nan')
                {
                    tr  += '<td>' + '' + '</td>';
                }
                else
                {
                    tr  += '<td>' + objs[i].vals[obj_elem_iter-1] + '</td>';
                }
            }
            tr += '</tr>';
            if(!maxRowsReached)  
            {
                tbody.innerHTML += tr; 
            }
            all_html += tr;
        }
        obj_elem_iter++;
        col_display++;
        // if number of rows displayed equal max display value then add elipsis to end of every column
        if (col_display === max_col_display)
        {
            var tr = '<tr>';
            for (var i = 0; i < objs.length; i++) {
                tr  += '<td>' + '.....' + '</td>';
            }
            tr += '</tr>';
            tbody.innerHTML += tr;
            all_html += tr;
            maxRowsReached = true;
        }                   
        // if iter > then length of the objects value array then exit loop
        if (obj_elem_iter > table_length)
        {
            isAllValsCollected = true;
        }  

    }
    var table_inner_html = all_html;
    return [col_headers, table_inner_html];
}

function headerList(objs, table_id){
    var tbody = document.getElementById(table_id);
    tbody.innerHTML = '';
    for(var i=0; i<objs.length; i++)
    {
        var tr = '<tr>' + objs[i] + '</tr>';
        tbody.innerHTML += tr;
    }
}

function populate_table_element(selected_sheet, tablenumber, data_tableid){
    const data_json = JSON.parse(document.getElementById('data_dump').textContent); // get original json data gain
    unique_file_names = uniq_fast(data_json, 'file_name');  // calcualte file names   
    //$("#loadedfile1").text(unique_file_names[0]); // text value of Data Accordion 1  !! I DONT THINK THIS DOES ANYTHING
    var repivoted_data = repivot_keyval(data_json, unique_file_names[(tablenumber-1)], selected_sheet); // create array original table dimension from key value table
    if (tablenumber === 1)
    {
        createTable_values1 = createTable(repivoted_data, data_tableid); // create html table for data 1 from repivoted key value table
        //createTable_values = createTable_values1;
    }
    if (tablenumber === 2)
    {
        createTable_values2 = createTable(repivoted_data, data_tableid); // create html table for data 1 from repivoted key value table
        //createTable_values = createTable_values2;
    }
    if (tablenumber === 1)
    {
        var col_headers = createTable_values1[0];
        var createTable_html = createTable_values1[1];
    }
    else
    {
        var col_headers = createTable_values2[0];
        var createTable_html = createTable_values2[1];
    }

    //parse_table_column_values(createTable_html);   //!! what does this do
    return col_headers;
}

// parse html table to sort data into object array with column header as key and column value as value
function parse_table_column_values(table_html){
    var header_val_obj_arr = [];
    var tr_chunks = table_html.split('</tr>');
    var headers_dirty = tr_chunks[0].split('</th>');
    var headers = [];
    // create array of column headers
    for (var i = 0; i<headers_dirty.length; i++){
        var header_arr = headers_dirty[i].split('<th>');
        var header = header_arr[header_arr.length - 1];
        headers.push(header);
    }
    // for each column header
    for (var i = 0; i<headers.length; i++){
        var col_vals = [];   
        col_vals.push(headers[i]);
        // iterate over values selecting td in ith position
        for (var j = 1; j<tr_chunks.length; j++){
            var obj = {};
            var tr_vals = tr_chunks[j].split('</td>');  
            if (tr_vals != '')
            {
                var tr_val = tr_vals[i].split('<td>');
                var tr = tr_val[tr_val.length - 1];
            }
            else
            {
                var tr = '';
            }
            // if value is not equal to placeholder then create object with header as key and col values as value
            if(tr != '.....')
            {
                obj[headers[i]] = tr;
                header_val_obj_arr.push(obj);
            }
        }
    }
    return header_val_obj_arr;
}

// given list of objects with column_header:column_value when col header matches then populate elem_id
function populate_obj_list(elem_id, obj_list, col_header){
    const ul = document.getElementById(elem_id);
    ul.innerHTML = '';
    for (var i=0; i<obj_list.length; i++){
        var opt = document.createElement("li");
        obj_i_key = Object.keys(obj_list[i])[0]
        if (obj_i_key === col_header)
        {
            $(opt).attr("data-value", obj_i_key)
            $(opt).attr("class", "list-group-item")
            opt.innerHTML = obj_list[i][obj_i_key];
            ul.appendChild(opt);
        }
    }

}

// given 2 keys, find the unique pairs of each key from json object with multiple keys
function distinct_val_by_key(data_json, key1, key2){
    result_arr = [];
    // get array of distinct values for key 1
    distinct_key1 = uniq_fast(data_json, key1);
    // for each value in distinct key 1 array
    for (var distinct_i=0; distinct_i<distinct_key1.length; distinct_i++){
        // result is {result_key : key2_arr} appended to result_arr
        obj = {};
        key2_arr = [];
        result_key = distinct_key1[distinct_i];
        // search through json data
        for (var i=0; i<data_json.length;i++){
            distinct_key_val = String(data_json[i][key1]);
            // if json object key 1 value equals to ith distinct key
            if (distinct_key_val === result_key){
                val = String(data_json[i][key2]);
                found = false;
                for (var j=0; j<key2_arr.length; j++)
                {
                    j_val = key2_arr[j];
                    if (val === j_val){
                        found = true;
                    }
                }
                if (!found){
                    key2_arr.push(val)
                }
            }
        }
        obj[result_key] = key2_arr;
        result_arr.push(obj);
    }
    return result_arr
}

// using array to populate dropdown values
function populate_drop_down(dropdown_id, val_arr, is_to_be_cleared=false){
    if(is_to_be_cleared){
        $(dropdown_id).empty();
    }
    var options = $(dropdown_id);
    $.each(val_arr, function(v) {
            options.append($("<li><a class='dropdown-item'>" + val_arr[v] + "</a></li>"));
    });
}
           
 // update table 1 header with user click of new row
$(document.body).on('click', '#data1_tableid' ,function(e){  
    const cell = e.target.closest('td');
    if (!cell) {return;} // Quit, not clicked on a cell
    const row = cell.parentElement; // row user clicked on
    const data_json = JSON.parse(document.getElementById('data_dump').textContent); // get original json data gain
    unique_file_names = uniq_fast(data_json, 'file_name');  // calcualte file names   
    $("#loadedfile1").text(unique_file_names[0]); // text value of Data Accordion 1
    var selected_data1_sheet_dropdown = $('#data1selectsheetbutton').val($(this).text()).text() // get current data1 sheet value
    var repivoted_data = repivot_keyval(data_json, unique_file_names[0], selected_data1_sheet_dropdown); // create array original table dimension from key value table
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

 // update table 2 header with user click of new row
$(document.body).on('click', '#data2_tableid' ,function(e){  
    const cell = e.target.closest('td');
    if (!cell) {return;} // Quit, not clicked on a cell
    const row = cell.parentElement; // row user clicked on
    const data_json = JSON.parse(document.getElementById('data_dump').textContent); // get original json data gain
    unique_file_names = uniq_fast(data_json, 'file_name');  // calcualte file names   
    $("#loadedfile2").text(unique_file_names[1]); // text value of Data Accordion 1
    var selected_data1_sheet_dropdown = $('#data2selectsheetbutton').val($(this).text()).text() // get current data1 sheet value
    var repivoted_data = repivot_keyval(data_json, unique_file_names[1], selected_data1_sheet_dropdown); // create array original table dimension from key value table
    createTable_values2 = createTable(repivoted_data, 'data2_tableid', row.rowIndex); // create html table for data 1 from repivoted key value table
    var col_headers = createTable_values2[0];
    var createTable_html = createTable_values2[1];
    table_html_obj_arr = parse_table_column_values(createTable_html);
    //populate_obj_list("data1selectedcolumnvalues", table_html_obj_arr);
    populate_drop_down("#data2columns", col_headers, true); // populate data column selection with header update
    document.getElementById("data2_table_reset").style.display = "block";
    $("tr").css({ 'background-color' : '#2b2b2b'});  //once column has been selected change the background of the table - only works with coral color for some reason + if user clicks again they get bad result
    //console.log(cell.innerHTML, row.rowIndex, cell.cellIndex);
});

// reset table 1 data on click by using default value of 0 for createTable row header
$(document.body).on('click', '#data1_table_reset' ,function(e){
    var selected_data_sheet_dropdown = $('#data1selectsheetbutton').val($(this).text()).text() // get current data1 sheet value
    col_headers = populate_table_element(selected_data_sheet_dropdown, 1, 'data1_tableid') // populate table with selected values
    populate_drop_down("#data1columns", col_headers, true);
    document.getElementById("data1_table_reset").style.display = "none";
});

// reset table 2 data on click by using default value of 0 for createTable row header
$(document.body).on('click', '#data2_table_reset' ,function(e){
    var selected_data_sheet_dropdown = $('#data2selectsheetbutton').val($(this).text()).text() // get current data1 sheet value
    col_headers = populate_table_element(selected_data_sheet_dropdown, 2, 'data2_tableid') // populate table with selected values
    populate_drop_down("#data2columns", col_headers, true);
    document.getElementById("data2_table_reset").style.display = "none";
});

 // make dropdown value equal to selected value
$(document.body).on('click', '.dropdown-menu li a' ,function(){      
    var selected_dropdown_value = $(this).text();
    $(this).parents(".dropdown").find('.btn').html($(this).text() + '<span class="caret"></span>');
    $(this).parents(".dropdown").find('.btn').val($(this).data('value')); 
    // update data1 columns for column dropdown based on selection
    if($(this).parents('.dropdown-menu').attr("id") == "file1sheetdropdown"){
        col_headers = populate_table_element($(this).text(), 1, 'data1_tableid');
        populate_drop_down("#data1columns", col_headers, true);
        document.getElementById("data1_colheader_txt").style.display = "block";
        document.getElementById("colselecttablediv").style.display = "block";
        document.getElementById("data1_next_colselect").style.display = "block";
        document.getElementById("data1step1header").style.display = "none";
    }
    // update data2 columns for column dropdown based on selection
    if($(this).parents('.dropdown-menu').attr("id") == "file2sheetdropdown"){
        col_headers = populate_table_element($(this).text(), 2, 'data2_tableid');
        populate_drop_down("#data2columns", col_headers, true);
        document.getElementById("data2_colheader_txt").style.display = "block";
        document.getElementById("colselecttablediv2").style.display = "block";
        document.getElementById("data2_next_colselect").style.display = "block";
    }


    //REMOVE THIS
    // column selected for data 1
    if($(this).parents('.dropdown-menu').attr("id") == "data1columns"){
        var col_headers = createTable_values1[0];
        var createTable_html = createTable_values1[1];
        table_html_obj_arr = parse_table_column_values(createTable_html);  
        document.getElementById("yesconditions1").style.display = "block";
        document.getElementById("data1_next_conditions").style.display = "inline-block";
        document.getElementById("goback_header_select").style.display = "inline-block";
    }
    // column selected for data 2
    if($(this).parents('.dropdown-menu').attr("id") == "data2columns"){
        var col_headers = createTable_values2[0];
        var createTable_html = createTable_values2[1];
        table_html_obj_arr = parse_table_column_values(createTable_html);  
        document.getElementById("yesconditions2").style.display = "block";
        document.getElementById("data2_next_conditions").style.display = "inline-block";
        document.getElementById("goback_header_select2").style.display = "inline-block";
    }
});


// click data1 Next after selecting sheet / headers
$(document.body).on('click', '#data1_next_colselect' ,function(e){
    document.getElementById("data1_next_colselect").style.display = "none"; // hide next button
    document.getElementById("data1_colheader_txt").style.display = "none";
    document.getElementById("yesconditions1").style.display = "block";
    document.getElementById("data1_next_conditions").style.display = "inline-block";
    document.getElementById("goback_header_select").style.display = "inline-block";
    
   // document.getElementById("colselecttablediv").style.display = "none";    // hide col select table
   // document.getElementById("data1_colheader_txt").style.display = "none";  // hide table header
   // document.getElementById("data1_table_reset").style.display = "none";    // hide reset button
   // document.getElementById("data1selectsheetbutton").style.display = "none";  // hide step 1
   // document.getElementById("data1step1header").style.display = "none";    // hide select sheet


    //document.getElementById("data1_step2_column_values").style.display = "block"; // show step 2
    //document.getElementById("data1selectcolumns").style.display = "block";   // show select columns
    //document.getElementById("goback_header_select").style.display = "block";

});

// click data2 Next after selecting sheet / headers
$(document.body).on('click', '#data2_next_colselect' ,function(e){
    document.getElementById("data2_next_colselect").style.display = "none"; // hide next button
    document.getElementById("colselecttablediv2").style.display = "none";    // hide col select table
    document.getElementById("data2_colheader_txt").style.display = "none";  // hide table header
    document.getElementById("data2_table_reset").style.display = "none";    // hide reset button
    document.getElementById("data2selectsheetbutton").style.display = "none";  // hide step 1
    document.getElementById("data2step1header").style.display = "none";    // hide select sheet

    document.getElementById("data2_step2_column_values").style.display = "block"; // show step 2
    document.getElementById("data2selectcolumns").style.display = "block";   // show select columns
    document.getElementById("goback_header_select2").style.display = "block";
});

// click data1 Go Back after selecting sheet / headers
$(document.body).on('click', '#goback_header_select' ,function(e){
    document.getElementById("data1_next_colselect").style.display = "block"; // hide next button
    document.getElementById("colselecttablediv").style.display = "block";    // hide col select table
    document.getElementById("data1_colheader_txt").style.display = "block";  // hide table header
    document.getElementById("data1_table_reset").style.display = "block";    // hide reset button
    document.getElementById("data1selectsheetbutton").style.display = "block";  // hide step 1
    document.getElementById("data1step1header").style.display = "block";    // hide select sheet

    $("#data1selectcolumns").text('Select Column');

    document.getElementById("data1_step2_column_values").style.display = "none"; // show step 2
    document.getElementById("data1selectcolumns").style.display = "none";   // show select columns
    document.getElementById("goback_header_select").style.display = "none";
    document.getElementById("yesconditions1").style.display = "none";   // hide conditions
    document.getElementById("data1_next_conditions").style.display = "none"; //hide next button from condtions view
});

// click data2 Go Back after selecting sheet / headers
$(document.body).on('click', '#goback_header_select2' ,function(e){
    document.getElementById("data2_next_colselect").style.display = "block"; // hide next button
    document.getElementById("colselecttablediv2").style.display = "block";    // hide col select table
    document.getElementById("data2_colheader_txt").style.display = "block";  // hide table header
    document.getElementById("data2_table_reset").style.display = "block";    // hide reset button
    document.getElementById("data2selectsheetbutton").style.display = "block";  // hide step 1
    document.getElementById("data2step1header").style.display = "block";    // hide select sheet

    $("#data2selectcolumns").text('Select Column');

    document.getElementById("data2_step2_column_values").style.display = "none"; // show step 2
    document.getElementById("data2selectcolumns").style.display = "none";   // show select columns
    document.getElementById("goback_header_select2").style.display = "none";
    document.getElementById("yesconditions2").style.display = "none";   // hide conditions
    document.getElementById("data2_next_conditions").style.display = "none"; //hide next button from condtions view
});

// when click add is conditions data1
$(document.body).on('click', '#isaddconditions1' ,function(e){
    document.getElementById("conditions1header").style.display = "block"; //conditions header
    document.getElementById("condition1header").style.display = "none";
    // if condition 1 already exists then clone conditioncontainer and increment its id by 1
    if($("#conditiondropdowncols1").text().length>0)
    {
        var $div = $('div[id^="conditioncontainer1"]:last');
        var num = $div.prop("id").slice(-1);
        // if there are less than 10 conditions
        if (num != '9')
        {
            num++;
            var $klon = $div.clone(false).prop('id', 'conditioncontainer1'+num );
            $klon.appendTo("#yesconditions1");
        }     
        var addconditionbtn = $('#isaddconditions1').clone()       
        addconditionbtn.appendTo("#yesconditions1")
        $('#isaddconditions1:first').remove()
}
// if first condition doesn't exist show it
else
{
    document.getElementById("conditioncontainer1").style.display = "flex"; // show type of condition1 
    $('#conditioncolselect1').text(document.getElementById("data1selectcolumns").innerText); // set default column value to current selection
    var col_headers = createTable_values1[0];
    populate_drop_down("#conditiondropdowncols1", col_headers, true); //populate dropdown with other column headers
}

});

// when click add is conditions data2
$(document.body).on('click', '#isaddconditions2' ,function(e){
    document.getElementById("data2_reset_conditions").style.display = "block"; //reset conditions button
    // if condition 1 already exists then clone conditioncontainer and increment its id by 1
    if($("#conditiondropdowncols2").text().length>0)
    {
        var $div = $('div[id^="conditioncontainer2"]:last');
        var num = $div.prop("id").slice(-1);
        // if there are less than 10 conditions
        if (num != '9')
        {
            num++;
            var $klon = $div.clone(false).prop('id', 'conditioncontainer2'+num );
            $klon.appendTo("#yesconditions2");
        }     
        var addconditionbtn = $('#isaddconditions2').clone()       
        addconditionbtn.appendTo("#yesconditions2")
        $('#isaddconditions2:first').remove()
}
// if first condition doesn't exist show it
else
{
    document.getElementById("conditioncontainer2").style.display = "flex"; // show type of condition1 
    $('#conditioncolselect2').text(document.getElementById("data2selectcolumns").innerText); // set default column value to current selection
    var col_headers = createTable_values2[0];
    populate_drop_down("#conditiondropdowncols2", col_headers, true); //populate dropdown with other column headers
}

});

//condition dropdown entrybox combo
$(document.body).on('click', '.dropdown-menu li a' ,function(){      
    var selected_dropdown_value = $(this).text();
    $(this).parents(".input-group").find('.btn').html($(this).text() + '<span class="caret"></span>');
    $(this).parents(".input-group").find('.btn').val($(this).data('value')); 
    //if value equals between then display second entry box for 'and'
    if($(this).text() === 'Between'){          
        //find and box within current condition container
        var ch = $(this).closest('.conditiondivcontainer').find("div[id*='conditionand']")[0].style.display = "flex";
    }
    if($(this).text() === 'Equals' || $(this).text() === 'Contains' || $(this).text() === 'Greater Than' || $(this).text() === 'Less Than' || $(this).text() === 'Not Equal To' || $(this).text() === 'Does Not Contain'){          
        //find and box within current condition container
        var ch = $(this).closest('.conditiondivcontainer').find("div[id*='conditionand']")[0].style.display = "none";
    }
    /*
    if($(this).text() === 'Between'){          
        //find and box within current condition container
        var ch = $(this).closest('.conditiondivcontainer').find('#conditionand2')[0].style.display = "flex";
    }
    if($(this).text() === 'Equals' || $(this).text() === 'Contains' || $(this).text() === 'Greater Than' || $(this).text() === 'Less Than' || $(this).text() === 'Not Equal To' || $(this).text() === 'Does Not Contain'){          
        //find and box within current condition container
        var ch = $(this).closest('.conditiondivcontainer').find('#conditionand2')[0].style.display = "none";
    } */
});

$(document.body).on('click', '#data1_reset_conditions' ,function(e){   
    remove_conditions();
});
$(document.body).on('click', '#data2_reset_conditions' ,function(e){   
    remove_conditions2();
});

function remove_conditions(){
    document.getElementById("data1_reset_conditions").style.display = "none";
    var $div = $('div[id^="conditioncontainer1"]:last');
    while($div.length) {        
        num = $div.prop("id").slice(-1);
        num_as_num = Number(num);
        $div.remove();
        $div = $('div[id^="conditioncontainer1"]:last');
    }
}

function remove_conditions2(){
    var $div = $('div[id^="conditioncontainer2"]:last');
    while($div.length) {        
        num = $div.prop("id").slice(-1);
        num_as_num = Number(num);
        $div.remove();
        $div = $('div[id^="conditioncontainer2"]:last');
    }
}

$(document.body).on('click', '#data1_reset_conditions' ,function(e){   
    remove_conditions();
});

$(document.body).on('click', '#data2_reset_conditions' ,function(e){   
    remove_conditions2();
});

//data1 next button after conditions
$(document.body).on('click', '#data1_next_conditions' ,function(){      
    // get data 1 sheet
    var data1_sheet = $('#data1selectsheetbutton').val($(this).text()).text();
    // get data 1 headers
    var data1_column_headers = col_headers = createTable_values1[0];
    // get data 1 search column
    var search_column = $('#data1selectcolumns').val($(this).text()).text();
    // get all conditions for data 1
    //var condition_arr = [];

    var $div = $('div[id^="conditioncontainer1"]:last'); //find last condition
    var cond_col = $div.find('.btn-secondary:last').text(); //condition column 
    var cond_type = $div.find('.btn-outline-secondary:last').text(); // type of condition
    var cond_text = $div.find('.form-control').val(); //condition text
    var and_text = $div.find('.input-group-text').siblings().val(); // and text
    var num = $div.prop("id").slice(-1);  
    var num_as_num = Number(num);
    num_as_num--;
    condition_arr.push([cond_col, cond_type, cond_text, and_text])

    while(num_as_num >= 1) {
        
        if(num_as_num === 1){
            $div = $("#yesconditions1").find('#conditioncontainer1');
        }
        else{
            $div = $("#yesconditions1").find('#conditioncontainer1'+num_as_num);
        }
        cond_col = $div.find('.btn-secondary:last').text();
        cond_type = $div.find('.btn-outline-secondary:last').text();
        cond_text = $div.find('.form-control').val();
        and_text = $div.find('.input-group-text').siblings().val();
        num = $div.prop("id").slice(-1);
        num_as_num = Number(num);
        num_as_num--;
        condition_arr.push([cond_col, cond_type, cond_text, and_text])
    }
    $("#collapseTwo").collapse("hide");
    $("#collapseThree").collapse("show");
    console.log(condition_arr);
    filter_data('table1');
});


//data2 next button after conditions
$(document.body).on('click', '#data2_next_conditions' ,function(){      
    // get data 2 sheet
    var data1_sheet = $('#data2selectsheetbutton').val($(this).text()).text();
    // get data 2 headers
    var data1_column_headers = col_headers = createTable_values2[0];
    // get data 2 search column
    var search_column = $('#data2selectcolumns').val($(this).text()).text();
    // get all conditions for data 2
    //var condition_arr = [];

    var $div = $('div[id^="conditioncontainer2"]:last'); //find last condition
    var cond_col = $div.find('.btn-secondary:last').text(); //condition column 
    var cond_type = $div.find('.btn-outline-secondary:last').text(); // type of condition
    var cond_text = $div.find('.form-control').val(); //condition text
    var and_text = $div.find('.input-group-text').siblings().val(); // and text
    var num = $div.prop("id").slice(-1);  
    var num_as_num = Number(num);
    num_as_num--;
    condition_arr.push([cond_col, cond_type, cond_text, and_text])

    while(num_as_num >= 2) {
        
        if(num_as_num === 2){
            $div = $("#yesconditions2").find('#conditioncontainer2');
        }
        else{
            $div = $("#yesconditions2").find('#conditioncontainer2'+num_as_num);
        }
        cond_col = $div.find('.btn-secondary:last').text();
        cond_type = $div.find('.btn-outline-secondary:last').text();
        cond_text = $div.find('.form-control').val();
        and_text = $div.find('.input-group-text').siblings().val();
        num = $div.prop("id").slice(-1);
        num_as_num = Number(num);
        num_as_num--;
        condition_arr.push([cond_col, cond_type, cond_text, and_text])
    }
    console.log(condition_arr);
    filter_data('table2');
});

// data load page - - show spinner on Submit
$(document.body).on('click', '#accordionsubmitbutton1' ,function(){  
    document.getElementById("accordionsubmitbutton1").style.display = "none";
    document.getElementById("submitdataspinner").style.display = "inline-block";

});

// create array of column names for each Worksheet -- params: dropdown id to populate, selected value from worksheet dropdown
// THIS DOESN'T WORK DOESN'T TAKE INTO CONSIDERATION FILENAME -- GROUPS VALUES WITH SAME SHEET BUT DIFFERENT FILENAMES
function update_columns_for_sheet(col_dropdown_id, dropdown_value) {
    const data_json = JSON.parse(document.getElementById('data_dump').textContent);
    unique_colheader_by_worksheet = distinct_val_by_key(data_json, 'sheet_name', 'key');
    for(var i=0; i<unique_colheader_by_worksheet.length; i++){
        if(String(Object.keys(unique_colheader_by_worksheet[i])) === String(dropdown_value)){
            columns = Object.values(unique_colheader_by_worksheet[i])[0];
            populate_drop_down(col_dropdown_id, columns, true);    
        }
    }
} 

// check if there is a blank column with all blank values
function check_blank_columns(table_obj_arr)
{
    var num_unknown = 1;
    // get headers of file
    var headers = get_headers_from_table_obj(table_obj_arr);
    //index of each blank row with blank column header
    var obj_index = [];
    var clean_table_obj = [];
    for(var i = 0; i<headers.length; i++)
    {   
        var all_blank = false;
        var header = headers[i];
        if (header === '')
        {
            var in_header = false; 
            all_blank = true;
            for(var j = 0;j<table_obj_arr.length;j++)
            {
                var key = Object.keys(table_obj_arr[j])[0];
                var val = table_obj_arr[j][key];
                if(key === header)
                {
                    //once header is found break if obj key doesnt equal header
                    in_header = true;
                    if (val != '')
                    {
                        all_blank=false;
                    }
                    else
                    {
                        // push index of blank value
                        obj_index.push(j);
                    }
                }
                else
                {
                    if(in_header)
                    {
                        break;
                    }
                }
            }
        }
        console.log(header +  ' ' + all_blank + ' ' + obj_index)
    }
    // append each row to clean obj if not in blank index`
    for (var i = 0;i<table_obj_arr.length;i++)
    {
        if (!obj_index.includes(i))
        {
            clean_table_obj.push(table_obj_arr[i])
        }
    }
    return clean_table_obj;
}

function get_headers_from_table_obj(table_obj_arr)
{
    var headers = [];
    for (var i=0;i<table_obj_arr.length;i++)
    {
        var key = Object.keys(table_obj_arr[i])[0];
        var val = table_obj_arr[i][key];
        if (!headers.includes(key))
        {
             headers.push(key);
        }
    }
    return headers;
}

function remove_table_obj_row(table_obj_arr, index)
{
    obj_arr_clean = [];
    for (var i=0;i<table_obj_arr.length;i++)
    {
        if (i != index)
        {
            obj_arr_clean.push(table_obj_arr[i]);
        }
    }
    return obj_arr_clean;
}

function filter_data(table){
    // if colheader is '' and vals is ''
    // all lower case
    var col_headers = '';
    var createTable_html = '';
    if (table==='table1')
    {
        col_headers = createTable_values1[0];
        createTable_html = createTable_values1[1];
    }
    else
    {
        col_headers = createTable_values2[0];
        createTable_html = createTable_values2[1];
    }

    table_obj_arr = parse_table_column_values(createTable_html);
    table_obj_arr = check_blank_columns(table_obj_arr);
    console.log(table_obj_arr);
    // final result
    var table_conditioned = [];
    // index if each row which is to be included
    var rows_to_include = []; 
    // current row of iteration  
    var row_count = 0;
    // calculate number of rows (data is unpivoted Obj key array)
    for (var table_i=0; table_i<table_obj_arr.length; table_i++){
        if(Object.keys(table_html_obj_arr[table_i])[0] === Object.keys(table_html_obj_arr[0])[0])
        {
            // include every row
            rows_to_include.push(row_count);
            row_count++;
        }       
    }
    var current_row = 0;
    var current_header = Object.keys(table_html_obj_arr[0])[0];
    for (var table_i=0; table_i<table_obj_arr.length; table_i++){
        // if current row hasnt alreayd been excluded
        var column_header = Object.keys(table_html_obj_arr[table_i])[0]
        var column_val =  Object.values(table_html_obj_arr[table_i])[0]
        for (var cond_i=0; cond_i<condition_arr.length; cond_i++){
            var cond_header = condition_arr[cond_i][0]
            if (column_header === cond_header)
            {
                var cond_type = condition_arr[cond_i][1]
                var cond_val = condition_arr[cond_i][2]
                var cond_and_val = condition_arr[cond_i][3]
                if (!check_condition(cond_type, cond_val, cond_and_val, column_val))
                {
                    //table1_conditioned.push(table_html_obj_arr[table_i])
                    // if check_condition returns false then remove current row index from rows to include
                    //rows_to_include.splice(current_row, 1);
                    rows_to_include = rows_to_include.filter(e => e !== current_row)
                    console.log("DROPPED " + current_row);
                    console.log(rows_to_include);
                }
            }
        }
        // if not equal then its a new row
        if (column_header == current_header)
        {
            current_row++;       
        }
        else
        {
            current_row=0;
            current_header = column_header;
        }
    }
    console.log(rows_to_include);
    current_row = 0;
    current_header = Object.keys(table_html_obj_arr[0])[0];
    for (var table_i=0; table_i<table_obj_arr.length; table_i++){
        var column_header = Object.keys(table_html_obj_arr[table_i])[0]
        var column_val =  Object.values(table_html_obj_arr[table_i])[0]
        if (rows_to_include.includes(current_row))
        {
            table_conditioned.push(table_html_obj_arr[table_i]);
        }
        // if not equal then its a new row
        if (column_header == current_header)
        {
            current_row++;       
        }
        else
        {
            current_row=0;
            current_header = column_header;
        }
    }
    console.log(table_conditioned);
}

function check_condition(cond_type, cond_val, cond_and_val, column_val){
    result = false;
    if (cond_type === 'Equals')
    {
        if(cond_val === column_val) {result = true;}
        console.log('a')
    } 
    if (cond_type === 'Contains')
    {
        if(column_val.includes(cond_val)) {result = true;}
        console.log('b')
    } 
    if (cond_type === 'Between')
    {
        if(column_val >= cond_val && cond_and_val <= cond_val) {result = true;}
        console.log('c')
    } 
    if (cond_type === 'Greater Than')
    {
        if(column_val >= cond_val) {result = true;}
        console.log('d')
    } 
    if (cond_type === 'Less Than')
    {
        if(column_val <= cond_val) {result = true;}
        console.log('e')
    } 
    if (cond_type === 'Not Equal To')
    {
        if(column_val != cond_val) {result = true;}
        console.log('f')
    } 
    if (cond_type === 'Not Equal To')
    {
        if(!column_val.includes(cond_val)) {result = true;}
        console.log('g')
    } 
    //console.log(cond_type + ' ' + cond_val + ' ' + cond_and_val + ' ' + column_val + ' ' + result);
    return result;
}


//typing effect     https://codepen.io/josephwong2004/pen/ExgoKde?editors=1010
const carouselText = [
  {id:"#feature-text1", text: "Load file: ", color: "white"},
  {id:"#feature-text2", text: "file_ext.xlsx", color: "#00FF41"},
  {id:"#feature-text3", text: "Load file: ", color: "white"},
  {id:"#feature-text4", text: "adresss_2023.csv", color: "#00FF41"},
]

$( document ).ready(async function() {
  carousel(carouselText, "#feature-text1")
  //carousel(carouselText)
});

async function typeSentence(sentence, eleRef, delay = 100) {
  const letters = sentence.split("");
  let i = 0;
  while(i < letters.length) {
    console.log(letters[i])
    await waitForMs(delay);
    $(eleRef).append(letters[i]);
    i++
  }
  return;
}

/*async function deleteSentence(eleRef) {
  const sentence = $(eleRef).html();
  const letters = sentence.split("");
  let i = 0;
  while(letters.length > 0) {
    await waitForMs(100);
    letters.pop();
    $(eleRef).html(letters.join(""));
  }
}  */

async function carousel(carouselList, eleRef) {
//async function carousel(carouselList) {
    var i = 0;
    while(true)
    {   
        updateFontColor(carouselList[i].id, carouselList[i].color)
        await typeSentence(carouselList[i].text, carouselList[i].id);
        //await waitForMs(1500);
        //await deleteSentence(eleRef);
        //await waitForMs(500);
        i++
        if(i >= carouselList.length) {i = 0; break;}
    }
}

function updateFontColor(eleRef, color) {
  $(eleRef).css('color', color);
}

function waitForMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}


// ADD RECORD COUNT TO DATA ADJUST
// first n rows last n rows: conditions

//unhide accordions as you progress

//different shades for each datas accordion

//description ofAdd Conditio dissapeas when you add first condition

// selcect column descrion: select column containing values to find in [dataset name]

//remove condition button

//summary of algoriuthm results after running

//YOU NEED TO CREATE A FUNCTION TO DEAL WITH COLUMN HEADERS THAT ARE THE SAME