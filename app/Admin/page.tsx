"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Home() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [documentName, setDocumentName] = useState("");

  const verifyDocument = async (customCode?: string) => {
    const searchCode = customCode || code;

    if (!searchCode) {
      setResult("Belge kodu giriniz");
      return;
    }

    const q = query(collection(db, "documents"), where("code", "==", searchCode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setResult("❌ Belge bulunamadı");
      setDocumentName("");
    } else {
      const data: any = querySnapshot.docs[0].data();
      setResult("✅ Belge geçerli");
      setDocumentName(data.name || "");
    }
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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
      <section className="max-w-6xl mx-auto px-6 py-10">
        <header className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-2xl font-bold">WQE Belge Sistemi</h1>
            <p className="text-slate-400 text-sm">Dijital belge doğrulama altyapısı</p>
          </div>

          <a
            href="/Admin"
            className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-sm hover:bg-white/20"
          >
            Admin Panel
          </a>
        </header>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-sm">
              Güvenli Belge Doğrulama
            </div>

            <h2 className="text-5xl font-bold leading-tight mb-6">
              Belgenizi saniyeler içinde doğrulayın.
            </h2>

            <p className="text-slate-300 text-lg mb-8">
              Belge kodunu girerek sistemde kayıtlı olup olmadığını anında kontrol edin.
              QR kod ile otomatik doğrulama desteği vardır.
            </p>

            <div className="grid grid-cols-3 gap-4 text-center">
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

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">Belge Doğrulama</h3>
            <p className="text-slate-400 mb-6">Belge kodunu aşağıya girin.</p>

            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Örn: WQE-002"
              className="w-full p-4 rounded-2xl bg-slate-950/70 border border-white/10 outline-none mb-4"
            />

            <button
              onClick={() => verifyDocument()}
              className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl font-semibold"
            >
              Belgeyi Doğrula
            </button>

            {result && (
              <div className="mt-6 bg-slate-950/70 border border-white/10 p-5 rounded-2xl">
                <div className="text-2xl font-bold">{result}</div>
                {documentName && (
                  <div className="mt-2 text-slate-300">
                    Belge adı: {documentName}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}