$(document).ready(function () {
    debugger
    console.log(ViewBag.Result);
    var result = ViewBag.Result;
    var profileId = ViewBag.ProfileId;
    if (profileId == 1) {
        $("#root_Description").html(result[0]["ContentThuyTo"]);
    }
    else if (profileId == 2) {
        $("#root_Description").html(result[0]["ContentPhaKy"]);
    }
    else {
        $("#root_Description").html(result[0]["ContentTocUoc"]);
    }
});