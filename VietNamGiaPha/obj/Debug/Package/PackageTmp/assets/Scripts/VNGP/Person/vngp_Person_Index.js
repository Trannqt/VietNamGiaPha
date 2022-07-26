$(document).ready(function () {
    //TocHo.func.createControl();
    ThanhVien.func.getPersonById();
});

var ThanhVien = {
    params: {

    },
    func: {
        createControl: function () {

        },
        getPersonById: function () {
            var url = window.location.href;
            var tmp = url.split('/');
            var id = tmp[tmp.length - 1];
            var commandAction = {
                Id: id
            };
            $.ajax({
                url: "/Person/getPersonDetailById",
                type: "post",
                data: {
                    commandAction: commandAction
                },
                success: function (result) {
                    console.log(result);
                    if (result.length) {
                        var thanhVien = result[0];
                        var listVo = result[1];
                        var listCon = result[2];
                        var tmp = "";
                        if (thanhVien[0].LaDoiThu != 1)
                            tmp = `Đời thứ ${thanhVien[0].LaDoiThu}, là con thứ ${thanhVien[0].LaConThu} trong gia đình ông ${thanhVien[0].HoTenCha}`;
                        else tmp = `Đời ${thanhVien[0].LaDoiThu}`;
                        var html = `
                            <div class="row">
                                <div class="col-md-12">
                                    <h3 class="title title-2 cl-gold title-bor">
                                        <span class="title-heading">
                                            Thông tin ${thanhVien[0].HoTen}
                                        </span>
                                        <span class="bot-title">
                                        </span>
                                    </h3>
                                </div>
                                <div class="title-name title-4">
                                    <h3 class="cl-gold">
                                        THỦY TỔ DÒNG HỌ ${thanhVien[0].TocHo} - ĐỜI THỨ ${thanhVien[0].LaDoiThu}
                                    </h3>
                                    <h4 class="cl-gold">Địa chỉ: ${thanhVien[0].DiaChi}</h4>
                                </div>
                            </div>
                            <div class="main-content wow slideInUp bor-contact">
                                <div class="col-md-12">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <div class="row" style="width:70%">
                                                <div style="margin: 0 auto;"><img src="/upload/giapha/${thanhVien[0].ImageThumbnail}" style="width: 100px; height: auto;"></div>
                                            </div>
                                            <div class="row" style="width:50%;margin:0 auto;">
                                                <div class="col-md-4">Họ và tên</div>
                                                <div class="col-md-8">${thanhVien[0].HoTen}</div>
                                            </div>
                                            <div class="row" style="width:50%;margin:0 auto;">
                                                <div class="col-md-4">Năm sinh</div>
                                                <div class="col-md-8">${thanhVien[0].NgaySinh}</div>
                                            </div>
                                            <div class="row" style="width:50%;margin:0 auto;">
                                                <div class="col-md-4">Giới tính</div>
                                                <div class="col-md-8">${thanhVien[0].GioiTinh}</div>
                                            </div>
                                            <div class="row" style="width:50%;margin:0 auto;">
                                                <div class="col-md-4">Thuộc</div>
                                                <div class="col-md-8">${tmp}</div>
                                            </div>
                                            <div class="row" style="width:50%;margin:0 auto;">
                                                <div class="col-md-4">Ngày mất</div>
                                                <div class="col-md-8">${thanhVien[0].NgayMat}</div>
                                            </div>

                                            <div class="row" style="width:50%;margin:0 auto;">
                                                <div class="col-md-4">An táng</div>
                                                <div class="col-md-8">${thanhVien[0].NoiAnTang}</div>
                                            </div>

                                        </div>
                                        <div class="col-md-6">
                                            <div class="col-md-12" align="center" style="margin-top:20px; margin-bottom:10px"><div class="tab-page-long active"><a href="#">Danh sách vợ</a></div></div>
                                            <div class="row">
                                                <div class="col-md-3" align="center"><b>THỨ</b></div>
                                                <div class="col-md-3"><b>HỌ VÀ TÊN VỢ</b></div>
                                                <div class="col-md-3" align="center"><b>NĂM SINH</b></div>
                                                <div class="col-md-3" align="center"><b>TÌNH TRẠNG</b></div>
                                            </div>
                        `;
                        if (listVo.length) {
                            listVo.forEach((ele, inx, arr) => {
                                html += `
                                    <div class="row">
                                        <div class="col-md-3" align="center">${inx + 1}</div>
                                        <div class="col-md-3"><a href="?giaphangoai=26&amp;ho-thi-tay.html" title="Xem thông tin về Bà ${ele.HoTen}">${ele.HoTen}</a></div>
                                        <div class="col-md-3" align="center">&nbsp;${ele.NgaySinh}</div>
                                        <div class="col-md-3" align="center">${ele.NgayMat}</div>
                                    </div>
                                `;
                            });
                        }

                        html += `
                             <div class="col-md-12" align="center" style="margin-top:20px; margin-bottom:10px"><div class="tab-page-long active"><a href="#">Danh sách con</a></div></div>
                                <div class="row">
                                    <div class="col-md-3" align="center"><b>THỨ</b></div>
                                    <div class="col-md-3"><b>HỌ VÀ TÊN</b></div>
                                    <div class="col-md-3"><b>NĂM SINH</b></div>
                                    <div class="col-md-3"><b>TÌNH TRẠNG</b></div>
                                </div>
                        `;
                            
                        if (listCon.length) {
                            listCon.forEach((ele, inx, arr) => {
                                html += `
                                    <div class="row">
                                        <div class="col-md-3" align="center">${inx + 1}</div>
                                        <div class="col-md-3"><a href="?giapha=24&amp;bui-huu-hoc.html" title="Xem thông tin về Ông Bùi Hữu Học">${ele.HoTen}</a></div>
                                        <div class="col-md-3" align="center">${ele.NgaySinh}</div>
                                        <div class="col-md-3" align="center">${ele.NgayMat}</div>
                                    </div>
                                `;
                            });
                        }
                                            
                        html += `
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        $("#resultThanhVien").html(html);
                    }
                    else {
                        $("#resultThanhVien").html('<h1>Không có thông tin người này!</h1>');
                    }
                }
            });
        }
    }
}
