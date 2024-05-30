import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey('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');

export const POST = async (req: NextRequest) => {
    const { to, subject, text, html } = await req.json();

    console.log(to, subject, text, html)

    const msg = {
        to,
        from: 'no-reply@tokentool.io',  // Use the email address or domain you verified with SendGrid
        subject,
        text,
        html: '<p>Thank you for your submission. Our support team will get back to you as soon as possible.</p>',
    };

    const msg1 = {
        to: 'admin@tokentool.io',
        from: 'admin@tokentool.io',  // Use the email address or domain you verified with SendGrid
        subject: 'New message from ' + to,
        text,
        html: text,
    };

    try {
        await sgMail.send(msg);
        await sgMail.send(msg1);
        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error: any) {
        // Log the error to understand where it went wrong
        console.error('Error sending email:', error);
        if (error.response) {
            console.error('SendGrid response error:', error.response.body);
        }

        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
};
