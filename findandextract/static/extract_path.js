async function start_extract_file(){
    await add_to_carousel(['Define values to extract:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    await add_to_carousel(['Select values from file or describe values to search for?'], action_color, ["document.getElementById('inputis_file_or_input').style.display = 'block';", "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, false); 
}

$(document.body).on('click', '#inputis_file' ,async function(){   
    hide_containers(2);
    document.getElementById('user_select_input_file_or_custom').style.display = 'none';
    await add_to_carousel('Extract values using input file.', 'white', ['primary_file_selection()'], true, false);
});

async function primary_file_selection(){
    await add_to_carousel(['Select file containing values to search for and extract:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false); 
    await add_to_carousel(['This file contains the values that will be searched for in other datasets.',
                        'Rows of data from the other datasets that match these values will be extracted.'],
                        fyi_color, ['display_primaryfileselect_drop_extract()',"document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
}

async function display_primaryfileselect_drop_extract(){
    // select primary file
    populate_drop_down('#primaryfile_ul', unique_file_names, true)
    document.getElementById('primaryfiledrop').style.display = 'block';
    document.getElementById('extractinputfile').style.display = 'block';
}