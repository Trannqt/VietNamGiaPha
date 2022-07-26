$(document).ready(function () {
    const _PAGESIZE = 6;
    const _PAGESKIP = 0;
    const _VISIBLEPAGES = 3;

    alert(1);
    var PaginationClass = function (options) {

        return {
            init: function () {
                let element = options.element;
                let configs = options.configs;
                $(element).twbsPagination($.extend({}, {}, {
                    totalPages: configs.totalPages,
                    visiblePages: configs.visiblePages,
                    startPage: configs.startPage,
                    first: configs.firstPage,
                    last: configs.lastPage,
                    next: configs.nextPage,
                    prev: configs.prevPage,
                    loop: configs.loop,
                    initiateStartPageClick: configs.initiateStartPageClick,
                    onPageClick: function (event, page) {
                        if (options.callback) options.callback(page);
                    }
                }));
            },
            loadPage: function (paginationClass, configsPagination, rootBranchClass) {
                var currentTotalPages = rootBranchClass.getParams();
                $.extend(configsPagination.configs, {
                    totalPages: currentTotalPages.totalPages,
                });
                paginationClass.init(configsPagination);
            },
            destroy: function (elm) {
                $(elm).twbsPagination('destroy');
            }
        };
    }
    var RootBranchClass = function (options) {
        var _params = {
            url: options.url,
            commandAction: options.commandAction,
            totalPages: options.totalPages,
            pageSize: _PAGESIZE,
        }

        return {
            getParams: function () {
                return {
                    url: _params.url,
                    commandAction: _params.commandAction,
                    totalPages: _params.totalPages,
                    pageSize: _params.pageSize,
                };
            },
            setParams: function (options) {
                _params.url = options.url;
                _params.commandAction = options.commandAction;
                _params.totalPages = options.totalPages;
                _params.pageSize = options.pageSize;
            },
            setCommandAction: function (_command) {

                _params.commandAction = _command;
            },
            setTotalPages: function () {

                $.post(
                    '/RootBranch/ApiRootBranchList',
                    {
                        CommandAction: {
                            Item: _params.commandAction.Item,
                            isFirstLoad: _params.commandAction.isFirstLoad,
                        }
                    },
                    function (response) {
                        let total = response.length || 0;
                        debugger
                        _params.totalPages = total % _params.pageSize == 0 ? parseInt(total / _params.pageSize) : parseInt(total / _params.pageSize) + 1;
                    }
                );
            },
            setTotalPagesAsync: function (resolve) {

                $.post(
                    '/RootBranch/ApiRootBranchList',
                    {
                        CommandAction: {
                            Item: _params.commandAction.Item,
                            isFirstLoad: _params.commandAction.isFirstLoad,
                        }
                    },
                    function (response) {
                        let total = response.length || 0;
                        debugger
                        _params.totalPages = total % _params.pageSize == 0 ? parseInt(total / _params.pageSize) : parseInt(total / _params.pageSize) + 1;
                        resolve(_params.totalPages);
                    }
                );
            },
            getRootBranchList: function () {
                $.post(
                    '/RootBranch/ApiRootBranchList',
                    {
                        CommandAction: {
                            Item: _params.commandAction.Item,
                            isFirstLoad: _params.commandAction.isFirstLoad
                        }
                    },
                    function (result) {
                        var html = '';
                        if (result.length) {

                            for (var i = 0; i < result.length; i++) {
                                var add = "";
                                if (result[i].Address != '') add += result[i].Address + ",";
                                if (result[i].DistrictName != '') add += result[i].DistrictName + ",";
                                if (result[i].ProvinceName != '') add += result[i].ProvinceName;
                                result[i].ImageThumbnail == null ? result[i].ImageThumbnail = "noimg.jpg" : result[i].ImageThumbnail;

                                //if (result[i].ImageThumbnail == null || result[i].ImageThumbnail == "noimg.jpg") {
                                //    branchDefaul.forEach(function (ele, inx) {
                                //        if (ele.RootBranchDefaultName == getFirstName(result[i].Name))
                                //            result[i].ImageThumbnail = ele.LinkImageDefault;
                                //    });
                                //}

                                html += `
                                <div class="col-sm-6 col-12 m-b-30">
                                        <div class="list-bt"></div>
                                        <div class="list-lr"></div>
                                        <div class="list-it"></div>
                                        <div class="list-ib"></div>
                                        <div class="blog-item blog-item-3">
                                            <div class="col-w-9 blog-content" style="width: calc(80% - 35px) !important;">
                                                <h2 class="blog-title m-b-20" style="color: #b38d45;font-size:25px;">
                                                    Tộc ${result[i].Name}
                                                </h2>
                                                <h3>
                                                    <span class="more">ở tại ${add}</span>
                                                </h3>
                                            </div>
                                            <div class="col-w-3" style="width: 20%;height: 20%;float:right !important;margin:15px;">
                                                <img class="img-responsive" src="/assets/upload/branch/${result[i].ImageThumbnail}" alt="Tộc ${result[i].Name}" style="display: block;margin-left: auto;margin-right: auto;width: 57%;min-height:69px;margin-bottom:5px;"/">
                                                <a href="/RootBranch/RootBranchView/${result[i].RootBranchId}" style="width: 100%;" class="btn btn-warning">Xem chi tiết</a>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }

                            $("#Branch_listBranch").html('');
                            $("#Branch_listBranch").html(html);
                        }
                        else {

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
                        `;

                            $("#Branch_listBranch").html('');
                            $("#Branch_listBranch").html(html);
                        }
                    }
                );
            },
            setTotalAsync: function (rootBranchClass) {
                return new Promise((resolve, reject) => {
                    rootBranchClass.setTotalPagesAsync(resolve);
                });
            },
            loadData: async function (rootBranchClass, commandActionFirstLoadBranchList, commandActionLoadBranchList, callback) {
                debugger
                var paramsRootBranchClass = rootBranchClass.getParams();
                $.extend(paramsRootBranchClass, {
                    totalPages: 1,
                    commandAction: commandActionFirstLoadBranchList,
                });
                rootBranchClass.setParams(paramsRootBranchClass);
                /*rootBranchClass.setTotalPages();*/
                await this.setTotalAsync(rootBranchClass);

                rootBranchClass.setCommandAction(commandActionLoadBranchList);
                rootBranchClass.getRootBranchList();
                if (callback) callback();
            },
            getProvinceList: function () {
                $('.province').select2();
                $.ajax({
                    //url: '/Branch/getProvinceList',
                    url: '/Location/LocationListSearch',
                    type: "post",
                    success: function (result) {

                        $("#provinceID").html('');
                        $("#provinceID").append('<option value="">Quận Huyện</option>');
                        console.log(result);
                        $.each(result, function (key, value) {
                            var val = value.DistrictId + "-" + value.ProvinceId;

                            $("#provinceID").append(`<option value=${val}>${value.Name}</option>`);
                        });
                    }
                });
            },
        };
    };

    $(document).ready(function () {


        var paramsFirstLoadBranchList = {
            pageSize: -1,
            pageSkip: -1,
            txtSearch: "",
            provinceId: "",
            districtId: "",
            txtWard: "",
        };
        var paramsLoadBranchList = {
            pageSize: _PAGESIZE,
            pageSkip: _PAGESKIP,
            txtSearch: "",
            provinceId: "",
            districtId: "",
            txtWard: "",
        };
        var urlRequest = '/RootBranch/ApiRootBranchList';
        var commandActionFirstLoadBranchList = {
            Item: paramsFirstLoadBranchList,
            isFirstLoad: true,
        }
        var commandActionLoadBranchList = {
            Item: paramsLoadBranchList,
            isFirstLoad: false,
        }

        var configsPagination = {
            element: ".pagin",
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
            callback: function (currPage) {
                var province = $("#provinceID").val();
                var districtId = province.split('-')[0];
                var provinceId = province.split('-')[1];
                var txtSearch = $("#txtSearch").val();
                var txtWard = $("#txtWard").val();

                $.extend(paramsLoadBranchList, {
                    pageSkip: (currPage - 1) * 6,
                    txtSearch: txtSearch,
                    provinceId: provinceId,
                    districtId: districtId,
                    txtWard: txtWard,
                });
                $.extend(commandActionLoadBranchList, {
                    Item: paramsLoadBranchList
                });
                rootBranchClass.setCommandAction(commandActionLoadBranchList);
                rootBranchClass.getRootBranchList();
            }
        };

        //main function
        var rootBranchClass = new RootBranchClass({
            url: urlRequest,
            commandAction: commandActionFirstLoadBranchList,
            totalPages: 1,
            pageSize: _PAGESIZE,
        });
        rootBranchClass.getProvinceList();
        var paginationClass = new PaginationClass(configsPagination);
        rootBranchClass.loadData(rootBranchClass, commandActionFirstLoadBranchList, commandActionLoadBranchList, function () {
            paginationClass.loadPage(paginationClass, configsPagination, rootBranchClass);
        });

        $("#btnSearch").click(function (e) {
            e.preventDefault();
            debugger
            var province = $("#provinceID").val();
            var districtId = province.split('-')[0];
            var provinceId = province.split('-')[1];
            var txtSearch = $("#txtSearch").val();
            var txtWard = $("#txtWard").val();

            var ItemFirstLoad = {};
            $.extend(ItemFirstLoad, paramsFirstLoadBranchList, {
                districtId: districtId,
                provinceId: provinceId,
                txtSearch: txtSearch,
                txtWard: txtWard,
            });
            $.extend(commandActionFirstLoadBranchList, {
                Item: ItemFirstLoad,
                isFirstLoad: true
            });

            var ItemNotFirstLoad = {};
            $.extend(ItemNotFirstLoad, paramsLoadBranchList, {
                pageSize: _PAGESIZE,
                pageSkip: _PAGESKIP,
                districtId: districtId,
                provinceId: provinceId,
                txtSearch: txtSearch,
                txtWard: txtWard,
            });
            $.extend(commandActionLoadBranchList, {
                Item: ItemNotFirstLoad,
                isFirstLoad: false,
            });

            rootBranchClass.loadData(rootBranchClass, commandActionFirstLoadBranchList, commandActionLoadBranchList, function () {
                paginationClass.destroy(configsPagination.element);
                paginationClass.loadPage(paginationClass, configsPagination, rootBranchClass);
            });
        });
    });
});