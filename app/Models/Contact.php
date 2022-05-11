<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model{
    protected $fillable = [
        "name",
        "surname",
        "cpf",
        "main_email",
        "main_phone_number"
    ];
}
