"use strict";
var calc_params = null;
async function start_calculate_path(){
    hide_containers(2);
    document.getElementById('edit-data-tables').style.display = "none";
    var table_array = user_tables_as_array_with_brackets();
    $('#calc-first-file').closest('.dropdown').find('.btn').text(table_array[0]);
    await add_to_carousel('Describe how to group data:', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    document.getElementById('calculate-wrap').style.display = 'block';
    
}

// when action is selected
$(document.body).on('click', '.dropdown.show.action.flexy > ul li a' ,async function(){
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
    if (action_index > calc_sents.length){
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
    for (var i=0;i<actions.length;i++){
        var value = $(actions[i]).find('.btn').text();
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
    var filename = $('#calc-first-file').closest('.dropdown').find('.btn').text();
    var metrics_wrap = $('#calcmetrics').find('.dropdown.show.action.flexy');
    var metrics = [];
    for (var i=0;i<metrics_wrap.length;i++){
        var metric = $(metrics_wrap[i]).find('.btn').text();
        metrics.push(metric);
    }
    var groups_wrap = $('#groupbywrap').find('.dropdown.col.flex.groupby-dropdown');
    var groups = [];
    for (var i=0;i<groups_wrap.length;i++){
        var group = $(groups_wrap[i]).find('.btn').text();
        groups.push(group);
    }
    var metric_cols_wrap = $('#calc-col-select-wrapper').find('.calc-col-select');
    var metric_cols = [];
    for (var i=0;i<metric_cols_wrap.length;i++){
        var metric_col = $(metric_cols_wrap[i]).find('.dropdown.nohide.matchcol-right.right-flex-align.col.flex').find('.btn').text();
        metric_cols.push(metric_col);
    }
    calc_params = {
        filename: filename,
        groups: groups,
        metrics: metrics,
        metric_cols: metric_cols
    }
    return calc_params;
}

async function display_calc_params(calc_params){
    hide_containers(1)
    document.getElementById('calculate-wrap').style.display = 'none';
    await add_to_carousel('Group Data:', input_color, [null], true, false);
    for (var i=0;i<calc_params['groups'].length;i++){
        var group = JSON.stringify(calc_params['groups'][i])
        await add_to_carousel('\xa0\xa0\xa0$' + group, standard_color, [null], true, false);
    }
    await add_to_carousel('Calculate Metrics:', input_color, [null], true, false);
    var metrics = calc_params['metrics']
    var metric_cols = calc_params['metric_cols'].reverse();
    for (var i=0;i<metrics.length;i++){
        await add_to_carousel('\xa0\xa0\xa0Calculate: ' + metrics[i] + ' for ' + metric_cols[i], second_color, [null], true, false);
    }
}

function check_warnings_group(){
    var metrics = $('#calcmetrics').find('.dropdown');
    for (var i=0;i<metrics.length;i++){
        if($(metrics[i]).find('.btn').text().includes('Choose what to calculate')){
            $('.warning-box-wrapper').show();
            $('#warningtext').text('You need to choose a metric to calculate');
            return false;
        }
    }
    var select_cols = $('#calc-group-select').find('.dropdown');
    for (var i=0;i<select_cols.length;i++){
        if($(select_cols[i]).find('.btn').text().includes('Select Column')){
            $('.warning-box-wrapper').show();
            $('#warningtext').text('You need to select a column for each metric and group');
            return false;
        }
    } 
    return true;
}

// when submit button is pressed
$(document.body).on('click', '#submit-calculate' ,async function(){
    if(check_warnings_group()){
        $('.warning-box-wrapper').hide();
        $('#submit-calculate').hide();
        $('#calculatespinner').show();
        calc_params = collect_calc_params();
        submit_calc_algo_parameters(calc_params);
    }
});

async function display_calculate_result_table(data){
    $('#calculatespinner').hide();
    await display_calc_params(calc_params);
    populate_table_element('nosheetname', 0, 'result_table_tbody', data);
    await add_to_carousel('Algorithm Result:', fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    document.getElementById('resultbox_div').style.display = 'block';
    await clear_global_variables();
}