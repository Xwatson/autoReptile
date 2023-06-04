var res = { title: "", content: "", action: "", errMsg: "" };
try {
  res.title = document.querySelector(
    "#primary-home > article > header > h1"
  ).innerText;
  var $content = document.querySelector(
    "#primary-home > article > div.entry-content"
  );
  if ($content) {
    var $remove = $content.querySelector(".post-note");
    $remove && $remove.remove();
    $remove = $content.querySelector(".b2-audio-content");
    $remove && $remove.remove();

    var imgs = $content.querySelectorAll("img");
    if (imgs && imgs.length) {
      imgs.forEach(($img) => {
        const dataSrc = $img.getAttribute("data-src");
        if (dataSrc) {
          $img.setAttribute("src", dataSrc);
        }
      });
    }
    res.content = $content.innerHTML;
    res.content = res.content.replace(
      $content.querySelector(
        "#download-box > div > div.download-list > div > div.download-info > div.download-current"
      ).innerHTML,
      ""
    );
    res.apiPush = {
      action: "wordpress-postArticle",
      data: {
        title: res.title,
        content: res.content,
        status: "publish",
        categories: [7],
      },
    };
    var $login = $content.querySelector(".content-cap-login");
    var $dbb = $content.querySelector(
      "#download-box .download-button-box button"
    );
    var loginCode = `
      $login.click();
      setTimeout(() => {
        var $name = document.querySelector("#login-box input[name=username]");
        $name.value = "xwatson@foxmail.com";
        var $pwd = document.querySelector("#login-box input[name=password]");
        $pwd.value = "a123123.";
        var event = document.createEvent("HTMLEvents");
        event.initEvent("input", true, true);
        event.eventType = "message";
        $name.dispatchEvent(event);
        $pwd.dispatchEvent(event);
      }, 1000);
      setTimeout(() => {
        document.querySelector("#login-box .login-bottom > button").click();
      }, 1500);
    `;
    if ($login) {
      res.action = "login";
      res.loginType = "current";
      res.code = `
        var $content = document.querySelector(
          "#primary-home > article > div.entry-content"
        )
        var $login = $content.querySelector(".content-cap-login");
        ${loginCode}
      `;
    } else if ($dbb) {
      var downloadPermissions = (
        $content.querySelector(
          "#download-box > div > div.download-list > div > div.download-info > div.download-current > div"
        ) || { innerText: "" }
      ).innerText.includes("已获得下载");
      if (!downloadPermissions) {
        res.action = "login";
        res.loginType = "current";
        res.code = `
          var $login = document.querySelector("#page div.header-login-button > button.empty.mobile-hidden");
          ${loginCode}
        `;
      } else {
        res.action = "new_download_page";
        res.clickSelector = "#download-box .download-button-box button";
        res.code = `var res = { };
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
            `;
      }
    }
  } else {
    res.errMsg = `没有content元素。\n${document.innerHTML}`;
  }
} catch (error) {
  res.errMsg = `执行代码错误：\n${error}`;
}
res;
