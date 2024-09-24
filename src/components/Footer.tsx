import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <div className="mt-20 py-8 bg-white border-t">
            <div className="mx-5 md:container md:mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <div className="w-36">
                        <Image src="/logotype.svg" alt="ChronoBox" width={100} height={100} className="w-full" />
                    </div>
                    <p>&copy; 2024 Scoof.</p>
                </div>
                <div className="space-y-2 flex flex-col">
                    <p className="text-[20px] font-bold">Legal</p>
                    <Link href="#">利用規約</Link>
                    <Link href="#">プライバシーポリシー</Link>
                </div>
                <div className="space-y-2 flex flex-col">
                    <p className="text-[20px] font-bold">Guides</p>
                    <Link href="#">使い方</Link>
                    <Link href="#">よくある質問</Link>
                </div>
                <div className="space-y-2 flex flex-col">
                    <p className="text-[20px] font-bold">About</p>
                    <Link href="#">ChronoBoxについて</Link>
                    <Link href="#">運営者</Link>
                </div>
            </div>
        </div>
    )
}