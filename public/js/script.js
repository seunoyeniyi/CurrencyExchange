$(function() {

    $("button, li, a").click(function(e) {
        if (!$(this).hasClass("no-active")) {
            $(this).toggleClass("active");
        }
    });


    $("#navbar-menus > li a").click(function (e) {
        $(this).closest('li').children("ul").toggle();
    });
    $("#navbar-menu-btn").click(function (e) { 
        e.preventDefault();
        $("#navbar-menus").slideToggle(100);
        if (!$("#navbar").hasClass("sticky")) {
            $("#navbar").toggleClass("home");
        }
    });

});

window.onscroll = (function(){onPageScroll();});
function onPageScroll() {
    if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
        $("#navbar").removeClass("home");
        $("#navbar").addClass("sticky");
    } else {
        $("#navbar").addClass("home");
        $("#navbar").removeClass("sticky");
    }
}


