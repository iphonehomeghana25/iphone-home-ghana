import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // 1. Security Check: Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { order, customer_email } = req.body;

  if (!order || !customer_email) {
    return res.status(400).json({ error: 'Missing order details' });
  }

  try {
    // 2. Construct the Email HTML
    const emailHtml = `
      <div style="font-family: sans-serif; color: #333;">
        <h1 style="color: #000;">Thank you for your order! 🎉</h1>
        <p>Hi ${order.customer_name},</p>
        <p>We have received your order at <strong>iPhone Home Ghana</strong>.</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Order ID:</strong> ${order.id}</p>
          <p style="margin: 0;"><strong>Total:</strong> GH₵${order.total_amount.toLocaleString()}</p>
          <p style="margin: 0;"><strong>Payment Method:</strong> ${order.payment_method}</p>
        </div>

        <h3>Order Summary:</h3>
        <ul style="list-style: none; padding: 0;">
          ${order.items.map(item => `
            <li style="border-bottom: 1px solid #eee; padding: 10px 0;">
              <strong>${item.name}</strong> (x${item.quantity}) <br/>
              <span style="color: #666; font-size: 14px;">${item.condition} - ${item.storage}</span>
            </li>
          `).join('')}
        </ul>

        <br/>
        <p><strong>What's Next?</strong></p>
        <p>Our team will contact you shortly on <strong>${order.customer_phone}</strong> to confirm delivery.</p>
        
        <p>Need help? Reply to this email or call 024 317 9760.</p>
      </div>
    `;

    // 3. Send via Resend (Using Verified Domain)
    const data = await resend.emails.send({
      // CHANGE THIS: Replace with your verified domain email
      // Example: 'iPhone Home Ghana <orders@iphonehomeghana.com>'
      from: 'iPhone Home Ghana <receipts@iphonehomeghana.com>', 
      to: [customer_email], // Now this will work for ANY email (Gmail, Yahoo, etc.)
      subject: `Order Confirmed: ${order.id}`,
      html: emailHtml,
    });

    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error('Resend Error:', error);
    return res.status(500).json({ error: error.message });
  }
}