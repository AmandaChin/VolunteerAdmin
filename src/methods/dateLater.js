export function formatDates(date, fmt) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
  
    var hours = date.getHours()
    var days = date.getDate()
    // var month = date.getMonth() + 1
    // var year = date.getFullYear()
    if (hours + 8 > '24') {
      hours = hours - 16
      days = days + 1
    } else {
      hours = hours + 8
    }
    if (hours + 8 == '24'){
        hours = '00'
    }
  
    // if (days == ' ') {
    //   if (month === '2' || month === '4' || month === '6' || month == '8' || month == '9' || month == '11' || month == '1') {
    //     days = '31'
    //     month = month - 1
    //   } else if (month === '3') {
    //     if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
    //       days = '29'
    //       month = month - 1
    //     } else {
    //       days = '28'
    //       month = month - 1
    //     }
    //   } else {
    //     days = '30'
    //     month = month - 1
    //   }
    // }
  
    const o = {
    //   'M+': month,
      'M+': date.getMonth() + 1,
      'd+': days,
      // 'd+': date.getDate(),
      'h+': hours,
      // 'h+': date.getHours() -8,
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (const k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        const str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
      }
    }
    return fmt
  }
  
  function padLeftZero(str) {
    return ('00' + str).substr(str.length)
  }