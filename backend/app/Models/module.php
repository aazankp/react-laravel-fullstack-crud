<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = ['name', 'parent_id', 'operations'];

    protected $casts = [
        'operations' => 'array',
    ];

    public function children()
    {
        return $this->hasMany(Module::class, 'parent_id');
    }
}