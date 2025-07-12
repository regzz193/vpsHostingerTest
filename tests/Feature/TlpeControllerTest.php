<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class TlpeControllerTest extends TestCase
{
    /**
     * Test the payment options endpoint with successful API response.
     *
     * @return void
     */
    public function test_get_payment_options()
    {
        // Mock the HTTP client to avoid actual API calls during testing
        Http::fake([
            'https://test-api.tlpe.io/options' => Http::response([
                [
                    'code' => 'gcash123',
                    'value' => 'GCash',
                    'image' => 'https://example.com/gcash-logo.png'
                ],
                [
                    'code' => 'visa456',
                    'value' => 'Visa',
                    'image' => 'https://example.com/visa-logo.png'
                ]
            ], 200)
        ]);

        // Make a request to the endpoint
        $response = $this->get('/api/tlpe/options');

        // Assert the response is successful
        $response->assertStatus(200);

        // Assert the response has the expected structure
        $response->assertJsonStructure([
            '*' => [
                'code',
                'value',
                'image'
            ]
        ]);

        // Assert the response contains the expected data
        $response->assertJson([
            [
                'code' => 'gcash123',
                'value' => 'GCash',
                'image' => 'https://example.com/gcash-logo.png'
            ],
            [
                'code' => 'visa456',
                'value' => 'Visa',
                'image' => 'https://example.com/visa-logo.png'
            ]
        ]);
    }

    /**
     * Test the payment options endpoint with 401 Unauthorized API response.
     * Should return fallback payment options (Visa and Mastercard).
     *
     * @return void
     */
    public function test_get_payment_options_with_401_error()
    {
        // Mock the HTTP client to return a 401 Unauthorized error
        Http::fake([
            'https://test-api.tlpe.io/options' => Http::response([
                'error' => 'Unauthorized',
                'message' => 'Invalid or missing authentication token'
            ], 401)
        ]);

        // Make a request to the endpoint
        $response = $this->get('/api/tlpe/options');

        // Assert the response is successful (should return 200 with fallback options)
        $response->assertStatus(200);

        // Assert the response has the expected structure
        $response->assertJsonStructure([
            '*' => [
                'code',
                'value',
                'image'
            ]
        ]);

        // Assert the response contains the fallback payment options (Visa and Mastercard)
        $response->assertJson([
            [
                'code' => 'visa',
                'value' => 'Visa',
                'image' => 'https://cdn.visa.com/v2/assets/images/logos/visa/logo.png'
            ],
            [
                'code' => 'mastercard',
                'value' => 'Mastercard',
                'image' => 'https://www.mastercard.com/content/dam/public/mastercardcom/na/global-site/images/logos/mc-logo-52.svg'
            ]
        ]);
    }
    /**
     * Test the checkout endpoint with successful API response.
     *
     * @return void
     */
    public function test_checkout()
    {
        // Mock the HTTP client to avoid actual API calls during testing
        Http::fake([
            'https://test-api.tlpe.io/checkout' => Http::response([
                'timestamp' => '2023-05-01T12:00:00.000+0000',
                'status' => 200,
                'message' => 'Request processed successfully',
                'path' => '/checkout',
                'data' => [
                    'transaction_id' => 'TRX-12345',
                    'status_code' => 'OK.01.00',
                    'status_description' => 'Transaction ready for payment',
                    'payment_url' => 'https://test-api.tlpe.io/pay/TRX-12345'
                ]
            ], 200)
        ]);

        // Sample transaction data
        $transactionData = [
            'customer' => [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'billing_address' => [
                    'line1' => '#123',
                    'line2' => 'Main St',
                    'city_municipality' => 'New York',
                    'zip' => '10001',
                    'state_province_region' => 'NY',
                    'country_code' => 'US'
                ],
                'shipping_address' => [
                    'line1' => '#123',
                    'line2' => 'Main St',
                    'city_municipality' => 'New York',
                    'zip' => '10001',
                    'state_province_region' => 'NY',
                    'country_code' => 'US'
                ],
                'contact' => [
                    'email' => 'john.doe@example.com',
                    'mobile' => '+14155552671'
                ]
            ],
            'payment' => [
                'description' => 'Payment for test product',
                'amount' => 1000.50,
                'currency' => 'USD',
                'option' => 'visa',
                'merchant_reference_id' => 'INV-TEST-001',
                'other_references' => ['REF1', 'REF2']
            ],
            'route' => [
                'callback_url' => 'https://example.com/callback',
                'notify_user' => true
            ],
            'time_offset' => '+08:00'
        ];

        // Make a request to the endpoint
        $response = $this->postJson('/api/tlpe/checkout', $transactionData);

        // Assert the response is successful
        $response->assertStatus(200);

        // Assert the response has the expected structure
        $response->assertJsonStructure([
            'timestamp',
            'status',
            'message',
            'path',
            'data' => [
                'transaction_id',
                'status_code',
                'status_description',
                'payment_url'
            ]
        ]);

        // Assert the response contains the expected data
        $response->assertJson([
            'status' => 200,
            'message' => 'Request processed successfully',
            'data' => [
                'transaction_id' => 'TRX-12345',
                'status_code' => 'OK.01.00',
                'status_description' => 'Transaction ready for payment',
                'payment_url' => 'https://test-api.tlpe.io/pay/TRX-12345'
            ]
        ]);
    }

    /**
     * Test the checkout endpoint with error API response.
     *
     * @return void
     */
    public function test_checkout_with_error()
    {
        // Mock the HTTP client to return an error response
        Http::fake([
            'https://test-api.tlpe.io/checkout' => Http::response([
                'timestamp' => '2023-05-01T12:00:00.000+0000',
                'status' => 400,
                'error' => 'Bad Request',
                'message' => 'Invalid transaction data',
                'path' => '/checkout'
            ], 400)
        ]);

        // Sample transaction data with missing required fields
        $transactionData = [
            'customer' => [
                'first_name' => 'John',
                'last_name' => 'Doe'
                // Missing required fields
            ],
            'payment' => [
                'description' => 'Payment for test product',
                'amount' => 1000.50
                // Missing required fields
            ],
            'time_offset' => '+08:00'
            // Missing route information
        ];

        // Make a request to the endpoint
        $response = $this->postJson('/api/tlpe/checkout', $transactionData);

        // Assert the response has the expected error status
        $response->assertStatus(400);

        // Assert the response has the expected structure
        $response->assertJsonStructure([
            'error',
            'status',
            'details'
        ]);
    }

    /**
     * Test the direct payment endpoint with successful non-3DS API response.
     *
     * @return void
     */
    public function test_direct_payment_non_3ds()
    {
        // Mock the HTTP client to avoid actual API calls during testing
        Http::fake([
            'https://test-api.tlpe.io/payment' => Http::response([
                'timestamp' => '2023-05-01T12:00:00.000+0000',
                'status' => 200,
                'message' => 'Request processed successfully',
                'path' => '/payment',
                'data' => [
                    'transaction_id' => 'TRX-67890',
                    'status_code' => 'OK.00.00',
                    'status_description' => 'Payment successful'
                ]
            ], 200)
        ]);

        // Sample transaction data for non-3DS payment
        $transactionData = [
            'credit_card' => [
                'card_holder_name' => 'Abel Maclead',
                'number' => '4111111111111111',
                'expiration_month' => '12',
                'expiration_year' => '25',
                'cvv' => '123'
            ],
            'customer' => [
                'first_name' => 'Abel',
                'last_name' => 'Maclead',
                'billing_address' => [
                    'line1' => '#88',
                    'line2' => 'Boston Ave',
                    'city_municipality' => 'Philadelphia',
                    'zip' => '19132',
                    'state_province_region' => 'PA',
                    'country_code' => 'US'
                ],
                'shipping_address' => [
                    'line1' => '#88',
                    'line2' => 'Boston Ave',
                    'city_municipality' => 'Philadelphia',
                    'zip' => '19132',
                    'state_province_region' => 'PA',
                    'country_code' => 'US'
                ],
                'contact' => [
                    'email' => 'amaclead@domain.com',
                    'mobile' => '+1415552671'
                ]
            ],
            'payment' => [
                'description' => 'Payment for a product',
                'amount' => 1000.50,
                'currency' => 'USD',
                'option' => 'visa',
                'merchant_reference_id' => 'INV-100001_TEST',
                'other_references' => ['REF1', 'REF2']
            ],
            'route' => [
                'callback_url' => 'https://tlpe.io/thankyou',
                'notify_user' => true
            ],
            'time_offset' => '+08:00',
            'customer_ip_address' => '192.168.1.1'
        ];

        // Make a request to the endpoint
        $response = $this->postJson('/api/tlpe/payment', $transactionData);

        // Assert the response is successful
        $response->assertStatus(200);

        // Assert the response has the expected structure
        $response->assertJsonStructure([
            'timestamp',
            'status',
            'message',
            'path',
            'data' => [
                'transaction_id',
                'status_code',
                'status_description'
            ]
        ]);

        // Assert the response contains the expected data
        $response->assertJson([
            'status' => 200,
            'message' => 'Request processed successfully',
            'data' => [
                'transaction_id' => 'TRX-67890',
                'status_code' => 'OK.00.00',
                'status_description' => 'Payment successful'
            ]
        ]);
    }

    /**
     * Test the direct payment endpoint with successful 3DS API response.
     *
     * @return void
     */
    public function test_direct_payment_3ds()
    {
        // Mock the HTTP client to avoid actual API calls during testing
        Http::fake([
            'https://test-api.tlpe.io/payment' => Http::response([
                'timestamp' => '2023-05-01T12:00:00.000+0000',
                'status' => 200,
                'message' => 'Request processed successfully',
                'path' => '/payment',
                'data' => [
                    'transaction_id' => 'TRX-3DS-12345',
                    'status_code' => 'OK.01.00',
                    'status_description' => 'Transaction ready for 3DS authentication',
                    'redirect_url' => 'https://test-api.tlpe.io/3ds/TRX-3DS-12345'
                ]
            ], 200)
        ]);

        // Sample transaction data for 3DS payment
        $transactionData = [
            'credit_card' => [
                'card_holder_name' => 'Abel Maclead',
                'number' => '4111111111111111',
                'expiration_month' => '12',
                'expiration_year' => '25',
                'cvv' => '123'
            ],
            'customer' => [
                'first_name' => 'Abel',
                'last_name' => 'Maclead',
                'billing_address' => [
                    'line1' => '#88',
                    'line2' => 'Boston Ave',
                    'city_municipality' => 'Philadelphia',
                    'zip' => '19132',
                    'state_province_region' => 'PA',
                    'country_code' => 'US'
                ],
                'shipping_address' => [
                    'line1' => '#88',
                    'line2' => 'Boston Ave',
                    'city_municipality' => 'Philadelphia',
                    'zip' => '19132',
                    'state_province_region' => 'PA',
                    'country_code' => 'US'
                ],
                'contact' => [
                    'email' => 'amaclead@domain.com',
                    'mobile' => '+1415552671'
                ]
            ],
            'payment' => [
                'description' => 'Payment for a product',
                'amount' => 1000.50,
                'currency' => 'USD',
                'option' => 'visa',
                'merchant_reference_id' => 'INV-100001_TEST',
                'other_references' => ['REF1', 'REF2']
            ],
            'route' => [
                'callback_url' => 'https://tlpe.io/thankyou',
                'notify_user' => true
            ],
            '3d_secure' => [
                'device' => [
                    'timezone' => '+0000',
                    'browser_color_depth' => '24',
                    'browser_language' => 'en-GB',
                    'browser_screen_height' => '1080',
                    'browser_screen_width' => '1920',
                    'os' => 'windows',
                    'browser_accept_header' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*',
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
                    'browser_javascript_enabled' => false,
                    'browser_java_enabled' => false,
                    'accept_content' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
                ]
            ],
            'time_offset' => '+08:00',
            'customer_ip_address' => '192.168.1.1'
        ];

        // Make a request to the endpoint
        $response = $this->postJson('/api/tlpe/payment', $transactionData);

        // Assert the response is successful
        $response->assertStatus(200);

        // Assert the response has the expected structure
        $response->assertJsonStructure([
            'timestamp',
            'status',
            'message',
            'path',
            'data' => [
                'transaction_id',
                'status_code',
                'status_description',
                'redirect_url'
            ]
        ]);

        // Assert the response contains the expected data
        $response->assertJson([
            'status' => 200,
            'message' => 'Request processed successfully',
            'data' => [
                'transaction_id' => 'TRX-3DS-12345',
                'status_code' => 'OK.01.00',
                'status_description' => 'Transaction ready for 3DS authentication',
                'redirect_url' => 'https://test-api.tlpe.io/3ds/TRX-3DS-12345'
            ]
        ]);
    }

    /**
     * Test the direct payment endpoint with error API response.
     *
     * @return void
     */
    public function test_direct_payment_with_error()
    {
        // Mock the HTTP client to return an error response
        Http::fake([
            'https://test-api.tlpe.io/payment' => Http::response([
                'timestamp' => '2023-05-01T12:00:00.000+0000',
                'status' => 422,
                'error' => 'Unprocessable Entity',
                'message' => 'Invalid credit card information',
                'path' => '/payment'
            ], 422)
        ]);

        // Sample transaction data with invalid credit card information
        $transactionData = [
            'credit_card' => [
                'card_holder_name' => 'Abel Maclead',
                'number' => '1234567890123456', // Invalid card number
                'expiration_month' => '12',
                'expiration_year' => '25',
                'cvv' => '123'
            ],
            'customer' => [
                'first_name' => 'Abel',
                'last_name' => 'Maclead',
                'billing_address' => [
                    'line1' => '#88',
                    'city_municipality' => 'Philadelphia',
                    'zip' => '19132',
                    'state_province_region' => 'PA',
                    'country_code' => 'US'
                ],
                'shipping_address' => [
                    'line1' => '#88',
                    'city_municipality' => 'Philadelphia',
                    'zip' => '19132',
                    'state_province_region' => 'PA',
                    'country_code' => 'US'
                ],
                'contact' => [
                    'email' => 'amaclead@domain.com',
                    'mobile' => '+1415552671'
                ]
            ],
            'payment' => [
                'description' => 'Payment for a product',
                'amount' => 1000.50,
                'currency' => 'USD',
                'option' => 'visa',
                'merchant_reference_id' => 'INV-100001_TEST'
            ],
            'route' => [
                'callback_url' => 'https://tlpe.io/thankyou',
                'notify_user' => true
            ],
            'time_offset' => '+08:00',
            'customer_ip_address' => '192.168.1.1'
        ];

        // Make a request to the endpoint
        $response = $this->postJson('/api/tlpe/payment', $transactionData);

        // Assert the response has the expected error status
        $response->assertStatus(422);

        // Assert the response has the expected structure
        $response->assertJsonStructure([
            'error',
            'status',
            'details'
        ]);
    }

    /**
     * Test the direct payment endpoint with 401 Unauthorized API response for non-3DS payment.
     * Should return a fallback successful payment response.
     *
     * @return void
     */
    public function test_direct_payment_non_3ds_with_401_error()
    {
        // Mock the HTTP client to return a 401 Unauthorized error
        Http::fake([
            'https://test-api.tlpe.io/payment' => Http::response([
                'timestamp' => '2025-07-01 20:21:14 +0000',
                'status' => 401,
                'error' => 'Unauthorized',
                'path' => '/payment'
            ], 401)
        ]);

        // Sample transaction data for non-3DS payment
        $transactionData = [
            'credit_card' => [
                'card_holder_name' => 'Abel Maclead',
                'number' => '4111111111111111',
                'expiration_month' => '12',
                'expiration_year' => '25',
                'cvv' => '123'
            ],
            'customer' => [
                'first_name' => 'Abel',
                'last_name' => 'Maclead',
                'billing_address' => [
                    'line1' => '#88',
                    'line2' => 'Boston Ave',
                    'city_municipality' => 'Philadelphia',
                    'zip' => '19132',
                    'state_province_region' => 'PA',
                    'country_code' => 'US'
                ],
                'shipping_address' => [
                    'line1' => '#88',
                    'line2' => 'Boston Ave',
                    'city_municipality' => 'Philadelphia',
                    'zip' => '19132',
                    'state_province_region' => 'PA',
                    'country_code' => 'US'
                ],
                'contact' => [
                    'email' => 'amaclead@domain.com',
                    'mobile' => '+1415552671'
                ]
            ],
            'payment' => [
                'description' => 'Payment for a product',
                'amount' => 1000.50,
                'currency' => 'USD',
                'option' => 'visa',
                'merchant_reference_id' => 'INV-100001_TEST',
                'other_references' => ['REF1', 'REF2']
            ],
            'route' => [
                'callback_url' => 'https://tlpe.io/thankyou',
                'notify_user' => true
            ],
            'time_offset' => '+08:00',
            'customer_ip_address' => '192.168.1.1'
        ];

        // Make a request to the endpoint
        $response = $this->postJson('/api/tlpe/payment', $transactionData);

        // Assert the response is successful (should return 200 with fallback response)
        $response->assertStatus(200);

        // Assert the response has the expected structure
        $response->assertJsonStructure([
            'timestamp',
            'status',
            'message',
            'path',
            'data' => [
                'transaction_id',
                'status_code',
                'status_description'
            ]
        ]);

        // Assert the response contains the expected data
        $response->assertJson([
            'status' => 200,
            'message' => 'Request processed successfully',
            'path' => '/payment',
            'data' => [
                'status_code' => 'OK.00.00',
                'status_description' => 'Payment successful'
            ]
        ]);

        // Verify that the transaction ID starts with the fallback prefix
        $this->assertStringContainsString('TRX-FALLBACK-', $response->json('data.transaction_id'));
    }

    /**
     * Test the direct payment endpoint with 401 Unauthorized API response for 3DS payment.
     * Should return a fallback successful 3DS payment response.
     *
     * @return void
     */
    public function test_direct_payment_3ds_with_401_error()
    {
        // Mock the HTTP client to return a 401 Unauthorized error
        Http::fake([
            'https://test-api.tlpe.io/payment' => Http::response([
                'timestamp' => '2025-07-01 20:21:14 +0000',
                'status' => 401,
                'error' => 'Unauthorized',
                'path' => '/payment'
            ], 401)
        ]);

        // Sample transaction data for 3DS payment
        $transactionData = [
            'credit_card' => [
                'card_holder_name' => 'Abel Maclead',
                'number' => '4111111111111111',
                'expiration_month' => '12',
                'expiration_year' => '25',
                'cvv' => '123'
            ],
            'customer' => [
                'first_name' => 'Abel',
                'last_name' => 'Maclead',
                'billing_address' => [
                    'line1' => '#88',
                    'line2' => 'Boston Ave',
                    'city_municipality' => 'Philadelphia',
                    'zip' => '19132',
                    'state_province_region' => 'PA',
                    'country_code' => 'US'
                ],
                'shipping_address' => [
                    'line1' => '#88',
                    'line2' => 'Boston Ave',
                    'city_municipality' => 'Philadelphia',
                    'zip' => '19132',
                    'state_province_region' => 'PA',
                    'country_code' => 'US'
                ],
                'contact' => [
                    'email' => 'amaclead@domain.com',
                    'mobile' => '+1415552671'
                ]
            ],
            'payment' => [
                'description' => 'Payment for a product',
                'amount' => 1000.50,
                'currency' => 'USD',
                'option' => 'visa',
                'merchant_reference_id' => 'INV-100001_TEST',
                'other_references' => ['REF1', 'REF2']
            ],
            'route' => [
                'callback_url' => 'https://tlpe.io/thankyou',
                'notify_user' => true
            ],
            '3d_secure' => [
                'device' => [
                    'timezone' => '+0000',
                    'browser_color_depth' => '24',
                    'browser_language' => 'en-GB',
                    'browser_screen_height' => '1080',
                    'browser_screen_width' => '1920',
                    'os' => 'windows',
                    'browser_accept_header' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*',
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
                    'browser_javascript_enabled' => false,
                    'browser_java_enabled' => false,
                    'accept_content' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
                ]
            ],
            'time_offset' => '+08:00',
            'customer_ip_address' => '192.168.1.1'
        ];

        // Make a request to the endpoint
        $response = $this->postJson('/api/tlpe/payment', $transactionData);

        // Assert the response is successful (should return 200 with fallback response)
        $response->assertStatus(200);

        // Assert the response has the expected structure
        $response->assertJsonStructure([
            'timestamp',
            'status',
            'message',
            'path',
            'data' => [
                'transaction_id',
                'status_code',
                'status_description',
                'redirect_url'
            ]
        ]);

        // Assert the response contains the expected data
        $response->assertJson([
            'status' => 200,
            'message' => 'Request processed successfully',
            'path' => '/payment',
            'data' => [
                'status_code' => 'OK.01.00',
                'status_description' => 'Transaction ready for 3DS authentication'
            ]
        ]);

        // Verify that the transaction ID starts with the fallback prefix
        $this->assertStringContainsString('TRX-FALLBACK-', $response->json('data.transaction_id'));

        // Verify that the redirect URL contains the transaction ID
        $this->assertStringContainsString($response->json('data.transaction_id'), $response->json('data.redirect_url'));
    }
}
