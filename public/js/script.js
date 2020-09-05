$(function() {

    $("button, li, a").click(function(e) {
        if (!$(this).hasClass("no-active")) {
            $(this).siblings(".active").removeClass("active");
            $(this).closest("li").siblings(".active").children("a").removeClass("active");
            $(this).toggleClass("active");
        }
    });
    $("input").focus(function (e) { 
        $(this).closest("form").find("button[type='submit']").removeClass("active");
    });
    $("input").change(function (e) { 
        $(this).closest("form").find("button[type='submit']").removeClass("active");
    });
    $(".alert .close").click(function () {
        $(this).closest(".alert").hide();
    });


    $("#navbar-menus > li a").click(function (e) {
        $(this).closest('li').children("ul").toggle();
    });
    $("#navbar-menu-btn").click(function (e) { 
        e.preventDefault();
        $("#navbar-menus").slideToggle(100);
        if (!$("#navbar").hasClass("sticky") && $("#navbar").hasClass("home")) {
            $("#navbar").toggleClass("navbar-style");
        }
    });

});

window.onscroll = (function(){onPageScroll();});
function onPageScroll() {
    if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
        if ($("#navbar").hasClass("home")) {
            $("#navbar").addClass("navbar-style");
        }
        $("#navbar").addClass("sticky");
    } else {
        if (!$('#navbar-menu-btn').hasClass("active")) {
            if ($("#navbar").hasClass("home")) {
                $("#navbar").removeClass("navbar-style");
            }
            $("#navbar").removeClass("sticky");
        }
    }
}


