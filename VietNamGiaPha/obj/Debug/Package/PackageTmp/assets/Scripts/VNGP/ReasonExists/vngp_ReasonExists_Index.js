$(document).ready(function () {
    //init home
    LyDoTonTai.func.init();
    var configs = {
        totalPages: 50,
        visiblePages: 1,
        startPage: 1,
    };
    //$('#paginationPost').twbsPagination(configs);
    //init post:
    /*
     postType: 0=> get All List Post
     postType: 1=> Dao ly lam nguoi
     postType: 2=> Lich su cac toc ho VN
     postType: 3=> Bai hoc song
     postType: 4=> To am
     postType: 5=> Right menu 
     */
    Post.func.init(configs);

    $(".Post_Menu").click(function () {
        var id = this.id;
        id = id[id.length - 1];
        Post.params.typeMenu = id;
        Post.func.clickMenu(configs);
;    });
});
var LyDoTonTai = {
    params: {

    },
    func: {
        init: function () {
            $.ajax({
                url: "/ReasonExists/init",
                type: "post",
                success: function (result) {
                    console.log(result[0].Reason);
                    var url = result[0].LinkYoutube;
                    url = "https://youtu.be/-wuBtEAU9es";
                    //url = "https://www.youtube.com/watch?v=Dq0d0GN8dfo";
                    url = url.replace("youtu.be", "www.youtube.com/watch?v=");
                    url = url.replace("watch?v=", "embed/");
                    console.log(url);
                    var iframe = `<iframe id="reason_linkyoutube" width="560" height="315" src="${url}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>
                   `;
                    var img = `/upload/giapha/${result[0].ImageThumbnail}`;
                    $("#reason_description").html(result[0].Description);
                    $("#reason_reason").html(result[0].Reason);
                    console.log(iframe);
                    //$('#reason_linkyoutube').attr('src', url);
                    $('#reason_linkyoutube').html(iframe);
                    $('#reason_imagethumbnail').attr('src', img);
                    //$("#reason_linkyoutube").html(result[0].Description);
                }
            });
        }
    }
}


var Post = {
    params: {
        //config for pagination master
        totalPages: 1000,//number of total page
        visiblePages: 3,//number of buttons page
        startPage: 1,//start page
        pageSize: 5,//number of post in 1 page
        currPage: 1,//current page
        txtSearch: "",
        typeMenu: 2,//default
    },
    func: {
        init: function (configs) {
            //init 
            Post.func.onload_loadPostInHome(configs);
        },
        onload_loadPostInHome: async (configs) => {
            var load_postMain = new Promise(function (resolve, reject) {
                Post.func.init_postMain(configs);
            });
            var load_postRightMenu = new Promise(function (resolve, reject) {
                Post.func.init_postRightMenu();
            });

            var res_postMain = await load_postMain;
            var res_postRightMenu = await load_postRightMenu;
        },
        init_postMain: function (configs) {
            var url = Post.func.getUrl({
                url: '/Post/getPostList',
                param: {
                    pageSize: -1,
                    pageSkip: -1,
                    txtSearchVN: "",
                    txtSearchEn: "",
                    type: Post.params.typeMenu,
                }
            });
            //home page: because first load Lich su cac toc ho VN, so type = 2
            //false because onload
            Post.func.beforeLoad(configs, url);
        },
        init_postRightMenu: function () {
            var typeRM = 0;
            var urlRM = Post.func.getUrl({
                url: '/Post/getPostList',
                param: {
                    pageSize: 10,
                    pageSkip: 0,
                    txtSearchVN: "",
                    txtSearchEn: "",
                    type: typeRM
                }
            });
            //get top 10 in all post for Right Nenu
            Post.func.getPostListRightMenu(urlRM);
        },
        beforeLoad: function (configs, url) {
            //function get all posts to calculate total number of pages and then get all post results
            
            $.ajax({
                url: url,
                success: function (result) {
                    console.log(result);
                    
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
            debugger
            //function declare twbsPagination
            $('#paginHome').twbsPagination('destroy');

            $('#paginHome').twbsPagination($.extend({}, configs, {
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
                    //call to function to load data at current page 
                    Post.func.loadData(page);
                }
            }));
        },
        loadData: function (currPage) {
          
                //setup parameters for url and then call to function get data
                var url = Post.func.getUrl({
                    url: '/Post/getPostList',
                    param: {
                        pageSize: Post.params.pageSize,
                        pageSkip: (currPage - 1) * Post.params.pageSize,
                        txtSearchVN: "",
                        txtSearchEn: "",
                        type: Post.params.typeMenu,
                    }
                });
                Post.func.getPostList(url);
            
        },
        clickMenu: function (configs) {
            //function get post list when click menu with id=typePost
           
            var url = Post.func.getUrl({
                url: '/Post/getPostList',
                param: {
                    pageSize: 5,
                    pageSkip: 0,
                    txtSearchVN: "",
                    txtSearchEn: "",
                    type: Post.params.typeMenu,
                }
            });
            /*
             isOnload: true => for first load
             isOnload: false => for when user click menu
             */
            Post.func.beforeLoad(configs, url, false);
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
        getPostList: function (url) {
            //function main: get post list
            console.log(url);
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
                                <div class="row col-md-12">
                                    <div class="col-md-2" style="margin-right: 10px;text-align: center;margin-top: 2%;margin-bottom: 2%;">
                                        <a href="/Post/Detail/${result[i].RootPostId}"><img src="/upload/posts/${result[i].ImageThumbnail}" alt="${result[i].ImageThumbnail}"></a>
                                    </div>
                                    <div class="col-md-9">
                                        <h2 style="color: white !important;"><a style="cursor:pointer !important;color:#e4ee4c !important;" href="/Post/Detail/${result[i].RootPostId}">${result[i].Title}</a></h2>
                                        <p class="my-fs-17">${result[i].TextThumbnail.substr(0,135)}...</p>

                                    </div>
                                </div>
                                <br/>
                            `;

                            /*
                             <div class="row col-md-12">
                                    <div class="col-md-5">
                                        <a href="/Post/Detail/${result[i].RootPostId}"><img src="/upload/posts/${result[i].ImageThumbnail}" alt="${result[i].ImageThumbnail}"></a>
                                    </div>
                                    <div class="col-md-7">
                                        <h2 style="color: white !important;"><a style="cursor:pointer !important;color:#e4ee4c !important;" href="/Post/Detail/${result[i].RootPostId}">${result[i].Title}</a></h2>
                                        <p>${result[i].TextThumbnail}</p>

                                    </div>
                                </div>
                                <br/>
                             */
                        }
                        $("#Post_listPost").html(content);
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
                        $("#Post_listPost").html(html);
                    }
                }
            });
        },
        getPostListRightMenu: function (url) {
            debugger
            //function get post list in right menu
            console.log(url);
            $.ajax({
                url: url,
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
                                            <p><a href="/Post/Detail/${result[i].RootPostId}">${result[i].Title}</a></p>
                                        </div>
                                        <div class="col-md-3">
                                            <a href="/Post/Detail/${result[i].RootPostId}"><img src="/upload/posts/${result[i].ImageThumbnail}" alt="${result[i].ImageThumbnail}"></a>
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
                        $("#Post_listPost").html(html);
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
