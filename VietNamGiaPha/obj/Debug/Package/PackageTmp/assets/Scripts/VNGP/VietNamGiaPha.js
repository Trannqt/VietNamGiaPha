var IPaginationClass = function (options) {
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
                onPageClick: async function (event, page) {
                    if (options.callback) options.callback(page);
                }
            }));
        },
        loadPage: function (dataItem) {
            $.extend(options.configs, {
                totalPages: dataItem.totalPages,
            });
            this.init(options.configs);
        },
        destroy: function () {
            $(options.element).twbsPagination('destroy');
        }
    };
}

var RootDataClass = function (options) {
    var dataItem = {
        url: options.url,
        commandAction: options.commandAction,
        totalPages: options.totalPages,
        pageSize: options.pageSize,
    }

    return {
        getDataItem: function () {
            return {
                url: dataItem.url,
                commandAction: dataItem.commandAction,
                totalPages: dataItem.totalPages,
                pageSize: dataItem.pageSize,
            };
        },
        setDataItem: function (options) {
            dataItem.url = options.url;
            dataItem.commandAction = options.commandAction;
            dataItem.totalPages = options.totalPages;
            dataItem.pageSize = options.pageSize;
        },
        setCommandAction: function (commandAction) {
            dataItem.commandAction = commandAction;
        },
        setTotalPagesAsync: function (resolve) {
            $.post(
                dataItem.url,
                {
                    CommandAction: {
                        Item: dataItem.commandAction.Item,
                        isFirstLoad: dataItem.commandAction.isFirstLoad,
                    }
                },
                function (response) {
                    debugger
                    let total = response.length || 1;
                    if (total < dataItem.pageSize) {
                        dataItem.totalPages = 1;
                    }
                    else {
                        debugger
                        dataItem.totalPages = total % dataItem.pageSize == 0 ? parseInt(total / dataItem.pageSize) : parseInt(total / dataItem.pageSize) + 1;
                    }
                    resolve(dataItem.totalPages);
                }
            );
        },
        getDataListAsync: function (resolve) {
            $.post(
                dataItem.url,
                {
                    CommandAction: {
                        Item: dataItem.commandAction.Item,
                        isFirstLoad: dataItem.commandAction.isFirstLoad
                    }
                },
                function (result) {
                    resolve(result);
                }
            );
        },
        executeSetTotalPagesAsync: function () {
            return new Promise((resolve, reject) => {
                this.setTotalPagesAsync(resolve);
            });
        },
        executeGetDataListAsync: function () {
            return new Promise((resolve, reject) => {
                this.getDataListAsync(resolve);
            });
        },
        loadData: async function (commandActionFirstLoad, commandAction, callbackHandleHTML, callbackPagination) {
            debugger
            var _dataItem = this.getDataItem();
            $.extend(_dataItem, {
                totalPages: 1,
                commandAction: commandActionFirstLoad,
            });
            this.setDataItem(_dataItem);
            /*rootBranchClass.setTotalPages();*/
            debugger
            await this.executeSetTotalPagesAsync();

            this.setCommandAction(commandAction);
            debugger
            var htmlResponse = await this.executeGetDataListAsync();
            if (callbackHandleHTML) callbackHandleHTML(htmlResponse);
            if (callbackPagination) callbackPagination();
        },
    };
};

//class CommonBaseClass {
//    constructor() {

//    }

//    loadingSkeleton(element, isShow) {
//        let skeleton = `
//                <!--Loading Skeleton-->
//                <div class="card loading">
//                    <div class="user-info">
//                    <div class="logo">
//                        <img src="h#" alt="logo">
//                    </div>
//                    <div class="name"></div>
//                    </div>
//                    <div class="content" style="height:350px"></div>
//                </div>
//                 <!--End Loading Skeleton-->
//            `;
//        if (isShow)
//            $(element).html(skeleton);
//        else
//            $(element).html('');
//    };
//};

/*
 postType: 0=> get All List Post
 postType: 1=> Dao ly lam nguoi
 postType: 2=> Lich su cac toc ho VN
 postType: 3=> Bai hoc song
 postType: 4=> To am
 postType: 5=> Right menu
 */
var CommonParams = {
    POST_TYPE: {
        GET_ALL: 0,
        DAO_LY_LAM_NGUOI: 1,
        LICH_SU_TOC_HO: 2,
        BAI_HOC_SONG: 3,
        TO_AM: 4,
        RIGHT_MENU: 5,
    }
};
