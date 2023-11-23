async function start_combine_file(){
    await add_to_carousel(['Choose how to combine your files:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    document.getElementById('merge_or_append').style.display = 'block';
}

 // select merge
 $(document.body).on('click', '#user_merge' ,async function(){ 
    hide_containers(2);
    await add_to_carousel('', 'white', ['add_linebreak_to_carousel()'], true, false);
    await add_to_carousel('Merge datasets', input_color, [null], true, false);
    document.getElementById('merge_or_append').style.display = 'none';
    how_to_join();
});

//select append
$(document.body).on('click', '#user_append' ,function(){ 
    hide_containers(2);
    add_to_carousel('Append datasets', input_color, [null], true, false);
    document.getElementById('merge_or_append').style.display = 'none';

});


// sheets and columns to join each dataset (same function alsmost as Extract: where_to_search())
async function how_to_join(){
    primary_file_name = unique_file_names[0]
    secondary_file_name = unique_file_names[1];
    third_file_name = unique_file_names[2];
    fourth_file_name = unique_file_names[3];
    document.getElementById('combinehowwrap').style.display = 'block';
    // first file first join
    populate_drop_down('.joinfile.dropdown-menu', unique_file_names, true);
    //var clean_clone = document.getElementById('first-join').cloneNode(true);
    
}

function add_join(clean_clone){
    var parent_div = document.getElementById('combinehowwrap');
    parent_div.appendChild(clone_join);
}

// pop sheets
$(document.body).on('click', '.joinfile.dropdown-menu' ,function(){
    var num_joins = $('.join-two-files').length;
    var first_selected_file = $(this).parents(".dropdown").find('.btn').text();
    var sheet_names = get_file_sheets(first_selected_file);
    var sheet_dropdown = $(this).closest('.joined-file').find('.joinsheet.dropdown-menu');
    populate_drop_down(sheet_dropdown, sheet_names, true);
    $(this).closest('.joined-file').find('.joinsheet.dropdown-menu').parents(".dropdown").find('.btn').text(sheet_names[0]); // first sheet as default
    var filename_index = get_file_name_index(first_selected_file + ' {' + sheet_names[0] + '}') // return num 1-4 representing file number (primary, secondary, etc.)
    populate_table_element(sheet_names[0], filename_index, 'data' + String(filename_index) + '_tableid'); // populate table to populate CreateTable values which has column headers
    var col_dropdown = $(this).closest('.joined-file').find('.joincol.dropdown-menu');
    var createTable_values = get_createTable_by_index(filename_index);
    var col_headers = createTable_values[0];
    populate_drop_down(col_dropdown, col_headers, true);
    $(this).closest('.joined-file').find('.joincol.dropdown-menu').parents(".dropdown").find('.btn').text('Select Column'); // select column default
});

$(document.body).on('click', '.joinsheet.dropdown-menu' ,function(){
    var filename_index = get_file_name_index(first_selected_file + ' {' + sheet_names[0] + '}') // return num 1-4 representing file number (primary, secondary, etc.)
    populate_table_element(sheet_names[0], filename_index, 'data' + String(filename_index) + '_tableid'); // populate table to populate CreateTable values which has column headers
    var col_dropdown = $(this).closest('.joined-file').find('.joincol.dropdown-menu');
    var createTable_values = get_createTable_by_index(filename_index);
    var col_headers = createTable_values[0];
    populate_drop_down(col_dropdown, col_headers, true);
    $(this).closest('.joined-file').find('.joincol.dropdown-menu').parents(".dropdown").find('.btn').text('Select Column'); // select column default
});