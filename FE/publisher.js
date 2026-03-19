const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://localhost:1883");

const topic = "gateway/device/data";

// random toạ độ trong Việt Nam
function randomVietnamLocation() {
  const lat = (Math.random() * (23.5 - 8.5) + 8.5).toFixed(5);
  const lon = (Math.random() * (109.5 - 102) + 102).toFixed(5);
  return { lat, lon };
}

client.on("connect", () => {
  console.log("Gateway connected to EMQX");

  setInterval(async () => {
    try {
      const { lat, lon } = randomVietnamLocation();

      // lấy tên tỉnh từ OpenStreetMap
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        {
          headers: {
            "User-Agent": "iot-weather-gateway",
          },
        },
      );

      const geoData = await geoRes.json();

      const province =
        geoData.address.state ||
        geoData.address.city ||
        geoData.address.province ||
        "Unknown";
      console.log(province, "province");

      // gọi API thời tiết
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m`,
      );

      const weather = await weatherRes.json();

      const payload = {
        gatewayId: "gw01",
        deviceId: province.replace(/\s/g, "-"),
        latitude: lat,
        longitude: lon,
        temperature: weather.current.temperature_2m,
        humidity: weather.current.relative_humidity_2m,
        time: new Date(),
      };

      client.publish(topic, JSON.stringify(payload));

      console.log("Publish:", payload);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }, 1000);
});
