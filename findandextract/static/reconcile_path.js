async function start_reconcile(){
    hide_containers(2);
    document.getElementById('edit-data-tables').style.display = 'none';
    populate_file_names();
    await add_to_carousel('Describe how to reconcile both files :', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    document.getElementById('reconcilefiles').style.display = 'block';
    //center_match_columns();
    $('#reco-first-file-wrap').find('.btn').text(dataset_names[0]);
    $('#reco-second-file-wrap').find('.btn').text(dataset_names[1]);
    var colheaders = get_col_headers_for_filename(dataset_names[0]);
    populate_drop_down('#reco-match-col1', colheaders, true);
    var colheaders = get_col_headers_for_filename(dataset_names[1]);
    populate_drop_down('#reco-match-col2', colheaders, true);

    var left_compare_columns = $('#reco-all-cols-to-compare').find('.dropdown').eq(0).find('ul');
    var colheaders = get_col_headers_for_filename(dataset_names[0]);
    populate_drop_down(left_compare_columns, colheaders, true);
    var right_compare_columns = $('#reco-all-cols-to-compare').find('.dropdown').eq(1).find('ul');
    var colheaders = get_col_headers_for_filename(dataset_names[1]);
    populate_drop_down(right_compare_columns, colheaders, true);
}

function center_match_columns(){
    var left_parent = document.getElementById("reco-first-file");
    var right_parent = document.getElementById("reco-second-file");
    var left_children = document.getElementsByClassName("dropdown nohide matchcol-left");
    var right_children = document.getElementsByClassName("dropdown nohide matchcol-right");
    var leftPos = left_parent.getBoundingClientRect();
    var rightPos = right_parent.getBoundingClientRect();
    for (var i=0;i<left_children.length;i++){
        var left_child_pos = left_children[i].getBoundingClientRect();
        var right_child_pos = right_children[i].getBoundingClientRect();
        left_children[i].style.left = (leftPos.left - left_child_pos.left) + ((leftPos.width - left_child_pos.width) / 2)   + "px";
        right_children[i].style.left = (rightPos.left - right_child_pos.left) + ((rightPos.width - right_child_pos.width) / 2)   + "px";
    }
}

/*
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
*/


$(document.body).on('click', '#reco-add-match' ,async function(){ 
    var colmatch_parent = document.getElementById("reco-all-cols-to-match");
    var clone_match = colmatch_parent.getElementsByClassName('reco-col-match')[0].cloneNode(true);
    colmatch_parent.appendChild(clone_match);
    $('#reco-all-cols-to-match').find('.reco-col-match:last').find('.btn').text('Select Column')
    var matches = $('#reco-all-cols-to-match').find('.reco-col-match');
    if (matches.length > 3){
        $('#reco-add-match').hide();
    }
}); 


$(document.body).on('click', '#reco-add-compare' ,async function(){ 
    var colcompareparent = document.getElementById("reco-all-cols-to-compare");
    var clone_comapre = colcompareparent.getElementsByClassName('reco-col-match')[0].cloneNode(true);
    colcompareparent.appendChild(clone_comapre);
    $('#reco-all-cols-to-compare').find('.reco-col-match:last').find('.btn').text('Select Column')
    var matches = $('#reco-all-cols-to-compare').find('.reco-col-match');
    if (matches.length > 3){
        $('#reco-add-compare').hide();
    }
}); 


function collect_reco_params(){
    var first_file = $('#reco-first-file').find('.btn').text();
    var second_file = $('#reco-second-file').find('.btn').text();
    var match_elems = $('#reco-all-cols-to-match').find('.reco-col-match');
    var compare_elems = $('#reco-all-cols-to-compare').find('.reco-col-match');
    var matches = [];
    var compares = [];
    for (var i=0;i<match_elems.length;i++){
        var left_match = $(match_elems[i]).find('.dropdown.nohide.matchcol-left.left-flex-align').find('.btn').text();
        var right_match = $(match_elems[i]).find('.dropdown.nohide.matchcol-right.right-flex-align').find('.btn').text();
        matches.push([left_match, right_match]);
    }
    var compare_elems = $('#reco-all-cols-to-compare').find('.reco-col-match');
    for (var i=0;i<compare_elems.length;i++){
        var left_compare = $(compare_elems[i]).find('.dropdown.nohide.matchcol-left.left-flex-align').find('.btn').text();
        var right_compare = $(compare_elems[i]).find('.dropdown.nohide.matchcol-right.right-flex-align').find('.btn').text();
        compares.push([left_compare, right_compare]);
    }
    var reco_params = {
        first_file: first_file,
        second_file: second_file,
        matches: matches,
        compares: compares
    }
    return reco_params;
}

$(document.body).on('click', '#reco-all-cols-to-compare .dropdown.nohide.matchcol-right.right-flex-align ul' ,function(){
    console.log('founQQd')
    $('#submit-reco').show();
});


$(document.body).on('click', '#submit-reco' , function(){ 
    var reco_params = collect_reco_params();
    submit_reco_algo_parameters(reco_params);
}); 

async function display_reconcile_result_table(data){
    hide_containers(1)
    document.getElementById('reconcilefiles').style.display = 'none';
    populate_table_element('nosheetname', 0, 'result_table_tbody', data);
    await add_to_carousel('Algorithm Result:', fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    document.getElementById('resultbox_div').style.display = 'block';
}