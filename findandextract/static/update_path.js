clean_first_update_file = null;

async function start_update_file(){
    hide_containers(2);
    document.getElementById('edit-data-tables').style.display = 'none';
    populate_drop_down('#updateinputfile_ul', dataset_names, true);
    populate_drop_down('#updatedatasetreplace_ul', dataset_names, true);
    await add_to_carousel('Describe how to update file:', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, true);
    //await add_to_carousel('Use a file containing new values to update a file or enter in values to find and update', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    document.getElementById('update_file_wrap').style.display = 'block';
    document.getElementById('describe-data-upload').style.display = 'block';
   
}

// when file selected show column dropdown
$(document.body).on('click', '#update-from-file-drop li a' ,function(){
    var selectedfile = $(this).text();
    var colheaders = get_col_headers_for_filename(selectedfile);
    populate_drop_down("#updateinputcol_ul", colheaders, true);
    populate_drop_down("#updateinputcolreplace_ul", colheaders, true);
    // when column from how to match - hidden but update
    var when_col_ul = $('#update-where-clauses').find('.dropdown.show.alignbottom').eq(0).find('ul');
    populate_drop_down(when_col_ul, colheaders, true);
    document.getElementById('update-from-file-column-drop').style.display = 'block';
    var when_col_header = $('#update-where-clauses').find('.dropdown.show.alignbottom').eq(0).find('h2');
    $(when_col_header).text(selectedfile);
    //var selectedfile = $(this).text();
    //var colheaders = get_col_headers_for_filename(selectedfile);
    //populate_drop_down("#updatewhencolumn_ul", colheaders, true);
});


// replace with values from dataset -> when dataset selected update column
$(document.body).on('click', '#updatedatasetreplace_ul li a' ,function(){
    var selectedfile = $(this).text();
    var colheaders = get_col_headers_for_filename(selectedfile);
    populate_drop_down("#updatecolreplace_ul", colheaders, true);
    // how to match -> when column equals
    populate_drop_down("#update_equals_this_column_ul", colheaders, true);
    $('#update_equals_datasetname').text(selectedfile);
});


// replace with values from dataset -> when dataset selected update column
$(document.body).on('click', '#add-update-when-cond' ,function(){
    var when_clone = $('#update-where-clauses').find('.flexwrap').eq(0).clone().appendTo($('#update-where-clauses'));
    var when_conds = $('#update-where-clauses').find('.flexwrap');
    for (var i = 0;i<when_conds.length-1;i++){
        $(when_conds[i]).find('.header-update-wrap').remove();
    }
    if (when_conds.length == 4){
        $('#add_update_when').hide();
    }

});

// when column selected for update from dataset -> display how to match
$(document.body).on('click', '#updatecolreplace_ul li a' ,function(){
    document.getElementsByClassName('update_if_from_input')[0].style.display = 'none';
    $('#update-from-what').find('.header-bottomspace').hide();
    $('#update-from-what-text').hide();
    document.getElementById('update-how').style.display = 'block';  
    $('#disabled_update_col_ul').parents(".dropdown").find('.btn').text($('#updateinputcol_ul').parents(".dropdown").find('.btn').text());
});
// when column to update selected -> show where to update from
$(document.body).on('click', '#updateinputcol_ul li a' ,function(){
    document.getElementById('update-from-what').style.display = 'block';
    document.getElementById('update-from-file-column-drop-replace').style.display = 'flex';
});

// blur textboxes when file selected
/*
$(document.body).on('click', '#CCCCupdateinputfile_ul li a' ,async function(){   
    var selected_val = $(this).text();
    if (selected_val != 'Use Input File:'){
        var text_boxes = document.getElementsByClassName('describe-textarea');
        for (var i=0;i<text_boxes.length;i++){
            text_boxes[i].value = '';
            text_boxes[i].classList.add('gently-blur');
        }
    }
});
*/


// when textarea has text then grey dropdown when empty un-grey dropdown
$(document.body).on('focus', '.describe-textarea.specify-value', async function(){  
    console.log('dasehedd')
    $('#updatedatasetreplace_ul').closest(".dropdown").find('.btn').html('Select Dataset');
    $('#updatecolreplace_ul').closest(".dropdown").find('.btn').html('Select Column');
    $('#updatedatasetreplace_ul').closest(".dropdown").find('.btn').addClass('disabled');
    $('#updatecolreplace_ul').closest(".dropdown").find('.btn').addClass('disabled');
});


$(document.body).on('input propertychange', '.describe-textarea.specify-value', async function(){  
    console.log('feeeopls')
    console.log($(this).val().length)
    if ($(this).val().length > 0){
        $('#update-from-what').find('.header-bottomspace').hide();
        $('#update-from-what div').eq(0).hide();
        $('#update-from-what div').eq(1).hide();
        $('#update-from-what div').eq(2).hide();
        console.log('hiding thing')
        $('update-where-clauses').find('.dropdown.show.alignbottom').eq(1).hide();

        //document.getElementsByClassName('update_if_from_input')[0].style.display = 'none';
        $('#update-from-what').find('.header-bottomspace').hide();
        //$('#update-from-what-text').hide();
        ('#update_equals_this_column_ul').closest('.dropdown').find('.btn').hide();
        document.getElementById('update-how').style.display = 'block';  
        $('#disabled_update_col_ul').parents(".dropdown").find('.btn').text($('#updateinputcol_ul').parents(".dropdown").find('.btn').text());

    }
    if ($(this).val().length === 0){
        $('#update-from-what div').eq(0).show();
        $('#update-from-what div').eq(1).show();
        $('#update-from-what div').eq(2).show();
        $('#update-when').hide();
    }
});


$(document.body).on('click', '#updatedatasetreplace_ul li a', async function(){  
    $('#update-from-what-text').find('textarea').addClass('gently-blur');
});

/*
$(document.body).on('click', '#update-descriptions, #update-descriptions > textarea', async function(){   
    $('#updateinputfile_ul').parents(".dropdown").find('.btn').html('Use Input File:');
    var text_boxes = document.getElementsByClassName('describe-textarea');
    for (var i=0;i<text_boxes.length;i++){
        text_boxes[i].classList.remove('gently-blur');
    }
    document.getElementById('update-from-file-column-drop').style.display = 'none';
    document.getElementById('update-from-file-column-drop-replace').style.display = 'none';
});
*/


// when add condition is clicked
/*
$(document.body).on('click', '#add-describe-update-text' ,function(){
    var desc_div_wrap = document.getElementById("update-descriptions");
    var new_text1 = document.createElement("textarea");
    var new_text2 = document.createElement("textarea");
    new_text1.maxLength = "50";
    new_text1.className = "describe-textarea";
    new_text2.maxLength = "50";
    new_text2.className = "describe-textarea";
    var wrapper = document.createElement('div');
    wrapper.append(new_text1);
    wrapper.append(new_text2);
    desc_div_wrap.appendChild(wrapper);
});
*/


 // select merge
 $(document.body).on('click', '#update_file' ,async function(){ 
    hide_containers(3);
    //await add_to_carousel('', 'white', ['add_linebreak_to_carousel()'], true, false);
    await add_to_carousel('Update: Input File', input_color, [null], true, false);
    document.getElementById('update_file_or_input').style.display = 'none';
    await add_to_carousel(['Select file with updated values:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    //await add_to_carousel(['Choose columns with values to find in other files'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, false);
    //await add_to_carousel(['and chose the columns that contain the new values to update the other files with.'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, false);
    document.getElementById('update_file_wrap').style.display = 'block';
    populate_drop_down('.updatefile.dropdown-menu', unique_file_names, true);
    var wraper = document.getElementById('update_this_file_wrap');
    clean_first_update_file = wraper.getElementsByClassName('flex-items-wrap')[0].cloneNode(true);
});

/*
$(document.body).on('click', '.updatefile.dropdown-menu' ,async function(){ 
    var selected_file = $(this).parents(".dropdown").find('.btn').text();
    var sheet_names = get_file_sheets(selected_file);
    var sheet_dropdown = $(this).closest('.flex-items-wrap').find('.updatesheet.dropdown-menu');
    populate_drop_down(sheet_dropdown, sheet_names, true);
    $(sheet_dropdown).parents(".dropdown").find('.btn').text(sheet_names[0]);
    var col_find = $(this).closest('.flex-items-wrap').find('.updatecol.dropdown-menu.findcol');
    var col_update = $(this).closest('.flex-items-wrap').find('.updatecol.dropdown-menu.updatedcol');
    populate_file_names();
    var selected_file = $(this).parents(".dropdown").find('.btn').text();
    var selected_sheet = $(this).closest('.flex-items-wrap').find('.updatesheet.dropdown-menu').parents(".dropdown").find('.btn').text();
    var filename_index = get_file_name_index(selected_file + ' {' + selected_sheet + '}');
    console.log('file:')
    console.log(selected_file + ' | ' + selected_sheet)
    console.log(selected_file)
    populate_table_element(selected_sheet, filename_index, 'data' + String(filename_index) + '_tableid');
    var createTable_values = get_createTable_by_index(filename_index);
    var col_headers = createTable_values[0];
    populate_drop_down(col_find, col_headers, true);
    populate_drop_down(col_update, col_headers, true);
}); */


$(document.body).on('click', '#nextafter_define_update_file' ,async function(){ 
    hide_containers(1);
    add_matching_labels_to_update_files();
    document.getElementById('update_file_wrap').style.display = 'none';
    document.getElementById('update_this_file_wrap').style.display = 'block';
    await add_to_carousel(['Select files to update:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);  
}); 

function add_matching_labels_to_update_files(){
    var update_from_file_param_arr = collect_parameters_from_update_file();
    console.log('params')
    console.log(update_from_file_param_arr)
    for(var a=0;a<2;a++){
        if(a===0){
            var findclass='.updatecol.dropdown-menu.findcol'
            var match_cols = update_from_file_param_arr[2];
        }
        else{
            var findclass='.updatecol.dropdown-menu.updatedcol'
            var match_cols = update_from_file_param_arr[3];
        }
        console.log('findclass ' + findclass)
        $('#update_this_file_wrap').find(findclass).closest('.update-from-column').find('.updatedcol-match-label').html(match_cols[0]);
        if(match_cols.length > 1){
            for(var i=1;i<match_cols.length;i++){
                var parent_match_col = $('#update_this_file_wrap').find(findclass).closest('.update-from-column');
                $(parent_match_col).find('.flexy-dropdown-wrap').eq(0).clone(true).appendTo(parent_match_col);   
                $(parent_match_col).find('.flexy-dropdown-wrap').eq(i).find('.updatedcol-match-label').html(match_cols[i])
            }
        }
    }
}

$(document.body).on('click', '#add_file_update' ,async function(){ 
    var wraper = document.getElementById('update_this_file_wrap');
    var parent_div = wraper.getElementsByClassName('update-parent-wrap')[0];
    var num_files_to_update = parent_div.getElementsByClassName('flex-items-wrap').length;
    console.log('nums')
    console.log(num_files_to_update)  
    console.log('ading')
    //var cloned_node = clean_first_update_file.cloneNode(true);
    var wraper = document.getElementById('update_this_file_wrap');
    cloned_node = wraper.getElementsByClassName('flex-items-wrap')[0].cloneNode(true);
    var parent_div = wraper.getElementsByClassName('update-parent-wrap')[0];
    parent_div.appendChild(cloned_node);
    if(num_files_to_update > 3){
        document.getElementById('add_file_update').style.display = 'none';
    }
});

function collect_update_file_parameters(){
    var update_from_file_param_arr = collect_parameters_from_update_file();
    console.log('from file')
    console.log(update_from_file_param_arr)
    var files_to_update_param_arr = collect_parameters_from_files_to_update();
    console.log('to update')
    console.log(files_to_update_param_arr)
    var update_from_file_map = {update_file_params: update_from_file_param_arr, files_to_update: files_to_update_param_arr};
    return update_from_file_map;
}

function collect_parameters_from_update_file(){
    var update_from_file = $('#update_file_wrap').find('.dropdown.flexdropdown.updateflexdropdown').find('.updatefile.dropdown-menu').parents(".dropdown").find('.btn').text();
    var update_from_sheet = $('#update_file_wrap').find('.dropdown.flexdropdown.selectsheet').find('.updatesheet.dropdown-menu').parents(".dropdown").find('.btn').text();
    var update_from_findcols = [];
    var update_from_findcol = $('#update_file_wrap').find('.dropdown.flexdropdown.selectcolumn').find('.updatecol.dropdown-menu.findcol');
    for(var i=0;i<update_from_findcol.length;i++){
        update_from_findcols.push($(update_from_findcol[i]).parents(".dropdown").find('.btn').text());
    }
    var update_from_updatecols = [];
    var update_from_updatecol = $('#update_file_wrap').find('.dropdown.flexdropdown.selectcolumn').find('.updatecol.dropdown-menu.updatedcol');
    for(var i=0;i<update_from_updatecol.length;i++){
        update_from_updatecols.push($(update_from_updatecol[i]).parents(".dropdown").find('.btn').text());
    }
    var update_from_file_param_arr = [update_from_file, update_from_sheet, update_from_findcols, update_from_updatecols];   
    return update_from_file_param_arr;
}

function collect_parameters_from_files_to_update(){
    var update_files_parent = $('#update_this_file_wrap').find('.flex-items-wrap');
    var files_to_update_param_arr = [];
    for (var i = 0; i<update_files_parent.length; i++){
        var to_update_file = $(update_files_parent[i]).find('.dropdown.flexdropdown.updateflexdropdown').find('.updatefile.dropdown-menu').parents(".dropdown").find('.btn').text();
        var to_update_sheet = $(update_files_parent[i]).find('.dropdown.flexdropdown.selectsheet').find('.updatesheet.dropdown-menu').parents(".dropdown").find('.btn').text();
        var to_update_findcols = [];
        var to_update_findcol = $(update_files_parent[i]).find('.dropdown.flexdropdown.selectcolumn').find('.updatecol.dropdown-menu.findcol');
        for(var j=0;j<to_update_findcol.length;j++){
            //to_update_findcols.push([$(to_update_findcol[j]).closest('.flexy-dropdown-wrap').find(".updatedcol-match-label").html(), $(to_update_findcol[j]).parents(".dropdown").find('.btn').text()]);
            to_update_findcols.push($(to_update_findcol[j]).parents(".dropdown").find('.btn').text());
        }
        var to_update_updatecols = [];
        var to_update_updatecol = $(update_files_parent[i]).find('.dropdown.flexdropdown.selectcolumn').find('.updatecol.dropdown-menu.updatedcol');
        for(var j=0;j<to_update_updatecol.length;j++){
            //to_update_updatecols.push([$(to_update_updatecol[j]).closest('.flexy-dropdown-wrap').find(".updatedcol-match-label").html() , $(to_update_updatecol[j]).parents(".dropdown").find('.btn').text()]);
            to_update_updatecols.push($(to_update_updatecol[j]).parents(".dropdown").find('.btn').text());
        }
        files_to_update_param_arr.push([to_update_file, to_update_sheet, to_update_findcols, to_update_updatecols]);
    }
    return files_to_update_param_arr;
}

$(document.body).on('click', '#submit-update-file' ,function(){
    update_from_file_map = collect_update_file_parameters();
    submit_update_file_algo_parameters('update_file', update_from_file_map);
});

// when btn to add column to match clicked
$(document.body).on('click', '.updatefile-add-match-col' ,function(){
    var num_match_cols = $(this).closest('.update-from-column').find('.updatecol.dropdown-menu.findcol').length;
    $(this).closest('.update-from-column').find('.dropdown.flexdropdown.selectcolumn').eq(0).clone(true).appendTo($(this).closest('.update-from-column'));
    this.closest('.update-from-column').appendChild(this);
    if (num_match_cols >= 3){
        this.style.display = 'none';
    }
});

// when btn to add column to update clicked
$(document.body).on('click', '.updatefile-add-update-col' ,function(){
    var num_match_cols = $(this).closest('.update-from-column').find('.updatecol.dropdown-menu.updatedcol').length;
    $(this).closest('.update-from-column').find('.dropdown.flexdropdown.selectcolumn').eq(0).clone(true).appendTo($(this).closest('.update-from-column'));
    this.closest('.update-from-column').appendChild(this);
    if (num_match_cols >= 3){
        this.style.display = 'none';
    }
});

async function display_update_result_table(data){
    hide_containers(1)
    document.getElementById('update_this_file_wrap').style.display = 'none';
    populate_table_element('nosheetname', 0, 'result_table_tbody', data);
    await add_to_carousel(['Algorithm Result:'], fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    document.getElementById('resultbox_div').style.display = 'block';
}

