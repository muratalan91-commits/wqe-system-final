"use client";

import { QRCodeCanvas } from "qrcode.react";

export default function VerifyCard({ belge }) {

  const verifyUrl =
    `https://wqe-belgedijital.org/verify/${belge.code}`;

  return (
    <div className="verify-card">

      <div className="hologram"></div>

      <h2>{belge.name}</h2>

      <p>
        Belge Kodu:
        <strong> {belge.code}</strong>
      </p>
<p>
  Firma:
  <strong>
    {" "}
    {belge.company ||
     belge.firma ||
     belge.firmaAdi ||
     "Firma bilgisi yok"}
  </strong>
</p>
      <p>
        Tarih: {belge.date}
      </p>

      <div className="qr-area">
        <QRCodeCanvas
          value={verifyUrl}
          size={130}
          level="H"
        />
      </div>

      <div className="verified-badge">
        ✓ Doğrulandı
      </div>

    </div>
  );
}