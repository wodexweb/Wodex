
<?php

return [

    'defaults' => [
        'guard' => 'sanctum',
        'passwords' => 'admins',
    ],

    'guards' => [

        'web' => [
            'driver' => 'session',
            'provider' => 'admins',
        ],

        'sanctum' => [
            'driver' => 'sanctum',
            'provider' => 'admins',
        ],
    ],

    'providers' => [

        'admins' => [
            'driver' => 'eloquent',
            'model' => App\Models\Admin::class,
        ],
    ],

    'passwords' => [

        'admins' => [
            'provider' => 'admins',
            'table' => 'password_resets',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],
];
