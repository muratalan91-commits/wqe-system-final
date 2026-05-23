"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { db } from "@/lib/firebase";

import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

export default function Home() {

  const searchParams = useSearchParams();

  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [documentName, setDocumentName] = useState("");

  const verifyDocument = async (customCode?: string) => {

    const searchCode = customCode || code;

    const q = query(
      collection(db, "documents"),
      where("code", "==", searchCode)
    );

    const querySnapshot = await getDocs(q);

    if(querySnapshot.empty){

      setResult("❌ Belge bulunamadı");
      setDocumentName("");

    } else {

      const data:any = querySnapshot.docs[0].data();

      setResult("✅ Geçerli belge");
      setDocumentName(data.name);

    }

  };

  useEffect(()=>{

    const qrCode = searchParams.get("code");

    if(qrCode){

      setCode(qrCode);

      verifyDocument(qrCode);

    }

  },[]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">

      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6">
          WQE Belge Doğrulama
        </h1>

        <input
          type="text"
          value={code}
          onChange={(e)=>setCode(e.target.value)}
          placeholder="Belge kodu"
          className="w-full p-4 rounded-xl bg-zinc-800"
        />

        <button
          onClick={()=>verifyDocument()}
          className="w-full mt-4 bg-blue-600 p-4 rounded-xl"
        >
          Doğrula
        </button>

        {result && (

          <div className="mt-6 bg-zinc-800 p-4 rounded-xl">

            <div className="text-2xl">
              {result}
            </div>

            {documentName && (
              <div className="mt-2 text-zinc-300">
                {documentName}
              </div>
            )}

          </div>

        )}

      </div>

    </main>
  );
}