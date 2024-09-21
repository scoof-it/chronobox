import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { onAuthStateChanged, signOut, signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Button from "./ui/Button";
import Link from "next/link";
import { FaGoogle, FaUser } from "react-icons/fa";
import { FiX } from "react-icons/fi";

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState("");
    const [iconUrl, setIconUrl] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [userMenu, setUserMenu] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUsername(userData.username || "ゲスト");
                    setIconUrl(userData.iconUrl || "");
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
            setShowModal(false);
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const toggleUserMenu = () => {
        setUserMenu(!userMenu);
    };

    return (
        <div className="bg-white flex items-center p-4 border-b">
            <Link href="/" className="w-36">
                <Image src="/logotype.svg" alt="ChronoBox" width={100} height={100} className="w-full" />
            </Link>
            <div className="ml-auto flex items-center">
                {user ? (
                    <div className="relative">
                        <div className="flex items-center space-x-2">
                            {iconUrl ? (
                                <img
                                    src={iconUrl}
                                    alt="User Icon"
                                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                                    onClick={toggleUserMenu}
                                />
                            ) : (
                                <FaUser className="text-white cursor-pointer bg-[#007bff]" onClick={toggleUserMenu} />
                            )}
                        </div>

                        {/* ユーザーメニュー */}
                        {userMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-md z-50">
                                <ul className="py-2">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b">
                                        {username}
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                        ダッシュボード
                                    </li>
                                    <Link href="/settings" passHref>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b">
                                            設定
                                        </li>
                                    </Link>
                                    <li
                                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => signOut(auth)}
                                    >
                                        ログアウト
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Button size="small" onClick={() => setShowModal(true)}>
                            ログイン
                        </Button>
                    </>
                )}
            </div>

            {/* モーダル */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="w-80 bg-white p-6 rounded shadow">
                        <div className="flex items-center mb-6">
                            <h2 className="text-[20px] font-bold">Googleでログイン</h2>
                            <FiX className="ml-auto text-[20px] opacity-50 cursor-pointer" onClick={() => setShowModal(false)} />
                        </div>
                        <p className="mb-4">ChronoBoxで、学生生活をもっとスムーズに。スケジュール管理を簡単サポートするWebサービスです。</p>
                        <Button onClick={handleLogin} className="w-full" variant="secondary" leftIcon={<FaGoogle />}>
                            Googleでログイン
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}