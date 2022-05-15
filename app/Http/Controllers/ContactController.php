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

    function list(Request $request){
        $collection = Contact::all();

        foreach($collection as $contact){
            $emails = Email::where("contact_id", $contact->id)
                ->get()
                ->toArray();
            $phone_numbers = PhoneNumber::where("contact_id", $contact->id)
                ->get()
                ->toArray();

            $contact["emails"] = $emails;
            $contact["phone_numbers"] = $phone_numbers;
        }

        $per_page = $request->query("per_page", 8);
        $page = $request->query("page", 1);
        $count = count($collection);

        $contacts = $collection->toArray();
        usort($contacts, function ($a, $b) {
            $a_val = $a['name'];
            $b_val = $b['name'];

            if($a_val > $b_val) return 1;
            if($a_val < $b_val) return -1;
            return 0;
        });


        $initial = $per_page * ($page - 1);
        $response_data = array_slice($contacts, $initial, $per_page);

        return response(json_encode([
            "total" => $count,
            "contacts" => $response_data
        ]), 200);
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
            if(isset($email["id"]) && !empty($email["id"]))
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
            if(isset($phone_number["id"]) && !empty($phone_number["id"]))
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

        $db_emails = Email::where("contact_id", $id)->get()->toArray();
        $req_emails = array_map(function($item){
            return $item["content"];
        }, $request->emails);
        foreach($db_emails as $email){
            $is_in_request = in_array($email["content"], $req_emails);

            if( !$is_in_request )
                Email::where("content", $email["content"])->delete();
        }

        $db_phone_numbers = PhoneNumber::where("contact_id", $id)->get()->toArray();
        $req_phone_numbers = array_map(function($item){
            return $item["content"];
        }, $request->phone_numbers);
        foreach($db_phone_numbers as $phone_number){
            $is_in_request = in_array($phone_number["content"], $req_phone_numbers);

            if( !$is_in_request )
                PhoneNumber::where("content", $phone_number["content"])->delete();
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
