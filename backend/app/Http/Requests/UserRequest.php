<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $userId = $this->route('id');

        $rules = [
            'fullName' => 'required|string|max:255',
            'role' => 'required|string',
            'email' => 'required|email',
            'mobile' => 'required|digits:11',
            'gender' => 'required|string|in:Male,Female,Other',
            'branch' => 'required|integer',
            'status' => 'nullable|boolean',
            'password' => 'nullable|string|min:8|confirmed',
            'password' => 'nullable|string|min:8',
        ];

        if ($this->isMethod('post')) {
            $rules['email'] .= '|unique:users,email';
            $rules['mobile'] .= '|unique:users,mobile';
            $rules['password'] .= '|required';
        }

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['email'] .= '|unique:users,email,' . $userId;
            $rules['mobile'] .= '|unique:users,mobile,' . $userId;
            $rules['password'] = 'nullable|string|min:8|confirmed';
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'fullName.required' => 'Full Name is required.',
            'role.required' => 'Please select a valid role.',
            'email.required' => 'Email address is required.',
            'email.unique' => 'The email address is already in use.',
            'mobile.required' => 'Mobile number is required.',
            'mobile.unique' => 'The mobile number is already in use.',
            'mobile.digits' => 'Mobile number should be 11 digits long.',
            'gender.required' => 'Gender is required.',
            'branch.required' => 'Branch selection is required.',
            'status.boolean' => 'Status must be either true or false.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Passwords do not match.',
        ];
    }
}