<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Brickus Login</title>
    <link rel="stylesheet" href="">
</head>
<body>
    <!-- Login Form: -->
    <!-- Register Form: -->

    <!-- See https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/My_first_HTML_form -->
    <form action="/login/authenticate.php" method="post">
        <div>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" />
        </div>

<!--
        <div>
            <label for="first_name">First Name:</label>
            <input type="text" id="first_name" name="first_name" />
        </div>
        <div>
            <label for="last_name">Last Name:</label>
            <input type="text" id="last_name" name="last_name" />
        </div>
        <div>
            <label for="birthday">Birth Date:</label>
            <input type="text" id="birthday" name="birthday" />
        </div>
 -->

        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" />
        </div>

        <div class="button">
            <button type="submit" id="login-btn">Login</button>
        </div>

    </form>
    <div  class="button">
        <!-- TODO: When the user clicks to register, unhide the first and last name and birthday fields. Also check a hidden checkbox that says user is registering -->
        <button id="register-btn">New User? Click here to register</button>
    </div>

</body>
</html>