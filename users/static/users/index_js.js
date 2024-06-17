$(document).ready(async function() {
    console.log("Homepage Start")
    start_homepage();
});

async function start_homepage(){
    await home_page_carousel(['Did you do your data today?'], action_color, [null], true, true);
}