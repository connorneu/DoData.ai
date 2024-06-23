clean_first_update_file = null;

async function start_update_file(){
    hide_containers(2);
    document.getElementById('edit-data-tables').style.display = 'none';
    populate_drop_down('#updateinputfile_ul', dataset_names, true);
    populate_drop_down('#updatedatasetreplace_ul', dataset_names, true);
    await add_to_carousel('Describe how to update the file:', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, true);
    document.getElementById('update_file_wrap').style.display = 'block';
    document.getElementById('describe-data-upload').style.display = 'block';
   
}

// when file selected show column dropdown
$(document.body).on('click', '#update-from-file-drop li a' ,function(){
    var selectedfile = $(this).text();
    var colheaders = get_col_headers_for_filename(selectedfile);
    populate_drop_down("#updateinputcol_ul", colheaders, true);
    populate_drop_down("#updateinputcolreplace_ul", colheaders, true);
    // when column from how to match - hidden but update
    var when_col_ul = $('#update-where-clauses').find('.dropdown.show.alignbottom').eq(0).find('ul');
    populate_drop_down(when_col_ul, colheaders, true);
    document.getElementById('update-from-file-column-drop').style.display = 'block';
    var when_col_header = $('#update-where-clauses').find('.dropdown.show.alignbottom').eq(0).find('h2');
    $(when_col_header).text(selectedfile);
});


// replace with values from dataset -> when dataset selected update column
$(document.body).on('click', '#updatedatasetreplace_ul li a' ,function(){
    var selectedfile = $(this).text();
    var colheaders = get_col_headers_for_filename(selectedfile);
    populate_drop_down("#updatecolreplace_ul", colheaders, true);
    // how to match -> when column equals
    populate_drop_down("#update_equals_this_column_ul", colheaders, true);
    $('#update_equals_datasetname').text(selectedfile);
});


// replace with values from dataset -> when dataset selected update column
$(document.body).on('click', '#add-update-when-cond' ,function(){
    var when_clone = $('#update-where-clauses').find('.flexwrap').eq(0).clone().appendTo($('#update-where-clauses'));
    var when_conds = $('#update-where-clauses').find('.flexwrap');
    for (var i = 0;i<when_conds.length;i++){
        if (i < when_conds.length-1){
            $(when_conds[i]).find('.header-update-wrap').css("visibility", "hidden");
        }
    }
    $('#update-where-clauses').find('.flexwrap:last').find('.btn').text('Select Column');
    $('#update-where-clauses').find('.flexwrap:last').find('textarea').val('');
    if (when_conds.length == 4){
        $('#add_update_when').hide();
    }
});

// when column selected for update from dataset -> display how to match
$(document.body).on('click', '#updatecolreplace_ul li a' ,function(){
    document.getElementsByClassName('update_if_from_input')[0].style.display = 'none';
    $('#update-from-what').find('.header-bottomspace').hide();
    $('#update-from-what-text').hide();
    document.getElementById('update-how').style.display = 'block';  
    $('#disabled_update_col_ul').parents(".dropdown").find('.btn').text($('#updateinputcol_ul').parents(".dropdown").find('.btn').text());
});


// when column to update selected -> show where to update from
$(document.body).on('click', '#updateinputcol_ul li a' ,function(){
    document.getElementById('update-from-what').style.display = 'block';
    document.getElementById('update-from-file-column-drop-replace').style.display = 'flex';
});


// when textarea has text then grey dropdown when empty un-grey dropdown
$(document.body).on('focus', '.describe-textarea.specify-value', async function(){  
    $(this).removeClass('gently-blur');
    $('#updatedatasetreplace_ul').closest(".dropdown").find('.btn').html('Select Dataset');
    $('#updatecolreplace_ul').closest(".dropdown").find('.btn').html('Select Column');
    $('#updatedatasetreplace_ul').closest(".dropdown").find('.btn').addClass('disabled');
    $('#updatecolreplace_ul').closest(".dropdown").find('.btn').addClass('disabled');
});


$(document.body).on('input propertychange', '.describe-textarea.specify-value', async function(){  
    if ($(this).val().length > 0){
        $('#update-from-what').find('.header-bottomspace').hide();
        $('#update-from-what div').eq(0).hide();
        $('#update-from-what div').eq(1).hide();
        $('#update-from-what div').eq(2).hide();
        $('update-where-clauses').find('.dropdown.show.alignbottom').eq(1).hide();
        $('#update-from-what').find('.header-bottomspace').hide();
        $('#update_equals_this_column_ul').closest('.dropdown').find('.btn').hide();
        document.getElementById('update-how').style.display = 'block';  
        $('#disabled_update_col_ul').parents(".dropdown").find('.btn').text($('#updateinputcol_ul').parents(".dropdown").find('.btn').text());
        $('update_if_from_input').find('h2').text('Replace with this value');
    }
    if ($(this).val().length === 0){
        $('#update-from-what div').eq(0).show();
        $('#update-from-what div').eq(1).show();
        $('#update-from-what div').eq(2).show();
        $('.header-update-wrap:eq(1)').hide();
    }
});


$(document.body).on('click', '#updatedatasetreplace_ul li a', async function(){  
    $('#update-from-what-text').find('textarea').addClass('gently-blur');
});

// when btn to add column to match clicked
$(document.body).on('click', '.updatefile-add-match-col' ,function(){
    var num_match_cols = $(this).closest('.update-from-column').find('.updatecol.dropdown-menu.findcol').length;
    $(this).closest('.update-from-column').find('.dropdown.flexdropdown.selectcolumn').eq(0).clone(true).appendTo($(this).closest('.update-from-column'));
    this.closest('.update-from-column').appendChild(this);
    if (num_match_cols >= 3){
        this.style.display = 'none';
    }
});

// when btn to add column to update clicked
$(document.body).on('click', '.updatefile-add-update-col' ,function(){
    var num_match_cols = $(this).closest('.update-from-column').find('.updatecol.dropdown-menu.updatedcol').length;
    $(this).closest('.update-from-column').find('.dropdown.flexdropdown.selectcolumn').eq(0).clone(true).appendTo($(this).closest('.update-from-column'));
    this.closest('.update-from-column').appendChild(this);
    if (num_match_cols >= 3){
        this.style.display = 'none';
    }
});


// if update from file column clicked -> remove disabled class
$(document.body).on('click', '#update-from-file-column-drop-replace' ,function(){
    var dropdowns = $(this).find('.btn').removeClass('disabled');
});


// when update when column selected then show build algorithm 
$(document.body).on('click', '#update-where-clauses .dropdown.show.alignbottom:eq(1) li a' ,function(){
    $('#submit_update_this_file').show();
});


$(document.body).on('input propertychange', '#update-where-clauses textarea' ,function(){
    if($(this).val().length > 0){
        $('#submit_update_this_file').show();
    }
});



// warnings
function check_for_update_warnings(){
    var dropdowns = $('#update-where-clauses').find('.btn');
    for (var i=0;i<dropdowns.length;i++){
        if ($(dropdowns[i]).text().includes('Select Dataset') || $(dropdowns[i]).text().includes('Select Column')){
            if($(dropdowns[i]).is(':visible')){
                $('.warning-box-wrapper').show();
                $('#warningtext').text('You need to select a dataset and column');
                return false;
            }
        }
    }
    return true;
}



function collect_update_params(){
    var file_to_update = $('#updateinputfile_ul').closest('.dropdown').find('.btn').text();
    var col_to_update = $('#updateinputcol_ul').closest('.dropdown').find('.btn').text();
    if($('#update-from-file-column-drop-replace').is(":visible")){
        var update_from_text = false;
        var replace_file = $('#updatedatasetreplace_ul').closest('.dropdown').find('.btn').text();
        var replace_col = $('#updatecolreplace_ul').closest('.dropdown').find('.btn').text();
        var text_to_update = null;
    }
    else{
        var update_from_text = true;
        var text_to_update = $('#update-from-what-text').find('textarea').val();
        var replace_file = null;
        var replace_col = null;

    }
    var update_when = [];
    var whens = $('#update-where-clauses').find('.flexwrap');
    for (var i = 0; i < whens.length; i++){
        var when = $(whens[i]).find('.dropdown.show.alignbottom').eq(0).find('.btn').text();
        if(!update_from_text){
            var equals = $(whens[i]).find('.dropdown.show.alignbottom').eq(1).find('.btn').text();
        }
        else{
            var equals = $(whens[i]).find('textarea').val();
        }
        update_when.push([when, equals])
    }
    var update_params = {
        file_to_update: file_to_update,
        col_to_update: col_to_update,
        update_from_text: update_from_text,
        replace_file: replace_file,
        replace_col: replace_col,
        text_to_update: text_to_update,
        update_when: update_when
    }
    return update_params
}

async function write_update_params(update_params){
    await add_to_carousel('Update: ' + update_params['file_to_update'], standard_color, [null], true, false);
    await add_to_carousel('\xa0\xa0\xa0Column: ' + update_params['col_to_update'], input_color, [null], true, true);
    if(update_params['update_from_text']){
        await add_to_carousel('Update value: ' + update_params['file_to_update'], second_color, [null], true, false);
    }
    else{
        await add_to_carousel('Update values in: ' + update_params['replace_file'] + ' ' + update_params['replace_col'], third_color, [null], true, false);
    }
    var update_when_val = update_params['update_when'];
    await add_to_carousel('where values match: ', fourth_color, [null], true, false);
    for (var i=0;i<update_when_val.length;i++){
        await add_to_carousel('\xa0\xa0\xa0$ ' + update_when_val[i][0] + ' == ' + update_when_val[i][1], standard_color, [null], true, true);
    }
}

// when submit update file
$(document.body).on('click', '#submit-update-file' ,async function(){
    if(check_for_update_warnings()){
        $('.warning-box-wrapper').hide();
        $('#submit-update-file').hide();
        $('#updatespinner').show();
        var update_params = collect_update_params();
        hide_containers(1);
        await write_update_params(update_params);
        submit_update_file_algo_parameters(update_params);
    }
});

function hide_fail(){
    console.log('hide failures')
    $('#submit-update-file').show();
    $('#updatespinner').hide();
}

async function display_update_result_table(data){
    //hide_containers(1)
    $('#updatespinner').show();
    document.getElementById('update_file_wrap').style.display = 'none';
    populate_table_element('nosheetname', 0, 'result_table_tbody', data);
    await add_to_carousel('Algorithm Result:', fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    document.getElementById('resultbox_div').style.display = 'block';
}