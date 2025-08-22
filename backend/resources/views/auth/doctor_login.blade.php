<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doctor Login</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex items-center justify-center h-screen">

<div class="bg-white p-8 rounded shadow-md w-full max-w-md">
    <h2 class="text-2xl font-bold mb-6 text-center">Doctor Login</h2>

    @if ($errors->any())
        <div class="mb-4 text-red-600">
            <ul class="list-disc list-inside">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('doctor.login.submit') }}">
        @csrf

        <label class="block mt-4">Email</label>
        <input type="email" name="email" value="{{ old('email') }}" required
               class="w-full mt-1 border rounded p-2">

        <label class="block mt-4">Password</label>
        <input type="password" name="password" required
               class="w-full mt-1 border rounded p-2">

        <div class="mt-4 flex items-center">
            <input type="checkbox" name="remember" id="remember" class="mr-2">
            <label for="remember">Remember Me</label>
        </div>

        <button type="submit" class="mt-6 w-full bg-indigo-600 text-white p-2 rounded">
            Login
        </button>
    </form>

    <p class="mt-4 text-center">
        Don't have an account? <a href="{{ route('doctor.register') }}" class="text-indigo-600">Register</a>
    </p>
</div>

</body>
</html>
