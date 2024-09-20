import Image from "next/image";
import Button from "./ui/Button";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";

export default function Header() {
    return (
        <div className="bg-white flex items-center p-4 border-b">
            <Link href="/" className="w-36">
                <Image src="/logotype.svg" alt="ChronoBox" width={100} height={100} className="w-full" />
            </Link>
            <div className="ml-auto flex items-center">
                <Link href="/search" passHref><FiSearch className="text-[20px] text-slate-400" /></Link>
                <Button size="small" className="ml-4 hidden md:block">新規登録</Button>
                <Button variant="secondary" size="small" className="ml-2">ログイン</Button>
            </div>
        </div>
    )
}