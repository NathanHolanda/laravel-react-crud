<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;

class ContactController extends Controller
{
    function create(Request $request){
        $data = $request->all();

        Contact::create($data);

        return response(json_encode([
            "message" => "Contact created."
        ]), 201);
    }

    function list(){
        $contacts = Contact::all();

        return response(json_encode($contacts), 200);
    }

    function contact(Request $request){
        $id = $request->id;

        $contact = Contact::find($id);

        if( !empty($contact) )
            return response(json_encode($contact), 200);

        return response(json_encode([
            "message" => "Contact doesn't exist."
        ]), 404);
    }

    function edit(Request $request){
        $data = $request->all();
        $id = $request->id;

        $updated = Contact::where("id", $id)
            ->update($data);

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
