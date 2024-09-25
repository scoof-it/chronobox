"use client"
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import { FaCalculator } from "react-icons/fa";

export default function Tools() {
    return (
        <div>
            <Header />
            <div className="mt-10 md:container md:mx-auto mx-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Link href="/tools/calculator">
                        <div className="bg-primary text-white border rounded-md p-4">
                            <div className="flex items-center mb-0.5">
                                <FaCalculator />
                                <p className="font-bold ml-2">電卓</p>
                            </div>
                            <p className="text-sm">シンプルなUIで、計算に困った時にすぐに使えるツールです。</p>
                        </div>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    )
}