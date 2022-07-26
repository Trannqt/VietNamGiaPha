const _PAGESIZE = 6;
const _PAGESKIP = 0;
const _VISIBLEPAGES = 3;
$(document).ready(function () {

    var paramsFirstLoadPostList = {
        pageSize: -1,
        pageSkip: -1,
        txtSearch: "",
        type: CommonParams.POST_TYPE.GET_ALL
    };
    var paramsLoadPostList = {
        pageSize: _PAGESIZE,
        pageSkip: _PAGESKIP,
        txtSearch: "",
        type: CommonParams.POST_TYPE.GET_ALL
    };
    var urlRequest = '/RootPost/ApiRootPostList';
    var commandActionFirstLoadPostList = {
        Item: paramsFirstLoadPostList,
        isFirstLoad: true,
    }
    var commandActionLoadPostList = {
        Item: paramsLoadPostList,
        isFirstLoad: false,
    }


    var rootPostClass = new RootDataClass({
        url: urlRequest,
        commandAction: commandActionFirstLoadPostList,
        totalPages: 1,
        pageSize: _PAGESIZE,
    });

    var configsPagination = {
        element: ".paginationPost",
        configs: {
            totalPages: 10,
            visiblePages: _VISIBLEPAGES,
            startPage: 1,
            firstPage: '<<',
            lastPage: '>>',
            nextPage: '>',
            prevPage: '<',
            loop: false,
            initiateStartPageClick: false,
        },
        callback: async function (currPage) {
            var txtSearch = $("#txtSearch").val();

            $.extend(paramsLoadPostList, {
                pageSkip: (currPage - 1) * _PAGESIZE,
                txtSearch: txtSearch,
            });
            $.extend(commandActionLoadPostList, {
                Item: paramsLoadPostList
            });
            rootPostClass.setCommandAction(commandActionLoadPostList);
            var responseData = await rootPostClass.executeGetDataListAsync();
            renderRootPostListHTML(responseData);
        }
    };
    var paginationClass = new IPaginationClass(configsPagination);

    rootPostClass.loadData(commandActionFirstLoadPostList, commandActionLoadPostList,
        function (responseData) {
            //handle data
            console.log(responseData);
            renderRootPostListHTML(responseData);
        },
        function () {
            var dataItem = rootPostClass.getDataItem();
            paginationClass.loadPage(dataItem);
        }
    );


    $("#btnSearch").click(function (e) {
        e.preventDefault();
        debugger
        var txtSearch = $("#txtSearch").val();

        var ItemFirstLoad = {};
        $.extend(ItemFirstLoad, paramsFirstLoadPostList, {
            txtSearch: txtSearch,
        });
        $.extend(commandActionFirstLoadPostList, {
            Item: ItemFirstLoad,
            isFirstLoad: true
        });

        var ItemNotFirstLoad = {};
        $.extend(ItemNotFirstLoad, paramsLoadPostList, {
            pageSize: _PAGESIZE,
            pageSkip: _PAGESKIP,
            txtSearch: txtSearch,
            type: CommonParams.POST_TYPE.GET_ALL,
        });
        $.extend(commandActionLoadPostList, {
            Item: ItemNotFirstLoad,
            isFirstLoad: false,
        });

        rootPostClass.loadData(commandActionFirstLoadPostList, commandActionLoadPostList,
            function (responseData) {
                //handle data
                console.log(responseData);
                renderRootPostListHTML(responseData);
            },
            function () {
                paginationClass.destroy(configsPagination.element);
                var dataItem = rootPostClass.getDataItem();
                paginationClass.loadPage(dataItem);
            }
        );
    });
});


function renderRootPostListHTML(result) {
    let content = '';
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
                                                <a id="mnews1_rpt_news_HyperLink4_0" href="/RootPost/RootPostView/${result[i].RootPostId}"><img class="img-responsive" src="/assets/upload/posts/${result[i].ImageThumbnail}" alt="${result[i].Title}" style="height: 100%;"></a>
                                            </div>
                                        <div class="col-w-9 blog-content">
                                            <h2 class="blog-title">
                                                <a id="mnews1_rpt_news_HyperLink5_0" href="/RootPost/RootPostView/${result[i].RootPostId}">${result[i].Title}</a>
                                            </h2>
                                            <h3>
                                                <span class ="more">${result[i].TextThumbnail.substr(0, 135)}...</span>
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                            `
        }
    }
    else {
        content = `
                            <div class="row" style="margin:0 auto;">
                                <div class="col-md-12">
                                    <h1 class="title title-2 cl-gold title-bor">
                                        <span class ="title-heading">
                                            Không có kết quả
                                        </span>
                                    </h1>
                                </div>
                            </div>
                        `;
    }
    $("#Post_listPost").html(content);
}