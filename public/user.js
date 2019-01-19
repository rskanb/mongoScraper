$(document).ready(function(){

// $.ajax({
//     method:"GET",
//     url:"/"
// }).then(function(data){
// })
$(".btn-success").on("click", function(event){
    event.preventDefault();
    var id = $(this).data('_id');
    saveArticle(id);
    $(this).closest(".card").remove();
});

function saveArticle(dataToSend){
    $.ajax({
        method: "POST",
        url: "/"+dataToSend,
    }).then(function(data){
    });
}

//Delete one article
$(document).on("click",".delete", function(event){
    event.preventDefault();
    var id = $(event.target).data('_id')
    $.ajax({
        method:"GET",
        url:"/delete/" + id
    }).then(function(data){
        window.location.href = "/saved"
    })
});

//Delete All article
$("#clear").on("click", function(event){
    event.preventDefault();
    $(".article-container").empty();
    $.ajax({
        method:"GET",
        url:"/clear"
    }).then(function(data){
        window.location.href="/"
    })
});

//Display Note
$(".notes").on("click", function(event){
    event.preventDefault();
    id = $(event.target).data('_id')
    // $("#articledata-modal").modal();
    $.ajax({
        method:"GET",
        url:"/note/"+id,
    }).then(function(data){
        window.location.href = "/saved"
    })
});

//Add Note
$("#notesubmit").on("click", function(event){
    event.preventDefault();
    //var id = $(this).parent().parent().find("h3").text();
    var title = $("#notetitle").val();
    var text= $("#notetext").val();
    $.ajax({
        method:"POST",
        url:"/savenote/"+id,
        data: {
            title: $("#notetitle").val(),
            text: $("#notetext").val()
        }
    }).then(function(data){
        window.location.href = "/saved"
        $("#notetitle").val("");
        $("#notetext").val("")
    })
});
//Scrap New Article
$(".scrap-new").on("click", function(event){
    $.ajax({
        method: "GET",
        url: "/",
    }).then(function(data){
        window.location.href = "/";
    });
});


});  //End of document ready function