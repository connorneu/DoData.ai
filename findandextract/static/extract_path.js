async function start_extract_file(){
    await add_to_carousel(['Define values to extract:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    await add_to_carousel(['Select values from file or describe values to search for?'], action_color, ["document.getElementById('inputis_file_or_input').style.display = 'block';", "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, false); 
}

// user selects use input file
$(document.body).on('click', '#inputis_file' ,async function(){   
    hide_containers(2);
    document.getElementById('user_select_input_file_or_custom').style.display = 'none';
    await add_to_carousel('Extract values using input file.', 'white', ['primary_file_selection_extract()'], true, false);
});

// user selects use description
$(document.body).on('click', '#inputis_describe' ,async function(){   
    hide_containers(2);
    document.getElementById('user_select_input_file_or_custom').style.display = 'none';
    await add_to_carousel('Extract values using custom description.', 'white', ['describe_data_extract()'], true, false);
});

// display_primaryfileselect_drop in in carouselaction.js as it can be used by other algorithm paths
async function primary_file_selection_extract(){
    await add_to_carousel(['Select file containing values to search for:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false); 
    await add_to_carousel(['This file contains the values that will be searched for in other datasets.'],
                        fyi_color, ['display_primaryfileselect_drop()',"document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
}

// select file that has values to extract
async function display_primaryfileselect_drop(){
    populate_drop_down('#primaryfile_ul', unique_file_names, true)
    document.getElementById('primaryfiledrop').style.display = 'block';
    //document.getElementById('extractinputfile').style.display = 'block';
}

 // file input: when primary file is selected hide dropdown + hide header + print selection
 $(document.body).on('click', '#primaryfile_ul' ,async function(){ 
    hide_containers(2);
    document.getElementById('primaryfiledrop').style.display = 'none'; // file selection dropdown 
    //document.getElementById('extractinputfile').style.display = 'none';
    var user_selection =  $(this).parents(".dropdown").find('.btn').text();
    primary_file_name = user_selection;
    primary_file_sheets = get_file_sheets(primary_file_name); 
    await add_to_carousel('Input File: ', input_color, ['update_item_text_params(primary_file_name)', 'primary_sheet_selection()'], true, false);
    
});

async function primary_sheet_selection(){
    if (primary_file_sheets.length > 1) {
        await add_to_carousel(['Select worksheet from input file'], action_color,  ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
        await add_to_carousel(['The selected worksheet should contain the data to search for in other datasets.', 'You can search for this data in other sheets from the same workbook.'], fyi_color,["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')", 'display_primaryfilesheets_drop()'], false, true); 
    }
    else{
        primary_sheet_name = "Sheet1";
        await add_to_carousel('\xa0\xa0\xa0' + 'Input Sheet: Sheet1 (default - file only has one sheet)', input_color, ['adjust_col_header()'], true, false);
    }   
}

// file input: if more than one sheet - select primary sheet
function display_primaryfilesheets_drop() {
    populate_drop_down('#primarysheet_ul', primary_file_sheets, true)
    document.getElementById('primarysheetdrop').style.display = 'block';
}

 // select primary sheet -> adjust col header
 $(document.body).on('click', '#primarysheet_ul' ,function(){ 
    hide_containers(2);
    document.getElementById('primarysheetdrop').style.display = 'none';
    var user_selection =  $(this).parents(".dropdown").find('.btn').text();
    primary_sheet_name = user_selection;    
    add_to_carousel('Input Sheet: ', input_color, ['update_item_text_params(primary_sheet_name)', 'adjust_col_header()'], true, false);
});

// adjust column header
function adjust_col_header(){
    add_to_carousel(['Change column headers'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    add_to_carousel(['Current column headers are highlighted in white.','If your column headers are not on the first row, then click on the row containing your column headers.',
    'Otherwise, click next.'], fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    document.getElementById("colselecttablediv1").style.display = "block";
    col_headers = populate_table_element(primary_sheet_name, 1, 'data1_tableid');
}

// next after adjusting col headers primary data
// function at next step changed from display_add_conditions_btn to select find column
$(document.body).on('click', '#data1_next_colheader' ,function(){
    hide_containers(2);
    document.getElementById("colselecttablediv1").style.display = "none";
    select_find_column();
});

async function select_find_column(){    
    await add_to_carousel(['Select column with values to search for in other datasets:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    await add_to_carousel(['Values in this column will be searched for in other datasets.'],
                    fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    var col_headers = createTable_values1[0];
    populate_drop_down("#matchprimarycol_ul", col_headers, true);
    document.getElementById('matchboxcolumn').style.display = 'flex';
    document.getElementById('firstmatchbox').style.display = 'block';

    //show and populate table to highlight and select
    col_headers = populate_table_element(primary_sheet_name, 1, 'matchprimary_table');
    document.getElementById('primarycolselect-table').style.display = 'block';
}

$(document.body).on('click', '#matchprimarycol_ul' , async function(){ 
    var selected_colheader = $(this).parents(".dropdown").find('.btn').text();
    extract_col = selected_colheader;
    document.getElementById("selected-match-col-primary").innerHTML = "Selected Column: " + selected_colheader; 
    document.getElementById("primarycondition-container").style.display = 'block';
});

//highlight column on click
$(document.body).on('click', 'td' , function(){     
    var $currentTable = $(this).closest('table');
    if ($currentTable.hasClass('colselect-table')){
        var index = $(this).index();
        $currentTable.find('td').removeClass('selected-hover');
        $currentTable.find('tr').each(function() {
            $(this).find('td').eq(index).addClass('selected');
        });
        var selected_colheader = $(this).closest("td").index();
        var table_headers = get_table_headers('primarycolselect-table');
        extract_col = table_headers[selected_colheader];   
        document.getElementById("selected-match-col-primary").innerHTML = "Selected Column: " + table_headers[selected_colheader];    
        document.getElementById("primarycondition-container").style.display = 'block';
    }
});

//highlight column on hover
$(document.body).on('mouseover', 'td' , function(){     
    var $currentTable = $(this).closest('table');
    if ($currentTable.hasClass('colselect-table')){
        var isSelected = false;
        var col_index = $(this).closest("td").index();
        if($currentTable.find('tr').eq(1).find('td').eq(col_index).hasClass('selected')){
            isSelected=true;
        }

        
        if (isSelected){
            var index = $(this).index();
            $currentTable.find('td').removeClass('selected-hover');
            $currentTable.find('tr').each(function() {
                if(!$(this).find('td').eq(index).hasClass('selected')){
                    $(this).find('td').eq(index).addClass('selected-hover');
                }
                
            });
        }
    }
});


async function write_extract_column_to_console(){
    document.getElementById('firstmatchbox').style.display = 'none';
    hide_containers(2);
    var extract_from_str = '\xa0\xa0\xa0' + 'Find values from column: ' + extract_col; 
    await add_to_carousel(extract_from_str, input_color , [null], true, false);
    await add_to_carousel('', input_color , ['add_linebreak_to_carousel()'], true, false);
}

$(document.body).on('click', '#conditionnextprimary' ,async function(){
    await write_extract_column_to_console();
    var $last_condition = $('div[id^="primarycondition"]:last'); //find last condition
    var condition_num = $last_condition.prop("id").slice(-1);
    while (condition_num >= 1){
        var current_primary_condition = 'primarycondition' + condition_num;
        $last_condition = $('#'+current_primary_condition);
        var andor = $last_condition.find('.condition-dropdown-btn-andor').text();
        var column_name = $last_condition.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').text();        
        var action = $last_condition.find('.btn.btn-outline-secondary.dropdown-toggle.condition-dropdown-btn').text();
        var action_value = $last_condition.find('.form-control.condition-input').val();
        var between_and = $last_condition.find('.form-control.condition-input-and').val();
        condition_arr.push([andor, column_name, action, action_value, between_and]);
        condition_num--;        
    } 
    document.getElementById('primarycondition-container').style.display = 'none';
    //table_html_obj_arr = filter_data('table1');
    display_conditions();
});

async function display_conditions(){
    //hide_containers(2);
    var cond_count = 1;
    var condition_string = null;
    await add_to_carousel('\xa0\xa0\xa0' + 'Filter:', input_color, [null], true, false);
    if (condition_arr.length === 1 && condition_arr[0][1] === 'Select Column' &&  condition_arr[0][2] === 'Equals'){
        condition_string = '\xa0\xa0\xa0' + '\xa0\xa0\xa0' + 'No conditions applied';
        await add_to_carousel(condition_string, input_color, [null], true, false);
    }
    else{
        for (var i = condition_arr.length-1; i >= 0; i--){
            if (condition_arr[i][4].length === 0){        
                condition_string = '\xa0\xa0\xa0' + '\xa0\xa0$\xa0' + condition_arr[i][1] + ' ' + condition_arr[i][2] + ' ' + condition_arr[i][3]
            }
            else{
                condition_string = '\xa0\xa0\xa0' + '\xa0\xa0$\xa0' + condition_arr[i][1] + ' ' + condition_arr[i][2] + ' ' + condition_arr[i][3] + ' and ' + condition_arr[i][4]
            }
            await add_to_carousel(condition_string, input_color , [null], true, false);
            cond_count++;
        }    
    }
}

// describe data to be extracted menu show
async function describe_data_extract(){
    await add_to_carousel(['Describe the data to be extracted:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false); 
    await add_to_carousel(['Rows that contain these values will be extracted.'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, false); 
    document.getElementById('describe-data-extract').style.display = 'block';
    
}

// when add condition is clicked
$(document.body).on('click', '#add-describe-text' ,function(){
    var desc_div_wrap = document.getElementById("extract-descriptions");
    var new_text = document.createElement("textarea");
    new_text.maxLength = "60";
    new_text.className = "describe-textarea";
    var wrapper = document.createElement('div');
    wrapper.append(new_text);
    desc_div_wrap.appendChild(wrapper);
});

$(document.body).on('click', '#next-describe-extract' ,async function(){
    hide_containers(2)
    document.getElementById('describe-data-extract').style.display = 'none';
    descriptions = document.getElementsByClassName('describe-textarea');
    await add_to_carousel('\xa0\xa0\xa0' + 'Values to extract:', input_color, [null], true, false);
    for (var i=0;i<descriptions.length;i++){
        description = descriptions[i].value;
        await add_to_carousel('\xa0\xa0\xa0' + '\xa0\xa0\xa0' + '$\xa0' + description, input_color, [null], true, false);
    }
});