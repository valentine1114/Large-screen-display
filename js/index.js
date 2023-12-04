
(function () {// 今日睡眠

  let myChart = echarts.init(document.querySelector('.bar-second .chart'))
  var xArray = ["MON", "TUE", "WED", "THURS", "FRI", "SAT", "SUN"]; //X轴线数据
  var sleepStartArray = [23, 22, 23, 5, 20, 4, 21]; //睡眠开始时间
  var sleepEndArray = [8.5, 9, 7.2, 8.1, 8.8, 7.8, 9.4]; //睡眠结束时间
  var blockbottomData = [1, 3.5]; //下块
  var blocktopData = [8.8, 10.8]; //上块

  var flag1 = (blocktopData[0] - blockbottomData[1]).toFixed(2);
  var flag2 = (blocktopData[1] - blockbottomData[0]).toFixed(2);;

  var zdata = []; //如果出现0点之后睡觉的情况 用此数据进行垫底
  var hideData = []; //0点之前睡觉 用此数据进行垫底
  var flag = 0; //判断是否出现0点之后睡觉的情况
  for (var i = 0; i < sleepStartArray.length; i++) {
    //将起床时间和睡眠时间相比  如果起床时间大于睡眠时间则是0点之后睡觉 反则是0点之前
    if (sleepStartArray[i] * 1 > sleepEndArray[i] * 1) {
      hideData.push(sleepStartArray[i] * 1 - 24 * 1);
      sleepEndArray[i] = (24 - sleepStartArray[i] * 1) + sleepEndArray[i] * 1;
      zdata.push("-");
    } else {
      hideData.push("-");
      //跨了0点了！！
      flag = 1;
      zdata.push(sleepStartArray[i] * 1);
      //因为是堆叠 所以需要减去堆的值
      sleepEndArray[i] = ((sleepEndArray[i] * 1 - sleepStartArray[i] * 1).toFixed(1)) * 1;
    }
  }

  function getBarColor(index, params) {
    var _v;
    if (params == "yc") {
      _v = sleepEndArray[index] * 1;
      if (_v <= flag1) {
        return '#e0b01e';   //橙色
      } else if (_v <= flag2) {
        return '#A4BE7B';   //绿色
      } else {
        return '#343e75';   //深蓝色
      }
    } else {
      _v = params.value;
      if (_v <= flag1) {
        return '#e0b01e';
      } else if (_v <= flag2) {
        return '#A4BE7B';
      } else {
        return '#343e75';
      }
    }
  }
  var option = {
    title: {
      text: 'Sleep Quality Analysis',

      textStyle: {
        fontWeight: 'bolder',
        fontSize: 22,
        color: '#FFD56F',

      },
      left: '3%',
      textAlign: 'top',
      top: '5%',
      // subtext: 'wake up time',
      // sublink: 'https://www.cnblogs.com/lightmusic/p/12761239.html'
    },

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        var tar = params[1];
        return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value + 'hours';
      }
    },
    grid: {
      top: '18%',
      left: '3%',
      right: '10%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      axisLabel: {
        color: '#ADADAD',
        fontSize: "11"
      },
      axisLine: {
        lineStyle: {
          color: '#ADADAD',
        }
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: "#ADADAD"
        }
      },
      data: xArray
    }],
    yAxis: [{
      type: 'value',
      // min:-1,
      // max:15,
      // splineNumber:4,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#ADADAD'
        },
      },
      axisLabel: {
        show: true,
        interval: 'auto',
        color: '#ADADAD',
        fontSize: "11"
      },
      axisLine: {
        lineStyle: {
          color: '#ADADAD',
          width: 1
        },
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        formatter: function (value, index) {
          // console.log(value, index);
          if (value * 1 < 0) { //如果小于0 则进行替换
            return 24 - (Math.abs(value * 1)) + ' :00';
          }
          return value + ':00';
        }
      }
    }],
    series: [{
      name: '睡觉时间0点之前',
      type: 'bar',
      stack: '总量',
      itemStyle: {
        normal: {
          color: function (params) {
            return getBarColor(params.dataIndex, 'yc');
          }
        }
      },
      data: hideData
    },
    {
      name: "遮挡数据0点之后",
      stack: "总量",
      type: "bar",
      barGap: '-100%',
      itemStyle: {
        color: '#f3f3f3',
        borderColor: "#f3f3f3"
      },
      tooltip: {
        show: false
      },
      z: 0,
      data: zdata
    },
    {
      name: 'Sleep Duration',
      type: 'bar',
      stack: '总量',
      itemStyle: {
        // color:'#343e75',
        normal: {
          color: function (params) {
            //三重判断 1 2.5 - 9.3 10.8
            return getBarColor(null, params);
          }
        }
      },
      label: {
        show: true,
        position: 'inside',
        //   formatter:function(item){
        //       console.log(item);
        //     return item.value*1 + Math.abs(hideData[item.dataIndex])*1;
        //   }
      },
      tooltip: {
        show: true,
        //   formatter:function(item,index){
        //       console.log(item,index);
        //   }
      },
      data: sleepEndArray,
      z: 0,
      markArea: {
        silent: false,
        itemStyle: {
          color: "rgba(45,105,132,.4)",
        },
        label: {
          show: true,
          position: 'right',
          rotate: "-60",
          fontSize: "10"
        },
        data: [
          [{
            name: "Domain One",
            x: "星期一",
            yAxis: blocktopData[0]
          },
          {
            x: "星期日  ",
            yAxis: blocktopData[1]

          }
          ],

          [{
            name: "Domain Two",
            x: "星期一",
            yAxis: blockbottomData[0]
          },
          {
            x: "星期日",
            yAxis: blockbottomData[1]

          }
          ]
        ]
      }
    }
    ]
  };
  // console.log("垫底的数据", hideData);
  // console.log("结束时间", sleepEndArray);
  // console.log("zdata", zdata);
  // console.log("标值", flag1, flag2);
  myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
})();


(function () {//每日营养

  let myChart = echarts.init(document.querySelector('.line-second .chart'));
  let colors = ['#3b8686', '#79bd9a', '#a8dba8', '#cff09e', '#B7CE63', '#C7D59F', '#DADDD8', '#96C120'];
  option = {
    title: {
      text: 'Meal Structure',

      textStyle: {
        fontWeight: 'bolder',
        fontSize: 24,
        color: '#FFD56F',
      },
      left: '5%',
      top: '5%'

    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },

    legend: {
      orient: 'vertical',
      x: 'left',
      data: ['milk', 'beans', 'eggs', 'aquatic products', 'meat', 'nuts', 'vegetables', 'fruits', 'whole grains and beans', 'potatoes', 'sugar', ' oil', 'other'],
      show: false
    },
    grid: {
      left: "10",
      top: "30",
      right: "10",
      bottom: "3%",
      containLabel: true
    },
    series: [
      {
        name: 'Nutrition',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '30%'],

        label: {
          normal: {
            position: 'inner',

          }
        },
        itemStyle: {
          normal: {
            show: true,
            textStyle: {
              color: '#fff',
              fontSize: 20,
            },
            borderWidth: 1,
            borderColor: '#fff',
          },

          emphasis: {
            label: {
              show: true
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          { value: 1540, name: 'protein', selected: true, itemStyle: { color: colors[0] } },
          { value: 1620, name: 'fruit and vegetable', itemStyle: { color: colors[1] } },
          { value: 1200, name: 'staple food', itemStyle: { color: colors[2] } },
          { value: 200, name: 'others', itemStyle: { color: colors[3] } },
        ]
      },
      {
        name: 'Nutrition',
        type: 'pie',
        radius: ['40%', '55%'],
        itemStyle: {
          normal: {
            show: true,
            textStyle: {
              color: '#fff',
              fontSize: 20,
            },
            borderWidth: 1,
            borderColor: '#fff',
          },

          emphasis: {
            label: {
              show: true
            }
          }
        },
        data: [
          { value: 256, name: 'milk', itemStyle: { color: colors[4] } },
          { value: 256, name: 'beans', itemStyle: { color: colors[4] } },
          { value: 256, name: 'eggs', itemStyle: { color: colors[4] } },
          { value: 256, name: 'aquatic products', itemStyle: { color: colors[4] } },
          { value: 256, name: 'meat', itemStyle: { color: colors[4] } },
          { value: 260, name: 'nuts', itemStyle: { color: colors[4] } },
          { value: 800, name: 'vegetables', itemStyle: { color: colors[5] } },
          { value: 820, name: 'fruits', itemStyle: { color: colors[5] } },
          { value: 800, name: 'whole grains and beans', itemStyle: { color: colors[6] } },
          { value: 400, name: 'potatoes', itemStyle: { color: colors[6] } },
          { value: 100, name: 'suger', itemStyle: { color: colors[7] } },
          { value: 70, name: 'oil', itemStyle: { color: colors[7] } },
          { value: 30, name: 'other', itemStyle: { color: colors[7] } }
        ]
      },

    ]
  };
  myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
})();


(function () {// 能量消耗
  let myChart = echarts.init(document.querySelector('.line .chart'))
  var data = [];
  var labelData = [];
  for (var i = 0; i < 24; ++i) {
    data.push({
      value: Math.random() * 10 + 10 - Math.abs(i - 12),
      name: i + ':00'
    });
    labelData.push({
      value: 1,
      name: i + ':00'
    });
  }

  option = {
    title: {
      text: '',
      textStyle: {
        fontWeight: 'bolder',
        fontSize: 24,
        color: '#FFD56F',
      },
      right: '5%',
      top: '5%'
    },
    grid: {
      left: "5%",
      top: "5%",
      right: "5%",
      bottom: "5%",

    },

    color: ['#3D8361'],
    series: [{
      type: 'pie',
      data: data,
      roseType: 'area',
      itemStyle: {
        normal: {
          color: 'white',
          borderColor: '#3D8361'
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      label: {
        normal: {
          show: false
        }
      }
    }, {
      type: 'pie',
      data: labelData,
      radius: ['75%', '100%'],
      zlevel: -2,
      itemStyle: {
        normal: {
          color: '#3D8361',
          borderColor: 'white'
        }
      },
      label: {
        normal: {
          position: 'inside'
        }
      }
    }]
  };

  myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })

})();


(function () {// 综合得分
  let myChart = echarts.init(document.querySelector('.bar .chart'))
  var dataStyle = {
    normal: {
      label: { show: false },
      labelLine: { show: false },
      shadowBlur: 40,
      shadowColor: 'rgba(40, 40, 40, 0.5)',
    }
  };
  var placeHolderStyle = {
    normal: {
      color: 'rgba(0,0,0,0)',
      label: { show: false },
      labelLine: { show: false }
    },
    emphasis: {
      color: 'rgba(0,0,0,0)'
    }
  };
  option = {
    title: {

      text: 'Overall Ratings',
      subtext: '    B',
      textStyle: {
        fontWeight: 'bolder',
        fontSize: 24,
        color: '#FFD56F',

      },
      subtextStyle: {
        fontWeight: 'bolder',
        fontSize: 48,
        color: '#FFD56F',
      },

      right: '5%',
      top: '5%'
    },
    grid: {
      left: "10",
      top: "30",
      right: "10",
      bottom: "10",
      containLabel: true
    },
    color: ['#85b6b2', '#6d4f8d', '#cd5e7e', '#e38980', '#f7db88'],
    tooltip: {
      show: true,
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      itemGap: 12,

      top: '87%',
      data: ['01', '02', '03', '04', '05', '06']
    },
    toolbox: {
      show: true,
      // feature: {
      //   mark: { show: true },
      //   dataView: { show: true, readOnly: false },
      //   restore: { show: true },
      //   saveAsImage: { show: true }
      // }
    },
    series: [
      {
        name: 'Line 1',
        type: 'pie',
        clockWise: false,
        radius: [100, 120],
        itemStyle: dataStyle,
        hoverAnimation: false,

        data: [
          {
            value: 80,
            name: 'heart rate'
          },
          {
            value: 20,
            name: 'invisible',
            itemStyle: placeHolderStyle
          }

        ]
      },
      {
        name: 'Line 2',
        type: 'pie',
        clockWise: false,
        radius: [80, 100],
        itemStyle: dataStyle,
        hoverAnimation: false,

        data: [
          {
            value: 70,
            name: 'sleep quality'
          },
          {
            value: 60,
            name: 'invisible',
            itemStyle: placeHolderStyle
          }
        ]
      },
      {
        name: 'Line 3',
        type: 'pie',
        clockWise: false,
        hoverAnimation: false,
        radius: [55, 80],
        itemStyle: dataStyle,

        data: [
          {
            value: 80,
            name: 'energy consumption'
          },
          {
            value: 50,
            name: 'invisible',
            itemStyle: placeHolderStyle
          }
        ]
      },
      {
        name: 'Line 4',
        type: 'pie',
        clockWise: false,
        hoverAnimation: false,
        radius: [30, 55],
        itemStyle: dataStyle,

        data: [
          {
            value: 45,
            name: 'nutrution'
          },
          {
            value: 30,
            name: 'invisible',
            itemStyle: placeHolderStyle
          }
        ]
      },
      {
        name: 'Line 5',
        type: 'pie',
        clockWise: false,
        hoverAnimation: false,
        radius: [5, 30],
        itemStyle: dataStyle,

        data: [
          {
            value: 30,
            name: 'blood pressure'
          },
          {
            value: 30,
            name: 'invisible',
            itemStyle: placeHolderStyle
          }
        ]
      },

    ]
  };
  myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
})();


(function () {// 心率
  let myChart = echarts.init(document.querySelector('.pie .chart'))
  option = {
    name: 'heart rate',

    title: {
      text: '88 tb/s', //最近一次
      subtext: '      heart rate',
      textStyle: {
        fontWeight: 'bolder',
        fontSize: 48,
        color: '#FFFFFF',
      },
      subtextStyle: {
        fontWeight: 'bolder',
        fontSize: 24,
        color: '#FFD56F',
      },
      right: '5%',
      top: '5%'
    },
    grid: {
      left: '1%',
      right: '5%',
      bottom: '0%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      boundaryGap: false,
      data: ['0:00', '4:00', '8:00', '12:00', '16:00', '20:00'],
      axisLabel: {
        show: true,
        interval: 0,
        fontSize: 20,
        color: '#ffffff',
        fontWeight: 'bold'

      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
    }],
    yAxis: [{
      show: false,
      min: 80, //最低为最低减5
      max: 92, //最高为最高值加5
    }],
    series: [{
      name: 'heart rate',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      //        symbolSize: 2,
      showSymbol: true,
      //       color:'#ffffff',
      lineStyle: {
        normal: {
          width: 5,
          color: '#81B214',
          shadowBlur: 6,
          shadowColor: '#BFDCAE',
          shadowOffsetY: 8,
        }
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(1, 1, 1, 0, [{
            offset: 0,
            color: 'rgb(191, 220, 174,1)'
          }, {
            offset: 1,
            color: 'rgb(191, 220, 174,0.3)'
          }]),
        }
      },
      itemStyle: {
        normal: {
          color: '#fa8d55',
          borderColor: '#ffffff',
          borderWidth: 12,
        }
      },
      label: {
        normal: {
          show: true,
          position: 'top',
          color: '#ffffff',
          fontSize: 24,
        }
      },
      markLine: {
        lineStyle: {
          normal: {
            color: 'rgba(0,0,0,0.3)',
          },
        },
        data: [{
          name: 'top',
          label: {
            normal: {
              formatter: 'normal heart rate 100次/分',
              position: 'middle',
              fontSize: 18,
            }
          },
          yAxis: 100,//高100为界
        },
        {
          name: 'low',
          label: {
            normal: {
              formatter: 'normal heart rate 60次/分',
              position: 'middle',
              fontSize: 18,
            }
          },
          yAxis: 60,//高100为界

        }]
      },
      data: [86, 87, 87, 87, 86, 85]
    },]
  };
  myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
})();


(function () {// 血压图
  let myChart = echarts.init(document.querySelector('.pie-second .chart'))
  var startTime = '06:00';
  var endTime = '22:00';
  var HighYdata = [141, 150, 150, 151, 147, 151, 150, 151, 152, 151, 150, 151, 152, 147, 151, 150, 151, 152, 150, 151, 152, 152, 150, 150, 152];
  var xData = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00:00', '19:00:00', '20:00:00',
    '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00'
  ];
  var LowYdata = [83, 71, 86, 74, 83, 71, 84, 73, 87, 72, 84, 73, 85, 73, 71, 84, 83, 77, 77, 72, 74, 72, 74, 72, 84];
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
    data: HighYdata,
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
    data: LowYdata,
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


(function () {//每日步数
  let myChart = echarts.init(document.querySelector('.map1'))
  function getVirtulData(year) {
    year = year || '2022';
    var date = +echarts.number.parseDate(year + '-01-01');
    var end = +echarts.number.parseDate((+year + 1) + '-01-01');
    var dayTime = 3600 * 24 * 1000;
    var data = [];
    for (var time = date; time < end; time += dayTime) {
      data.push([
        echarts.format.formatTime('yyyy-MM-dd', time),
        Math.floor(Math.random() * 10000)
      ]);
    }
    return data;
  }

  var data = getVirtulData(2022);

  option = {
    // backgroundColor: '#404a59',

    // backgroundColor: rgba(255, 255, 255, 0.04),

    title: {
      top: 30,
      text: 'Step Count In the Past Year',

      textStyle: {
        fontWeight: 'bolder',
        fontSize: 24,
        color: '#FFD56F',
      },
      right: '5%',
      top: '5%'
    },
    grid: {
      top: '5%',
      left: '3%',
      right: '3%',
      bottom: '15%',
      containLabel: true
    },
    tooltip: {
      trigger: 'item'
    },

    legend: {
      top: '30',
      left: '100',
      data: ['Step Count', 'Top 12'],
      textStyle: {
        color: '#fff'
      }
    },
    calendar: [{
      top: 100,
      left: 'center',
      range: ['2022-01-01', '2022-06-30'],
      splitLine: {
        show: true,
        lineStyle: {
          color: '#000',
          width: 4,
          type: 'solid'
        }
      },
      yearLabel: {
        formatter: '{start}  1st',
        textStyle: {
          color: '#fff'
        }
      },
      itemStyle: {
        normal: {
          color: '#323c48',
          borderWidth: 1,
          borderColor: '#111'
        }
      }
    }, {
      top: 300,
      left: 'center',
      range: ['2022-07-01', '2022-12-31'],
      splitLine: {
        show: true,
        lineStyle: {
          color: '#000',
          width: 4,
          type: 'solid'
        }
      },
      yearLabel: {
        formatter: '{start}  2nd',
        textStyle: {
          color: '#fff'
        }
      },
      itemStyle: {
        normal: {
          color: '#323c48',
          borderWidth: 1,
          borderColor: '#111'
        }
      }
    }
    ],
    series: [
      {
        name: 'Step Count',
        type: 'scatter',
        coordinateSystem: 'calendar',
        data: data,
        symbolSize: function (val) {
          return val[1] / 500;
        },
        itemStyle: {
          normal: {
            color: '#ddb926'
          }
        }
      },
      {
        name: 'Step Count',
        type: 'scatter',
        coordinateSystem: 'calendar',
        calendarIndex: 1,
        data: data,
        symbolSize: function (val) {
          return val[1] / 500;
        },
        itemStyle: {
          normal: {
            color: '#ddb926'
          }
        }
      },
      {
        name: 'Top 12',
        type: 'effectScatter',
        coordinateSystem: 'calendar',
        calendarIndex: 1,
        data: data.sort(function (a, b) {
          return b[1] - a[1];
        }).slice(0, 12),
        symbolSize: function (val) {
          return val[1] / 500;
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        itemStyle: {
          normal: {
            color: '#f4e925',
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        zlevel: 1
      },
      {
        name: 'Top 12',
        type: 'effectScatter',
        coordinateSystem: 'calendar',
        data: data.sort(function (a, b) {
          return b[1] - a[1];
        }).slice(0, 12),
        symbolSize: function (val) {
          return val[1] / 500;
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        itemStyle: {
          normal: {
            color: '#f4e925',
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        zlevel: 1
      }
    ]
  };



  myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
})();



(function () {
  let myChart = echarts.init(document.querySelector('.no-hd .hd2'))
  var gauge_value = 758; //能力值取代码置于值于此处

  option = {
    backgroundColor: '',
    // title: {
    //   show: true,
    //   x: "center",
    //   y: "62%",

    //   //subtext: '幸运指数',
    //   textStyle: {
    //     fontSize: 14,
    //     fontWeight: 'bolder',
    //     fontStyle: 'normal',
    //     color: "#6eba44"
    //   }
    // },
    tooltip: {
      show: true,
      formatter: "{a}{b}:{c}",
      backgroundColor: '#6eba44',
      borderColor: '#6eba44',
      borderWidth: '1px',
      textStyle: {
        color: 'white'
      }
    },
    grid: {
      top: '10%',
      left: '3%',
      right: '3%',
      bottom: '5%',
      containLabel: true
    },
    series: [{
      name: 'Calorie Consumption',
      type: 'gauge',
      // startAngle: 180,
      // endAngle: 0,
      splitNumber: 10, //刻度数量
      min: 0,
      max: 1500,
      radius: '100%', //图表尺寸
      axisLine: {
        show: true,
        lineStyle: {
          width: 4,
          shadowBlur: 0,
          color: [
            [0.2, '#FFE75E'],
            [0.8, '#FFE75E'],
            [1, '#FFE75E']
          ]
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#FFE75E",
          width: 1
        },
        length: 10,
        splitNumber: 2
      },
      splitLine: {
        show: true,
        length: 20,
        lineStyle: {
          color: '#FFE75E'
        }
      },
      axisLabel: {
        distance: 10,
        textStyle: {
          color: "#FFE75E",
          fontSize: "18",
        },
        formatter: function (e) {
          return e;
        }
      },
      pointer: {
        show: true,
      },
      detail: { //指针评价
        show: true,
        offsetCenter: [0, 40],
        textStyle: {
          fontSize: 50,
          color: "#FFE75E"
        },

      },
      title: {
        textStyle: {
          fontSize: 30,
          fontWeight: 'bolder',
          fontStyle: 'normal',
          color: "#FFE75E"
        },
        offsetCenter: [0, 15]
      },
      data: [{
        name: "",
        value: Math.floor(gauge_value)
      }]
    }]
  };
  myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
})();
(function () {
  let myChart = echarts.init(document.querySelector('.no-hd .hd1'))
  var gauge_value = 6655; //能力值取代码置于值于此处

  option = {
    backgroundColor: '',
    title: {
      show: true,
      x: "center",
      y: "62%",

      //subtext: '幸运指数',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bolder',
        fontStyle: 'normal',
        color: "#6eba44"
      }
    },
    tooltip: {
      show: true,
      formatter: "{a}{b}:{c}",
      backgroundColor: '#6eba44',
      borderColor: '#6eba44',
      borderWidth: '1px',
      textStyle: {
        color: 'white'
      }
    },
    grid: {
      top: '10%',
      left: '3%',
      right: '3%',
      bottom: '5%',
      containLabel: true
    },
    series: [{
      name: 'Step Count',
      type: 'gauge',
      // startAngle: 180,
      // endAngle: 0,
      splitNumber: 10, //刻度数量
      min: 0,
      max: 10000,
      radius: '100%', //图表尺寸
      axisLine: {
        show: true,
        lineStyle: {
          width: 4,
          shadowBlur: 0,
          color: [
            [0.2, '#6eba44'],
            [0.8, '#6eba44'],
            [1, '#6eba44']
          ]
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: "#6eba44",
          width: 1
        },
        length: 10,
        splitNumber: 2
      },
      splitLine: {
        show: true,
        length: 20,
        lineStyle: {
          color: '#6eba44'
        }
      },
      axisLabel: {
        distance: 10,
        textStyle: {
          color: "#6eba44",
          fontSize: "18",
        },
        formatter: function (e) {
          return e;
        }
      },
      pointer: {
        show: true,
      },
      detail: { //指针评价
        show: true,
        offsetCenter: [0, 40],
        textStyle: {
          fontSize: 50,
          color: "#6eba44"
        },

      },
      title: {
        textStyle: {
          fontSize: 30,
          fontWeight: 'bolder',
          fontStyle: 'normal',
          color: "#6eba44"
        },
        offsetCenter: [0, 15]
      },
      data: [{
        name: "",
        value: Math.floor(gauge_value)
      }]
    }]
  };
  myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
})();