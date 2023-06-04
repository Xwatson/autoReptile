var res = { data: [], errMsg: "" };
try {
  var $list = document.querySelectorAll(
    "#scroller > div.vue-recycle-scroller__item-wrapper .vue-recycle-scroller__item-view"
  );
  $list.forEach(($item) => {
    var $id = $item.querySelector(`header a[class^="head-info_time"]'`);
    var id = $id.getAttribute("href");
    var time = $id.getAttribute("title");
    var $content = $item.querySelector(`.wbpro-feed-content`);
    var $as = $content.querySelectorAll("a");
    var as = [];
    if ($as.length) {
      as = $as.map(($a) => $a.getAttribute("href"));
      // $as.forEach(($a) => {
      //   $a.setAttribute("href", `https://weibo.com${href}`);
      // if (href.startsWith("https://")) {
      //   if (href.includes("url=")) {
      //     var url1 = href.substring(href.indexOf("url=")).replace("url=", "");
      //     var url = url1.substring(
      //       0,
      //       url1.indexOf("&") > -1 ? url1.indexOf("&") : void 0
      //     );
      //     $a.setAttribute("href", decodeURIComponent(url));
      //   } else if (href.startsWith("https://shop.sc.weibo.com")) {
      //     // 点击拿真url
      //   }
      //   // 否则本身就是真实地址不用管
      //   // TODO 拿到真实url判断平台进行推广连接转换
      // } else {
      //   // 微博内跳转加上前缀
      //   $a.setAttribute("href", `https://weibo.com${href}`);
      // }
      // });
    }
    var content = $content.innerHTML;
    var textContent = $content.innerText;
    res.data.push({
      id,
      time,
      content,
      textContent,
      as,
    });
  });
} catch (error) {
  res.errMsg = `执行代码错误：\n${error}`;
}

res;
