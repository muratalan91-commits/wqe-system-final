"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc
} from "firebase/firestore";

import VerifyCard from "../components/VerifyCard";

export default function Home() {

  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [owner, setOwner] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [revizyontarihi, setRevizyontarihi] = useState("");
  const [status, setStatus] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [lang, setLang] = useState<"tr" | "en">("tr");

  const t = {
    tr: {
      subtitle: "Dijital E-Belge Doğrulama Sistemi",
      query: "Sorgula",
      how: "Nasıl Çalışır?",
      features: "Özellikler",
      login: "GİRİŞ",
      badge: "Güvenli Dijital Doğrulama",
      heroTitle: "Belgelerinizi anında ve güvenli şekilde doğrulayın.",
      heroDesc:
        "Belge kodu veya QR kod ile sistemde kayıtlı belgelerin geçerliliğini hızlı ve güvenli şekilde kontrol edin.",
      verifyLabel: "BELGE DOĞRULAMA",
      verifyTitle: "Belge Sorgula",
      verifyDesc: "Belge kodunu giriniz.",
      verifyButton: "Belgeyi Doğrula",
      enterCode: "⚠️ Belge kodu giriniz",
      notFound: "❌ Belge bulunamadı",
      validResult: "✅ Bu belge sistemde kayıtlıdır",
      docName: "Belge adı",
      owner: "Firma / Kişi",
      address: "Adres",
      description: "Belge açıklaması",
      date: "Tarih",
      revisionDate: "Revizyon tarihi",
      status: "Durum",
      valid: "Geçerli",
      expired: "Süresi Doldu",
      cancelled: "İptal Edildi",
      qrTitle: "QR Kod",
      viewPdf: "PDF Görüntüle",
      downloadPdf: "PDF İndir",
      footer: "Uluslararası Dijital Belge Doğrulama Sistemi",
    },

    en: {
      subtitle: "Digital Verification System",
      query: "Verify",
      how: "How It Works",
      features: "Features",
      login: "LOGIN",
      badge: "Secure Digital Verification",
      heroTitle: "Verify your documents instantly.",
      heroDesc:
        "Verify registered documents securely using QR code or document code.",
      verifyLabel: "DOCUMENT VERIFICATION",
      verifyTitle: "Verify Document",
      verifyDesc: "Enter document code.",
      verifyButton: "Verify",
      enterCode: "⚠️ Enter document code",
      notFound: "❌ Document not found",
      validResult: "✅ Document verified",
      docName: "Document name",
      owner: "Company / Person",
      address: "Address",
      description: "Description",
      date: "Date",
      revisionDate: "Revision date",
      status: "Status",
      valid: "Valid",
      expired: "Expired",
      cancelled: "Cancelled",
      qrTitle: "QR Code",
      viewPdf: "View PDF",
      downloadPdf: "Download PDF",
      footer: "International Digital Verification System",
    },
  };

  const clearResult = () => {
    setDocumentName("");
    setOwner("");
    setAddress("");
    setDescription("");
    setDate("");
    setRevizyontarihi("");
    setStatus("");
    setPdfUrl("");
  };

  const statusText = (value: string) => {

    if (value === "valid") return t[lang].valid;

    if (value === "expired") return t[lang].expired;

    if (value === "cancelled") return t[lang].cancelled;

    return value || "-";
  };

  const verifyDocument = async (customCode?: string) => {

    const searchCode = (customCode || code).trim();

    if (!searchCode) {
      setResult(t[lang].enterCode);
      clearResult();
      return;
    }

    /* Hatalı deneme limiti */
    const failedAttempts =
      Number(localStorage.getItem("failedAttempts") || 0);

    if (failedAttempts >= 5) {

      setResult(
        "⚠️ Çok fazla hatalı deneme yaptınız. Daha sonra tekrar deneyin."
      );

      clearResult();

      return;
    }

    const q = query(
      collection(db, "documents"),
      where("code", "==", searchCode)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {

      localStorage.setItem(
        "failedAttempts",
        String(failedAttempts + 1)
      );

      setResult(t[lang].notFound);

      clearResult();

      return;
    }

    localStorage.setItem("failedAttempts", "0");

    const data: any = querySnapshot.docs[0].data();

    setResult(t[lang].validResult);

    setDocumentName(data.name || "");
    setOwner(data.owner || "");
    setAddress(data.address || "");
    setDescription(data.description || "");
    setDate(data.date || "");
    setRevizyontarihi(data.revizyontarihi || "");
    setStatus(data.status || "valid");
    setPdfUrl(data.pdfUrl || "");

    /* Query log */
    try {

      await addDoc(collection(db, "query_logs"), {
        code: searchCode,
        success: true,
        createdAt: new Date(),
        userAgent: navigator.userAgent,
      });

    } catch (e) {

      console.log(e);

    }
  };

  useEffect(() => {

    setSiteUrl(window.location.origin);

    const params = new URLSearchParams(window.location.search);

    const qrCode = params.get("code");

    if (qrCode) {

      setCode(qrCode);

      verifyDocument(qrCode);

    }

  }, []);

  return (

    <main className="min-h-screen bg-[#f5f8ff] text-slate-900">

      <section className="relative overflow-hidden bg-gradient-to-br from-[#021B4E] via-[#003B8F] to-[#020617] text-white">

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">

          <div>

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              {t[lang].badge}
            </div>

            <h2 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              {t[lang].heroTitle}
            </h2>

            <p className="text-blue-100 text-lg mb-8 max-w-xl">
              {t[lang].heroDesc}
            </p>

          </div>

          <div
            className="bg-white text-slate-900 rounded-[2rem] p-8 shadow-2xl"
          >

            <div className="mb-6">

              <div className="text-sm font-bold text-blue-700 mb-2">
                {t[lang].verifyLabel}
              </div>

              <h3 className="text-3xl font-black mb-2">
                {t[lang].verifyTitle}
              </h3>

              <p className="text-slate-500">
                {t[lang].verifyDesc}
              </p>

            </div>

            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Örn: WQE-001"
              className="w-full p-4 rounded-2xl bg-slate-100 border border-slate-200 outline-none mb-4"
            />

            <button
              onClick={() => verifyDocument()}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-2xl font-bold"
            >
              {t[lang].verifyButton}
            </button>

            {result.includes("✅") && (

              <VerifyCard
                belge={{
                  name: documentName,
                  code: code,
                  owner: owner,
                  firma: owner,
                  date: date,
                }}
              />

            )}

            <div className="mt-6 border border-slate-200 rounded-2xl p-5 bg-white">

              <div
                className={`text-xl font-black mb-4 ${
                  result.includes("✅")
                    ? "text-green-600"
                    : result.includes("❌")
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {result}
              </div>

              {documentName && (

                <div className="space-y-3 text-sm">

                  <div className="flex justify-between border-b pb-2">
                    <span>{t[lang].docName}</span>
                    <strong>{documentName}</strong>
                  </div>

                  <div className="flex justify-between border-b pb-2">
                    <span>{t[lang].owner}</span>
                    <strong>{owner}</strong>
                  </div>

                  <div className="flex justify-between border-b pb-2">
                    <span>{t[lang].date}</span>
                    <strong>{date}</strong>
                  </div>

                  {revizyontarihi && (

                    <div className="flex justify-between border-b pb-2">
                      <span>{t[lang].revisionDate}</span>
                      <strong>{revizyontarihi}</strong>
                    </div>

                  )}

                  <div className="flex justify-between border-b pb-2">

                    <span>{t[lang].status}</span>

                    <strong>
                      {statusText(status)}
                    </strong>

                  </div>

                  {documentName && siteUrl && (

                    <div className="mt-4 text-center">

                      <div className="font-bold mb-2">
                        {t[lang].qrTitle}
                      </div>

                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                          `${siteUrl}/?code=${code}`
                        )}`}
                        alt="QR"
                        className="mx-auto rounded-xl border p-2 bg-white"
                      />

                    </div>

                  )}

                  {pdfUrl && (

                    <div className="grid grid-cols-2 gap-3 pt-2">

                      <a
                        href={pdfUrl}
                        target="_blank"
                        className="text-center bg-blue-700 text-white p-3 rounded-xl font-bold"
                      >
                        {t[lang].viewPdf}
                      </a>

                      <a
                        href={pdfUrl}
                        download
                        className="text-center bg-slate-900 text-white p-3 rounded-xl font-bold"
                      >
                        {t[lang].downloadPdf}
                      </a>

                    </div>

                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      </section>

      <footer className="bg-slate-950 text-slate-400 py-6 text-center">
        ©️ 2002 WQE-Belge Dijital
      </footer>

    </main>
  );
}