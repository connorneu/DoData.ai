async function start_reconcile(){
    
    await add_to_carousel(['Select files to reconcile:'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
    document.getElementById('reconcilefiles').style.display = 'block';
    center_match_columns();
}

function center_match_columns(){
    var left_parent = document.getElementById("reco-first-file");
    var right_parent = document.getElementById("reco-second-file");
    var left_children = document.getElementsByClassName("dropdown nohide matchcol-left");
    var right_children = document.getElementsByClassName("dropdown nohide matchcol-right");
    var leftPos = left_parent.getBoundingClientRect();
    var rightPos = right_parent.getBoundingClientRect();
    for (var i=0;i<left_children.length;i++){
        console.log('here')
        var left_child_pos = left_children[i].getBoundingClientRect();
        var right_child_pos = right_children[i].getBoundingClientRect();
        left_children[i].style.left = (leftPos.left - left_child_pos.left) + ((leftPos.width - left_child_pos.width) / 2)   + "px";
        right_children[i].style.left = (rightPos.left - right_child_pos.left) + ((rightPos.width - right_child_pos.width) / 2)   + "px";
    }
}

$(document.body).on('click', '#reco-add-match' ,async function(){ 
    var colmatch_parent = document.getElementById("reco-all-cols-to-match");
    var clone_match = colmatch_parent.getElementsByClassName('reco-col-match')[0].cloneNode(true);
    colmatch_parent.appendChild(clone_match);

}); 