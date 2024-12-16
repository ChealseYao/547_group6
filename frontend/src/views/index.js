export const getOptions = (obj) => {
  const pieData = [
    {
      name: 'POSITIVE',
      value: obj.POSITIVE
    },
    {
      name: 'NEGATIVE',
      value: obj.NEGATIVE
    },
    {
      name: 'NEUTRAL',
      value: obj.NEUTRAL
    },
    {
      name: 'MIXED',
      value: obj.MIXED
    }
  ]

  const pieCenter = ['35%', '50%']

  const option = {
    color: [
      '#FFEF00',
      '#00E899',
      '#006FFF',
      '#73d0fd',
      '#25C1F1',
      '#C4F9F3',
      '#E062AE',
      '#8378EA',
      '#C4F926',
      '#FF5722',
      '#ffd32a',
      '#3c40c6',
      '#ffa801'
    ],
    tooltip: {
      show: true
    },
    legend: {
      show: true,
      orient: 'vertical',
      right: '8',
      top: '18',
      itemWidth: 18,
      itemHeight: 18,
      itemGap: 18,
      formatter(name) {
        const singleData = pieData.filter((item) => item.name === name)
        return `${name} | ${singleData[0].value}`
      }
    },
    series: [
      {
        type: 'pie',
        zlevel: 4,
        radius: ['0%', '7%'],
        center: pieCenter,
        silent: true,
        clockwise: false,
        label: {
          show: false
        },
        data: [
          {
            name: null,
            value: 0,
            itemStyle: {
              color: '#FFF'
            }
          }
        ]
      },
      {
        type: 'pie',
        radius: ['0%', '15%'],
        center: pieCenter,
        zlevel: 3,
        silent: true,
        clockwise: false,
        label: {
          show: false
        },
        data: [
          {
            name: null,
            value: 0,
            itemStyle: {
              color: 'rgba(255,255,255, 0.5)'
            }
          }
        ]
      },
      {
        type: 'pie',
        zlevel: 1,
        radius: ['70%', '0%'],
        center: pieCenter,
        silent: true,
        clockwise: false,
        label: {
          show: false
        },
        data: [
          {
            name: null,
            value: 0,
            itemStyle: {
              color: 'rgba(255,255,255, 0.1)'
            }
          }
        ]
      },
      // Data Source
      {
        type: 'pie',
        roseType: true,
        clockwise: false,
        center: pieCenter,
        zlevel: 2,
        radius: ['4%', '70%'], 
        itemStyle: {
          borderRadius: 4
        },
        data: pieData,
        label: {
          show: true
        }
      }
    ]
  }
  return option
}
export const getOptions1 = (a) => {
  let xAxisData = [],
    POSITIVE = [],
    NEGATIVE = [],
    NEUTRAL = [],
    MIXED = []
  // let a =  {
  //     "2024-11-01": {
  //         "POSITIVE": 1,
  //         "NEGATIVE": 2,
  //         "NEUTRAL": 2,
  //         "MIXED": 1,
  //         "total": 6
  //     },
  //     "2024-11-02": {
  //         "POSITIVE": 1,
  //         "NEGATIVE": 2,
  //         "NEUTRAL": 1,
  //         "MIXED": 1,
  //         "total": 5
  //     },
  //     "2024-11-05": {
  //         "POSITIVE": 1,
  //         "NEGATIVE": 2,
  //         "NEUTRAL": 1,
  //         "MIXED": 1,
  //         "total": 5
  //     }
  // }

  for (let key in a) {
    xAxisData.push(key.split('-')[2])
    POSITIVE.push(a[key].POSITIVE)
    NEGATIVE.push(a[key].NEGATIVE)
    NEUTRAL.push(a[key].NEUTRAL)
    MIXED.push(a[key].MIXED)
  }
  console.log(xAxisData)
  const option = {
    title: {
      textStyle: {
        color: 'rgba(131, 162, 192, 1)',
        fontSize: 12
      },
      top: '4%',
      left: '2%'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['POSITIVE', 'NEGATIVE', 'NEUTRAL', 'MIXED'],
      icon: 'rich',
      show: true,
      itemWidth: 14,
      itemHeight: 14,
      orient: 'horizontal', 
      left: 'center',
      top: 'bottom',
      itemGap: 34
    },
    grid: {
      left: '4%',
      right: '4%',
      bottom: '10%',
      top: '16%',
      containLabel: true
    },
    xAxis: {
      data: xAxisData,
      type: 'category',
      axisLine: {
        symbol: 'none',
        lineStyle: {
          color: '#B4C0CC'
        }
      },
    },
    yAxis: {
      type: 'value',
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.12)',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: 'POSITIVE',
        type: 'line',
        data: POSITIVE,
        smooth: true,
        color: 'rgba(12, 245, 229, 1)',
        lineStyle: {
          width: 2
        },
        showSymbol: false
      },
      {
        name: 'NEGATIVE',
        data: NEGATIVE,
        type: 'line',
        smooth: true,
        color: '#FFEB3B',
        lineStyle: {
          width: 2
        }
      },
      {
        name: 'NEUTRAL',
        data: NEUTRAL,
        type: 'line',
        smooth: true,
        color: '#FFEB3B',
        lineStyle: {
          width: 2
        }
      },
      {
        name: 'MIXED',
        data: MIXED,
        type: 'line',
        smooth: true,
        color: '#FFEB3B',
        lineStyle: {
          width: 2
        }
      }
    ]
  }
  return option
}
