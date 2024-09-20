import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { onAuthStateChanged, signOut, signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebaseConfig";
import Image from "next/image";
import Button from "./ui/Button";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { FaUser } from "react-icons/fa";

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [userMenu, setUserMenu] = useState(false); // メニューの状態管理

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
            setShowModal(false); // モーダルを閉じる
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
                <Link href="/search" passHref>
                    <FiSearch className="text-[20px] text-slate-400" />
                </Link>
                {user ? (
                    <div className="relative">
                        <div
                            className="bg-[#007bff] ml-4 p-2 rounded-full cursor-pointer"
                            onClick={toggleUserMenu} // クリックでメニューを開く
                        >
                            <FaUser className="text-white" />
                        </div>

                        {/* ユーザーメニュー */}
                        {userMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-md z-50">
                                <ul className="py-2">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                        プロフィール
                                    </li>
                                    <li
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
                        <Button size="small" className="ml-4 hidden md:block" onClick={() => setShowModal(true)}>
                            新規登録
                        </Button>
                        <Button variant="secondary" size="small" className="ml-2" onClick={() => setShowModal(true)}>
                            ログイン
                        </Button>
                    </>
                )}
            </div>

            {/* モーダル */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md">
                        <h2 className="text-lg mb-4">Googleでログイン</h2>
                        <Button onClick={handleLogin}>Googleでログイン</Button>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            キャンセル
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}