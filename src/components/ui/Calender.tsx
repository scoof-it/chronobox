import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

interface CalendarProps {
  currentYear: number;
  currentMonth: number;
  prevMonth: () => void;
  nextMonth: () => void;
  onDayClick: (day: number) => void; // onDayClick を追加
}

export default function Calendar({ currentYear, currentMonth, prevMonth, nextMonth, onDayClick }: CalendarProps) {
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

  useEffect(() => {
    generateCalendarDays(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  return (
    <div className="bg-white p-10 rounded-lg shadow-lg w-full text-center space-y-4">
      <div className="flex items-center justify-center gap-4">
        <Button onClick={prevMonth} variant="secondary">Prev</Button>
        <span className="text-2xl font-bold">{`${currentYear}年${currentMonth + 1}月`}</span>
        <Button onClick={nextMonth} variant="secondary">Next</Button>
      </div>
      <div className="grid grid-cols-7 md:gap-2 border-t border-l md:border-none">
        <div className="text-base font-bold text-gray-600 uppercase border-r border-b md:border-none">日</div>
        <div className="text-base font-bold text-gray-600 uppercase border-r border-b md:border-none">月</div>
        <div className="text-base font-bold text-gray-600 uppercase border-r border-b md:border-none">火</div>
        <div className="text-base font-bold text-gray-600 uppercase border-r border-b md:border-none">水</div>
        <div className="text-base font-bold text-gray-600 uppercase border-r border-b md:border-none">木</div>
        <div className="text-base font-bold text-gray-600 uppercase border-r border-b md:border-none">金</div>
        <div className="text-base font-bold text-gray-600 uppercase border-r border-b md:border-none">土</div>
        {days.map((day, index) => (
          <div
            key={index}
            onClick={() => day !== 0 && onDayClick(day)}
            className={`p-2 md:p-4 border-r border-b md:border-none md:rounded-lg md:bg-[#f7fafc] md:shadow-sm md:text-lg transition-all ease-in-out cursor-pointer hover:bg-[#007bff] hover:text-white ${
              day === 0 ? 'empty' : ''
            }`}
          >
            {day !== 0 ? day : ''}
          </div>
        ))}
      </div>
      <div className="flex">
        <Button className="ml-auto">スケジュールを追加</Button>
      </div>
    </div>
  );
}
