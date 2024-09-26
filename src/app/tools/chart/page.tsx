"use client"
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { Line, Bar } from 'react-chartjs-2';
import { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Chart() {
    // 初期データ
    const [scores, setScores] = useState([65, 75, 70, 80, 90]); // 初期の点数データ
    const [inputValues, setInputValues] = useState(scores.join(',')); // 初期入力値
    const [isBarChart, setIsBarChart] = useState(false); // グラフのタイプ管理

    // X軸ラベルを点数の数に応じて動的に生成
    const labels = scores.map((_, index) => `試験${index + 1}`);

    // グラフに表示するデータ
    const data = {
        labels: labels, // X軸のラベル
        datasets: [
            {
                label: '成績',
                data: scores,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, .5)',
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#007bff', // primaryテキストカラー
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#007bff', // primaryテキストカラー
                },
            },
            y: {
                ticks: {
                    color: '#007bff', // primaryテキストカラー
                },
            },
        },
    };

    // ユーザーが入力した点数をグラフに反映
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValues(value);

        const newScores = value.split(',').map(Number); // コンマで区切って数値に変換
        if (newScores.every(score => !isNaN(score))) { // 全ての値が数値なら反映
            setScores(newScores);
        }
    };

    // グラフタイプを切り替える関数
    const toggleChartType = () => {
        setIsBarChart(prev => !prev);
    };

    return (
        <div>
            <Header />
            <Layout>
                <div className="p-4 space-y-4">
                    <h2 className="text-primary text-2xl font-bold">成績統計</h2>
                    <div className="flex">
                        <Input
                            type="text"
                            value={inputValues}
                            onChange={handleInputChange}
                            placeholder="カンマ区切りで点数を入力"
                            size="small"
                            className="w-full"
                        />
                        <Button onClick={toggleChartType} size="small" className="whitespace-nowrap ml-2">
                            {isBarChart ? '線グラフに切り替える' : '棒グラフに切り替える'}
                        </Button>
                    </div>
                    {/* グラフ表示の切り替え */}
                    {isBarChart ? (
                        <Bar data={data} options={options} />
                    ) : (
                        <Line data={data} options={options} />
                    )}
                </div>
            </Layout>
            <Footer />
        </div>
    );
}