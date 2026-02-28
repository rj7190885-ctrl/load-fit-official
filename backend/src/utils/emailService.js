const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

exports.sendConfirmationEmail = async (email, name, referralCode) => {
    if (!resend) {
        console.log(`[MOCK EMAIL] To: ${email} - Welcome to the LOAD waitlist! Your ref code: ${referralCode}`);
        return;
    }

    try {
        const data = await resend.emails.send({
            from: 'LOAD Waitlist <noreply@loadband.com>', // Update with verified domain
            to: email,
            subject: 'You\'re on the LOAD Waitlist!',
            html: `
                <div style="font-family: sans-serif; color: #111;">
                    <h2>Welcome to the Elite, ${name}</h2>
                    <p>You have successfully joined the waitlist for <strong>LOAD.</strong></p>
                    <p>We're building the most advanced AI-driven recovery band for athletes and serious fitness enthusiasts.</p>
                    
                    <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #555; font-size: 14px;">Your exclusive referral code:</p>
                        <h3 style="margin: 5px 0 0 0; color: #FF2D2D; font-size: 24px;">${referralCode}</h3>
                    </div>

                    <p>Share this code to climb the waitlist and secure early access priority.</p>
                    <p>Train smarter. Recover harder. Perform better.</p>
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #888;">LOAD Fitness Co. &copy; ${new Date().getFullYear()}</p>
                </div>
            `
        });

        console.log('Email sent successfully:', data);
        return data;
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        throw error;
    }
};
