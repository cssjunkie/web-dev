/*
Engine.is Scripts File
Author: John Gallant
*/


/****************************************************
      CUSTOM SCRIPTING FOR SITE...
****************************************************/

jQuery(document).ready(function ($) {

var containerDiv = $('#container');
var contentDiv = $('#content');

var isMobileDevice = $('body').hasClass('mobile');
// isMobileDevice is true if user agent is mobile device, used to avoid running excess scripting in mobiles...

/*********************
UTILITY FUNCTIONS
*********************/

// fauxTwoColumn( container )
// Creates faux table structure using divs and display property values.
// The argument accepts a jQuery object representing the outer 'table'
// element (a div if possible).
//
// The faux table always displays two columns. All direct children of the
// container are treated as cells, and they are conditionally wrapped with new
// 'table-row' divs in sets.

function fauxTwoColumn( container ){
    var group = {};
    container.css({'display': 'table', 'table-layout': 'fixed', 'width': '100%'}); // set container to 'table'...
    container.children('p').remove();

    // if instance has (default) class "hide-email", remove div.email-box...
    if (container.hasClass('no-email')) {
        group = container.children('.video-single');
        container.find('.email-box').remove();
        } else {
            group = container.children('div');
            }

    group.css('display', 'table-cell'); // set children of container to 'table-cell'...

    // loop over container children...
    group.each(function(index,elem) {
        var item = $(elem);
        // find first item for each desired row...
        if ( index % 2 === 0 ) {
            // create collection holding items for each row, then wrap them up in 'row' div...
            item.add(item.next()).wrapAll('<div class="tablerow" />');
            }
        });
    } // end fauxTwoColumn()


// enforces equal heights on sets of floats...
function equalHeight(group) {
	var tallest = 0;
	group.each(function() {
		var thisHeight = jQuery(this).height();
		if(thisHeight > tallest) {
			tallest = thisHeight;
		}
	});
	group.height(tallest);
}

// for rows with 2 across floats...
function twoAcrossFloats(group) {
    group.each(function(index, elem) {
        elem = $(elem);
        if ( index % 2 === 0 ) {
            equalHeight(elem.add(group.get(index + 1)));
            }
        });
    }

// for rows with 3 across floats...
function threeAcrossFloats(group) {
    group.each(function(index, elem) {
        elem = $(elem);
        if ( index % 3 === 0 ) {
            equalHeight(elem.add(elem.next()).add(elem.next().next()));
            }
        });
    }


// trimRelatedNews() splits the post list into left and right lists, then
// hides Related News items that can't fit into the single page sidebar...

var TRNfirstRun = true;
var relNewsList = $('.related-news-loop');
var relNewsItems = relNewsList.children('li');

function trimRelatedNews() {

    // run following only when first loading page...
    if ( TRNfirstRun && relNewsList.css('float') !== 'none' ) {
        TRNfirstRun = false;
        relNewsItems.each(function(index,elem) {
            elem = $(elem);
            // class the alternate items...
            if ( index % 2 !== 0 ) {
                elem.addClass('splitcol_right');
                }
            });
        // find alternate items and move them to a newly created rightside list...
        relNewsList.find('.splitcol_right').detach().insertAfter(relNewsList).wrapAll('<ul class="related-news-loop rightside"></ul>');
    } // end if first run

    // detect any items that can't fit in the viewport and hide them...
    if ( relNewsList.css('float') !== 'none' ) {
        relNewsItems.each(function(index,elem) {
            elem = $(elem);
            if (elem.position().top + elem.outerHeight() > $('.article-footer').outerHeight()) {
            elem.css({opacity: 0}); } else { elem.css({opacity: 1}); }
            });
    }
} // end trimRelatedNews()


// for Issues drawers, arriving from about page with hash in url path, scrolls page to the correct hash item...
function goToByScroll(id){
   $('html,body').animate({scrollTop: Math.floor($("#"+id).offset().top - 100)},300);
    }


// converts urls into clickable links for the twitter feed and such.
$('.twitter-feed li').each(function() {
    var replacedText, replacePattern;
    var inputText = $(this).text();
    //URLs starting with http://, https://, or ftp://
    replacePattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern, '<a style="white-space:nowrap;" href="$1">$1</a>');
    $(this).html( replacedText );
});



/*///////////////////////////////////////////////////////////////
MOBILE ONLY SCRIPTING (applied only to mobiles)
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

if (isMobileDevice) {
    $('.home #content, #mobile-nav-button').click( function() {
        $('body').toggleClass('fold-mobile-nav');
        });
    $('#content').not('.home #content').click( function() {
        $('body').addClass('fold-mobile-nav');
        });


} // end mobile only scripting
/*///////////////////////////////////////////////////////////////
END MOBILE SCRIPTING
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/



/*********************
WAYPOINT HELPER FUNCTIONS
*********************/

// Assigns class 'fold-nav' to the #container element, which controls numerous transitions...
function foldNav(dir) {
    if (dir === 'down') {
        containerDiv.addClass('fold-nav');
        }
    if (dir === 'up') {
        containerDiv.removeClass('fold-nav');
        }
    }

// Triggers a particular flip counter instance to start...
function startCounter() {
    $(this).data('engineflipcounter').start();
    }

// Waypoint handler function, hides first BG image on Front page so that second image can show...
function backgroundSwapper() {
    $('#background-swapper').addClass('hidden');
    }


// Functions used for Lightbulb animation...

// helper function, moderates application of 'activate/activated' classes...
function lightBulbActivate($el) {
    if ($el.hasClass('activated')) {
        $el.removeClass('activated');
        setTimeout( function() { $el.addClass('activate'); }, 1000 );
        } else {
            $el.addClass('activate');
            }
    }

// helper function for animateVisible(), returns true if element is fully inside viewport (not waypoint related)...
function isElementInViewport(el) {
    var rect = $(el)[0].getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document. documentElement.clientWidth)
        );
}

// animateVisible() uses isElementInViewport() to check for visible element, then runs lightBulbActivate()...
function animateVisible($el) {
    if (isElementInViewport($el)) {
        lightBulbActivate($el);
        }
    }

// Waypoint handler function, triggers animation on scroll if not already triggered...
function triggerAnimation() {
    var $el = $(this);
    lightBulbActivate($el);
    }

// END WAYPOINT HELPER FUNCTIONS


/*********************
ASSORTED HELPER FUNCTIONS
*********************/

// HOMESLIDE FUNCTIONS, triggered on load and resize

// when triggered, will set bg position on thumbs container to move 'cutout' in background to active thumb...
function engineHomeslideHandler(e) {
    var thumbTarget;
    thumbEvent = e;
    if (thumbEvent) {
        thumbTarget = $(e.target);
        } else {
            thumbTarget = firstHomeSlide;
            }
    var bgOffset = Math.floor(thumbTarget.position().left + (thumbTarget.outerWidth() / 2)) + 'px 0';

    if (firstThumbSet) {
        setTimeout( function() {thumbTarget.parent().css('background-position', bgOffset);}, 1500);
        firstThumbSet = false;
        } else {
            thumbTarget.parent().css('background-position', bgOffset);
            }
    } // end engineHomeslideHandler()

// when triggered,
function resetTheThumbs() {
    var thumbBox = homeSlideContainer.find('.bjqs-markers li');
    var thumbBoxWidth = Math.floor(thumbBox.height() * 1.2);
    var thumbBoxPad = Math.floor(thumbBoxWidth / 5.5);
    thumbBox.width(thumbBoxWidth); // reset width on the home thumbs...
    thumbBox.children('a').css({
        'font-size' : Math.floor(thumbBoxWidth / 10) + 'px',
        'padding-left' : thumbBoxPad + 'px',
        'padding-right' : thumbBoxPad + 'px'
        });
    } // end resetTheThumbs()


// LOGO FLASHER

function logoFlashStart(logoColNum) {

    var logoGroupSize = 12;
    var swapRate = 1000;
    var fadeRate = 1600;

    var logoFlasher = $('.logo-flasher > div');

    // collect rel string...
    var imagesString = logoFlasher.attr('rel');

    // convert rel string to array...
    var imagesArray = imagesString.split(/\s*,\s*/);

    // output logoGroupSize number of image items as img tags...
    $.each(imagesArray, function(index,item) {
        logoFlasher.append('<div><img src="/wp-content/uploads/' + item + '" alt=""></div>');
        return (index < logoGroupSize - 1);
    });

    // bring unused image items to front of array...
    imagesArray = imagesArray.slice(logoGroupSize).concat(imagesArray.slice(0, logoGroupSize));

    // collect actual img tags...
    var imageBoxes = logoFlasher.children('div');

    // wrap 3 or 6 items in tablerow divs, conditionally according to media queries below...
    for(var i = 0; i < imageBoxes.length; i+=logoColNum) {
      imageBoxes.slice(i, i+logoColNum).wrapAll("<div class='tablerow'></div>");
    }

    var indexVal = 0;
    var imagesCollection = logoFlasher.find('img');

    function swapImage() {
        // select random member from img collection...
        var randIndex = randomImg(imagesCollection);
        var randImg = imagesCollection.eq(randIndex);
        // if new replacement site is selected then replace, else select again...
        if (randIndex !== indexVal) {
            replaceImg(randImg);
            indexVal = randIndex;
            } else {
                swapImage();
                }
        }

    function replaceImg(randImg) {
        randImg.animate({opacity: 0}, fadeRate, function() {
            randImg.attr('src', '/wp-content/uploads/' + imagesArray[0]);
            randImg.animate({opacity: 1}, fadeRate);
            shiftArray(imagesArray);
            });
        }

    function randomImg(collection) {
        return Math.floor(Math.random() * collection.length);
        }

    function shiftArray(group) {
        var firstImage = group.shift();
        group.push(firstImage);
        return firstImage;
        }

    setInterval(swapImage, swapRate);

} // end logoFlashStart()

// END ASSORTED HELPER FUNCTIONS


/*
Set "ie-all" class on html so the flip counter can be disabled, due to non-support of
the backface-visibility property, tho they claim to do so. Idiots. IE10 doesn't do
 Conditional Comments anymore, and IE11 beta is still not supporting backface-visibility,
 thus this hack to class html with "ie-all" so IE may be dumbed down. If future IE versions
 start to support backface-visibility, some provision should be attempted with @cc_on to
 withhold the "ie-all" class from that version.
*/
if (document.body.style.msTouchAction !== undefined) {
    document.documentElement.className+=' ie-all';
}



/*////////////////////////////////////////////////////////////////
DESKTOP SCRIPTING (applied only to non-mobiles)
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

// start mobile hiding, no need to load down the mobiles with extra script...
if (isMobileDevice === false) {

/*********************
WAYPOINT ASSIGNMENTS -- docs are at: http://imakewebthings.com/jquery-waypoints/
*********************/

// Waypoint assignment, controls the Top Nav folding...
    containerDiv.waypoint({
        handler: foldNav,
        offset: -200
        });

// Waypoint assignment, controls the News page scrolling... DISABLED
/*
  $('.news-section #inner-content').waypoint({
    handler: foldNav,
    offset: -150,
    context: 'div#content'
  });
*/

// Waypoint assignment, starts flip counter just before it scrolls into view...
  $('.flip-counter').waypoint({
    handler: startCounter,
    offset: function() { return window.innerHeight + 100; }
  });

// Waypoint assignment, when top edge of map is 60% from top of window, assigns 'activate' class to trigger css transitions on widget...
  $('.pinmap').waypoint({
    handler: triggerAnimation,
    offset: '60%'
  });

// Waypoint assignment, after 40px of scroll, assigns 'activate' class to trigger css transitions on widget...
  $('.lightbulb-widget').waypoint({
    handler: triggerAnimation,
    offset: function() { return $(this).offset().top - 40; }
  });

// fires lightbulb animation on click and mouseover too...
    $('.lightbulb-widget').click(function() { animateVisible($(this)); }).mouseleave(function() { animateVisible($(this)); });

// Waypoint assignment, hides first BG image on Front page so that second image can show.
// The #swapBackground ID has been added to an appropriate h2 element, triggering the handler at the desired scroll depth.
  $('#swapBackground').waypoint({
    handler:  backgroundSwapper,
    offset: '100'
  });



/*********************
BODY BACKGROUND EFFECT
*********************/

if ($('body').hasClass('home')) {
    $('body').prepend('<div id="background-swapper"><div></div></div>');
    }


/*********************
HOME SLIDES
*********************/

var homeSlideContainer = $('#homeslides');

var homeslide_options = {
        height: 990,
        width: 2600,
        responsive: true,
        animtype: 'fade',
        animduration: 1500,
        animspeed: 8000,
        showcontrols: false,
        automatic: true
        };

if (homeSlideContainer.length) {

    homeSlideContainer.bjqs(homeslide_options);

    // loop thru homeslides, take rel values and convert to image paths for main and thumb elements...

    var homeSlides = homeSlideContainer.find('li.bjqs-slide');
    var firstThumbSet = true;

    homeSlides.each(function () {
        var slide = $(this);
        var slideIndex = slide.index();
        var slideData = slide.attr('rel').split(',');

        if (slideIndex === 2) { slide.addClass('masked'); }

        slide.css({
        'background-image': 'url(/wp-content/uploads/' + slideData[0] + ')'
        }).find('a[rel=1]').show();

    if (homeslide_options.animtype === 'slide') {
        // for sliding effect, don't collect markers for first and last slides, they are 'dummies' used in the slide scripting...
        if (0 < slideIndex && slideIndex < homeSlides.length - 1) {
            $('#homeslides .bjqs-markers a:eq(' + (slideIndex - 1) + ')').html(
            '<div class="thumbview"><span>' + slideData[1] + '</span><div class="mask-' + slideIndex + '"></div></div>'
            ).children('div.thumbview').css({
                'background-image': 'url(/wp-content/uploads/' + slideData[0] + ')'
                });
            }
    } else {

        // for fade effect...
            $('#homeslides .bjqs-markers a:eq(' + (slideIndex) + ')').html(
            '<div class="thumbview"><span>' + slideData[1] + '</span><div class="mask-' + slideIndex + '"></div></div>'
            ).children('div.thumbview').css({
                'background-image': 'url(/wp-content/uploads/' + slideData[0] + ')'
                });
            }
        }); // end slide looping

    var firstHomeSlide = $('#homeslides .bjqs-markers li:first');

    var thumbEvent;
    resetTheThumbs(); // set up home slides thumbs...

    $(document).on('engineHomeslide', engineHomeslideHandler); // triggered from slider plugin script...

    homeSlideContainer.removeClass('hidden');

} // end homeslides if block


/*********************
LOGO FLASHER (on Front page)
*********************/

// Currently creates 6-across rows of flashers. Total number of images applied to the [logo_flasher] shortcode must be the same number or some multiple.
if ($('.logo-flasher').length) {
    setTimeout( function() {logoFlashStart(6);} , 4000);
    }


/*********************
HERO LINKS (Front page)
*********************/

$('.hero-link').filter(':odd').each(function() {
    $(this).find('.text-side').detach().appendTo($(this).children());
    });


} // end desktop only scripting
/*///////////////////////////////////////////////////////////////
END DESKTOP SCRIPTING
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

/*********************
GENERAL SCRIPTING
*********************

/*********************
DRAWER SLIDE DOWNS.
*********************
 Each drawer and its trigger block are a "cabinet".
 Currently the script can handle only one set of cabinets per page.

 The html structure must be:

 <div class="custom-classname triplewide">
     <div class="cabinet">
         <div class="drawer-handle">
             (Visible trigger block, with title, thumb, etc)
         </div>
         <div class="drawer">
             (Hidden content, slides down when trigger block is clicked)
         </div>
     </div>
 </div>

 "custom-classname" is changable and is used to apply most styling to custom instances of the drawers.

 "triplewide" is optionally used to create a 'three-across' sequence of items, with
 the drawers of each triple set shown below the set when triggered, as on the Leadership page.
 *********************/

// detect triplewide class...

var tripleWide = $('.leadership-drawers.triplewide');
var cabinets = $('.leadership-drawers.triplewide .cabinet');

// loop thru cabinets...
cabinets.each(function(index, cabinet) {
    var cab = $(cabinet);
    var drawerHandle = cab.children('.drawer-handle');
    var drawer = cab.children('.drawer');
    var drawerClose = drawer.children('.drawer-indicator');

    drawerHandle.click(function() {
        if (!drawerHandle.hasClass('activate')) {
            $('.drawer.activate').slideUp(300);
            $('.drawer.activate,.drawer-handle.activate').removeClass('activate');
            drawer.delay(310).slideDown(500).add(drawerHandle).addClass('activate');
            } else {
            cab.parent().find('.drawer.activate').slideUp(300);
            $('.drawer.activate,.drawer-handle.activate').removeClass('activate');
        }
    });

    drawerClose.click(function() {
            drawer.slideUp(300);
            drawer.add(drawerHandle).removeClass('activate');
    });

}); // end cabinet looping.


tripleWide.each(function(index, drawergroup) {

    // detach .drawers in sets of three
    // and place after those .cabinet triplets, then run equalHeights()...

        var cabs = $(drawergroup).children('.cabinet');

    cabs.each(function(index, cabinet) {

        var cab = $(cabinet);
        var drawer = cab.children('.drawer');
        var modulo = (index + 1) % 3;
        var currDrawer = drawer.detach();

        if (modulo === 1) {

        if (cab.next().next().length !== 0 ) {
            cab.next().next().after(currDrawer);
                } else if (cab.next().length !== 0 ) {
                    cab.next().after(currDrawer);
                    } else {
                        cab.after(currDrawer);
                        }

        } else if (modulo === 2) {

        if (cab.next().length !== 0 ) {
            cab.next().after(currDrawer);
                } else {
                    cab.after(currDrawer);
                    equalHeight(cab.add(cab.prev()).children('.drawer-handle'));
                    }

        } else {
        cab.after(currDrawer);
        equalHeight(cab.add(cab.prev()).add(cab.prev().prev()).children('.drawer-handle'));
        }

    }); // end .cabinet looping.
}); // end .leadership-drawers looping.

// reveal Leaders with a delay, so equal heights script can complete invisibly...
tripleWide.removeClass('transparent');


/*

// detect triplewide class...
var tripleWide = $('.cabinet:first').parent('.triplewide');

// loop thru cabinets...
$('.cabinet').each(function(index, cabinet) {
    var cab = $(cabinet);
    var drawerHandle = cab.children('.drawer-handle');
    var drawer = cab.children('.drawer');
    var drawerClose = drawer.children('.drawer-indicator');

    drawerHandle.click(function() {
        if (!drawerHandle.hasClass('activate')) {
            cab.parent().find('.drawer.activate').slideUp(300);
            $('.drawer, .drawer-handle').removeClass('activate');
            drawer.delay(310).slideDown(500).add(drawerHandle).addClass('activate');
            } else {
            cab.parent().find('.drawer.activate').slideUp(300);
            $('.drawer, .drawer-handle').removeClass('activate');
        }
    });

    drawerClose.click(function() {
            drawer.slideUp(300);
            $('.drawer, .drawer-handle').removeClass('activate');
    });

    // if triplewide class is on cabinets' parent, detach .drawers in sets of three
    // and place after those .cabinet triplets, then run equalHeights()...

    if (tripleWide.length) {
        var modulo = (index + 1) % 3;
        var currDrawer = drawer.detach();

        if (modulo === 1) {

        if (cab.next().next().length !== 0 ) {
            cab.next().next().after(currDrawer);
                } else if (cab.next().length !== 0 ) {
                    cab.next().after(currDrawer);
                    } else {
                        cab.after(currDrawer);
                        }

        } else if (modulo === 2) {

        if (cab.next().length !== 0 ) {
            cab.next().after(currDrawer);
                } else {
                    cab.after(currDrawer);
                    equalHeight(cab.add(cab.prev()).children('.drawer-handle'));
                    }

        } else {
        cab.after(currDrawer);
        equalHeight(cab.add(cab.prev()).add(cab.prev().prev()).children('.drawer-handle'));
        }
    }
}); // end cabinet looping.

// reveal Leaders with a delay, so equal heights script can complete invisibly...
tripleWide.removeClass('transparent');
*/

// end DRAWER SLIDE DOWNS.


/*********************
ISSUES BUTTONS AND DRAWERS
*********************/

threeAcrossFloats($('.issue-links .issue-button'));

var issuesCabinets = $('.issues-drawers .cabinet');

twoAcrossFloats(issuesCabinets.children('.drawer-handle'));

issuesCabinets.each(function(index, cab) {
    cab = $(cab);
    if ( index % 2 === 0 ) {
        cab.addClass('leftcab');
        } else {
            cab.addClass('rightcab');
            }
});

// end ISSUES BUTTONS AND DRAWERS


/*********************
EVENT TRIPLE (on Community page)
*********************/

var evTripLen = $('.event-triple .event-item').length;

if (evTripLen === 1) {
    $('.event-triple').css({width: '33%'});
    } else if (evTripLen === 2) {
        $('.event-triple').css({width: '66%'});
        }


/*********************
BX SLIDER -- docs are at: http://bxslider.com/
*********************/

    $('.bxslider').bxSlider({
        minSlides: 3,
        maxSlides: 3,
        slideWidth: 300,
        slideMargin: 20,
        nextText: '',
        prevText: ''
    });


/*********************
FEATURED VIDEOS VIEWER
*********************/

var
        engVidViewer = $('.featured-videos-viewer'),
        engVidViewerClickstop = $('.featured-videos-viewer > .clickstop'),
        engVidBlocks = engVidViewer.children('.featured-video'),
        engVidThumbs = engVidViewer.children('.thumb-block').find('.thumb'),
        engVidBlockCurr = engVidBlocks.first(),
        engVidBlockPrev;


function swapVidBlocks(event) {
    engVidBlockPrev = engVidBlockCurr; // store current vid object as previous object...
    engVidBlockCurr = event.data.activeVid; // store desired vid as current...

    if (engVidBlockPrev.index() !== engVidBlockCurr.index()) {
        engVidViewerClickstop.css('z-index', 100); // shield vid viewer from any clicks while processing...
        engVidBlockCurr.css('z-index', 5);
        engVidBlockPrev.addClass('hidden');
        setTimeout(function() {
            engVidBlockCurr.css('z-index', 10);
            engVidBlockPrev.css('z-index', 0).removeClass('hidden');
            engVidViewerClickstop.css('z-index', -1); // restore clicking on vid viewer...
            }, 600);
        }
    }

engVidBlocks.each(function(index,elem) {

    var vidBlock = $(elem);
    var captionText = vidBlock.attr('rel');
    var vidImgSrc = vidBlock.children().children('img').attr('src');

    engVidThumbs.eq(index)
    .click({activeVid : engVidBlocks.eq(index)}, swapVidBlocks)
    .children().children('span').text(captionText)
    .siblings('img').attr('src', vidImgSrc);

    });


/*********************
FOUR IMAGE VIEWER (top of multimedia page)
*********************/

var
    fourImageViewer = $('.four-image-viewer'),
    fourImageItems = fourImageViewer.children('.wp-caption');

var fourImageThumbBlock = $('<div class="thumb-block"><div class="thumb-block-inner" /></div>').appendTo(fourImageViewer);

fourImageViewer.append('<img alt="" src="/wp-content/themes/engine/library/images/featured-video-strut.png"><div class="clickstop"><img alt="" src="/wp-content/themes/engine/library/images/featured-video-strut.png"></div>');

var
        fourImageClickstop = fourImageViewer.children('.clickstop'),
        fourImageItemsCurr = fourImageItems.first(),
        fourImageItemsPrev;

function swapImageItems(event) {
    fourImageItemsPrev = fourImageItemsCurr; // store current vid object as previous object...
    fourImageItemsCurr = event.data.activeImage; // store desired vid as current...

    if (fourImageItemsPrev.index() !== fourImageItemsCurr.index()) {
        fourImageThumbBlock.find('.thumb').removeClass('active');
        $(event.target).parents('.thumb').addClass('active');
        fourImageClickstop.css('z-index', 100); // shield vid viewer from any clicks while processing...
        fourImageItemsCurr.css('z-index', 5);
        fourImageItemsPrev.addClass('hidden');
        setTimeout(function() {
            fourImageItemsCurr.css('z-index', 10);
            fourImageItemsPrev.css('z-index', 0).removeClass('hidden');
            fourImageClickstop.css('z-index', -1); // restore clicking on vid viewer...
            }, 600);
        }
    }

fourImageItems.each(function(index,elem) {
    var item = $(elem);
    if (index === 4) {
        return false; // limit viewer to 4 items...
        }
    // create thumb elements, duplicate src and p text from each captioned image, and append to thumb block...
    var thumbItem = '<div class="thumb"><div class="thumb-inner"><span>';
    thumbItem +=  item.children('p.wp-caption-text').text() + '</span><div class="overlay"></div>';
    thumbItem += '<img src="' + item.children('img').attr('src') + '" alt="" /></div></div>';
    fourImageThumbBlock.children().append(thumbItem);

    fourImageThumbBlock.find('.thumb').eq(index).click({activeImage : fourImageItems.eq(index)}, swapImageItems);
    fourImageThumbBlock.find('.thumb').first().addClass('active');

    });


/*********************
TWOCOL IMAGE VIEWER (static pairs of tinted images on community page)
*********************/

$('.twocol-image-viewer .wp-caption').each(function(index,elem) {
    var item = $(elem);
    item.append(' <img class="strut" src="/wp-content/themes/engine/library/images/featured-video-strut.png" alt="" /><div class="overlay"></div>').wrapInner('<div class="cell-liner"/>');
    });

fauxTwoColumn( $('.twocol-image-viewer > div') ); // argument is a jQuery object containing elements to be organized into a two-col table...

setTimeout(function() {
    $('.twocol-image-viewer').removeClass('hidden');
    }, 2000);



/*********************
STARTUPS SPEAK (in Multimedia)
*********************/

fauxTwoColumn( $('.two-col-videos') ); // argument is a jQuery collection of items to be organized into a two-col table...

setTimeout(function() {
    $('.two-col-videos').removeClass('hidden');
    }, 2000);



/*********************
NEWS SECTION SCRIPTS
*********************/

// apply 'focussed' class on #searchform when it has focus, allows for nice fade in effect and also blocks #content focus...
$('.search-form input[type=text]').bind( 'focus', function() {$(this).parent().addClass('focussed');});
$('.search-form input[type=text]').bind( 'blur', function() {$(this).parent().removeClass('focussed');});

// force focus into #content so News page scrolling is more natural...
contentDiv.focus();
// re-focus #content on mouse enter, but not if the searchform is focussed...
contentDiv.mouseenter( function() {
        if ( !$('#searchform.focussed' ).length) {
            $(this).focus();
            }
    });


/*********************
FANCYBOX POPUPS
*********************/

// invoke for all videos. Example: <a class="fancybox-media" href="https://vimeo.com/67583498">Video Link</a>
$('.fancybox-media').fancybox({
    helpers : { media : true },
    padding : 2,
    width : 960,
    height : 540,
    aspectRatio : true,
    wrapCSS : 'dark-border'
    });

    // start script for Newsletter and Join popups...
    var popupNL = $('#newsletter-popup');
    var popupJoin = $('#join-popup');

    // apply 'required asterisks as needed to both CF7 popup[ forms...
    popupNL.find('.required').append('<div class="asterisk">*</div>');
    popupJoin.find('.required').append('<div class="asterisk">*</div>');

// attach handler to dummy short form for NL...
$('.newsletter-frontform form').submit(function(e) {
    e.preventDefault();
    var frontNL = $(this);

    // transfer field info to real popup form in footer.php...
    // These values are gotten from mailchimp
    popupNL.find('#FNAME').val(frontNL.find('#first-name-NL').val());
    popupNL.find('#LNAME').val(frontNL.find('#last-name-NL').val());
    popupNL.find('#EMAIL').val(frontNL.find('#email-NL').val());

    // invoke Fancybox popup...
    $.fancybox( {
        href : '#newsletter-popup',
        padding : [15, 25, 25, 20],
        autoSize : false,
        width : 550,
        height : 'auto',
        afterClose : function() {popupNL.find('.wpcf7-response-output').hide();}
        } );
    });

// attach handler to dummy short form for Join Up...
$('.join-frontform form').submit(function(e) {
    e.preventDefault();
    var frontJoin = $(this);

    // transfer field info to real popup form in footer.php...
    // These values are gotten from mailchimp
    popupJoin.find('#FNAME').val(frontJoin.find('#first-name-join').val());
    popupJoin.find('#LNAME').val(frontJoin.find('#last-name-join').val());
    popupJoin.find('#EMAIL').val(frontJoin.find('#email-join').val());

    // invoke Fancybox popup...
    $.fancybox( {
        href : '#join-popup',
        padding : [15, 40, 25, 40],
        autoSize : false,
        width : 630,
        height : 'auto',
        afterClose : function() {popupJoin.find('.wpcf7-response-output').hide();}
        });
    });

// apply handler to nav join button...
$('#menu-item-710').click(function(e) {
    e.preventDefault();
    $.fancybox( {
        href : '#join-popup',
        padding : [15, 25, 25, 20],
        autoSize : false,
        width : 600,
        height : 'auto',
        afterClose : function() {popupJoin.find('.wpcf7-response-output').hide();}
        });
    });

/* DISABLED (on hold for now...)
  var popupDonate = $('#donate-popup');
// apply handler to nav donate button...
$('#menu-item-709 a').click(function(e) {
    e.preventDefault();
    if (!($('body').hasClass('page-id-697'))) {
        $.fancybox( {
            href : '#donate-popup',
            padding : [15, 25, 25, 23],
            autoSize : false,
            width : 600,
            height : 'auto',
            afterClose : function() {popupDonate.find('.wpcf7-response-output').hide();}
            });
        }
    });
*/


/*********************
INFINITE SCROLLING
*********************/
if (isMobileDevice === true) {
    jQuery.ias({
        container : '#main',
        item: '.post',
        pagination: '.bones_page_navi',
        next: '.bpn-next-link a',
        noneleft: '<p style="margin: 25px 25px 45px; font-size: 1.2em; ">No posts left in this category...</p>',
        loader: '<img src="/wp-content/themes/engine/library/images/gearspinner.gif"/>',
        loaderDelay:500,
        thresholdMargin: -10
        });
} else {
    jQuery.ias({
        container : '#main',
        item: '.post',
        pagination: '.bones_page_navi',
        next: '.bpn-next-link a',
        noneleft: '<p style="margin: 25px 25px 45px; font-size: 1.2em; ">No posts left in this category...</p>',
        loader: '<img src="/wp-content/themes/engine/library/images/gearspinner.gif"/>',
        loaderDelay:500,
        scrollContainer: contentDiv,
        thresholdMargin: -10
        });
    }


/*********************
DONATIONS SCRIPTS
*********************/

    function submitCard() {
        $("#amount_form").attr("action", "https://enginedonations.herokuapp.com/form/");
        $("#amount_form").submit();
    }

    function submitPaypal() {
        var donationAmount;
        $("#amount_form").attr("action", "https://www.paypal.com/cgi-bin/webscr");
        donationAmount = $("#amount-input").val().replace(',', '');
        if (parseFloat(donationAmount) > 1000) {
            window.location.replace("/?error=too_large");
        } else {
            $("#amount_form").submit();
        }
    }

    $('#engineSubmitCard').click(function() {submitCard();});
    $('#engineSubmitPaypal').click(function() {submitPaypal();});



// make Issues page scroll to proper item when arriving from Issues button on About page...
setTimeout(function() {
    if (window.location.hash !== '') {
        goToByScroll(window.location.hash.substr(1) + '-scroll');
        setTimeout(function() {$('#' + window.location.hash.substr(1) + '-scroll .drawer-handle').trigger('click');}, 1000);
        }},
         1000);


/*////////////////////////////////////////////////////////////////
DESKTOP SCRIPTING (applied only to non-mobiles)
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

// start mobile hiding, no need to load down the mobiles with extra script...
if (isMobileDevice === false) {

/*********************
RESIZE FUNCTIONS
*********************/

/*** resizeCessation()
Utility function; use inside the window resize function when
another function must run only AFTER all resizing has stopped.
***/

// don't edit this!
var resizeCessation = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

  $(window).resize(function () {

    resizeCessation(function () {

        runTheWidths(); // this function runs thru the window widths, triggering other functions as needed...

        setTimeout(trimRelatedNews,800); // this function hides Related News items that can't fit into the single page sidebar...

        if (homeSlideContainer.length) {
            resetTheThumbs();
            if (!firstThumbSet) {
                engineHomeslideHandler(thumbEvent);
                } else {
                    engineHomeslideHandler();
                    }
            }
        }, 300); // <-- delay after resizing stops is adjustable...

  }); /* end of window resize */


/*********************
FUNCTIONS TO BE CALLED ON FIRST LOAD...
*********************/

$(window).trigger('resize'); // force resize event on load...


} // end desktop only scripting
/*///////////////////////////////////////////////////////////////
END DESKTOP SCRIPTING
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/


/*********************
SPECIFIC WINDOW WIDTH FUNCTIONS
*********************/

function runTheWidths() {
// this function runs on load and on window resize...

    // detect the current viewport width...
    var responsive_viewport = $(window).width();

    // if window is above or equal to 768px wide (tablets, laptops, desktops)...
    if (responsive_viewport >= 768) {
        $.waypoints('enable'); // allow Waypoints to control the navs when not in mobile mode...
        } // end larger than 481px

    // if window is below 768px wide (phones)...
    if (responsive_viewport < 768) {
        $.waypoints('disable'); // prevent Waypoints from interfering when in mobile mode...
        }

    /* Large screen enables open right sidebar in News Section */
    if (responsive_viewport > 1100) {
        containerDiv.addClass('sidebar-open').removeClass('sidebar-closed');
        } else {
            containerDiv.addClass('sidebar-closed').removeClass('sidebar-open');
                }

} // end runTheWidths()


}); /* end of document ready */



// END CUSTOM SCRIPTS


/*! A fix for the iOS orientationchange zoom bug.
 Script by @scottjehl, rebound by @wilto.
 MIT License.
*/
(function (w) {
  // This fix addresses an iOS bug, so return early if the UA claims it's something else.
  if (!(/iPhone|iPad|iPod/.test(navigator.platform) && navigator.userAgent.indexOf("AppleWebKit") > -1)) {
    return;
  }
  var doc = w.document;
  if (!doc.querySelector) {
    return;
  }
  var meta = doc.querySelector("meta[name=viewport]"),
    initialContent = meta && meta.getAttribute("content"),
    disabledZoom = initialContent + ",maximum-scale=1",
    enabledZoom = initialContent + ",maximum-scale=10",
    enabled = true,
    x, y, z, aig;
  if (!meta) {
    return;
  }

  function restoreZoom() {
    meta.setAttribute("content", enabledZoom);
    enabled = true;
  }

  function disableZoom() {
    meta.setAttribute("content", disabledZoom);
    enabled = false;
  }

  function checkTilt(e) {
    aig = e.accelerationIncludingGravity;
    x = Math.abs(aig.x);
    y = Math.abs(aig.y);
    z = Math.abs(aig.z);
    // If portrait orientation and in one of the danger zones
    if (!w.orientation && (x > 7 || ((z > 6 && y < 8 || z < 8 && y > 6) && x > 5))) {
      if (enabled) {
        disableZoom();
      }
    } else if (!enabled) {
      restoreZoom();
    }
  }
  w.addEventListener("orientationchange", restoreZoom, false);
  w.addEventListener("devicemotion", checkTilt, false);
})(this);




