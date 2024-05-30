clean_first_join = null;
joins_data = [];

// skipping append for now - only merge

async function start_combine_file(){
    hide_containers(2);
    document.getElementById('edit-data-tables').style.display = "none";
    //await add_to_carousel('Choose how to combine your files:', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, true);
    //document.getElementById('merge_or_append').style.display = 'block';
    await add_to_carousel('Combine datasets', input_color, [null], true, true);
    how_to_join(); 
}

 // select merge
 $(document.body).on('click', '#user_merge' ,async function(){ 
    hide_containers(2);
    await add_to_carousel('Merge datasets', input_color, [null], true, true);
    document.getElementById('merge_or_append').style.display = 'none';
    how_to_join();  
});

// select append
$(document.body).on('click', '#user_append' ,function(){ 
    hide_containers(2);
    add_to_carousel('Append datasets', input_color, [null], true, false);
    document.getElementById('merge_or_append').style.display = 'none';

});


// sheets and columns to join each dataset (same function alsmost as Extract: where_to_search())
async function how_to_join(){
    await add_to_carousel('Select columns containing values to search for:', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, true);
    await add_to_carousel('The rows from both datasets will be combined into one file where the values match', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    populate_file_names();
    //document.getElementById('combinehowwrap').style.display = 'block';
    document.getElementById('merge-description').style.display = 'block';   
    document.querySelectorAll(".combinewrap").forEach(a=>a.style.display = "block");
    // first file first join
    populate_drop_down('.joinfile.dropdown-menu', dataset_names, true);
    clean_first_join = document.getElementsByClassName('join-two-files')[0].cloneNode(true);
}

async function how_to_append(){
    await add_to_carousel(':', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, true);
    await add_to_carousel('', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    populate_file_names();
    document.getElementById('append-description').style.display = 'block';
}




// pop sheets
/*
$(document.body).on('click', '.joinfile.dropdown-menu' ,function(){
    var num_joins = $('.join-two-files').length;
    var first_selected_file = $(this).parents(".dropdown").find('.btn').text();
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


$(document.body).on('click', '.joinfile.dropdown-menu' ,function(){
    var filename_index = get_file_name_index(first_selected_file + ' {' + sheet_names[0] + '}') // return num 1-4 representing file number (primary, secondary, etc.)
    populate_table_element(sheet_names[0], filename_index, 'data' + String(filename_index) + '_tableid'); // populate table to populate CreateTable values which has column headers
    var col_dropdown = $(this).closest('.joined-file').find('.joincol.dropdown-menu');
    var createTable_values = get_createTable_by_index(filename_index);
    var col_headers = createTable_values[0];
    populate_drop_down(col_dropdown, col_headers, true);
    $(this).closest('.joined-file').find('.joincol.dropdown-menu').parents(".dropdown").find('.btn').text('Select Column'); // select column default
});
*/

$(document.body).on('click', '.joinfile.dropdown-menu li a' ,function(){
    var selectedfile = $(this).text();
    var colheaders = get_col_headers_for_filename(selectedfile);
    var closest_col_drop = $(this).closest('.joined-file').find('.joincol.dropdown-menu')
    populate_drop_down(closest_col_drop, colheaders, true);
});


$(document.body).on('click', '#addjoin' ,function(){
    var num_joins = $('.join-two-files').length;
    $('.join-two-files').eq(0).clone().appendTo('#combine_items');
    var new_elem = $('.join-two-files').eq(num_joins);
    $(new_elem).find('.dropdown.flexdropdown.selectfile').eq(0).find('.btn').addClass('disabled');
    $(new_elem).find('.dropdown.flexdropdown.selectfile').eq(1).find('.btn').text('Select Dataset');
    $(new_elem).find('.dropdown.flexdropdown.selectcolumn').find('.btn').text('Select Column');
    $(new_elem).find('dropdown.condition-dropdown-col.flexdropdown.action').find('.btn').text('Inner Join');
    if (num_joins > 2){
        document.getElementById('addjoin').style.display = 'none';
    }
});

$(document.body).on('click', '.joined-file > .dropdown.flexdropdown.selectcolumn li a' ,function(){
    var col_dropdown_index = $(this).closest('.joined-file').index();
    if (col_dropdown_index > 0){
        var parentwrap = document.getElementById('combinehowwrap');
        parentwrap.querySelector('.submit-algo-buttons').style.display = 'block';
    } 
});

function collect_joins(){
    write_strings = [];
    var joins = $('.join-two-files');
    for (var i = 0; i<joins.length;i++){
        var jointype = $(joins[i]).find('.joinaction.dropdown-menu').parents(".dropdown").find('.btn').text();
        var first_file = $(joins[i]).find('.joinfile.dropdown-menu:first').parents(".dropdown").find('.btn').text();
        var first_col = $(joins[i]).find('.joincol.dropdown-menu:first').parents(".dropdown").find('.btn').text();
        var second_file = $(joins[i]).find('.joinfile.dropdown-menu:eq(1)').parents(".dropdown").find('.btn').text();
        var second_col = $(joins[i]).find('.joincol.dropdown-menu:eq(1)').parents(".dropdown").find('.btn').text()   ;
        write_strings.push(jointype + ': ' + first_file);
        write_strings.push(jointype + ': ' + second_file);
        write_strings.push('\xa0\xa0\xa0$ ' + first_col + ', ' + second_col);
        joins_data.push([jointype, first_file, [first_col], second_file, [second_col]]);    
    }
    return write_strings;
}

async function write_joins(write_strings){
    for(var i = 0; i<write_strings.length; i++){
        var writecolor = write_color(i)
        await add_to_carousel(write_strings[i], writecolor, [null], true, false);
    }
}

// dont show add join button until first file selected
$(document.body).on('click', '.joined-file.leftside .dropdown.flexdropdown.selectfile li a' ,async function(){
    $('#joinbtnswrap').show();
});


// warnings
function check_for_combine_warnings(){
    var joined_files = $('#combine_items').find('.joined-file').find('.dropdown');
    for (var i=0;i<joined_files.length;i++){
        if ($(joined_files[i]).text().includes('Select Dataset') || $(joined_files[i]).text().includes('Select Column')){
            $('.warning-box-wrapper').show();
            $('#warningtext').text('You need to select a dataset and column');
            return false;
        }
    }
    return true;
}


$(document.body).on('click', '#submit-merge' ,async function(){
    if (check_for_combine_warnings()){
        $('.warning-box-wrapper').show();
        hide_containers(2);
        $('#combinehowwrap').hide();
        $('#submit-merge').hide();
        document.getElementsByClassName('combinewrap')[1].style.display = 'none';
        document.getElementById('joinbtnswrap').style.display = 'none';
        write_strings = collect_joins();
        await write_joins(write_strings);
        submit_combine_algo_parameters('combine_merge', joins_data);
    }
});

async function display_combine_result_table(data){
    console.log('displaying cmobination _result')
    document.getElementById('combinehowwrap').style.display = 'none';
    populate_table_element('nosheetname', 0, 'result_table_tbody', data);
    console.log('populated tabl3')
    await add_to_carousel('Algorithm Result:', fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    document.getElementById('resultbox_div').style.display = 'block';
}