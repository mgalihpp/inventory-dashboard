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
    height?: number | string;
    maxWidth?: string | number;
    fontFamily: string;
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

class ColumnApexChart extends Component<{}, ApexChartState> {
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
          name: "Organic",
          color: "#1A56DB",
          data: [
            { x: "Mon", y: 231 },
            { x: "Tue", y: 122 },
            { x: "Wed", y: 63 },
            { x: "Thu", y: 421 },
            { x: "Fri", y: 122 },
            { x: "Sat", y: 323 },
            { x: "Sun", y: 111 },
          ],
        },
        {
          name: "Social media",
          color: "#FDBA8C",
          data: [
            { x: "Mon", y: 232 },
            { x: "Tue", y: 113 },
            { x: "Wed", y: 341 },
            { x: "Thu", y: 224 },
            { x: "Fri", y: 522 },
            { x: "Sat", y: 411 },
            { x: "Sun", y: 243 },
          ],
        },
      ],
      options: {
        colors: ["#1A56DB", "#FDBA8C"],

        chart: {
          type: "bar",
          height: "320px",
          fontFamily: "Inter, sans-serif",
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "70%",
            borderRadiusApplication: "end",
            borderRadius: 8,
          },
        },
        tooltip: {
          shared: true,
          intersect: false,
          style: {
            fontFamily: "Inter, sans-serif",
          },
        },
        states: {
          hover: {
            filter: {
              type: "darken",
              value: 1,
            },
          },
        },
        stroke: {
          show: true,
          width: 0,
          colors: ["transparent"],
        },
        grid: {
          show: false,
          strokeDashArray: 4,
          padding: {
            left: 2,
            right: 2,
            top: -14,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        xaxis: {
          floating: false,
          labels: {
            show: true,
            style: {
              fontFamily: "Inter, sans-serif",
              cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
            },
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          show: false,
        },
        fill: {
          opacity: 1,
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

export default ColumnApexChart;
