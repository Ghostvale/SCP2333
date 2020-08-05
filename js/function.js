$("#search_box").val("隐秘的角落");
//提交搜索框
$("#submit_block").click(function () {
    search();
})
//搜索方程
function search(){
    //console.log("测试搜索按键");
    var search_block = $("#search_box").val();
    if(!search_block){
        alert("搜索框不能为空");
        return;
    }

    var interF_OK = "https://api.okzy.tv/api.php/provide/vod/at/json/?ac=detail"
    $.post(interF_OK,{
            wd: search_block
        },
        function (data,status){
         var jsonObj = jQuery.parseJSON(data);
         var list = jsonObj["list"];
         list.forEach((e,index)=>{
             var text = "<tr><td>" + index + 1 + "</td><td data=" + e["vod_play_url"] + ">" + e["vod_name"] + "</td><td>" + e["type_name"] + "</td><td>" + e["vod_year"] + "</td></tr>";
             $("#result-table").append(text);
         })


            //var text ="<tr><td>" + ToChWords(name) + "</td></tr>";
            //var text = "<tr><td>" + name + "</td><td data=" + element.url + ">" + element.title + "</td><td>" + element.sort + "</td><td>" + element.time + "</td></tr>";
            //$("#search_result").append(text);
            //$("#content").html(ToChWords(name));
            //console.log(ToChWords(name))
            console.log(list);

        });

}

//采集地址：https://api.okzy.tv/api.php/provide/vod/at/json/
// 视频列表地址：https://api.okzy.tv/api.php/provide/vod/at/json/?ac=list
// 视频详情地址：https://api.okzy.tv/api.php/provide/vod/at/json/?ac=detail






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