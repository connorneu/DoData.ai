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
    await add_to_carousel(['Select file containing values to search for and extract:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false); 
    await add_to_carousel(['This file contains the values that will be searched for in other datasets.',
                        'Rows of data from the other datasets that match these values will be extracted.'],
                        fyi_color, ['display_primaryfileselect_drop()',"document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
}

// select file that has values to extract
async function display_primaryfileselect_drop(){
    populate_drop_down('#primaryfile_ul', unique_file_names, true)
    document.getElementById('primaryfiledrop').style.display = 'block';
    document.getElementById('extractinputfile').style.display = 'block';
}

 // file input: when primary file is selected hide dropdown + hide header + print selection
 $(document.body).on('click', '#primaryfile_ul' ,async function(){ 
    hide_containers(2);
    document.getElementById('primaryfiledrop').style.display = 'none'; // file selection dropdown 
    document.getElementById('extractinputfile').style.display = 'none';
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
$(document.body).on('click', '#data1_next_colheader' ,function(){
    hide_containers(2);
    document.getElementById("colselecttablediv1").style.display = "none";
    add_to_carousel(['Filter data?'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    add_to_carousel(['[' + primary_file_name + ' ' + primary_sheet_name + ']'], 'urgent', ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionsubtext')"], false, false)
    add_to_carousel(['These conditions will limit the rows imported into the algorithm.', 'If some of the data is not relevant then exclude it here.'], fyi_color, ['display_add_conditions_btn()', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);    
});



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