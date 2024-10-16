import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <div className="mt-20 py-8 bg-white">
            <div className="mx-5 md:container md:mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <Link href="/">
                        <div className="w-16">
                            <Image src="/logotype.svg" alt="ChronoBox" width={100} height={100} className="w-full" />
                        </div>
                    </Link>
                    <p>&copy; 2024 scoof.</p>
                </div>
                <div className="block md:hidden" />
                <div className="space-y-2 flex flex-col">
                    <p className="text-[20px] font-bold">Legal</p>
                    <Link href="/legal?tab=terms">利用規約</Link>
                    <Link href="/legal?tab=privacy">プライバシーポリシー</Link>
                </div>
                <div className="space-y-2 flex flex-col">
                    <p className="text-[20px] font-bold">Guides</p>
                    <Link href="#">使い方</Link>
                    <Link href="#">よくある質問</Link>
                </div>
                <div className="space-y-2 flex flex-col">
                    <p className="text-[20px] font-bold">About</p>
                    <Link href="#">CiCiについて</Link>
                    <Link href="#">お問い合わせ</Link>
                </div>
            </div>
        </div>
    )
}