"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { db } from "@/lib/firebase";

import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [editingId, setEditingId] = useState("");

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("valid");
  const [pdfName, setPdfName] = useState("");

  const [message, setMessage] = useState("");
  const [verifyLink, setVerifyLink] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [search, setSearch] = useState("");

const totalDocuments = documents.length;
const validDocuments = documents.filter((d) => d.status === "valid").length;
const expiredDocuments = documents.filter((d) => d.status === "expired").length;
const cancelledDocuments = documents.filter((d) => d.status === "cancelled").length;

const filteredDocuments = documents.filter((item) =>
  `${item.code} ${item.name} ${item.owner}`
    .toLowerCase()
    .includes(search.toLowerCase())
);

  const adminPassword = "428260428260murat";
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";

  const makePdfUrl = () => {
    const cleanPdfName = pdfName.trim();
    return cleanPdfName ? `${window.location.origin}/pdf/${cleanPdfName}` : "";
  };

  const clearForm = () => {
    setEditingId("");
    setCode("");
    setName("");
    setOwner("");
    setAddress("");
    setDescription("");
    setDate("");
    setStatus("valid");
    setPdfName("");
  };

  const loadDocuments = async () => {
    const querySnapshot = await getDocs(collection(db, "documents"));
    const docs: any[] = [];

    querySnapshot.forEach((item) => {
      docs.push({ id: item.id, ...item.data() });
    });

    setDocuments(docs);
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const addDocument = async () => {
    if (!code || !name || !owner || !date) {
      setMessage("❌ Belge kodu, belge adı, firma/kişi ve tarih zorunlu");
      return;
    }

    const pdfUrl = makePdfUrl();

    await addDoc(collection(db, "documents"), {
      code,
      name,
      owner,
      address,
      description,
      date,
      status,
      pdfUrl,
      createdAt: new Date(),
    });

    setVerifyLink(`${window.location.origin}/?code=${code}`);
    setMessage("✅ Belge başarıyla eklendi");

    clearForm();
    loadDocuments();
  };

  const updateDocument = async () => {
    if (!editingId) {
      setMessage("❌ Güncellenecek belge seçilmedi");
      return;
    }

    if (!code || !name || !owner || !date) {
      setMessage("❌ Belge kodu, belge adı, firma/kişi ve tarih zorunlu");
      return;
    }

    const pdfUrl = makePdfUrl();

    await updateDoc(doc(db, "documents", editingId), {
      code,
      name,
      owner,
      address,
      description,
      date,
      status,
      pdfUrl,
      updatedAt: new Date(),
    });

    setVerifyLink(`${window.location.origin}/?code=${code}`);
    setMessage("✅ Belge başarıyla güncellendi");

    clearForm();
    loadDocuments();
  };

  const startEdit = (item: any) => {
    setEditingId(item.id || "");
    setCode(item.code || "");
    setName(item.name || "");
    setOwner(item.owner || "");
    setAddress(item.address || "");
    setDescription(item.description || "");
    setDate(item.date || "");
    setStatus(item.status || "valid");

    const pdfFileName = item.pdfUrl ? item.pdfUrl.split("/pdf/")[1] || "" : "";
    setPdfName(pdfFileName);

    setMessage("✏️ Düzenleme modu açıldı");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteDocument = async (id: string) => {
    await deleteDoc(doc(db, "documents", id));
    setMessage("🗑️ Belge silindi");
    loadDocuments();
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="bg-slate-900 p-8 rounded-3xl w-full max-w-md border border-white/10">
          <h1 className="text-3xl font-black mb-6">Admin Giriş</h1>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            className="w-full p-4 rounded-xl bg-slate-800 mb-4 outline-none"
          />

          <button
            onClick={() => {
              if (password === adminPassword) {
                setIsLoggedIn(true);
              } else {
                setMessage("❌ Şifre yanlış");
              }
            }}
            className="w-full bg-blue-700 p-4 rounded-xl font-bold"
          >
            Giriş Yap
          </button>

          {message && <div className="mt-4">{message}</div>}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black">WQE Admin Panel</h1>
          <p className="text-slate-400 mt-2">
            Belge ekle, düzenle, açıklama/adres gir, PDF dosya adı yaz ve QR doğrulama oluştur.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  <div className="bg-slate-900 p-5 rounded-3xl border border-white/10">
    <div className="text-slate-400 text-sm">Toplam Belge</div>
    <div className="text-3xl font-black mt-2">{totalDocuments}</div>
  </div>

  <div className="bg-green-500/10 p-5 rounded-3xl border border-green-500/20">
    <div className="text-green-300 text-sm">Geçerli</div>
    <div className="text-3xl font-black mt-2">{validDocuments}</div>
  </div>

  <div className="bg-yellow-500/10 p-5 rounded-3xl border border-yellow-500/20">
    <div className="text-yellow-300 text-sm">Süresi Dolan</div>
    <div className="text-3xl font-black mt-2">{expiredDocuments}</div>
  </div>

  <div className="bg-red-500/10 p-5 rounded-3xl border border-red-500/20">
    <div className="text-red-300 text-sm">İptal Edilen</div>
    <div className="text-3xl font-black mt-2">{cancelledDocuments}</div>
  </div>
</div>

<div className="bg-slate-900 p-5 rounded-3xl mb-8 border border-white/10">
  <h2 className="text-2xl font-black mb-3">Kurumsal Dashboard</h2>

  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Belge kodu, ad veya firma ara..."
    className="w-full p-4 rounded-xl bg-slate-800 outline-none border border-white/10"
  />
</div>

        <div className="bg-slate-900 p-6 rounded-3xl mb-8 border border-white/10">
          {editingId && (
            <div className="mb-4 p-4 rounded-xl bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">
              ✏️ Düzenleme modundasın. Kaydı güncellemek için “Belge Güncelle” butonuna bas.
            </div>
          )}

          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Belge kodu"
            className="w-full p-4 rounded-xl bg-slate-800 mb-4 outline-none"
          />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Belge adı"
            className="w-full p-4 rounded-xl bg-slate-800 mb-4 outline-none"
          />

          <input
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="Firma / Kişi adı"
            className="w-full p-4 rounded-xl bg-slate-800 mb-4 outline-none"
          />

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Adres"
            className="w-full p-4 rounded-xl bg-slate-800 mb-4 outline-none min-h-[90px]"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Belge açıklaması"
            className="w-full p-4 rounded-xl bg-slate-800 mb-4 outline-none min-h-[120px]"
          />

          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Tarih"
            className="w-full p-4 rounded-xl bg-slate-800 mb-4 outline-none"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-800 mb-4 outline-none"
          >
            <option value="valid">Geçerli</option>
            <option value="expired">Süresi Doldu</option>
            <option value="cancelled">İptal Edildi</option>
          </select>

          <div className="mb-4">
            <label className="block mb-2 text-sm text-slate-300">
              PDF Dosya Adı
            </label>

            <input
              type="text"
              value={pdfName}
              onChange={(e) => setPdfName(e.target.value)}
              placeholder="Örn: WATERSEAGOLDSEAL.pdf"
              className="w-full p-4 rounded-xl bg-slate-800 outline-none"
            />

            <div className="mt-2 text-xs text-slate-400">
              PDF dosyasını proje içinde public/pdf klasörüne koyun. Buraya sadece dosya adını yazın.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {editingId ? (
              <>
                <button
                  onClick={updateDocument}
                  className="bg-green-700 hover:bg-green-800 px-6 py-4 rounded-xl font-bold"
                >
                  Belge Güncelle
                </button>

                <button
                  onClick={() => {
                    clearForm();
                    setMessage("Düzenleme iptal edildi");
                  }}
                  className="bg-slate-700 hover:bg-slate-600 px-6 py-4 rounded-xl font-bold"
                >
                  İptal Et
                </button>
              </>
            ) : (
              <button
                onClick={addDocument}
                className="bg-blue-700 hover:bg-blue-800 px-6 py-4 rounded-xl font-bold"
              >
                Belge Ekle
              </button>
            )}
          </div>

          {message && <div className="mt-4">{message}</div>}

          {verifyLink && (
            <div className="mt-4 p-4 bg-slate-800 rounded-xl break-all text-sm text-blue-300">
              {verifyLink}
            </div>
          )}
        </div>

        <div className="space-y-4">
{filteredDocuments.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/10"
            >
              <div>
                <div className="text-xl font-black">{item.code}</div>
                <div>{item.name}</div>
                <div className="text-slate-400">{item.owner}</div>

                {item.address && (
                  <div className="text-slate-500 text-sm mt-1 whitespace-pre-line">
                    {item.address}
                  </div>
                )}

                {item.description && (
                  <div className="text-slate-300 text-sm mt-2 whitespace-pre-line">
                    {item.description}
                  </div>
                )}

                <div className="text-slate-400 mt-2">{item.date}</div>

                {item.pdfUrl && (
                  <a
                    href={item.pdfUrl}
                    target="_blank"
                    className="inline-block mt-3 text-blue-300 underline"
                  >
                    PDF Sertifikayı Aç
                  </a>
                )}
              </div>

              <div className="bg-white p-2 rounded-xl w-fit">
                <QRCodeCanvas value={`${siteUrl}/?code=${item.code}`} size={90} />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(item)}
                  className="bg-yellow-600 px-4 py-2 rounded-xl"
                >
                  Düzenle
                </button>

                <button
                  onClick={() => {
                    if (confirm("Bu belge silinsin mi?")) {
                      deleteDocument(item.id);
                    }
                  }}
                  className="bg-red-600 px-4 py-2 rounded-xl"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}