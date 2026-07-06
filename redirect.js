// 按浏览器语言跳转；默认英文
var zh = (navigator.language || "").toLowerCase().indexOf("zh") === 0;
location.replace(zh ? "zh/index.html" : "en/index.html");
