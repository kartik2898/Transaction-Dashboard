import { useState } from 'react'
import TransactionTable from './components/TransactionTable'
import Statistics from './components/Statistics'
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'
import './App.css'

function App() {
  const [selectedMonth, setSelectedMonth] = useState(3); // Default to March

  return (
    <div className="container">
      <h1>Transaction Dashboard</h1>
      <TransactionTable month={selectedMonth} onMonthChange={setSelectedMonth} />
      <div className="dashboard-grid">
        <Statistics month={selectedMonth} />
        <div className="charts-container">
          <BarChart month={selectedMonth} />
          <PieChart month={selectedMonth} />
        </div>
      </div>
    </div>
  )
}

export default App