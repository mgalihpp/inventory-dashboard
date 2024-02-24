"use client";

import { ApexOptions } from "apexcharts";
import React, { Component } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => {
    return (
      <div className="flex items-center justify-center mx-auto h-56 w-56">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  },
});

interface SeriesData {
  name: string;
  data: any[];
  color?: string;
}

interface ChartOptions extends ApexOptions {
  chart: {
    sparkline: {
      enabled: boolean;
    };
    height?: number | string;
    width?: string;
    maxWidth?: string | number;
    fontFamily?: string;
    dropShadow?: {
      enabled: boolean;
    };
    toolbar: {
      show: boolean;
    };
    type?:
      | "area"
      | "line"
      | "bar"
      | "pie"
      | "donut"
      | "radialBar"
      | "scatter"
      | "bubble"
      | "heatmap"
      | "candlestick"
      | "boxPlot"
      | "radar"
      | "polarArea"
      | "rangeBar"
      | "rangeArea"
      | "treemap";
  };
}

interface ApexChartState {
  series: SeriesData[];
  options: ChartOptions;
}

class BarChart extends Component<{}, ApexChartState> {
  constructor(props: {}) {
    super(props);

    // Initialize state based on localStorage or default values
    const savedThemeMode =
      typeof window !== "undefined"
        ? localStorage.getItem("theme") ?? "light"
        : "light";

    this.state = {
      series: [
        {
          name: "Income",
          color: "#31C48D",
          data: ["1420", "1620", "1820", "1420", "1650", "2120"],
        },
        {
          name: "Expense",
          data: ["788", "810", "866", "788", "1100", "1200"],
          color: "#F05252",
        },
      ],
      options: {
        chart: {
          sparkline: {
            enabled: false,
          },
          type: "bar",
          width: "100%",
          height: 400,
          toolbar: {
            show: false,
          },
        },
        fill: {
          opacity: 1,
        },
        plotOptions: {
          bar: {
            horizontal: true,
            columnWidth: "100%",
            borderRadiusApplication: "end",
            borderRadius: 6,
            dataLabels: {
              position: "top",
            },
          },
        },
        legend: {
          show: true,
          position: "bottom",
        },
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          shared: true,
          intersect: false,
          x: {
            formatter(value: number) {
              return "$" + value;
            },
          },
          z: {
            formatter(value: number) {
              return "$" + value;
            },
          },
        },
        xaxis: {
          labels: {
            show: true,
            style: {
              fontFamily: "Inter, sans-serif",
              cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
            },
            formatter: function (value) {
              return "$" + value;
            },
          },
          categories: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            show: true,
            style: {
              fontFamily: "Inter, sans-serif",
              cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
            },
          },
        },
        grid: {
          show: true,
          strokeDashArray: 4,
          padding: {
            left: 2,
            right: 2,
            top: -20,
          },
        },
        theme: {
          mode: savedThemeMode === "light" ? "light" : "dark",
        },
      },
    };
  }

  render() {
    return (
      <div>
        <div id="chart">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="area"
            width={350}
            height={250}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}

export default BarChart;
