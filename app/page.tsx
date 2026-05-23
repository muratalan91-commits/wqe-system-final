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

  const getStatusText = (value: string) => {
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

    const q = query(
      collection(db, "documents"),
      where("code", "==", searchCode)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setResult("❌ Belge bulunamadı");
      setDocumentName("");
      setOwner("");
      setDate("");
      setStatus("");
      return;
    }

    const data: any = querySnapshot.docs[0].data();

    setResult("✅ Belge geçerli");
    setDocumentName(data.name || "");
    setOwner(data.owner || "");
    setDate(data.date || "");
    setStatus(data.status || "valid");
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
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-black" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute top-60 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <header className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-20">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">WQE Belge Sistemi</h1>
              <p className="text-slate-400 text-sm">Dijital belge doğrulama altyapısı</p>
            </div>

            <a
              href="/Admin"
              className="bg-white/10 border border-white/15 px-5 py-2 rounded-full text-sm hover:bg-white/20 transition"
            >
              Admin Panel
            </a>
          </header>

          <div className="grid lg:grid-cols-2 gap-12 items-center pb-20">
            <div>
              <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-blue-500/15 border border-blue-400/25 text-blue-200 text-sm">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Güvenli ve hızlı belge doğrulama
              </div>

              <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Belgenizi saniyeler içinde doğrulayın.
              </h2>

              <p className="text-slate-300 text-lg md:text-xl mb-8 max-w-xl">
                Belge kodunu girerek veya QR kodu okutarak sistemde kayıtlı olup
                olmadığını anında kontrol edin.
              </p>

              <div className="grid grid-cols-3 gap-3 max-w-xl">
                <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-bold">QR</div>
                  <div className="text-xs text-slate-400">Destekli</div>
                </div>
                <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-xs text-slate-400">Erişim</div>
                </div>
                <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-bold">SSL</div>
                  <div className="text-xs text-slate-400">Güvenli</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="mb-6">
                <h3 className="text-2xl font-bold">Belge Doğrulama</h3>
                <p className="text-slate-400 mt-1">Belge kodunu aşağıya girin.</p>
              </div>

              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Örn: WQE-002"
                className="w-full p-4 rounded-2xl bg-slate-950/70 border border-white/10 outline-none mb-4 focus:border-blue-400"
              />

              <button
                onClick={() => verifyDocument()}
                className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl font-semibold transition"
              >
                Belgeyi Doğrula
              </button>

              {result && (
                <div className="mt-6 bg-slate-950/70 border border-white/10 p-5 rounded-2xl">
                  <div
                    className={`text-2xl font-bold mb-4 ${
                      result.includes("✅")
                        ? "text-green-400"
                        : result.includes("❌")
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {result}
                  </div>

                  {documentName && (
                    <div className="space-y-3 text-slate-300">
                      <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                        <span>Belge adı</span>
                        <strong className="text-right text-white">{documentName}</strong>
                      </div>

                      <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                        <span>Firma / Kişi</span>
                        <strong className="text-right text-white">{owner}</strong>
                      </div>

                      <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                        <span>Tarih</span>
                        <strong className="text-right text-white">{date}</strong>
                      </div>

                      <div className="flex justify-between gap-4 items-center">
                        <span>Durum</span>
                        <strong
                          className={`px-3 py-1 rounded-full text-sm ${
                            status === "valid"
                              ? "bg-green-500/20 text-green-300"
                              : status === "expired"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {getStatusText(status)}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h4 className="font-bold mb-2">Anlık Kontrol</h4>
              <p className="text-slate-400 text-sm">
                Belgeler Firebase veritabanından anında sorgulanır.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h4 className="font-bold mb-2">QR Doğrulama</h4>
              <p className="text-slate-400 text-sm">
                QR okutulduğunda belge kodu otomatik olarak doğrulanır.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h4 className="font-bold mb-2">Kurumsal Altyapı</h4>
              <p className="text-slate-400 text-sm">
                Vercel ve Firebase ile hızlı, güvenli ve ölçeklenebilir sistem.
              </p>
            </div>
          </div>

          <footer className="border-t border-white/10 py-6 text-sm text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
            <span>© 2026 WQE Belge Sistemi</span>
            <span>Dijital doğrulama altyapısı</span>
          </footer>
        </div>
      </section>
    </main>
  );
}