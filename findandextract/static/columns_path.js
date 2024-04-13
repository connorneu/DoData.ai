import Tribute from './tribute-master/src/Tribute.js'; 

$(document).ready(function() {
    var tribute = new Tribute({
        values: [
          { key: "Phil Heartman", value: "pheartman" },
          { key: "Gordon Ramsey", value: "gramsey" }
        ]
      });
      tribute.attach(document.getElementById("caaanDo"));
      
});