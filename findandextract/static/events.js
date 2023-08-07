
// click start after algorithm description
$(document).ready(async function () {
    $(document.body).on('click', '#start_algoselect' , async function(){       
        document.getElementById('algo-desc-graph').style.display = 'none';
        hide_containers(2);
        await add_to_carousel('Search Algorithm', standard_color, [], true, false);
        await add_to_carousel('\xa0\xa0\xa0$ Multiple Files', standard_color, [], true, false);
        await add_to_carousel('\xa0\xa0\xa0$ Search Input: File', standard_color, [], true, false);
        await add_to_carousel(['File Selection'], action_color, ["document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('action')"], false, false);
        add_to_carousel(['Select files to include in algorithm.'], fyi_color, ['display_multiple_file_drops()', "document.getElementById('carouselcontainer" + (carousel_num) +"').classList.add('actionfyi')"], false, true);
    });
});