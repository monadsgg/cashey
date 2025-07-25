import { useState } from "react";
import MonthNavigationHeader from "../../components/MonthNavigationHeader";
import BudgetTable from "./BudgetTable";
import { addMonths, subMonths } from "date-fns";

function Budget() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPrevMonth = () => {
    const prevDate = subMonths(currentDate, 1);
    setCurrentDate(prevDate);
  };

  const goToNextMonth = () => {
    const nextDate = addMonths(currentDate, 1);
    setCurrentDate(nextDate);
  };

  return (
    <>
      <MonthNavigationHeader
        goToPrevMonth={goToPrevMonth}
        goToNextMonth={goToNextMonth}
        currentDate={currentDate}
      />
      <BudgetTable />
    </>
  );
}

export default Budget;
