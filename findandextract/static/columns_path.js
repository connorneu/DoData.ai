//import('./tribute-master/src/Tribute.js'); 
//https://github.com/zurb/tribute/tree/master



async function start_columns_path(){
  hide_containers(2);
  document.getElementById('edit-data-tables').style.display = "none";
  await add_to_carousel('Describe the calulation you want in the new column:', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
  await add_to_carousel('Column names will autopopulate after writing the word \"column\" in your description', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, false); 
  document.getElementById('columns-main-wrap').style.display = 'block';
  $('#calc_column_dataset_ul').closest('.dropdown').find('.btn').text(dataset_names[0]);
  populate_tribute_dic(dataset_names[0]);
  $('#calc_column_dataset_ul').closest('.dropdown').css("display", "block");
}


$(document.body).on('input propertychange', '#caaanDo', async function(){
  if($(this).length > 0){
    $('#submit-columns-wrap').show();
  }
  else{
    $('#submit-columns-wrap').hide();
  }
}); 


async function build_tribute_object(col_dic){
    const {default: Tribute} = await import("./tribute-master/src/Tribute.js");
      var tribute = new Tribute({
      values: col_dic
    });
    return tribute
}


async function populate_tribute_dic(dataset_name) {
    var colheaders = get_col_headers_for_filename(dataset_name);
    col_dic = [];
    for (var i=0;i<colheaders.length;i++){
      col_dic.push({
        key: colheaders[i],
        value: colheaders[i]
      })
    }
    var tribute = await build_tribute_object(col_dic);
    tribute.attach(document.getElementById("caaanDo"));
};

function collect_col_params(){
  var dataset = $('#calc_column_dataset_ul').closest('.dropdown').find('.btn').text();
  var newcolname = $('#newcolname').val();
  var usertext = $('#caaanDo').val();
  var column_params = {
            dataset: dataset,
            new_col_name: newcolname,
            user_text: usertext
  }
  return column_params;
}

$(document.body).on('click', '#send_input_formula' ,async function(){  
    var column_params = collect_col_params(); 
    hide_containers(2);
    await add_to_carousel('Generate Formula: ' + column_params['dataset'], standard_color, [null], true, true);
    await add_to_carousel('$ ' + column_params['new_col_name'] + ' ' + column_params['user_text'], second_color, [null], true, true);
    submit_user_formula(column_params);
});

async function display_column_result_table(data){
  document.getElementById('columns-main-wrap').style.display = 'none';
  populate_table_element('nosheetname', 0, 'result_table_tbody', data);
  await add_to_carousel('Algorithm Result:', fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, true);
  document.getElementById('resultbox_div').style.display = 'block';
  
}
