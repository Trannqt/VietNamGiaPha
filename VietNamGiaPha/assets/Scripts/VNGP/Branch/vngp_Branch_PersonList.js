

var common = {
    params: {

    },
    func: {
        getIdFromUrl: function () {
            var url = window.location.href;
            var splitUrl = url.split('/');
            var id = splitUrl[splitUrl.length - 1];
            return id;
        }
    }
}

var Pagination = function (options) {
    var params = {
        branchId: options.branchId,
        pageSize: options.pageSize,
        pageSkip: options.pageSkip,
        totalPage: options.totalPage,
        startPage: options.startPage,
        visiblePages: options.visiblePages,
    }
   
    var _declare = function () {
    /*    setTimeout(() => {*/
            var configs = {
                totalPages: 1,
                visiblePages: 3,
                startPage: 1,
                first: '<<',
                last: '>>',
                next: '>',
                prev: '<',
                loop: false,
                //initiateStartPageClick: true,
            };
            $('.paginationPersonList').twbsPagination(configs);
   /*     }, 1500);*/
    }

    var _getTotalPage = function () {
        $.post(
            '/Branch/getPersonList',
            {
                CommandAction: {
                    branchId: params.branchId,
                    pageSize: -1,
                    pageSkip: -1,
                }
            },
            function (result) {
                if (result.length) {
                    var _totalPage = result.length % params.pageSize == 0 ? parseInt(result.length / params.pageSize) : parseInt(result.length / params.pageSize) + 1;
                    $.extend(params, { totalPage: _totalPage });
                }
            }
        );
    }

    var _loadData = function (page) {
        debugger
        if (page.currPage != 1) {
            $.extend(params, { pageSkip: (page.currPage - 1) * params.pageSize });
        }
        $.post(
            '/Branch/getPersonList',
            {
                CommandAction: params
            },
            function (result) {
                w2ui.myGrid.clear();
                if (result.length) {
                    w2ui.myGrid.add(result);
                    setTimeout(() => {
                        _setPagination();
                    }, 5000);
                }
            }
        );
    }

    var _load = function (page) {
        debugger
        console.log(page);
    }

    var _setPagination = function () {
        debugger
        $('.paginationPersonList').twbsPagination($.extend({}, {
            totalPages: params.totalPage,
            visiblePages: params.visiblePages,
            startPage: params.startPage,
            first: '<<',
            last: '>>',
            next: '>',
            prev: '<',
            loop: false,
            //initiateStartPageClick: true,
            onPageClick: function (event, page) {
                _loadData({ currPage: page });
                
            }
        }));
        //$('.paginationPersonList').twbsPagination('destroy');
    }

    return {
        getParams: function () {
            return {
                branchId: options.branchId,
                pageSize: options.pageSize,
                pageSkip: options.pageSkip,
            };
        },
        setParams: function (_params) {
            params.branchId = _params.branchId;
            params.pageSize = _params.pageSize;
            params.pageSkip = _params.pageSkip;
        },
        init: function () {
            //_declare();
            _getTotalPage();
            _loadData({currPage: 1});
            //setTimeout(() => {
            //    _setPagination();
            //}, 2000);
            
            //setTimeout(() => {
            //    _setPagination();
            //}, 3000);
            
        }
    };
}

var UIPersonList = function () {
    var _id = common.func.getIdFromUrl() || "";
    var _createHeaderGrid = $("#headerGrid").html();
    
    var _createGrid = function () {
        $('#myGrid').w2grid({
            name: 'myGrid',
            header: _createHeaderGrid,
            show: {      
                header: true,
            },
            recid: 'RootPersonId',
            //url: {
            //    get: '/Branch/getPersonList?commandAction.BranchId=' + _id,
            //},
            columns: [
                { field: 'RootPersonId', text: 'ID', size: '30%' },
                { field: 'Name', text: 'Tên thành viên', size: '30%' },
                { field: 'Sex', text: 'Giới tính', size: '40%' },
                { field: 'DateOfBirth', text: 'Ngày sinh', size: '120px' },
                { field: 'DateOfDeath', text: 'Ngày mất', size: '120px' },
                { field: 'Level', text: 'Đời', size: '120px' },
                { field: 'FatherName', text: 'Người cha', size: '120px' },
                { field: 'MotherName', text: 'Người mẹ', size: '120px' },
                { field: 'BranchName', text: 'Tộc họ', size: '120px' },
                { field: 'ImageLink', text: 'Hình', size: '120px' },
            ],
        });
    };

    var _createPaginationGrid = function () {
        
    }

    return {
        init: function () {
            debugger
            _createGrid();
            
                var pagination = new Pagination({ branchId: _id, pageSize: 6, pageSkip: 0, visiblePages: 3, totalPage: 0, startPage: 1 });
                pagination.init();
           
        },

    };
};

var UIPersonList = new UIPersonList();
UIPersonList.init();


