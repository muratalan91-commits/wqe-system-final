"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

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
        "Belge kodu veya QR kod ile sistemde kayıtlı belgelerin geçerliliğini hızlı, güvenli ve kurumsal şekilde kontrol edin.",
      verifyLabel: "BELGE DOĞRULAMA",
      verifyTitle: "Belge Sorgula",
      verifyDesc: "Sertifikanızın ön yüzünde yer alan doğrulama kodunu giriniz.",
      verifyButton: "Belgeyi Doğrula",
      enterCode: "⚠️ Belge kodu giriniz",
      notFound: "❌ Belge bulunamadı",
      validResult: "✅ Belge geçerli",
      docName: "Belge adı",
      owner: "Firma / Kişi",
      address: "Adres",
      description: "Belge açıklaması",
      date: "Tarih",
      status: "Durum",
      valid: "Geçerli",
      expired: "Süresi Doldu",
      cancelled: "İptal Edildi",
      qrTitle: "QR Kod ile Doğrulama",
      viewPdf: "PDF Görüntüle",
      downloadPdf: "PDF İndir",
      cert: "Sertifika",
      verification: "Doğrulama",
      secure: "Güvenli",
      uninterrupted: "Kesintisiz Doğrulama",
      secureInfra: "Güvenli Altyapı",
      fastQuery: "Hızlı Sorgulama",
      digitalCert: "Dijital Sertifika",
      trustedTitle: "Güvenilir Belge Doğrulama",
      trustedDesc:
        "WQE Belge Dijital, kurumunuzun çıkardığı belgelerin güvenilirliğini dijital ortamda tescil eder.",
      verifiedDocs: "Doğrulanan Belge",
      registeredCompany: "Kayıtlı Kurum",
      access: "Erişim İmkânı",
      docTypes: "Belge Türleri",
      footer: "Uluslararası Dijital Belge Doğrulama Sistemi",
    },
    en: {
      subtitle: "Digital E-Document Verification System",
      query: "Verify",
      how: "How It Works",
      features: "Features",
      login: "LOGIN",
      badge: "Secure Digital Verification",
      heroTitle: "Verify your documents instantly and securely.",
      heroDesc:
        "Check registered documents quickly and securely using a document code or QR code.",
      verifyLabel: "DOCUMENT VERIFICATION",
      verifyTitle: "Document Verification",
      verifyDesc: "Enter the verification code shown on your certificate.",
      verifyButton: "Verify Document",
      enterCode: "⚠️ Enter document code",
      notFound: "❌ Document not found",
      validResult: "✅ Document verified",
      docName: "Document name",
      owner: "Company / Person",
      address: "Address",
      description: "Document description",
      date: "Date",
      status: "Status",
      valid: "Valid",
      expired: "Expired",
      cancelled: "Cancelled",
      qrTitle: "QR Verification Code",
      viewPdf: "View PDF",
      downloadPdf: "Download PDF",
      cert: "Certificate",
      verification: "Verification",
      secure: "Secure",
      uninterrupted: "24/7 Verification",
      secureInfra: "Secure Infrastructure",
      fastQuery: "Fast Verification",
      digitalCert: "Digital Certificate",
      trustedTitle: "Trusted Document Verification",
      trustedDesc:
        "WQE Digital Document verifies your organization’s documents in a secure digital environment.",
      verifiedDocs: "Verified Documents",
      registeredCompany: "Registered Organizations",
      access: "Access",
      docTypes: "Document Types",
      footer: "International Digital Document Verification System",
    },
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
      return;
    }

    const q = query(collection(db, "documents"), where("code", "==", searchCode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setResult(t[lang].notFound);
      setDocumentName("");
      setOwner("");
      setAddress("");
      setDescription("");
      setDate("");
      setRevizyontarihi("");
      setStatus("");
      setPdfUrl("");
      return;
    }

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
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5 flex justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-700/30">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="text-white">
                <path
                  d="M12 2L4 5.5V11C4 16.2 7.4 20.9 12 22C16.6 20.9 20 16.2 20 11V5.5L12 2Z"
                  fill="currentColor"
                  opacity="0.95"
                />
                <path
                  d="M9.5 12.2L11.2 13.9L15 9.8"
                  stroke="#0f172a"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <h1 className="text-lg md:text-2xl font-black text-blue-700">
                WQE Belge Dijital
              </h1>
              <p className="text-xs md:text-sm text-slate-500">
                {t[lang].subtitle}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#sorgula" className="hover:text-blue-700">
              {t[lang].query}
            </a>
            <a href="#nasil-calisir" className="hover:text-blue-700">
              {t[lang].how}
            </a>
            <a href="#ozellikler" className="hover:text-blue-700">
              {t[lang].features}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang("tr")}
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                lang === "tr" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              TR
            </button>

            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                lang === "en" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              EN
            </button>

            <a
              href="/Admin"
              className="bg-blue-700 text-white px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-blue-800 shadow-lg shadow-blue-700/20"
            >
              {t[lang].login}
            </a>
          </div>
        </div>
      </header>

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

            <div className="grid grid-cols-3 gap-4 max-w-xl">
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold">PDF</div>
                <div className="text-xs text-blue-100">{t[lang].cert}</div>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold">QR</div>
                <div className="text-xs text-blue-100">{t[lang].verification}</div>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold">SSL</div>
                <div className="text-xs text-blue-100">{t[lang].secure}</div>
              </div>
            </div>
          </div>

          <div
            id="sorgula"
            className="bg-white text-slate-900 rounded-[2rem] p-8 shadow-2xl border border-white/30"
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
              placeholder="Örn: WQA-002"
              className="w-full p-4 rounded-2xl bg-slate-100 border border-slate-200 outline-none mb-4 focus:border-blue-600"
            />

            <button
              onClick={() => verifyDocument()}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-2xl font-bold transition shadow-lg shadow-blue-700/20"
            >
              {t[lang].verifyButton}
            </button>

            {result && (
              <div className="mt-6 border border-slate-200 rounded-2xl p-5 bg-gradient-to-br from-white to-slate-100 shadow-inner">
                <div
                  className={`text-2xl font-black mb-4 ${
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
                    <div className="flex justify-between gap-4 border-b pb-2">
                      <span className="text-slate-500">{t[lang].docName}</span>
                      <strong className="text-right">{documentName}</strong>
                    </div>

                    <div className="flex justify-between gap-4 border-b pb-2">
                      <span className="text-slate-500">{t[lang].owner}</span>
                      <strong className="text-right">{owner}</strong>
                    </div>
{revizyontarihi && (
  <div className="flex justify-between gap-4 border-b pb-2">
    <span className="text-slate-500">
      {lang === "tr" ? "Revizyon tarihi" : "Revision date"}
    </span>
    <strong>{revizyontarihi}</strong>
  </div>
)}

                    {address && (
                      <div className="border-b pb-2">
                        <div className="text-slate-500 mb-1">
                          {t[lang].address}
                        </div>
                        <div className="font-semibold whitespace-pre-line">
                          {address}
                        </div>
                      </div>
                    )}

                    {description && (
                      <div className="border-b pb-2">
                        <div className="text-slate-500 mb-1">
                          {t[lang].description}
                        </div>
                        <div className="font-semibold whitespace-pre-line">
                          {description}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between gap-4 border-b pb-2">
                      <span className="text-slate-500">{t[lang].date}</span>
                      <strong>{date}</strong>
                    </div>

                    <div className="flex justify-between gap-4 items-center border-b pb-3">
                      <span className="text-slate-500">{t[lang].status}</span>
                      <strong
                        className={`px-3 py-1 rounded-full text-xs ${
                          status === "valid"
                            ? "bg-green-100 text-green-700"
                            : status === "expired"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {statusText(status)}
                      </strong>
                    </div>

                    {documentName && siteUrl && (
                      <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 text-center">
                        <div className="text-sm font-bold text-slate-600 mb-3">
                          {t[lang].qrTitle}
                        </div>

                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                            `${siteUrl}/?code=${code}`
                          )}`}
                          alt="Belge QR Kod"
                          className="mx-auto rounded-xl border p-2 bg-white"
                        />

                        <p className="text-xs text-slate-500 mt-3 break-all">
                          {`${siteUrl}/?code=${code}`}
                        </p>
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
            )}
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5 grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-black text-blue-700">24/7</div>
            <div className="text-slate-500 text-sm">{t[lang].uninterrupted}</div>
          </div>

          <div>
            <div className="text-3xl font-black text-blue-700">SSL</div>
            <div className="text-slate-500 text-sm">{t[lang].secureInfra}</div>
          </div>

          <div>
            <div className="text-3xl font-black text-blue-700">QR</div>
            <div className="text-slate-500 text-sm">{t[lang].fastQuery}</div>
          </div>

          <div>
            <div className="text-3xl font-black text-blue-700">PDF</div>
            <div className="text-slate-500 text-sm">{t[lang].digitalCert}</div>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f7fc] py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-4xl md:text-5xl font-semibold text-[#183c68] mb-5">
            {t[lang].trustedTitle}
          </h3>

          <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto mb-16 leading-relaxed">
            {t[lang].trustedDesc}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-20">
            {[
              ["10.000+", t[lang].verifiedDocs],
              ["500+", t[lang].registeredCompany],
              ["7/24", t[lang].access],
              ["%100", t[lang].secureInfra],
            ].map((item) => (
              <div
                key={item[0]}
                className="bg-white rounded-3xl p-8 shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-slate-200"
              >
                <div className="text-4xl md:text-5xl font-semibold tracking-widest text-[#183c68] mb-3">
                  {item[0]}
                </div>
                <div className="text-slate-500 text-lg">{item[1]}</div>
              </div>
            ))}
          </div>

          <h4 className="text-3xl font-semibold text-[#183c68] mb-9">
            {t[lang].docTypes}
          </h4>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {(lang === "tr"
              ? ["Çalışan Sertifikaları", "Eğitim Belgeleri", "Yetkinlik Belgeleri", "Katılım Sertifikaları"]
              : ["Employee Certificates", "Training Documents", "Competency Documents", "Participation Certificates"]
            ).map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl p-5 shadow-[0_6px_18px_rgba(15,23,42,0.08)] border border-slate-200 flex items-center gap-3 text-left text-slate-700 font-medium"
              >
                <span className="w-6 h-6 rounded-full border-2 border-[#183c68] text-[#183c68] flex items-center justify-center text-sm font-bold">
                  ✓
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="nasil-calisir" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h3 className="text-3xl md:text-4xl font-black text-slate-900">
            {t[lang].how}
          </h3>
          <p className="text-slate-500 mt-3">
            {lang === "tr"
              ? "Belge doğrulama işlemi üç basit adımda tamamlanır."
              : "Document verification is completed in three simple steps."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {(lang === "tr"
            ? [
                ["1", "Belge Kodunu Gir", "Sertifika üzerinde yer alan doğrulama kodunu sorgulama alanına yazın."],
                ["2", "Sistemde Kontrol Edilir", "Kod Firebase veritabanında anlık olarak kontrol edilir."],
                ["3", "Sonucu Görüntüle", "Belge durumu, firma bilgisi ve PDF sertifika bağlantısı ekrana gelir."],
              ]
            : [
                ["1", "Enter Document Code", "Enter the verification code shown on the certificate."],
                ["2", "System Checks It", "The code is checked instantly in the Firebase database."],
                ["3", "View Result", "Document status, company information and PDF certificate link are displayed."],
              ]
          ).map((item) => (
            <div
              key={item[0]}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xl mb-4">
                {item[0]}
              </div>
              <h4 className="text-xl font-black mb-2">{item[1]}</h4>
              <p className="text-slate-500">{item[2]}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="ozellikler" className="max-w-7xl mx-auto px-6 pb-16 grid md:grid-cols-3 gap-6">
        {(lang === "tr"
          ? [
              ["PDF Sertifika", "Online olan her belgenin PDF sertifikası indirilebilir ve doğrulama sonucunda görüntülenebilir."],
              ["QR Kod Desteği", "QR kod okutulduğunda belge otomatik olarak doğrulanır."],
              ["Kurumsal Güven", "Müşteriye güven veren profesyonel dijital doğrulama ekranı."],
            ]
          : [
              ["PDF Certificate", "The PDF certificate of each online document can be viewed and downloaded after verification."],
              ["QR Code Support", "When the QR code is scanned, the document is automatically verified."],
              ["Corporate Trust", "A professional digital verification screen that builds customer confidence."],
            ]
        ).map((item) => (
          <div
            key={item[0]}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <h4 className="text-xl font-black mb-2">{item[0]}</h4>
            <p className="text-slate-500">{item[1]}</p>
          </div>
        ))}
      </section>

      <footer className="bg-slate-950 text-slate-400 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-3 text-sm">
          <span>©️ 2002 WQE-Belge Dijital</span>
          <span>{t[lang].footer}</span>
        </div>
      </footer>
    </main>
  );
}