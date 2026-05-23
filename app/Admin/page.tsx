"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { db, storage } from "@/lib/firebase";

import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("valid");

  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [verifyLink, setVerifyLink] = useState("");

  const [documents, setDocuments] = useState<any[]>([]);

  const adminPassword = "428260428260murat";

  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "";

  const loadDocuments = async () => {
    const querySnapshot = await getDocs(
      collection(db, "documents")
    );

    const docs: any[] = [];

    querySnapshot.forEach((item) => {
      docs.push({
        id: item.id,
        ...item.data()
      });
    });

    setDocuments(docs);
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const addDocument = async () => {
    try {
      if (!code || !name || !owner || !date) {
        setMessage("❌ Tüm alanları doldur");
        return;
      }

      setMessage("⏳ Belge yükleniyor...");

      let pdfUrl = "";

      if (pdfFile) {
        const storageRef = ref(
          storage,
          `certificates/${code}-${pdfFile.name}`
        );

        await uploadBytes(storageRef, pdfFile);

        pdfUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "documents"), {
        code,
        name,
        owner,
        date,
        status,
        pdfUrl,
        createdAt: new Date()
      });

      setVerifyLink(
        `${window.location.origin}/?code=${code}`
      );

      setMessage("✅ Belge başarıyla eklendi");

      setCode("");
      setName("");
      setOwner("");
      setDate("");
      setStatus("valid");
      setPdfFile(null);

      loadDocuments();
    } catch (error) {
      console.error(error);
      setMessage("❌ PDF yükleme hatası oluştu");
    }
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
          <h1 className="text-3xl font-black mb-6">
            Admin Giriş
          </h1>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
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

          {message && (
            <div className="mt-4">{message}</div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black">
            WQE Admin Panel
          </h1>

          <p className="text-slate-400 mt-2">
            Belge ekle, PDF yükle ve QR doğrulama
            oluştur.
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl mb-6 border border-white/10">
          Toplam belge sayısı:{" "}
          <strong>{documents.length}</strong>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl mb-8 border border-white/10">
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
            onChange={(e) =>
              setOwner(e.target.value)
            }
            placeholder="Firma / Kişi adı"
            className="w-full p-4 rounded-xl bg-slate-800 mb-4 outline-none"
          />

          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Tarih"
            className="w-full p-4 rounded-xl bg-slate-800 mb-4 outline-none"
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-slate-800 mb-4 outline-none"
          >
            <option value="valid">Geçerli</option>

            <option value="expired">
              Süresi Doldu
            </option>

            <option value="cancelled">
              İptal Edildi
            </option>
          </select>

          <div className="mb-4">
            <label className="block mb-2 text-sm text-slate-300">
              PDF Sertifika Yükle
            </label>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setPdfFile(e.target.files[0]);
                }
              }}
              className="w-full p-4 rounded-xl bg-slate-800 outline-none"
            />

            {pdfFile && (
              <div className="mt-2 text-green-400 text-sm">
                ✅ Seçilen PDF: {pdfFile.name}
              </div>
            )}
          </div>

          <button
            onClick={addDocument}
            className="bg-blue-700 hover:bg-blue-800 px-6 py-4 rounded-xl font-bold"
          >
            Belge Ekle
          </button>

          {message && (
            <div className="mt-4">{message}</div>
          )}

          {verifyLink && (
            <div className="mt-4 p-4 bg-slate-800 rounded-xl break-all text-sm text-blue-300">
              {verifyLink}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {documents.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/10"
            >
              <div>
                <div className="text-xl font-black">
                  {item.code}
                </div>

                <div>{item.name}</div>

                <div className="text-slate-400">
                  {item.owner}
                </div>

                <div className="text-slate-400">
                  {item.date}
                </div>

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
                <QRCodeCanvas
                  value={`${siteUrl}/?code=${item.code}`}
                  size={90}
                />
              </div>

              <button
                onClick={() => {
                  if (
                    confirm(
                      "Bu belge silinsin mi?"
                    )
                  ) {
                    deleteDocument(item.id);
                  }
                }}
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