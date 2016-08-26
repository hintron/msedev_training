// See https://api.jquery.com/ready/
$(function(){
    console.log("Hello, World!");

    $("#switch-to-register-btn").on("click", function(){
        // Switch from the login form to the register form
        $(".login").addClass("hidden");
        $(".register").removeClass("hidden");
    });

    $("#switch-to-login-btn").on("click", function(){
        // Switch from the register form to the login form
        $(".login").removeClass("hidden");
        $(".register").addClass("hidden");
    });

    // TODO: Check that both passwords match
    // TODO: Check that date is of the correct format
    // TODO: Check to make sure username and passwords are not empty

});