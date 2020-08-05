//获取键盘回车快捷键
$(document).keyup(function(event){
    if(event.keyCode ==13){
        $("#submit-block").trigger("click");
    }
});
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
        $('#nav-episode').trigger("click");
        console.log(title +":"+url);
        video(url,title,sort,time);


    });

    //开始检索
    $("#submit-block").click(function () {
        search();
    });

});



//search function
function search(){
    //console.log("测试搜索按键");
    //搜索框 Alert
    $('#nav-result').trigger("click");
    var search_block = $("#search_box").val();
    if(!search_block){
        alert("搜索框不能为空");
        return;
    }
    //显示搜索结果panel
    $("#result").show();

    //返回搜索结果
    var interF_OK = "https://api.okzy.tv/api.php/provide/vod/at/json/?ac=detail";
    $.post(interF_OK,{
            wd: search_block
        },
        function (data,status){
            $("#result-tbody").empty();
            var jsonObj = jQuery.parseJSON(data);
            var list = jsonObj["list"];
            var number = 0;
            list.forEach((e,index)=>{
                var text = "<tr><td>" + (index+1) + "</td><td data='"+ e['vod_play_url'] +"'>" + e["vod_name"] + "</td><td>" + e["type_name"] + "</td><td>" + e["vod_year"] + "</td><td>"+"<a target='_blank' href='"+ e["vod_pic"] +"'>图源</a>"+ "</td></tr>";
                //console.log(e['vod_name']);
                $("#result-tbody").append(text);
                number = index+1;
            })
            $("#fail-alert").hide();
            $("#success-alert").hide();
            if(number == 0){
                $("#fail-alert").html("抱歉，未能找到相应的资源！请重新输入剧名。");
                $("#fail-alert").show();
            }else{
                $("#success-alert").html("已为您找到"+number+"个资源，请点击对应的词条。")
                $("#success-alert").show();
            }

            console.log(list);

        });


}


//episode detail
function video(url, title, sort, time) {
    $("#episode-tbody").empty();
    var Pri_split = url.split('$$$');
    var text = "";
    Pri_split.forEach(e=>{
        var split_url = e.split('#');
        for(let i = 0;i<split_url.length;i++){
            var Episode = split_url[i].split('$');
            if(Episode[1].includes('m3u8')) continue;
            text = text +"<tr><td>"+ (i+1) + "</td><td>" + title + "</td><td> <a target='_blank' href = '"+Episode[1]+"'>" + Episode[0] +"</a></td></tr>";
            //console.log(Episode[0]+":"+Episode[1]);
        }

    })
    $("#episode-tbody").append(text);
    //console.log(url);

}
//采集地址：https://api.okzy.tv/api.php/provide/vod/at/json/
// 视频列表地址：https://api.okzy.tv/api.php/provide/vod/at/json/?ac=list
// 视频详情地址：https://api.okzy.tv/api.php/provide/vod/at/json/?ac=detail

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