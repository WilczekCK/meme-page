$(window).on('load', _ => {
  //masonry
  imagesLoaded('.meme__container', function () {
    var $grid = $('.meme__container').isotope({
      itemSelector: '.meme__item',
      masonry: {
        columnWidth: 40,
        isFitWidth: true
        }
    })

    $('.menu__container__wrap__menu li a').on('click', function () {
      var filterValue = `.${this.id}`;
      // use filterFn if matches value
      $grid.isotope({ filter: filterValue, layoutMode: 'fitRows' });
    })


  });



})