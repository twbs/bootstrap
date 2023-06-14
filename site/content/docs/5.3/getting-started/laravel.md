---
layout: docs
title: Laravel 10 Bootstrap Tutorial
description: In this tutorial, we will be building a simple web application using Laravel 10 and Bootstrap. This tutorial assumes you have some basic knowledge of [PHP](https://www.php.net/), [Laravel](https://laravel.com/docs/10.x), and [Bootstrap](https://getbootstrap.com/).
group: getting-started
toc: true
---

## Installing Laravel

First, we need to install Laravel 10. To do this, we must already have [Composer](https://getcomposer.org/) and [PHP](https://www.php.net/downloads.php) installed on our machine. Once this has been added, open up a terminal or command prompt and run the following command:

```sh
composer create-project laravel/laravel bootstrap-tutorial-app --prefer-dist "10.*"
```

This will create a new Laravel 10 project in a folder called `bootstrap-tutorial-app`.


## Installing Bootstrap

Next, we need to install Bootstrap. We can do this by running the following command:

```sh
npm install bootstrap
```

## Creating a Route and Controller

Let's create a new route and controller to handle requests to our web application. Open up the `routes/web.php` file and add the following code:

```php
Route::get('/' ,'\App\Http\Controllers\HomeController@index');
```

This will create a route that points to the `index` method of the HomeController class.

Now, let's create the `HomeController` class. Run the following command to generate a new controller:

```sh
php artisan make:controller HomeController
```

This will create a new file called `HomeController.php` in the `app/Http/Controllers` directory. Open up this file and add the following code:

```php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        return view('home');
    }
}
```

This code creates a new method called `index` that returns a view called `home`. We will create this view next.

## Creating a View

Let's create a new view to display some content in our web application. Create a new file called `home.blade.php` in the `resources/views` directory and add the following code:

```html
<!doctype html>
<html lang="en">
<head>
    <title>Laravel Bootstrap Tutorial</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
</head>
<body>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <h1 class="text-center mt-3">Welcome to the Laravel Bootstrap Tutorial</h1>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
</body>
</html>
```

This code creates a basic HTML page that includes the Bootstrap CSS and JavaScript files. It also includes a `div` with a `h1` tag that displays a welcome message.

## Updating the Layout

Let's update the layout of our application to use Bootstrap. Open up the `resources/views/layouts/app.blade.php` file and replace its contents with the following code:

```html
<!doctype html>
<html lang="en">
<head>
    <title>@yield('title')</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Laravel Bootstrap Tutorial</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item active">
                    <a class="nav-link" href="/">Home</a>
                </li>
            </ul>
        </div>
    </nav>

    <div class="container">
        @yield('content')
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
</body>
</html>
```

This code adds a navigation bar to our application and includes a `yield` directive that will be replaced with the content of our view.

## Updating the View

Let's update our view to use the layout we just created. Replace the contents of `home.blade.php` with the following code:

```html
@extends('layouts.app')

@section('title', 'Home')

@section('content')
    <div class="row">
        <div class="col-md-12">
            <h1 class="text-center mt-3">Welcome to the Laravel Bootstrap Tutorial</h1>
        </div>
    </div>
@endsection
```

This code extends the `app` layout and specifies the title of our page as `Home`. It also replaces the `yield` directive in the layout with the content of our view.

## Running the Application

Finally, let's run the application and see our changes. Open up a terminal or command prompt and navigate to the root directory of our project. Then, run the following command:

```sh
php artisan serve
```

This will start the Laravel development server. Open up a web browser and navigate to `http://localhost:8000`. You should see a page that displays a welcome message and a navigation bar.

## Conclusion
Congratulations! You have successfully built a simple Laravel 10 application using Bootstrap. You can now use this as a starting point for building more complex web applications.