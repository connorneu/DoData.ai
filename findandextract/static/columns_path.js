import Tribute from './tribute-master/src/Tribute.js'; 
//https://github.com/zurb/tribute/tree/master

$(document).ready(function() {
    var tribute = new Tribute({
        values: [
          { key: "Phil Heartman", value: "pheartman" },
          { key: "Gordon Ramsey", value: "gramsey" }
        ]
      });
      tribute.attach(document.getElementById("caaanDo"));
      
});


$(document.body).on('click', '#send_input_formula' ,async function(){  

    var usr_formula = $('#send_input_formula').val();
    submit_user_formula(usr_formula);

});