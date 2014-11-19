/*
    MAIN SCRIPTS - Last updated: 19-11-14
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

    //==================================================
    // Magnific Popup ****
    //
    // Docs:
    // http://dimsemenov.com/plugins/magnific-popup/documentation.html#ajax_type
    //==================================================

    $('.ajax-modal').magnificPopup({
        type: 'ajax',
        showCloseBtn: false,
        callbacks: {
        // wrap the ajax request with a div that we've styled to look good
        parseAjax: function (mfpResponse) {

            var modalTitle = $(mfpResponse.data).filter("[data-header]").attr('data-header');

            // The name of the modal will be taken from attribute 'data-header' - placed on the inner wrapper
            mfpResponse.data = '<div class="mfp-content-header">'+modalTitle+'<button title="Close (Esc)" type="button" class="mfp-close">×</button></div><div class="mfp-content-scroller">' + mfpResponse.data + '</div>';

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
// Tooltips
//-----------------------------------------------------------------

$(".lv-tooltip").click(function () {
    var $title = $(this).find(".title");
    if (!$title.length) {
        $(".title").remove();
        $(this).append('<span class="title">' + $(this).attr("title") + '</span>');
    } else {
        $title.remove();
    }
});

//-----------------------------------------------------------------
// Simulated Doc Options show on checkbox select
//-----------------------------------------------------------------

$("#tocNodes input[type='checkbox'], #resultsContainerForm input[type='checkbox']").on("click", function() {
    if ($("#tocNodes input:checked").length || $("#resultsContainerForm input:checked").length) {
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
// SIDEBAR TABS
//-----------------------------------------------------------------

// Sidebar defaults to the 'is-collapsed' state (class on Master).
// Local storage will remember if user left it open or hasn't touched it.
// In either case, media queries will handle the state naturally, or the sidebar
// will initalize open.

var sidebarStateStorage = localStorage.getItem("sidebarState");
if (sidebarStateStorage == "uncollapsed" || sidebarStateStorage == null) {
    $('.lv-sidebar').removeClass('is-collapsed');
}

//------------ ON CLICK -------------------

$('.lv-sidebar .tabs a').click(function(e){

    var $this = $(this);
    var tabHash = $this.attr('href');
    var sidebar = $this.parent().parent().parent().parent();
    var sidebarCollapsed = sidebar.hasClass('is-collapsed');
    var sidebarUncollapsed = sidebar.hasClass('is-uncollapsed');
    var sizeWhereSidebarIsInFlow = $(window).width() >= 1024;

    e.preventDefault();

    // Strip all tab LIs, apply 'active' to clicked LI
    $('.lv-sidebar .tabs .active').removeClass('active');
    $this.parent().addClass('active');

    // If 'collapse' is clicked (only possible when open)
    if (tabHash == "#collapse") {

        // user has engaged the sidebar. Remember preferences and override media queries
        sidebar.removeClass('is-uncollapsed').addClass('is-collapsed');

        // USER STORAGE - Remember user input
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("sidebarState", "collapsed");
        }

    // Clicking all other tabs - will ** UNCOLLAPSE ** sidebar
    } else {
        // Strip all content sections, apply 'active' to ID that matches tabHash
        $('.tabs-content .active').removeClass('active');
        $(tabHash).addClass('active');

        // 1. Sidebar is collapsed by user engagement directly OR
        // 2. If initalized by medium media query - in which case, there
        // are no explicit collapse/uncollapse classes applied.

        // Uncollapse the sidebar

        if (sidebarCollapsed || (!sidebarCollapsed && !sidebarUncollapsed)) {
            sidebar.removeClass('is-collapsed').addClass('is-uncollapsed');

            // USER STORAGE - Remember user input
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem("sidebarState", "uncollapsed");
            }
        }

        // scroll to top on desktop, sidebar scrolls WITH page on medium-up
        if (sizeWhereSidebarIsInFlow) $.scrollTo(0, 300);
        //$(window).scrollTop(0); // alt method
        //$("html, body").animate({scrollTop: "0"}, 300); // alt method
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

$(".lv-hamburger").bind(touchEvent, function(e) {

    $this = $(this);
    //e.preventDefault();

    if ($this.attr('href', '#off-canvas-menu-left')) {
        $("#off-canvas-menu-left").trigger("open.mm");
    }

    if ($this.attr('href', '#off-canvas-menu-right')) {
        $("#off-canvas-menu-right").trigger("open.mm");
    }
});

$(function() {
    $("#off-canvas-menu-left").mmenu({
       "offCanvas": {
          "position": "left"
       }
    });

    $("#off-canvas-menu-right").mmenu({
       "offCanvas": {
          "position": "right"
       }
    });
 });

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
//
//==================================================