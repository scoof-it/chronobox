"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // useRouterをインポート
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db, storage } from "@/lib/firebaseConfig";
import { User, deleteUser, reauthenticateWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from "firebase/storage";
import { FirebaseError } from "firebase/app";
import Button from "@/components/ui/Button";
import Header from "@/components/Header";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

export default function Settings() {
    const [username, setUsername] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconUrl, setIconUrl] = useState<string>("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const router = useRouter(); // useRouterフックを初期化

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

    const handleIconDelete = async () => {
        if (user && iconUrl) {
            try {
                const iconRef = ref(storage, `icons/${user.uid}`);
                await deleteObject(iconRef); // Firebase Storageから削除
                await updateDoc(doc(db, "users", user.uid), { iconUrl: "" }); // FirestoreでiconUrlをクリア
                setIconUrl(""); // 状態を更新
                alert("アイコンが削除されました！");
            } catch (error) {
                console.error("アイコンの削除に失敗しました", error);
                alert("アイコンの削除に失敗しました。");
            }
        }
    };

    const handleDeleteAccount = async () => {
        if (user) {
            try {
                // Google認証を使用して再認証
                const provider = new GoogleAuthProvider();
                await reauthenticateWithPopup(user, provider);

                // 再認証成功後にアカウント削除処理を実行
                await deleteDoc(doc(db, "users", user.uid)); // Firestoreのユーザーデータを削除
                await deleteUser(user); // Firebase Authenticationからユーザー削除

                alert("アカウントが削除されました！");
                
                // アカウント削除後にトップページへリダイレクト
                router.push("/"); 
            } catch (error) {
                if (error instanceof FirebaseError) {
                    console.error("アカウントの削除に失敗しました", error);
                    if (error.code === "auth/requires-recent-login") {
                        alert("セキュリティのために再ログインが必要です。もう一度ログインしてください。");
                    } else {
                        alert("アカウントの削除に失敗しました。");
                    }
                } else {
                    console.error("予期しないエラーが発生しました", error);
                    alert("予期しないエラーが発生しました。");
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
                <div className="mb-5">
                    <label className="block text-sm">アイコン画像</label>
                    {iconUrl && (
                        <div className="flex items-center">
                            <div className="mt-2.5 border rounded-full overflow-hidden w-fit mr-2.5">
                                <img src={iconUrl} alt="User Icon" className="w-20 h-20" />
                            </div>
                            <div >
                                <Button onClick={handleIconDelete} variant="danger" size="small">
                                    アイコンを削除
                                </Button>
                            </div>
                        </div>
                    )}
                    <input type="file" onChange={handleIconChange} className="border bg-white w-full rounded-md px-4 py-3 mt-2.5" />
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
                confirmText="削除する"
                cancelText="キャンセル"
                confirmVariant="danger"
                onConfirm={handleDeleteAccount}
                onCancel={closeDeleteModal}
                isVisible={showDeleteModal}
            />
        </div>
    );
}