$(document).ready(function () {
    TocUoc.func.getRulesByBranchId();
});

var TocUoc = {
    params: {

    },
    func: {
        createControl: function () {

        },
        getRulesByBranchId: function () {
            var url = window.location.href;
            var tmp = url.split('/');
            var id = tmp[tmp.length - 1];
            var commandAction = {
                RootBranchId: id
            };
            $.ajax({
                url: "/InformationBranch/Rules",
                type: "post",
                data: {
                    commandAction: commandAction
                },
                success: function (result) {
                    console.log(result);
                    if (result.length) {
                        debugger
                        $("#rules_Title").text(result[0].Title);
                        $("#rules_Description").html(result[0].Description);
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

                        $("#rules_Footer").html(htmlFooter);
                    }
                    else {
                        $("#rules_Title").text("TỘC ƯỚC");
                        $("#rules_Description").html("CHƯA MÔ TẢ...");
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
                        $("#rules_Footer").html(htmlFooter);
                    }
                }
            });
        }
    }
}
