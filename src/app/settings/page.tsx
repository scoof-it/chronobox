"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db, storage } from "@/lib/firebaseConfig";
import { User, deleteUser, reauthenticateWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from "firebase/storage";
import { FirebaseError } from "firebase/app";
import Button from "@/components/ui/Button";
import Header from "@/components/Header";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Footer from "@/components/Footer";
import AlertMessage from "@/components/ui/AlertMessage";

export default function Settings() {
    const [username, setUsername] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconUrl, setIconUrl] = useState<string>("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const router = useRouter();

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
            let updatedData: { username: string; iconUrl?: string } = { username };

            if (iconFile) {
                if (iconUrl) {
                    try {
                        const existingIconRef = ref(storage, `icons/${user.uid}`);
                        await deleteObject(existingIconRef);
                    } catch (e) {
                        if (e instanceof FirebaseError && e.code !== "storage/object-not-found") {
                            console.error("Failed to delete existing icon:", e);
                            setAlertMessage({ message: "古いアイコンの削除に失敗しました", type: "error" });
                            return;
                        }
                    }
                }

                try {
                    const iconRef = ref(storage, `icons/${user.uid}`);
                    const uploadTask = uploadBytesResumable(iconRef, iconFile);

                    await new Promise<void>((resolve, reject) => {
                        uploadTask.on(
                            "state_changed",
                            () => {},
                            (error) => reject(error),
                            () => resolve()
                        );
                    });

                    const downloadURL = await getDownloadURL(iconRef);
                    updatedData = { ...updatedData, iconUrl: downloadURL };
                    setIconUrl(downloadURL);
                } catch (e) {
                    console.error("Failed to upload icon:", e);
                    setAlertMessage({ message: "アイコンのアップロードに失敗しました。もう一度試してください。", type: "error" });
                    return;
                }
            }

            try {
                await setDoc(userRef, updatedData, { merge: true });
                setAlertMessage({ message: "プロフィールが更新されました", type: "success" });
            } catch (e) {
                console.error("Failed to update profile:", e);
                setAlertMessage({ message: "プロフィールの更新に失敗しました", type: "error" });
            }
        }
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIconFile(e.target.files[0]);
        }
    };

    const handleIconDelete = async () => {
        if (user && iconUrl) {
            try {
                const iconRef = ref(storage, `icons/${user.uid}`);
                await deleteObject(iconRef);
                await updateDoc(doc(db, "users", user.uid), { iconUrl: "" });
                setIconUrl("");
                setAlertMessage({ message: "アイコンが削除されました！", type: "success" });
            } catch (e) {
                console.error("Failed to delete icon:", e);
                setAlertMessage({ message: "アイコンの削除に失敗しました。", type: "error" });
            }
        }
    };

    const handleDeleteAccount = async () => {
        if (user) {
            try {
                const provider = new GoogleAuthProvider();
                await reauthenticateWithPopup(user, provider);

                await deleteDoc(doc(db, "users", user.uid));
                await deleteUser(user);

                setAlertMessage({ message: "アカウントが削除されました", type: "success" });
                router.push("/");
            } catch (e) {
                if (e instanceof FirebaseError && e.code === "auth/requires-recent-login") {
                    setAlertMessage({ message: "セキュリティのために再ログインが必要です", type: "error" });
                } else {
                    console.error("Failed to delete account:", e);
                    setAlertMessage({ message: "アカウントの削除に失敗しました", type: "error" });
                }
            }
        }
    };

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    return (
        <div>
            <Header />
            <div className="mt-10 md:container mx-5 md:mx-auto">
                <h2 className="text-2xl font-bold mb-5">プロフィール</h2>
                {alertMessage && (
                    <AlertMessage
                        message={alertMessage.message}
                        type={alertMessage.type}
                        onClose={() => setAlertMessage(null)}
                    />
                )}
                <div className="mb-5">
                    <label className="block text-sm">アイコン画像</label>
                    {iconUrl && (
                        <div className="flex items-center">
                            <div className="mt-2.5 border rounded-full overflow-hidden w-fit mr-2.5">
                                <img src={iconUrl} alt="User Icon" className="w-20 h-20" />
                            </div>
                            <div>
                                <Button onClick={handleIconDelete} variant="danger" size="small">
                                    アイコンを削除
                                </Button>
                            </div>
                        </div>
                    )}
                    <Input type="file" onChange={handleIconChange} className="mt-2.5" />
                </div>
                <div className="mb-5">
                    <label htmlFor="username" className="block text-sm mb-1.5">表示名</label>
                    <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <Button onClick={handleSave} variant="primary">保存</Button>
                <hr className="my-10" />
                <h2 className="text-2xl font-bold mb-5">アカウント設定</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div className="bg-white border rounded-md h-40 p-4 space-y-2">
                        <h3 className="font-bold text-lg">アカウントを削除</h3>
                        <p className="text-sm">アカウント削除後、全データが消去され復元できません。</p>
                        <Button variant="danger" size="small" onClick={openDeleteModal}>
                            アカウントを削除
                        </Button>
                    </div>
                </div>
            </div>

            <Modal
                title="アカウントを削除しますか？"
                description="アカウントを削除すると、すべてのデータが失われます。この操作は取り消せません。"
                onClose={closeDeleteModal}
                isVisible={showDeleteModal}
                footer={
                    <>
                        <Button variant="danger" onClick={handleDeleteAccount}>削除する</Button>
                    </>
                }
            />
            <Footer />
        </div>
    );
}