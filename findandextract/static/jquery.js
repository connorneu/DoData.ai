data_json = null;
unique_file_names = null;
carouselText = [];
carousel_num = 1;
primary_file_name = null;
primary_file_sheets = [];
primary_sheet_name = null;
secondary_file_name = null;
secondary_file_sheets = [];
secondary_sheet_name = null;
third_file_name = null;
third_sheet_name = null;
third_file_sheets = [];
fourth_file_name = null;
fourth_sheet_name = null;
fourth_file_sheets = [];
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
algorithm_type = null;
newline_scroll = 50;
start_scrolling_after = 10;

// maybe delete these
dataset_names = [];
dataset_index = [];
values_to_extract_dataset = null;
values_to_extract_col = null;
extract_from = [];

extract_col = null;

var input_color = '#529D52';
var second_color = '#BE7070';
var third_color = '#3D7676';
var fourth_color = '#BE9970';


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

        //matchcolumns();
        add_to_carousel(['Define algorithm type'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
        add_to_carousel(['Click through an algorithm path to describe the data process.'], fyi_color, ['display_algo_graph()', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
        
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

async function typeSentence(sentence, eleRef, color, delay =00) {
  const letters = sentence.split("");
  var arr = [];
  let i = 0;
  var is_spaned = false;
  while(i < letters.length) {
    await waitForMs(delay);
    if(letters[i-1] === ':'){
        is_spanned = true;
        arr.push('<span style="color:' + color + ';">')
    }
    arr.push(letters[i])
    i++
  }
  if(is_spaned){
    //$(eleRef).append('</span>');
    arr.push('</span>')
  }
  var vals = arr.join('')
  console.log(vals)
  $(eleRef).append(vals);
  return;
}

async function typeSentenceFA(sentence, eleRef, color, delay =00) {
  const letters = sentence.split("");
  console.log(color)
  let i = 0;
  var is_spaned = false;
  while(i < letters.length) {
    await waitForMs(delay);
    if(letters[i] === ':'){
        is_spanned = true;
        
        $(eleRef).append('<span style="color:' + color + ';">');
        console.log(i)
        console.log(letters.length)
    }
    $(eleRef).append(letters[i]);
    i++
  }
  //if(is_spaned){
  //  $(eleRef).append('</span>');
  //}
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
        await typeSentence(carousel_obj.text, carousel_obj.id, carousel_obj.color);
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
    //data_json = JSON.parse(document.getElementById('fande_data_dump').textContent);
    unique_file_names = uniq_fast(data_json, 'file_name');  // calcualte file names 
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
    if (algorithm_type === 'Extract'){
        if (input_type === 'File'){
            start_extract_file();
        }
        else if(algorithm_type === 'Custom'){
            start_extract_custom();
        }
    }
    else if (algorithm_type === 'Combine'){
        if (input_type === 'Rows'){
            start_combine_rows();
        }
        else if (input_type === 'Columns'){
            start_combine_column();
        }
    }

}

async function start_extract_file(){
    await add_to_carousel(['Select dataset containing values to search for and extract:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false); 
    await add_to_carousel(['This file contains the values that will be searched for in other datasets.',
                        'Rows of data from the other datasets that match these values will be extracted.'],
                        fyi_color, ['display_primaryfileselect_drop()',"document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
}
async function start_extract_custom(){
    await add_to_carousel(['Enter in the values to search for in other documents:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false); 
    await add_to_carousel(['These are the values that will be searched for in other documents.',
                        'Each of these values will be searched for in the other files uploaded.',
                        'You will speicfy where in the other files these values wil be searched and any conditions that need apply.'],
                        fyi_color, ['display_primaryfileselect_drop()',"document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
}

async function start_combine_rows(){
    await add_to_carousel(['Select the dataset to combine with other uploaded files:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false); 
    await add_to_carousel(['This file has a column of values that can be found in the other uploaded datasets.',
                        'When these values are found in other files, data from selected columns will be added to this dataset at the corresponding row.'],
                        fyi_color, ['display_primaryfileselect_drop()',"document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
}

async function start_combine_column(){
    await add_to_carousel(['Select the dataset to combine with other uploaded files:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false); 
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

async function display_conditions(){
    hide_containers(2);
    var cond_count = 1;
    var condition_string = null;
    await add_to_carousel('\xa0\xa0\xa0' + 'Filter Input Data (' + primary_file_name + ' ' + primary_sheet_name + '):', input_color, [null], true, false);
    if (condition_arr.length === 1 && condition_arr[0][1] === 'Select Column' &&  condition_arr[0][2] === 'Equals'){
        condition_string = '\xa0\xa0\xa0' + '\xa0\xa0\xa0' + 'No conditions applied';
        await add_to_carousel(condition_string, input_color, [null], true, false);
    }
    else{
        for (var i = condition_arr.length-1; i >= 0; i--){
            if (condition_arr[i][4].length === 0){        
                condition_string = '\xa0\xa0\xa0' + '\xa0\xa0$\xa0' + condition_arr[i][1] + ' ' + condition_arr[i][2] + ' ' + condition_arr[i][3]
            }
            else{
                condition_string = '\xa0\xa0\xa0' + '\xa0\xa0$\xa0' + condition_arr[i][1] + ' ' + condition_arr[i][2] + ' ' + condition_arr[i][3] + ' and ' + condition_arr[i][4]
            }
            await add_to_carousel(condition_string, input_color , [null], true, false);
            cond_count++;
        }    
    }
    //algo_menu()  //   THIS IS ONLY COMMENTED TO MAKE SHIT SKIP DURNIG DEV
    select_find_column();     
}

async function select_find_column(){    
    await add_to_carousel(['Select column with values to search for in other datasets:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    await add_to_carousel(['Values in this column will be searched for in other datasets.',
                            'Rows containing these values will be extracted'],
                    fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    var col_headers = createTable_values1[0];
    populate_drop_down("#matchprimarycol_ul", col_headers, true);
    
    document.getElementById('matchboxcolumn').style.display = 'flex';
    document.getElementById('firstmatchbox').style.display = 'block';
    $(document.body).on('click', '#matchprimarycol_ul' , async function(){ 
        document.getElementById('firstmatchbox').style.display = 'none';
        hide_containers(2);
        extract_col = $(this).parents(".dropdown").find('.btn').text();
        var extract_from_str = '\xa0\xa0\xa0' + 'Find values from column: ' + extract_col
        await add_to_carousel(extract_from_str, input_color , [null], true, false);
        
        
        start_second_dataset();

    });

}

async function display_conditions2(){
    hide_containers(2);
    var cond_count = 1;
    var condition_string = null;
    await add_to_carousel('\xa0\xa0\xa0' + 'Filter Extract Data (' + secondary_file_name + ' ' + secondary_sheet_name + '):', second_color, [null], true, false);
    console.log(condition_arr2[0][1])
    console.log(condition_arr2[0][2])
    console.log(condition_arr2[0][3])
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
        
        
        if(!third_file_name){
            start_third_dataset()
        }
        else{
            summarize_choices()
        }
    });
}

async function display_conditions3(){
    hide_containers(2);
    var cond_count = 1;
    var condition_string = null;
    await add_to_carousel('\xa0\xa0\xa0' + 'Filer Extract Data (' + third_file_name + ' ' + third_sheet_name + '):', third_color, [null], true, false);
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
        
        
        if(!fourth_file_name){
            start_fourth_dataset()
        }
        else{
            summarize_choices()
        }
    });
}

async function display_conditions4(){
    hide_containers(2);
    var cond_count = 1;
    var condition_string = null;
    await add_to_carousel('\xa0\xa0\xa0' + 'Filer data ' + (condition_arr4.length) + ' conditions:', fourth_color, [null], true, false);
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
                
        summarize_choices()        
    });
}

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
    document.getElementById("typingtextcontainer").style.overflow = "scroll";
    document.getElementById("typingtextcontainer").style.overflowX = "hidden";
    document.getElementById("typingtextcontainer").style.width = "100%";
    
    document.getElementById("typingtextcontainer").style.justifyContent = "center";

    document.getElementById("carouselcontainer3").style.marginBottom = "3%";
    document.getElementById("feature-text3").style.fontSize = "40px";
    
    document.getElementById("typingtextcontainer").style.display = "flex";

    $(document.body).on('click', '#addmatchdataset' , async function(){


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
    //dataset_names = ['Address.csv' + ' {' + 'Sheet1' + '}',
    //                'Client Data.csv' + ' {' + 'Sheet1' + '}',
    //                'Client Values.csv' + ' {' + 'Sheet1' + '}',
    //                'Program Info.csv' + '{' + 'Sheet1' + '}'];
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
  $(eleRef).css('color', 'white'); 
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

function populate_table_element(selected_sheet, tablenumber, data_tableid, result_data=null){
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
    else if(tablenumber === 0){
        var repivoted_data = repivot_keyval(data_json, 'nofilename', 'nosheetname', result_data['result_table']);
        var createTable_values0 = createTable(repivoted_data, data_tableid);
        var col_headers = createTable_values0[0];
        var createTable_html = createTable_values0[1];
        var table_html_obj_arr0 = parse_table_column_values(createTable_html);

    }
    return col_headers;
}

function repivot_keyval(data_json, file_name, sheet_name, result_data=null) {
    result_table = [];
    // not super sure what this does --- it unpivots to original json object with file_name, sheet_name, key, value
    var is_data_json = false;
    if (result_data===null){
        var entries = Object.entries(data_json);
        is_data_json = true;
    }
    else{
        var entries = Object.entries(result_data);
        is_data_json = false;
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
                console.log(objs[i])
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

function adjust_svg_img_y_pos(class_name){
    var parent_nodes = document.getElementsByClassName(class_name);
    for (var i = 0; i<parent_nodes.length; i++){ 
        var node_name = parent_nodes[i].getElementsByTagName('tspan')[0].innerHTML;
        if (node_name === 'Update'){
            var img_node = parent_nodes[i].getElementsByTagName('image')[0].setAttribute('y',-250);    
        } 
        if (node_name === 'Combine'){
            var img_node = parent_nodes[i].getElementsByTagName('image')[0].setAttribute('y',-150);    
        }
        if (node_name === 'Reconcile'){
            var img_node = parent_nodes[i].getElementsByTagName('image')[0].setAttribute('y',-375);    
        }
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
                name: "Extract",
                image: "/static/images/Extract.png",
                children: [{
                        name: "Search for values from input file",
                        children: [
                            {
                                name: "START"
                            }
                        ]
                    },
                    {
                        name: "Search for custom values",
                        children: [
                            {
                                name: "START"
                            }
                        ]
                    }
                ]
            },            
            {
                name:"Combine",
                image: "/static/images/Combine.png",
                children: [{
                        name: "Join files on rows",
                        children: [{
                                name: "START"
                            }
                        ]
                    },
                    {
                        name: "Join files on columns",
                        children: [{
                                name: "START"
                            }
                        ]
                    }
                ]
            },
            {
                name:"Update",
                image: "/static/images/Update.png",
                children: [
                    {
                        name: "Upload list of values to update",
                        children: [{
                                name: "START"                                
                            }
                        ]
                    },
                    {
                        name: "Enter in values to update",
                        children: [{
                                name: "START"
                            }
                        ]
                    }
                ]
            },
            {
                name: "Reconcile",
                image: "/static/images/Reconcile.png",
                children: [
                    {
                            name: "Find records that match",
                            image: "https://dummyimage.com/50x50"
                    },
                    {
                        name: "Find records that don't match",
                        image: "https://dummyimage.com/50x50"
                    },
                    {
                        name: "List all records and whether they match",
                        image: "https://dummyimage.com/50x50"
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
            .attr("x", 175)  //116
            .attr("y", -25)     //-25
            .attr("width", 650)       //50
            .attr("height", 500);

;       

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
        adjust_svg_img_y_pos('node parent-node');

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

async function begin_file_upload(){
    document.getElementById('algo-desc-graph').style.display = 'none';
    hide_containers(2);
    await add_to_carousel('SUMMARY OF ALGORITHM', standard_color, [null], true, false);
    await add_to_carousel('Algorithm Type: ' + algorithm_type, standard_color, [], true, false);
    await add_to_carousel('\xa0\xa0$\xa0' + 'Input Format: ' + input_type, standard_color, [], true, false);
    await add_to_carousel(['File Selection'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    add_to_carousel(['Select files to include in algorithm.'], fyi_color, ['display_multiple_file_drops()', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
}

async function start_algo_path(node_name, parent_node_name){
    if (node_name === 'START'){
        if (parent_node_name === 'Search for values from input file'){
            console.log('extract - file input')
            algorithm_type = 'Extract';
            input_type = 'File';  
            //describe_search_file_single()
            begin_file_upload();
        }
        else if (parent_node_name === 'Search for custom values entered manually'){
            console.log('extract - custom input')
            algorithm_type = 'Extract';
            input_type = 'Custom';            
            begin_file_upload();
        }
    
        else if(parent_node_name === 'Join files on rows'){
            console.log('Combine on rows')
            algorithm_type = 'Combine';
            input_type = 'Rows'; 
            begin_file_upload();
        }
        else if (node_name === 'Join files on columns'){
            console.log('Combine on columns')
            algorithm_type = 'Combine';
            input_type = 'Columns'; 
            begin_file_upload();
        }

        else if(parent_node_name === 'Join files on rows'){
            console.log('Combine on rows')
            algorithm_type = 'Combine';
            input_type = 'Rows';  
            begin_file_upload();
        }
        else if (node_name === 'Join files on columns'){
            console.log('Combine on columns')
            algorithm_type = 'Combine';
            input_type = 'Columns'; 
            begin_file_upload();
        }
    }
    //describe_search_file_single();
    //begin_file_upload();
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


// collect algorithm parameters
async function collect_extract_parameters(){
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

function print_the_filtered_data(data){
    console.log('PRINT THE FILTERED DATA')
    console.log(data)
}

async function display_result_table(data){
    hide_containers(2);
    document.getElementById('matchcolumnscontainer').style.display = 'none'; 
    populate_table_element('nosheetname', 0, 'result_table_tbody', data);
    await add_to_carousel(['Adjust result:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false); 
    await add_to_carousel(['First 25 rows of table displayed below.', 'Apply additional conditions, add or remove columns, or export result.'], fyi_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    document.getElementById('resultbox_div').style.display = 'block';
    
}


//HORIZONTAL NAVBAR  https://codepen.io/DaiSenzz/pen/wvQGjQd
$(document).ready(function() {
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
});