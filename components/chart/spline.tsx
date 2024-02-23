"use client";

import { ApexOptions } from "apexcharts";
import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";

interface SeriesData {
  name: string;
  data: number[];
  color?: string;
}

interface ChartOptions extends ApexOptions {
  chart: {
    height: number | string;
    maxWidth: string | number;
    fontFamily: string;
    dropShadow: {
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

class ApexChart extends Component<{}, ApexChartState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      series: [
        {
          name: "New users",
          data: [6500, 6418, 6456, 6526, 6356, 6456],
          color: "#1A56DB",
        },
      ],
      options: {
        chart: {
          height: "100%",
          maxWidth: "100%",
          type: "area",
          fontFamily: "Inter, sans-serif",
          dropShadow: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.55,
            opacityTo: 0,
            shade: "#1C64F2",
            gradientToColors: ["#1C64F2"],
          },
        },
        grid: {
          show: false,
          strokeDashArray: 4,
          padding: {
            left: 2,
            right: 2,
            top: 0,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 6,
          curve: "smooth",
        },
        xaxis: {
          categories: [
            "01 February",
            "02 February",
            "03 February",
            "04 February",
            "05 February",
            "06 February",
            "07 February",
          ],
          labels: {
            show: false,
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
        tooltip: {
          enabled: true,
          x: {
            show: false,
          },
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
            height={350}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}

export default ApexChart;
