var Person = {
    params: {

    },
    func: {
        getIdFromUrl: function (url) {
            var tmp = url.split('/');
            var id = tmp[tmp.length - 1];
            return id;
        },
        //createControl: function (chart) {
        //    var id = Person.func.getIdFromUrl(window.location.href);
        //    var commandAction = {
        //        Id: id
        //    };

        //    $.ajax({
        //        url: '/Person/BranchSource',
        //        type: 'post',
        //        data: {
        //            commandAction: commandAction
        //        },
        //        success: function (result) {
        //            console.log(result);
        //            result[0].forEach(function (ele, inx) {
        //                debugger
        //                ele.img = `/upload/branchsource/${ele.img}`;
        //                console.log(ele.pid);
                        
        //                ele.tags == "partner" ? ["partner"] : "";
        //                console.log("partner" +ele.tags);
        //            });
        //            chart.load(result[0]);
        //        }
        //    });
        //},
        loadPhaDo: function () {
            
        },
    }
}
