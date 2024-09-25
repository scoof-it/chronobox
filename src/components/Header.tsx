import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { onAuthStateChanged, signOut, signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Button from "./ui/Button";
import Link from "next/link";
import Modal from "./ui/Modal";
import { FaGoogle } from "react-icons/fa";
import { FiGrid, FiLogOut, FiSettings, FiTool, FiUser } from "react-icons/fi";

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
                                <div onClick={toggleUserMenu} className="cursor-pointer w-[36px] h-[36px] border rounded-full overflow-hidden">
                                    <img
                                        src={iconUrl}
                                        alt="User Icon"
                                        className="w-full"
                                    />
                                </div>
                            ) : (
                                <div onClick={toggleUserMenu} className="cursor-pointer w-[36px] h-[36px] border rounded-full overflow-hidden">
                                    <img
                                        src={`https://api.dicebear.com/9.x/rings/svg?seed=${username}`}
                                        alt="avatar"
                                        className="w-full"
                                    />
                                </div>       
                            )}
                        </div>

                        {/* ユーザーメニュー */}
                        {userMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-md z-50">
                                <ul className="py-2">
                                    <Link href="#" passHref>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                                            <FiUser className="opacity-40 mr-2" />
                                            {username}
                                        </li>
                                    </Link>
                                    <hr className="my-2" />
                                    <Link href="/dashboard" passHref>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                                            <FiGrid className="opacity-40 mr-2" />
                                            ダッシュボード
                                        </li>
                                    </Link>
                                    <Link href="/settings" passHref>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                                            <FiSettings className="opacity-40 mr-2" />
                                            設定
                                        </li>
                                    </Link>
                                    <Link href="/tools" passHref>
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                                            <FiTool className="opacity-40 mr-2" />
                                            ツール
                                        </li>
                                    </Link>
                                    <hr className="my-2" />
                                    <li
                                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                                        onClick={() => signOut(auth)}
                                    >
                                        <FiLogOut className="opacity-40 mr-2" />
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

            <Modal
                title="Googleでログイン"
                description="ChronoBoxで、学生生活をもっとスムーズに。スケジュール管理を簡単サポートするWebサービスです。"
                onClose={() => setShowModal(false)}
                isVisible={showModal}
                footer={
                    <>
                        <Button className="w-full" leftIcon={<FaGoogle />} onClick={handleLogin}>Googleでログイン</Button>
                    </>
                }
            />
        </div>
    );
}