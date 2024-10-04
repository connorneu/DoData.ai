"use strict";

var gv = {};

// var data_json = null;
var unique_file_names = null;
var unique_sheet_names = null;
var carouselText = [];
var carousel_num = 1;
var primary_file_name = null;
var primary_file_sheets = [];
var primary_sheet_name = 'Sheet1';
var secondary_file_name = null;
var secondary_file_sheets = [];
var secondary_sheet_name = 'Sheet1';
var third_file_name = null;
var third_sheet_name = 'Sheet1';
var third_file_sheets = [];
var fourth_file_name = null;
var fourth_sheet_name = 'Sheet1';
var fourth_file_sheets = [];
var createTable_values1 = '';
var createTable_values2 = '';
var createTable_values3 = '';
var createTable_values4 = '';
var condition_arr = [];
var condition_arr2 = [];
var condition_arr3 = [];
var condition_arr4 = [];
var table_html_obj_arr = null;
var table_html_obj_arr2 = null;
var table_html_obj_arr3 = null;
var table_html_obj_arr4 = null;
var primary_header_row = 0;
var secondary_header_row = 0;
var third_header_row = 0;
var fourth_header_row = 0;
var input_type = null;
var algorithm_type = null;
var newline_scroll = 50;
var start_scrolling_after = 10;
var input_or_description = '';
var max_file_upload = 4;
// maybe delete these
var dataset_names = [];
var dataset_index = [];
var values_to_extract_dataset = null;
var values_to_extract_col = null;
var extract_from = [];
var all_my_sentences = [];
var algo_desc = null;
var max_file_upload = 0;
var extract_col = null;
var current_conditions_file = 0;

var input_color = '#d93095';
var second_color = '#92fcff';
var third_color = '#fcdd43';
var fourth_color = '#ac86db';
var writings_color = '#bf855b';

var color_array = [input_color, second_color, third_color, fourth_color, writings_color];

var myanime = null;

var root = null;
var treeData = null;

var action_color = "#ffd9cb"
var standard_color =  "#f57542"; 
var codexdisplaycolor = '#f5f1f0';
var fyi_color =  action_color;



$(document).ready(async function() {
    if (window.location.href.indexOf("excel_ai") > -1){
        myanime = gsap.to("#grad", 10, { attr: {  gradientTransform: "rotate(365, 255 1)" }, ease: Linear.easeNone, repeat: -1 })
        myanime.play();
        var path = window.location.pathname;
        var page = path.split("/").pop();
        //await gently_show_tree();
        await show_gpt_txt_box();
    }
});


async function show_gpt_txt_box(){
    await add_to_carousel('Create a desktop app that analyzes your data:', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);  
    await add_to_carousel('Describe what you want to do and create a Python app to keep your data offline', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, false);
    // await add_to_carousel('Never upload your data', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, false);
    // await add_to_carousel('Keep all your data private', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, false);
    document.getElementById('gpt-txt-wrap').style.display='block';
    document.getElementById('gpt-txt-area-wrap').style.display='block';
}


$(document).ready(function() {
    $("#gpt-desc").keypress(function (e) {
        if(e.which == 13) {
            submit_gpt_text();
        }
    });
});


$(document).ready(function () {
  
    /* Every time the window is scrolled ... */
    document.addEventListener('scroll', function (event) {
      /* Check the location of each desired element */
      $('.reveal').each(function (i) {
        var bottom_of_object = $(this).offset().top + $(this).outerHeight();
        var bottom_of_window = $(window).scrollTop() + $(window).height();
        /* If the object is completely visible in the window, fade it in */
        if (bottom_of_window > (bottom_of_object*.6)) {
          $(this).animate({ 'opacity': '1' }, 1500);
          /* 1500 is the duration of fade effect */
        }
      });
    }, true /*Capture event*/);
  });




async function show_desc_box(){
    await add_to_carousel('Describe what you want to do:', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    //await add_to_carousel('An algorithm type will be suggested', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    document.getElementById('confirm-algo-select').style.display='block';
    document.getElementById('describe-algo-banner').style.display='block';
    document.getElementById('textbox-algo-desc-wrap').style.display='block';
}

function fake_start(){
    console.log('fake start')
    document.getElementById('describe-algo-banner').style.display='none'
    var desc = 'Select rows '
    start_algo_path('START', 'Group', desc);
}

async function add_to_carousel(text_new, color_new, func_new, isTyped_new, carousel_break_new){
  
    return new Promise((resolve, reject) => {    
        var id_new = '#feature-text' + carousel_num;
        var carousel_obj = {id:id_new, text:text_new, color:color_new, func:func_new, isTyped: isTyped_new, carousel_break: carousel_break_new};
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

async function home_page_carousel(idnew, text_new, color_new, func_new, isTyped_new, carousel_break_new){
  
    return new Promise((resolve, reject) => {    
        var id_new = idnew;
        var carousel_obj = {id:id_new, text:text_new, color:color_new, func:func_new, isTyped: isTyped_new, carousel_break: carousel_break_new};
        var carousel_result = carousel(carousel_obj, true)  
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


// 20
//type speed 10 is a good nunmber
async function typeSentence(sentence, eleRef, color, delay = 10) {
  all_my_sentences.push(sentence);
  var clean_id = 'span' + eleRef.substring(1);
  var eleRefSpan = '#' + clean_id;
  const letters = sentence.split("");
  var arr = [];
  let i = 0;var is_spaned = false; 
  while(i < letters.length) {
    await waitForMs(delay);
    if(letters[i-1] === ':' || letters[i-1] === '$'){
        is_spaned = true;
        $(eleRef).append('<span id="' + clean_id + '" style="color:' + color + ';">')   
    }
    if(!is_spaned){
      $(eleRef).append(letters[i]);    
    }
    else{
      var curr_text = $(eleRefSpan).text()
      $(eleRefSpan).text(curr_text + letters[i]);
    }
    
    i++
  }
  return;
}


// for sentences too long to be typed out - accepts array of sentences and adds the faded class so they fade in slowly
async function displaySentence(sentences, eleRef, color)
{
    $(eleRef).addClass('faded');
    var clean_id = 'span' + eleRef.substring(1);
    var eleRefSpan = '#' + clean_id;
    for(var i=0;i<sentences.length;i++)
    {
        var is_spaned = false;
        const letters = sentences[i].split("");
        var j = 0;
        while(j < letters.length) {
            if(letters[j-1] === ':' || letters[j-1] === '$'){
                is_spaned = true;
                $(eleRef).append('<span id="' + clean_id + '" style="color:' + color + ';">')   
            }
            if(!is_spaned){
                $(eleRef).append(letters[j]);    
            }
            else{
                var curr_text = $(eleRefSpan).text()
                $(eleRefSpan).text(curr_text + letters[j]);
            }
            
            j++
        }


        //$(eleRef).append(sentences[i]);
        //if theres more than 1 sentence add line break - dont add linebreak if there are no more sentences
        if(sentences.length > 1 && i<sentences.length-1) {
            linebreak = document.createElement("br");
            $(eleRef).append(linebreak);
        }
    }   
    //await waitForMs(120);
}

async function add_linebreak_to_carousel(eleRef){
    linebreak = document.createElement("br");
    $(eleRef).append(linebreak);
}

// updates parameter that is null when put into carousel but gets value thru user selection
function update_item_text_params(carouselItem_param) {
    return carouselItem_param
}

function waitForMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function carousel(carousel_obj, isHomeCarousel=false) {
    if (!isHomeCarousel){
        carousel_num++;  
    }
    create_carousel_elem(carousel_obj);  // if elem doesn't exist create it
    //only run functions that update text params until after text is written
    for(var j=0;j<carousel_obj.func.length;j++)
    {
        // if func is null includes throws error
        if (carousel_obj.func[j] != null) {
            //if function includes then append result to carouselList - THIS WILL BE AN ISSUE because it only appends to end of text
            if (carousel_obj.func[j].includes('update_item_text_params')) {
                var text_obj_type = typeof carousel_obj.text
                carousel_obj.text += eval(carousel_obj.func[j])
                if (text_obj_type === 'object'){
                    carousel_obj.text = [carousel_obj.text]
                }
            }
        }
    }
    updateFontColor(carousel_obj.id, carousel_obj.color)
    // evaluate functions after text has been written
    for(var j=0;j<carousel_obj.func.length;j++)
    {
    // if func is null includes throws error
        if (carousel_obj.func[j] != null) {
            if (!carousel_obj.func[j].includes('update_item_text_params')){
                await eval(carousel_obj.func[j]);//run functions inside carousel item     
            }
            if (carousel_obj.func[j].includes('add_linebreak_to_carousel')){
                await add_linebreak_to_carousel(carousel_obj.id);
            }
        }
    }

    if (carousel_num > 3){
        //document.getElementById("printitout").style.minHeight = 378 + "px";
        var element = document.getElementById('typingtextcontainer');
        element.scrollIntoView(false);
        element.scroll(-1000,500);
        window.focus();
        //window.scrollTo(0,800);
    }

    if (carousel_obj.isTyped)
    {
        center_action_text(carousel_obj.text, carousel_obj.id)
        await typeSentence(carousel_obj.text, carousel_obj.id, carousel_obj.color);
    }
    else
    {
        await displaySentence(carousel_obj.text, carousel_obj.id, carousel_obj.color);
    }
    return true;
}


function center_action_text(obj_text, obj_id_raw){
    var actionfyi_spacing = 12; // 9 is a random number fuckface
    var action_spacing = 13;
    var obj_id = obj_id_raw.replace('#', '');
    var actionfyi_elem = document.getElementById(obj_id);
    var carousel_parent = actionfyi_elem.closest('.carouselcontainer');
    if (carousel_parent !== null){
        if (carousel_parent.classList.contains('actionfyi') || carousel_parent.classList.contains('action')){
            if (carousel_parent.classList.contains('actionfyi')){
                var spacing = actionfyi_spacing;
            }
            else{
                var spacing = action_spacing;
            }
            var typingcontainer_width = document.getElementById('printitout').offsetWidth;
            var adjustment = ((typingcontainer_width - (obj_text.length * spacing)) / 2) + 'px'; 
            actionfyi_elem.style.marginLeft = adjustment;
        }
    }   
}



// NOT USED
function adjust_glass_height(){
    var typingcontainer_height = document.getElementById('typingtextcontainer').offsetHeight;
    console.log('typing container height' + typingcontainer_height)
    var glass_elem = document.getElementById('glass-pane-wrap-i');
    var typing_container = document.getElementById('typing-container1');
    var containers = typing_container.getElementsByClassName('carouselcontainer');
    console.log('containers ' + containers.length)
    var num_active_containers = 0;
    var active_container_height = 0.0;
    for(var i=0;i<containers.length;i++){
        if((containers[i].classList.contains('action') || containers[i].classList.contains('actionfyi')) && containers[i].style.display === 'block'){
            num_active_containers ++;
            active_container_height = containers[i].offsetHeight;
        }
    }
    console.log('activecontainers ' + num_active_containers)
    console.log('height ' + active_container_height)
    var adjusted_height = typingcontainer_height - (num_active_containers * active_container_height) + "px";
    console.log('setting height ' + adjusted_height)
    glass_elem.style.height = adjusted_height;
}

// create carousel element if it doesnt exist
async function create_carousel_elem(carousel_item){
    // get carousel id
    var carousel_elem_id = carousel_item.id;
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

function uniq_fast_files(obj, att1, att2) {
    var seen = {};
    var out = [];
    var out_clean = [];
    var len = obj.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = obj[i][att1] + '|' + obj[i][att2];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    for(var i=0;i<out.length;i++){
        out_clean.push(out[i].split('|')[0]);
    }
    return out_clean;
}

async function display_multiple_file_drops(){
    document.getElementById('filedrops').style.display = 'block';
    document.getElementById('data_post_form').style.display='block';
    //    addsecondfile click event decides how many files are displayed
}

async function display_algo_graph(){
    document.getElementById('algo-desc-graph').style.display = 'block';
}

async function start_data_filter(db_data){  
    document.getElementById('filedrops').style.display = 'none';
    hide_containers(3);
    gv.data_json = db_data['fande_data_dump'];
    //data_json = JSON.parse(document.getElementById('fande_data_dump').textContent);
    unique_file_names = uniq_fast_files(gv.data_json, 'file_name', 'sheet_name');  // calcualte file names 
    unique_sheet_names = uniq_fast_files(gv.data_json, 'sheet_name', 'file_name'); 
    for (var i = 0; i<unique_file_names.length; i++){
        if(i === 0){
            await add_to_carousel('Loaded file: ' + unique_file_names[i], input_color, [null], true, false);
        }
        else if(i === 1){
            await add_to_carousel('Loaded file: ' + unique_file_names[i], second_color, [null], true, false);
        }
        else if(i === 2){
            await add_to_carousel('Loaded file: ' + unique_file_names[i], third_color, [null], true, false);
        }
        else if(i === 3){
            await add_to_carousel('Loaded file: ' + unique_file_names[i], fourth_color, [null], true, false);
        }         
    }
    //edit_data();
    decide_algo_path(algorithm_type);
}

async function edit_data(){
    populate_file_names();
    populate_dataset_names();
    populate_table_element(primary_sheet_name, 1, 'mini_table1', null, 5);
    var table_div = document.getElementById('mini_table1').closest('.mini-table-wrap');
    table_div.style.display = 'block';
    if (secondary_file_name != null){
        populate_table_element(secondary_sheet_name, 2, 'mini_table2', null, 5);
        var table_div = document.getElementById('mini_table2').closest('.mini-table-wrap');
        table_div.style.display = 'block';
    }
    if (third_file_name != null){
        populate_table_element(third_sheet_name, 3, 'mini_table3', null, 5);
        var table_div = document.getElementById('mini_table3').closest('.mini-table-wrap');
        table_div.style.display = 'block';
    }
    if (fourth_file_name != null){
        populate_table_element(fourth_sheet_name, 4, 'mini_table4', null, 5);
        var table_div = document.getElementById('mini_table4').closest('.mini-table-wrap');
        table_div.style.display = 'block';
    }
    if (third_file_name == null && fourth_file_name == null){
        var table_div = document.getElementById('mini_table4').closest('.mini-table-row');
        table_div.style.display = 'none';
    }
    populate_mini_table_headers();
    await add_to_carousel('Edit data:', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false); 
    await add_to_carousel('Filter data or adjust column headers, if necessary', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, false); 
    document.getElementById('edit-data-tables').style.display = "block";
    if (algorithm_type === 'Filter'){
        $('#nextbtns-edit-tables').hide();
    }
}

function populate_mini_table_headers(){
    var table_names = user_tables_as_array_with_brackets();
    console.log('names')
    console.log(table_names)
    var all_tables = document.getElementsByClassName('mini-table-wrap');
    for (var i=0; i<all_tables.length; i++){
        var table = all_tables[i];
        var header = table.getElementsByTagName('h2')[0];
        header.innerHTML = table_names[i];
        header.style.color = color_array[i];
        //table.style.display = 'block';
    }
}

function user_tables_as_array_with_brackets(){
    var table_array = [primary_file_name + ' {' + primary_sheet_name + '}'];
    if (typeof secondary_file_name !== 'undefined'){
        table_array.push(secondary_file_name + ' {' + secondary_sheet_name + '}')
    }
    if (typeof third_file_name !== 'undefined'){
        table_array.push(third_file_name + ' {' + third_sheet_name + '}')
    }
    if (typeof fourth_file_name !== 'undefined'){
        table_array.push(fourth_file_name + ' {' + fourth_sheet_name + '}')
    }
    return table_array
}


async function decide_algo_path(algorithm_type)
{
    //await add_to_carousel('', 'white', ['add_linebreak_to_carousel()'], true, false);
    console.log('algorithm_type ' + algorithm_type)
    if (algorithm_type === 'Extract'){
        start_extract_file();
    }
    else if(algorithm_type === 'Combine'){
        start_combine_file();
    }
    else if (algorithm_type === 'Update'){
        start_update_file();
    }
    else if (algorithm_type === 'Reconcile'){
        start_reconcile();
    }
    else if (algorithm_type === 'Calculate'){
        start_calculate_path();
    }
    else if (algorithm_type === 'Columns'){
        start_columns_path();
    }
    else if (algorithm_type === 'Describe Algorithm'){
        start_describe_path();
    }

}

async function start_extract_custom(){
    await add_to_carousel(['Enter in the values to search for in other documents:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false); 
    await add_to_carousel(['These are the values that will be searched for in other documents.',
                        'Each of these values will be searched for in the other files uploaded.',
                        'You will speicfy where in the other files these values wil be searched and any conditions that need apply.'],
                        fyi_color, ['display_primaryfileselect_drop()',"document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
}

async function start_combine_rows(){
    await add_to_carousel(['Select the file to combine with other uploaded files:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false); 
    await add_to_carousel(['This file has a column of values that can be found in the other uploaded datasets.',
                        'When these values are found in other files, data from selected columns will be added to this dataset at the corresponding row.'],
                        fyi_color, ['display_primaryfileselect_drop()',"document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
}

async function start_combine_column(){
    await add_to_carousel(['Select the file to combine with other uploaded files:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false); 
    await add_to_carousel(['Specify which column name from this dataset should be matched with the column names from other files.',
                        'The data from the corresponding columns in the other files will be appended to this dataset.'],
                        fyi_color, ['display_primaryfileselect_drop()',"document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
}

async function start_second_dataset(){
    dataset_headers = describe_dataset_headers();
    var algo_dataset_desc = dataset_headers[0];
    var algo_sub_desc = dataset_headers[1];
    await add_to_carousel([algo_dataset_desc], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    await add_to_carousel([algo_sub_desc],
                    fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')", "display_secondaryfileselect_drop()"], false, true);
}

async function start_third_dataset(){
    dataset_headers = describe_dataset_headers();
    var algo_dataset_desc = dataset_headers[0];
    var algo_sub_desc = dataset_headers[1];
    await add_to_carousel([algo_dataset_desc], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    await add_to_carousel([algo_sub_desc],
                    fyi_color, ['display_thirdfileselect_drop()',"document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
}

async function start_fourth_dataset(){
    dataset_headers = describe_dataset_headers();
    var algo_dataset_desc = dataset_headers[0];
    var algo_sub_desc = dataset_headers[1];
    await add_to_carousel([algo_dataset_desc], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    await add_to_carousel([algo_sub_desc],
                    fyi_color, ['display_fourthfileselect_drop()',"document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
}

function describe_dataset_headers(){
    var algo_dataset_desc = null;
    var algo_sub_desc = null;
    if (algorithm_type === 'Extract'){
        algo_dataset_desc = 'Select dataset to extract from:'
        algo_sub_desc = 'This dataset contains the values that will be extracted.'
    }
    return [algo_dataset_desc, algo_sub_desc]
}

async function display_conditions(condition_arr, header_row, file_name, sheet_name){
    hide_containers(3);
    var color = null;
    var mini_table_name = '';
    var sheet = sheet_name;
    var filenum = 0;
    if (file_name === primary_file_name){
        color = input_color;
        mini_table_name = 'mini_table1';
        sheet = primary_sheet_name;
        filenum = 1;
    }
    else if (file_name === secondary_file_name){
        color = second_color;
        mini_table_name = 'mini_table2';
        sheet = secondary_sheet_name;
        filenum = 2;
    }
    else if (file_name === third_file_name){
        color = third_color;
        mini_table_name = 'mini_table3';
        sheet = third_sheet_name;
        filenum = 3;
    }
    else if (file_name === fourth_file_name){
        color = fourth_color;
        mini_table_name = 'mini_table4';
        sheet = fourth_sheet_name;
        filenum = 4;
    }
    if (header_row > 0){
        await add_to_carousel('Header row updated: ' + (parseInt(header_row,10) + 1), color, [null], true, false);
    }
    var cond_count = 1;
    var condition_string = null;
    await add_to_carousel('\xa0\xa0\xa0' + 'Filter: ' + file_name + ' {' + sheet_name + '}', color, [null], true, false);
    if (condition_arr.length === 1 && condition_arr[0][1] === 'Select Column' &&  condition_arr[0][2] === 'Equals'){
        condition_string = '\xa0\xa0\xa0' + '\xa0\xa0\xa0' + 'No conditions applied';
        await add_to_carousel(condition_string, color, [null], true, false);
    }
    else{
        for (var i = condition_arr.length-1; i >= 0; i--){
            if (condition_arr[i][4].length === 0){        
                condition_string = '\xa0\xa0\xa0' + '\xa0\xa0$\xa0' + condition_arr[i][1] + ' ' + condition_arr[i][2] + ' ' + condition_arr[i][3]
            }
            else{
                condition_string = '\xa0\xa0\xa0' + '\xa0\xa0$\xa0' + condition_arr[i][1] + ' ' + condition_arr[i][2] + ' ' + condition_arr[i][3] + ' and ' + condition_arr[i][4]
            }
            await add_to_carousel(condition_string, color , [null], true, false);
            cond_count++;
        }    
    }
    document.getElementById('edit-data-tables').style.display = "block";
    //populate_table_element(sheet, filenum, mini_table_name, null, 5);
}


/*
// THIS CAN PROBABLY BE DELETED
async function display_conditions2(){
    hide_containers(3);
    var cond_count = 1;
    var condition_string = null;
    await add_to_carousel('\xa0\xa0\xa0' + 'Filters:', second_color, [null], true, false);
    if (condition_arr2.length === 1 && condition_arr2[0][1] === 'Select Column' &&  condition_arr2[0][2] === 'Equals'){
        condition_string = '\xa0\xa0\xa0' + '\xa0\xa0\xa0' + 'No conditions applied';
        await add_to_carousel(condition_string, second_color, [null], true, false);
    }
    else{
        for (var i = condition_arr2.length-1; i >= 0; i--){ 
            if (condition_arr2[i][4].length === 0){        
                condition_string = '\xa0\xa0\xa0' + '\xa0\xa0$\xa0' + condition_arr2[i][1] + ' ' + condition_arr2[i][2] + ' ' + condition_arr2[i][3]
            }
            else{
                condition_string = '\xa0\xa0\xa0' + '\xa0\xa0$\xa0' + condition_arr2[i][1] + ' ' + condition_arr2[i][2] + ' ' + condition_arr2[i][3] + ' and ' + condition_arr2[i][4]
            }        
            await add_to_carousel(condition_string, second_color, [null], true, false);
            cond_count++;
        }
    }

    select_extract_column2();

}

async function select_extract_column2(){
    

    var extract_col_dataset_str = extract_col + ' [' + primary_file_name + ' (' + primary_sheet_name + ')]';
    var col_to_match_str = 'Select column with values that will match with values from ' + extract_col_dataset_str; 
    await add_to_carousel([col_to_match_str], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    await add_to_carousel(['Rows that match with values from ' + extract_col_dataset_str + ' will be extracted.',
                            '(You can specify which columns to include later.)'],
                    fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    var col_headers = createTable_values2[0];
    populate_drop_down("#matchsecondcol_ul", col_headers, true);

    document.getElementById('secondmatchbox').style.display = 'block';
    document.getElementById('matchsecondcolumn').style.display = 'flex';
    $(document.body).on('click', '#matchsecondcol_ul' , async function(){ 
        document.getElementById('secondmatchbox').style.display = 'none';
        hide_containers(2);
        extract_from_col = $(this).parents(".dropdown").find('.btn').text();
        var extract_from_str = '\xa0\xa0\xa0' + 'Match values to column: ' + extract_from_col
        await add_to_carousel(extract_from_str, second_color, [null], true, false);
        await add_to_carousel('', input_color , ['add_linebreak_to_carousel()'], true, false);
        
        summarize_choices();
        //if(!third_file_name){
        //    start_third_dataset()
        //}
        //else{
        //    summarize_choices()
        //}
    });
}


// THIS CAN PROBABLY BE DELETED
async function display_conditions3(){
    hide_containers(3);
    var cond_count = 1;
    var condition_string = null;
    await add_to_carousel('\xa0\xa0\xa0' + 'Filters:', third_color, [null], true, false);
    if (condition_arr3.length === 1 && condition_arr3[0][1] === 'Select Column' &&  condition_arr3[0][2] === 'Equals'){
        condition_string = '\xa0\xa0\xa0' + '\xa0\xa0\xa0' + 'No conditions applied';
        await add_to_carousel(condition_string, third_color, [null], true, false);
    }
    else{
        for (var i = condition_arr3.length-1; i >= 0; i--){        
            if (condition_arr3[i][4].length === 0){        
                condition_string = '\xa0\xa0\xa0' + '\xa0\xa0$\xa0' + condition_arr3[i][1] + ' ' + condition_arr3[i][2] + ' ' + condition_arr3[i][3]
            }
            else{
                condition_string = '\xa0\xa0\xa0' + '\xa0\xa0$\xa0' + condition_arr3[i][1] + ' ' + condition_arr3[i][2] + ' ' + condition_arr3[i][3] + ' and ' + condition_arr3[i][4]
            }
            await add_to_carousel(condition_string, third_color, [null], true, false);
            cond_count++;
        }
    }
    select_extract_column3();

}

async function select_extract_column3(){
    
    var extract_col_dataset_str = extract_col + ' [' + primary_file_name + ' (' + primary_sheet_name + ')]';
    var col_to_match_str = 'Select column with values that will match with values from ' + extract_col_dataset_str; 
    await add_to_carousel([col_to_match_str], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    await add_to_carousel(['Rows that match with values from ' + extract_col_dataset_str + ' will be extracted.',
                            '(You can specify which columns to include later.)'],
                    fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    var col_headers = createTable_values3[0];
    populate_drop_down("#matchthirdcol_ul", col_headers, true);
    document.getElementById('thirdmatchbox').style.display = 'block';
    document.getElementById('matchthirdcolumn').style.display = 'flex';
    $(document.body).on('click', '#matchthirdcol_ul' , async function(){  
        hide_containers(2);
        document.getElementById('thirdmatchbox').style.display = 'none';
        extract_from_col = $(this).parents(".dropdown").find('.btn').text();
        var extract_from_str = '\xa0\xa0\xa0' + 'Match values to column: ' + extract_from_col
        await add_to_carousel(extract_from_str, third_color, [null], true, false);
        await add_to_carousel('', input_color , ['add_linebreak_to_carousel()'], true, false);        
        
        //summarize_choices();
        if(!fourth_file_name){
            start_fourth_dataset()
        }
        else{
            summarize_choices()
        }
    });
}


// THIS CAN PROBABLY BE DELETED
async function display_conditions4(){
    hide_containers(3);
    var cond_count = 1;
    var condition_string = null;
    await add_to_carousel('\xa0\xa0\xa0' + 'Filters:', fourth_color, [null], true, false);
    if (condition_arr4.length === 1 && condition_arr4[0][1] === 'Select Column' &&  condition_arr4[0][2] === 'Equals'){
        condition_string = '\xa0\xa0\xa0' + '\xa0\xa0\xa0' + 'No conditions applied';
    }
    else{
        for (var i = condition_arr4.length-1; i >= 0; i--){        
            if (condition_arr4[i][4].length === 0){        
                condition_string = '\xa0\xa0\xa0' + '\xa0\xa0$\xa0' + condition_arr4[i][1] + ' ' + condition_arr4[i][2] + ' ' + condition_arr4[i][3]
            }
            else{
                condition_string = '\xa0\xa0\xa0' + '\xa0\xa0$\xa0' + condition_arr4[i][1] + ' ' + condition_arr4[i][2] + ' ' + condition_arr4[i][3] + ' and ' + condition_arr4[i][4]
            }
            await add_to_carousel(condition_string, fourth_color, [null], true, false);
            cond_count++;
        }        
    }
    select_extract_column4();
    //summarize_choices();
}

async function select_extract_column4(){
    
    var extract_col_dataset_str = extract_col + ' [' + primary_file_name + ' (' + primary_sheet_name + ')]';
    var col_to_match_str = 'Select column with values that will match with values from ' + extract_col_dataset_str; 
    await add_to_carousel([col_to_match_str], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    await add_to_carousel(['Rows that match with values from ' + extract_col_dataset_str + ' will be extracted.',
                            '(You can specify which columns to include later.)'],
                    fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    var col_headers = createTable_values4[0];
    populate_drop_down("#matchfourthcol_ul", col_headers, true);
    document.getElementById('fourthmatchbox').style.display = 'block';
    document.getElementById('matchfourthcolumn').style.display = 'flex';
    $(document.body).on('click', '#matchfourthcol_ul' , async function(){  
        hide_containers(2);
        document.getElementById('fourthmatchbox').style.display = 'none';
        extract_from_col = $(this).parents(".dropdown").find('.btn').text();
        var extract_from_str = '\xa0\xa0\xa0' + 'Match values to column: ' + extract_from_col
        await add_to_carousel(extract_from_str, fourth_color, [null], true, false);
        await add_to_carousel('', input_color , ['add_linebreak_to_carousel()'], true, false);
                
        summarize_choices()        
    });
}
*/

async function algo_menu(){
    algorithm_type='Extract';
    if (algorithm_type === 'Extract'){
        extractfrom_selection();    
    }
    else if (algorithm_type === 'Update'){

    }
    else if (algorithm_type === 'Combine'){

    }
    else if (algorithm_type === 'Reconcile'){

    }
    else if (algorithm_type === 'Modify'){

    }
    else if (algorithm_type === 'AI'){

    }
    else if (algorithm_type === 'Insight'){

    }

} 

async function summarize_choices(){
    document.getElementById("typingtextcontainer").style.display = "none";

    document.getElementById("typingtextcontainer").style.maxHeight = "90%";
    //document.getElementById("typingtextcontainer").style.overflow = "scroll";
    document.getElementById("typingtextcontainer").style.overflowX = "hidden";
    document.getElementById("typingtextcontainer").style.width = "100%";
    
    document.getElementById("typingtextcontainer").style.justifyContent = "center";

    document.getElementById("carouselcontainer3").style.marginBottom = "3%";
    document.getElementById("feature-text3").style.fontSize = "40px";
    
    document.getElementById("typingtextcontainer").style.display = "flex";
    document.getElementById("executeorrun").style.display = "flex";
    document.getElementById("executeorrun").style.display = "block";
}

function populate_dataset_names(){
    dataset_index = [];
    dataset_names = [];
    dataset_index.push([primary_file_name, primary_sheet_name, createTable_values1[0]]);
    dataset_index.push([secondary_file_name, secondary_sheet_name, createTable_values2[0]]);
    dataset_index.push([third_file_name, third_sheet_name, createTable_values3[0]]);
    dataset_index.push([fourth_file_name, fourth_sheet_name, createTable_values4[0]]);
    dataset_names.push(primary_file_name + ' {' + primary_sheet_name + '}');
    if (secondary_file_name != null){
        dataset_names.push(secondary_file_name + ' {' + secondary_sheet_name + '}')
    }
    if (third_file_name != null){
        dataset_names.push(third_file_name + ' {' + third_sheet_name + '}');
    }
    if (fourth_file_name != null){
        dataset_names.push(fourth_file_name + ' {' + fourth_sheet_name + '}');
    }
}

function get_file_and_sheet(dataset_selection){
    var lastIndex = dataset_selection.trim().lastIndexOf('{');
    var filename = dataset_selection.substr(0, lastIndex).trim();
    var sheetname = dataset_selection.substr(lastIndex+1);
    sheetname = sheetname.slice(0, -1).trim();
    return [filename, sheetname];
}


function convert_file_num_to_dataset(file_num){
    if (file_num === 1){
        return dataset_names[0];
    }
    else if (file_num === 2){
        return dataset_names[1];
    }
    else if (file_num === 3){
        return dataset_names[2];
    }
    else if (file_num === 4){
        return dataset_names[3];
    }
}


function get_header_row_from_filenum(file_num){
    if (file_num === 1){
        return primary_header_row;
    }
    else if (file_num === 2){
        return secondary_header_row;
    }
    else if (file_num === 3){
        return third_header_row;
    }
    else if (file_num === 4){
        return fourth_header_row;
    }
}


function match_dataset_to_colheaders(file_and_sheet){
    for(var i = 0; i<dataset_index.length; i++){
        if (file_and_sheet[0] === dataset_index[i][0] && file_and_sheet[1] === dataset_index[i][1]){
            return dataset_index[i][2]
        } 
    }
}

function hide_header_table(file_num){
    if (file_num === 1){
        document.getElementById("colselecttablediv1").style.display = "none";
        return [dataset_names[0], input_color]
    }
    else if (file_num === 2){
        document.getElementById("colselecttablediv2").style.display = "none";
        return [dataset_names[1], second_color]
    }
    else if (file_num === 3){
        document.getElementById("colselecttablediv3").style.display = "none";
        return [dataset_names[2], third_color]
    }
    else if (file_num === 4){
        document.getElementById("colselecttablediv4").style.display = "none";
        return [dataset_names[3], fourth_color]
    }
}

async function create_filter_conditions(file_num){
    current_conditions_file = file_num;
    hide_containers(2);
    var which_file = hide_header_table(file_num);
    add_to_carousel('Filter: ' + which_file[0], which_file[1], ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    add_to_carousel('These conditions will limit the rows imported into the algorithm.', fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, false);
    add_to_carousel('If some of the data is not relevant then exclude it here.', fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    reset_conditions_page();
    document.getElementById("conditioncontainerwrap").style.display = 'block';
    var col_headers = get_table_headers_from_file_num(file_num);
    var col_dropdown_elem = $('#conditioncontainerwrap').find('.dropdown').eq(1).find('ul'); 
    populate_drop_down(col_dropdown_elem, col_headers, true);
}


function reset_conditions_page(){
    $('#conditioncontainerwrap').find('.conditiondiv').eq(0).clone().appendTo('.conditiondivcontainer');
    var new_elem = $('#conditioncontainerwrap').find('.conditiondiv:last');
    $(new_elem).find('.condition-dropdown-andor').css('visibility', 'hidden');
    $(new_elem).find('.condition-inputs').find('.condition-and-input-wrap').css('visibility', 'hidden');
    $(new_elem).find('.condition-dropdown').find('.btn').text('Select Column');
    $(new_elem).find('.condition-inputs').find('.condition-dropdown-action').find('.btn').text('Equals');
    $(new_elem).find('.condition-inputs').find('.condition-input-wrap').find('input').val('');
    $(new_elem).find('.condition-inputs').find('.condition-and-input-wrap').find('input').val('');
    var conditions = $('#conditioncontainerwrap').find('.conditiondiv');
    for (var i=0;i<conditions.length-1;i++){
        $(conditions[i]).remove();
    }
    $('#addconditionbtn').hide();
    $('#conditionnext').text('Skip');
}


function get_table_headers_from_file_num(file_num){
    if (file_num === 1){
        return createTable_values1[0];
    }
    else if (file_num === 2){
        return createTable_values2[0];
    }
    else if (file_num === 3){
        return createTable_values3[0];
    }
    else if (file_num === 4){
        return createTable_values4[0];
    }
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

// select third file
async function display_thirdfileselect_drop(){
    populate_drop_down('#thirdfile_ul', unique_file_names, true)
    document.getElementById('thirdfiledrop').style.display = 'block';
}

// select third sheet
function display_thirdfilesheets_drop() {
    populate_drop_down('#thirdsheet_ul', third_file_sheets, true)
} 

// select fourth file
async function display_fourthfileselect_drop(){
    populate_drop_down('#fourthfile_ul', unique_file_names, true)
    document.getElementById('fourthfiledrop').style.display = 'block';
}

// select fourth sheet
function display_fourthfilesheets_drop() {
    populate_drop_down('#secondarysheet_ul', fourth_file_sheets, true)
}

function display_colselect_table(){
    document.getElementById('colselecttablecontainer').style.display = 'block';
}

function hide_containers(num_to_hide){
    var current_cont = carousel_num - 1;
    for (var i = 0; i < num_to_hide; i++){
        try {
            var container = 'carouselcontainer' + current_cont;
            document.getElementById(container).style.display = 'none';
            //document.getElementById(container).style.visibility = 'hidden';
            current_cont--;
        } catch (error) {
            console.error(error);
          }
    }
}

// using array to populate dropdown values
function populate_drop_down(dropdown_id, val_arr, is_to_be_cleared=false){
    var once = false;
    if(is_to_be_cleared){
        $(dropdown_id).empty();
    }
    var options = $(dropdown_id);
    $.each(val_arr, function(v) {
            if(!once){
                options.append($("<input type='text' class='search-input form-control border-0 border-bottom shadow-none mb-2' placeholder='Search...'>"));
                once = true;    
            }
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
    // to get colors to start one color and finnish the other then color parameter needs to be ignored
    // by putting random words in add_to_carousel() you can overide this behavior
    if (color === 'urgent'){
        $(eleRef).css('color', 'grey');
    }
    else{
        $(eleRef).css('color', codexdisplaycolor);
    }
   
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
    var file_sheets = distinct_val_by_key(gv.data_json, 'file_name', 'sheet_name');
    for (var elem of file_sheets) {
        var key = Object.keys(elem)[0];
        if (key === file_name) {
            return elem[file_name];
        }
    }
}


// ! moved to extract_paths.js
async function primary_sheet_selection(){
    if (primary_file_sheets.length > 1) {
        await add_to_carousel(['Select worksheet from input file'], action_color,  ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
        await add_to_carousel(['The selected worksheet should contain the data to search for in other datasets.', 'You can search for this data in other sheets from the same workbook.'], fyi_color,["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')", 'display_primaryfilesheets_drop()'], false, true); 
    }
    else{
        primary_sheet_name = "Sheet1";
        await add_to_carousel('\xa0\xa0\xa0' + 'Input Sheet: Sheet1 (default - file only has one sheet)', input_color, ['adjust_col_header()'], true, false);
    }   
}

async function secondary_sheet_selection(){
    if (secondary_file_sheets.length > 1) {
        await add_to_carousel(['Select worksheet from file'], action_color,  ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
        await add_to_carousel(['The selected worksheet should contain the data to search for in other datasets.', 'You can search for this data in other sheets from the same workbook.'], fyi_color,["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')", 'display_secondaryfilesheets_drop()'], false, true); 
    }
    else{
        secondary_sheet_name = "Sheet1";
        await add_to_carousel('Data Sheet: Sheet1 (default - file only has one sheet)', second_color, ['adjust_col_header2()'], true, false);
    }   
}

async function third_sheet_selection(){
    if (third_file_sheets.length > 1) {
        await add_to_carousel(['Select worksheet from file'], action_color,  ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
        await add_to_carousel(['The selected worksheet should contain the data to search for in other datasets.', 'You can search for this data in other sheets from the same workbook.'], fyi_color,["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')", 'display_secondaryfilesheets_drop()'], false, true); 
    }
    else{
        third_sheet_name = "Sheet1";
        await add_to_carousel('Data Sheet: Sheet1 (default - file only has one sheet)', third_color, ['adjust_col_header3()'], true, false);
    }   
}

async function fourth_sheet_selection(){
    if (fourth_file_sheets.length > 1) {
        await add_to_carousel(['Select worksheet from file'], action_color,  ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
        await add_to_carousel(['The selected worksheet should contain the data to search for in other datasets.', 'You can search for this data in other sheets from the same workbook.'], fyi_color,["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')", 'display_secondaryfilesheets_drop()'], false, true); 
    }
    else{
        fourth_sheet_name = "Sheet1";
        await add_to_carousel('Data Sheet: Sheet1 (default - file only has one sheet)', fourth_color, ['adjust_col_header4()'], true, false);
    }   
}

/*function adjust_col_header(){
    add_to_carousel('Change column headers', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    add_to_carousel('Current column headers are highlighted in white.','If your column headers are not on the first row, then click on the row containing your column headers.',
        fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    document.getElementById("colselecttablediv1").style.display = "block";
    col_headers = populate_table_element(primary_sheet_name, 1, 'data1_tableid');
}*/


// adjust column header
function adjust_col_header(){
    add_to_carousel('Change column headers', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    add_to_carousel('If your column headers are not on the first row, then click on the row containing your column headers.', fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    document.getElementById("colselecttablediv1").style.display = "block";
    col_headers = populate_table_element(primary_sheet_name, 0, 'data1_tableid');
}

function adjust_col_header2(){
    add_to_carousel('Change column headers', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    add_to_carousel('Current column headers are highlighted in white.','If your column headers are not on the first row, then click on the row containing your column headers.',
    'Otherwise, click next.', fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    document.getElementById("colselecttablediv2").style.display = "block";
    col_headers = populate_table_element(secondary_sheet_name, 2, 'data2_tableid');
}

function adjust_col_header3(){
    add_to_carousel('Change column headers', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    add_to_carousel('Current column headers are highlighted in white.','If your column headers are not on the first row, then click on the row containing your column headers.',
    'Otherwise, click next.', fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    document.getElementById("colselecttablediv3").style.display = "block";
    col_headers = populate_table_element(third_sheet_name, 3, 'data3_tableid');
}

function adjust_col_header4(){
    add_to_carousel('Change column headers', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    add_to_carousel('Current column headers are highlighted in white.','If your column headers are not on the first row, then click on the row containing your column headers.',
    'Otherwise, click next.', fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    document.getElementById("colselecttablediv4").style.display = "block";
    col_headers = populate_table_element(fourth_sheet_name, 4, 'data4_tableid');
}

function populate_table_element(selected_sheet, tablenumber, data_tableid, result_data=null, actual_max_col=null){
    //const data_json = JSON.parse(document.getElementById('data_dump').textContent); // get original json data gain
    //unique_file_names = uniq_fast(data_json, 'file_name');  // calcualte file names  
    var col_headers = null;
    if (tablenumber === 1){
        var repivoted_data = repivot_keyval(gv.data_json, primary_file_name, selected_sheet);
        //do you have problems?
        //this used to be createTable(repivoted_data, data_tableid) you added the rest to be able to actual max col
        createTable_values1 = createTable(repivoted_data, data_tableid);
        var col_headers = createTable_values1[0];
        var createTable_html = createTable_values1[1];
        var table_html_obj_arr = parse_table_column_values(createTable_html);
    }
    else if(tablenumber === 2){
        var repivoted_data = repivot_keyval(gv.data_json, secondary_file_name, selected_sheet);
        createTable_values2 = createTable(repivoted_data, data_tableid);
        var col_headers = createTable_values2[0];
        var createTable_html = createTable_values2[1];
        var table_html_obj_arr2 = parse_table_column_values(createTable_html);
    }
    else if(tablenumber === 3){
        var repivoted_data = repivot_keyval(gv.data_json, third_file_name, selected_sheet);
        createTable_values3 = createTable(repivoted_data, data_tableid);
        var col_headers = createTable_values3[0];
        var createTable_html = createTable_values3[1];
        var table_html_obj_arr3 = parse_table_column_values(createTable_html);
    }
    else if(tablenumber === 4){
        var repivoted_data = repivot_keyval(gv.data_json, fourth_file_name, selected_sheet);
        createTable_values4 = createTable(repivoted_data, data_tableid);
        var col_headers = createTable_values4[0];
        var createTable_html = createTable_values4[1];
        var table_html_obj_arr4 = parse_table_column_values(createTable_html);
    }
    else if(tablenumber === 0){
        var repivoted_data = repivot_keyval(gv.data_json, 'nofilename', 'nosheetname', result_data['result_table']);
        var createTable_values0 = createTable(repivoted_data, data_tableid, 0, 30);
        var col_headers = createTable_values0[0];
        var createTable_html = createTable_values0[1];
        var table_html_obj_arr0 = parse_table_column_values(createTable_html);
    }
    return col_headers;
}

function repivot_keyval(data_json, file_name, sheet_name, result_data=null) {
    var result_table = [];
    // not super sure what this does --- it unpivots to original json object with file_name, sheet_name, key, value
    var is_data_json = false;
    if (result_data===null){
        var entries = Object.entries(data_json);
        var is_data_json = true;
    }
    else{
        var entries = Object.entries(result_data);
        var is_data_json = false;
    }
    var objs = [];
    var col_obj = {};
    // for each record in object of unpivoted
    for(var i=0; i<entries.length; i++)
    {
        // if file_name and sheet_name match required file and sheet
        if (is_data_json){        
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
        else{
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
    return objs;
}


// populate html table from repivoted key value db table
// specified_header_row is when user clicks on table to change header row
function createTable(objs, table_id, specified_header_row=0, max_col_display=5, actual_max_col=null) {
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
    var actual_col = 0;
    var all_html = '';
    var one_extra_col = true;
    if(actual_max_col==null){
        var actual_max_col = 100;
    }
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
                        // YOU JUST Z CHANGED THIS FROM < 5 TO < actual_max_col
                        if (actual_col < actual_max_col){
                            var th = '<th>' + objs[i].col_header + '</th>';
                            col_headers.push(objs[i].col_header);
                        }
                        else{
                            col_headers.push(objs[i].col_header);
                        }
                    }
                    actual_col+=1 
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
                if(actual_col<actual_max_col){
                    tr += th;
                    one_extra_col = true;
                }
                else{
                    if (one_extra_col){
                        tr += '<th>' + '...' + '</th>';
                        one_extra_col = false
                    }
                }
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
            for (var i = 0; i < objs.length; i++) { //for (var i = 0; i < objs.length; i++) {
                if(objs[i].vals[obj_elem_iter-1] === 'nan')
                {
                    tr  += '<td>' + '' + '</td>';
                }
                else
                {
                    if (i<actual_max_col-1){
                        tr  += '<td>' + objs[i].vals[obj_elem_iter-1] + '</td>';
                    }
                    else{
                        tr  += '<td>' + '...' + '</td>';
                    }
                    
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




function calc_max_files(){
    if (algorithm_type === 'Extract'){
        return "Max 4 files for this algorithm type (4MB total size)";
    }
    else if (algorithm_type === 'Combine'){
        return "Max 4 files for this algorithm type (4MB total size)";
    }
    else if (algorithm_type === 'Update'){
        return "Max 2 files for this algorithm type (4MB total size)";
    }
    else if (algorithm_type === 'Reconcile'){
        return "Max 2 files for this algorithm type (4MB total size)";
    }
    else if (algorithm_type === 'Calculate' || algorithm_type === 'Columns'){
        return "Max 1 file for this algorithm type (4MB total size)";
    }
    else if (algorithm_type === 'Filter'){
        return "Max 1 file for this algorithm type (4MB total size)";
    }
}


async function begin_file_upload(algo_desc){
    var num_files = calc_max_files();
    document.getElementById('textbox-algo-desc-wrap').style.display = 'none';
    var clean_algo_desc = clean_algorithm_description(algo_desc);
    hide_containers(2);
    await add_to_carousel('SUMMARY OF ALGORITHM', null, [null], true, false);
    await add_to_carousel('Algorithm Type: ' + algorithm_type, standard_color, [], true, false);
    await add_to_carousel('Algorithm Description: ' + clean_algo_desc, standard_color, [], true, false);
    await add_to_carousel('File Selection:', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    await add_to_carousel(algo_desc, fyi_color, ['display_multiple_file_drops()', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true); 
    await add_to_carousel('Select files to include in algorithm: ' + num_files, fyi_color, ['display_multiple_file_drops()', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);    
}

function clean_algorithm_description(algo_desc){
    var clean_algo_desc = algo_desc.replace(/<\/?[^>]+(>|$)/g, "");
    return clean_algo_desc;
}

async function start_algo_path(node_name, parent_node_name, algo_desc){
    //hide_containers(2);
    document.getElementById('textbox-algo-desc-wrap').style.display = 'none';
    if (node_name === 'START'){
        if (document.getElementById('algo-desc-graph').style.display == 'block'){
            
            document.getElementById('algo-desc-graph').style.display='none';
            document.getElementById('data_post_form').style.display='none';
        }
        console.log(parent_node_name)
        if (parent_node_name === 'Extract' || parent_node_name === 'Search'){
            console.log('algo selected - extract')
            algorithm_type = 'Extract'; 
            algo_desc = 'Select rows of data from one or multiple files based on values or conditions and extract them into one file.';
            max_file_upload = 4;
        }
        else if (parent_node_name === 'Describe Algorithm'){
            algorithm_type = 'Describe Algorithm'
            algo_desc = 'Describe what to do to a dataset and have an algorithm generated and executed.'
            max_file_upload = 1
        }
        else if (parent_node_name === 'Combine'){
            console.log('algo selected - combine')
            algorithm_type = 'Combine';      
            algo_desc = 'Combine two or more datasets into one file by searching for common values and adding columns where they match.'
            max_file_upload = 4;  
        }
        else if(parent_node_name === 'Update'){
            console.log('algo selected - update')
            algorithm_type = 'Update';
            algo_desc = 'Modify a dataset with conditions describing how to update which values.'
            max_file_upload = 2;
        }
        else if (parent_node_name === 'Compare'){
            console.log('algo selected - reconcile')
            algorithm_type = 'Reconcile';
            algo_desc = 'Reconcile values of two datasets by matching rows and comparing similarities and differences.'
            max_file_upload = 2;
        }
        else if (parent_node_name === 'Group'){
            console.log('algo selected - calculate')
            algorithm_type = 'Calculate';
            algo_desc = 'Group together rows of data which have common values to calculate metrics per group.'
            max_file_upload = 1;
        }
        else if (parent_node_name === 'Columns' || parent_node_name === 'Calculate'){
            console.log('algo selected - columns')
            algorithm_type = 'Columns'
            algo_desc = 'Create a new column by describing what you want and having a formula generated.'
            max_file_upload = 1;
        }
        else if (parent_node_name === 'Filter'){
            console.log('algo selected - filter')
            algorithm_type = 'Filter'
            algo_desc = 'Filter a dataset by describing conditions to apply to one or more column.'
            max_file_upload = 1;
        }
        begin_file_upload(algo_desc);
    }
    //describe_search_file_single(); // the zoom feature that brings to more detailed description
    
} 

// REMOVE THIS - DESCRIPTION WILL BE ON HOVER
// START WILL BE    algo_menu()
async function describe_search_file_single(){
    document.getElementById('search-file-one').style.display = 'block';
    document.getElementById('searchfileone-btns').style.display = 'block';
    var element = document.getElementById('algo-desc-graph');
    element.scroll(-1000,500);
    window.focus();
    window.scrollTo(0,800);
}

$(document).ready(function() {
    if (window.location.href.indexOf("excel_ai") > -1){
        var url = window.location.href;
        if( url.indexOf('#') < 0 ) {
            window.location.replace(url + "#");
        } else {
            window.location.replace(url);
        }
    }
});

function print_the_filtered_data(data){
    console.log('PRINT THE FILTERED DATA')
    console.log(data)
}



// collect algorithm parameters
async function collect_extract_parameters_OLD_DECOMISSIONED(){
    extract_from.push([$('#matchprimarydata_ul').parents(".dropdown").find('.btn').text(), $('#matchprimarycol_ul').parents(".dropdown").find('.btn').text()])
    if ($('#matchseconddata_ul').parents(".dropdown").find('.btn').text() != null){ 
        extract_from.push([$('#matchseconddata_ul').parents(".dropdown").find('.btn').text(), $('#matchsecondcol_ul').parents(".dropdown").find('.btn').text()]);       
    }
    if ($('#matchthirddata_ul').parents(".dropdown").find('.btn').text() != null){ 
        extract_from.push([$('#matchthirddata_ul').parents(".dropdown").find('.btn').text(), $('#matchthirdcol_ul').parents(".dropdown").find('.btn').text()]);       
    }
    if ($('#matchfourthdata_ul').parents(".dropdown").find('.btn').text() != null){
        extract_from.push([$('#matchfourthdata_ul').parents(".dropdown").find('.btn').text(), $('#matchfourthcol_ul').parents(".dropdown").find('.btn').text()]);
    }  
    extract_from = [];
    extract_from.push(['Address.csv {Sheet1}', 'Director']);
    extract_from.push(['Client Data.csv {Sheet1}', 'Client Name']);
    extract_from.push(['Client Values.csv {Sheet1}', 'Client Name']);
    extract_from.push(['Program Info.csv {Sheet1}', 'Teachers']);
    console.log(extract_from)
}

//HORIZONTAL NAVBAR  https://codepen.io/DaiSenzz/pen/wvQGjQd
/*
$(document).ready(function() {
    if (window.location.href.indexOf("algorithmbuilder") > -1){
        const sidebar = document.querySelector('.sidebar');
        const navItems = document.querySelectorAll('nav .nav-item');
        const toggle = document.querySelector('.sidebar .toggle');

        toggle.addEventListener('click', () => {

            if (sidebar.className === 'sidebar')
                sidebar.classList.add('open');
            else
                sidebar.classList.remove('open');

        });

        navItems.forEach(navItem => {

            navItem.addEventListener('click', () => {

                navItems.forEach(navItem => {
                    navItem.classList.remove('active');
                });

                navItem.classList.add('active');

            });

        });
    }
});
*/


// change submit icon to amke it active when text is input
$(document).ready(function() {
    if (window.location.href.indexOf("excel_ai") > -1){
        var textarea = document.getElementById("textbox-algo-desc");
        textarea.addEventListener('input', icon_color_on_empty);
        function icon_color_on_empty() {
            var text = this.value;

            if (text !== ''){
                document.getElementById("submittexticon").style.color = "white";              
            }
            else{
                document.getElementById("submittexticon").style.color = "grey"; 
            }
        }
    }
});

function assign_algo_type_description(algo_type){
    if (algo_type === 'Extract' || algo_type === 'Search'){
        algo_desc = 'Select rows of data from one or multiple files based on values or conditions and extract them into one file.';
        max_file_upload = 4;
    }
    else if (algo_type === 'Describe Algorithm'){
        algorithm_type = 'Describe Algorithm'
        algo_desc = 'Describe what to do to a dataset and have an algorithm generated and executed.'
        max_file_upload = 1
    }
    else if (algo_type === 'Combine'){   
        algo_desc = 'Combine two or more datasets into one file by searching for common values and adding columns where they match.' 
        max_file_upload = 4;  
    }
    else if(algo_type === 'Update'){
        algo_desc = 'Modify a dataset with conditions describing how to update which values.'
        max_file_upload = 2;
    }
    else if (algo_type === 'Reconcile'){
        algo_desc = 'Reconcile values of two datasets by matching rows and comparing similarities and differences.'
        max_file_upload = 2;
    }
    else if (algo_type === 'Group'){
        algo_desc = 'Group together rows of data which have common values to calculate metrics per group.'
        max_file_upload = 1;
    }
    else if (algo_type === 'Columns' || algo_type === 'Calculate'){
        algo_desc = 'Create a new column by describing what you want and having a formula generated.'
        max_file_upload = 1;
    }
    else if (algo_type === 'Filter'){
        algo_desc = 'Filter a dataset by describing conditions to apply to one or more column.'
        max_file_upload = 1;
    }
}

async function convert_text_to_decision(algo_type){
    setTimeout(function() {
        document.getElementById("submitloadersvg").style.display = "none";
        document.getElementById("describe-algo-banner").style.display = "none";
        document.getElementById('algo-desc-graph').style.display = 'none';
        //find_described_node(algo_type);
        console.log('algotype')
        console.log(algo_type['algo_type'])
        assign_algo_type_description(algo_type['algo_type']);
        if(algo_type['algo_type'] == 'failure'){
            document.getElementsByClassName('model-failure')[0].style.display = 'block';
        }
        else{
            confirm_algorithm_type(algo_type['algo_type'])
        }
    }, 2800);
}

async function confirm_algorithm_type(selected_algo_type){
    hide_containers(2);
    document.getElementById('algo-desc-graph').style.display = 'none';
    var algo = capitalizeFirstLetter(selected_algo_type)
    await add_to_carousel('Confirm algorithm type:', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    //await add_to_carousel('Confirm this algorithm type .', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, false);
    //document.getElementById('confirm-algo-header-type').innerHTML = '<b><u>' + algo + '</u></b>' 
    //document.getElementById('confirm-algo-header-desc').innerHTML =  algo_desc;
    document.getElementById('confirm-algo-select').style.display = 'block';
    document.getElementById('confirmalgo-btns').style.display = 'block';
    console.log('algo type: ' + selected_algo_type)
    if (algo === 'Extract'){
        document.getElementById('confirm-algo-img-extract').style.display = 'block';
        //document.getElementById('algo-example-extract').style.display = 'block';
    }
    else if (algo === 'Combine'){
        document.getElementById('confirm-algo-img-combine').style.display = 'block';
    }
    else if (algo === 'Update'){
        document.getElementById('confirm-algo-img-update').style.display = 'block';
        //document.getElementById('algo-example-update').style.display = 'block';
    }
    else if (algo === 'Reconcile'){
        document.getElementById('confirm-algo-img-reconcile').style.display = 'block';
    }
    else if (algo === 'Columns'){
        document.getElementById('confirm-algo-img-calculate').style.display = 'block';
    }
    else if (algo === 'Group'){
        document.getElementById('confirm-algo-img-group').style.display = 'block';
    }
    else if (algo === 'Filter'){
        document.getElementById('confirm-algo-img-filter').style.display = 'block';
    }

    // click continue after confirm algorithm text
    $(document.body).on('click', '#confirm-algo-yes' , async function(){ 
        hide_containers(1);  
        document.getElementById('confirm-algo-select').style.display = 'none';
        document.getElementById('confirmalgo-btns').style.display = 'none';
        start_algo_path('START', selected_algo_type, algo_desc)
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function find_described_node(algo_type){
    var aTags = document.getElementsByTagName("g");
    var searchText = algo_type['algo_type'];
    var found ='';
    for (var i = 0; i < aTags.length; i++) {
        if (aTags[i].textContent == searchText) {
            found = aTags[i];
            break;
        }
    }
    $(found).addClass("selected");
}












// LOADER ALGO SUGGESTION

var checkmarkIdPrefix = "loadingCheckSVG-";
var checkmarkCircleIdPrefix = "loadingCheckCircleSVG-";
var verticalSpacing = 50;

function createSVG(tag, properties, opt_children) {
    var newElement = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for(prop in properties) {
    newElement.setAttribute(prop, properties[prop]);
    }
    if (opt_children) {
    opt_children.forEach(function(child) {
        newElement.appendChild(child);
    })
    }
    return newElement;
}

function createPhraseSvg(phrase, yOffset) {
    var text = createSVG("text", {
    fill: "white",
    x: 50,
    y: yOffset,
    "font-size": 18,
    "font-family": "Ubuntu Mono"
    });
    text.appendChild(document.createTextNode(phrase));
    return text;
}
function createCheckSvg(yOffset, index) {
    var check = createSVG("polygon", {
    points: "21.661,7.643 13.396,19.328 9.429,15.361 7.075,17.714 13.745,24.384 24.345,9.708 ",
    fill: "rgba(255,255,255,1)",
    id: checkmarkIdPrefix + index
    });
    var circle_outline = createSVG("path", {
    d: "M16,0C7.163,0,0,7.163,0,16s7.163,16,16,16s16-7.163,16-16S24.837,0,16,0z M16,30C8.28,30,2,23.72,2,16C2,8.28,8.28,2,16,2 c7.72,0,14,6.28,14,14C30,23.72,23.72,30,16,30z",
    fill: "white"
    })
    var circle = createSVG("circle", {
    id: checkmarkCircleIdPrefix + index,
    fill: "rgba(255,255,255,0)",
    cx: 16,
    cy: 16,
    r: 15
    })
    var group = createSVG("g", {
    transform: "translate(10 " + (yOffset - 20) + ") scale(.9)"
    }, [circle, check, circle_outline]);
    return group;
}

function addPhrasesToDocument(phrases) {
    phrases.forEach(function(phrase, index) {
        var yOffset = 30 + verticalSpacing * index;
        document.getElementById("phrases").appendChild(createPhraseSvg(phrase, yOffset));
        document.getElementById("phrases").appendChild(createCheckSvg(yOffset, index));
    });
}

function easeInOut(t) {
    var period = 1000;
    return (Math.sin(t / period + 100) + 1) /2;
}

function edit_phrases(phrases){
    var clean_phrases = []
    for(var i=0;i<phrases.length;i++){
        var edit = phrases[i]
        edit = edit.replace(/\s/g,'')
        if (edit !== '...' && edit !== '' && edit.toLowerCase().indexOf("filter") === -1){
            clean_phrases.push(edit);
        } 
        else{
            console.log('removed')
            console.log(edit)
        }
    }
    return clean_phrases;
}

//https://codepen.io/steve-todorov/details/LNmjZY
//$(document).ready(function() {
function load_summary_carousel(){
    var phrases = ["START"];
    phrases = update_loading_carousel_items();
    phrases = ['Loaded file', 'Sheet downlaoded', 'fear no evil', 'run not from the sun', 'hide from the sun', 'this is conflicting adivce', 'are you sick?', 'or simpley strange','Loaded file', 'Sheet downlaoded', 'fear no evil', 'run not from the sun', 'hide from the sun', 'this is conflicting adivce', 'are you sick?', 'or simpley strange'];
    phrases = edit_phrases(phrases);
    addPhrasesToDocument(phrases);
    var start_time = new Date().getTime();
    var upward_moving_group = document.getElementById("phrases");
    upward_moving_group.currentY = 0;
    var checks = phrases.map(function(_, i) { 
        return {check: document.getElementById(checkmarkIdPrefix + i), circle: document.getElementById(checkmarkCircleIdPrefix + i)};
    });
        function animateLoading() {
        var now = new Date().getTime();
        upward_moving_group.setAttribute("transform", "translate(0 " + upward_moving_group.currentY + ")");
        upward_moving_group.currentY -= 1.35 * easeInOut(now);
        checks.forEach(function(check, i) {
          var color_change_boundary = - i * verticalSpacing + verticalSpacing + 15;
          if (upward_moving_group.currentY < color_change_boundary) {
            var alpha = Math.max(Math.min(1 - (upward_moving_group.currentY - color_change_boundary + 15)/30, 1), 0);
            check.circle.setAttribute("fill", "rgba(255, 255, 255, " + alpha + ")");
            var check_color = [Math.round(255 * (1-alpha) + 120 * alpha), Math.round(255 * (1-alpha) + 154 * alpha)];
            check.check.setAttribute("fill", "rgba(91, " + 51 + "," + 138 + ", 1)");
          }
        })
        //if (now - start_time < 30000 && upward_moving_group.currentY > -710) {
        requestAnimationFrame(animateLoading);
        //}
      }
    animateLoading();
}
//});

function update_loading_carousel_items(){
    //all_my_sentences = ['one ive gotr a cioekts for.','two of black shosejsd.','pcoekssdc whwe crun soaway.','full together so theyll saty!','opf screww', 'do you think shell love me','when im old an cray0']
    //console.log(typeof all_my_sentences)
    //all_my_sentences = all_my_sentences.unshift("START")
    //console.log(typeof all_my_sentences)
    //all_my_sentences = all_my_sentences.push("END")
    //all_my_sentences = ['Loaded file', 'Sheet downlaoded', 'fear no evil', 'run not from the sun', 'hide from the sun', 'this is conflicting adivce', 'are you sick?', 'or simpley strange']
    return all_my_sentences;
}

function edit_loading_carousel(){
    for (var i = 0; i<all_my_sentences.length; i++){
        console.log(all_my_sentences[i])
    }
}

function collect_user_input_text(){
    var user_algo_desc = document.getElementById('textbox-algo-desc').value;
    return user_algo_desc;
}

function get_table_headers(table_id){
    var thArray = [];
    $('#' + table_id + '> tbody > tr > th').each(function(){
        thArray.push($(this).text())
    })
    return thArray;
}

function get_file_name_index(filename){
    fileone = primary_file_name + ' {' +  primary_sheet_name + '}'
    filetwo = secondary_file_name + ' {' + secondary_sheet_name + '}'
    filethree = third_file_name + ' {' + third_sheet_name + '}'
    filefour = fourth_file_name + ' {' + fourth_sheet_name + '}'
    if (filename === fileone){
        return 1;
    }
    else if (filename === filetwo){
        return 2;
    }
    else if (filename === filethree){
        return 3;
    }
    else if (filename === filefour){
        return 4;
    }
}

function get_createTable_by_index(index_num){
    if (index_num === 1){
        return createTable_values1;
    }
    else if(index_num === 2){
        return createTable_values2;
    }
    else if(index_num === 3){
        return createTable_values3;
    }
    else if(index_num === 4){
        return createTable_values4;
    }
}


function get_col_headers_for_filename(filename){
    var col_headers = null;
    if (filename === primary_file_name + ' {' + primary_sheet_name + '}'){
        col_headers = createTable_values1[0];
    }
    else if(filename === secondary_file_name + ' {' + secondary_sheet_name + '}'){
        col_headers = createTable_values2[0];
    }
    else if(filename === third_file_name + ' {' + third_sheet_name + '}'){
        col_headers = createTable_values3[0];
    }
    else if(filename === fourth_file_name + ' {' + fourth_sheet_name + '}'){
        col_headers = createTable_values4[0];
    }
    return col_headers 
}










//searchable dropdown

//https://www.geeksforgeeks.org/how-to-add-dropdown-search-bar-in-bootstrap-5/
$(document.body).on('input', '.search-input' , function(){  
    inputValue = this.value
    var results = [];
    // if no div child containing original value exists use dropdown parent  else read values into array
    // prevents having to refresh to get back original values when searched value is deleted
    if (this.children.length > 0){
        var data = this.firstChild.innerHTML;
        var arr = data.split(',')
        arr.forEach(function(elem){
            results.push(elem)
        })
    }
    else{
        var dropdown_parent = $(this).closest('.dropdown-menu').find('a');
        dropdown_parent.each(function(i){
            results.push(dropdown_parent[i].text)
        })
    }

    // if there is no child div containing original values of dropdown then create it
    if (this.children.length === 0){
        var e = document.createElement('div');
        e.innerHTML = results;
        this.appendChild(e);
    }
    

    var parentElement = $(this).closest('.dropdown').find('.dropdown-menu')[0];
    const elementsToRemove = parentElement.querySelectorAll("li");
    elementsToRemove.forEach(element => {
        element.remove();
    });
    if (inputValue) {
        const matchingWords =
            results
                .filter((word) => 
                    {return word.toLowerCase().includes(inputValue.toLowerCase())});
        matchingWords.sort((a, b) => {
            const indexA =
                a.indexOf(inputValue);
            const indexB =
                b.indexOf(inputValue);
            return indexA - indexB;
        });
        matchingWords.forEach(word => {
            const listItem =
                document.createElement("li");
            const link =
                document.createElement("a");
            link.classList.add("dropdown-item");
            link.href = "#";
            link.textContent = word;
            listItem.appendChild(link);
            parentElement.appendChild(listItem);
        });
        if (matchingWords.length == 0) {
            const listItem =
                document.createElement('li');
            listItem.textContent = "No Item";
            listItem.classList.add('dropdown-item');
            parentElement.appendChild(listItem);
        }
    } else {
        results.forEach(word => {
            const listItem =
                document.createElement("li");
            const link =
                document.createElement("a");
            link.classList.add("dropdown-item");
            link.href = "#";
            link.textContent = word;
            listItem.appendChild(link);
            parentElement.appendChild(listItem);
        });
    }
//}
//handleInput();
});

function populate_file_names(){
    console.log('populate filenames')
    console.log(unique_file_names)
    console.log(unique_sheet_names)
    primary_file_name = unique_file_names[0];
    primary_sheet_name = unique_sheet_names[0];
    secondary_file_name = unique_file_names[1];
    secondary_sheet_name = unique_sheet_names[1];
    third_file_name = unique_file_names[2];
    third_sheet_name = unique_sheet_names[2];
    fourth_file_name = unique_file_names[3];
    fourth_sheet_name = unique_sheet_names[3];
}

// populate table elements to return column headers
function populate_table_element_from_selected_file(selected_file, selected_sheet){
    var filename_index = get_file_name_index(selected_file + ' {' + selected_sheet + '}');
    populate_table_element(selected_sheet, filename_index, 'data' + String(filename_index) + '_tableid');
    var createTable_values = get_createTable_by_index(filename_index);
    var col_headers = createTable_values[0];
    return col_headers
}

//TIMER
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
            document.getElementById('calctimer').style.display = 'none';
            document.getElementById('hiddenstillcalculating').style.display = 'block';
        }
    }, 1000);
}

// countdown for determining algoirthm type
//window.onload = function () {
//    var fiveMinutes = 5 * 1,
//        display = document.querySelector('#time');
//    startTimer(fiveMinutes, display);
//};


// suggestion loader
//https://codepen.io/soulwire/pen/mEMPrK

// ——————————————————————————————————————————————————
// TextScramble
// ——————————————————————————————————————————————————
$(document).ready(function () {
    //if (window.location.href.indexOf("algorithmbuilder") > -1 ){
    class TextScramble {
        constructor(el) {
        this.el = el
        this.chars = 'abcdefghijklmnopqrstuvwxyz!<>-_\\/[]{}—=+*^?#________'
        this.update = this.update.bind(this)
        }
        setText(newText) {
        const oldText = this.el.innerText
        const length = Math.max(oldText.length, newText.length)
        const promise = new Promise((resolve) => this.resolve = resolve)
        this.queue = []
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || ''
            const to = newText[i] || ''
            const start = Math.floor(Math.random() * 40)
            const end = start + Math.floor(Math.random() * 40)
            this.queue.push({ from, to, start, end })
        }
        cancelAnimationFrame(this.frameRequest)
        this.frame = 0
        this.update()
        return promise
        }
        update() {
        let output = ''
        let complete = 0
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i]
            if (this.frame >= end) {
            complete++
            output += to
            } else if (this.frame >= start) {
            if (!char || Math.random() < 0.28) {
                char = this.randomChar()
                this.queue[i].char = char
            }
            output += `<span class="dud">${char}</span>`
            } else {
            output += from
            }
        }
        this.el.innerHTML = output
        if (complete === this.queue.length) {
            this.resolve()
        } else {
            this.frameRequest = requestAnimationFrame(this.update)
            this.frame++
        }
        }
        randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)]
        }
    }
    
    // ——————————————————————————————————————————————————
    // Example
    // ——————————————————————————————————————————————————

    const phrases_old = [
        'e.g Combine two datasets by matching on values in a common column',
        'e.g Create a custom Excel formula',
        'e.g Find all the rows that contain specific values',
        'e.g Compare two datasets to find what matches and what doesn\'t',
        'e.g Group rows together that have the same value and calculate metrics for each group',
        'e.g Change values based on an input file',
        'e.g Filter data',
        'e.g Update one file with values from another',
        'e.g Reconcile two files',
        'e.g Search for certain values in multiple files',
        'e.g Create calculated column',
        'e.g Join two datasets',
        'e.g Search through multiple files and combine matching rows into one file'
    ]

    const phrases = [
        'Find every sale greater than $10,000 between March and July',
        'Calculate the highest selling product for each product line',
        'Remove any rows where the Product ID starts with 004',
        'Change the dashes in email address column to underscores',
        'Create a graph to show the number of shipments for each city',
        'Create a new column which calculates the number of days between arrival and departure',
        'Split first name and last name into seperate columns',
        

        
    ]
    
    const el = document.querySelector('.text')
    const fx = new TextScramble(el)
    
    let counter = 0
    const next = () => {
        fx.setText(phrases[counter]).then(() => {
        setTimeout(next, 3200)
        })
        counter = (counter + 1) % phrases.length
    }
    
    next()
//}
});

function write_color(i){
    if (i === 0){
        return input_color
    }
    else if (1 % i === 0){
        return second_color
    }
    else if (i % 2 === 1){
        return third_color
    }
    else{
        return fourth_color
    }
}


// on hover info
$(document).on({mouseenter: function () {
        $(this).closest('.join-tooltip').find('.hover-prompt').css('display', 'block')
    },
    mouseleave: function () {
        $(this).closest('.join-tooltip').find('.hover-prompt').css('display', 'none')
    }
}, ".join-tooltip .infoimg"); 


// check if visible file dialogues are populated
function check_no_incomplete_file_input(){
    var visible_filedrops = $('.file-drop-area:visible');
    for (var i=0;i<visible_filedrops.length;i++){
        var filedrop = visible_filedrops[i];
        if (!check_sheet_selected(filedrop)){
            return false;
        }
        if (!check_filedrop_populated(filedrop)){
            return false;
        }
    }  
    return true;
}

// check if select sheet dropdown is populated
function check_sheet_selected(filedrop){
    var file_dropdown = $(filedrop).find('.dropdown');
    if ($(file_dropdown).is(':visible')){
        if($(file_dropdown).find('.btn').text().includes('Select Sheet')){
            console.log('no shet selected')
            $('.warning-box-wrapper').show();
            $('#warningtext').text('You need to select a sheet for each file containing multiple sheets.')
            return false
        }
    }
    return true;
}


// check if visible filedrops have files
function check_filedrop_populated(filedrop){
    if ($(filedrop).is(':visible')){
        if($(filedrop).find('span').eq(0).text().includes('Choose files')){
            $('.warning-box-wrapper').show();
            $('#warningtext').text('You need to select a file.')
            return false;
        }
        else{
            return true;
        }
    }
}

async function gently_show_tree(){
    try{
        hide_containers(2);
    }
    catch(error){

    }
    console.log('yeah were here')
    document.getElementById('confirm-algo-select').style.display='none';
    document.getElementById('describe-algo-banner').style.display='none';
    var element = document.getElementsByTagName('body')[0];
    element.scroll(-1000,1000);
    window.focus(); 
    window.scrollTo(0,800); 
    window.scroll(-1000,0)
    window.scrollTo(0,0)
    var elem = document.getElementById('algo-desc-graph')
    elem.scroll(-100,0);
    elem.scroll(-1000,0);
    elem.scroll(-10000,0);
    await add_to_carousel('START', action_color, [null], true, false);
    await add_to_carousel('Select algorithm type:', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], true, false);
    await add_to_carousel('The algorithm type decides which options will be provided for you to describe the process you want to create.', action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    elem.fadeIn = function(timing) {
        var newValue = 0;

        elem.style.display = 'block';
        elem.style.opacity = 0;

        var fadeInInterval = setInterval(function() {

            if (newValue < 1) {
                newValue += 0.01;
            }

            elem.style.opacity = newValue;

        }, timing);

    }

    elem.fadeIn(10);
    element.scroll(-1000,1000);
    window.focus(); 
    window.scrollTo(0,800); 
    window.scroll(-1000,0)
    window.scrollTo(0,0)
    elem = document.getElementById('algo-desc-graph')
    elem.scroll(-100,0);
    elem.scroll(-1000,0);
    elem.scroll(-10000,0);
}

async function display_filter_result_table(data){
    console.log('displaying filter _result')
    document.getElementById('edit-data-tables').style.display = "none";
    populate_table_element('nosheetname', 0, 'result_table_tbody', data);
    await add_to_carousel('Algorithm Result:', fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], true, true);
    document.getElementById('resultbox_div').style.display = 'block';
    await clear_global_variables();
}

async function clear_global_variables(){
    console.log('cearling vs')
    gv.data_json = null;
    gv = null;
    var unique_file_names = null;
    var unique_sheet_names = null;
    var carouselText = null;
    var carousel_num = null;
    var primary_file_name = null;
    var primary_file_sheets = null;
    var primary_sheet_name = null;
    var secondary_file_name = null;
    var secondary_file_sheets = null;
    var secondary_sheet_name = null;
    var third_file_name = null;
    var third_sheet_name = null;
    var third_file_sheets = null;
    var fourth_file_name = null;
    var fourth_sheet_name = null;
    var fourth_file_sheets = null;
    var createTable_values1 = null;
    var createTable_values2 = null;
    var createTable_values3 = null;
    var createTable_values4 = null;
    var condition_arr = null;
    var condition_arr2 = null;
    var condition_arr3 = null;
    var condition_arr4 = null;
    var table_html_obj_arr = null;
    var table_html_obj_arr2 = null;
    var table_html_obj_arr3 = null;
    var table_html_obj_arr4 = null;
    var primary_header_row = null;
    var secondary_header_row = null;
    var third_header_row = null;
    var fourth_header_row = null;
    var input_type = null;
    var algorithm_type = null;``
    var newline_scroll = null;
    var start_scrolling_after = null;
    var input_or_description = null;
    var max_file_upload = null;
    var dataset_names = null;
    var dataset_index = null;
    var values_to_extract_dataset = null;
    var values_to_extract_col = null;
    var extract_from = null;
    var all_my_sentences = null;
    var extract_col = null;
    var current_conditions_file = null;
    var input_color = null;
    var second_color = null;
    var third_color = null;
    var fourth_color = null;
    var writings_color = null   ;
    var color_array = null;
    var myanime = null;
    var root = null;
    var treeData = null;
    var action_color = null
    var standard_color =  null; 
    var codexdisplaycolor = null;
    var fyi_color =  null;
    var clean_first_update_file = null;
    var clean_first_join = null;
    var joins_data = null
    var clean_first_update_file = null
    console.log('vsd')
}