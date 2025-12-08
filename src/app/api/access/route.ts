import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend('re_CHbDdGfW_314Rbspmq7Y4dQDrorrTTsVN');

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Send notification to Admin
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'admin@bondemi.finance', // In a real scenario this would be the admin email
            subject: 'New Access Request: Bondemi Testnet',
            html: `<p>New business email request from: <strong>${email}</strong></p><p>Grant access if qualified.</p>`
        });

        // Set cookie
        const response = NextResponse.json({ success: true });
        response.cookies.set('bondemi_access', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;
    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json({ error: 'Failed to send request' }, { status: 500 });
    }
}
