//import('./tribute-master/src/Tribute.js'); 
//https://github.com/zurb/tribute/tree/master



async function start_columns_path(){
  document.getElementById('edit-data-tables').style.display = "none";
    document.getElementById('columns-main-wrap').style.display = 'block';
    await add_to_carousel('Describe the function to create in the new column:', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    await add_to_carousel('Column names will autopopulate after writing the word "column" in your description', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, false); 
    $('#calc_column_dataset_ul').closest('.dropdown').find('.btn').text(dataset_names[0]);
    populate_tribute_dic(dataset_names[0]);
}

async function aspe(){
    const {default: Tribute} = await import("./tribute-master/src/Tribute.js");
      //var tribute = new Tribute({values: col_dic});
      var tribute = new Tribute({
      values: [
        { key: "Phil Heartman", value: "pheartman" },
        { key: "Gordon Ramsey", value: "gramsey" }
      ]
    });
    console.log('done---')
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
    var tribute = await aspe();
    
    console.log('runn')
    console.log(tribute)
    tribute.attach(document.getElementById("caaanDo"));

    //var tribute = new Tribute({values: col_dic});

    //var tribute = new Tribute({
    //    values: [
    //      { key: "Phil Heartman", value: "pheartman" },
    //      { key: "Gordon Ramsey", value: "gramsey" }
    //    ]
    //  });

    //tribute.attach(document.getElementById("caaanDo"));
    //console.log(tribute) 
};


$(document.body).on('click', '#send_input_formula' ,async function(){  

    var usr_formula = $('#send_input_formula').val();
    submit_user_formula(usr_formula);

});
