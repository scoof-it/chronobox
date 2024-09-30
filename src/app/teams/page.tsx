"use client";
import Header from "@/components/Header";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import AlertMessage from "@/components/ui/AlertMessage";
import { FaPlus, FaShare, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, onSnapshot, query, orderBy, doc, getDoc, deleteDoc, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Image from "next/image";

// メッセージの型定義
type Message = {
    id: string;
    roomId: string;
    userName: string;
    content: string;
    timestamp: {
        toDate: () => Date;
    };
};

export default function GroupStudy() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [roomName, setRoomName] = useState<string | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [messageContent, setMessageContent] = useState("");
    const [userName, setUserName] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // 削除確認モーダル用
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState<"success" | "error">("success");

    const router = useRouter();

    // URL パラメータから roomId を取得
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (id) {
            setRoomId(id);
            // Firestoreからルーム名を取得
            const fetchRoomName = async () => {
                const roomDoc = await getDoc(doc(db, "rooms", id));
                if (roomDoc.exists()) {
                    setRoomName(roomDoc.data().name);
                } else {
                    setRoomName("不明なルーム");
                }
            };
            fetchRoomName();
        }
    }, []);

    // Firestoreからメッセージを取得
    useEffect(() => {
        if (!roomId) return;

        const messagesRef = collection(db, "rooms", roomId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "desc")); // タイムスタンプ順に並べ替え
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Message));
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [roomId]);

    // メッセージを送信
    const sendMessage = async () => {
        if (messageContent.trim() === "" || userName.trim() === "") return;

        if (roomId) {
            const messagesRef = collection(db, "rooms", roomId, "messages");
            await addDoc(messagesRef, {
                roomId,
                userName,
                content: messageContent,
                timestamp: new Date()
            });

            setMessageContent("");
        }
    };

    // モーダルを開いてルーム名を設定
    const openCreateRoomModal = () => {
        setIsModalVisible(true);
    };

    const createRoom = async (name: string) => {
        try {
            // Firestore に新しいルームを追加
            const roomRef = await addDoc(collection(db, "rooms"), {
                name,
            });
            const newRoomId = roomRef.id;

            setRoomName(name);
            setRoomId(newRoomId);
            setIsModalVisible(false);
            router.push(`?id=${newRoomId}`); // 新しいルームIDをURLに設定
        } catch (error) {
            console.error("ルームの作成に失敗しました:", error);
        }
    };

    // ルームの共有URLをクリップボードにコピー
    const shareRoom = () => {
        if (!roomId) return;

        const currentUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${currentUrl}?id=${roomId}`;
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                setAlertMessage("ルームのURLがクリップボードにコピーされました");
                setAlertType("success");
                setIsAlertVisible(true);
            })
            .catch((error) => {
                console.error("クリップボードにコピーできませんでした: ", error);
                setAlertMessage("クリップボードにコピーできませんでした");
                setAlertType("error");
                setIsAlertVisible(true);
            });
    };

    // ルームとメッセージの削除
    const deleteRoom = async () => {
        if (!roomId) return;

        try {
            // ルームのメッセージを全て削除
            const messagesRef = collection(db, "rooms", roomId, "messages");
            const messagesSnapshot = await getDocs(messagesRef);
            messagesSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref); // 各メッセージを削除
            });

            // ルームを削除
            await deleteDoc(doc(db, "rooms", roomId));

            setAlertMessage("ルームが削除されました");
            setAlertType("success");
            setIsAlertVisible(true);
            setIsDeleteModalVisible(false);

            // ホーム画面に戻る
            router.push("/tools/group-study");
        } catch (error) {
            console.error("ルームの削除に失敗しました:", error);
            setAlertMessage("ルームの削除に失敗しました");
            setAlertType("error");
            setIsAlertVisible(true);
        }
    };

    return (
        <div>
            <Header />
            <>
                {roomId && roomName ? (
                    <div className="mt-10 md:container mx-5 md:mx-auto space-y-10">
                        <div className="bg-white p-4 rounded-2xl flex flex-col md:flex-row md:items-center">
                            <div>
                                <h1 className="font-bold">{roomName}</h1>
                                <p className="text-xs text-gray-500 font-mono">{roomId}</p>
                            </div>
                            <div className="md:ml-auto flex mt-2 md:mt-0">
                                <div className="flex">
                                    <Button
                                        leftIcon={<FaShare />}
                                        size="small"
                                        onClick={shareRoom}
                                        className="rounded-r-none"
                                    >
                                        共有
                                    </Button>
                                    <Button
                                        size="small"
                                        className="rounded-l-none"
                                        variant="secondary"
                                        onClick={() => setIsDeleteModalVisible(true)}
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                                <Button size="small" className="ml-2" onClick={openCreateRoomModal}>
                                    <FaPlus />
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-4 pb-[123px]">
                            {messages.map((message) => (
                                <div key={message.id} className="flex">
                                    <div className="w-10 h-10 p-2 mr-2 bg-white rounded-full overflow-hidden">
                                        <img src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${message.userName}`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center">
                                            <p className="font-bold mb-0.5">{message.userName}</p>
                                            <p className="ml-2 text-sm opacity-50">
                                                {new Date(message.timestamp.toDate()).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <p className="text-lg">{message.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="z-40 fixed bottom-0 left-0 w-full bg-white bg-opacity-50 backdrop-blur border-t p-4 flex">
                            <Input
                                placeholder="名前"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-32"
                            />
                            <Input
                                placeholder="メッセージを入力..."
                                value={messageContent}
                                onChange={(e) => setMessageContent(e.target.value)}
                                className="w-full ml-2"
                            />
                            <Button className="whitespace-nowrap ml-2" onClick={sendMessage}>
                                送信
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="md:container md:mt-10 mx-5 md:mx-auto grid grid-cols-1 md:grid-cols-2">
                                <div className="w-full select-none">
                                    <img src="/1128.png" />
                                </div>
                                <div className="flex flex-col justify-center space-y-5">
                                    <div className="flex flex-col items-center">
                                        <div className="w-full md:w-80 mb-2.5">
                                            <Image src="/chronoteams.svg" alt="ChronoBox" width={100} height={100} className="w-full" />
                                        </div>
                                        <h1 className="text-primary font-bold">ログイン不要のグループ学習ツール</h1>
                                    </div>
                                    <ul className="bg-white rounded-2xl space-y-2.5 text-[20px] font-bold p-5 pl-10 list-disc">
                                        <li>ログイン不要</li>
                                        <li>誰でも作成できる</li>
                                        <li>リンクで共有できる</li>
                                    </ul>
                                    <Button leftIcon={<FaPlus />} onClick={openCreateRoomModal}>
                                        ルームを作成する
                                    </Button>
                                </div>
                        </div>
                        <Footer />
                    </>
                )}
            </>
            <Modal
                title="ルームを作成"
                description={
                    <div className="flex whitespace-nowrap space-x-2">
                        <Input
                            placeholder="ルーム名を入力してください"
                            onChange={(e) => setRoomName(e.target.value)}
                            className="w-full"
                        />
                        <Button onClick={() => createRoom(roomName || "")}>作成</Button>
                    </div>
                }
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />
            <Modal
                title="ルーム削除の確認"
                description="本当にこのルームを削除しますか？この操作は取り消せません。"
                footer={
                    <div className="flex whitespace-nowrap space-x-2">
                        <Button variant="danger" onClick={deleteRoom}>
                            削除する
                        </Button>
                    </div>
                }
                isVisible={isDeleteModalVisible}
                onClose={() => setIsDeleteModalVisible(false)}
            />

            {isAlertVisible && (
                <AlertMessage
                    message={alertMessage}
                    type={alertType}
                    onClose={() => setIsAlertVisible(false)}
                />
            )}
        </div>
    );
}