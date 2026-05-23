"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);

  const adminPassword = "428260428260murat";
  const siteUrl = "https://wqe-system.vercel.app";

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
      setMessage("Tüm alanları doldur");
      return;
    }

    await addDoc(collection(db, "documents"), {
      code,
      name,
      owner,
      date,
      status: "valid",
      createdAt: new Date()
    });

    setMessage("✅ Belge eklendi");
    setCode("");
    setName("");
    setOwner("");
    setDate("");
    loadDocuments();
  };

  const deleteDocument = async (id: string) => {
    await deleteDoc(doc(db, "documents", id));
    setMessage("🗑️ Belge silindi");
    loadDocuments();
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6">Admin Giriş</h1>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            className="w-full p-4 rounded-xl bg-zinc-800 mb-4 outline-none"
          />

          <button
            onClick={() => {
              if (password === adminPassword) {
                setIsLoggedIn(true);
              } else {
                setMessage("❌ Şifre yanlış");
              }
            }}
            className="w-full bg-blue-600 p-4 rounded-xl"
          >
            Giriş Yap
          </button>

          {message && <div className="mt-4">{message}</div>}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Admin Panel</h1>

        <div className="bg-zinc-900 p-6 rounded-2xl mb-10">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Belge kodu"
            className="w-full p-4 rounded-xl bg-zinc-800 mb-4 outline-none"
          />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Belge adı"
            className="w-full p-4 rounded-xl bg-zinc-800 mb-4 outline-none"
          />

          <input
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="Firma / Kişi adı"
            className="w-full p-4 rounded-xl bg-zinc-800 mb-4 outline-none"
          />

          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Tarih: 23.05.2026"
            className="w-full p-4 rounded-xl bg-zinc-800 mb-4 outline-none"
          />

          <button
            onClick={addDocument}
            className="bg-blue-600 px-6 py-4 rounded-xl"
          >
            Belge Ekle
          </button>

          {message && <div className="mt-4">{message}</div>}
        </div>

        <div className="space-y-4">
          {documents.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 p-4 rounded-xl flex items-center justify-between gap-4"
            >
              <div>
                <div className="text-xl font-bold">{item.code}</div>
                <div>{item.name}</div>
                <div>{item.owner}</div>
                <div>{item.date}</div>
              </div>

              <div className="bg-white p-2 rounded-xl">
                <QRCodeCanvas
                  value={`${siteUrl}/?code=${item.code}`}
                  size={90}
                />
              </div>

              <button
                onClick={() => deleteDocument(item.id)}
                className="bg-red-600 px-4 py-2 rounded-xl"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}