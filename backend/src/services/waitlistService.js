const supabase = require('../config/supabase');
const emailService = require('../utils/emailService');

exports.processSignup = async (signupData) => {
    // Generate a unique 8-character referral code
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Prepare the payload for the database
    const payload = {
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone || null,
        city: signupData.city || null,
        fitness_level: signupData.fitnessLevel || null,
        primary_goal: signupData.primaryGoal || null,
        wearable: signupData.wearable || null,
        willing_to_pay: signupData.willingToPay,
        referral_code: referralCode,
        ip_address: signupData.ipAddress,
        user_agent: signupData.userAgent
    };

    if (supabase) {
        // Insert into Supabase
        const { data, error } = await supabase
            .from('waitlist')
            .insert([payload])
            .select()
            .single();

        if (error) {
            throw error; // Will be caught by the controller
        }

        // Trigger confirmation email async (do not block)
        emailService.sendConfirmationEmail(signupData.email, signupData.name, referralCode)
            .catch(err => console.error('Failed to send email:', err));

        return data;
    } else {
        // For local testing without supabase credentials
        console.log('[MOCKDB] Processed signup:', payload);
        return { ...payload, id: Math.floor(Math.random() * 1000) };
    }
};
