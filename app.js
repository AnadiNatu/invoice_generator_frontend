
const form = document.getElementById("invoiceForm");
const statusMessage = document.getElementById("statusMessage");
const generateBtn = document.getElementById("generateBtn") ;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dealerId = (document.getElementById("dealerId") ).value.trim();
  const vehicleId = (document.getElementById("vehicleId")).value.trim();
  const customerName = (document.getElementById("customerName") ).value.trim();

  if (!dealerId || !vehicleId || !customerName) {
    statusMessage.textContent = "❌ Please fill in all fields.";
    statusMessage.style.color = "red";
    return;
  }

  generateBtn.disabled = true;
  statusMessage.textContent = "⏳ Generating invoice...";
  statusMessage.style.color = "gray";

  try {
    const response = await fetch("http://localhost:8080/api/invoice/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dealerId, vehicleId, customerName }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate invoice");
    }

    const blob = await response.blob();
    const fileUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = `Invoice_${vehicleId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    statusMessage.textContent = "✅ Invoice downloaded successfully!";
    statusMessage.style.color = "green";
  } catch (err) {
    console.error(err);
    statusMessage.textContent = "❌ Error generating invoice.";
    statusMessage.style.color = "red";
  } finally {
    generateBtn.disabled = false;
  }
});
