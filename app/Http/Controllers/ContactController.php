<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use App\Models\Email;
use App\Models\PhoneNumber;

class ContactController extends Controller
{
    function create(Request $request){
        $contact_data = [
            "name" => $request->name,
            "surname" => $request->surname,
            "cpf" => $request->cpf
        ];
        $contact = Contact::create($contact_data);

        foreach ($request->emails as $email) {
            $email_data = [
                "contact_id" => $contact->id,
                "content" => $email
            ];
            Email::create($email_data);
        }

        foreach ($request->phone_numbers as $phone_number) {
            $phone_number_data = [
                "contact_id" => $contact->id,
                "content" => $phone_number
            ];
            PhoneNumber::create($phone_number_data);
        }

        return response(json_encode([
            "message" => "Contact created."
        ]), 201);
    }

    function list(){
        $contacts = Contact::all();

        foreach($contacts as $contact){
            $emails = Email::where("contact_id", $contact->id)
                ->get()
                ->toArray();
            $phone_numbers = PhoneNumber::where("contact_id", $contact->id)
                ->get()
                ->toArray();

            $contact["emails"] = $emails;
            $contact["phone_numbers"] = $phone_numbers;
        }

        return response(json_encode($contacts), 200);
    }

    function contact(Request $request){
        $id = $request->id;

        $contact = Contact::find($id);

        if( empty($contact) )
            return response(json_encode([
                "message" => "Contact doesn't exist."
            ]), 404);

        $emails = Email::where("contact_id", $id)
            ->get()
            ->toArray();
        $phone_numbers = PhoneNumber::where("contact_id", $id)
            ->get()
            ->toArray();

        $contact["emails"] = $emails;
        $contact["phone_numbers"] = $phone_numbers;

        return response(json_encode($contact), 200);
    }

    function edit(Request $request){
        $contact_data = [
            "name" => $request->name,
            "surname" => $request->surname,
            "cpf" => $request->cpf
        ];
        $id = $request->id;

        $updated = Contact::where("id", $id)
            ->update($contact_data);

        foreach($request->emails as $email){
            if(isset($email["id"]))
                Email::where("id", $email["id"])
                    ->update([
                        "contact_id" => $id,
                        "content" => $email["content"]
                    ]);
            else
                Email::create([
                    "contact_id" => $id,
                    "content" => $email["content"]
                ]);
        }
        foreach($request->phone_numbers as $phone_number){
            if(isset($phone_number["id"]))
                PhoneNumber::where("id", $phone_number["id"])
                    ->update([
                        "contact_id" => $id,
                        "content" => $phone_number["content"]
                    ]);
            else
                PhoneNumber::create([
                    "contact_id" => $id,
                    "content" => $phone_number["content"]
                ]);
        }

        if($updated)
            return response(json_encode([
                "message" => "Contact updated."
            ]), 201);

        return response(json_encode([
            "message" => "Contact doesn't exist."
        ]), 404);
    }

    function delete(Request $request){
        $id = $request->id;

        Email::where("contact_id", $id)
            ->delete();
        PhoneNumber::where("contact_id", $id)
            ->delete();

        $deleted = Contact::destroy($id);

        if($deleted)
            return response(json_encode([
                "message" => "Contact deleted."
            ]), 200);

        return response(json_encode([
            "message" => "Contact doesn't exist."
        ]), 404);
    }
}
