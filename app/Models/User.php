<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Auth\MustVerifyEmail as AuthMustVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Jurager\Teams\Traits\HasTeams;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use AuthMustVerifyEmail, HasApiTokens, HasFactory, HasTeams, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'tenant_id',
        'name',
        'email',
        'password',
        'role',
        'email_verified_at',
        'google_id',
        'google_token',
        'google_refresh_token',
        'has_password',
        'welcome_dismissed_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
        'google_token',
        'google_refresh_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_super_admin' => 'boolean',
            'has_password' => 'boolean',
            'welcome_dismissed_at' => 'datetime',
        ];
    }

    public function hasPassword(): bool
    {
        return $this->has_password;
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function assignedLeads()
    {
        return $this->hasMany(Lead::class, 'assigned_to');
    }

    public function agentConversations()
    {
        return $this->hasMany(AgentConversation::class);
    }

    public function agentConversationMessages()
    {
        return $this->hasMany(AgentConversationMessage::class);
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isManager()
    {
        return $this->role === 'manager';
    }

    public function isAgent()
    {
        return $this->role === 'agent';
    }

    public function isSuperAdmin()
    {
        return $this->is_super_admin === true;
    }
}
