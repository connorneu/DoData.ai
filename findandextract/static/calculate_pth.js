async function start_calculate_path(){
    hide_containers(2);
    document.getElementById('edit-data-tables').style.display = "none";
    await add_to_carousel('Define what to calculate:', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    document.getElementById('calculate-wrap').style.display = 'block';
}

// when action is selected
$(document.body).on('click', '#calc-what li a' ,async function(){
    var table_array = user_tables_as_array_with_brackets();
    populate_drop_down('#calc-first-file', table_array, true);
    document.getElementById('calculate-select-file').style.display = 'block';
    // show add button
    var num_actions = $('.dropdown.show.action').length;
    if(num_actions < 7){
        $('#calc-addaction').css("display", "block");
    }
});

// when file is selected show columns
$(document.body).on('click', '#calc-first-file li a' ,async function(){
    var selectedfile = this.firstChild.data;
    var colheaders = get_col_headers_for_filename(selectedfile);
    populate_drop_down('#calc-groupby-first-ul', colheaders, true);
    populate_drop_down('#calc-groupby-second-ul', colheaders, true);
    $('#calc-group-select').css("display", "block");
    add_col_select_for_calc(colheaders);
});

function add_col_select_for_calc(colheaders){
    var actions = $('.calc-actions > .dropdown');
    var num_actions = actions.length;
    console.log('num actions: '+ num_actions)
    var action_values = []
    for (var i=0;i<actions.length;i++){
        var value = $(actions[i]).find('.btn').text();
        console.log('value: ' + value)
        if (i === 0){
            console.log('i: ' + i)    
            $('.calc-col-select').find('h2').append('Calculate <b><u>' + value + '</b></u> for column');            
            populate_drop_down('#calc-col-select-ul1', colheaders, true);
            $('.calc-col-select').css("display", "flex");
            $('#calc-col-select-ul1').closest('.dropdown').find('.btn').text('Select Column');
        }
        //else{

        //}
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
    $('#calc-groupby-second-ul').closest('.calc-groupby').css('display', 'block');
    $('#calc-add-groupby').css("display", "none");
});