"use client"
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useState } from "react";

export default function Calculator() {
    const [input, setInput] = useState<string>("");  // 入力を文字列型で管理
    const [result, setResult] = useState<number | string>(0); // 結果を数値または文字列型で管理
    const [notes, setNotes] = useState<string[]>([]); // メモ用の配列

    const handleClick = (value: string) => { // 型定義
        setInput(input + value);
    };

    const handleClear = () => {
        setInput("");
        setResult(0);
    };

    const handleCalculate = () => {
        try {
            // 入力を計算し、結果を設定
            setResult(eval(input)); // 複雑な計算に対応
        } catch {
            setResult("Error");
        }
    };

    const handleSaveNote = () => {
        setNotes([...notes, `${input} = ${result}`]);
        setInput("");
        setResult(0);
    };

    return (
        <div>
            <Header />
            <div className="md:container md:mx-auto mt-10 mx-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 電卓 */}
                <div className="max-w-md w-full">
                    <div className="text-right text-2xl mb-5 px-3 py-2 bg-white rounded border font-mono">{input || "0"}</div>
                    <div className="text-right text-[32px] font-bold mb-5 px-3 py-2 bg-white rounded border font-mono">{result}</div>
                    <div className="grid grid-cols-4 gap-4">
                        {/* ボタン群 */}
                        {["1", "2", "3", "+"].map((val) => (
                            <button
                                key={val}
                                className="px-4 py-3 md:text-lg font-bold rounded-lg calculator-button border border-black"
                                onClick={() => handleClick(val)}
                            >
                                {val}
                            </button>
                        ))}
                        {["4", "5", "6", "-"].map((val) => (
                            <button
                                key={val}
                                className="px-4 py-3 md:text-lg font-bold rounded-lg calculator-button border border-black"
                                onClick={() => handleClick(val)}
                            >
                                {val}
                            </button>
                        ))}
                        {["7", "8", "9", "*"].map((val) => (
                            <button
                                key={val}
                                className="px-4 py-3 md:text-lg font-bold rounded-lg calculator-button border border-black"
                                onClick={() => handleClick(val)}
                            >
                                {val}
                            </button>
                        ))}
                        <button
                            className="px-4 py-3 md:text-lg font-bold rounded-lg calculator-button red border border-black"
                            onClick={handleClear}
                        >
                            C
                        </button>
                        <button
                            className="px-4 py-3 md:text-lg font-bold rounded-lg calculator-button border border-black"
                            onClick={() => handleClick("0")}
                        >
                            0
                        </button>
                        <button
                            className="px-4 py-3 md:text-lg font-bold rounded-lg calculator-button red border border-black"
                            onClick={handleCalculate}
                        >
                            =
                        </button>
                        <button
                            className="px-4 py-3 md:text-lg font-bold rounded-lg calculator-button border border-black"
                            onClick={() => handleClick("/")}
                        >
                            /
                        </button>
                        <button
                            className="px-4 py-3 md:text-lg font-bold rounded-lg calculator-button border border-black"
                            onClick={() => handleClick("(")}
                        >
                            (
                        </button>
                        <button
                            className="px-4 py-3 md:text-lg font-bold rounded-lg calculator-button border border-black"
                            onClick={() => handleClick(")")}
                        >
                            )
                        </button>
                        <button
                            className="px-4 py-3 md:text-lg font-bold rounded-lg calculator-button red border border-black"
                            onClick={handleSaveNote}
                        >
                            保存
                        </button>
                    </div>
                </div>
                <div>
                    <hr className="my-10 md:hidden" />
                    <h2 className="text-2xl font-bold mb-5">Memo</h2>
                    <ul className="list-inside space-y-2">
                        {notes.map((note, index) => (
                            <li key={index} className="bg-white px-4 py-2 shadow border rounded-lg">{note}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <Footer />
        </div>
    );
}