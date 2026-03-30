const RESEND_API_KEY = "re_jQFvX7ir_dWPGk5c4mGrTaByXM8Exoq46";
const TO_EMAIL = "ayushkamboj9690@gmail.com";

async function testResend() {
  console.log("Testing Resend API with Key: " + RESEND_API_KEY.substring(0, 5) + "...");
  
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: TO_EMAIL,
        subject: "Direct Test from Terminal",
        html: "<h1>It Works!</h1><p>If you see this, your Resend API key is valid and working.</p>"
      }),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

testResend();
