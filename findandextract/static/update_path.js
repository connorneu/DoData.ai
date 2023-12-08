clean_first_update_file = null;

async function start_update_file(){
    await add_to_carousel(['Choose how to update your files:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    document.getElementById('update_file_or_input').style.display = 'block';

}

 // select merge
 $(document.body).on('click', '#update_file' ,async function(){ 
    hide_containers(2);
    await add_to_carousel('', 'white', ['add_linebreak_to_carousel()'], true, false);
    await add_to_carousel('Update: Input File', input_color, [null], true, false);
    document.getElementById('update_file_or_input').style.display = 'none';
    await add_to_carousel(['Select file with updated values:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
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
    document.getElementById('update_file_wrap').style.display = 'none';
    document.getElementById('update_this_file_wrap').style.display = 'block';
    await add_to_carousel(['Select files to update:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);  
}); 

$(document.body).on('click', '#add_file_update' ,async function(){ 
    var wraper = document.getElementById('update_this_file_wrap');
    var parent_div = wraper.getElementsByClassName('update-parent-wrap')[0];
    var num_files_to_update = parent_div.getElementsByClassName('flex-items-wrap').length;
    console.log('nums')
    console.log(num_files_to_update)  
    console.log('ading')
    var cloned_node = clean_first_update_file.cloneNode(true);
    var parent_div = wraper.getElementsByClassName('update-parent-wrap')[0];
    parent_div.appendChild(cloned_node);
    if(num_files_to_update > 3){
        document.getElementById('add_file_update').style.display = 'none';
    }
});

function collect_update_file_parameters(){
    var update_from_file = $('#update_file_wrap').find('.dropdown.flexdropdown.updateflexdropdown').find('.updatefile.dropdown-menu').parents(".dropdown").find('.btn').text();
    var update_from_sheet = $('#update_file_wrap').find('.dropdown.flexdropdown.selectsheet').find('.updatesheet.dropdown-menu').parents(".dropdown").find('.btn').text();
    var update_from_findcol = $('#update_file_wrap').find('.dropdown.flexdropdown.selectcolumn').find('.updatecol.dropdown-menu.findcol').parents(".dropdown").find('.btn').text();
    var update_from_updatecol = $('#update_file_wrap').find('.dropdown.flexdropdown.selectcolumn').find('.updatecol.dropdown-menu.updatedcol').parents(".dropdown").find('.btn').text();
    var update_files_parent = $('#update_this_file_wrap').find('.flex-items-wrap');
    for (var i = 0; i<update_files_parent.length; i++){
        console.log('i' + i)
        var to_update_file = $(update_files_parent[i]).find('.dropdown.flexdropdown.selectcolumn').find('.updatecol.dropdown-menu.updatedcol').parents(".dropdown").find('.btn').text();
        var to_update_sheet = $(update_files_parent[i]).find('.dropdown.flexdropdown.selectsheet').find('.updatesheet.dropdown-menu').parents(".dropdown").find('.btn').text();
        var to_update_findcol = $(update_files_parent[i]).find('.dropdown.flexdropdown.selectcolumn').find('.updatecol.dropdown-menu.findcol').parents(".dropdown").find('.btn').text();
        var to_update_updatecol = $(update_files_parent[i]).find('.dropdown.flexdropdown.selectcolumn').find('.updatecol.dropdown-menu.updatedcol').parents(".dropdown").find('.btn').text();
    }
}

$(document.body).on('click', '#submit-update-file' ,function(){
    collect_update_file_parameters();
    //submit_update_file_algo_parameters('update_file', joins_data);
});