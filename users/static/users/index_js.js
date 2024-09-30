$(document).ready(async function() {
    await load_homepage();
});

async function load_homepage(){
    await home_page_carousel('#homepagebannertext', 'doData.ai', [null], true, true);
    await home_page_carousel('#herotext', 'AI Data analysis - offline', [null], true, true);
    await $('#homepagebuildalgo').show();
    await home_page_carousel('#howworkheader', ['ChatGPT Excel Analysis - Offline'], [null], false, false);
    // await home_page_carousel('#howworkheader2', ['Never upload your data'], [null], false, false);
    // await home_page_carousel('#howwork', 'Describe what you want to do to your data.', [null], true, true);
    await showcards();
}

async function showcards(){
    await $('#menu-cards').css('visibility','visible');
    await $('#menu-cards').show();
}

function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
    return ((elemBottom + 50 <= docViewBottom) && (elemTop >= docViewTop));
}

// homepage scroller
// Sticky Header
$(window).scroll(function() {
    if ($(window).scrollTop() > 100) {
        $('.main_h').addClass('sticky');
    } else {
        $('.main_h').removeClass('sticky');
    }
    if(isScrolledIntoView('#howtochoose')){
        howtochoose();
    }
    if(isScrolledIntoView('#describeproblem')){
        describetheproblem();
    }
    if(isScrolledIntoView('#ifunsure')){
        ifunsure();
    }
    //if(isScrolledIntoView('#whereresult')){
    //    whereresult();
    //}
});

var howtochoose = (function() {
    var executed = false;
    return async function() {
        if (!executed) {
            executed = true;
            await home_page_carousel('#howtochoose', 'Use ChatGPT to analyze your data without uploading your files. Describe what you want to do and we\'ll build a simple desktop app you can run offline.', [null], true, true);
            await showalgopaths()
        }
    };
})();
async function showalgopaths(){
    await $('#algopaths').css('visibility','visible');
}

var ifunsure = (function() {
    var executed = false;
    return async function() {
        if (!executed) {
            executed = true;
            await home_page_carousel('#ifunsure', 'Your apps are Python code. Open them with a text editor to see every single line of code. No trust required. 100% transparency.', [null], true, true);
            var linebreak = document.createElement("br");
            $('#ifunsure').append(linebreak);
            var linebreak = document.createElement("br");
            $('#ifunsure').append(linebreak);
            await home_page_carousel('#ifunsure', 'You will need to install Python to run your apps.', [null], true, true);
            await showdesctext()
        }
    };
})();
async function showdesctext(){
    await $('#textbox-algo-desc-wrap').css('visibility','visible');
    await $('#textbox-algo-desc-wrap').show();
}


var whataremnus = (function() {
    var executed = false;
    return async function() {
        if (!executed) {
            executed = true;
            await home_page_carousel('#whataremenus', 'The option menus are different for each algorithm. Use the dropdown menus to select which columns to use and apply any conditions.', [null], true, true);
            await fas()
        }
    };
})();

async function fas(){
    await $('#searchmenu').css('visibility','visible');
    await $('#searchmenu').show();
}

$('#homepagebuildalgo').click(function() {
    window.location.href = '/algorithmbuilder';
});
$('#homepagebuildalgo-btm').click(function() {
    window.location.href = '/algorithmbuilder';
});


var whereresult = (function() {
    var executed = false;
    return async function() {
        if (!executed) {
            executed = true;
            console.log('home triger')
            await home_page_carousel('#whereresult', 'After designing your algorithm press the Build Algorithm button. Your algorithm will execute and display part of your data for review. You can then download the result.', [null], true, true);
            await shobtn();
        }
    };
})();

async function shobtn(){
    await $('#homepagebuildalgobottom').show();
}

var describetheproblem = (function() {
    var executed = false;
    return async function() {
        if (!executed) {
            executed = true;
            await home_page_carousel('#describeproblem', 'Analyze data with AI...', [null], true, true);
            var linebreak = document.createElement("br");
            $('#describeproblem').append(linebreak);
            var linebreak = document.createElement("br");
            $('#describeproblem').append(linebreak);
            await home_page_carousel('#describeproblem', 'keep your files on your computer.', [null], true, true);
            await desp();
        }
    };
})();

async function desp(){
    await $('#searchalgopath').css('visibility','visible');
}




// Mobile Navigation
$('.mobile-toggle').click(function() {
    if ($('.main_h').hasClass('open-nav')) {
        $('.main_h').removeClass('open-nav');
    } else {
        $('.main_h').addClass('open-nav');
    }
});

$('.main_h li a').click(function() {
    if ($('.main_h').hasClass('open-nav')) {
        $('.navigation').removeClass('open-nav');
        $('.main_h').removeClass('open-nav');
    }
});

// Navigation Scroll - ljepo radi materem
$('nav a').click(function(event) {
    var id = $(this).attr("href");
    var offset = 70;
    var target = $(id).offset().top - offset;
    $('html, body').animate({
        scrollTop: target
    }, 500);
    event.preventDefault();
});


//netowrkanimation
$(document).ready(async function() {

    var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};

        largeHeader = document.getElementById('large-header');
        largeHeader.style.height = height+'px';

        canvas = document.getElementById('demo-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create points
        points = [];
        for(var x = 0; x < width; x = x + width/10) {
            for(var y = 0; y < height; y = y + height/20) {
                var px = x + Math.random()*width/10;
                var py = y + Math.random()*height/10;
                var p = {x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for(var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if(!(p1 == p2)) {
                    var placed = false;
                    for(var k = 0; k < 3; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for(var k = 0; k < 3; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for(var i in points) {
            var c = new Circle(points[i], 2+Math.random()*2, 'rgba(92,83,234,0.3)');
            points[i].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        if(!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        var posx = 0
        var posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height+'px';
        canvas.width = width;
        canvas.height = height;
    }

    // animation
    function initAnimation() {
        animate();
        for(var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in points) {
                // detect points in range
                if(Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
            onComplete: function() {
                shiftPoint(p);
            }});
    }

    // Canvas manipulation
    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(92,83,234,'+ p.active+')';
            ctx.stroke();
        }
    }

    function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 4 * Math.PI, false);
            ctx.fillStyle = 'rgba(92,83,234,'+ _this.active+')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
    
});


// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

$(document).ready(async function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
            || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// carousel
$(document).ready(async function() {
    const state = {};
    const carouselList = document.querySelector('.carousel__list');
    const carouselItems = document.querySelectorAll('.carousel__item');
    const elems = Array.from(carouselItems);

    carouselList.addEventListener('click', function (event) {
        if ($(event.target).is('img')){
            var newActive = event.target.parentNode;
            console.log(newActive)
        }
        else{
            var newActive = event.target;
            console.log(newActive)
        }
        
        var isItem = newActive.closest('.carousel__item');
        if (!isItem || newActive.classList.contains('carousel__item_active')) {
            return;
    };
    
    update(newActive);
    });

    const update = function(newActive) {
    const newActivePos = newActive.dataset.pos;

    const current = elems.find((elem) => elem.dataset.pos == 0);
    const prev = elems.find((elem) => elem.dataset.pos == -1);
    const next = elems.find((elem) => elem.dataset.pos == 1);
    const first = elems.find((elem) => elem.dataset.pos == -2);
    const last = elems.find((elem) => elem.dataset.pos == 2);
    //const tre = elems.find((elem) => elem.dataset.pos == 3);
    //const revtre = elems.find((elem) => elem.dataset.pos == -3);
    
    current.classList.remove('carousel__item_active');
    
    // [current, prev, next, first, last, tre, revtre]
    [current, prev, next, first, last].forEach(item => {
        var itemPos = item.dataset.pos;

        item.dataset.pos = getPos(itemPos, newActivePos)
    });
    };

    const getPos = function (current, active) {
    const diff = current - active;

    if (Math.abs(current - active) > 2) {
        return -current
    }

    return diff;
    }
});


