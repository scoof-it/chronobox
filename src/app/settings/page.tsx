"use client";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "@/lib/firebaseConfig"; // Import storage
import { User } from "firebase/auth"; // Import User type from Firebase Auth
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"; // For image uploading
import Button from "@/components/ui/Button";
import Header from "@/components/Header";
import Input from "@/components/ui/Input";

export default function Settings() {
    const [username, setUsername] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconUrl, setIconUrl] = useState<string>("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUsername(userData.username || "");
                    setIconUrl(userData.iconUrl || "");
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        if (user) {
            const userRef = doc(db, "users", user.uid);
            // 明示的にiconUrlも含めた型を定義する
            let updatedData: { username: string; iconUrl?: string } = { username };

            if (iconFile) {
                const iconRef = ref(storage, `icons/${user.uid}`);
                const uploadTask = uploadBytesResumable(iconRef, iconFile);
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                updatedData = { ...updatedData, iconUrl: downloadURL };
                setIconUrl(downloadURL);
            }

            await setDoc(userRef, updatedData, { merge: true });
            alert("プロフィールが更新されました！");
        }
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIconFile(e.target.files[0]);
        }
    };

    return (
        <div>
            <Header />
            <div className="mt-10 md:container mx-5 md:mx-auto">
                <h2 className="text-2xl font-bold mb-5">アカウント設定</h2>
                <div className="mb-5">
                    <label className="block text-sm mb-1.5">アイコン画像</label>
                    <input type="file" onChange={handleIconChange} />
                    {iconUrl && (
                        <div className="mt-4">
                            <img src={iconUrl} alt="User Icon" className="w-20 h-20 rounded-full object-cover" />
                        </div>
                    )}
                </div>
                <div className="mb-5">
                    <label htmlFor="username" className="block text-sm mb-1.5">アカウント名</label>
                    <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <Button onClick={handleSave} variant="primary">保存</Button>
            </div>
        </div>
    );
}