"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Home() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [owner, setOwner] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

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
      setDate("");
      setStatus("");
      setPdfUrl("");
      return;
    }

    const data: any = querySnapshot.docs[0].data();

    setResult("✅ Belge geçerli");
    setDocumentName(data.name || "");
    setOwner(data.owner || "");
    setDate(data.date || "");
    setStatus(data.status || "valid");
    setPdfUrl(data.pdfUrl || "");
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qrCode = params.get("code");

    if (qrCode) {
      setCode(qrCode);
      verifyDocument(qrCode);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f8ff] text-slate-900">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-blue-700">WQE Belge Dijital</h1>
            <p className="text-sm text-slate-500">Belge Doğrulama Sistemi</p>
          </div>

          <a
            href="/Admin"
            className="bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-800"
          >
            Admin Panel
          </a>
        </div>
      </header>

      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-slate-950 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#60a5fa,transparent_35%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm mb-6">
              Güvenli Dijital Doğrulama
            </div>

            <h2 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              Belgelerinizi anında doğrulayın.
            </h2>

            <p className="text-blue-100 text-lg mb-8 max-w-xl">
              Belge kodu veya QR kod ile sistemde kayıtlı belgelerin geçerliliğini hızlı,
              güvenli ve kurumsal şekilde kontrol edin.
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

          <div className="bg-white text-slate-900 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-3xl font-black mb-2">Belge Sorgula</h3>
            <p className="text-slate-500 mb-6">
              Belge üzerindeki doğrulama kodunu giriniz.
            </p>

            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Örn: WQE-002"
              className="w-full p-4 rounded-2xl bg-slate-100 border border-slate-200 outline-none mb-4 focus:border-blue-600"
            />

            <button
              onClick={() => verifyDocument()}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-2xl font-bold"
            >
              Belgeyi Doğrula
            </button>

            {result && (
              <div className="mt-6 border border-slate-200 rounded-2xl p-5 bg-slate-50">
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
                      <strong>{documentName}</strong>
                    </div>

                    <div className="flex justify-between gap-4 border-b pb-2">
                      <span className="text-slate-500">Firma / Kişi</span>
                      <strong>{owner}</strong>
                    </div>

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

      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h4 className="text-xl font-black mb-2">PDF Sertifika</h4>
          <p className="text-slate-500">
            Her belgeye PDF sertifika bağlanabilir ve doğrulama sonucunda görüntülenebilir.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h4 className="text-xl font-black mb-2">QR Kod Desteği</h4>
          <p className="text-slate-500">
            QR kod okutulduğunda belge otomatik olarak doğrulanır.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h4 className="text-xl font-black mb-2">Kurumsal Güven</h4>
          <p className="text-slate-500">
            Müşteriye güven veren profesyonel doğrulama ekranı.
          </p>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-6">
        <div className="max-w-7xl mx-auto px-6 flex justify-between text-sm">
          <span>© 2026 WQE Belge Dijital</span>
          <span>Belge Doğrulama Sistemi</span>
        </div>
      </footer>
    </main>
  );
}
