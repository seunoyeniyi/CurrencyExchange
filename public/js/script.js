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

    $("#change-password").change(function() {
        if (this.checked) {
            $("#password-board").slideDown();
        } else {
            $("#password-board").slideUp();
        }
    });
    // registration form validation
    $("form[name='register']").validate({
        rules: {
            username: {
                required: true,
                minlength: 4
            },
            email: { required: true },
            privacy: {
                required: true,
            },
            password: { required: true, minlength: 5}
        },
            messages: {
                username: {
                    required: "Username is required.",
                    minlength: "Enter username greater than 3"
                },
                privacy: {
                    required: "You must agree to the terms and conditions"
                },
                email: { required: "Email is required."},
                password: {required: "Password required.", minlength: "Password must be greater than 5."}
            },
            errorPlacement: function(error, element) {
                error.prepend("* ");
                if (element.closest(".input-group").length) {
                    element.closest(".input-group").before(error);
                } else {
                    error.insertBefore(element);
                }
            },
            submitHandler: function(form) {
                form.submit();
            }
    });

    // profile form validation
    $("form[name='profile']").validate({
        rules: {
            "new-password1": {
                minlength: 5
            },
            "new-password2": {
                minlength: 5,
                equalTo: "#new-password1"
            },
        },
            messages: {
                
            },
            errorPlacement: function(error, element) {
                error.prepend("* ");
                if (element.closest(".input-group").length) {
                    element.closest(".input-group").before(error);
                } else {
                    error.insertBefore(element);
                }
            },
            submitHandler: function(form) {
                form.submit();
            }
    });

    // user upload profile pic preview
    $("#pic-select").change(function() {
        var file = $(this).get(0).files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function () {
                $("#user-pic-preview").attr("src", reader.result);
            };
            reader.readAsDataURL(file);
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


