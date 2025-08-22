<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doctor Register</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex items-center justify-center h-screen">

<div class="bg-white p-8 rounded shadow-md w-full max-w-md">
    <h2 class="text-2xl font-bold mb-6 text-center">Doctor Registration</h2>

    @if ($errors->any())
        <div class="mb-4 text-red-600">
            <ul class="list-disc list-inside">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('doctor.register.submit') }}">
        @csrf

        <label class="block mt-4">Name</label>
        <input type="text" name="name" value="{{ old('name') }}" required
               class="w-full mt-1 border rounded p-2">

        <label class="block mt-4">Email</label>
        <input type="email" name="email" value="{{ old('email') }}" required
               class="w-full mt-1 border rounded p-2">

        <label class="block mt-4">Password</label>
        <input type="password" name="password" required
               class="w-full mt-1 border rounded p-2">

        <label class="block mt-4">Confirm Password</label>
        <input type="password" name="password_confirmation" required
               class="w-full mt-1 border rounded p-2">

        <label class="block mt-4">Phone</label>
        <input type="text" name="phone" value="{{ old('phone') }}"
               class="w-full mt-1 border rounded p-2">

        <label class="block mt-4">Specialization</label>
        <input type="text" name="specialization" value="{{ old('specialization') }}"
               class="w-full mt-1 border rounded p-2">

        <label class="block mt-4">Degree</label>
        <input type="text" name="degree" value="{{ old('degree') }}"
               class="w-full mt-1 border rounded p-2">

        <label class="block mt-4">Clinic Address</label>
        <input type="text" name="clinic_address" value="{{ old('clinic_address') }}"
               class="w-full mt-1 border rounded p-2">

        <label class="block mt-4">Bio</label>
        <textarea name="bio" class="w-full mt-1 border rounded p-2">{{ old('bio') }}</textarea>

        <button type="submit" class="mt-6 w-full bg-indigo-600 text-white p-2 rounded">
            Register
        </button>
    </form>

    <p class="mt-4 text-center">
        Already registered? <a href="{{ route('doctor.login') }}" class="text-indigo-600">Login</a>
    </p>
</div>

</body>
</html>
