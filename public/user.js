$(document).ready(function(){

// $.ajax({
//     method:"GET",
//     url:"/"
// }).then(function(data){
// })
$(".btn-success").on("click", function(event){
    event.preventDefault();
    var id = $(this).data('_id');
    console.log(id);
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
    console.log("clear Button hit");
    $.ajax({
        method:"GET",
        url:"/clear"
    }).then(function(data){
        window.location.href = "/"
    })
});

$(".scrap-new").on("click", function(event){
    window.location.href = "/";
});


});  //End of document ready function