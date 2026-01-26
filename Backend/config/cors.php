<?php

return [

    // ✅ allow ALL routes (simplest + correct)
    'paths' => ['*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:1000',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // ✅ keep this true only if using cookies / auth
    'supports_credentials' => true,
];
