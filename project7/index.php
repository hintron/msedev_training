<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Brickus Login</title>
    <link rel="stylesheet" href="index.css">
    <script src="https://code.jquery.com/jquery-3.1.0.min.js"></script>
    <script src="login.js"></script>
</head>
<body>
    <!-- Login Form: -->
    <!-- See https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/My_first_HTML_form -->
    <form action="authenticate.php" method="post" class="login">
        <h3>Login:</h3>
        <div>
            <label for="username">Username:</label>
            <input type="text" name="username" />
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" name="password" />
        </div>

        <div>
            <button class="button" type="submit">Login</button>
        </div>

    </form>
    <div>
        <!-- When the user clicks to register, unhide the first and last name and birthday fields. Also check a hidden checkbox that says user is registering -->
        <button id="switch-to-register-btn" class="button login">New User? Click here to register</button>
    </div>


    <!-- Register Form: -->
    <!-- See https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/My_first_HTML_form -->
    <form action="authenticate.php" method="post" class="hidden register">
        <h3>Register:</h3>
        <div>
            <label for="username">Username:</label>
            <input type="text" name="username" />
        </div>
        <div>
            <label for="first_name">First Name:</label>
            <input type="text" name="first_name" />
        </div>
        <div>
            <label for="last_name">Last Name:</label>
            <input type="text" name="last_name" />
        </div>
        <div>
            <label for="birthday">Birth Date:</label>
            <input type="text" name="birthday" />
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" name="password" />
        </div>
        <div>
            <label for="repeat_password">Repeat Password:</label>
            <input type="password" name="repeat_password" />
        </div>
        <!-- The presence of this checkbox means it is a new user registration -->
        <div>
            <input type="checkbox" name="new_user" class="hidden" checked>
        </div>


        <div>
            <button class="button" type="submit">Register</button>
        </div>

    </form>
    <div>
        <!-- TODO: When the user clicks to register, unhide the first and last name and birthday fields. Also check a hidden checkbox that says user is registering -->
        <button id="switch-to-login-btn" class="button register hidden">Already a user? Click here to login</button>
    </div>

</body>
</html>