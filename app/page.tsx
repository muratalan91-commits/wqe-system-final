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
    verifyTitle: "Belge Sorgula",
    verifyDesc:
      "Sertifikanızın ön yüzünde yer alan doğrulama kodunu giriniz.",
    verifyButton: "Belgeyi Doğrula",
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
  verifyTitle: "Document Verification",
  verifyDesc:
    "Enter the verification code shown on your certificate.",
  verifyButton: "Verify Document",
},
};

  const statusText = (value: string) => {
    if (value === "valid") return "Geçerli";
    if (value === "expired") return "Süresi Doldu";
    if (value === "cancelled") return "İptal Edildi";
    return value || "-";
  };

  const verifyDocument = async (customCode?: string) => {
    const searchCode = (customCode || code).trim();

    if (!searchCode) {
      setResult("⚠️ Belge kodu giriniz");
      return;
    }

    const q = query(collection(db, "documents"), where("code", "==", searchCode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setResult("❌ Belge bulunamadı");
      setDocumentName("");
      setOwner("");
      setAddress("");
      setDescription("");
      setDate("");
      setStatus("");
      setPdfUrl("");
      return;
    }

    const data: any = querySnapshot.docs[0].data();

    setResult("✅ Belge geçerli");
    setDocumentName(data.name || "");
    setOwner(data.owner || "");
    setAddress(data.address || "");
    setDescription(data.description || "");
    setDate(data.date || "");
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
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-700/30">
  <svg
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    className="text-white"
  >
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
              <h1 className="text-2xl font-black text-blue-700">
                WQE Belge Dijital
              </h1>
              <p className="text-sm text-slate-500">
                Dijital E-Belge Doğrulama Sistemi
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#sorgula" className="hover:text-blue-700">
              Sorgula
            </a>
            <a href="#nasil-calisir" className="hover:text-blue-700">
              Nasıl Çalışır?
            </a>
            <a href="#ozellikler" className="hover:text-blue-700">
              Özellikler
            </a>
          </div>
<div className="flex gap-2">
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
</div>

          <a
            href="/Admin"
            className="bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-800 shadow-lg shadow-blue-700/20"
          >
            GİRİŞ
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#021B4E] via-[#003B8F] to-[#020617] text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#60a5fa,transparent_35%)]" />
        <div className="absolute top-[-200px] right-[-200px] w-[520px] h-[520px] bg-cyan-400/20 blur-3xl rounded-full" />
        <div className="absolute bottom-[-220px] left-[-200px] w-[520px] h-[520px] bg-blue-500/20 blur-3xl rounded-full" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Güvenli Dijital Doğrulama
            </div>

            <h2 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              Belgelerinizi anında ve güvenli şekilde doğrulayın.
            </h2>

            <p className="text-blue-100 text-lg mb-8 max-w-xl">
              Belge kodu veya QR kod ile sistemde kayıtlı belgelerin geçerliliğini
              hızlı, güvenli ve kurumsal şekilde kontrol edin.
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-xl">
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold">PDF</div>
                <div className="text-xs text-blue-100">Sertifika</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold">QR</div>
                <div className="text-xs text-blue-100">Doğrulama</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold">SSL</div>
                <div className="text-xs text-blue-100">Güvenli</div>
              </div>
            </div>
          </div>

          <div
            id="sorgula"
            className="bg-white text-slate-900 rounded-[2rem] p-8 shadow-2xl border border-white/30"
          >
            <div className="mb-6">
              <div className="text-sm font-bold text-blue-700 mb-2">
                BELGE DOĞRULAMA
              </div>
              <h3 className="text-3xl font-black mb-2">Belge Sorgula</h3>
              <p className="text-slate-500">
                Sertifikanızın ön yüzünde yer alan doğrulama kodunu giriniz.
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
              Belgeyi Doğrula
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
                      <span className="text-slate-500">Belge adı</span>
                      <strong className="text-right">{documentName}</strong>
                    </div>

                    <div className="flex justify-between gap-4 border-b pb-2">
                      <span className="text-slate-500">Firma / Kişi</span>
                      <strong className="text-right">{owner}</strong>
                    </div>

                    {address && (
                      <div className="border-b pb-2">
                        <div className="text-slate-500 mb-1">Adres</div>
                        <div className="font-semibold whitespace-pre-line">
                          {address}
                        </div>
                      </div>
                    )}

                    {description && (
                      <div className="border-b pb-2">
                        <div className="text-slate-500 mb-1">
                          Belge açıklaması
                        </div>
                        <div className="font-semibold whitespace-pre-line">
                          {description}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between gap-4 border-b pb-2">
                      <span className="text-slate-500">Tarih</span>
                      <strong>{date}</strong>
                    </div>

                    <div className="flex justify-between gap-4 items-center border-b pb-3">
                      <span className="text-slate-500">Durum</span>
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
      QR Kod ile Doğrulama
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
                          PDF Görüntüle
                        </a>

                        <a
                          href={pdfUrl}
                          download
                          className="text-center bg-slate-900 text-white p-3 rounded-xl font-bold"
                        >
                          PDF İndir
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
            <div className="text-slate-500 text-sm">Kesintisiz Doğrulama</div>
          </div>
          <div>
            <div className="text-3xl font-black text-blue-700">SSL</div>
            <div className="text-slate-500 text-sm">Güvenli Altyapı</div>
          </div>
          <div>
            <div className="text-3xl font-black text-blue-700">QR</div>
            <div className="text-slate-500 text-sm">Hızlı Sorgulama</div>
          </div>
          <div>
            <div className="text-3xl font-black text-blue-700">PDF</div>
            <div className="text-slate-500 text-sm">Dijital Sertifika</div>
          </div>
        </div>
      </section>
<section className="bg-[#f3f7fc] py-20">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h3 className="text-4xl md:text-5xl font-semibold text-[#183c68] mb-5">
      Güvenilir Belge Doğrulama
    </h3>

    <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto mb-16 leading-relaxed">
      WQE Belge Dijital, kurumunuzun çıkardığı belgelerin güvenilirliğini dijital
      ortamda tescil eder.
    </p>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-20">
      {[
        ["10.000+", "Doğrulanan Belge"],
        ["500+", "Kayıtlı Kurum"],
        ["7/24", "Erişim İmkânı"],
        ["%100", "Güvenli Altyapı"],
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
      Belge Türleri
    </h4>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
      {[
        "Çalışan Sertifikaları",
        "Eğitim Belgeleri",
        "Yetkinlik Belgeleri",
        "Katılım Sertifikaları",
      ].map((item) => (
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
            Nasıl Çalışır?
          </h3>
          <p className="text-slate-500 mt-3">
            Belge doğrulama işlemi üç basit adımda tamamlanır.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            ["1", "Belge Kodunu Gir", "Sertifika üzerinde yer alan doğrulama kodunu sorgulama alanına yazın."],
            ["2", "Sistemde Kontrol Edilir", "Kod Firebase veritabanında anlık olarak kontrol edilir."],
            ["3", "Sonucu Görüntüle", "Belge durumu, firma bilgisi ve PDF sertifika bağlantısı ekrana gelir."],
          ].map((item) => (
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
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <h4 className="text-xl font-black mb-2">PDF Sertifika</h4>
          <p className="text-slate-500">
            Online olan her belgenin PDF sertifikası indirilebilir ve doğrulama sonucunda görüntülenebilir.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <h4 className="text-xl font-black mb-2">QR Kod Desteği</h4>
          <p className="text-slate-500">
            QR kod okutulduğunda belge otomatik olarak doğrulanır.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <h4 className="text-xl font-black mb-2">Kurumsal Güven</h4>
          <p className="text-slate-500">
            Müşteriye güven veren profesyonel dijital doğrulama ekranı.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="rounded-[2rem] bg-gradient-to-r from-blue-800 to-slate-950 text-white p-8 md:p-10 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
          <div>
            <h3 className="text-3xl font-black mb-2">
              Dijital doğrulama altyapınız hazır.
            </h3>
            <p className="text-blue-100">
              Belgelerinizi QR kod, PDF ve online doğrulama ile güvenli şekilde sunun.
            </p>
          </div>

          <a
            href="#sorgula"
            className="bg-white text-blue-800 px-6 py-3 rounded-full font-black"
          >
            Belge Sorgula
          </a>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-3 text-sm">
          <span>© 2002 WQE-Belge Dijital</span>
          <span>Uluslararası Dijital Belge Doğrulama Sistemi</span>
        </div>
      </footer>
    </main>
  );
}