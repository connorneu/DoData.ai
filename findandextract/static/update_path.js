

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

});

$(document.body).on('click', '.updatefile.dropdown-menu' ,async function(){ 
    var selected_file = $(this).parents(".dropdown").find('.btn').text();
    var sheet_names = get_file_sheets(selected_file);
    var sheet_dropdown = $(this).closest('.update-parent-wrap').find('.updatesheet.dropdown-menu');
    populate_drop_down(sheet_dropdown, sheet_names, true);
    $(sheet_dropdown).parents(".dropdown").find('.btn').text(sheet_names[0]);
    var col_find = $(this).closest('.update-parent-wrap').find('.updatecol.dropdown-menu.findcol');
    var col_update = $(this).closest('.update-parent-wrap').find('.updatecol.dropdown-menu.updatedcol');
    populate_file_names();
    var selected_file = $(this).parents(".dropdown").find('.btn').text();
    var selected_sheet = $(this).closest('.update-parent-wrap').find('.updatesheet.dropdown-menu').parents(".dropdown").find('.btn').text();
    var filename_index = get_file_name_index(selected_file + ' {' + selected_sheet + '}');
    populate_table_element(selected_sheet, filename_index, 'data' + String(filename_index) + '_tableid');
    var createTable_values = get_createTable_by_index(filename_index);
    var col_headers = createTable_values[0];
    populate_drop_down(col_find, col_headers, true);
    populate_drop_down(col_update, col_headers, true);
}); 


$(document.body).on('click', '#nextafter_define_update_file' ,async function(){ 
    hide_containers(1);
    //document.getElementById('update_file_wrap').style.display = 'none';
    document.getElementById('update_this_file_wrap').style.display = 'flex';
    await add_to_carousel(['Select files to update:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    
    //var selected_file = $(this).closest('.update-parent-wrap').find('.updatefile.dropdown-menu').parents(".dropdown").find('.btn').text();
    //var selected_sheet = $(this).closest('.update-parent-wrap').find('.updatesheet.dropdown-menu').parents(".dropdown").find('.btn').text();
    //console.log('here')
    //console.log(selected_file, selected_sheet)
    //var col_headers = populate_table_element_from_selected_file(selected_file, selected_sheet)
    //var match_col_dropdown = $(this).closest('.flex-items-wrap ').find('.dropdown-menu.match');
    //populate_drop_down(match_col_dropdown, col_headers, true);
    //var update_col_dropdown = $(this).closest('.flex-items-wrap ').find('.dropdown-menu.update');
    //populate_drop_down(update_col_dropdown, col_headers, true);
}); 

