clean_first_update_file = null;

async function start_update_file(){
    await add_to_carousel(['Choose how to update your files:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    document.getElementById('update_file_or_input').style.display = 'block';

}

 // select merge
 $(document.body).on('click', '#update_file' ,async function(){ 
    hide_containers(3);
    await add_to_carousel('', 'white', ['add_linebreak_to_carousel()'], true, false);
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
}); 


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

