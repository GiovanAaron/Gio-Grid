import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './DataVis.module.css';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DataVis = ({ stats }) => {
  const values = [stats.Green, stats['Not green'], stats.Neutral];
  const maximumValue = Math.max(...values);

  const data = {
    labels: ['Green', 'Not Green', 'Neutral'],
    datasets: [
      {
        label: 'Energy Breakdown',
        data: values,
        backgroundColor: ['#02B782', '#FF6D6D', '#D9D9D9'],
        borderColor: ['#02B782', '#FF6D6D', '#D9D9D9'],
        borderWidth: 1,
        barThickness: 40,
        categoryPercentage: 0.2,
        barPercentage: 0.8,
        minBarLength: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    layout: {
      padding: { top: 20, right: 20, bottom: 30, left: 20 },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: () => null,
          label: (tooltipItem) => tooltipItem.raw,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { padding: 10, color: '#FFFFFF' },
      },
      y: {
        display: false,
        beginAtZero: true,
        max: maximumValue > 0 ? maximumValue : 1,
      },
    },
  };

  return (
    <div className={styles.dataVisContainer}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DataVis;
