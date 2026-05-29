import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY

// Initialize Resend with a fallback mock structure if the key is not present
export const resend = resendApiKey 
  ? new Resend(resendApiKey)
  : {
      emails: {
        send: async (payload: any) => {
          console.warn("⚠️ RESEND_API_KEY environment variable is not defined. Simulating Resend email transmission.")
          console.log("------------------ RESEND SIMULATOR ------------------")
          console.log(`To: ${payload.to}`)
          console.log(`From: ${payload.from || "Aether Exchange <noreply@aether.net>"}`)
          console.log(`Subject: ${payload.subject}`)
          console.log(`Preview:`, payload.react ? "[React Render]" : payload.html || payload.text)
          console.log("------------------------------------------------------")
          return { data: { id: `mock_email_${Date.now()}` }, error: null }
        }
      }
    } as unknown as Resend
