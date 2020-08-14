//获取键盘回车快捷键
$(document).keyup(function(event){
    if(event.keyCode ==13){
        $("#submit-block").trigger("click");
    }
});


//browser icon选择器
browser_check_it();


$(document).ready(function () {
    //预设搜索内容
    //$("#search_box").val("千谎百计");

    //搜索结果表格被单击
    $("#result-tbody").on("click","tr",function(e)  {

        var index = $(this).find("td").eq(0).html();
        var url = $(this).find("td").eq(1).attr("data");
        var title = $(this).find("td").eq(1).html();
        var sort = $(this).find("td").eq(2).html();
        var time = $(this).find("td").eq(3).html();
        //模拟单击剧集页面
        $('#nav-episode').trigger("click");
        //console.log(title +":"+url);
        video(url,title,sort,time);
    });

    //开始检索
    $("#submit-block").click(function () {
        search();
        //模拟单击结果页面
        $('#nav-result').trigger("click");

    });

});



//search function
function search(){
    //console.log("测试搜索按键");

    //搜索框 空值提醒
    var search_block = $("#search_box").val();
    if(!search_block){
        alert("搜索框不能为空");
    } else{
        //显示等待
        show_waiting_alert();
        //清空结果
        $("#result-tbody").empty();
        //OK资源库
        OK_resource(search_block);
    }
}

//episode detail
function video(url, title, sort, time) {
    var episode_tbody = $("#episode-tbody");
    episode_tbody.empty();
    var Pri_split = url.split('$$$');
    var text = "";
    var m3u8 = "";
    Pri_split.forEach(e=>{
        var split_url = e.split('#');
        for(let i = 0;i<split_url.length;i++){
            var Episode = split_url[i].split('$');

            if(Episode[1].includes('m3u8')) {
                m3u8 = m3u8 +"<tr><td>"+ (i+1) + "</td><td>" + title + "</td><td> <a target='_blank' href = '"+Episode[1]+"'>" + Episode[0] +"</a></td></tr>";

            }else{
                text = text +"<tr><td>"+ (i+1) + "</td><td>" + title + "</td><td> <a target='_blank' href = '"+Episode[1]+"'>" + Episode[0] +"</a></td></tr>";
            }

            //console.log(Episode[0]+":"+Episode[1]);
        }
    });
    if($('input[name=browser]:checked').val() ==="Safari"){
        episode_tbody.append(m3u8);
        //console.log(m3u8);
    }else{
        episode_tbody.append(text);
    }
    //console.log(url);

}


/*
 OK采集地址：https://api.okzy.tv/api.php/provide/vod/at/json/
 OK视频列表地址：https://api.okzy.tv/api.php/provide/vod/at/json/?ac=list
 OK视频详情地址：https://api.okzy.tv/api.php/provide/vod/at/json/?ac=detail
*/
// OK资源采集
function OK_resource(value){
    var interF_OK = "https://api.okzy.tv/api.php/provide/vod/at/json/?ac=detail";
    $.post(interF_OK,{
            wd: value
        },
        function (data,status){
            //转化为JSON格式
            var jsonObj = jQuery.parseJSON(data);
            var list = jsonObj["list"];
            var number = 0;
            list.forEach((e,index)=>{
                var text = "<tr><td>" + (index+1) + "</td><td data='"+ e['vod_play_url'] +"'>" + e["vod_name"] + "</td><td>" + e["type_name"] + "</td><td>" + e["vod_year"] + "</td><td>"+"<a target='_blank' href='"+ e["vod_pic"] +"'>图源</a>"+ "</td></tr>";
                //console.log(e['vod_name']);
                $("#result-tbody").append(text);
                number = index+1;
            });
            //console.log(list);
            alert_info(number);
        });
}

//显示提醒
function alert_info(value){
    if(value === 0){
        $("#fail-alert span").text("(╯°Д°）╯ 没有啊！啥都没有啊！！！ 咱换个名字好不好啊   (;´༎ຶД༎ຶ`)");
        show_fail_alert();
        $("#result").fadeOut();
    }else{
        $("#success-alert span").text("٩(˃̶͈̀௰˂̶͈́)و  亲！我找到了"+value+"个资源，快进入词条看看吧  o(*////▽////*)q")
        show_success_alert();
        //显示搜索结果panel
        $("#result").fadeIn();
    }
}

//隐藏提示框
function hide_all_alert(){
    $("#fail-alert").hide();
    $("#success-alert").hide();
    $("#waiting-alert").hide();

}
//显示成功提示框
function show_success_alert(){
    $("#fail-alert").hide();
    $("#success-alert").slideDown();
    $("#waiting-alert").hide();
}
//显示失败提示框
function show_fail_alert() {
    $("#fail-alert").slideDown();
    $("#success-alert").hide();
    $("#waiting-alert").hide();

}
//显示等待提示框
function show_waiting_alert(){
    $("#fail-alert").hide();
    $("#success-alert").hide();
    $("#waiting-alert").slideDown();
}

// 选择 browser 适配 check icon
function browser_check_it(){

    var all_inputNode = $('input[name=browser]');
    for(let i =0;i < all_inputNode.length;i++){
        all_inputNode[i].parentElement.children[0].style.opacity = 0;
    }
    $('input[name=browser]:checked')[0].parentElement.children[0].style.opacity = 1;
}
//模拟切换浏览器
function browser_on_click() {
    browser_check_it();
}
//打开新窗口
function openWin(url,id){
    var a = $(document).createElement('a');
    a.setAttribute('href',url);
    a.setAttribute('target','_blank');
    a.setAttribute('id',id);
    a.click();
}

//转化 Unicode 为汉字
function ToChWords(data){
        if(data === '' || typeof data == 'undefined') return;
        data = data .split("\\u");
        var str = '';
        for(var i = 0 ; i < data.length;i++){
            if(data[i].length >6){
                str += data[i]
            }else{
                str += String.fromCharCode(parseInt(data[i],16).toString(10));
            }
        }
        return str;
    }
    /*
    清风api：http://api.ttupp.com/cgi/qingfeng
    参数：
        type=search,video
        jiekou= 1,2,3,4,5;
        value=
    http://api.ttupp.com/cgi/qingfeng?type=search&jiekou=5&value=
     */
