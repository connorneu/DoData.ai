async function start_reconcile(){
    populate_file_names();
    await add_to_carousel(['Select files to reconcile:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    document.getElementById('reconcilefiles').style.display = 'block';
    center_match_columns();
    populate_drop_down('.dropdown-menu.reco-file', unique_file_names, true);
}

function center_match_columns(){
    var left_parent = document.getElementById("reco-first-file");
    var right_parent = document.getElementById("reco-second-file");
    var left_children = document.getElementsByClassName("dropdown nohide matchcol-left");
    var right_children = document.getElementsByClassName("dropdown nohide matchcol-right");
    var leftPos = left_parent.getBoundingClientRect();
    var rightPos = right_parent.getBoundingClientRect();
    for (var i=0;i<left_children.length;i++){
        console.log('here')
        var left_child_pos = left_children[i].getBoundingClientRect();
        var right_child_pos = right_children[i].getBoundingClientRect();
        left_children[i].style.left = (leftPos.left - left_child_pos.left) + ((leftPos.width - left_child_pos.width) / 2)   + "px";
        right_children[i].style.left = (rightPos.left - right_child_pos.left) + ((rightPos.width - right_child_pos.width) / 2)   + "px";
    }
}

$(document.body).on('click', '.dropdown-menu.reco-file' ,async function(){ 
    var selected_file = $(this).parents(".dropdown").find('.btn').text();
    var sheet_names = get_file_sheets(selected_file);
    var sheet_dropdown = $(this).closest('.select-reconcile-file').find('.dropdown-menu.reco-sheet');
    populate_drop_down(sheet_dropdown, sheet_names, true);
    $(sheet_dropdown).parents(".dropdown").find('.btn').text(sheet_names[0]);
    var filenum = $(this).closest('.reco-file-select-wrap').find('h2').html();
    if (filenum==='First File'){
        var col_selection = $(this).closest('.algo-path-wraper').find('.dropdown.nohide.matchcol-left').find('.dropdown-menu.col-select');
    }
    else{
        var col_selection = $(this).closest('.algo-path-wraper').find('.dropdown.nohide.matchcol-right').find('.dropdown-menu.col-select');
    }
    var selected_file = $(this).parents(".dropdown").find('.btn').text();
    var selected_sheet = $(this).closest('.select-reconcile-file').find('.dropdown-menu.reco-sheet').parents(".dropdown").find('.btn').text();
    var filename_index = get_file_name_index(selected_file + ' {' + selected_sheet + '}');
    populate_table_element(selected_sheet, filename_index, 'data' + String(filename_index) + '_tableid');
    var createTable_values = get_createTable_by_index(filename_index);
    var col_headers = createTable_values[0];
    populate_drop_down(col_selection, col_headers, true);
}); 

$(document.body).on('click', '#reco-add-match' ,async function(){ 
    var colmatch_parent = document.getElementById("reco-all-cols-to-match");
    var clone_match = colmatch_parent.getElementsByClassName('reco-col-match')[0].cloneNode(true);
    colmatch_parent.appendChild(clone_match);

}); 

function collect_reco_params(){
    var file_selections = document.getElementsByClassName('reco-file-select-wrap');
    var first_file = $('.reco-file-select-wrap').eq(0).find('.select-reconcile-file').find('.dropdown-menu.reco-file').parents(".dropdown").find('.btn').text();
    var first_sheet = $('.reco-file-select-wrap').eq(0).find('.select-reconcile-file').find('.dropdown-menu.reco-sheet').parents(".dropdown").find('.btn').text();
    var second_file = $('.reco-file-select-wrap').eq(1).find('.select-reconcile-file').find('.dropdown-menu.reco-file').parents(".dropdown").find('.btn').text();
    var second_sheet = $('.reco-file-select-wrap').eq(0).find('.select-reconcile-file').find('.dropdown-menu.reco-sheet').parents(".dropdown").find('.btn').text();
    var matching_cols = $('#reco-all-cols-to-match').find('.reco-col-match');
    var cols_to_match = [];
    for (var i=0;i<matching_cols.length;i++){
        var matching_values = $(matching_cols[i]).find('.dropdown-menu.col-select');
        cols_to_match.push([$(matching_values[0]).parents(".dropdown").find('.btn').text(), $(matching_values[1]).parents(".dropdown").find('.btn').text()]);
    }  
    var reco_params_map = {
        first_file: first_file,
        first_sheet : first_sheet,
        second_file : second_file,
        second_sheet : second_sheet,
        cols_to_match : cols_to_match
    }; 
    return reco_params_map;
}

$(document.body).on('click', '#submit-reco' , function(){ 
    var reco_params_map = collect_reco_params();
    submit_reco_algo_parameters(reco_params_map);
}); 

async function display_reconcile_result_table(){
    hide_containers(1)
    document.getElementById('reconcilefiles').style.display = 'none';
    populate_table_element('nosheetname', 0, 'result_table_tbody', data);
    await add_to_carousel(['Algorithm Result:'], fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    document.getElementById('resultbox_div').style.display = 'block';
}