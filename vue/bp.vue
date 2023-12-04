<template>
    <div id=".pie-second .chart"></div>
</template>
  

import * as echarts from 'echarts'
export default {
    data() {
        return {
            HighYdata =[141, 150, 150, 151, 147, 151, 150, 151, 152, 151, 150, 151, 152, 147, 151, 150, 151, 152, 150, 151, 152, 152, 150, 150, 152],
            LowYdata: [83, 71, 86, 74, 83, 71, 84, 73, 87, 72, 84, 73, 85, 73, 71, 84, 83, 77, 77, 72, 74, 72, 74, 72, 84],
        }
    },
    (function () {// 血压图
        let myChart = echarts.init(document.querySelector('.pie-second .chart'))
        var startTime = '06:00';
        var endTime = '22:00';

        var xData = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00:00', '19:00:00', '20:00:00',
            '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00'
        ];

        var standardata = [];
        var standardata2 = [];
        var h = 135;
        var l = 120;
        xData.map((item, index) => {
            if (item <= startTime) {
                standardata.push('120')
                standardata2.push('70')
            } else if (item > endTime) {
                standardata.push('120')
                standardata2.push('70')
            } else {
                standardata.push('135')
                standardata2.push('85')
            }
        })
        var seriesArr = [{
            name: "high pressure",
            type: 'line',
            symbolSize: 0,
            silent: true,
            color: '#99B898',
            lineStyle: { //折线的颜色
                color: '#99B898'
            },
            smooth: false, //是否平滑处理值0-1,true相当于0.5
            data: this.HighYdata,
            markArea: {
                animation: true,
                itemStyle: { //全局的
                    normal: {
                        color: 'rgba(208,208,208,0.5)'
                    }
                },

                data: [
                    [{
                        name: 'at night',
                        textStyle: {
                            fontWeight: 'bolder',
                            fontSize: 24,
                            color: '#FFD56F',
                        },


                        xAxis: startTime || "",

                    }, {
                        xAxis: endTime || "",
                    }]
                ]
            }
        }, {
            name: "low pressure",
            type: 'line',
            symbolSize: 0,
            silent: true,
            color: '#2bd4ba',
            lineStyle: { //折线的颜色
                color: '#2bd4ba'
            },
            smooth: false, //是否平滑处理值0-1,true相当于0.5
            data: this.LowYdata
        }, {
            name: 'Systolic Threshold',
            type: 'line',
            step: "start",
            symbol: "none",

            symbolSize: 8,
            itemStyle: {
                normal: {
                    lineStyle: {
                        type: 'dashed',
                        //折点的颜色
                        // color: "#00a2e6"
                    },
                    color: "#D3DE32", //拐点的颜色
                }
            },
            markPoint: {
                symbol: 'rect',
                symbolSize: [85, 30],// 容器大小
                symbolOffset: [50, -20],//位置偏移
                itemStyle: {
                    color: "rgba(0,0,0,0)"
                },
                data: [{ type: 'max', name: '最大值' }, { coord: [1, 9] }, { coord: [2, 4] }],
                label: {
                    offset: [0, 0],
                    color: '#BAC964',
                    formatter: 'Diastolic Threshold'
                }
            },
            smooth: false,
            data: standardata
        }, {
            name: 'Diastolic Threshold',
            type: 'line',
            step: "start",
            symbol: "none",

            itemStyle: {
                normal: {
                    lineStyle: {
                        type: 'dashed',
                        //折点的颜色
                        // color: "#00a2e6"
                    },
                    color: "#184D47", //拐点的颜色
                }
            },
            markPoint: {
                symbol: 'rect',
                symbolSize: [85, 30],// 容器大小
                symbolOffset: [50, -20],//位置偏移
                itemStyle: {
                    color: "rgba(0,0,0,0)"
                },
                data: [{ type: 'max', name: '最大值' }, { coord: [1, 9] }, { coord: [2, 4] }],
                label: {
                    offset: [0, 0],
                    color: '#184D47',
                    formatter: 'Diastolic Threshold'
                }
            },
            smooth: false,
            data: standardata2
        }];

        option = {

            title: {
                text: "Blood Pressure",

                textStyle: {
                    fontWeight: 'bolder',
                    fontSize: 24,
                    color: '#FFD56F',
                },
                left: '5%',
                top: '5%'
            },
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    fontSize: 18
                },
                // formatter: function (params) {
                //   var str = params[0].axisValue + "<br/>";
                //   for (var i = 0; i <= 1; i++) {
                //     if (params[i].value) {
                //       str += '<span>' + params[i].seriesName + "</span>: <span style=font-size:16px;color:#fff;>" + params[i].value + " </span><br/>";
                //     }

                //   };
                //   return str;
                // }
            },
            grid: {
                left: "7%",
                right: "5%",
                top: "28%",
                bottom: "8%"
            },
            legend: {
                show: false,
                itemWidth: 25,
                itemHeight: 12,
                textStyle: {
                    fontSize: 16,
                    color: "#ffffff"
                },
                data: ["高压", "低压",
                    { name: 'Systolic Threshold' },
                    { name: 'Diastolic Threshold' }
                ],
                x: 'center',
                y: 'bottom',
                selectedMode: false
            },
            xAxis: [{
                name: '',
                type: 'category',
                boundaryGap: false,
                axisLine: { //设置X轴的颜色
                    lineStyle: {
                        color: '#ffffff'
                    }
                },
                axisTick: {
                    show: false
                },
                data: xData
            }],
            yAxis: [{
                name: '血压(mmHg)',
                type: 'value',
                scale: true,
                nameLocation: 'middle',
                nameRotate: 90,
                nameGap: 40,
                min: 10,
                axisLine: { //设置y轴的颜色
                    lineStyle: {
                        color: '#ffffff'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: '#eee'
                    }
                },
            }],

            series: seriesArr
        };

        myChart.setOption(option)
        window.addEventListener('resize', function () {
            myChart.resize()
        })
    })();
}
