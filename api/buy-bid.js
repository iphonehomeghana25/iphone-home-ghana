import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// NOTE: We use the SUPABASE_SERVICE_ROLE_KEY here, NOT the Anon Key. 
// The Service Role key safely bypasses the Row Level Security so the server can write the data.
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Security Check: Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    reference, 
    customer_name, 
    customer_phone, 
    customer_email, 
    quantity, 
    total_paid, 
    active_bid_id, 
    product_name 
  } = req.body;

  if (!reference || !customer_email || !active_bid_id) {
    return res.status(400).json({ error: 'Missing required bid details' });
  }

  try {
    // --- 1. VERIFY PAYMENT WITH PAYSTACK ---
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });
    
    const paystackData = await paystackRes.json();

    // Check if the transaction actually succeeded on Paystack's end
    if (!paystackData.status || paystackData.data.status !== 'success') {
      return res.status(400).json({ error: 'Payment verification failed with Paystack' });
    }

    // --- 2. LOG THE BID ENTRIES INTO SUPABASE ---
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

    // If the unique reference already exists, this throws an error, preventing duplicate entries.
    if (dbError) throw dbError;

    // --- 3. SEND CONFIRMATION EMAIL VIA RESEND ---
    const emailHtml = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eaecf0; padding: 20px; border-radius: 8px;">
        <h1 style="color: #000; text-align: center;">Bid Confirmed! 🎉</h1>
        <p>Hi <strong>${customer_name}</strong>,</p>
        <p>We have successfully received your payment of GH₵${total_paid}.</p>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Item:</strong> ${product_name}</p>
            <p style="margin: 10px 0 0 0;"><strong>Total Bids Secured:</strong> <span style="font-size: 1.2rem; font-weight: bold; color: #d97706;">${quantity}</span></p>
        </div>
        <p>Keep an eye on the site for when the timer ends to see if you won! We will contact you directly via phone and email if your name is picked by the randomizer.</p>
        <p style="font-size: 0.8rem; color: #666; margin-top: 30px;">If you have any questions, you can reply directly to this email or hit us up on WhatsApp.</p>
      </div>
    `;

    await resend.emails.send({
      from: 'iPhone Home Ghana <onboarding@resend.dev>', // Update this when you attach their official domain to Resend
      to: customer_email,
      subject: 'Your Bid Confirmation - iPhone Home Ghana',
      html: emailHtml
    });

    // --- 4. SUCCESS RESPONSE ---
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Bid Processing Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
