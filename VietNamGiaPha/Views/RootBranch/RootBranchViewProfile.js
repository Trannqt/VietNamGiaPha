$(document).ready(function () {
    console.log(this.ViewBag.Result);
    var result = this.ViewBag.Result;
    var profileId = this.ViewBag.ProfileId;
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