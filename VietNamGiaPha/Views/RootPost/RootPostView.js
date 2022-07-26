$(document).ready(function () {
    Post.func.getPostById();
    GetPostListRightMenu({
        url: '/RootPost/ApiRootPostList',
        param: {
            CommandAction: {
                Item: {
                    pageSize: 10,
                    pageSkip: 0,
                    type: CommonParams.POST_TYPE.GET_ALL
                },
                isFirstLoad: false,
            }
        }
    });
});
function GetPostListRightMenu(options) {
    $.ajax({
        url: options.url,
        data: options.param,
        type: "POST",
        success: function (result) {
            var content = `
                    <marquee scrolldelay="10" scrollamount="10" onmouseover="this.stop()" onmouseout="this.start()" onload="this.start()" direction="up" style="height:700px !important;">
                    `;
            console.log("RM");
            console.log(result);
            debugger
            if (result.length) {
                debugger
                for (var i = 0; i < result.length; i++) {
                    content += `
                            
                                <div class="row" style="min-height:140px;">
                                        <div class="col-md-7" style="margin-left: 35px;">
                                            <p><a href="/RootPost/RootPostView/${result[i].RootPostId}">${result[i].Title}</a></p>
                                        </div>
                                        <div class="col-md-3">
                                            <a href="/RootPost/RootPostView/${result[i].RootPostId}"><img src="/assets/upload/posts/${result[i].ImageThumbnail}" alt="${result[i].ImageThumbnail}"></a>
                                        </div>
                                    </div>
                           
                            `;
                }
                content += ` </marquee>`;
                $("#Post_resultRightMenu").html(content);
            }
            else {
                debugger
                var html = `
                            <div class="row" style="margin:0 auto;">
                                <div class="col-md-12">
                                    <h1 class="title title-2 cl-gold title-bor">
                                        <span class ="title-heading">
                                            Không có bài viết nào
                                        </span>
                                    </h1>
                                </div>
                            </div>
                        `
                $("#Post_resultRightMenu").html(html);
            }
        }
    });
};
var Post = {
    params: {

    },
    func: {
        getPostById: function () {
            var url = window.location.href;
            var tmp = url.split('/');
            var id = tmp[tmp.length - 1];
            var commandAction = {
                Id: id
            };
            $.ajax({
                url: "/RootPost/ApiRootPostGetById",
                type: "post",
                data: {
                    commandAction: commandAction
                },
                success: function (result) {
                    if (result.length) {
                        debugger
                        $("#post_postTitle").text(result[0].Title);
                        $("#post_postDescription").html(result[0].Description);
                        var urlShare = `https://giaphavietfree.somee.com/Post/Detail/${id}`;
                        //console.log(result[0].CreateDate.substr(0, 10));
                        var htmlFooter = `
                            <div class ="row">
                                <div class ="col-6">
                                    <span>
                                        <i class="fa fa-calendar-check-o" aria-hidden="true"></i> Ngày đăng : ${result[0].CreateDate != null ? result[0].CreateDate.substr(0, 10) : ""}
                                    </span>
                                </div>
                                <div class ="col-6 text-right">
                                    <span>
                                        <i class="fa fa-share-alt-square" aria-hidden="true"></i> Chia sẻ :
                                    </span>
                                    <span>
                                        <a href="https://www.facebook.com/sharer/sharer.php?u=${urlShare}" id="news1_facebook" class="f-share">
                                            <i class="fa fa-facebook" aria-hidden="true"></i>
                                        </a>
                                    </span>
                                </div>
                            </div>
                        `;
                        /*<span>|</span><span>
                            <i class="fa fa-eye" aria-hidden="true"></i> Lượt xem : ${result[0].ViewCount}
                        </span>*/
                        $("#post_postFooter").html(htmlFooter);
                    }
                    else {
                        $("#post_postTitle").text("BÀI VIẾT");
                        $("#post_postDescription").html("CHƯA MÔ TẢ...");
                        var htmlFooter = `
                            <div class ="row">
                                <div class ="col-6">
                                    <span>
                                        <i class="fa fa-calendar-check-o" aria-hidden="true"></i> Ngày đăng : 
                                    </span>
                                </div>
                                <div class ="col-6 text-right">
                                    <span>
                                        <i class="fa fa-share-alt-square" aria-hidden="true"></i> Chia sẻ :
                                    </span>
                                    <span>
                                        <a href="javascript:;" id="news1_facebook" class="f-share">
                                            <i class="fa fa-facebook" aria-hidden="true"></i>
                                        </a>
                                    </span>
                                </div>
                            </div>
                        `;
                        $("#post_postFooter").html(htmlFooter);
                    }
                }
            });
        }
    }
}