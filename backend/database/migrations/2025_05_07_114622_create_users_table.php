<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('fullName');
            $table->enum('role', ['Super Admin', 'Admin', 'Teacher', 'Parent', 'Student']);
            $table->string('email')->unique();
            $table->string('mobile')->nullable();
            $table->enum('gender', ['Male', 'Female', 'Other']);
            $table->unsignedBigInteger('branch')->default(0); // Set default value of branch to 0
            $table->boolean('status')->default(false);
            $table->string('password');
            $table->string('old_password')->nullable();
            $table->json('module_access')->nullable();
            $table->unsignedBigInteger('added_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}