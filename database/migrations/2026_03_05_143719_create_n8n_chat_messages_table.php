<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('n8n_chat_messages', function (Blueprint $table) {
            $table->id();

            // This is the session key (e.g., "tenantId_phoneNumber")
            $table->string('session_id')->index(); 
            // n8n stores the LangChain message object here
            $table->jsonb('message'); 
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('n8n_chat_messages');
    }
};
