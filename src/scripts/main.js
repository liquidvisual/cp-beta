/*
    MAIN SCRIPTS - Last updated: 30-10-14
*/
//-----------------------------------------------------------------
// Variables
//-----------------------------------------------------------------

var TOUCH_ENABLED = $(".touch").length;

//-----------------------------------------------------------------
// Document Ready
//-----------------------------------------------------------------

$(document).ready(function() {
    NProgress.start(); // Start preloader bar
    resizeEvents();

    //==================================================
    // Magnific Popup
    //==================================================

    $('.ajax-modal').magnificPopup({
        type: 'ajax',
        showCloseBtn: false,
        callbacks: {
        // wrap the ajax request with a div that we've styled to look good
        parseAjax: function (mfpResponse) {
            mfpResponse.data = '<div class="mfp-content-header">Hints <button title="Close (Esc)" type="button" class="mfp-close">×</button></div><div class="mfp-content-scroller">' + mfpResponse.data + '</div>';

            }, ajaxContentAdded: function () {
                return this.content;
            }
        },
    });
    //-
});
//-----------------------------------------------------------------
// Window Load
//-----------------------------------------------------------------

$(window).load(function() {
    NProgress.done();
});

//-----------------------------------------------------------------
// Simulated Doc Options show on checkbox select
//-----------------------------------------------------------------

$("input[type='checkbox']").on("click", function() {
    if ($('input:checked').length) {
        $('.lv-doc-options').removeClass('disabled');
    } else {
        $('.lv-doc-options').addClass('disabled');
    }
});

//-----------------------------------------------------------------
// Search Filter (mini-toc)
// http://stackoverflow.com/questions/3442394/jquery-using-text-to-retrieve-only-text-not-nested-in-child-tags
//-----------------------------------------------------------------

// We need to rip out the text and place it inside the next adjacent anchor

$(function() {
    $("#searchsummary #metadocs > ul > li").each(function(){
        var textTitle = $(this).contents().filter(function(){return this.nodeType == 3})[0];
        $('a', $(this)).first().text(textTitle.nodeValue);
        textTitle.nodeValue = '';
    });
});

// Mini toc behavior

$(function() {
    $('#refinesearch .collapsed > .resultMetadocLink, #refinesearch .expanded > .resultMetadocLink').click(function(){
        var $this = $(this);
        // Default 'closed' state
        if ($this.parent().hasClass('collapsed')){

            $this.parent().removeClass('collapsed').addClass('expanded');
            $('ul', $this.parent()).first().show();

        } else if ($this.parent().hasClass('expanded')) {

            $this.parent().removeClass('expanded').addClass('collapsed');
            $('ul', $this.parent()).first().hide();
        }
    });
});

//-----------------------------------------------------------------
// Resize
//-----------------------------------------------------------------

var sidebar = $('.lv-sidebar');

$(window).resize(function(){
    resizeEvents();
});

function resizeEvents() {
    if ($(window).width() <= 1024){
        if (!sidebar.hasClass('is-collapsed')) {
            sidebar.addClass('is-collapsed');
        }
    }
}

// sidebar tabs following window thing
//
// var $scrollingDiv = $("#fixedScroll");
//     $(window).scroll(function(){
//     console.log("hey");
//     var fucker = ($(this).scrollTop()) + "px";
//     $scrollingDiv.stop().animate({"top": fucker}, "slow");
//     });

//-----------------------------------------------------------------
// Sidebar Tab Anchors
//-----------------------------------------------------------------

$('.tabs .tab-title a').click(function(e){

    var tabHash = $(this).attr('href');
    var sidebar = $('.lv-sidebar');
    var sidebarCollapsed = sidebar.hasClass('is-collapsed');
    var smallScreen = $(window).width() < 1024;

    e.preventDefault();

    // Strip all tab LIs, apply 'active' to clicked LI
    $('.tabs .tab-title').removeClass('active');
    $(this).parent().addClass('active');

    // If 'collapse' is clicked
    if (tabHash == "#collapse") {

        sidebar.toggleClass('is-collapsed');

    // Clicking all other tabs
    } else {
        // Strip all content sections, apply 'active' ID that matches tabHash
        $('.tabs-content > .content').removeClass('active');
        $(tabHash).addClass('active');

        if (sidebarCollapsed) {
            $('.lv-sidebar').removeClass('is-collapsed');

            // scroll to top on desktop, sidebar is fixed but content is relative when open
            if (!smallScreen) $.scrollTo(0, 300);
            //$(window).scrollTop(0); // because collapsed toolbar is fixed
            //$("html, body").animate({scrollTop: "0"}, 300);
        }
    }
});

//-----------------------------------------------------------------
// 'context-menu-btn' lives inside the header
//-----------------------------------------------------------------

$('#context-menu-btn').click(function(e){

    var contextMenu = $('.lv-context-menu');
    var contextMenuVisible = contextMenu.is(':visible');
    var contextMenuWidth = contextMenu.width();

    e.preventDefault();

    // Slide the menu offscreen left
    if (contextMenuVisible) {
         contextMenu.transition({
            x: -contextMenuWidth,
            complete: function(){ contextMenu.removeClass('lv-show').css({ x: 0 }).attr('style', '') } });
    } else {
        // Slide onscreen right
        contextMenu.addClass('lv-show');
        contextMenu.css({ x: -contextMenuWidth }).transition({ x: 0 });
    }
});

//-----------------------------------------------------------------
// Kickstart Foundation / Touch Conditionals
//-----------------------------------------------------------------

var touchEvent = TOUCH_ENABLED ? "touchstart" : "click";

//Trigger hamburger by touch on mobile - this eliminates glitch with FastClick.js
$(".hamburger").css({"visibility": "visible"}).bind(touchEvent, function() {
    $("#off-canvas-menu").trigger("open.mm");
});

if (TOUCH_ENABLED) {
    // Make Accordion jump to the top of the heading on mobile
    // http://foundation.zurb.com/forum/posts/1316-accordion-jump-to-top-when-active
    /*$(document).foundation('accordion', {
        callback: function (el){
            var containerPos = $(el).parent().offset().top;
            $('html, body').animate({ scrollTop: containerPos }, 300);
        }
    });*/
}
//-----------------------------------------------------------------
// <= IE8 Caution Message
//-----------------------------------------------------------------

//$('.lv-alert .close-btn').click(function(){$(this).parent().hide();});

//-----------------------------------------------------------------
// +++ HELPERS +++
//-----------------------------------------------------------------
//==================================================
// Developer: COMMAND+S for screen width
//==================================================

$(document).keypress(function(event) {
    if (event.which == 115 && (event.ctrlKey||event.metaKey)|| (event.which == 19)) {
        event.preventDefault();
        alert("(w) "+$(window).width()+" (h) "+$(window).height());

        return false;
    }
    return true;
});
//==================================================
// Submit Search Form by Hitting Enter
//==================================================

// $("#search-form").keypress(function(event) {
//     if (event.which == 13) {
//         event.preventDefault();
//         $("#search-form").submit();
//     }
// });
//==================================================
//
//==================================================