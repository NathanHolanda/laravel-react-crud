<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Avlima\PhpCpfCnpjGenerator\Generator;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contact>
 */
class ContactFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            "name" => $this->faker->firstName(null),
            "surname" => $this->faker->lastName(),
            "cpf" => Generator::cpf(true)
        ];
    }
}
