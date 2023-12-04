

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
    await add_to_carousel(['Where are values to update:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    document.getElementById('update_file_wrap').style.display = 'block';
    populate_drop_down('.updatefile.dropdown-menu', unique_file_names, true);

});

$(document.body).on('click', '.updatefile.dropdown-menu' ,async function(){ 
    var selected_file = $(this).parents(".dropdown").find('.btn').text();
    var sheet_names = get_file_sheets(selected_file);
    var sheet_dropdown = $(this).closest('.joined-file').find('.updatesheet.dropdown-menu');
    populate_drop_down(sheet_dropdown, sheet_names, true);
    $(sheet_dropdown).parents(".dropdown").find('.btn').text(sheet_names[0]);
});


