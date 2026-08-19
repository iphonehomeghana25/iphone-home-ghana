import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export default async function handler(req, res) {
  // 1. Security Check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 2. Safely check for keys
    if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Vercel is missing Supabase Keys!");
      return res.status(500).json({ error: 'Server config error: Missing Supabase Keys' });
    }

    if (!process.env.REACT_APP_PAYSTACK_SECRET_KEY) {
      console.error("Vercel is missing Paystack Secret Key!");
      return res.status(500).json({ error: 'Server config error: Missing Paystack Key' });
    }

    // 3. Initialize secure clients
    const supabase = createClient(
      process.env.REACT_APP_SUPABASE_URL,
      process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY 
    );
    
    // Fallback to whichever Resend key format you have in Vercel
    const resendKey = process.env.RESEND_API_KEY || process.env.REACT_APP_RESEND_API_KEY;
    const resend = new Resend(resendKey);

    const { 
      reference, customer_name, customer_phone, customer_email, 
      quantity, total_paid, active_bid_id, product_name 
    } = req.body;

    if (!reference || !customer_email || !active_bid_id) {
      return res.status(400).json({ error: 'Missing required bid details' });
    }

    // --- STEP 4: VERIFY PAYMENT WITH PAYSTACK ---
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_SECRET_KEY}` }
    });
    
    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data.status !== 'success') {
      console.error("Paystack Verification Failed:", paystackData);
      return res.status(400).json({ error: 'Payment verification failed with Paystack' });
    }

    // --- STEP 5: LOG THE BID ENTRIES INTO SUPABASE ---
    const { error: dbError } = await supabase
      .from('bid_entries')
      .insert([{
        active_bid_id, 
        customer_name, 
        customer_phone, 
        customer_email, 
        quantity, 
        total_paid, 
        paystack_reference: reference
      }]);

    if (dbError) {
      console.error("Supabase Database Error:", dbError);
      throw dbError; // Stop here if DB fails
    }

    // --- STEP 6: ISOLATED EMAIL DISPATCH ---
    try {
      if (resendKey) {
        const emailHtml = `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eaecf0; padding: 20px; border-radius: 8px;">
            <h1 style="color: #000; text-align: center;">Bid Confirmed! 🎉</h1>
            <p>Hi <strong>${customer_name}</strong>,</p>
            <p>We have successfully received your payment of GH₵${total_paid}.</p>
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Item:</strong> ${product_name}</p>
                <p style="margin: 10px 0 0 0;"><strong>Total Bids Secured:</strong> <span style="font-size: 1.2rem; font-weight: bold; color: #d97706;">${quantity}</span></p>
            </div>
            <p>Keep an eye on the site for when the timer ends! We will contact you directly via phone and email if your name is picked.</p>
          </div>
        `;

        await resend.emails.send({
          // ALIGNED WITH YOUR WORKING CODE
          from: 'iPhone Home Ghana <receipts@iphonehomeghana.com>', 
          to: [customer_email], 
          subject: 'Your Bid Confirmation - iPhone Home Ghana',
          html: emailHtml
        });
        console.log("Email sent successfully to:", customer_email);
      }
    } catch (emailError) {
      console.error('Resend Email Error (Ignored for UI):', emailError);
    }

    // --- STEP 7: SUCCESS RESPONSE ---
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Fatal Bid Processing Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
