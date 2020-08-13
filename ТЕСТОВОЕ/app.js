$(function () {
    let header = $("#header"),
        introH = $("#intro").innerHeight(),
        scrollOffset = $(window).scrollTop();
    checkScroll(scrollOffset);
    $(window).on("scroll", function () {
        scrollOffset = $(this).scrollTop();

        /* Fixed Header */
        checkScroll(scrollOffset);
    });

    function checkScroll(scrollOffset) {
        if (scrollOffset >= introH) {
            header.addClass("fixed");
        } else {
            header.removeClass("fixed");
        }
    }

    /* Smooth scroll */
    $("[data-scroll]").on("click", function (event) {
        event.preventDefault();

        let $this = $(this),
            blockId = $this.data("scroll"),
            blockOffset = $(blockId).offset().top;

        $("#nav a").removeClass("active");
        $this.addClass("active");

        $("html, body").animate({
            scrollTop: blockOffset
        }, 500);
    });

    /* Menu nav toggle */
    $("#nav_toggle").on("click", function (event) {
        event.preventDefault();

        $(this).toggleClass("active");
        $("#nav").toggleClass("active");

    });

    /* Collapse */
    $("[data-collapse]").on("click", function (event) {
        event.preventDefault();

        let $this = $(this),
            blockId = $this.data("collapse");

        $(this).toggleClass("active");
    });

    /* Slider */
    $("[data-slider]").slick({
        infinite: true,
        fade: false,
        slidesToShow: 1,
        slidesToScroll: 1
    });

});






'use strict';
 $(document).ready(function(){

 // Initialize global variables
 let totalListings;
 let ajaxpagenumber;
 let title;
 let year;
 let url;
 let data;

 $("#search__btn").on("click", function(event){
 event.preventDefault();

  title = $("#search__input").val();
  data = {
   s: title,
   y: year,
   type: "movie",
   r: "json",
   page: ajaxpagenumber,
   callback: ""
  };
  getMoviesFromSearch(title, JSON.stringify(data)).then(res => displayResults(res));

  });

  $('button').click(function(){
  var table = $(this).parents('#movie').eq(0)
  var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))

  this.asc = !this.asc
  if (!this.asc){rows = rows.reverse()}
  for (var i = 0; i < rows.length; i++){table.append(rows[i])}
   })
   function comparer(index) {
   return function(a, b) {
      var valA = getCellValue(a, index), valB = getCellValue(b, index)
      return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : 
  valA.toString().localeCompare(valB)
   }
  }
  function getCellValue(row, index){ return $(row).children('td').eq(index).text() }


  function displayResults(response){
  var html = " ";
  if (response.Response == "False") {
   html += "<li class='no-movies'>";
   html += "<i class='material-icons icon-help'>help_outline</i>No movies found by keyword: " + 
 $("#search__input").val() + "</li>";
 } else {
   $.each(response.Search, function(index, movie){
     var poster;

     html += "<tr>";
     html += "<th><p>" + movie.Title + "</p></th>";
     html += "<th><a href='http://www.imdb.com/title/" + movie.imdbID + "' target='_blank'>" + 
    movie.imdbID +"</a></th>";
     html += "</tr>";

   }); 
  }


  totalListings = response.totalResults;
  paginate(totalListings);

 } 

 function paginate(){
  var pagesNeeded = Math.ceil(totalListings/10);

  $("body").append("<footer id='pagination'><ul id='paginationlist'></ul></footer>");

  for (var i=0; i< pagesNeeded; i++){
    var newPageNumber = $("<li></li>");
    newPageNumber.text(i+1);
    $("#paginationlist").append(newPageNumber);

  }

  updateAjaxCall();
  } 

  function updateAjaxCall(){

  $("#paginationlist li").click(function(){

    $("#movie").empty();
    $("#pagination").remove();

    ajaxpagenumber = parseInt($(this).text());
    title = $("#search__input").val();
    year = $("#movie__year").val();
    url = "http://www.omdbapi.com/?apikey=8b47da7b&s";
    data = {
       s: title,
       y: year,
       type: "movie",
       r: "json",
       page: ajaxpagenumber
    };

    // new AJAX call
    $.getJSON(url, data, displayResults).fail(ajaxFail);

    });
  }   


 }); 

function getMoviesFromSearch (searchStr) {
 return fetch(`http://www.omdbapi.com/?apikey=8b47da7b&s
 =${searchStr}`).then(res => res.json());
 }

 //AJAX errors
 function ajaxFail(jqXHR) {

  var errorhtml = "";
  errorhtml += "<p>Your search failed, there is" + jqXHR.statusText + " error.</p>";

  $("#movie").append(errorhtml);
 }