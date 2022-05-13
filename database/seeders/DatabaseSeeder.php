<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Contact;
use App\Models\PhoneNumber;
use App\Models\Email;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        for($i = 0; $i < 30; $i++){
            $contact = Contact::factory()->create();

            Email::factory()->create([
                "contact_id" => $contact->id
            ]);
            PhoneNumber::factory()->create([
                "contact_id" => $contact->id
            ]);
        }
    }
}
