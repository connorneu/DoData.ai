"use strict";
async function start_describe_path(){
    hide_containers(2);
    await add_to_carousel('Describe what you want to do to your dataset', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    await add_to_carousel('Column names will autopopulate after writing the word \"column\" in your description', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, false); 
    document.getElementById('describe-main-wrap').style.display = 'block';
    $('#describe_dataset_ul').closest('.dropdown').find('.btn').text(dataset_names[0]);
    populate_tribute_dic_describe(dataset_names[0]);
    $('#describe_dataset_ul').closest('.dropdown').css("display", "block");
}

async function populate_tribute_dic_describe(dataset_name) {
    var colheaders = get_col_headers_for_filename(dataset_name);
    var col_dic = [];
    for (var i=0;i<colheaders.length;i++){
      col_dic.push({
        key: colheaders[i],
        value: colheaders[i]
      })
    }
    var tribute = await build_tribute_object_describe(col_dic);
    tribute.attach(document.getElementById("describetext"));
};
async function build_tribute_object_describe(col_dic){
    const {default: Tribute} = await import("./tribute-master/src/Tribute.js");
      var tribute = new Tribute({
      values: col_dic
    });
    return tribute;
}


$(document.body).on('input propertychange', '#describetext', async function(){
    if($(this).length > 0){
      $('#submit-describe-wrap').show();
    }
    else{
      $('#submit-describe-wrap').hide();
    }
  }); 

function collect_describe_parameters(){
    var dataset = $('#describe_dataset_ul').closest('.dropdown').find('.btn').text();
    var descriptiontext = $('#describetext').val();
    desc_params = {
        dataset: dataset,
        descriptiontext: descriptiontext
    }
    return desc_params;
}

$(document.body).on('click', '#send_describe_input' ,async function(){ 
    desc_params = collect_describe_parameters();
    submit_desc_algo_parameters(desc_params);
});

async function display_describe_result_table(data){
    document.getElementById('describe-main-wrap').style.display = 'none';
    populate_table_element('nosheetname', 0, 'result_table_tbody', data);
    await add_to_carousel('Algorithm Result:', fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, true);   
    document.getElementById('resultbox_div').style.display = 'block';
    await clear_global_variables();
}