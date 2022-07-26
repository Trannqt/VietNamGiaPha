
var BrD = {
    params: {
        pDataSLinks: [],
        totalPages: 1000,
        visiblePages: 3,
        startPage: 1,
        pageSize: 10,
        currPage: 1,
        txtSearch: "",
        txtProvince: "",
        txtDistrict: "",
        txtWard: "",
        RootBranchName: "",
        RootBranchId: 0,
    },
    func: {
        init: function (configs) {
            var url = BrD.func.getUrl({
                url: '/RootBranch/ApiRootBranchGetById',
                param: {
                    pageSize: -1,
                    pageSkip: -1,
                }
            });
            debugger
            console.log(url);
            BrD.func.beforeLoad(configs, url);
        },
        getUrl: function (
            {
                url = "",
                param
            }
        ) {
            var url = window.location.href;
            var tmp = url.split('/');
            var id = tmp[tmp.length - 1];

            url = "/RootBranch/ApiRootBranchGetById/";
            var pa = url.indexOf("?") == -1 ? "?" : "";
            return url + pa + "&commandAction.pageSize=" + param.pageSize + "&commandAction.pageSkip=" + param.pageSkip + "&commandAction.Id=" + id
        },
        beforeLoad: function (configs, url) {
            debugger
            $.ajax({
                url: url,
                type: "post",
                success: function (rs) {
                    debugger
                    if (rs[1].length) {
                        var result = rs[1];
                        BrD.params.totalPages = result.length % BrD.params.pageSize == 0 ? parseInt(result.length / BrD.params.pageSize) : parseInt(result.length / BrD.params.pageSize) + 1;
                        BrD.params.startPage = 1;
                        BrD.func.pagination(configs);
                    }
                    else {
                        BrD.func.getBranchById(url);
                    }
                }
            });
        },
        pagination: function (configs) {
            $('.paginationRootPersonTreeExecuteSearch').twbsPagination('destroy');

            $('.paginationRootPersonTreeExecuteSearch').twbsPagination($.extend({}, configs, {
                totalPages: BrD.params.totalPages,
                visiblePages: BrD.params.visiblePages,
                startPage: BrD.params.startPage,
                first: '<<',
                last: '>>',
                next: '>',
                prev: '<',
                loop: false,
                initiateStartPageClick: true,
                onPageClick: function (event, page) {
                    BrD.params.currPage = page;
                    BrD.func.loadData(page);
                }
            }));
        },
        loadData: function (currPage) {
            debugger
            var url = BrD.func.getUrl({
                url: '/RootBranch/ApiRootBranchGetById',
                param: {
                    pageSize: BrD.params.pageSize,
                    pageSkip: (currPage - 1) * BrD.params.pageSize,
                }
            });
            BrD.func.getBranchById(url);
        },
        createControl: function () {

        },
        getBranchById: function (url) {
            debugger;
            $.ajax({
                url: url,
                type: "post",
                data: {
                    //commandAction: commandAction
                },
                success: function (rs) {
                    debugger;
                    console.log(rs[1]);
                    if (rs[1].length) {
                        //var data = rs[1];
                        var result = rs[0];
                        var branchDetail = rs[1];
                        var branchId = result[0].RootBranchId;
                        //var result = data[0];

                        var add = "";
                        if (result[0].Address != '') add += result[0].Address + ",";
                        if (result[0].DistrictName != '') add += result[0].DistrictName + ",";
                        if (result[0].ProvinceName != '') add += result[0].ProvinceName;

                        BrD.params.RootBranchName = result[0].Name;
                        BrD.params.RootBranchId = result[0].RootBranchId;
                        var htmlGiaPha = `
                            <div class="col-md-12">
                                <h1 class="title title-2 cl-gold title-bor">
                                    <p style="font-size:65%;">Gia Phả</p>
                                    <span class="title-heading">
                                        Tộc ${result[0].Name} - ${add}
                                    </span>
                                    <span class="bot-title">
                                    </span>
                                </h1>
                            </div> 
                        `;
                        $("#resultGiaPha").html(htmlGiaPha);
                        var length = branchDetail.length;
                        var htmlBranchDetail = "", number = 1;
                        var name = "";

                        if (length) {
                            for (var i = 0; i < length; i++) {
                                //if (branchId == branchDetail[i].RootBranchId) {
                                name = `<a href="javascript:;" onclick="Person.func.createChart2(${branchDetail[i].RootBranchId},${branchDetail[i].RootPersonId},${branchDetail[i].Level},${branchDetail[i].maxLevel})">${branchDetail[i].Name}
                                        </a>`;
                                //}
                                //else {
                                //    name = branchDetail[i].Name;
                                //}
                                htmlBranchDetail += `
                                <tr>
                                    <td>${branchDetail[i].STT}</td>
                                    <td>${branchDetail[i].RootPersonId}</td>
                                    <td>${name}
                                    <br/>
                                        ${branchDetail[i].Sex}, Đời ${branchDetail[i].Level}
                                    </td>
                                </tr>
                            `;
                            }
                            $("#tblBranchDetail").html(htmlBranchDetail);
                            Person.func.createChart2(branchDetail[0].RootBranchId, branchDetail[0].RootPersonId, branchDetail[0].Level, branchDetail[0].maxLevel);
                        }
                    }
                    else {
                        $("#headerBranch").html('');
                    }
                }
            });
        }
    }
}

var Person = {
    params: {

    },
    func: {
        getIdFromUrl: function (url) {
            var tmp = url.split('/');
            var id = tmp[tmp.length - 1];
            return id;
        },
        createChart: function (branchId, personId, level, maxlevel) {
            OrgChart.templates.mila.field_1 =
                '<text class="field_1" style="font-size: 14px;" fill="#ffffff" x="230" y="15" text-anchor="middle">{val}</text>';
            OrgChart.templates.mila.field_2 =
                '<text class="field_2" style="font-size: 14px;" fill="#ffffff" x="230" y="30" text-anchor="middle">{val}</text>';
            OrgChart.templates.mila.field_3 =
                '<text class="field_3" style="font-size: 14px;" fill="#ffffff" x="125" y="45" text-anchor="right">{val}</text>';
            OrgChart.templates.family_template.node =
                '<rect x="0" y="0" height="120" width="250" fill="#039BE5" stroke-width="1" stroke="#039BE5"></rect>'
                + '<rect x="-5" y="75" height="27" width="260" fill="#ffffff" stroke-width="1" stroke="#039BE5">'
                + '</rect><line x1="-5" x2="0" y1="102" y2="107" stroke-width="1" stroke="#039BE5" />'
                + '<line x1="255" x2="250" y1="102" y2="107" stroke-width="1" stroke="#039BE5" />'
                + '<line x1="0" y1="0" x2="250" y2="0" stroke-width="2" stroke="#039BE5" />';
            var chart = new OrgChart(document.getElementById("tree"), {
                mouseScrool: OrgChart.none,
                template: "mila",
                layout: OrgChart.tree,
                nodeCircleMenu: {
                    addLink: {
                        icon: OrgChart.icon.link(24, 24, '#aeaeae'),
                        text: "Add C link(drag and drop)",
                        color: '#fff',
                        draggable: true
                    }
                },
                menu: {
                    csv: { text: "Export as CSV" },
                    svg: { text: "Export SVG" },
                },
                toolbar: {
                    zoom: true,
                    fit: true,
                    expandAll: true,
                    layout: true,
                },
                nodeBinding: {
                    field_0: "name",
                    field_1: "Sex",
                    field_2: "Level",
                    field_3: "SexAndPhone",
                    img_0: "img",
                },
                tags: {
                    myFemale: { template: 'family_template_blue' },
                    "blue": {
                        template: 'family_template_blue'
                    },
                    "partner": {
                        template: "mila", //"family_template_blue"
                    },
                },
            });


            chart.on('init', function (sender) {
                sender.toolbarUI.showLayout();
            });

            Person.func.createControl(chart, branchId, personId, level, maxlevel);
        },
        createChart2: function (branchId, personId, level, maxlevel) {
            OrgChart.templates.family_template = Object.assign({}, OrgChart.templates.ana);
            OrgChart.templates.family_template.size = [250, 120];
            //OrgChart.templates.family_template.plus = "";
            //OrgChart.templates.family_template.minus = "";
            //OrgChart.templates.family_template.rippleRadius = 40;
            //OrgChart.templates.family_template.name = '<text style="font-size: 12px;" fill="#000000" x="43" y="100" text-anchor="middle">{val}</text>';
            //OrgChart.templates.family_template.title = '<text style="font-size: 12px;" fill="#aeaeae" x="43" y="115" text-anchor="middle">{val}</text>';
            //OrgChart.templates.family_template.img = '<clipPath id="{randId}"><circle cx="43" cy="43" r="38.5"></circle></clipPath></circle><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="3" y="3" width="80" height="80"></image>';
            //OrgChart.templates.family_template.node = '<circle stroke-width="3" fill="none" stroke="#aeaeae" cx="43" cy="43" r="41.5"></circle>';
            //custom template
            OrgChart.templates.family_template.defs = '<g transform="matrix(0.05,0,0,0.05,-13,-15.5)" id="baby"><circle cx="260" cy="310" r="200" fill="#ffffff"></circle><path fill="#aeaeae" d="m468.64 268.32h-13.591c-18.432-89.348-95.612-157.432-189.139-161.798-.501-.185-1.015-.348-1.545-.482-18.363-4.622-31.188-22.595-31.188-43.707 0-17.828 14.468-32.333 32.252-32.333 12.573 0 22.802 10.258 22.802 22.866 0 8.284 6.716 15 15 15s15-6.716 15-15c0-29.15-23.687-52.866-52.802-52.866-34.326 0-62.252 27.962-62.252 62.333 0 17.876 5.828 34.443 15.769 47.432-80.698 15.127-144.725 78.25-161.291 158.555h-13.591c-24.103 0-43.712 19.596-43.712 43.683 0 24.086 19.609 43.682 43.712 43.682h14.692c20.935 89.871 101.582 157.018 197.596 157.018s176.66-67.148 197.596-157.018h14.692c24.103 0 43.712-19.596 43.712-43.682 0-24.087-19.609-43.683-43.712-43.683zm-265.054 55.257c-8.284-.024-14.981-6.758-14.958-15.043.007-2.337-.708-13.999-15.481-14.041-.026 0-.053 0-.08 0-14.697 0-15.475 11.62-15.481 13.953-.023 8.284-6.75 15.007-15.043 14.957-8.284-.024-14.98-6.759-14.957-15.043.038-13.322 5.349-25.101 14.955-33.166 8.223-6.904 19.065-10.702 30.543-10.702h.148c11.534.033 22.412 3.896 30.63 10.876 9.559 8.12 14.803 19.928 14.765 33.25-.023 8.27-6.735 14.957-14.999 14.957-.013.002-.027.002-.042.002zm52.766 129.374c-26.485 0-48.033-21.533-48.033-48.002 0-8.284 6.716-15 15-15s15 6.716 15 15c0 9.926 8.089 18.002 18.033 18.002s18.033-8.076 18.033-18.002c0-8.284 6.716-15 15-15s15 6.716 15 15c-.001 26.469-21.548 48.002-48.033 48.002zm113.765-129.374c-.015 0-.029 0-.044 0-8.284-.024-14.98-6.759-14.957-15.043.016-5.445-1.993-9.263-6.14-11.673-5.407-3.142-13.27-3.165-18.695-.053-4.161 2.387-6.191 6.193-6.207 11.638-.023 8.27-6.735 14.957-14.999 14.957-.015 0-.029 0-.043 0-8.284-.024-14.981-6.758-14.958-15.043.046-16.149 7.802-29.845 21.281-37.576 14.814-8.497 33.929-8.443 48.695.138 13.434 7.807 21.112 21.547 21.066 37.696-.023 8.271-6.735 14.959-14.999 14.959z"/> </g>';
            OrgChart.templates.family_template.expandCollapseSize = 30;
            OrgChart.templates.family_template.svg =
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
                + ' style="display:block;" width="{w}" height="{h}" viewBox="{viewBox}">{content}'
                + '</svg>';
            OrgChart.templates.family_template.link =
                '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="1px" fill="none" d="{rounded}" />';
            OrgChart.templates.family_template.assistanseLink =
                '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="2px" fill="none" '
                + ' d="M{xa},{ya} {xb},{yb} {xc},{yc} {xd},{yd} L{xe},{ye}" />';
            OrgChart.templates.family_template.pointer =
                '<g data-pointer="pointer" transform="matrix(0,0,0,0,100,100)">'
                + '<radialGradient id="pointerGradient"><stop stop-color="#ffffff" offset="0" />'
                + '<stop stop-color="#C1C1C1" offset="1" /></radialGradient>'
                + '<circle cx="16" cy="16" r="16" stroke-width="1" stroke="#acacac" fill="url(#pointerGradient)"></circle>'
                + '</g>';
            //OrgChart.templates.family_template.node =
            //    '<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="1" stroke="#aeaeae" rx="5" ry="5"></rect>'
            //    + '<line x1="10" y1="0" x2="240" y2="0" stroke-width="1" stroke="#039BE5"></line>';
            OrgChart.templates.family_template.node =
                '<rect x="0" y="0" height="120" width="250" fill="#039BE5" stroke-width="1" stroke="#039BE5"></rect>'
                + '<rect x="-5" y="75" height="27" width="260" fill="#ffffff" stroke-width="1" stroke="#039BE5">'
                + '</rect><line x1="-5" x2="0" y1="102" y2="107" stroke-width="1" stroke="#039BE5" />'
                + '<line x1="255" x2="250" y1="102" y2="107" stroke-width="1" stroke="#039BE5" />'
                + '<line x1="0" y1="0" x2="250" y2="0" stroke-width="2" stroke="#039BE5" />';
            OrgChart.templates.family_template.plus =
                '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#aeaeae" stroke-width="1"></circle>'
                + '<line x1="4" y1="15" x2="26" y2="15" stroke-width="1" stroke="#aeaeae"></line>'
                + '<line x1="15" y1="4" x2="15" y2="26" stroke-width="1" stroke="#aeaeae"></line>';
            OrgChart.templates.family_template.minus =
                '<circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#aeaeae" stroke-width="1"></circle>'
                + '<line x1="4" y1="15" x2="26" y2="15" stroke-width="1" stroke="#aeaeae"></line>';
            OrgChart.templates.family_template.nodeMenuButton =
                '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,110)" data-ctrl-n-menu-id="{id}">'
                + '<rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect>'
                + '<circle cx="0" cy="0" r="2" fill="#aeaeae"></circle>'
                + '<circle cx="7" cy="0" r="2" fill="#aeaeae"></circle><circle cx="14" cy="0" r="2" fill="#aeaeae"></circle>'
                + '</g>';
            OrgChart.templates.family_template.exportMenuButton =
                '<div style="position:absolute;right:{p}px;top:{p}px; width:40px;height:50px;cursor:pointer;" data-ctrl-menu="">'
                + '<hr style="background-color: #7A7A7A; height: 3px; border: none;">'
                + '<hr style="background-color: #7A7A7A; height: 3px; border: none;">'
                + '<hr style="background-color: #7A7A7A; height: 3px; border: none;">'
                + '</div>';
            OrgChart.templates.family_template.img_0 = ""
                //+ '<clipPath id="{randId}"><circle cx="50" cy="30" r="40"></circle></clipPath>'
                + '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="10" y="3" width="68" height="68">'
                + '</image>';
            OrgChart.templates.family_template.link_field_0 =
                '<text text-anchor="right" fill="#039BE5" width="290" x="3" y="-3" style="font-size:10px;">{val}</text>';
            OrgChart.templates.family_template.field_0 =
                '<text width="230" style="font-size: 18px;" fill="#039BE5" x="125" y="95" text-anchor="middle">{val}</text>';
            OrgChart.templates.family_template.field_1 =
                '<text data-width="150" data-text-overflow="ellipsis" style="font-size: 13px;" fill="#ffffff" x="240" y="15" text-anchor="end">{val}</text>';
            OrgChart.templates.family_template.field_2 =
                '<text data-width="150" style="font-size: 13px;" fill="#ffffff" x="90" y="50">{val}</text>';
            OrgChart.templates.family_template.field_3 =
                '<text data-width="150" style="font-size: 13px;" fill="#ffffff" x="165" y="50">- {val}</text>';
            OrgChart.templates.family_template.field_4 =
                '<text data-width="150" style="font-size: 13px;" fill="#ffffff" x="155" y="30">Giới tính: {val}</text>';
            OrgChart.templates.family_template.field_5 =
                '<text data-width="150" style="font-size: 13px;" fill="#ffffff" x="90" y="30">Đời {val}</text>';
            OrgChart.templates.family_template.field_6 =
                '<text data-width="150" style="font-size: 13px;" fill="#ffffff" x="90" y="70">{val}</text>';

            OrgChart.templates.family_template.padding = [50, 20, 35, 20];
            //multiline
            OrgChart.templates.family_template_blue = Object.assign({}, OrgChart.templates.family_template);
            //OrgChart.templates.family_template_blue.img_0 = "" +
            //    '<clipPath id="{randId}"><circle cx="43" cy="43" r="41.5" stroke-width="3" fill="none" stroke="#039BE5"></circle></clipPath>'
            //    + '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="10" y="3" width="68" height="68">'
            //    + '</image>';
            //'<circle stroke-width="3" fill="none" stroke="#039BE5" cx="43" cy="43" r="41.5"></circle>';
            //mila
            OrgChart.templates.mila.defs = '<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path fill="#aeaeae" d="M 0 0 L 10 5 L 0 10 z" /></marker><marker id="dotBlue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"> <circle cx="5" cy="5" r="5" fill="#039BE5" /></marker>';
            OrgChart.templates.mila.link = '<path marker-start="url(#dotBlue)" marker-end="url(#arrow)"   stroke-linejoin="round" stroke="#aeaeae" stroke-width="1px" fill="none" d="M{xa},{ya} {xb},{yb} {xc},{yc} L{xd},{yd}" />';
            OrgChart.templates.mila.link_field_0 = '<text text-anchor="middle" fill="#FFCA28" data-width="290" x="-20" y="-5" style="font-size:12px;">{val}</text>';
            OrgChart.templates.mila.node =
                '<rect x="0" y="0" height="120" width="250" fill="#FFCA28" stroke-width="1" stroke="#FFCA28"></rect>'
                + '<rect x="-5" y="75" height="27" width="260" fill="#ffffff" stroke-width="1" stroke="#FFCA28">'
                + '</rect><line x1="-5" x2="0" y1="102" y2="107" stroke-width="1" stroke="#FFCA28" />'
                + '<line x1="255" x2="250" y1="102" y2="107" stroke-width="1" stroke="#FFCA28" />'
                + '<line x1="0" y1="0" x2="250" y2="0" stroke-width="2" stroke="#FFCA28" />';
            OrgChart.templates.mila.nodeMenuButton =
                '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,110)" data-ctrl-n-menu-id="{id}">'
                + '<rect x="-4" y="-10" fill="#000000" fill-opacity="0" width="22" height="22"></rect>'
                + '<circle cx="0" cy="0" r="2" fill="#aeaeae"></circle>'
                + '<circle cx="7" cy="0" r="2" fill="#aeaeae"></circle><circle cx="14" cy="0" r="2" fill="#aeaeae"></circle>'
                + '</g>';
            OrgChart.templates.mila.exportMenuButton =
                '<div style="position:absolute;right:{p}px;top:{p}px; width:40px;height:50px;cursor:pointer;" data-ctrl-menu="">'
                + '<hr style="background-color: #7A7A7A; height: 3px; border: none;">'
                + '<hr style="background-color: #7A7A7A; height: 3px; border: none;">'
                + '<hr style="background-color: #7A7A7A; height: 3px; border: none;">'
                + '</div>';
            OrgChart.templates.mila.img_0 = ""
                + '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="10" y="3" width="68" height="68">'
                + '</image>';
            OrgChart.templates.mila.field_0 =
                '<text width="230" style="font-size: 18px;" fill="#FFCA28" x="125" y="95" text-anchor="middle">{val}</text>';
            OrgChart.templates.mila.field_1 =
                '<text data-width="150" data-text-overflow="ellipsis" style="font-size: 13px;" fill="#ffffff" x="240" y="15" text-anchor="end">{val}</text>';
            OrgChart.templates.mila.field_2 =
                '<text data-width="150" style="font-size: 13px;" fill="#ffffff" x="90" y="50">{val}</text>';
            OrgChart.templates.mila.field_3 =
                '<text data-width="150" style="font-size: 13px;" fill="#ffffff" x="165" y="50">- {val}</text>';
            OrgChart.templates.mila.field_4 =
                '<text data-width="150" style="font-size: 13px;" fill="#ffffff" x="155" y="30">Giới tính: {val}</text>';
            OrgChart.templates.mila.field_5 =
                '<text data-width="150" style="font-size: 13px;" fill="#ffffff" x="90" y="30">Đời {val}</text>';
            OrgChart.templates.mila.field_6 =
                '<text data-width="150" style="font-size: 13px;" fill="#ffffff" x="90" y="70">{val}</text>';

            OrgChart.templates.royal_template = Object.assign({}, OrgChart.templates.mila);
            OrgChart.templates.royal_template.size = [86, 86];
            OrgChart.templates.royal_template.plus = "";
            OrgChart.templates.royal_template.minus = "";
            OrgChart.templates.royal_template.rippleRadius = 40;
            OrgChart.templates.royal_template.link =
                '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="1px" fill="none" d="{rounded}" />';
            //OrgChart.templates.royal_template.link = '<path marker-start="url(#dotBlue)" marker-end="url(#arrow)"   stroke-linejoin="round" stroke="#aeaeae" stroke-width="1px" fill="none" d="M{xa},{ya} {xb},{yb} {xc},{yc} L{xd},{yd}" />';
            //OrgChart.templates.royal_template.link_field_0 = '<text text-anchor="middle" fill="#FFCA28" data-width="290" x="-10" y="-5" style="font-size:12px;">{val}</text>';
            OrgChart.templates.royal_template.field_0 = '<text style="font-size: 12px;" fill="#000000" x="43" y="100" text-anchor="middle">{val}</text>';
            OrgChart.templates.royal_template.field_1 = '<text style="font-size: 12px;" fill="#aeaeae" x="43" y="115" text-anchor="middle">{val}</text>';
            OrgChart.templates.royal_template.img_0 = '<clipPath id="{randId}"><circle cx="43" cy="43" r="38.5"></circle></clipPath></circle><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="3" y="3"  width="80" height="80"></image>';
            OrgChart.templates.royal_template.node = '<circle stroke-width="3" fill="none" stroke="#aeaeae" cx="43" cy="43" r="41.5"></circle>';
            OrgChart.templates.royal_template.defs = '<g transform="matrix(0.05,0,0,0.05,-13,-15.5)" id="baby"><circle cx="260" cy="310" r="200" fill="#ffffff"></circle><path fill="#aeaeae" d="m468.64 268.32h-13.591c-18.432-89.348-95.612-157.432-189.139-161.798-.501-.185-1.015-.348-1.545-.482-18.363-4.622-31.188-22.595-31.188-43.707 0-17.828 14.468-32.333 32.252-32.333 12.573 0 22.802 10.258 22.802 22.866 0 8.284 6.716 15 15 15s15-6.716 15-15c0-29.15-23.687-52.866-52.802-52.866-34.326 0-62.252 27.962-62.252 62.333 0 17.876 5.828 34.443 15.769 47.432-80.698 15.127-144.725 78.25-161.291 158.555h-13.591c-24.103 0-43.712 19.596-43.712 43.683 0 24.086 19.609 43.682 43.712 43.682h14.692c20.935 89.871 101.582 157.018 197.596 157.018s176.66-67.148 197.596-157.018h14.692c24.103 0 43.712-19.596 43.712-43.682 0-24.087-19.609-43.683-43.712-43.683zm-265.054 55.257c-8.284-.024-14.981-6.758-14.958-15.043.007-2.337-.708-13.999-15.481-14.041-.026 0-.053 0-.08 0-14.697 0-15.475 11.62-15.481 13.953-.023 8.284-6.75 15.007-15.043 14.957-8.284-.024-14.98-6.759-14.957-15.043.038-13.322 5.349-25.101 14.955-33.166 8.223-6.904 19.065-10.702 30.543-10.702h.148c11.534.033 22.412 3.896 30.63 10.876 9.559 8.12 14.803 19.928 14.765 33.25-.023 8.27-6.735 14.957-14.999 14.957-.013.002-.027.002-.042.002zm52.766 129.374c-26.485 0-48.033-21.533-48.033-48.002 0-8.284 6.716-15 15-15s15 6.716 15 15c0 9.926 8.089 18.002 18.033 18.002s18.033-8.076 18.033-18.002c0-8.284 6.716-15 15-15s15 6.716 15 15c-.001 26.469-21.548 48.002-48.033 48.002zm113.765-129.374c-.015 0-.029 0-.044 0-8.284-.024-14.98-6.759-14.957-15.043.016-5.445-1.993-9.263-6.14-11.673-5.407-3.142-13.27-3.165-18.695-.053-4.161 2.387-6.191 6.193-6.207 11.638-.023 8.27-6.735 14.957-14.999 14.957-.015 0-.029 0-.043 0-8.284-.024-14.981-6.758-14.958-15.043.046-16.149 7.802-29.845 21.281-37.576 14.814-8.497 33.929-8.443 48.695.138 13.434 7.807 21.112 21.547 21.066 37.696-.023 8.271-6.735 14.959-14.999 14.959z"/> </g>';
            OrgChart.templates.royal_template_blue = Object.assign({}, OrgChart.templates.royal_template);
            OrgChart.templates.royal_template_blue.node = '<circle stroke-width="3" fill="none" stroke="#039BE5" cx="43" cy="43" r="41.5"></circle>';

            OrgChart.templates.royal_template.field_2 = '';
            OrgChart.templates.royal_template.field_3 = '';
            OrgChart.templates.royal_template.field_4 = '';
            OrgChart.templates.royal_template.field_5 = '';
            OrgChart.templates.royal_template.field_6 = '';

            var chart = new OrgChart(document.getElementById("tree"), {
                template: "mila", //"family_template",
                layout: OrgChart.mixed,
                align: OrgChart.ORIENTATION,
                enableKeyNavigation: true,
                siblingSeparation: 100,
                //mixedHierarchyNodesSeparation: 100,
                linkBinding: {
                    link_field_0: "createdAt"
                },
                nodeBinding: {
                    field_0: 'name',
                    field_1: "BranchName",
                    field_2: 'Phone',
                    field_3: 'field_3',
                    field_4: 'Sex',
                    field_5: 'Level',
                    field_6: 'field_6',
                    //name: "name",
                    //title: "title",
                    //img: "img",
                    img_0: "img"
                    /*
                        field_0: "name",
                        field_1: "Sex",
                        field_2: "Level",
                        field_3: "SexAndPhone",
                        img_0: "img",
                     */
                },
                tags: {
                    "royal": {
                        template: "royal_template_blue",
                    },
                    //"right-partner": {
                    //    template: "royal_template",
                    //},
                    "royalPartner": {
                        template: "royal_template",
                    },
                    "partner": {
                        template: "family_template_blue", //"family_template_blue"
                    },
                    "blue": {
                        template: "family_template_blue",
                        //nodeMenu: {
                        //    //details: {
                        //    //    text: "Details",
                        //    //},
                        //    add: {
                        //        text: "Thêm con riêng",
                        //        color: "white", //'#fff'
                        //        icon: OrgChart.icon.add(24, 24, '#FF8304'),
                        //        onClick: addChild
                        //    },
                        //    edit: {
                        //        text: "Cập nhật",
                        //        icon: OrgChart.icon.edit(24, 24, '#039BE5'),
                        //        color: "white", //'#fff'
                        //        draggable: true
                        //    },
                        //}
                    },
                },
                //nodeMenu: {
                //        add: {
                //            text: "Thêm con",
                //            color: "white", //'#fff'
                //            icon: OrgChart.icon.add(24, 24, '#FF8304'),
                //            onClick: addChild
                //        },
                //        edit: {
                //            text: "Cập nhật",
                //            icon: OrgChart.icon.edit(24, 24, '#039BE5'),
                //            color: "white", //'#fff'
                //            draggable: true
                //        },
                //        remove: { text: "Xóa" }
                //},
                //nodeContextMenu: {
                //    edit: { text: "Cập nhật", icon: OrgChart.icon.edit(20, 20, '#039BE5') },
                //    add: { text: "Thêm con", icon: OrgChart.icon.add(20, 20, '#FF8304') }
                //},
                nodeMouseClick: OrgChart.action.none,
                menu: {
                    pdf: { text: "Export PDF" },
                    export_pdf: {
                        text: "Export PDF A4",
                        icon: OrgChart.icon.pdf(24, 24, "#7A7A7A"),
                        onClick: pdf
                    },
                    png: { text: "Export PNG" },
                    svg: { text: "Export SVG" },
                    csv: { text: "Export CSV" },
                    template1: {
                        text: "Dùng template 1",
                        icon: OrgChart.icon.pdf(24, 24, "#7A7A7A"),
                        onClick: useTemplate.bind(this, 0)
                    },
                    template2: {
                        text: "Dùng template 2",
                        icon: OrgChart.icon.pdf(24, 24, "#7A7A7A"),
                        onClick: useTemplate.bind(this, 1)
                    },
                },
                enableDragDrop: true,
                toolbar: {
                    fullScreen: true,
                    zoom: true,
                    fit: true,
                    expandAll: true,
                    layout: true,
                },
                //collapse: {
                //    level: 2
                //},
                //expand: {
                //    nodes: [7, 16],
                //    allChildren: true
                //},
                //assistantSeparation: 170,
                enableSearch: true,
                searchFields: ["name"],
                searchDisplayField: "name",
                //miniMap: true,
                //mouseScrool: OrgChart.action.none
            });
            OrgChart.events.on('layout', function (args) {
                if (chart.toolbarUI._visible) {
                    chart.toolbarUI.hideLayout();
                    chart.load(self.options.data);
                }
                //if (args.pnode.id == 100) {
                //    args.layout = OrgChart.treeLeftOffset;
                //}
            });
            chart.on('dbclick', function (sender, args) {
                // your code goes here
                // return false; to cancel the operation
                if (args) {
                    //chart.center(args.id, {}, function () {
                    //    chart.magnify(args.id, 1.25, true, null);
                    //    //chart.searchUI.hide();
                    //});
                    self.options.onClick(args);
                }
            });
            chart.on('render-link', function (sender, args) {
                if (args.cnode.ppid != undefined) {
                    args.html += '<use xlink:href="#baby" x="' + args.p.xa + '" y="' + args.p.ya + '"/>'; //#heart
                }
            });
            chart.on('searchclick', function (sender, nodeId) {
                chart.center(nodeId, {}, function () {
                    chart.magnify(nodeId, 1.25, true, null);
                    chart.searchUI.hide();
                });
                // your code goes here
                // return false; to cancel the operation
            });
            chart.on('key-down', function (sender, args) {
                if (args.node) {
                    if (args.event.code == "KeyN") {
                        //var newData = { id: sender.generateId(), pid: args.node.id };
                        //sender.addNode(newData, null, true);
                        self.options.onAddChild(args.node);
                    }
                    else if (args.event.code == "Enter" || args.event.code == "NumpadEnter") {
                        //sender.editUI.show(args.node.id);
                        self.options.onClick(args.node);
                    }
                    else if (args.event.code === "KeyD") {
                        sender.removeNode(args.node.id, null, true);
                    }
                    //else if (args.event.code === "KeyS") {
                    //    sender.exportSVG({
                    //        filename: "OrgChart.svg",
                    //        expandChildren: false,
                    //        nodeId: args.node.id
                    //    });
                    //}
                }
            });
            function pdf(nodeId) {
                OrgChart.pdfPrevUI.show(chart, {
                    format: "A4",
                    header: 'My Header',
                    footer: 'My Footer. Page {current-page} of {total-pages}'
                });
                //chart.exportPDF({
                //    format: "A4"
                //});
            }
            function useTemplate(isRoyal) {
                if (self.options.isRoyal != isRoyal) {
                    self.options.isRoyal = isRoyal;
                    self.options.data = self.options.data.map((x) => {
                        if (isRoyal) x.tags = x.RelationRootPersonId ? ['royalPartner', "partner"] : ["royal"];
                        else x.tags = x.RelationRootPersonId ? ["partner"] : ["blue"];
                        return x;
                    });
                    chart.load(self.options.data);
                    self.options.onChangeTemplate(isRoyal);
                }
            }
            function addChild(nodeId) {
                var node = chart.getNode(nodeId);
                if (node) {
                    if (node.tags && node.tags[0] == ['partner']) {
                        self.options.onAdd01Child(node);
                        return;
                    }
                    self.options.onAddChild(node);
                }
            }

            Person.func.createControl(chart, branchId, personId, level, maxlevel);
        },
        createControl: function (chart, branchId, personId, level, maxlevel, ssBranchId = 0) {
            var ssBranchId = $("#hdBranchId").val().length != 0 ? Number($("#hdBranchId").val()) : 0;

            var commandAction = {
                BranchId: branchId,
                PersonId: personId,
                Level: level,
                MaxLevel: maxlevel,
                SsBranchId: ssBranchId,
            };

            $.ajax({
                url: '/RootPerson/RootPersonTreeExecuteSearch',
                type: 'post',
                data: {
                    commandAction: commandAction
                },
                success: function (result) {
                    console.log(result);
                    result.forEach(function (ele, inx) {
                        debugger
                        var tags = [];
                        var tmpImage = 'man.png';
                        if (ele.Sex == 'Nữ') tmpImage = 'woman.png';
                        else tmpImage = 'man.png';

                        ele.img = `/assets/upload/branchsource/${tmpImage}`;
                        ele.BranchName = ele.RootBranchId == BrD.params.RootBranchId ? `Tộc: ${BrD.params.RootBranchName}` : "";

                        ele.SexAndPhone = ele.Sex + " - " + ele.Phone;

                        if (ele.tags == "partner") {
                            var slink = {
                                from: ele.pid,
                                to: ele.id,
                                label: ele.Sex == 'Nữ' ? "Vợ" : "Chồng",
                            }
                            chart.addSlink(slink.from, slink.to, slink.label);
                            //BrD.params.pDataSLinks.concat(slink);
                        }
                        if (ele.tags == "partner") {
                            tags.push('partner');
                        }
                        console.log(tags);
                        ele.tags = tags;
                    });
                    console.log(result);
                    chart.load(result);
                }
            });
        },
        loadPhaDo: function () {

        },
    }
}

$(document).ready(function () {
    //BrD.func.createControl();
    //BrD.func.getBranchById();
    var configs = {
        totalPages: 1,
        visiblePages: 1,
        startPage: 1,
    };
    $('.paginationRootPersonTreeExecuteSearch').twbsPagination(configs);
    BrD.func.init(configs);
});
