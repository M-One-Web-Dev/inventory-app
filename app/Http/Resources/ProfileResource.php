<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "id_number" => $this->id_number,
            "address" => $this->address,
            "phone_number" => $this->phone_number,
            "email" => $this->email,
            "status" => $this->status,
            "role" => $this->role,
            "class" => $this->class,
            "generation" => $this->generation,
            "school_year" => $this->school_year,
        ];
    }
}
