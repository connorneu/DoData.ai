data_json = null;
unique_file_names = null;
carouselText = [];
carousel_num = 1;
primary_file_name = null;
primary_file_sheets = [];
primary_sheet_name = null;
secondary_file_name = null;
seconday_file_sheets = [];
secondary_sheet_name = null;
createTable_values1 = '';
createTable_values2 = '';
condition_arr = [];
condition_arr2 = [];
table_html_obj_arr = null;
table_html_obj_arr2 = null;
primary_header_row = 0;
secondary_header_row = 0;
input_type = null;
input_num = null;
algorithm_type = null;


// COLLAPSABLE FUCKING THING YOU DON T KUNDERSTAND
root = null;
treeData = null;

var action_color = "#ffd9cb";  //coral
var standard_color = "white";
var fyi_color =  action_color; //'#ffa585' //"cyan";   #714ac7   '#95fff1    #4a63c7


 $(document).ready(async function() {
    var path = window.location.pathname;
    var page = path.split("/").pop();
    if(path === "/findandextract/"){
        //START
        //await add_to_carousel('S T A R T - { [ ALGORITHM BUILD ] } ', standard_color, [null], true, false);

        add_to_carousel(['Define algorithm type'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
        add_to_carousel(['Click through an algorithm path to describe the data process.'], fyi_color, ['display_algo_graph()', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
        //await add_to_carousel(['File Selection'], standard_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')", 'display_filedrops()'], false, true);


    }
});


async function add_to_carousel(text_new, color_new, func_new, isTyped_new, carousel_break_new){
  
return new Promise((resolve, reject) => {    
    id_new = '#feature-text' + carousel_num;
    carousel_obj = {id:id_new, text:text_new, color:color_new, func:func_new, isTyped: isTyped_new, carousel_break: carousel_break_new};
    var carousel_result = carousel(carousel_obj)
    
    if (carousel_result) {
        //carousel_num++;  
        resolve(carousel_result);
    }
    else {
        //carousel_num++;  
        reject(carousel_result);
    }
    })
    
}


async function typeSentence(sentence, eleRef, delay =00) {
  const letters = sentence.split("");
  let i = 0;
  while(i < letters.length) {
    await waitForMs(delay);
    $(eleRef).append(letters[i]);
    i++
  }
  return;
}

// for sentences too long to be typed out - accepts array of sentences and adds the faded class so they fade in slowly
async function displaySentence(sentences, eleRef)
{
    $(eleRef).addClass('faded');
    for(var i=0;i<sentences.length;i++)
    {
        $(eleRef).append(sentences[i]);
        //if theres more than 1 sentence add line break - dont add linebreak if there are no more sentences
        if(sentences.length > 1 && i<sentences.length-1) {
            linebreak = document.createElement("br");
            $(eleRef).append(linebreak);
        }
    }   
    //await waitForMs(120);
}

// updates parameter that is null when put into carousel but gets value thru user selection
function update_item_text_params(carouselItem_param) {
    return carouselItem_param
}

function waitForMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function carousel(carousel_obj) {
    carousel_num++;  
    create_carousel_elem(carousel_obj);  // if elem doesn't exist create it
    //only run functions that update text params until after text is written
    for(var j=0;j<carousel_obj.func.length;j++)
    {
        // if func is null includes throws error
        if (carousel_obj.func[j] != null) {
            //if function includes then append result to carouselList - THIS WILL BE AN ISSUE because it only appends to end of text
            if (carousel_obj.func[j].includes('update_item_text_params')) {
                carousel_obj.text += eval(carousel_obj.func[j])
            }
        }
    }
    updateFontColor(carousel_obj.id, carousel_obj.color)
    if (carousel_obj.isTyped)
    {
        console.log(carousel_obj.text)
        await typeSentence(carousel_obj.text, carousel_obj.id);
    }
    else
    {
        await displaySentence(carousel_obj.text, carousel_obj.id);
    }
    // evaluate functions after text has been written
    for(var j=0;j<carousel_obj.func.length;j++)
    {
    // if func is null includes throws error
        if (carousel_obj.func[j] != null) {
            if (!carousel_obj.func[j].includes('update_item_text_params')){
                await eval(carousel_obj.func[j]);//run functions inside carousel item     
            }
        }
    } 
    return true;
}

// create carousel element if it doesnt exist
async function create_carousel_elem(carousel_item){
    // get carousel id
    carousel_elem_id = carousel_item.id;
    // if elem does not already exist
    if(!$(carousel_elem_id).length){
        // parse number of last carouselcontainer
	    var $div = $('div[id^="carouselcontainer"]:last');
        if (isNumeric($div.prop("id").slice(-2))){
            var num = $div.prop("id").slice(-2);   
            num++;
        }
        else{
            var num = $div.prop("id").slice(-1);   
            num++;
        }
        //var num = $div.prop("id").slice(-1);   
        //num++; 

        // clone last carouselcontainer and increment id by 1
        var $klon = $div.clone(false).prop('id', 'carouselcontainer'+num );
        // remove action / action fyi if it exists
        if ($klon.hasClass('action')){
           $klon.removeClass('action');      
        }
        if ($klon.hasClass('actionfyi')){
           $klon.removeClass('actionfyi');      
        } 
        $klon.css("display", "block");
        // remove h2 tag from previous container
        $klon.children().remove();
        // append to parent container
        $klon.appendTo("#typing-container1");
        // create new h2 tag which will contain text
        var $mew_div = $("<h2>", {id:"feature-text"+num, "class":"containerh" })
        // append to newly cloned parent div
        $klon.append($mew_div)
        // remove caret from current carouselcontainer
        var addconditionbtn = $('#caret').clone()   
        // add to next carouselcontainer
        addconditionbtn.appendTo("#"+'carouselcontainer'+num)
        // remove previous
        $('#caret:first').remove()
    }   
}

function uniq_fast(obj, att) {
    var seen = {};
    var out = [];
    var len = obj.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = obj[i][att];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}

 // make dropdown value equal to selected value
$(document.body).on('click', '.dropdown-menu li a' ,function(){      
    var selected_dropdown_value = $(this).text();
    $(this).parents(".dropdown").find('.btn').html($(this).text() + '<span class="caret"></span>');
    $(this).parents(".dropdown").find('.btn').val($(this).data('value')); 
});

 // if primary file is selected hide dropdown + hide header + print selection
$(document.body).on('click', '#primaryfile_ul' ,async function(){ 
    hide_containers(2);
    //document.getElementById('carouselcontainer4').style.display = 'none';     //'feature-text4'
    //document.getElementById('carouselcontainer5').style.display = 'none';     //'feature-text5'
    document.getElementById('primaryfiledrop').style.display = 'none'; // file selection dropdown    

    var user_selection =  $(this).parents(".dropdown").find('.btn').text();
    primary_file_name = user_selection;
    primary_file_sheets = get_file_sheets(primary_file_name); 
    await add_to_carousel('Primary file: ', standard_color, ['update_item_text_params(primary_file_name)', 'primary_sheet_selection()'], true, false);
});

 // if secondary file is selected hide dropdown + hide header + print selection
$(document.body).on('click', '#secondaryfile_ul' ,async function(){ 
    //document.getElementById('carouselcontainer4').style.display = 'none';     //'feature-text4'
    //document.getElementById('carouselcontainer5').style.display = 'none';     //'feature-text5'
    hide_containers(2)
    document.getElementById('secondaryfiledrop').style.display = 'none'; // file selection dropdown    
    var user_selection =  $(this).parents(".dropdown").find('.btn').text();
    secondary_file_name = user_selection;
    secondary_file_sheets = get_file_sheets(secondary_file_name); 
    await add_to_carousel('Secondary file: ', standard_color, ['update_item_text_params(secondary_file_name)', 'secondary_sheet_selection()'], true, false);
});

 // if primary sheet is selected
$(document.body).on('click', '#primarysheet_ul' ,function(){ 
    hide_containers(2);
    //document.getElementById('carouselcontainer7').style.display = 'none';
    //document.getElementById('carouselcontainer8').style.display = 'none';
    document.getElementById('primarysheetdrop').style.display = 'none';
    var user_selection =  $(this).parents(".dropdown").find('.btn').text();
    primary_sheet_name = user_selection;    
    add_to_carousel('Primary sheet: ', standard_color, ['update_item_text_params(primary_sheet_name)', 'adjust_col_header()'], true, false);
});

 // if secondary sheet is selected
$(document.body).on('click', '#secondarysheet_ul' ,function(){ 
    hide_containers(2);
    document.getElementById('secondarysheetdrop').style.display = 'none';
    var user_selection =  $(this).parents(".dropdown").find('.btn').text();
    secondary_sheet_name = user_selection;    
    add_to_carousel('Secondary sheet: ', standard_color, ['update_item_text_params(secondary_sheet_name)', 'adjust_col_header2()'], true, false);
});

// when col header for table 1 is adjusted
$(document.body).on('click', '#data1_tableid' ,function(e){  
    const cell = e.target.closest('td');
    if (!cell) {return;} // Quit, not clicked on a cell
    const row = cell.parentElement; // row user clicked on
    primary_header_row = row.rowIndex;
    //unique_file_names = uniq_fast(data_json, 'file_name');  // calcualte file names   
    //$("#loadedfile1").text(unique_file_names[0]); // text value of Data Accordion 1
   // var selected_data1_sheet_dropdown = $('#data1selectsheetbutton').val($(this).text()).text() // get current data1 sheet value
    var repivoted_data = repivot_keyval(data_json, primary_file_name, primary_sheet_name); // create array original table dimension from key value table
    createTable_values1 = createTable(repivoted_data, 'data1_tableid', row.rowIndex); // create html table for data 1 from repivoted key value table
    var col_headers = createTable_values1[0];
    var createTable_html = createTable_values1[1];
    table_html_obj_arr = parse_table_column_values(createTable_html);
    //populate_obj_list("data1selectedcolumnvalues", table_html_obj_arr);
    populate_drop_down("#data1columns", col_headers, true); // populate data column selection with header update
    document.getElementById("data1_table_reset").style.display = "block";
    $("tr").css({ 'background-color' : '#2b2b2b'});  //once column has been selected change the background of the table - only works with coral color for some reason + if user clicks again they get bad result
    //console.log(cell.innerHTML, row.rowIndex, cell.cellIndex);
});

// when col header for table 2 is adjusted
$(document.body).on('click', '#data2_tableid' ,function(e){  
    const cell = e.target.closest('td');
    if (!cell) {return;} // Quit, not clicked on a cell
    const row = cell.parentElement; // row user clicked on
    secondary_header_row = row.rowIndex;
    //unique_file_names = uniq_fast(data_json, 'file_name');  // calcualte file names   
    //$("#loadedfile1").text(unique_file_names[0]); // text value of Data Accordion 1
   // var selected_data1_sheet_dropdown = $('#data1selectsheetbutton').val($(this).text()).text() // get current data1 sheet value
    var repivoted_data = repivot_keyval(data_json, secondary_file_name, secondary_sheet_name); // create array original table dimension from key value table
    createTable_values2 = createTable(repivoted_data, 'data2_tableid', row.rowIndex); // create html table for data 1 from repivoted key value table
    var col_headers = createTable_values2[0];
    var createTable_html = createTable_values2[1];
    table_html_obj_arr2 = parse_table_column_values(createTable_html);
    //populate_obj_list("data1selectedcolumnvalues", table_html_obj_arr);
    //populate_drop_down("#secondarycond1_col_drop", col_headers, true);
    populate_drop_down("#data2columns", col_headers, true); // populate data column selection with header update
    document.getElementById("data2_table_reset").style.display = "block";
    $("tr").css({ 'background-color' : '#2b2b2b'});  //once column has been selected change the background of the table - only works with coral color for some reason + if user clicks again they get bad result
    //console.log(cell.innerHTML, row.rowIndex, cell.cellIndex);
});

// reset table 1
$(document.body).on('click', '#data1_table_reset' ,function(e){
    //var selected_data_sheet_dropdown = $('#data1selectsheetbutton').val($(this).text()).text() // get current data1 sheet value
    var col_headers = populate_table_element(primary_sheet_name, 1, 'data1_tableid') // populate table with selected values
    //populate_drop_down("#data1columns", col_headers, true);
    document.getElementById("data1_table_reset").style.display = "none";
    primary_header_row = 0;
});

// reset table 2
$(document.body).on('click', '#data2_table_reset' ,function(e){
    //var selected_data_sheet_dropdown = $('#data1selectsheetbutton').val($(this).text()).text() // get current data1 sheet value
    var col_headers = populate_table_element(secondary_sheet_name, 2, 'data2_tableid') // populate table with selected values
    //populate_drop_down("#data1columns", col_headers, true);
    document.getElementById("data2_table_reset").style.display = "none";
    secondary_header_row = 0;
});

// next after adjusting col headers primary data
$(document.body).on('click', '#data1_next_colheader' ,function(){
    hide_containers(2);
    document.getElementById("colselecttablediv1").style.display = "none";
    add_to_carousel(['Define condtions to filter primary data'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    add_to_carousel(['These conditions will limit the rows imported into the algorithm.', 'If some of the data is not relevant then exclude it here.'], fyi_color, ['display_add_conditions_btn()', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);    
});

// next after adjusting col headers secondary data
$(document.body).on('click', '#data2_next_colheader' ,function(){
    hide_containers(2);
    document.getElementById("colselecttablediv2").style.display = "none";
    add_to_carousel(['Define condtions to filter secondary data'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    add_to_carousel(['These conditions will limit the rows imported into the algorithm.', 'If some of the data is not relevant then exclude it here.'], fyi_color, ['display_add_conditions_btn2()', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);    
});

// when add condition is clicked
$(document.body).on('click', '#addconditionprimary' ,function(){
    var current_selection = $('#cond1_col_drop').find('.btn').text()
    if (current_selection === 'Select Column'){
        var primary_col_headers = createTable_values1[0];
        populate_drop_down('#conditiondropdowncols1', primary_col_headers, true)
        document.getElementById('cond1_col_drop').style.display = 'inline-block';
        document.getElementById('primaryconditions').style.display = 'block';
        document.getElementById('primarycondition1').style.display = 'block';  
        document.getElementById('cond1_action1').style.display = 'inline-block';
    }
    else{  
        // add more conditions by cloning previous and reseting values
        var $last_condition = $('#primarycondition-container div[id^="primarycondition"]:last');
        var condition_num = $last_condition.prop("id").slice(-1);
        condition_num++;
        var $condition_klon = $last_condition.clone(false).prop('id', 'primarycondition'+condition_num);
        // change id to current condition num
        $condition_klon.find('.dropdown.condition-dropdown').prop('id', 'cond' + condition_num + '_col_drop');
        $condition_klon.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').prop('id', 'conditioncolselect' + condition_num);
        $condition_klon.find('.dropdown-menu').prop('id', 'conditiondropdowncols' + condition_num);
        $condition_klon.find('.dropdown.condition-dropdown-col').prop('id', 'cond' + condition_num + 'action' + condition_num);
        $condition_klon.find('.condition-input-div').prop('id', 'condition' + condition_num + 'and');
        $condition_klon.find('.condition-dropdown-andor').prop('id', 'andor' + condition_num);        
        
        // change dropdown value back to Select Column
        $condition_klon.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').html('Select Column');
        $condition_klon.find('.btn.btn-outline-secondary.dropdown-toggle.condition-dropdown-btn').html('Equals');
        $condition_klon.find('.form-control.condition-input').val('');
        $condition_klon.find('.form-control.condition-input-and').val('');
        $condition_klon.find('.condition-dropdown-btn-andor').html('And');
        $condition_klon.find('.condition-input-div').css('display','none');
        $condition_klon.find('.condition-dropdown-andor').css('visibility','visible');
        $condition_klon.appendTo('#primaryconditions');          
    }
});

// when add condition is added for secondary
$(document.body).on('click', '#addconditionsecondary' ,function(){
    var current_selection = $('#secondarycond1_col_drop').find('.btn').text()
    if (current_selection === 'Select Column'){
        var secondary_col_headers = createTable_values2[0];
        populate_drop_down('#secondaryconditiondropdowncols1', secondary_col_headers, true)
        document.getElementById('secondarycond1_col_drop').style.display = 'inline-block';
        document.getElementById('secondaryconditionsq').style.display = 'block';
        document.getElementById('secondaryconditions1').style.display = 'block';  
        document.getElementById('secondarycond1_action1').style.display = 'inline-block';
    }
    else{       
        // add more conditions by cloning previous and reseting values
        var $last_condition = $('#secondarycondition-container div[id^="secondaryconditions"]:last');
        var condition_num = $last_condition.prop("id").slice(-1);
        condition_num++;
        var $condition_klon = $last_condition.clone(false).prop('id', 'secondaryconditions'+condition_num);
        // change id to current condition num
        $condition_klon.find('.dropdown.condition-dropdown').prop('id', 'secondarycond' + condition_num + '_col_drop');
        $condition_klon.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').prop('id', 'secondaryconditioncolselect' + condition_num);
        $condition_klon.find('.dropdown-menu').prop('id', 'secondaryconditiondropdowncols' + condition_num);
        $condition_klon.find('.dropdown.condition-dropdown-col').prop('id', 'secondarycond' + condition_num + 'action' + condition_num);
        $condition_klon.find('.condition-input-div').prop('id', 'secondarycondition' + condition_num + 'and');
        $condition_klon.find('.condition-dropdown-andor').prop('id', 'secondaryandor' + condition_num);        
        
        // change dropdown value back to Select Column
        $condition_klon.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').html('Select Column');
        $condition_klon.find('.btn.btn-outline-secondary.dropdown-toggle.condition-dropdown-btn').html('Equals');
        $condition_klon.find('.form-control.condition-input').val('');
        $condition_klon.find('.form-control.condition-input-and').val('');
        $condition_klon.find('.condition-dropdown-btn-andor').html('And');
        $condition_klon.find('.condition-input-div').css('display','none');
        $condition_klon.find('.condition-dropdown-andor').css('visibility','visible');
        $condition_klon.appendTo('#secondaryconditionsq');          
    }
});

// if between is selected from condition dropdown update relevant andcondition
$(document.body).on('click', '.input-group.mb-3' ,function(){
    var cond_action = $(this).find('.btn').text();
    if (cond_action === 'Between'){
        $(this).parent('.conditiondiv').find('.condition-input-div').css('display','inline-block');
    }
    else{
        $(this).parent('.conditiondiv').find('.condition-input-div').css('display','none');
    }
});

// next after conditions primary
$(document.body).on('click', '#conditionnextprimary' ,function(){
    var $last_condition = $('div[id^="primarycondition"]:last'); //find last condition
    var condition_num = $last_condition.prop("id").slice(-1);
    while (condition_num >= 1){
        var current_primary_condition = 'primarycondition' + condition_num;
        $last_condition = $('#'+current_primary_condition);
        var andor = $last_condition.find('.condition-dropdown-btn-andor').text();
        var column_name = $last_condition.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').text();        
        var action = $last_condition.find('.btn.btn-outline-secondary.dropdown-toggle.condition-dropdown-btn').text();
        var action_value = $last_condition.find('.form-control.condition-input').val();
        var between_and = $last_condition.find('.form-control.condition-input-and').val();
        condition_arr.push([andor, column_name, action, action_value, between_and]);
        condition_num--;        
    } 
    document.getElementById('primarycondition-container').style.display = 'none';
    //table_html_obj_arr = filter_data('table1');
    display_conditions();
});

// next after conditions secondary
$(document.body).on('click', '#conditionnextsecondary' ,function(){
    var $last_condition = $('div[id^="secondaryconditions"]:last'); //find last condition
    var condition_num = $last_condition.prop("id").slice(-1);
    while (condition_num >= 1){
        var current_secondary_condition = 'secondaryconditions' + condition_num;
        $last_condition = $('#'+current_secondary_condition);
        var andor = $last_condition.find('.condition-dropdown-btn-andor').text();
        var column_name = $last_condition.find('.btn.btn-secondary.dropdown-toggle.condition-dropdown-btn').text();        
        var action = $last_condition.find('.btn.btn-outline-secondary.dropdown-toggle.condition-dropdown-btn').text();
        var action_value = $last_condition.find('.form-control.condition-input').val();
        var between_and = $last_condition.find('.form-control.condition-input-and').val();
        condition_arr2.push([andor, column_name, action, action_value, between_and]);
        condition_num--;        
    } 
    document.getElementById('secondarycondition-container').style.display = 'none';
    //table_html_obj_arr2 = filter_data('table2');
    //document.getElementById('submitbtn').style.display = 'block'
    display_conditions2();
});

// add conditions to match
$(document.body).on('click', '#matchaddcondition' ,function(){
    var $last_condition = $('#matchcondition-container div[id^="matchcondition1"]:last');
    var condition_num = $last_condition.prop("id").slice(-1); 
    console.log(condition_num)
    if (document.getElementById('matchcondition-container').style.display === 'none'){   
        document.getElementById('matchcondition-container').style.display = 'block';
        document.getElementById('matchcondition1').style.display = 'block';
        $('#matchprimaryheader').text(primary_file_name);
        $('#matchsecondaryheader').text(secondary_file_name);
        var col_headers = createTable_values1[0];
        populate_drop_down("#match_primary_col_dropdown", col_headers, true);
        var col_headers = createTable_values2[0];
        populate_drop_down("#match_secondary_col_dropdown", col_headers, true);
    }
    else{
        condition_num++;
        var $klon = $last_condition.clone(false).prop('id', 'matchcondition'+condition_num);
        $klon.find('.dropdown.condition-dropdown').prop('id', 'secondarycond' + condition_num + '_col_drop');
        $klon.appendTo('#matchconditioncontainer'); 



    }

});

// add conditions to match
$(document.body).on('click', '#matchaddcondition' ,function(){
    var $last_condition = $('#matchcondition-container div[id^="matchcondition1"]:last');
    var condition_num = $last_condition.prop("id").slice(-1); 
    console.log(condition_num)
    if (document.getElementById('matchcondition-container').style.display === 'none'){   
        document.getElementById('matchcondition-container').style.display = 'block';
        document.getElementById('matchcondition1').style.display = 'block';
        $('#matchprimaryheader').text(primary_file_name);
        $('#matchsecondaryheader').text(secondary_file_name);
        var col_headers = createTable_values1[0];
        populate_drop_down("#match_primary_col_dropdown", col_headers, true);
        var col_headers = createTable_values2[0];
        populate_drop_down("#match_secondary_col_dropdown", col_headers, true);
    }
    else{
        condition_num++;
        var $klon = $last_condition.clone(false).prop('id', 'matchcondition'+condition_num);
        $klon.find('.dropdown.condition-dropdown').prop('id', 'secondarycond' + condition_num + '_col_drop');
        $klon.appendTo('#matchconditioncontainer'); 

    }
});

$(document.body).on('dragenter focus click', '.file-input' ,function(e){
    $(e.target.parentNode).addClass('is-active');
});

$(document.body).on('dragenter focus click', '.file-input' ,function(e){
    $(e.target.parentNode).removeClass('is-active');
});

$(document.body).on('change', '.file-input' ,function(){
    var filesCount = $(this)[0].files.length;
    var $textContainer = $(this).prev();
    if (filesCount === 1) {
    // if single file is selected, show file name
    var fileName = $(this).val().split('\\').pop();  
    $textContainer.text(fileName);
    } else {
    // otherwise show number of files
    $textContainer.text(filesCount + ' files selected');
    }
    document.getElementById('addfiles').style.display = 'block';
});

// unhide additional file drop box
$(document.body).on('click', '#addsecondfile' ,function(){    
    if(document.getElementById('filetwo').style.display == 'none'){
        document.getElementById('filetwo').style.display = 'inline-block';
        if(input_num == 'single'){
            document.getElementById('addsecondfile').style.display = 'none';
        }
    }
    else if(document.getElementById('file3').style.display == 'none' && input_num == 'multiple'){
        document.getElementById('file3').style.display = 'inline-block';
    }
    else if(document.getElementById('file4').style.display == 'none' && input_num == 'multiple'){
        document.getElementById('file4').style.display = 'inline-block';
        document.getElementById('addsecondfile').style.display = 'none';
    }
});

async function display_multiple_file_drops(){
    document.getElementById('filedrops').style.display = 'block';
    //if(input_num === 'single' && input_type === 'custom'){
    //    document.getElementById('addsecondfile').style.display = 'none';
    //}
}

async function display_all_files_in_folder(){
    
}

async function display_algo_graph(){
    document.getElementById('algo-desc-graph').style.display = 'block';
}

async function start_primary_file(db_data){  
        document.getElementById('filedrops').style.display = 'none';
        hide_containers(2);
        data_json = db_data['fande_data_dump'];
        console.log(data_json)
        //data_json = JSON.parse(document.getElementById('fande_data_dump').textContent);
        unique_file_names = uniq_fast(data_json, 'file_name');  // calcualte file names 
        //load file
        await add_to_carousel('Loaded file: ' + unique_file_names[0], standard_color, [null], true, false);
        //load file
        await add_to_carousel('Loaded file: ' + unique_file_names[1], standard_color, [null], true, false);  
        //Select Primary Dropdown
        await add_to_carousel(['Select Primary File'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);         //"document.getElementById('carouselcontainer" + (carousel_num + 1) +"').style.textAlign = 'center';"
        // Select Primary Dropdown Instructions
        await add_to_carousel(['The primary file will be the file that contains the values you want to search other files for.',
                        'It should contain at least one column with values that can be found in other files.', 
                        'You can also search within your primary file for these values.'],
                        fyi_color, ['display_primaryfileselect_drop()',"document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
}

async function start_second_dataset(){
    await add_to_carousel(['Select Secondary File'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);         //"document.getElementById('carouselcontainer" + (carousel_num + 1) +"').style.textAlign = 'center';"
    await add_to_carousel(['The secondary file contains the data you want to extract.',
                    'It needs to have values in common with your primary sheet.', 
                    'The values from the primary sheet will be searched for in your secondary sheet.'],
                    fyi_color, ['display_secondaryfileselect_drop()',"document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
}



async function display_conditions(){
    //document.getElementById('carouselcontainer10').style.display = 'none';
    //document.getElementById('carouselcontainer11').style.display = 'none';
    hide_containers(2);
    var cond_count = 1;
    var condition_string = null;
    await add_to_carousel('Filer primary data ' + (condition_arr.length) + ' conditions:', standard_color, [null], true, false);
    for (var i = condition_arr.length-1; i >= 0; i--){   
        if (condition_arr[i][4].length === 0){        
            condition_string = '\xa0\xa0$\xa0' + condition_arr[i][1] + ' ' + condition_arr[i][2] + ' ' + condition_arr[i][3]
        }
        else{
            condition_string = '\xa0\xa0$\xa0' + condition_arr[i][1] + ' ' + condition_arr[i][2] + ' ' + condition_arr[i][3] + ' and ' + condition_arr[i][4]
        }
        await add_to_carousel(condition_string, standard_color, [null], true, false);
        cond_count++;
    }
    //await add_to_carousel('---------Secondary Data---------------', standard_color, [null], true, false);
    start_second_dataset();
}

async function display_conditions2(){
    hide_containers(2);
    var cond_count = 1;
    var condition_string = null;
    await add_to_carousel('Filer secondary data ' + (condition_arr2.length) + ' conditions:', standard_color, [null], true, false);
    for (var i = condition_arr2.length-1; i >= 0; i--){   
        if (condition_arr2[i][4].length === 0){        
            condition_string = '\xa0\xa0$\xa0' + condition_arr2[i][1] + ' ' + condition_arr2[i][2] + ' ' + condition_arr2[i][3]
        }
        else{
            condition_string = '\xa0\xa0$\xa0' + condition_arr2[i][1] + ' ' + condition_arr2[i][2] + ' ' + condition_arr2[i][3] + ' and ' + condition_arr2[i][4]
        }
        await add_to_carousel(condition_string, standard_color, [null], true, false);
        cond_count++;
    }
    //await add_to_carousel('---------Upload Data Complete---------', standard_color, [null], true, false);
    //matchcolumns()
    algo_menu()
}

async function algo_menu(){
    await add_to_carousel(['Select algorithm type:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);         //"document.getElementById('carouselcontainer" + (carousel_num + 1) +"').style.textAlign = 'center';"
    await add_to_carousel(['Expand each algorithm type to view descriptions and examples.'], fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    document.getElementById('algomenu').style.display = 'block';
} 

async function matchcolumns(){
    await add_to_carousel(['Find values from primary dataset in secondary dataset.'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    await add_to_carousel(['Select columns with values in primary and secondary datasets.'], fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    document.getElementById('matchcolumnscontainer').style.display = 'block';
    document.getElementById('matchprimarycolumn').style.display = 'block';
    document.getElementById('matchsecondarycolumn').style.display = 'block';

    var col_headers = createTable_values1[0];
    populate_drop_down("#matchprimary_ul", col_headers, true);
    var col_headers = createTable_values2[0];
    populate_drop_down("#matchsecondary_ul", col_headers, true);
    $('#matchprimaryfilename').text('[' + primary_file_name + ' (' + primary_sheet_name +')]');
    $('#matchsecondaryfilename').text('[' + secondary_file_name + ' (' + secondary_sheet_name + ')]');


}

async function display_primaryfileselect_drop(){
    // select primary file
    populate_drop_down('#primaryfile_ul', unique_file_names, true)
    document.getElementById('primaryfiledrop').style.display = 'block';
}

// select primary sheet
function display_primaryfilesheets_drop() {
    populate_drop_down('#primarysheet_ul', primary_file_sheets, true)
    document.getElementById('primarysheetdrop').style.display = 'block';
}

async function display_secondaryfileselect_drop(){
    populate_drop_down('#secondaryfile_ul', unique_file_names, true)
    document.getElementById('secondaryfiledrop').style.display = 'block';
}

// select secondary sheet
function display_secondaryfilesheets_drop() {
    populate_drop_down('#secondarysheet_ul', secondary_file_sheets, true)
    document.getElementById('secondarysheetdrop').style.display = 'block';
}

function display_add_conditions_btn(){
    document.getElementById('primarycondition-container').style.display = 'block';
}

function display_add_conditions_btn2(){
    document.getElementById('secondarycondition-container').style.display = 'block';
}

function display_colselect_table(){
    document.getElementById('colselecttablecontainer').style.display = 'block';
}

function hide_containers(num_to_hide){
    var current_cont = carousel_num - 1;
    for (var i = 0; i < num_to_hide; i++){
        var container = 'carouselcontainer' + current_cont;
        document.getElementById(container).style.display = 'none';
        current_cont--;
    }
}

// using array to populate dropdown values
function populate_drop_down(dropdown_id, val_arr, is_to_be_cleared=false){
    if(is_to_be_cleared){
        $(dropdown_id).empty();
    }
    var options = $(dropdown_id);
    $.each(val_arr, function(v) {
            options.append($("<li><a class='dropdown-item'>" + val_arr[v] + "</a></li>"));
    });
}


function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

// return number of coursel elemnts already added
function get_num_carousel_containers(){
    var $div = $('div[id^="carouselcontainer"]:last');
    var num = $div.prop("id").slice(-1);
    num++;
    return num;
}

function updateFontColor(eleRef, color) {
  $(eleRef).css('color', color);
}

async function deleteSentence(eleRef) {
  const sentence = $(eleRef).html();
  const letters = sentence.split("");
  let i = 0;
  while(letters.length > 0) {
    await waitForMs(100);
    letters.pop();
    $(eleRef).html(letters.join(""));
  }
} 

// given 2 keys, find the unique pairs of each key from json object with multiple keys
function distinct_val_by_key(data_json, key1, key2, filename) {
    result_arr = [];
    // get array of distinct values for key 1
    distinct_key1 = uniq_fast(data_json, key1);
    // for each value in distinct key 1 array
    for (var distinct_i = 0; distinct_i < distinct_key1.length; distinct_i++) {
        // result is {result_key : key2_arr} appended to result_arr
        obj = {};
        key2_arr = [];
        result_key = distinct_key1[distinct_i];
        // search through json data
        for (var i = 0; i < data_json.length; i++) {
            distinct_key_val = String(data_json[i][key1]);
            // if json object key 1 value equals to ith distinct key
            if (distinct_key_val === result_key) {
                val = String(data_json[i][key2]);
                found = false;
                for (var j = 0; j < key2_arr.length; j++) {
                    j_val = key2_arr[j];
                    if (val === j_val) {
                        found = true;
                    }
                }
                if (!found) {
                    key2_arr.push(val)
                }
            }
        }
        obj[result_key] = key2_arr;
        result_arr.push(obj);
    }
    return result_arr
}

function get_file_sheets(file_name) {
    var file_sheets = distinct_val_by_key(data_json, 'file_name', 'sheet_name');
    for (var elem of file_sheets) {
        var key = Object.keys(elem)[0];
        if (key === file_name) {
            return elem[file_name];
        }
    }
}


async function primary_sheet_selection(){
    if (primary_file_sheets.length > 1) {
        await add_to_carousel(['Select worksheet from primary file'], action_color,  ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
        await add_to_carousel(['The selected worksheet should contain the data to search for in other datasets.', 'You can search for this data in other sheets from the same workbook.'], fyi_color,["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')", 'display_primaryfilesheets_drop()'], false, true); 
    }
    else{
        primary_sheet_name = "Sheet1";
        await add_to_carousel('Primary sheet: Sheet1 (default - file only has one sheet)', standard_color, ['adjust_col_header()'], true, false);
    }   
}

async function secondary_sheet_selection(){
    if (secondary_file_sheets.length > 1) {
        await add_to_carousel(['Select worksheet from secondary file'], action_color,  ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
        await add_to_carousel(['The selected worksheet should contain the data to search for in other datasets.', 'You can search for this data in other sheets from the same workbook.'], fyi_color,["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')", 'display_secondaryfilesheets_drop()'], false, true); 
    }
    else{
        secondary_sheet_name = "Sheet1";
        await add_to_carousel('Secondary sheet: Sheet1 (default - file only has one sheet)', standard_color, ['adjust_col_header2()'], true, false);
    }   
}

function adjust_col_header(){
    add_to_carousel(['Change column headers'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    add_to_carousel(['Current column headers are highlighted in white.','If your column headers are not on the first row, then click on the row containing your column headers.'], fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    document.getElementById("colselecttablediv1").style.display = "block";
    col_headers = populate_table_element(primary_sheet_name, 1, 'data1_tableid');
}

function adjust_col_header2(){
    add_to_carousel(['Change column headers'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    add_to_carousel(['Current column headers are highlighted in white.','If your column headers are not on the first row, then click on the row containing your column headers.'], fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    document.getElementById("colselecttablediv2").style.display = "block";
    col_headers = populate_table_element(secondary_sheet_name, 2, 'data2_tableid');
}

function populate_table_element(selected_sheet, tablenumber, data_tableid){
    //const data_json = JSON.parse(document.getElementById('data_dump').textContent); // get original json data gain
    //unique_file_names = uniq_fast(data_json, 'file_name');  // calcualte file names  
    var col_headers = null;
    if (tablenumber === 1){
        var repivoted_data = repivot_keyval(data_json, primary_file_name, selected_sheet);
        createTable_values1 = createTable(repivoted_data, data_tableid);
        col_headers = createTable_values1[0];
        var createTable_html = createTable_values1[1];
        table_html_obj_arr = parse_table_column_values(createTable_html);
    }
    else{
        var repivoted_data = repivot_keyval(data_json, secondary_file_name, selected_sheet);
        createTable_values2 = createTable(repivoted_data, data_tableid);
        col_headers = createTable_values2[0];
        var createTable_html = createTable_values2[1];
        table_html_obj_arr2 = parse_table_column_values(createTable_html);
    }
    return col_headers;
}

function repivot_keyval(data_json, file_name, sheet_name) {
    result_table = [];
    // not super sure what this does --- it unpivots to original json object with file_name, sheet_name, key, value
    var entries = Object.entries(data_json);
    var objs = [];
    var col_obj = {};
    // for each record in object of unpivoted
    for(var i=0; i<entries.length; i++)
    {
        // if file_name and sheet_name match required file and sheet
        if(entries[i][1]['file_name'] === file_name && entries[i][1]['sheet_name'] === sheet_name)
        {
            // search list of objects to see if column header exists. if it does then add to it's value array. else create new obj and add to array
            if(objs.some(e => e.col_header === entries[i][1]['key']))
            {
                // get the index of the found object
                const obj_i = objs.findIndex(e => e.col_header === entries[i][1]['key']);
                // double check if index exists
                if(obj_i > -1)
                {
                    // if found. extend its array of values
                    objs[obj_i].vals.push(entries[i][1]['val']) ;
                }
            }
            else
            {   
                // if object doesn't exist in object array then add it
                var obj = {col_header: entries[i][1]['key'], vals : [entries[i][1]['val']]};
                objs.push(obj);
            }
        }
    }
    console.log('Original Data')
    for (var i = 0; i < objs.length; i++){
        console.log(objs[i])
    }
    return objs;
}


// populate html table from repivoted key value db table
// specified_header_row is when user clicks on table to change header row
function createTable(objs, table_id, specified_header_row=0, max_col_display=5) {  
    var table_length = objs[0]['vals'].length;
    var tbody = document.getElementById(table_id);
    tbody.innerHTML = '';
    var tr = '<tr>'; 
    var isAllValsCollected = false;
    var maxRowsReached = false;
    var obj_elem_iter = specified_header_row;
    var tr = '<tr>';
    var col_headers = []
    //var max_col_display = 9;
    var col_display = 0;
    var all_html = '';
    // while still iterating thru each objects header + vals
    while(!isAllValsCollected){
        // if === 0 then collect headers
        if (obj_elem_iter === specified_header_row)
        {
            for (var i = 0; i < objs.length; i++) {
                // if header row is row 0 then use col_header object
                if (specified_header_row === 0)
                {
                    if (objs[i].col_header.includes('Unnamed:') || objs[i].col_header === 'nan')
                    {
                        var th = '<th>' + '' + '</th>';
                        //col_headers.push(''); Do not add to column header array if blank
                    }
                    else
                    {
                        var th = '<th>' + objs[i].col_header + '</th>';
                        col_headers.push(objs[i].col_header);
                    }
                }
                else
                {
                    // if header row is not 0 then use object value at specified_header_row
                    var th = '<th>' + objs[i].vals[specified_header_row-1] + '</th>';
                    if (objs[i].vals[specified_header_row-1].includes('Unnamed:') || objs[i].vals[specified_header_row-1] === 'nan')
                    {
                        var th = '<th>' + ' ' + '</th>';
                        //col_headers.push('');  Do not add to column header array if blank
                    }
                    else
                    {
                        var th = '<th>' + objs[i].vals[specified_header_row-1] + '</th>';
                        col_headers.push(objs[i].vals[specified_header_row-1]);
                    }
                }
                
                tr += th;
            }
            tr += '</tr>';
            // append header to inner html
            if(!maxRowsReached)
            {
                tbody.innerHTML += tr;
            }
            all_html += tr;
        }
        else
        {   
            // if not header collect object and append to inner html
            var tr = '<tr>';
            for (var i = 0; i < objs.length; i++) {
                if(objs[i].vals[obj_elem_iter-1] === 'nan')
                {
                    tr  += '<td>' + '' + '</td>';
                }
                else
                {
                    tr  += '<td>' + objs[i].vals[obj_elem_iter-1] + '</td>';
                }
            }
            tr += '</tr>';
            if(!maxRowsReached)  
            {
                tbody.innerHTML += tr; 
            }
            all_html += tr;
        }
        obj_elem_iter++;
        col_display++;
        // if number of rows displayed equal max display value then add elipsis to end of every column
        if (col_display === max_col_display)
        {
            var tr = '<tr>';
            for (var i = 0; i < objs.length; i++) {
                tr  += '<td>' + '.....' + '</td>';
            }
            tr += '</tr>';
            tbody.innerHTML += tr;
            all_html += tr;
            maxRowsReached = true;
        }                   
        // if iter > then length of the objects value array then exit loop
        if (obj_elem_iter > table_length)
        {
            isAllValsCollected = true;
        }  

    }
    var table_inner_html = all_html;
    return [col_headers, table_inner_html];
}

function parse_table_column_values(table_html){
    var header_val_obj_arr = [];
    var tr_chunks = table_html.split('</tr>');
    var headers_dirty = tr_chunks[0].split('</th>');
    var headers = [];
    // create array of column headers
    for (var i = 0; i<headers_dirty.length; i++){
        var header_arr = headers_dirty[i].split('<th>');
        var header = header_arr[header_arr.length - 1];
        headers.push(header);
    }
    // for each column header
    for (var i = 0; i<headers.length-1; i++){
        var col_vals = [];   
        col_vals.push(headers[i]);
        // iterate over values selecting td in ith position
        for (var j = 1; j<tr_chunks.length; j++){
            var obj = {};
            var tr_vals = tr_chunks[j].split('</td>');  
                if(tr_chunks[j].length > 0){           
                // last element is blank - remove it
                tr_vals.splice(-1);
                var tr_val = tr_vals[i].split('<td>');
                var tr = tr_val[tr_val.length - 1];
                // if value is not equal to placeholder then create object with header as key and col values as value
                if(tr != '.....')
                {
                    obj[headers[i]] = tr;
                    header_val_obj_arr.push(obj);
                }
            }
        }
    }
    return header_val_obj_arr;
}

function filter_data(table){
    var col_headers = '';
    var createTable_html = '';
    var conditions = null;
    if (table === 'table1')
    {
        col_headers = createTable_values1[0];
        createTable_html = createTable_values1[1];
        conditions = condition_arr;
    }
    else
    {
        col_headers = createTable_values2[0];
        createTable_html = createTable_values2[1];
        conditions = condition_arr2;
    }
    var table_obj_arr = parse_table_column_values(createTable_html);
    // index if each row which is to be included
    var rows_to_exclude = []; 
    var current_row = -1;
    var current_header = Object.keys(table_obj_arr[0])[0];
    for (var table_i=0; table_i<table_obj_arr.length; table_i++){
        var column_header = Object.keys(table_obj_arr[table_i])[0];
        var column_val =  Object.values(table_obj_arr[table_i])[0];
        if (column_header === current_header)
        {
            current_row++; 
        }
        else
        {
            current_row=0;
            current_header = column_header;   
        }   
        for (var cond_i=0; cond_i<conditions.length; cond_i++){
            var cond_header = conditions[cond_i][1];
            if (column_header === cond_header)
            {
                var cond_andor = conditions[cond_i][0];
                var cond_type = conditions[cond_i][2];
                var cond_val = conditions[cond_i][3];
                var cond_and_val = conditions[cond_i][4];
                if (!check_condition(cond_type, cond_val.toLowerCase(), cond_and_val.toLowerCase(), column_val.toLowerCase()))
                {                    
                    rows_to_exclude.push(current_row);
                }
            }
        }
    }
    var trimmed_table = exclude_rows(rows_to_exclude, table_obj_arr);
    return trimmed_table;
}

function exclude_rows(rows_to_exclude, table_obj_arr){
    var current_row = -1;
    var trimmed_table = [];
    current_header = Object.keys(table_obj_arr[0])[0];
    for (var table_i=0; table_i<table_obj_arr.length; table_i++){
        var column_header = Object.keys(table_obj_arr[table_i])[0]
        var column_val =  Object.values(table_obj_arr[table_i])[0]
        if (column_header == current_header)
        {
            current_row++;       
        }
        else
        {
            current_row=0;
            current_header = column_header;
        }
        if (!rows_to_exclude.includes(current_row))
        {
            trimmed_table.push(table_obj_arr[table_i]);
        }
    }
    return trimmed_table;
}

function check_condition(cond_type, cond_val, cond_and_val, column_val){
    var result = false;
    if (cond_type === 'Equals')
    {
        if(cond_val === column_val) {result = true;}
    } 
    if (cond_type === 'Contains')
    {
        if(column_val.includes(cond_val)) {result = true;}
    } 
    if (cond_type === 'Between')
    {
        if(column_val >= cond_val && cond_and_val <= cond_val) {result = true;}
    } 
    if (cond_type === 'Greater Than')
    {
        if(column_val >= cond_val) {result = true;}
    } 
    if (cond_type === 'Less Than')
    {
        if(column_val <= cond_val) {result = true;}
    } 
    if (cond_type === 'Not Equal To')
    {
        if(column_val != cond_val) {result = true;}
    } 
    if (cond_type === 'Does Not Contain')
    {
        if(!column_val.includes(cond_val)) {result = true;}
    } 
    return result;
}
     
$(document).ready(function () {
     //catch the form's submit event
    $('#datafiltersform').submit(function () {
        console.log('ca1 '+ condition_arr)
        console.log('ca2 '+ condition_arr2)
        console.log(primary_file_name)
        console.log(primary_sheet_name)
        console.log(primary_header_row)
        console.log(secondary_file_name)
        console.log(secondary_sheet_name)
        console.log(secondary_header_row)
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        // create an AJAX call
        $.ajax({
            data: {
                'primaryfile' : primary_file_name,
                'primarysheet' : primary_sheet_name,
                'primary_header_row' : primary_header_row,
                'secondaryfile' : secondary_file_name,
                'secondarysheet' : secondary_sheet_name,
                'secondary_header_row' : secondary_header_row,
                'conditions1' : JSON.stringify(condition_arr),
                'conditions2' : JSON.stringify(condition_arr2)
            }, // get the form data        $(this).serialize()
            type: $(this).attr('method'), // GET or POST
            headers: {
                "X-CSRFToken": getCookie("csrftoken")},
            //url: "{% url 'findandextract' %}",
            // on success
            success: function () {
                console.log("data submitted ");
            },
            // on error
            error: function (request, status, error) {
                // alert the error if any error occured
                //alert(response.responseJSON.errors);
                //console.log(response.responseJSON.errors)
                alert(request.responseText);
            }
        });
        return false;
    });   
})

$(document).ready(async function () {
    $(document.body).on('click', '#next_loadedfiles' ,function(){
     //catch the form's submit event
    //$('#next_loadedfiles').submit(function () {
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        var formData = new FormData();
        formData.append('file_1', $('input[type=file]')[0].files[0]); 
        if (typeof $('input[type=file]')[1].files[0] !== "undefined"){
            formData.append('file_2', $('input[type=file]')[1].files[0]);
        }
        if (typeof $('input[type=file]')[2].files[0] !== "undefined"){
            formData.append('file_3', $('input[type=file]')[2].files[0]);
        }
        if (typeof $('input[type=file]')[3].files[0] !== "undefined"){
            formData.append('file_4', $('input[type=file]')[3].files[0]);
        }
        console.log(FormData)
        // create an AJAX call
        $.ajax({
            data: formData, // get the form data        $(this).serialize()
            type: 'POST', // GET or POST
            contentType: false,
            processData: false,
            cache: false,
            enctype: 'multipart/form-data',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")},
            //url: "{% url 'findandextract' %}",
            // on success
            success: function () {
                console.log("file data submitted");
                ajax_get_db()
            },
            // on error
            error: function (request, status, error) {
                // alert the error if any error occured
                //alert(response.responseJSON.errors);
                //console.log(response.responseJSON.errors)
                alert(request.responseText);
            }
        });
        
        return false;
    });   
})

async function ajax_get_db(){
    var db_data = null;
    $.ajax({
        //data: data, 
        type: 'GET',
        headers: {
            "X-CSRFToken": getCookie("csrftoken")},
        //url: "{% url 'findandextract' %}",
        //url: 'findandextract/',
        // on success
        success: function (data) {
            console.log("data retreived ");
            start_primary_file(data);
        },
        // on error
        error: function (request, status, error) {
            // alert the error if any error occured
            //alert(response.responseJSON.errors);
            //console.log(response.responseJSON.errors)
            alert(request.responseText);
        }
    });
    return false;
}

// JavaScript function to get cookie by name; retrieved from https://docs.djangoproject.com/en/3.1/ref/csrf/
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function dumpCSSText(element){
  var s = '';
  var o = getComputedStyle(element);
  for(var i = 0; i < o.length; i++){
    s+=o[i] + ':' + o.getPropertyValue(o[i])+';';
  }
  return s;
}


// EXPANDING TREE
function force_text_background(class_name){
    console.log("adding background to nodes")
    var parent_nodes = document.getElementsByClassName(class_name);
    for (var i = 0; i<parent_nodes.length; i++){       
        var text_node = parent_nodes[i].getElementsByClassName('text-node')[0]
        var SVGRect = text_node.getBBox();
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", SVGRect.x);
        rect.setAttribute("y", SVGRect.y);
        rect.setAttribute("width", SVGRect.width);
        rect.setAttribute("height", SVGRect.height);
        rect.setAttribute("fill", "black");
        parent_nodes[i].insertBefore(rect, text_node);
    }               
}

function force_first_node_as_active(class_name, root_node_name){
    var parent_nodes = document.getElementsByClassName(class_name);
    for (var i = 0; i<parent_nodes.length; i++){
        var x_tempt = parent_nodes[i].getElementsByTagName("text")[0]
        if(x_tempt.__data__.data.name === root_node_name){
            parent_nodes[i].setAttribute("class", "node parent-node active");
        }
    }
}


$(document).ready(function () {
    var root_node_name = "Algorithm Type"
    var action_color = "coral";
    var standard_color = "white";
    var fyi_color = "cyan";
    var data = {
    name: root_node_name,
    children: [{
                name: "Search",
                children: [{
                        name: "One dataset",
                        children: [{
                                name: "Search for values from one file in another"
                                //image: "/static/images/search file from file.png"
                            },
                            {
                                name: "Enter custom values to search for in a file"
                                //image: "/static/images/search file from input.png"
                            }
                        ]
                    },
                    {
                        name: "Multiple datasets",
                        children: [{
                                name: "Search for values from one file in other files"
                                //image: "/static/images/search many from file.png"
                            },
                            {
                                name: "Enter custom values to search for in other files"
                                //image: "/static/images/search many from input.png"
                            }
                        ]
                    }
                ]
            },
            {
                name:"Modify",
                children: [{
                        name: "One dataset",
                        children: [{
                                name: "Update values based on another file",
                                image: "https://dummyimage.com/50x50"
                            },
                            {
                                name: "Update values based on custom conditions",
                                image: "https://dummyimage.com/50x50"
                            }
                        ]
                    },
                    {
                        name: "Multiple datasets",
                        children: [{
                                name: "Update files based on another file",
                                image: "https://dummyimage.com/50x50"
                            },
                            {
                                name: "Update files based on custom conditions",
                                image: "https://dummyimage.com/50x50"
                            }
                        ]
                    }
                ]
            },
            {
                name:"Combine",
                children: [{
                        name: "Combine two files",
                        children: [{
                                name: "Join on rows (merge horizontally)",
                                image: "https://dummyimage.com/50x50"
                            },
                            {
                                name: "Join on columns (append vertically)",
                                image: "https://dummyimage.com/50x50"
                            }
                        ]
                    },
                    {
                        name: "Combine more than two files",
                        children: [{
                                name: "Join on rows (merge horizontally)",
                                image: "https://dummyimage.com/50x50"
                            },
                            {
                                name: "Join on columns (append vertically)",
                                image: "https://dummyimage.com/50x50"
                            }
                        ]
                    }
                ]
            },
            {
                name:"Reconcile",
                children: [{
                        name: "Reconcile two files",
                        children: [{
                                name: "Find records that match",
                                image: "https://dummyimage.com/50x50"
                            },
                            {
                                name: "Find records that do not match",
                                image: "https://dummyimage.com/50x50"
                            },
                            {
                                name: "List all records and whether they match",
                                image: "https://dummyimage.com/50x50"
                            }
                        ]
                    }
                ]
            }
        ]
    };

    var margin = {
            top: 40, //20
            right: 180,   // 90
            bottom: 60,  //30
            left: 350     // 90
        },
        width = 4000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var svg = d3
        .select("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")       
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var i = 0,
        duration = 750,
        root;

    var treemap = d3.tree().size([height, width]);

    root = d3.hierarchy(data, function(d) {
        return d.children;
    });
    root.x0 = height / 2;
    root.y0 = 0;


    root.children.forEach(collapse);
    update(root);
    
    function update(source) {
        // Compute the new tree layout
        var treeData = treemap(root);

        // Normalize for fixed-depth
        var nodes = treeData.descendants(),
            links = treeData.descendants().slice(1);

        nodes.forEach(function(d) {
            d.y = d.depth * 340;   //d.y = d.depth * 180;
        });

        // Update the nodes
        var node = svg.selectAll("g.node").data(nodes, function(d) {
            return d.id || (d.id = ++i);
        });

        // Enter any new nodes at the parent's previous position
        var nodeEnter = node
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on("click", click);

        nodeEnter
            .append("circle")
            .attr("r", 1e-6)  //
            .style("fill", function(d) {
                return d._children ? action_color : fyi_color;  //return d._children ? "lightsteelblue" : "#fff";     action_color : fyi_color
            });

        // move text to front
        nodeEnter
            .append("text")  //text
            .attr("x", function(d) {
                return 50; //return d.children || d._children ? -13 : -13;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) {
                return "start";     //return d.children || d._children ? "end" : "start";
            })
            .attr("class", "text-node")
            .text(function(d) {
                return d.data.name;
            })
            .call(wrap, 300);
            

        nodeEnter
            .append("image")
            .attr("xlink:href", function(d) {
                return d.data.image;
            })
            .attr("x", 375)  //116
            .attr("y", -25)     //-25
            .attr("width", 75)       //50
            .attr("height", 75);         //50

         nodeEnter
            .attr("class", "node parent-node")         

        // Transition nodes to their new position
        var nodeUpdate = node
            .merge(nodeEnter)
            .transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });
        nodeUpdate
            .select("circle")
            .attr("r", 24)
            .style("fill", function(d) {
                return d._children ? '#c3b5c9' : '#f50707';               //return d._children ? "lightsteelblue" : "#fff";   action_color : fyi_color
            });

           
        // Transition exiting nodes to the parent's new position
        var nodeExit = node
            .exit()
            .transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();
        

        nodeExit.select("circle").attr("r", 1e-6);

        // Update the links
        var link = svg.selectAll("path.link").data(links, function(d) {
            return d.id;
        });

        // Enter any new links at the parent's previous position
        var linkEnter = link
            .enter()
            .insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal(o, o);
            });

        // Transition links to their new position
        link
            .merge(linkEnter)
            .transition()
            .duration(duration)
            .attr("d", function(d) {
                return diagonal(d, d.parent);
            });

        // Transition exiting nodes to the parent's new position
        link
            .exit()
            .transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal(o, o);
            })
            .remove();

        // Stash the old positions for transition
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        //force_text_background('parent-node');
        force_first_node_as_active('parent-node', root_node_name);
    }



    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {
        path = `M ${s.y} ${s.x}
                  C ${(s.y + d.y) / 2} ${s.x},
                    ${(s.y + d.y) / 2} ${d.x},
                    ${d.y} ${d.x}`;

        return path;
    }

    // Toggle children on click
    function click(event, d) {
        if (d.children) {
            //close node
            d._children = d.children;
            d.children = null; 
            //event.currentTarget.attr("class", "node parent-node active");
            $(event.currentTarget).removeClass("active"); 
            scroll_graph('algo-desc-graph', 'close');
        } else {
            // open node
            d.children = d._children;
            d._children = null;
            //event.currentTarget.attr("class", "node parent-node active");
             
            if (d.children){
                scroll_graph('algo-desc-graph', 'open');
                $(event.currentTarget).addClass("active");
            }            
            start_algo_path(d.data.name);
            
        }
        update(d);
    }

    // Collapse the node and all of its children
    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }
    function scroll_graph(svg_elem, action_type){
        //$('.node.parent-node.active').scrollLeft('500px');
        //$('.node.parent-node.active').last()[0].scrollIntoView()
        //myDiv.scrollLeft = myDiv.scrollWidth;
        var myDiv = document.getElementById(svg_elem);
        if (action_type === 'open'){
            myDiv.scrollLeft = myDiv.scrollLeft + 234;
        }
        else{
            myDiv.scrollLeft = myDiv.scrollLeft - 234;
        }
    }
});
function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),     
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 50).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 50).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

async function start_algo_path(node_name){
    if(node_name === 'Search for values from one file in another'){
        console.log('search file single')
        algorithm_type = 'search';
        input_type = 'file';
        input_num = 'single';        
        describe_search_file_multiple();
    }
    else if(node_name === 'Enter custom values to search for in a file'){
        console.log('search custom single')
        algorithm_type = 'search';
        input_type = 'custom';
        input_num = 'single';       
    }
    else if (node_name === 'Search for values from one file in other files'){
        console.log('search fle multiple')
        algorithm_type = 'search';
        input_type = 'file';
        input_num = 'multiple';        
        document.getElementById('algo-desc-graph').style.display = 'none';
        hide_containers(2);
        await add_to_carousel('Search Algorithm', standard_color, [], true, false);
        await add_to_carousel('\xa0\xa0\xa0$ Multiple Files', standard_color, [], true, false);
        await add_to_carousel('\xa0\xa0\xa0$ Search Input: File', standard_color, [], true, false);
        await add_to_carousel(['File Selection'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
        add_to_carousel(['Select files to include in algorithm.'], fyi_color, ['display_multiple_file_drops()', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    }
} 

async function describe_search_file_multiple(){
    document.getElementById('search-file-one').style.display = 'block';
    document.getElementById('searchfileone-btns').style.display = 'block';
    var element = document.getElementById('algo-desc-graph');
    element.scroll(-1000,500);
    window.focus();
    window.scrollTo(0,800);
}

$(document).ready(function() {
    var url = window.location.href;
    if( url.indexOf('#') < 0 ) {
        window.location.replace(url + "#");
    } else {
        window.location.replace(url);
    }
});

$(document).ready(async function () {
    $(document.body).on('click', '#back-algoselect' ,function(){
        document.getElementById('search-file-one').style.display = 'none';
        document.getElementById('searchfileone-btns').style.display = 'none';
        var url = window.location.href;
        if( url.indexOf('#') < 0 ) {
            window.location.replace(url + "#");
        } else {
            window.location.replace(url);
        }
    });
});


