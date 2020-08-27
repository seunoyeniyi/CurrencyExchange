$(function() {



    $("#navbar-menus > li a").click(function (e) { 
        e.preventDefault();
        $(this).closest('li').children("ul").toggle();
    });
    $("#navbar-menu-btn").click(function (e) { 
        e.preventDefault();
        $("#navbar-menus").slideToggle(100);
    });




});


