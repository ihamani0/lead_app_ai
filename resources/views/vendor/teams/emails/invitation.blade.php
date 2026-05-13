<div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 20px; max-width: 600px; margin: auto; color: #333;">
    
    <!-- Header -->
    <div style="text-align: center; padding: 20px 0;">
        <h2 style="color: #333; font-size: 28px; margin: 0 0 10px;">
            {{ __('invitation.subject', ['team' => $invitation->team->name]) }}
        </h2>
        <p style="font-size: 16px; color: #666; margin: 0;">
            {{ __('invitation.body', ['team' => $invitation->team->name]) }}
        </p>
    </div>

    <!-- Accept Button -->
    <div style="margin: 30px 0; text-align: center;">
        <a href="{{ $url }}" 
           style="display: inline-block; padding: 12px 28px; font-size: 16px; font-weight: 600; color: #fff; background-color: #28a745; border-radius: 6px; text-decoration: none; box-shadow: 0 4px 8px rgba(40,167,69,0.3);">
            {{ __('invitation.button') }}
        </a>
    </div>

    <!-- Footer -->
    <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #999; border-top: 1px solid #eee; padding-top: 20px;">
        <p style="margin: 0 0 10px;">{{ __('invitation.footer') }}</p>
        <p style="margin: 0;">
            {{ __('invitation.regards') }}<br>
            <strong>{{ config('app.name') }}</strong>
        </p>
    </div>
</div>