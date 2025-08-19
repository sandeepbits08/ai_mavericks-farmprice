import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import type { PriceChartData } from "@shared/schema";

Chart.register(...registerables);

interface PriceTrendChartProps {
  chartData: PriceChartData;
}

export default function PriceTrendChart({ chartData }: PriceTrendChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Current Market Price',
            data: chartData.currentPrices,
            borderColor: 'hsl(142, 76%, 36%)',
            backgroundColor: 'hsla(142, 76%, 36%, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Average Price',
            data: chartData.averagePrices,
            borderColor: 'hsl(43, 96%, 56%)',
            backgroundColor: 'hsla(43, 96%, 56%, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
          },
          {
            label: 'Predicted Price',
            data: chartData.predictedPrices,
            borderColor: 'hsl(142, 71%, 45%)',
            backgroundColor: 'hsla(142, 71%, 45%, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1F2937',
            bodyColor: '#1F2937',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ₹' + context.parsed.y;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6B7280',
              font: {
                size: 12
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(107, 114, 128, 0.1)'
            },
            ticks: {
              color: '#6B7280',
              font: {
                size: 12
              },
              callback: function(value) {
                return '₹' + value;
              }
            }
          }
        },
        elements: {
          point: {
            radius: 4,
            hoverRadius: 6
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  if (!chartData.labels.length) {
    return (
      <section className="mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-6">Price Trends</h3>
          <div className="h-80 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <i className="fas fa-chart-line text-4xl mb-4 text-gray-300"></i>
              <p>No price trend data available.</p>
              <p className="text-sm mt-2">Historical price data will be displayed once available.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h3 className="text-lg font-semibold mb-2 sm:mb-0">Price Trends (Last 14 Days)</h3>
          <div className="flex items-center space-x-3">
            <select 
              className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm"
              data-testid="crop-selector"
              defaultValue="wheat"
            >
              <option value="wheat">Wheat</option>
              <option value="rice">Rice</option>
              <option value="sugarcane">Sugarcane</option>
              <option value="cotton">Cotton</option>
            </select>
            <select 
              className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm"
              data-testid="market-selector"
              defaultValue="all"
            >
              <option value="all">All Markets</option>
              <option value="mandya">Mandya</option>
              <option value="tumkur">Tumkur</option>
              <option value="mysore">Mysore</option>
            </select>
          </div>
        </div>
        
        <div className="h-80">
          <canvas ref={chartRef} className="w-full h-full" data-testid="price-chart"></canvas>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm text-gray-600">Current Market Price</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-sm text-gray-600">Average Price</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span className="text-sm text-gray-600">Predicted Price</span>
          </div>
        </div>
      </div>
    </section>
  );
}
