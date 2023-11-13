async function start_extract_file(){
    await add_to_carousel(['Define values to extract:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    await add_to_carousel(['Select values from file or describe values to search for?'], action_color, ["document.getElementById('inputis_file_or_input').style.display = 'block';", "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, false); 
}

$(document.body).on('click', '#inputis_file' ,async function(){   
    hide_containers(2);
    document.getElementById('user_select_input_file_or_custom').style.display = 'none';
    await add_to_carousel('Extract values using input file.', 'white', ['primary_file_selection_extract()'], true, false);
});

$(document.body).on('click', '#inputis_describe' ,async function(){   
    hide_containers(2);
    document.getElementById('user_select_input_file_or_custom').style.display = 'none';
    await add_to_carousel('Extract values using custom description.', 'white', ['describe_data_extract()'], true, false);
});

// display_primaryfileselect_drop in in carouselaction.js as it can be used by other algorithm paths
async function primary_file_selection_extract(){
    await add_to_carousel(['Select file containing values to search for and extract:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false); 
    await add_to_carousel(['This file contains the values that will be searched for in other datasets.',
                        'Rows of data from the other datasets that match these values will be extracted.'],
                        fyi_color, ['display_primaryfileselect_drop()',"document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
}

async function describe_data_extract(){
    await add_to_carousel(['Describe the data to be extracted:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false); 
    await add_to_carousel(['Rows that contain these values will be extracted.'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, false); 
    document.getElementById('describe-data-extract').style.display = 'block';
    
}

// when add condition is clicked
$(document.body).on('click', '#add-describe-text' ,function(){
    var desc_div_wrap = document.getElementById("extract-descriptions");
    var new_text = document.createElement("textarea");
    new_text.maxLength = "60";
    new_text.className = "describe-textarea";
    var wrapper = document.createElement('div');
    wrapper.append(new_text);
    desc_div_wrap.appendChild(wrapper);
});