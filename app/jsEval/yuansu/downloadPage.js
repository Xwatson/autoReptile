var res = {};
var $pwd = document.querySelector("#download-page > div.tqma");
if ($pwd) {
  res.pwd = $pwd.innerHTML;
}
var $downloadBtn = document.querySelector("#download-page > a");
if ($downloadBtn) {
  res.action = "get_new_page_url";
  res.clickSelector = "#download-page > a";
}
res;
