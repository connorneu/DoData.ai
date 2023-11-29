clean_first_join = null;
joins_data = [];

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
    //document.getElementById('combinehowwrap').style.display = 'block';
    document.querySelectorAll(".combinewrap").forEach(a=>a.style.display = "block");
    // first file first join
    populate_drop_down('.joinfile.dropdown-menu', unique_file_names, true);
    clean_first_join = document.getElementsByClassName('join-two-files')[0].cloneNode(true);
    
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

$(document.body).on('click', '#addjoin' ,function(){
    var num_joins = $('.join-two-files').length;
    if (num_joins <= 3){
        var parent_div = document.getElementsByClassName('combinewrap')[1];
        parent_div.appendChild(clean_first_join);
    }
    else{
        document.getElementById('addjoin').style.display = 'none';
    }
});

$(document.body).on('click', '#nextafterjoin' ,function(){
    //hide_containers(2);
    document.getElementsByClassName('combinewrap')[1].style.display = 'none';
    document.getElementById('joinbtnswrap').style.display = 'none';
    write_strings = collect_joins();
    var parentwrap = document.getElementById('combinehowwrap');
    parentwrap.querySelector('.submit-algo-buttons').style.display = 'block';
    write_joins(write_strings);
});

function collect_joins(){
    write_strings = [];
    var joins = $('.join-two-files');
    for (var i = 0; i<joins.length;i++){
        var jointype = $(joins[i]).find('.joinaction.dropdown-menu').parents(".dropdown").find('.btn').text();
        var first_file = $(joins[i]).find('.joinfile.dropdown-menu:first').parents(".dropdown").find('.btn').text();
        var first_sheet = $(joins[i]).find('.joinsheet.dropdown-menu:first').parents(".dropdown").find('.btn').text();
        var first_col = $(joins[i]).find('.joincol.dropdown-menu:first').parents(".dropdown").find('.btn').text();
        var second_file = $(joins[i]).find('.joinfile.dropdown-menu:eq(1)').parents(".dropdown").find('.btn').text();
        var second_sheet = $(joins[i]).find('.joinsheet.dropdown-menu:eq(1)').parents(".dropdown").find('.btn').text();
        var second_col = $(joins[i]).find('.joincol.dropdown-menu:eq(1)').parents(".dropdown").find('.btn').text()   ;
        write_strings.push(jointype + ': ' + first_file + ' {' + first_sheet + '} & ' + second_file + ' {' + second_sheet + '}');
        write_strings.push('\xa0\xa0\xa0$ ' + 'Column: ' + first_col + ', ' + second_col);
        joins_data.push([jointype, first_file, first_sheet, first_col, second_file, second_sheet, second_col]);    
    }
    console.log(write_strings)
    return write_strings;
}

async function write_joins(write_strings){
    for(var i = 0; i<write_strings.length; i++){
        await add_to_carousel(write_strings[i], input_color, [null], true, false);
    }
}

$(document.body).on('click', '#submit-merge' ,function(){
    submit_combine_algo_parameters('combine_merge', joins_data);
});

async function display_combine_result_table(data){
    document.getElementById('combinehowwrap').style.display = 'none';
    populate_table_element('nosheetname', 0, 'result_table_tbody', data);
    await add_to_carousel(['Algorithm Result:'], fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    document.getElementById('resultbox_div').style.display = 'block';
}