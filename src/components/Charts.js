import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadarController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie, Radar } from 'react-chartjs-2';
import '../styles/charts.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadarController,
  Title,
  Tooltip,
  Legend,
  Filler
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

  // Chart 5: Blocked vs Allowed Ratio (Horizontal Bar)
  const ratioChartData = {
    labels: ['Status'],
    datasets: [
      {
        label: 'Blocked',
        data: [blocked],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
      },
      {
        label: 'Allowed',
        data: [allowed],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Chart 6: Risk Severity Radar
  const severityData = {
    critical: Math.round(riskCount * 0.2),
    high: Math.round(riskCount * 0.3),
    medium: Math.round(riskCount * 0.3),
    low: Math.round(riskCount * 0.2),
  };

  const radarChartData = {
    labels: ['Critical', 'High', 'Medium', 'Low', 'Safe'],
    datasets: [
      {
        label: 'Threat Level Distribution',
        data: [
          severityData.critical,
          severityData.high,
          severityData.medium,
          severityData.low,
          total - riskCount,
        ],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  // Chart 7: Time Series (Simulated - increasing risk over time)
  const timeSeriesLabels = ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
  const timeSeriesData = [
    Math.round(riskCount * 0.1),
    Math.round(riskCount * 0.15),
    Math.round(riskCount * 0.25),
    Math.round(riskCount * 0.35),
    Math.round(riskCount * 0.5),
    Math.round(riskCount * 0.65),
    Math.round(riskCount * 0.8),
    riskCount,
  ];

  const timeSeriesChartData = {
    labels: timeSeriesLabels,
    datasets: [
      {
        label: 'Cumulative Risk Events',
        data: timeSeriesData,
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  // Chart 8: Protocol Distribution (simulated)
  const protocolChartData = {
    labels: ['TCP', 'UDP', 'ICMP', 'Other'],
    datasets: [
      {
        label: 'Protocol Distribution',
        data: [
          Math.round(total * 0.5),
          Math.round(total * 0.3),
          Math.round(total * 0.12),
          Math.round(total * 0.08),
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(249, 115, 22, 1)',
        ],
        borderWidth: 2,
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

  const horizontalBarOptions = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      r: {
        beginAtZero: true,
      },
    },
  };

  const timeSeriesOptions = {
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

        {/* Chart 5: Blocked vs Allowed Ratio */}
        <div className="chart-box">
          <h3 className="chart-title">Blocked vs Allowed Comparison</h3>
          <div className="chart-wrapper">
            <Bar data={ratioChartData} options={horizontalBarOptions} />
          </div>
          <div className="chart-stats">
            <div className="stat">
              <span className="stat-label">Allowed Ratio:</span>
              <span className="stat-value">{total > 0 ? ((allowed / total) * 100).toFixed(1) : 0}%</span>
            </div>
            <div className="stat">
              <span className="stat-label">Blocked Ratio:</span>
              <span className="stat-value">{total > 0 ? ((blocked / total) * 100).toFixed(1) : 0}%</span>
            </div>
          </div>
        </div>

        {/* Chart 6: Threat Level Distribution (Radar) */}
        <div className="chart-box">
          <h3 className="chart-title">Threat Level Distribution</h3>
          <div className="chart-wrapper">
            <Radar data={radarChartData} options={radarOptions} />
          </div>
          <div className="chart-stats">
            <div className="stat">
              <span className="stat-label">Critical:</span>
              <span className="stat-value">{severityData.critical}</span>
            </div>
            <div className="stat">
              <span className="stat-label">High:</span>
              <span className="stat-value">{severityData.high}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Medium:</span>
              <span className="stat-value">{severityData.medium}</span>
            </div>
          </div>
        </div>

        {/* Chart 7: Cumulative Risk Over Time */}
        <div className="chart-box chart-box-wide">
          <h3 className="chart-title">Cumulative Risk Events (24-Hour Trend)</h3>
          <div className="chart-wrapper">
            <Line data={timeSeriesChartData} options={timeSeriesOptions} />
          </div>
          <div className="chart-stats">
            <div className="stat">
              <span className="stat-label">Peak Risk:</span>
              <span className="stat-value">{Math.max(...timeSeriesData)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Avg Risk:</span>
              <span className="stat-value">{Math.round(timeSeriesData.reduce((a, b) => a + b, 0) / timeSeriesData.length)}</span>
            </div>
          </div>
        </div>

        {/* Chart 8: Protocol Distribution */}
        <div className="chart-box chart-box-wide">
          <h3 className="chart-title">Protocol Distribution</h3>
          <div className="chart-wrapper">
            <Doughnut data={protocolChartData} options={chartOptions} />
          </div>
          <div className="chart-stats">
            <div className="stat">
              <span className="stat-label">TCP:</span>
              <span className="stat-value">{Math.round(total * 0.5)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">UDP:</span>
              <span className="stat-value">{Math.round(total * 0.3)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">ICMP:</span>
              <span className="stat-value">{Math.round(total * 0.12)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Other:</span>
              <span className="stat-value">{Math.round(total * 0.08)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Charts;
