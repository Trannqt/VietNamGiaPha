$(document).ready(function () {
    var configs = {
        totalPages: 1,
        visiblePages: 1,
        startPage: 1,
    };
    $('#paginationPost').twbsPagination(configs);
    Post.func.init(configs);
});
var Post = {
    params: {
        totalPages: 1000,
        visiblePages: 3,
        startPage: 1,
        pageSize: 6,
        currPage: 1,
        txtSearch: "",
    },
    func: {
        init: function (configs) {
            var url = Post.func.getUrl({
                url: '/Post/getPostList',
                param: {
                    pageSize: -1,
                    pageSkip: -1,
                    txtSearchVN: "",
                    txtSearchEn: "",
                    type: 1
                }
            });
            Post.func.beforeLoad(configs, url);

            $("#btnSearch").click(function () {
                Post.params.txtSearch = $("#txtSearch").val();

                var txtSearchEn = Post.func.nonAccentVietnamese(Post.params.txtSearch);

                var url = Post.func.getUrl({
                    url: '/Post/getPostList',
                    param: {
                        pageSize: -1,
                        pageSkip: -1,
                        txtSearchVN: Post.params.txtSearch,
                        txtSearchEn: txtSearchEn,
                        type: 1
                    }
                });
                debugger
                Post.func.beforeLoad(configs, url);
            });
        },
        getUrl: function (
            {
                url = "",
                param
            }
        ) {
            var pa = url.indexOf("?") == -1 ? "?" : "";
            return url + pa + "&commandAction.pageSize=" + param.pageSize + "&commandAction.pageSkip=" + param.pageSkip + "&commandAction.txtSearchVN=" + param.txtSearchVN + "&commandAction.txtSearchEn=" + param.txtSearchEn + "&commandAction.type=" + param.type;
        },
        beforeLoad: function (configs, url) {
            $.ajax({
                url: url,
                success: function (result) {
                    debugger
                    if (result.length) {
                        Post.params.totalPages = result.length % Post.params.pageSize == 0 ? parseInt(result.length / Post.params.pageSize) : parseInt(result.length / Post.params.pageSize) + 1;
                        Post.params.startPage = 1;
                        Post.func.pagination(configs);
                    }
                    else {
                        Post.func.getPostList(url);
                    }
                }
            });
        },
        pagination: function (configs) {
            $('#paginationPost').twbsPagination('destroy');

            $('#paginationPost').twbsPagination($.extend({}, configs, {
                totalPages: Post.params.totalPages,
                visiblePages: Post.params.visiblePages,
                startPage: Post.params.startPage,
                first: '<<',
                last: '>>',
                next: '>',
                prev: '<',
                loop: false,
                initiateStartPageClick: true,
                onPageClick: function (event, page) {
                    Post.params.currPage = page;
                    Post.func.loadData(page);
                }
            }));
        },
        loadData: function (currPage) {
            var txtSearchEn = Post.func.nonAccentVietnamese(Post.params.txtSearch);

            var url = Post.func.getUrl({
                url: '/Post/getPostList',
                param: {
                    pageSize: Post.params.pageSize,
                    pageSkip: (currPage - 1) * Post.params.pageSize,
                    txtSearchVN: Post.params.txtSearch,
                    txtSearchEn: txtSearchEn,
                    type: 1
                }
            });
            Post.func.getPostList(url);
        },
        getPostList: function (url) {
            $.ajax({
                url: url,
                beforeSend: function () {
                    commonBase.loadingSkeleton("#Post_listPost", true);
                },
                success: function (result) {
                    var content = '';
                    console.log(result);
                    debugger
                    if (result.length) {
                        debugger
                        for (var i = 0; i < result.length; i++) {
                            content += `
                                <div class="col-sm-6 col-12">
                                    <div class ="list-bt"></div>
                                    <div class ="list-lr"></div>
                                    <div class ="list-it"></div>
                                    <div class ="list-ib"></div>
                                    <div class="blog-item blog-item-3" style="margin: 19px;">
		                                    <div class="col-w-3" style="height: 100px;width: 150px;">
			                                    <a id="mnews1_rpt_news_HyperLink4_0" href="/Post/Detail/${result[i].RootPostId}"><img class="img-responsive" src="/upload/posts/${result[i].ImageThumbnail}" alt="${result[i].Title}" style="height: 100%;"></a>
		                                    </div>
                                        <div class="col-w-9 blog-content">
                                            <h2 class="blog-title">
                                                <a id="mnews1_rpt_news_HyperLink5_0" href="/Post/Detail/${result[i].RootPostId}">${result[i].Title}</a>
                                            </h2>
                                            <h3>
                                                <span class ="more">${result[i].TextThumbnail.substr(0,135)}...</span>
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                            `
                        }
                        $("#Post_listPost").html('');
                        $("#Post_listPost").html(content);
                        $("#paginationPost").show();
                    }
                    else {
                        debugger
                        var html = `
                            <div class="row" style="margin:0 auto;">
                                <div class="col-md-12">
                                    <h1 class="title title-2 cl-gold title-bor">
                                        <span class ="title-heading">
                                            Không có kết quả
                                        </span>
                                    </h1>
                                </div>
                            </div>
                        `
                        $("#Post_listPost").html(html);
                        $("#paginationPost").hide();
                    }
                }
            });
        },
        nonAccentVietnamese: function (str) {
            str = str.toLowerCase();
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            // Some system encode vietnamese combining accent as individual utf-8 characters
            str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
            str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
            return str;
        }
    }
}
