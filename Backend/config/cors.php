<?php
return [
    'paths' => ['api/*', 'login/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000', 'http://localhost:1000'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,

    // 🔥 THIS MUST BE TRUE
    'supports_credentials' => true,
];
