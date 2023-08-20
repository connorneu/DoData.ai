data_json = null;
unique_file_names = null;
carouselText = [];
carousel_num = 1;
primary_file_name = null;
primary_file_sheets = [];
primary_sheet_name = null;
secondary_file_name = null;
secondary_sheet_name = null;
third_file_name = null;
third_sheet_name = null;
fourth_file_name = null;
fourth_sheet_name = null;
createTable_values1 = '';
createTable_values2 = '';
createTable_values3 = '';
createTable_values4 = '';
condition_arr = [];
condition_arr2 = [];
condition_arr3 = [];
condition_arr4 = [];
table_html_obj_arr = null;
table_html_obj_arr2 = null;
table_html_obj_arr3 = null;
table_html_obj_arr4 = null;
primary_header_row = 0;
secondary_header_row = 0;
third_header_row = 0;
fourth_header_row = 0;
input_type = null;
input_num = null;
algorithm_type = null;
newline_scroll = 50;
start_scrolling_after = 10;
dataset_names = [];
dataset_index = [];


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
    console.log(carousel_num);
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
    if (carousel_num > 14){
        console.log('cuntz')
        var element = document.getElementById('typingtextcontainer');
        element.scrollIntoView(false);
        element.scroll(-1000,500);
        window.focus();
        window.scrollTo(0,800);
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

async function display_multiple_file_drops(){
    document.getElementById('filedrops').style.display = 'block';
    //    addsecondfile click event decides how many files are displayed
}

async function display_algo_graph(){
    document.getElementById('algo-desc-graph').style.display = 'block';
}

async function start_data_filter(db_data){  
    document.getElementById('filedrops').style.display = 'none';
    hide_containers(2);
    data_json = db_data['fande_data_dump'];
    console.log(data_json)
    //data_json = JSON.parse(document.getElementById('fande_data_dump').textContent);
    unique_file_names = uniq_fast(data_json, 'file_name');  // calcualte file names 
    for (var i = 0; i<unique_file_names.length; i++){
        await add_to_carousel('Loaded file: ' + unique_file_names[i], standard_color, [null], true, false);
    }
    start_first_dataset();  
}

async function start_first_dataset(){
    await add_to_carousel(['Select first dataset:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false); 
    await add_to_carousel(['Select file name, sheet name (if applicable), column headers, and any filters to exclude unwanted data.'],
                        fyi_color, ['display_primaryfileselect_drop()',"document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
}

async function start_second_dataset(){
    await add_to_carousel(['Select second dataset:'], action_color, ['update_item_text_params(algorithm_type)', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    await add_to_carousel(['Select file name, sheet name (if applicable), column headers, and any filters to exclude unwanted data.'],
                    fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')", "display_secondaryfileselect_drop()"], false, true);
}

async function start_third_dataset(){
    await add_to_carousel(['Select third dataset:'], action_color, ['update_item_text_params(algorithm_type)', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    await add_to_carousel(['Select file name, sheet name (if applicable), column headers, and any filters to exclude unwanted data.'],
                    fyi_color, ['display_thirdfileselect_drop()',"document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
}

async function start_fourth_dataset(){
    await add_to_carousel(['Select fourth dataset:'], action_color, ['update_item_text_params(algorithm_type)', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    await add_to_carousel(['Select file name, sheet name (if applicable), column headers, and any filters to exclude unwanted data.'],
                    fyi_color, ['display_fourthfileselect_drop()',"document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
}


async function display_conditions(){
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
    algo_menu()
    //start_second_dataset();    THIS IS ONLY COMMENTED TO MAKE SHIT SKIP DURNIG DEV but also ur missing custum input option
}

async function display_conditions2(){
    hide_containers(2);
    var cond_count = 1;
    var condition_string = null;
    await add_to_carousel('Filer data ' + (condition_arr2.length) + ' conditions:', standard_color, [null], true, false);
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
    if(!third_file_name){
        start_third_dataset()
    }
    else{
        algo_menu()
    }
}

async function display_conditions3(){
    hide_containers(2);
    var cond_count = 1;
    var condition_string = null;
    await add_to_carousel('Filer data ' + (condition_arr3.length) + ' conditions:', standard_color, [null], true, false);
    for (var i = condition_arr3.length-1; i >= 0; i--){   
        if (condition_arr3[i][4].length === 0){        
            condition_string = '\xa0\xa0$\xa0' + condition_arr3[i][1] + ' ' + condition_arr3[i][2] + ' ' + condition_arr3[i][3]
        }
        else{
            condition_string = '\xa0\xa0$\xa0' + condition_arr3[i][1] + ' ' + condition_arr3[i][2] + ' ' + condition_arr3[i][3] + ' and ' + condition_arr3[i][4]
        }
        await add_to_carousel(condition_string, standard_color, [null], true, false);
        cond_count++;
    }
    if(!fourth_file_name){
        start_fourth_dataset()
    }
    else{
        algo_menu()
    }
}

async function display_conditions4(){
    hide_containers(2);
    var cond_count = 1;
    var condition_string = null;
    await add_to_carousel('Filer data ' + (condition_arr4.length) + ' conditions:', standard_color, [null], true, false);
    for (var i = condition_arr4.length-1; i >= 0; i--){   
        if (condition_arr4[i][4].length === 0){        
            condition_string = '\xa0\xa0$\xa0' + condition_arr4[i][1] + ' ' + condition_arr4[i][2] + ' ' + condition_arr4[i][3]
        }
        else{
            condition_string = '\xa0\xa0$\xa0' + condition_arr4[i][1] + ' ' + condition_arr4[i][2] + ' ' + condition_arr4[i][3] + ' and ' + condition_arr4[i][4]
        }
        await add_to_carousel(condition_string, standard_color, [null], true, false);
        cond_count++;
    }

    algo_menu()

}

async function algo_menu(){
    algorithm_type='Extract';
    if (algorithm_type === 'Extract'){
        matchcolumns();    
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

async function matchcolumns(){
    await add_to_carousel(['Select values to search for in other files:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    await add_to_carousel(['Select the column which contains the values to search for in other datasets.',
    'Any row of data that contains these values will be extracted.'], fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    document.getElementById('matchcolumnscontainer').style.display = 'block';
    populate_dataset_names();
    var dataset_selection = null;
    populate_drop_down("#matchprimarydata_ul", dataset_names, true);
    $(document.body).on('click', '#matchprimarydata_ul' ,function(){ 
        dataset_selection =  $(this).parents(".dropdown").find('.btn').text();
        var file_and_sheet = get_file_and_sheet(dataset_selection);
        var col_headers = match_dataset_to_colheaders(file_and_sheet);
        populate_drop_down("#matchprimarycol_ul", col_headers, true);
        document.getElementById('matchboxcolumn').style.display = 'flex';
    });
    var column_selection = null;
    $(document.body).on('click', '#matchprimarycol_ul' , async function(){
        column_selection =  $(this).parents(".dropdown").find('.btn').text();
        document.getElementById('firstmatchbox').style.display = 'none';
        document.getElementById('matchdatasetsbuttons').style.display = 'block';
        hide_containers(2);
        await add_to_carousel('Search for values from ' + dataset_selection, standard_color, [null], true, false);
        await add_to_carousel('For each value in column ' + column_selection, standard_color, [null], true, false);
        extractfrom_selection();
    });  
}
async function extractfrom_selection(){
    await add_to_carousel(['Select datasets to extract from:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    await add_to_carousel(['Specify the column to search for matching values and extract resulting rows.'], fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    document.getElementById('secondmatchbox').style.display = 'block';
    populate_drop_down("#matchseconddata_ul", dataset_names, true); //should you remove the primary dataset?
    var dataset_selection = null;
    $(document.body).on('click', '#matchseconddata_ul' , async function(){ 
        dataset_selection =  $(this).parents(".dropdown").find('.btn').text();
        var file_and_sheet = get_file_and_sheet(dataset_selection);
        var col_headers = match_dataset_to_colheaders(file_and_sheet);
        populate_drop_down("#matchsecondcol_ul", col_headers, true);
        document.getElementById('matchboxcolumn2').style.display = 'flex';
    });
    $(document.body).on('click', '#addmatchdataset' , async function(){
        if (document.getElementById('thirdmatchbox').style.display === 'none'){
            document.getElementById('thirdmatchbox').style.display = 'block';
            populate_drop_down("#matchthirddata_ul", dataset_names, true);
        }
        else if (document.getElementById('fourthmatchbox').style.display === 'none'){
            document.getElementById('fourthmatchbox').style.display = 'block';
            populate_drop_down("#matchfourthdata_ul", dataset_names, true);
            document.getElementById('addmatchdataset').style.display = 'none';
        }
    });
}

function populate_dataset_names(){
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
        dataset_names.push(fourth_sheet_name + '{' + fourth_sheet_name + '}');
    }
    //DELETE THIS its to prvent having to upload 4 files every test
    dataset_names = [primary_file_name + ' {' + primary_sheet_name + '}',
                    'Client Data.csv' + ' {' + secondary_sheet_name + '}',
                    'Client Values.csv' + ' {' + third_sheet_name + '}',
                    'Program Info.csv' + '{' + fourth_sheet_name + '}'];
}

function get_file_and_sheet(dataset_selection){
    var lastIndex = dataset_selection.trim().lastIndexOf('{');
    var filename = dataset_selection.substr(0, lastIndex).trim();
    var sheetname = dataset_selection.substr(lastIndex+1);
    sheetname = sheetname.slice(0, -1).trim();
    return [filename, sheetname];
}

function match_dataset_to_colheaders(file_and_sheet){
    console.log('start col header match')
    console.log(file_and_sheet[0])
    console.log(file_and_sheet[1])
    console.log(dataset_index)
    for(var i = 0; i<dataset_index.length; i++){
        console.log(file_and_sheet[0] + " . " + dataset_index[i][0] + " | " + file_and_sheet[1] + " . " + dataset_index[i][1])
        if (file_and_sheet[0] === dataset_index[i][0] && file_and_sheet[1] === dataset_index[i][1]){
            console.log("found col headers")
            return dataset_index[i][2]
        } 
    }
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

// select third file
async function display_thirdfileselect_drop(){
    populate_drop_down('#thirdfile_ul', unique_file_names, true)
    document.getElementById('thirdfiledrop').style.display = 'block';
}

// select third sheet
function display_thirdfilesheets_drop() {
    populate_drop_down('#thirdsheet_ul', secondary_file_sheets, true)
} 

// select fourth file
async function display_fourthfileselect_drop(){
    populate_drop_down('#fourthfile_ul', unique_file_names, true)
    document.getElementById('fourthfiledrop').style.display = 'block';
}

// select fourth sheet
function display_fourthfilesheets_drop() {
    populate_drop_down('#secondarysheet_ul', secondary_file_sheets, true)
}

function display_add_conditions_btn(){
    document.getElementById('primarycondition-container').style.display = 'block';
}

function display_add_conditions_btn2(){
    document.getElementById('secondarycondition-container').style.display = 'block';
}

function display_add_conditions_btn3(){
    document.getElementById('thirdcondition-container').style.display = 'block';
}

function display_add_conditions_btn4(){
    document.getElementById('fourthcondition-container').style.display = 'block';
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
        await add_to_carousel(['Select worksheet from input file'], action_color,  ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
        await add_to_carousel(['The selected worksheet should contain the data to search for in other datasets.', 'You can search for this data in other sheets from the same workbook.'], fyi_color,["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')", 'display_primaryfilesheets_drop()'], false, true); 
    }
    else{
        primary_sheet_name = "Sheet1";
        await add_to_carousel('Input sheet: Sheet1 (default - file only has one sheet)', standard_color, ['adjust_col_header()'], true, false);
    }   
}

async function secondary_sheet_selection(){
    if (secondary_file_sheets.length > 1) {
        await add_to_carousel(['Select worksheet from file'], action_color,  ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
        await add_to_carousel(['The selected worksheet should contain the data to search for in other datasets.', 'You can search for this data in other sheets from the same workbook.'], fyi_color,["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')", 'display_secondaryfilesheets_drop()'], false, true); 
    }
    else{
        secondary_sheet_name = "Sheet1";
        await add_to_carousel('Data sheet: Sheet1 (default - file only has one sheet)', standard_color, ['adjust_col_header2()'], true, false);
    }   
}

async function third_sheet_selection(){
    if (secondary_file_sheets.length > 1) {
        await add_to_carousel(['Select worksheet from file'], action_color,  ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
        await add_to_carousel(['The selected worksheet should contain the data to search for in other datasets.', 'You can search for this data in other sheets from the same workbook.'], fyi_color,["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')", 'display_secondaryfilesheets_drop()'], false, true); 
    }
    else{
        third_sheet_name = "Sheet1";
        await add_to_carousel('Data sheet: Sheet1 (default - file only has one sheet)', standard_color, ['adjust_col_header3()'], true, false);
    }   
}

async function fourth_sheet_selection(){
    if (secondary_file_sheets.length > 1) {
        await add_to_carousel(['Select worksheet from file'], action_color,  ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
        await add_to_carousel(['The selected worksheet should contain the data to search for in other datasets.', 'You can search for this data in other sheets from the same workbook.'], fyi_color,["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')", 'display_secondaryfilesheets_drop()'], false, true); 
    }
    else{
        fourth_sheet_name = "Sheet1";
        await add_to_carousel('Data sheet: Sheet1 (default - file only has one sheet)', standard_color, ['adjust_col_header4()'], true, false);
    }   
}

function adjust_col_header(){
    add_to_carousel(['Change column headers'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    add_to_carousel(['Current column headers are highlighted in white.','If your column headers are not on the first row, then click on the row containing your column headers.',
    'Otherwise, click next.'], fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    document.getElementById("colselecttablediv1").style.display = "block";
    col_headers = populate_table_element(primary_sheet_name, 1, 'data1_tableid');
}

function adjust_col_header2(){
    add_to_carousel(['Change column headers'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    add_to_carousel(['Current column headers are highlighted in white.','If your column headers are not on the first row, then click on the row containing your column headers.',
    'Otherwise, click next.'], fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    document.getElementById("colselecttablediv2").style.display = "block";
    col_headers = populate_table_element(secondary_sheet_name, 2, 'data2_tableid');
}

function adjust_col_header3(){
    add_to_carousel(['Change column headers'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    add_to_carousel(['Current column headers are highlighted in white.','If your column headers are not on the first row, then click on the row containing your column headers.',
    'Otherwise, click next.'], fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    document.getElementById("colselecttablediv3").style.display = "block";
    col_headers = populate_table_element(third_sheet_name, 3, 'data3_tableid');
}

function adjust_col_header4(){
    add_to_carousel(['Change column headers'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    add_to_carousel(['Current column headers are highlighted in white.','If your column headers are not on the first row, then click on the row containing your column headers.',
    'Otherwise, click next.'], fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    document.getElementById("colselecttablediv4").style.display = "block";
    col_headers = populate_table_element(fourth_sheet_name, 4, 'data4_tableid');
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
    else if(tablenumber === 2){
        var repivoted_data = repivot_keyval(data_json, secondary_file_name, selected_sheet);
        createTable_values2 = createTable(repivoted_data, data_tableid);
        col_headers = createTable_values2[0];
        var createTable_html = createTable_values2[1];
        table_html_obj_arr2 = parse_table_column_values(createTable_html);
    }
    else if(tablenumber === 3){
        var repivoted_data = repivot_keyval(data_json, third_file_name, selected_sheet);
        createTable_values3 = createTable(repivoted_data, data_tableid);
        col_headers = createTable_values3[0];
        var createTable_html = createTable_values3[1];
        table_html_obj_arr3 = parse_table_column_values(createTable_html);
    }
    else if(tablenumber === 4){
        var repivoted_data = repivot_keyval(data_json, fourth_file_name, selected_sheet);
        createTable_values4 = createTable(repivoted_data, data_tableid);
        col_headers = createTable_values4[0];
        var createTable_html = createTable_values4[1];
        table_html_obj_arr4 = parse_table_column_values(createTable_html);
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
    children: [
            {
                name: "Automate",
                image: "/static/images/search file from file.png",
                children: [
                            {
                                name: "Extract",                             
                                children: [{
                                        name: "Search for values from input file",
                                        children: [
                                            {
                                                name: "Extract matching values into new report"
                                            }
                                        ]
                                    },
                                    {
                                        name: "Search for custom values entered manually",
                                        children: [
                                            {
                                                name: "Extract matching values into new report"
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
            },
            {
                name: "Analyze",
                children:
                [
                    {
                        name: "AI",
                        children: 
                        [{
                            name: "Model",
                            children: [{
                                name: "Classify"
                            },
                            {
                                name: "Predict Numerical Value"
                            }]
                        }]                        
                    },
                    {
                        name: "Insight",
                        children: 
                        [{
                            name: "Relationship Analysis"
                        },
                        {
                            name: "Outlier Detection"
                        }]
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
            start_algo_path(d.data.name, d.parent.data.name);
            
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

async function start_algo_path(node_name, parent_node_name){
    if (node_name === 'Extract matching values into new report'){
        if (parent_node_name === 'Search for values from input file'){
            console.log('extract - file input')
            algorithm_type = 'Extract';
            input_type = 'File';
            input_num = 'Single';        
        }
        else if (parent_node_name === 'Search for custom values entered manually'){
            console.log('extract - custom input')
            algorithm_type = 'Extract';
            input_type = 'Custom';
            input_num = 'Single';          
        }
    }
    else if(node_name === ''){
        console.log('search custom single')
        algorithm_type = 'Extract';
        input_type = 'Custom';
        input_num = 'Single';       
    }
    else if (node_name === ''){
        console.log('search fle multiple')
        algorithm_type = 'Extract';
        input_type = 'File';
        input_num = 'Multiple';   
        
    }
    describe_search_file_single();
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
    var url = window.location.href;
    if( url.indexOf('#') < 0 ) {
        window.location.replace(url + "#");
    } else {
        window.location.replace(url);
    }
});


