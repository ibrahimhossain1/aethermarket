import * as React from "react"

interface PurchaseReceiptEmailProps {
  buyerName: string
  productTitle: string
  pricePaid: string
  downloadUrl: string
  purchaseId: string
}

export default function PurchaseReceiptEmail({
  buyerName,
  productTitle,
  pricePaid,
  downloadUrl,
  purchaseId
}: PurchaseReceiptEmailProps) {
  return (
    <div style={{
      backgroundColor: "#0a0a0a",
      color: "#fafafa",
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "40px 20px",
      borderRadius: "16px",
      border: "1px solid #27272a",
      maxWidth: "550px",
      margin: "0 auto"
    }}>
      
      {/* Brand Header */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <span style={{
          fontSize: "26px",
          fontWeight: "bold",
          letterSpacing: "3px",
          background: "linear-gradient(to right, #7c3aed, #6366f1)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "#7c3aed"
        }}>
          AETHER EXCHANGE
        </span>
        <span style={{
          display: "block",
          fontSize: "10px",
          color: "#a1a1aa",
          letterSpacing: "1px",
          marginTop: "4px",
          textTransform: "uppercase"
        }}>
          Digital Asset Delivery
        </span>
      </div>

      <div style={{ borderBottom: "1px solid #1f1f22", paddingBottom: "20px", marginBottom: "25px" }}>
        <h1 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 10px 0", color: "#ffffff" }}>
          Thank you for your purchase, {buyerName}!
        </h1>
        <p style={{ fontSize: "12px", color: "#a1a1aa", margin: "0", lineHeight: "1.6", fontWeight: 300 }}>
          Your transaction was verified successfully. The requested high-fidelity workspace asset is now ready for secure local installation.
        </p>
      </div>

      {/* Invoice Details Card */}
      <div style={{
        backgroundColor: "#111111",
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid #1f1f22",
        marginBottom: "30px"
      }}>
        <h2 style={{ fontSize: "11px", color: "#52525b", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 15px 0", fontWeight: "bold" }}>
          Transaction Statement
        </h2>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "10px" }}>
          <span style={{ color: "#a1a1aa" }}>Asset Purchased:</span>
          <span style={{ color: "#ffffff", fontWeight: "bold" }}>{productTitle}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "10px" }}>
          <span style={{ color: "#a1a1aa" }}>Statement ID:</span>
          <span style={{ color: "#a1a1aa", fontFamily: "monospace" }}>{purchaseId}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", borderTop: "1px solid #1f1f22", paddingTop: "10px", marginTop: "10px" }}>
          <span style={{ color: "#ffffff", fontWeight: "bold" }}>Total Charged:</span>
          <span style={{ color: "#10b981", fontWeight: "bold" }}>{pricePaid}</span>
        </div>
      </div>

      {/* CTA Button */}
      <div style={{ textAlign: "center", marginBottom: "35px" }}>
        <a href={downloadUrl} style={{
          display: "inline-block",
          backgroundColor: "#7c3aed",
          color: "#ffffff",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "12px",
          padding: "14px 28px",
          borderRadius: "9999px",
          boxShadow: "0 10px 15px -3px rgba(124, 58, 237, 0.3)"
        }}>
          Secure Signed Asset Download
        </a>
        <span style={{
          display: "block",
          fontSize: "10px",
          color: "#52525b",
          marginTop: "10px",
          fontWeight: 300
        }}>
          Link expires in 60 minutes for platform safety.
        </span>
      </div>

      <div style={{ borderTop: "1px solid #1f1f22", paddingTop: "20px", textAlign: "center", fontSize: "10px", color: "#52525b" }}>
        <p style={{ margin: "0" }}>
          Aether Exchange, Inc. • High-Fidelity AI Pipelines
        </p>
        <p style={{ margin: "5px 0 0 0" }}>
          If you have questions, please reach out to operations@aether.net.
        </p>
      </div>

    </div>
  )
}
