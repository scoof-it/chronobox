"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

export default function Legal() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentTab = searchParams.get("tab") || "terms"; // デフォルトは"terms"

    const handleTabChange = (tab: "terms" | "privacy") => {
        router.push(`?tab=${tab}`);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow mt-10 md:container md:mx-auto mx-5">
                <div className="flex flex-col items-center">
                    <div className="w-32">
                        <Image src="/logo.svg" alt="C.B" width={100} height={100} className="w-full" />
                    </div>
                    <div className="mt-5 flex">
                        <Button
                            className={`rounded-r-none ${currentTab === "terms" ? "bg-blue-500 text-white" : ""}`}
                            variant={currentTab === "terms" ? "primary" : "secondary"}
                            onClick={() => handleTabChange("terms")}
                        >
                            利用規約
                        </Button>
                        <Button
                            className={`rounded-l-none ${currentTab === "privacy" ? "bg-blue-500 text-white" : ""}`}
                            variant={currentTab === "privacy" ? "primary" : "secondary"}
                            onClick={() => handleTabChange("privacy")}
                        >
                            プライバシーポリシー
                        </Button>
                    </div>
                </div>
                <hr className="my-10" />
                <div>
                    {currentTab === "terms" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">利用規約</h2>
                            <p className="text-lg mb-4">
                                当サービスを利用するにあたり、以下の条件に同意いただく必要があります。Googleアカウント認証を通じて、あなたのアクセスが簡単かつ安全に行われます。
                            </p>
                            <h3 className="text-xl font-bold mb-2">1. アカウント管理</h3>
                            <p className="text-lg mb-4">
                                当サービスはGoogleアカウントを利用してログインする必要があります。ユーザーは自身のアカウント情報を適切に管理し、不正利用されないように注意する義務があります。第三者による不正アクセスや使用に関して、当サービスは責任を負いません。
                            </p>
                            <h3 className="text-xl font-bold mb-2">2. 禁止事項</h3>
                            <p className="text-lg mb-4">
                                ユーザーは以下の行為を行ってはなりません:
                                <ul className="list-disc list-inside">
                                    <li>不正アクセスやサーバーへの攻撃</li>
                                    <li>他のユーザーや第三者に対する迷惑行為</li>
                                    <li>法律に違反する行為やコンテンツの投稿</li>
                                </ul>
                            </p>
                            <h3 className="text-xl font-bold mb-2">3. サービスの停止・変更</h3>
                            <p className="text-lg">
                                当サービスは、事前の通知なく一時的または永久的にサービスの内容を変更、停止することがあります。これに対し、ユーザーは異議を申し立てないものとします。
                            </p>
                        </div>
                    )}
                    {currentTab === "privacy" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">プライバシーポリシー</h2>
                            <p className="text-lg mb-4">
                                当サービスは、ユーザーのプライバシーを最優先に保護します。Googleアカウント認証を通じて、ユーザーの個人情報は安全に管理されます。
                            </p>
                            <h3 className="text-xl font-bold mb-2">1. 収集する情報</h3>
                            <p className="text-lg mb-4">
                                当サービスは、Googleアカウントを通じて以下の情報を収集する場合があります:
                                <ul className="list-disc list-inside">
                                    <li>氏名、メールアドレス</li>
                                    <li>Googleアカウントに関連するプロファイル情報</li>
                                    <li>サービス利用に関するデータ（アクセスログ、行動履歴など）</li>
                                </ul>
                            </p>
                            <h3 className="text-xl font-bold mb-2">2. 情報の利用目的</h3>
                            <p className="text-lg mb-4">
                                収集した情報は、以下の目的に利用されます:
                                <ul className="list-disc list-inside">
                                    <li>サービス提供のための本人確認</li>
                                    <li>サービス向上のための利用状況の分析</li>
                                    <li>法的要求に基づく開示義務が生じた場合の対応</li>
                                </ul>
                            </p>
                            <h3 className="text-xl font-bold mb-2">3. 情報の共有</h3>
                            <p className="text-lg">
                                当サービスは、ユーザーの許可なく第三者に個人情報を共有することはありません。ただし、法的義務に従う場合、またはサービス提供に必要な範囲で外部サービスと連携する場合を除きます。
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}