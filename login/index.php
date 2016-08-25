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
    <!-- Register Form: -->

    <!-- See https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/My_first_HTML_form -->
    <form action="/login/authenticate.php" method="post" class="login">
        <h3>Login:</h3>
        <div>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" />
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" />
        </div>

        <div class="button">
            <button type="submit">Login</button>
        </div>

    </form>
    <div class="button login">
        <!-- TODO: When the user clicks to register, unhide the first and last name and birthday fields. Also check a hidden checkbox that says user is registering -->
        <button id="switch-to-register-btn">New User? Click here to register</button>
    </div>




    <!-- See https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/My_first_HTML_form -->
    <form action="/login/authenticate.php" method="post" class="hidden register">
        <h3>Create a new user:</h3>
        <div>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" />
        </div>
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
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" />
        </div>
        <div>
            <label for="repeat_password">Repeat Password:</label>
            <input type="password" id="repeat_password" name="repeat_password" />
        </div>
        <!-- The presence of this checkbox means it is a new user registration -->
        <div>
            <input type="checkbox" name="new_user" class="hidden" checked>
        </div>


        <div class="button">
            <button type="submit">Register</button>
        </div>

    </form>
    <div class="button register hidden">
        <!-- TODO: When the user clicks to register, unhide the first and last name and birthday fields. Also check a hidden checkbox that says user is registering -->
        <button id="switch-to-login-btn">Already a user? Click here to login</button>
    </div>

</body>
</html>