<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel CORS Configuration
    |--------------------------------------------------------------------------
    |
    | Here you can configure your settings for Cross-Origin Resource Sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*'],  // Apply to all API routes

    'allowed_methods' => ['*'],  // Allow all HTTP methods (GET, POST, etc.)

    'allowed_origins' => [
        'http://localhost:5173',  // Allow your frontend domain (for development)  // Replace with your frontend domain in production
    ],

    'allowed_headers' => ['*'],  // Allow all headers

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,  // Set to true if using cookies or tokens for authentication
];
