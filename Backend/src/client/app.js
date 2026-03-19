function syntaxHighlight(json) {
  if (typeof json != 'string') json = JSON.stringify(json, undefined, 2);
  json = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = 'log-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'log-keyword';
        } else {
          cls = 'log-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'log-keyword';
      } else if (/null/.test(match)) {
        cls = 'log-keyword';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    },
  );
}

const socket = io('http://localhost:3000');
const statusEl = document.getElementById('connectionStatus');
const statusText = document.getElementById('statusText');

const tempValue = document.getElementById('tempValue');
const tempDevice = document.getElementById('tempDevice');
const tempTime = document.getElementById('tempTime');

const humValue = document.getElementById('humValue');
const humDevice = document.getElementById('humDevice');
const humTime = document.getElementById('humTime');

const logContainer = document.getElementById('logContainer');

socket.on('connect', () => {
  statusEl.classList.remove('disconnected');
  statusText.textContent = 'Live System Connected';
});

socket.on('disconnect', () => {
  statusEl.classList.add('disconnected');
  statusText.textContent = 'System Disconnected';
});

socket.on('device_data', (data) => {
  const payload = typeof data === 'string' ? JSON.parse(data) : data;
  const date = new Date(payload.time || Date.now());
  const timeStr = date.toLocaleTimeString();

  // Temperature update
  if (payload.temperature !== undefined) {
    const currentTemp = parseFloat(payload.temperature).toFixed(1);
    if (tempValue.textContent !== currentTemp) {
      tempValue.textContent = currentTemp;
      triggerAnimation(tempValue);
    }
  }
  tempDevice.textContent = `${payload.gatewayId || 'GW'} / ${payload.deviceId || 'DEV'}`;
  tempTime.textContent = timeStr;

  // Humidity update
  if (payload.humidity !== undefined) {
    const currentHum = parseFloat(payload.humidity).toFixed(1);
    if (humValue.textContent !== currentHum) {
      humValue.textContent = currentHum;
      triggerAnimation(humValue);
    }
  }
  humDevice.textContent = `${payload.gatewayId || 'GW'} / ${payload.deviceId || 'DEV'}`;
  humTime.textContent = timeStr;

  addLogEntry(payload, date);
});

function triggerAnimation(element) {
  element.classList.remove('value-update');
  void element.offsetWidth; // trigger reflow
  element.classList.add('value-update');
}

function addLogEntry(data, date) {
  if (logContainer.querySelector('div[style]')) {
    logContainer.innerHTML = '';
  }

  const timeStr = date.toISOString().split('T')[1].slice(0, 12); // HH:MM:SS.mmm

  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `<span class="log-time">[${timeStr}]</span> RCV ➔ ${syntaxHighlight(data)}`;
  logContainer.prepend(entry);

  if (logContainer.children.length > 50) {
    logContainer.removeChild(logContainer.lastChild);
  }
}
