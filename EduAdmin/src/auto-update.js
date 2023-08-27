import { Modal } from 'antd'
let lastSrcs; //上次获取到的script地址
const scriptReg = /<script\s+defer\s*=\s*[^"'<>]+\s+src\s*=\s*([^"'<>]+)\s*>/g;
/**
* 获取页面中最新的script链接
* @param
* @returns
*/
async function extractNewScript() {
  let url = process.env.REACT_APP_ENVIRONMENT === 'production' ? './?_timestamp=' + Date.now() : '/?_timestamp=' + Date.now();
  const html = await fetch(url).then((resp) => resp.text());
  scriptReg.lastIndex = 0;
  let result = [];
  let match;
  while ((match = scriptReg.exec(html))) {
    result.push(match[1]);
  }
  return result;
}

async function needUpdate() {
  const newScripts = await extractNewScript();
  if (!lastSrcs) {
    lastSrcs = newScripts;
  }
  let result = false;
  if (lastSrcs.length !== newScripts.length) {
    result = true;

  }
  for (let i = 0; i < lastSrcs.length; i++) {
    if (lastSrcs[i] !== newScripts[i]) {
      result = true;
      break;
    }
  }
  lastSrcs = newScripts;
  return result;

}

const DURATION = 2000;
function autoRefresh() {
  setTimeout(async () => {
    const willUpdate = await needUpdate();
    if (willUpdate) {
      Modal.confirm({
        title: '检测到有新版本，请刷新页面',
        content: '点击确定刷新页面',
        okText: '确定',
        okCancel: false,
        onOk: () => {
          window.location.reload();
        },
      });
    }
    autoRefresh();
  }, DURATION);
}
if (process.env.REACT_APP_ENVIRONMENT == 'production') {
  console.log('环境:', process.env.REACT_APP_ENVIRONMENT)
  autoRefresh();
} else {
  console.log('环境:', process.env.REACT_APP_ENVIRONMENT)
}
