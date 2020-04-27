// ベースURL
const baseUrl        = `http://weather.livedoor.com/forecast/webservice/json/v1`
// 横浜市のコード
const cityCode       = '140010'
// webhook
const webhookUrl     = 'ここに自分のwebhook URLを記載する'

function main () {
  const url          = setWeatherUrl()
  const weatherData  = fetchWeatherApi(url)
  const cityName     = weatherData.location.city
  const tomorrowData = weatherData.forecasts[1]
  const date         = tomorrowData.date
  const weather      = replaceWeatherText(tomorrowData.telop)
  const [min, max]   = getTemperature(tomorrowData)

  const [cityMessage, weatherMessage, temperatureMessage] = returnMessage(cityName, date, weather, min, max)
  const text1        = cityMessage
  const text2        = weatherMessage + temperatureMessage
  const emoji        = getWeatherEmoji(weather)

  sendToSlack(text1, text2, emoji)
}

// リクエストURLを作成
function setWeatherUrl () {
  const requestUrl = `${baseUrl}?city=${cityCode}`
  return requestUrl
}

// お天気API叩く
function fetchWeatherApi (url) {
  const response = UrlFetchApp.fetch(url)
  return JSON.parse(response.getContentText())
}

// 天気のテキストを置換
function replaceWeatherText (text) {
  // 晴れ、晴 → 晴れ
  // 曇り、曇 → くもり
  // 時々 → ときどき
  return text.replace(/晴+れ*/, '晴れ').replace(/曇+り*/, 'くもり').replace(/時々/, 'ときどき')
}

// 最低気温と最高気温を返す
function getTemperature (data) {
  const min = data.temperature.min.celsius
  const max = data.temperature.max.celsius
  return [min, max]
}

// お天気情報を、Slackに送る形へ成形
function returnMessage (cityName, date, weather, min, max) {
  // ex: 横浜 明日 ( yyyy-mm-dd ) の天気
  const cityMessage        = `${cityName} 明日 \( ${date} \) の天気`
  const weatherMessage     = `【 ${weather} 】\n`
  const temperatureMessage = `最高気温：${max}度 \/ 最低気温：${min}度\n`
  return [cityMessage, weatherMessage, temperatureMessage]
}

// 天気に対応した絵文字を返す
function getWeatherEmoji (weather) {
  let emoji = null
  switch (weather) {
    case '晴れ':
      emoji = ':sunny:'
      break
    case 'くもり':
      emoji = ':cloud:'
      break
    case '雨':
      emoji = ':umbrella:'
      break
    case '雪':
      emoji = ':snowman:'
      break
    default:
      if (/晴れ*.?雨*/.test(weather) && /雨/.test(weather)) {
        // 晴れと雨
        emoji = ':partly_sunny_rain:'
      } else if (/晴れ/.test(weather) && /くもり/.test(weather)) {
        // 晴れとくもり
        emoji = ':mostly_sunny:' 
      } else if (/晴れ/.test(weather) && /雪/.test(weather)) {
        // 晴れと雪
        emoji = ':sunny: :snowman_without_snow:'
      } else if (/くもり/.test(weather) && /雨/.test(weather)) {
        // くもりと雨
        emoji = ':rain_cloud:'
      } else if (/くもり/.test(weather) && /雪/.test(weather)) {
        // くもりと雪
        emoji = ':snow_cloud:'
      } else if (/雨/.test(weather) && /雪/.test(weather)) {
        // 雨と雪
        emoji = ':snow_cloud:'
      } else {
        // その他：暫定でドクターの絵文字
        emoji = ':male-doctor:'
      }
      break
  }
  return emoji
}

// Slackにメッセージを送る
function sendToSlack (text1, text2, emoji) {
  const jsonData = {
    'icon_emoji': emoji,
    'text':       text1,
    'attachments': [
      { 'text': text2 }
    ]
  }
  const payload = JSON.stringify(jsonData)
  const options = {
    'method':      'post',
    'contentType': 'application/json',
    'payload':     payload
  }
  UrlFetchApp.fetch(webhookUrl, options);
}
