"use client"
import Header from '@/components/Header';
import Button from '@/components/ui/Button';
import { useState, useEffect } from 'react';

export default function Home() {
  const [currentYear, setCurrentYear] = useState(2024);
  const [currentMonth, setCurrentMonth] = useState(8); // 9月は 8 (JSの月は0始まり)
  const [days, setDays] = useState<number[]>([]);

  // 月の日数を取得
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // カレンダーを生成
  const generateCalendarDays = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const daysArray = [];

    // 前月のスペースを追加
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(0); // 空白の日を 0 として扱う
    }

    // 月の日付を追加
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(day);
    }

    setDays(daysArray);
  };

  // 前月に移動
  const prevMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // 次月に移動
  const nextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  useEffect(() => {
    generateCalendarDays(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  return (
    <div>
      <Header />
    <div className="flex items-center justify-center h-screen m-0 p-0">
      <div className="w-full">
        {/* Calendar Container */}
        <div className="calendar-container p-4">
          <div className="calendar-header">
            <div className="calendar-controls">
              <Button onClick={prevMonth} variant="secondary">Prev</Button>
              <span className="calendar-month">{`${currentYear}年${currentMonth + 1}月`}</span>
              <Button onClick={nextMonth} variant="secondary">Next</Button>
            </div>
          </div>

          <div className="calendar-grid">
            <div className="calendar-day">日</div>
            <div className="calendar-day">月</div>
            <div className="calendar-day">火</div>
            <div className="calendar-day">水</div>
            <div className="calendar-day">木</div>
            <div className="calendar-day">金</div>
            <div className="calendar-day">土</div>

            {days.map((day, index) => (
              <div key={index} className={`calendar-date ${day === 0 ? 'empty' : ''}`}>
                {day !== 0 ? day : ''}
              </div>
            ))}
          </div>

          <div className="calendar-footer">
            <Button>スケジュールを追加</Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}