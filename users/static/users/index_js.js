$(document).ready(async function() {
    await load_homepage();
});

async function load_homepage(){
    await home_page_carousel('#homepagebannertext', 'doData.ai', [null], true, true);
    await home_page_carousel('#herotext', 'AI Data analysis - offline', [null], true, true);
    await $('#homepagebuildalgo-wrap').show();
    await home_page_carousel('#howworkheader', ['What is doData.ai?'], [null], false, false);
    // await home_page_carousel('#howworkheader2', ['Never upload your data'], [null], false, false);
    // await home_page_carousel('#howwork', 'Describe what you want to do to your data.', [null], true, true);
}

$('#homepagebuildalgo').click(function() {
    window.location.href = '/excel_ai';
});
$('#homepagebuildalgo-bottom').click(function() {
    window.location.href = '/excel_ai';
});

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
    if(isScrolledIntoView('#whatisheader')){
        whatis();
    }
    if(isScrolledIntoView('#likewhatheader')){
        likewhat();
    }
    if(isScrolledIntoView('#howdoesitworkheader')){
        howdoesitwork();
    }
    if(isScrolledIntoView('#whatappletheader')){
        whatapplet();
    }
    if(isScrolledIntoView('#whatispythonheader')){
        whatispython();
    }
    //if(isScrolledIntoView('#butwhyheader')){
    //    butwhy();
    //}
});

var whatis = (function() {
    var executed = false;
    return async function() {
        if (!executed) {
            executed = true;
            await home_page_carousel('#whatisheader', 'What is doData.ai?', [null], true, true);
            await home_page_carousel('#whatis', 'An app which performs Excel analysis using AI offline.', [null], true, true);
            var linebreak = document.createElement("br");
            $('#whatis').append(linebreak);
            await home_page_carousel('#whatis', 'Ask ChatGPT to do stuff to your excel files without ever uploading your data to any website.', [null], true, true);
            await showutube()
        }
    };
})();



async function showutube(){
    await $('#utube').css('visibility','visible');
}


var likewhat = (function() {
    var executed = false;
    return async function() {
        if (!executed) {
            executed = true;
            var linebreak = document.createElement("br");
            //await home_page_carousel('#likewhatheader', 'Like what?', [null], true, true);
            await showslideshow();
            await showscarousel();
        }
    };
})();
async function showslideshow(){
    await $('#slideshow').css('visibility','visible');
    await $('#slideshow').show();
}
async function showscarousel(){
    await $('#menu-cards').css('visibility','visible');
    await $('#menu-cards').show();
}

var howdoesitwork = (function() {
    var executed = false;
    return async function() {
        if (!executed) {
            executed = true;
            await home_page_carousel('#howdoesitworkheader', 'How does it work?', [null], true, true);
            await home_page_carousel('#howdoesitwork', '1. Describe what you want to do to your data.', [null], true, true);
            var linebreak = document.createElement("br");
            $('#howdoesitwork').append(linebreak);
            await home_page_carousel('#howdoesitwork', '2. Copy and paste your column headers.', [null], true, true);
            var linebreak = document.createElement("br");
            $('#howdoesitwork').append(linebreak);
            var linebreak = document.createElement("br");
            $('#howdoesitwork').append(linebreak);
            await home_page_carousel('#howdoesitwork', 'We\'ll create an applet for you to download and run from your computer.', [null], true, true);
            var linebreak = document.createElement("br");
            $('#howdoesitwork').append(linebreak);
            await home_page_carousel('#howdoesitwork', 'The applet is a tiny desktop app that runs from your computer, offline and disconected from the internet.', [null], true, true);
            await showvideo()
        }
    };
})();
async function showvideo(){
    await $('#utube').css('visibility','visible');
    await $('#utube').show();
}


var whatapplet = (function() {
    var executed = false;
    return async function() {
        if (!executed) {
            executed = true;
            await home_page_carousel('#whatappletheader', 'What is the applet?', [null], true, true);
            await home_page_carousel('#whatapplet', 'The applet is a very small file (about 10 kb) which has a simple user interface allowing you to select a file, see your prompt, and see the code your prompt generated.', [null], true, true);
            await showui()
            await home_page_carousel('#whatapplet2', 'The applet is not compiled meaning that all of the underlying Python code, for the user interface and to analyze your data, is visible to you if you want to see it.', [null], true, true);
            var linebreak = document.createElement("br");
            $('#whatapplet2').append(linebreak);
            await home_page_carousel('#whatapplet2', 'No trust required; 100% transparency.', [null], true, true);
        }
    };
})();
async function showui(){
    await $('#frontandback-img').css('visibility','visible');
}


var whatispython = (function() {
    var executed = false;
    return async function() {
        if (!executed) {
            executed = true;
            await home_page_carousel('#whatispythonheader', 'What is Python?', [null], true, true);
            await home_page_carousel('#whatispython', 'Python is the most popular programming language in the world.', [null], true, true);
            var linebreak = document.createElement("br");
            $('#whatispython').append(linebreak);
            await home_page_carousel('#whatispython', 'It allows us to create small and versatile apps that you can easily download while still being able to see every single line of code before you run it.', [null], true, true);
            await showinstall_btn()
            await home_page_carousel('#butwhy', 'You\'ll need to have Python installed on your computer for your applets to run.', [null], true, true);
            var linebreak = document.createElement("br");
            showbottom_start_btn();
        }
    };
})();
async function showinstall_btn(){
    await $('#pybtn').css('visibility','visible');
}
async function showbottom_start_btn(){
    await $('#homepagebuildalgo-bottom').css('visibility', 'visible');
    $('#homepagebuildalgo-bottom-wrap').show();
}


var butwhy = (function() {
    var executed = false;
    return async function() {
        if (!executed) {
            executed = true;
            await home_page_carousel('#butwhyheader', 'Why do I need to install Python before running my applets?', [null], true, true);
            await home_page_carousel('#butwhy', 'It\'s the program that will let your computer know what to do when you run a Python file.Without it, your computer will not know what to do with the applets you download.After you install it, you\'ll be able to double click your apps and they\'ll start.', [null], true, true);
            var linebreak = document.createElement("br");
            $('#butwhy').append(linebreak);
            await home_page_carousel('#butwhy', 'You only need to install it once.', [null], true, true);
            await showangryinstall_btn();
        }
    };
})();
async function showangryinstall_btn(){
    await $('#pybtn-angry').css('visibility','visible');
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








//mobile slider
// https://codepen.io/SlashTV/pen/YEMGqM

var x,
	staticX,
	click,
	offset_left = 0,
	offset_left_img = 0,
	xPos,
	idPos = 1,
	idPos2,
	idPosCheck,
	mobile = false,
	prev,
	prev2,
	prevIdPos,
		///////
	IMG_DIMENSTION = "1:1.3",
		///////
	imgDim = IMG_DIMENSTION.split(":");
$(".slide-wrap-2 img").each(function(){
	
		$(".idPos2").append("<div class='idPosItem'></div>")
});
$(".slide-wrap-2 img:last-child").clone().prependTo(".slide-wrap-2");
$(".slide-wrap-2 img:nth-child(2)").clone().appendTo(".slide-wrap-2");
ismobile();
$(".slide-wrap-2, .slide-wrap, .slide-wrap-2 img, #slideshow, #slideshow-outer").on("touchstart mousedown", function(e) {
	prevIdPos = Math.round(idPos);
	idPosCheck = true;
	prev = parseInt($(".slide-wrap-2").css("left").replace(/px|-/gi, ""));
	if (mobile == true) {
		xPos = e.changedTouches[0].pageX;
		//console.log(xPos);
		offset_left = staticX = xPos - $(".slide-wrap").offset().left;
		offset_left_img = staticX = xPos - $(".slide-wrap-2").offset().left;
		offset_left = offset_left - offset_left_img;
		staticX = xPos - $(".slide-wrap").offset().left;
	} else {
		offset_left = staticX = e.pageX - $(".slide-wrap").offset().left;
		offset_left_img = staticX = e.pageX - $(".slide-wrap-2").offset().left;
		offset_left = offset_left - offset_left_img;
		staticX = e.pageX - $(".slide-wrap").offset().left;
	}
	click = true;
	$(".slide-wrap-2").removeClass("slide-wrap-2-not-dragging");
	click = true;
});
$(".slide-wrap-2, .slide-wrap, .slide-wrap-2 img, #slideshow, body, #slideshow-outer").on("touchend mouseup", function(e) {
	prev2 = parseInt($(".slide-wrap-2").css("left").replace(/px|-/gi, ""));
	idPosCheck = false;
	click = false;
	$(".slide-wrap-2").addClass("slide-wrap-2-not-dragging");
	if (Math.round(idPos) != $(".slide-wrap-2 img").length && Math.round(idPos) != -1) {
		if (prev < prev2) {
			if (Math.ceil(idPos) - 0.8 < idPos) {
				//console.log(Math.ceil(idPos) - 0.9 < idPos)
				//console.log(idPos)
				$(".slide-wrap-2-not-dragging").css("left", "-" + $(".slide-wrap-2 img").width() * Math.ceil(idPos) + "px");
			} else {
				$(".slide-wrap-2-not-dragging").css("left", "-" + $(".slide-wrap-2 img").width() * Math.floor(idPos) + "px");
			}
		} else {
			if (Math.ceil(idPos) - 0.2 > idPos) {
				$(".slide-wrap-2-not-dragging").css("left", "-" + $(".slide-wrap-2 img").width() * Math.floor(idPos) + "px");
			} else {
				//console.log(idPos);
				//console.log(Math.ceil(idPos) - 0.1);
				$(".slide-wrap-2-not-dragging").css("left", "-" + $(".slide-wrap-2 img").width() * Math.ceil(idPos) + "px");
			}
		}
	}
});
$(".slide-wrap-2, .slide-wrap, .slide-wrap-2 img, #slideshow, #slideshow-outer").on("touchmove mousemove", function(e) {
	e.preventDefault();
	//console.log(idPos);
	if (mobile == true) {
		xPos = e.changedTouches[0].pageX;
		x = xPos - $(".slide-wrap").offset().left - staticX;
	} else {
		x = e.pageX - $(".slide-wrap").offset().left - staticX;
	}
	//console.log(e.pageX - $(".slide-wrap").offset().left - staticX + "\nxPos: " + e.pageX + "\noffsetLeft : " + $(".slide-wrap").offset().left + "\nstaticX: " + staticX);
	if (click == true) {
		//console.log(x);
		if (parseInt($(".slide-wrap-2").css("left").replace("px", "")) < 1) {
			if (parseInt($(".slide-wrap-2").css("left").replace("px", "")) > parseInt("-" + $(".slide-wrap-2 img").width() * ($(".slide-wrap-2 img").length - 1)) - 1) {
				$(".slide-wrap-2").css("left", x + offset_left + "px");
			}
			//console.log(parseInt($(".slide-wrap-2").css("left").replace("px", "")))
		} else if (Math.floor(idPos) === 0) {
			console.log(true);
			$(".slide-wrap-2").css("left", "-" + $(".slide-wrap-2 img").width() * ($(".slide-wrap-2 img").length - 2) + "px");
			prevIdPos = Math.round(idPos);
	idPosCheck = true;
	prev = parseInt($(".slide-wrap-2").css("left").replace(/px|-/gi, ""));
			if (mobile == true) {
				xPos = e.changedTouches[0].pageX;
				//console.log(xPos);
				offset_left = staticX = xPos - $(".slide-wrap").offset().left;
				offset_left_img = staticX = xPos - $(".slide-wrap-2").offset().left;
				offset_left = offset_left - offset_left_img;
				staticX = xPos - $(".slide-wrap").offset().left;
			} else {
				offset_left = staticX = e.pageX - $(".slide-wrap").offset().left;
				offset_left_img = staticX = e.pageX - $(".slide-wrap-2").offset().left;
				offset_left = offset_left - offset_left_img;
				staticX = e.pageX - $(".slide-wrap").offset().left;
			}
			prevIdPos = Math.round(idPos);
			idPosCheck = true;
			prev = parseInt($(".slide-wrap-2").css("left").replace(/px|-/gi, ""));
			if (mobile == true) {
				xPos = e.changedTouches[0].pageX;
				x = xPos - $(".slide-wrap").offset().left - staticX;
			} else {
				x = e.pageX - $(".slide-wrap").offset().left - staticX;
			}
			idPos = $(".slide-wrap-2 img").length - 1;
		} else if (parseInt($(".slide-wrap-2").css("left").replace("px", "")) === 0) {}
				if (parseInt($(".slide-wrap-2").css("left").replace("px", "")) < parseInt("-" + $(".slide-wrap-2 img").width() * ($(".slide-wrap-2 img").length - 1))) {
			$(".slide-wrap-2").css("left", "-" + $(".slide-wrap-2 img").width() + "px");
			
			prevIdPos = Math.round(idPos);
	idPosCheck = true;
	prev = parseInt($(".slide-wrap-2").css("left").replace(/px|-/gi, ""));
			if (mobile == true) {
				xPos = e.changedTouches[0].pageX;
				//console.log(xPos);
				offset_left = staticX = xPos - $(".slide-wrap").offset().left;
				offset_left_img = staticX = xPos - $(".slide-wrap-2").offset().left;
				offset_left = offset_left - offset_left_img;
				staticX = xPos - $(".slide-wrap").offset().left;
			} else {
				offset_left = staticX = e.pageX - $(".slide-wrap").offset().left;
				offset_left_img = staticX = e.pageX - $(".slide-wrap-2").offset().left;
				offset_left = offset_left - offset_left_img;
				staticX = e.pageX - $(".slide-wrap").offset().left;
			}
			//console.log("hellow")
		}
		//nsole.log((x + offset_left + "px"));
	} else {
		click = false;
		click2 = staticX + x;
	}
	id();
	idImg();
	//console.log(idPos)
});

function load() {
	
	$(".slide-wrap img").width($("#slideshow").width());
	$(".slide-wrap img").height($("#slideshow").width() / parseInt(imgDim[0]) * parseInt(imgDim[1]));
	$(".slide-wrap-2").width($(".slide-wrap img").width() * $(".slide-wrap img").length + 1);
	prev2 = parseInt($(".slide-wrap-2").css("left").replace(/px|-/gi, ""));
	idPosCheck = false;
	click = false;
	$(".slide-wrap-2").addClass("slide-wrap-2-not-dragging");
	if (Math.round(idPos) != $(".slide-wrap-2 img").length && Math.round(idPos) != -1) {
		if (prev < prev2) {
			if (Math.ceil(idPos) - 0.8 < idPos) {
				//console.log(Math.ceil(idPos) - 0.9 < idPos)
				//console.log(idPos)
				$(".slide-wrap-2-not-dragging").css("left", "-" + $(".slide-wrap-2 img").width() * Math.ceil(idPos) + "px");
			} else {
				$(".slide-wrap-2-not-dragging").css("left", "-" + $(".slide-wrap-2 img").width() * Math.floor(idPos) + "px");
			}
		} else {
			if (Math.ceil(idPos) - 0.2 > idPos) {
				$(".slide-wrap-2-not-dragging").css("left", "-" + $(".slide-wrap-2 img").width() * Math.floor(idPos) + "px");
			} else {
				//console.log(idPos);
				//console.log(Math.ceil(idPos) - 0.1);
				$(".slide-wrap-2-not-dragging").css("left", "-" + $(".slide-wrap-2 img").width() * Math.ceil(idPos) + "px");
			}
		}
	}
	if ($(window).width() > 800) {
		$("#slideshow").width(800);
		//console.log(true);
	}
	else {
		$("#slideshow").css("width", "100vw");
	}
	$(".idPos").css("top", ($(".slide-wrap-2 img").height()) - 25 + "px")
}
$(".idPosItem").click(function() {
	$(".idPosItem").css("borderRadius", "50%")
	$(this).css("borderRadius", "4px")
	idPos = $(this).index() + 1;
	move2()
});
function move2() {
	spam()
	$(".slide-wrap-2").css("left", "-" + $(".slide-wrap-2 img").width() * idPos + "px");
}
$(window).resize(function() {
	load();
	/*$(".slide-wrap-2-not-dragging").css("transition", "none");
	
	setTimeout(function() {
		$(".slide-wrap-2-not-dragging").css("transition", "left .3s ease-out");
		
	}, 250);*/
	ismobile();
});
load();
load();

function id() {
	idPos = parseInt($(".slide-wrap-2").css("left").replace(/px|-/gi, "")) / $(".slide-wrap-2 img").width();
	//console.log("Position of slider: " + (parseInt(idPos) + 1));
	idPos2 = parseInt($(".slide-wrap-2").css("left").replace(/px|-/gi, "") / $(".slide-wrap-2 img").width() * 10) / 10;
	//console.log("idPos: " + idPos)
	//console.log("idPos2: " + idPos2)
	//idPosCheck =
	//console.log(parseInt($(".slide-wrap-2").css("left").replace(/px|-/gi, "")) / $(".slide-wrap-2 img").width() * 10);
}
$(".rightBtn").click(function(){
	//$(".slide-wrap-2 img").length - 2
	move("-")
	console.log(idPos);
});
$(".leftBtn").click(function(){
	//$(".slide-wrap-2 img").length - 2
	move("")
	console.log(idPos);
	idImg();
});
function move(a) {
	spam();
	if (a == "-") {
		idPos = idPos + 1;
		if (idPos > $(".slide-wrap-2 img").length - 1) {
			idPos = 2;	
		}
		else if (idPos > $(".slide-wrap-2 img").length - 2) {
			idPos = 1;
		}
	}
	else {
		idPos = idPos - 1;
		if (idPos < 0) {
			idPos = $(".slide-wrap-2 img").length - 3;
		}
		else if (idPos < 1) {
			idPos = $(".slide-wrap-2 img").length - 2;
		}
	}
	$(".slide-wrap-2").css("left", "-" + $(".slide-wrap-2 img").width() * idPos + "px");
	
}
function spam() {
	$("#slideshow").append("<div class='spam'></div>");
	setTimeout(function(){
		$(".spam").remove();
	}, 301);
}
idImg();

function idImg() {
	$(".idPosItem").css("borderRadius", "50%")
	document.getElementsByClassName("idPosItem")[idPos - 1].style.borderRadius = "4px";
}
function ismobile() {
	mobile = false;
	if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) mobile = true;
}