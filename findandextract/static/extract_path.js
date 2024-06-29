async function start_extract_file(){
    hide_containers(2);
    document.getElementById('edit-data-tables').style.display = "none";
    await add_to_carousel('Define values to search for:', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    await add_to_carousel('Any row containing these values will be combined into one file', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, false); 
    console.log("dasetsefds")
    console.log(dataset_names)
    populate_drop_down('#extractinputfile_ul', dataset_names, true);
    populate_drop_down('.dropdown-menu.datasel:eq(0)', dataset_names, true);
    document.getElementById('describe-data-extract').style.display = 'block';
}


// when input dropdown has file selected make textboxes disabled
$(document.body).on('click', '#extractusefile, #extractinputfile_ul li a' ,async function(){   
    var selected_val = $(this).text();
    if (selected_val != 'Use Input File:'){
        var text_boxes = document.getElementsByClassName('describe-textarea');
        for (var i=0;i<text_boxes.length;i++){
            text_boxes[i].value = '';
            text_boxes[i].classList.add('gently-blur');
        }
        $('#extract-descriptions').find('.btn').addClass('disabled');
        $('#extractinputfile_ul').parents(".dropdown").find('.btn').removeClass('disabled');
    }

});


// when input file col is selected show extract from menu
$(document.body).on('click', '#extractinputcol_ul li a' ,async function(){  
    
    document.getElementById('findwherewrap').style.display = 'block';
    var searchfile = $('#extractinputfile_ul').closest('.dropdown').find('.btn').text();
    var searchcol = $('#extractinputcol_ul').closest('.dropdown').find('.btn').text()
    //$('#fromwhereheader').text('Search for values from ' + searchfile + ' in column ' + searchcol + ' in which files:')
    document.getElementById('add-describe-text').style.display = 'none';
    document.getElementById('first-extractfrom').style.display = 'flex';
    console.log('populating')
    populate_drop_down('#first-file_ul', dataset_names, true);
    populate_drop_down('#second-file_ul', dataset_names, true);
    populate_drop_down('#third-file_ul', dataset_names, true);
    //populate_drop_down('#fourth-file_ul', dataset_names, true);
});


// when first fromwhere file is selected hide describe menu
$(document.body).on('click', '#first-file-fileselect' ,async function(){  
    document.getElementById('extractfromdescribe').style.display = 'none';
    $('.or-separator').css("display", "none");
});

// when fromwhere file is selected populate dropdown
$(document.body).on('click', '.dropdown.extractfrom.dataset li a' ,async function(){  
    var selectedfile = $(this).closest('.dropdown').find('.btn').text();
    var colheaders = get_col_headers_for_filename(selectedfile);
    var coldropdown = $(this).closest('.extract-from-file').find('.dropdown-menu');
    populate_drop_down(coldropdown, colheaders, true);
});


// when textarea has text then hide from file option
$(document.body).on('input propertychange', '.describe-textarea', async function(){  
    if ($(this).val() === ''){
        if ($(this).closest('.describe-textarea-div-wrap').index() === 0){
            $('#extractusefile').show();
        } 
    }
    else{
        $('#describe-data-extract').find('.or-separator').hide();
        $('#extractusefile').hide();
        document.getElementById('submit-extract-wrap').style.display = 'block';
    }
});

// when first col selected display build algo button
$(document.body).on('click', '#first-col_ul li a', async function(){
    document.getElementById('submit-extract-wrap').style.display = 'block';
});

// when dropdowns used grey out from file option
$(document.body).on('click', '#extractfromdescribe .dropdown li a', async function(){  
    $('#extractinputfile_ul').parents(".dropdown").find('.btn').html('Use Input File:');
    $('#extractinputfile_ul').parents(".dropdown").find('.btn').addClass('disabled');
});


$(document.body).on('click', '#extract-descriptions, #extract-descriptions > textarea', async function(){   
    $('#extractinputfile_ul').parents(".dropdown").find('.btn').html('Use Input File:');
    var text_boxes = document.getElementsByClassName('describe-textarea');
    for (var i=0;i<text_boxes.length;i++){
        text_boxes[i].classList.remove('gently-blur');
    }
    $('#extract-descriptions').find('.btn').removeClass('disabled');
    document.getElementById('extract-from-file-column-drop').style.display = 'none';
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
}

 // file input: when primary file is selected hide dropdown + hide header + print selection
 $(document.body).on('click', '#primaryfile_ul li' ,async function(){ 
    hide_containers(2);
    document.getElementById('primaryfiledrop').style.display = 'none'; // file selection dropdown 
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

$(document.body).on('click', '#matchprimarycol_ul li' , async function(){ 
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
    //await add_to_carousel('', input_color , ['add_linebreak_to_carousel()'], true, false);
}


// describe data to be extracted menu show
async function describe_data_extract(){
    await add_to_carousel(['Describe the data to be extracted:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false); 
    await add_to_carousel(['Rows that contain these values will be extracted.'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, false); 
    document.getElementById('describe-data-extract').style.display = 'block';
    
}


// when file selected show column dropdown
// FIX THIS id is too broad - effects every dropdown
$(document.body).on('click', '#extractinputfile_ul li a' ,function(){
    var selectedfile = $(this).text();
    var colheaders = get_col_headers_for_filename(selectedfile);
    populate_drop_down("#extractinputcol_ul", colheaders, true);
    document.getElementById('extract-from-file-column-drop').style.display = 'inline-block';
});


$(document.body).on('click', '.dropdown-menu.datasel li a' ,function(){
    var selectedfile = $(this).text();
    var colheaders = get_col_headers_for_filename(selectedfile);
    var closest_col = $(this).closest('.describe-textarea-div-wrap').find('.dropdown-menu.colsel');
    console.log(closest_col)
    console.log(colheaders)
    populate_drop_down(closest_col, colheaders, true);
});


// when add condition is clicked
$(document.body).on('click', '#add-describe-text' ,function(){
    $('.describe-textarea-div-wrap').eq(0).clone().appendTo('#extract-descriptions')
    var newparent = $('.describe-textarea-div-wrap:last');
    newparent.find('.btn').eq(1).text('Select Dataset');
    newparent.find('.btn').eq(2).text('Select Column');
    newparent.find('.btn').eq(3).text('Equals');
    newparent.find('textarea').val('');
});

$(document.body).on('click', '#next-describe-extract' ,async function(){
    var file_or_input = 'file';
    var search_file = 'none';
    hide_containers(2)
    document.getElementById('describe-data-extract').style.display = 'none';
    document.getElementById('extract-from-file-column-drop').style.display = 'none';
    descriptions = document.getElementsByClassName('describe-textarea');
    await add_to_carousel('\xa0\xa0\xa0' + 'Values to extract:', input_color, [null], true, false);
    if (descriptions[0].classList.contains('gently-blur')){
        var filename = document.getElementById('extractinputfile_ul').closest('.dropdown').querySelector('.btn').firstChild.data;
        var columnname = document.getElementById('extractinputcol_ul').closest('.dropdown').querySelector('.btn').firstChild.data;
        await add_to_carousel('\xa0\xa0\xa0' + '\xa0\xa0\xa0' + '$\xa0' + 'FILE: ' + filename, input_color, [null], true, false);
        await add_to_carousel('\xa0\xa0\xa0' + '\xa0\xa0\xa0' + '$\xa0' + 'SHEET: ' + columnname, input_color, [null], true, false);
        search_file = filename;
    }
    else{
        file_or_input = 'input';
        for (var i=0;i<descriptions.length;i++){
            description = descriptions[i].value;
            await add_to_carousel('\xa0\xa0\xa0' + '\xa0\xa0\xa0' + '$\xa0' + description, input_color, [null], true, false);
        }
    }
    where_to_search(file_or_input, search_file);
});


$(document.body).on('click', '#extractfrom-addfile' ,async function(){
    if ($('#second-extractfrom').css('display') === 'none'){
        document.getElementById('second-extractfrom').style.display = 'flex';
    }
    else if($('#third-extractfrom').css('display') === 'none'){
        document.getElementById('third-extractfrom').style.display = 'flex';
        document.getElementById('extractfrom-addfile').style.display = 'none';
    }
}); 

// where in other files to find values to extract
async function where_to_search(file_or_input, search_file){
    var table_array = user_tables_as_array_with_brackets();
    await add_to_carousel('Where to search for values from ' + search_file + ':', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    document.getElementById('findwherewrap').style.display = 'block';
    document.getElementById('first-extractfrom').style.display = 'flex'; 
    populate_drop_down('#first-file_ul', table_array, true);
    populate_drop_down('#second-file_ul', table_array, true);
    populate_drop_down('#third-file_ul', table_array, true);
}


$(document.body).on('click', '.dropdown.extractfrom.dataset li a' ,async function(){
    var selectedfile = this.firstChild.data;
    var colheaders = get_col_headers_for_filename(selectedfile);
    var extractfrom_col_ul = $(this).closest('.extract-from-file').find('.dropdown.extractfrom.col').find('ul');
    populate_drop_down(extractfrom_col_ul, colheaders, true);
    // extract from make column visible after selecting file
    $(this).closest('.extract-from-file').find('.dropdown.extractfrom.col').css("display", "flex");
}); 


// if adjust header column button is clicken when describing where to search for values to extract
$(document.body).on('click', '#data2_adj_col_header' ,async function(){
    document.getElementById('data2_adj_col_header').style.display = 'none';
    document.getElementById('colselecttablediv2').style.display = 'block';
});


// check all dropdowns populated
function check_dropdowns_populated(){
    if ($('#extractfromdescribe').is(":visible")){
        var conditions = $('#extract-descriptions').find('.describe-textarea-div-wrap');
        for (var i=0;i<conditions.length;i++){
            if ($(conditions[i]).find('.dropdown.show.inline').eq(0).find('.btn').text().includes('Select Dataset')){
                $('.warning-box-wrapper').show();
                $('#warningtext').text('You need to select a dataset for each of your described values');
                return false;
            }
            if ($(conditions[i]).find('.dropdown.show.inline').eq(1).find('.btn').text().includes('Select Dataset')){
                $('.warning-box-wrapper').show();
                $('#warningtext').text('You need to select a column for each of your described values');
                return false;
            }  
        }
        return true;
    }
    else{
        console.log('warnings from file')
        var from_file_drops = $('#extractusefile').find('.extract-from-file');
        for (var i=0;i<from_file_drops.length;i++){
            if ($(from_file_drops[i]).is(":visible")){
                var btns = $(from_file_drops[i]).find('.btn');
                for (var j=0;j<btns.length;j++){
                    if ($(btns[j]).text().includes('Select Dataset') || $(btns[j]).text().includes('Select Column')){
                        $('.warning-box-wrapper').show();
                        $('#warningtext').text('You need to select a dataset and column');
                        return false;
                    }
                }
            }
        }
        return true;
    }    
}


$(document.body).on('click', '#submit-extract' ,async function(){
    if(check_dropdowns_populated()){
        $('.warning-box-wrapper').hide();
        $('#submit-extract').hide();
        $('#extractspinner').show();
        extract_params = collect_extract_parameters();
        submit_extract_algo_parameters(extract_params);
    }
});

function collect_describe_values(){
    var describe_values = [];
    var describe_value_elems = $('#extract-descriptions').find('.describe-textarea-div-wrap');
    console.log(describe_value_elems)
    console.log(typeof describe_value_elems)
    describe_value_elems.each(function(idx, elem) {
        //var andor = $(elem).find('.btn').eq(0).text();
        var andor = 'And'
        var dataset = $(elem).find('.btn').eq(1).text();
        var col = $(elem).find('.btn').eq(2).text();
        var condition = $(elem).find('.btn').eq(3).text()
        var textval = $(elem).find('textarea').eq(0).val();
        var andtextval = $(elem).find('textarea').eq(1).val();
        describe_values.push([andor, dataset, col, condition, textval, andtextval]);
    });
    return describe_values;
}

function collect_search_where(){
    var findwhere = [];
    var first_file = $('#first-extractfrom').find('.dropdown').eq(0).find('.btn').text();
    var first_col = $('#first-extractfrom').find('.dropdown').eq(1).find('.btn').text();
    findwhere.push([first_file, first_col]);
    if ($('#second-extractfrom').css("display") !== 'none'){
        var second_file = $('#second-extractfrom').find('.dropdown').eq(0).find('.btn').text();
        var second_col = $('#second-extractfrom').find('.dropdown').eq(1).find('.btn').text();
        findwhere.push([second_file, second_col]);
    }
    if ($('#third-extractfrom').css("display") !== 'none'){
        var third_file = $('#third-extractfrom').find('.dropdown').eq(0).find('.btn').text();
        var third_col = $('#third-extractfrom').find('.dropdown').eq(1).find('.btn').text();
        findwhere.push([third_file, third_col]);
    }
    if ($('#third-extractfrom').css("display") !== 'none'){
        var fourth_file = $('#fourth-extractfrom').find('.dropdown').eq(0).find('.btn').text();
        var fourth_col = $('#fourth-extractfrom').find('.dropdown').eq(1).find('.btn').text();
        findwhere.push([fourth_file, fourth_col]);
    }
    return findwhere;
}

// collect algorithm parameters
function collect_extract_parameters(){
    var describevalues = JSON.stringify(collect_describe_values());
    var extractfilename = $('#extractinputfile_ul').parents(".dropdown").find('.btn').text();
    var extractcolname = $('#extractinputcol_ul').parents(".dropdown").find('.btn').text();
    var findfile1 =  $('#first-file_ul').closest('.dropdown').find('.btn').text();
    var findcol1 =  $('#first-col_ul').closest('.dropdown').find('.btn').text();
    var findfile2 =  $('#second-file_ul').closest('.dropdown').find('.btn').text();
    var findcol2 =  $('#second-col_ul').closest('.dropdown').find('.btn').text();
    var findfile3 =  $('#third-file_ul').closest('.dropdown').find('.btn').text();
    var findcol3 =  $('#third-col_ul').closest('.dropdown').find('.btn').text();
    //var findfile4 =  $('#fourth-file_ul').closest('.dropdown').find('.btn').text();
    //var findcol4 =  $('#fourth-col_ul').closest('.dropdown').find('.btn').text();
    var input_or_description = '';
    if(extractfilename === 'Use Input File:'){
        input_or_description = 'describe';
    }
    else{
        input_or_description = 'input';
    }
    //var search_where = collect_search_where();
    var extract_params_map = {
                                describevalues: describevalues,
                                extractfilename: extractfilename,
                                extractcolname: extractcolname,
                                input_or_description: input_or_description,
                                findfile1: findfile1,
                                findcol1: findcol1,
                                findfile2: findfile2,
                                findcol2: findcol2,
                                findfile3: findfile3,
                                findcol3: findcol3,
                                //findfile4: findfile4,
                                //findcol4: findcol4
                            };
    return extract_params_map;
}

async function display_extract_params(extract_params){
    hide_containers(2);
    document.getElementById('describe-data-extract').style.display = 'none';
    console.log('extract params')
    console.log(extract_params)
    console.log(extract_params['input_or_description'])
    console.log(extract_params['describevalues'])
    if (extract_params['input_or_description'] === 'input'){
        await add_to_carousel('Search using input file:', standard_color, [null], true, true);
        await add_to_carousel('\xa0\xa0\xa0File: ' + JSON.stringify(extract_params['extractfilename']), input_color, [null], true, true);
        await add_to_carousel('\xa0\xa0\xa0Column: ' + JSON.stringify(extract_params['extractcolname']), input_color, [null], true, true);
        await add_to_carousel('Search in:', standard_color, [null], true, true);
        await add_to_carousel('\xa0\xa0\xa0$ ' + JSON.stringify(extract_params['findfile1']) + ' - ' + JSON.stringify(extract_params['findcol1']), second_color, [null], true, true);
        if (!JSON.stringify(extract_params['findfile2']).includes('Select Dataset')){
            await add_to_carousel('\xa0\xa0\xa0$ ' + JSON.stringify(extract_params['findfile2']) + ' - ' + JSON.stringify(extract_params['findcol2']), second_color, [null], true, true);
        }
        if (!JSON.stringify(extract_params['findfile3']).includes('Select Dataset')){
            await add_to_carousel('\xa0\xa0\xa0$ ' + JSON.stringify(extract_params['findfile3']) + ' - ' + JSON.stringify(extract_params['findcol3']), fourth_color, [null], true, true);
        }
    }
    else{
        await add_to_carousel('\xa0\xa0\xa0Search for values:', input_color, [null], true, true);
        var desc_arr = JSON.parse(extract_params['describevalues'])
        console.log(typeof desc_arr)
        console.log(desc_arr[0])
        for (var i=0;i<desc_arr.length; i++){
            var desc_val = desc_arr[i]
            console.log('descval')
            console.log(desc_val)
            await add_to_carousel('\xa0\xa0\xa0\xa0\xa0\xa0$' + desc_val, input_color, [null], true, true);
        }
    }
}


// when between selected show second textarea
$(document.body).on('click', '#extract-descriptions .describe-textarea-div-wrap .dropdown.show.inline.describeaction li a' ,async function(){
    if ($(this).text().includes('Between')){
        $(this).closest('.describe-textarea-div-wrap').find('.inline.btmmargin.andtextareawrap').css('display', 'inline-block');
    }
    else{
        $(this).closest('.describe-textarea-div-wrap').find('.inline.btmmargin.andtextareawrap').css('display', 'none');
    }
});



async function display_extract_result_table(data){
    $('#extractspinner').hide();
    await display_extract_params(extract_params);
    populate_table_element('nosheetname', 0, 'result_table_tbody', data);
    await add_to_carousel('Algorithm Result:', fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, true);
    document.getElementById('resultbox_div').style.display = 'block';
    // await clear_global_variables();  
}