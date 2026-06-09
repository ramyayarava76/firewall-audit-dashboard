import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import '../styles/charts.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Charts({ summary = {} }) {
  const total = Number(summary.total) || 0;
  const allowed = Number(summary.allowed) || 0;
  const blocked = Number(summary.blocked) || 0;
  const other = Number(summary.other) || 0;
  const riskCount = Number(summary.riskCount) || 0;

  // Chart 1: Actions Distribution (Doughnut Chart)
  const actionsChartData = {
    labels: ['Allowed', 'Blocked', 'Other'],
    datasets: [
      {
        label: 'Firewall Actions',
        data: [allowed, blocked, other],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(107, 114, 128, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Chart 2: Risk Analysis (Bar Chart)
  const riskChartData = {
    labels: ['Total Entries', 'Risk Count', 'Safe Entries'],
    datasets: [
      {
        label: 'Risk Analysis',
        data: [total, riskCount, total - riskCount],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Chart 3: Entry Status Distribution (Pie Chart)
  const statusChartData = {
    labels: ['Allowed', 'Blocked', 'Other'],
    datasets: [
      {
        label: 'Entry Status',
        data: [allowed, blocked, other],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(107, 114, 128, 0.7)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(107, 114, 128, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Chart 4: Risk Percentage (Line Chart)
  const riskPercentage = total > 0 ? ((riskCount / total) * 100).toFixed(2) : 0;
  const safePercentage = 100 - riskPercentage;

  const riskPercentageChartData = {
    labels: ['Risk', 'Safe'],
    datasets: [
      {
        label: 'Risk Percentage',
        data: [riskPercentage, safePercentage],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const riskChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="charts-container">
      <h2 className="charts-title">Analytics & Insights</h2>

      <div className="charts-grid">
        {/* Chart 1: Actions Distribution */}
        <div className="chart-box">
          <h3 className="chart-title">Firewall Actions Distribution</h3>
          <div className="chart-wrapper">
            <Doughnut data={actionsChartData} options={chartOptions} />
          </div>
          <div className="chart-stats">
            <div className="stat">
              <span className="stat-label">Allowed:</span>
              <span className="stat-value">{allowed}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Blocked:</span>
              <span className="stat-value">{blocked}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Other:</span>
              <span className="stat-value">{other}</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Risk Analysis */}
        <div className="chart-box">
          <h3 className="chart-title">Risk Analysis</h3>
          <div className="chart-wrapper">
            <Bar data={riskChartData} options={riskChartOptions} />
          </div>
          <div className="chart-stats">
            <div className="stat">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{total}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Risk Count:</span>
              <span className="stat-value">{riskCount}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Safe:</span>
              <span className="stat-value">{total - riskCount}</span>
            </div>
          </div>
        </div>

        {/* Chart 3: Entry Status */}
        <div className="chart-box">
          <h3 className="chart-title">Entry Status Distribution</h3>
          <div className="chart-wrapper">
            <Pie data={statusChartData} options={chartOptions} />
          </div>
          <div className="chart-stats">
            <div className="stat">
              <span className="stat-label">Total Entries:</span>
              <span className="stat-value">{total}</span>
            </div>
          </div>
        </div>

        {/* Chart 4: Risk Percentage */}
        <div className="chart-box">
          <h3 className="chart-title">Risk vs Safe Entries</h3>
          <div className="chart-wrapper">
            <Line data={riskPercentageChartData} options={chartOptions} />
          </div>
          <div className="chart-stats">
            <div className="stat">
              <span className="stat-label">Risk %:</span>
              <span className="stat-value">{riskPercentage}%</span>
            </div>
            <div className="stat">
              <span className="stat-label">Safe %:</span>
              <span className="stat-value">{safePercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Charts;
