async function start_calculate_path(){
    hide_containers(2);
    document.getElementById('edit-data-tables').style.display = "none";
    var table_array = user_tables_as_array_with_brackets();
    $('#calc-first-file').closest('.dropdown').find('.btn').text(table_array[0]);
    await add_to_carousel('Define what to calculate:', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    document.getElementById('calculate-wrap').style.display = 'block';
    
}

// when action is selected
$(document.body).on('click', '.dropdown.show.action.flexy > ul li a' ,async function(){
    console.log("aciton")
    if ($('#calculate-select-file').css('display') === 'none'){
        populate_group_by_options();
    }
    //var table_array = user_tables_as_array_with_brackets();
    //populate_drop_down('#calc-first-file', table_array, true);
    document.getElementById('calculate-select-file').style.display = 'block';

    // show add button
    var num_actions = $('.dropdown.show.action').length;
    if(num_actions < 5){
        $('#calc-addaction').css("display", "block");
    }
    else{
        $('#calc-addaction').css("display", "none");
    }

    // relate action to action sentence 
    var action_index_rev = $(this).closest('.dropdown.show.action.flexy').index();
    var action_index = num_actions - action_index_rev;
    var calc_sents = $('.calc-col-select');
    // if index of action is greater than current senteces then create new sentence else change sentece
    console.log('action index: ' + action_index +  ' csents: '+ calc_sents.length)
    if (action_index > calc_sents.length){
        console.log('new action')
        calc_sents.eq(0).clone().appendTo('.calc-col-select-wrap');
        var action_val = $(this).text();
        $('.calc-col-select').last().find('.btn').text('Select Column');
        $('.calc-col-select').last().find('h2').eq(0).empty();
        $('.calc-col-select').last().find('h2').eq(0).append('Calculate <b><u>' + action_val + '</b></u> for column:');
    }
    else{
        console.log('oldaction')
        var action_val = $(this).text();
        $('.calc-col-select').eq(action_index-1).find('h2').eq(0).empty();
        $('.calc-col-select').eq(action_index-1).find('h2').eq(0).append('Calculate <b><u>' + action_val + '</b></u> for column:');
    }
});

// when column is selected display submit button
$(document.body).on('click', '.calc-col-select li a' ,async function(){
    $('#submit-calc-wrap').css('display', 'block');
});

//
function populate_group_by_options(){
    var table_array = user_tables_as_array_with_brackets();
    var colheaders = get_col_headers_for_filename(table_array[0]);
    var groupby_elem = $('#calc-group-select').find('.groupby-dropdown').find('ul');
    populate_drop_down(groupby_elem, colheaders, true);
    $('#calc-group-select').css("display", "block");
    add_col_select_for_calc(colheaders);
};

function add_col_select_for_calc(colheaders){
    var actions = $('.calc-actions > .dropdown');
    var num_actions = actions.length;
    console.log('num actions: '+ num_actions)
    for (var i=0;i<actions.length;i++){
        var value = $(actions[i]).find('.btn').text();
        console.log('value: ' + value) 
        var action_col_select_elems = $('#calc-col-select-wrapper').find('.dropdown.nohide.matchcol-right.right-flex-align.col.flex').find('ul');
        populate_drop_down(action_col_select_elems, colheaders, true);
        $('.calc-col-select').css("display", "flex");
        $('#calc-col-select-wrapper').find('.dropdown.nohide.matchcol-right.right-flex-align.col.flex').find('.btn').text('Select Column');
    }
}

// when add action is clicked add action dropdown
$(document.body).on('click', '#calc-addaction' ,async function(){
    $('.dropdown.show.action').eq(0).clone().prependTo('.calc-actions');
    $('.dropdown.show.action').first().find('.btn').text('Choose what to calculate');
    var num_actions = $('.dropdown.show.action').length;
    if(num_actions >= 7){
        $('#calc-addaction').css("display", "none");
    }
});

// when one group by is added show add additional button
$(document.body).on('click', '#calc-groupby-first-ul li a' ,async function(){
    $('#calc-add-groupby').css("display", "flex");
});

// when add group by is clciked show second group
$(document.body).on('click', '#calc-add-groupby' ,async function(){
    var table_array = user_tables_as_array_with_brackets();
    var colheaders = get_col_headers_for_filename(table_array[0]);
    $('#groupbywrap').find('.dropdown').eq(0).clone().appendTo('#groupbywrap');
    $('#groupbywrap').append($('#calc-add-groupby'))
    $('#groupbywrap').find('.dropdown:last').find('.btn').text('Select Column')
    var new_groupby_elem = $('#groupbywrap').find('.dropdown:last').find('ul')
    populate_drop_down(new_groupby_elem, colheaders, true);
    if ($('.dropdown.col.flex.groupby-dropdown').length > 3){
        $('#calc-add-groupby').hide();
    }
});

// when add action is clicked add another calc sentence (calc-col-select)
$(document.body).on('click', '#nothin' ,async function(){
    $('.calc-col-select-wrap').find('.calc-col-select').eq(0).clone().appendTo('.calc-col-select-wrap');
    var last_calc_sent = $('.calc-col-select').last();
    last_calc_sent.find('h2').text('')
});

function collect_calc_params(){
    var file = $('.dropdown.show.flex').find('.btn').text();
    var groups = $('.calc-groupby');
    var group = [];
    for(var i=0;i<groups.length;i++){
        if ($(groups[i]).css('display') == 'flex'){
            group.push($(groups[i]).find('.btn').text())
        }
    }
    var sentences = $('.calc-col-select');
    var actions = [];
    for (var i=0;i<sentences.length;i++){
        var sent = $(sentences[i]).find('h2').text();
        var action = sent.split(' ')[1];
        var action_col = $(sentences[i]).find('.btn').text();
        actions.push([action, action_col]);
    }    
    var calc_params = {
        filename: file,
        groups: group,
        actions: actions
    }
    return calc_params;
}

// when submit button is pressed
$(document.body).on('click', '#submit-calculate' ,async function(){
    calc_params = collect_calc_params();
    console.log(calc_params)
    submit_calc_algo_parameters(calc_params);
});

async function display_calculate_result_table(data){
    hide_containers(1)
    document.getElementById('calculate-wrap').style.display = 'none';
    populate_table_element('nosheetname', 0, 'result_table_tbody', data);
    await add_to_carousel('Algorithm Result:', fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    document.getElementById('resultbox_div').style.display = 'block';
}