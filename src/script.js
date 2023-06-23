$(document).ready(function(){
    // sidebar toggle
    $("#navbar-show-btn").click(() => $('.navbar-collapse').removeClass('translate-x-full'));
    $('#navbar-hide-btn').click(() => $('.navbar-collapse').addClass('translate-x-full'));

    // stop transitin on resize
    let resizeTimer;
    $(window).on('resize', () => {
        $(document.body).addClass('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            $(document.body).removeClass('resize-animation-stopper');
        }, 400);
    });

    // Seach Bar
    // Get the search input element
    const searchInput = document.getElementById('search');

    // Get all the game card elements
    const gameCards = document.querySelectorAll('.game-card');

    // Function to filter game cards based on search input
    const filterGameCards = () => {
        const searchTerm = searchInput.value.toLowerCase();

        gameCards.forEach((card) => {
            const title = card.querySelector('.game-card-title').innerText.toLowerCase();
            const description = card.querySelector('.para-text').innerText.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // Add event listener for input changes
    searchInput.addEventListener('input', filterGameCards);

    // game slider
    $('.game-slider').slick({
        className: "center",
        arrows: true,
        centerMode: true,
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 3,
        slidesToScroll: 1,
        speed: 500,
        autoplay: true,
        dots: true,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    dots: false
                }
            }
        ]
    });

    // categorywise filtering
    let buttonGroup = $('.button-group button');
    let categoryItemsList = $('.category-item');
    let initialActiveCategory = $($(buttonGroup)[0]).data('filter');

    const setActiveButton = (categoryName) => {
        jQuery.each(buttonGroup, function(index, buttonItem){
            if($(buttonItem).data('filter') == categoryName){
                $(buttonItem).addClass('active-filter-button');
            } else {
                $(buttonItem).removeClass('active-filter-button');
            }
        })
    }

    const filterItems = (categoryName) => {
        jQuery.each(categoryItemsList, function(index, categoryItem){
            if($(categoryItem).hasClass(categoryName)){
                $(categoryItem).css('display', 'block');
            } else {
                $(categoryItem).css('display', 'none');
            }
        })
    }

    setActiveButton(initialActiveCategory);
    filterItems(initialActiveCategory);

    jQuery.each(buttonGroup, function(index, buttonItem){
        $(buttonItem).click(function(){
            let categoryName = $(buttonItem).data('filter');
            setActiveButton(categoryName);
            filterItems(categoryName);
        });
    })
});

  const scrollToTopHandler = () => {
  let btn = document.getElementById("scrollToButton");
  if (window.scrollY > 500) {
    btn.className = "scrollToTopButton";
  } else {
    btn.className = "HideElement scrollToTopButton";
  }
};
window.addEventListener("scroll", scrollToTopHandler);
document.getElementById("scrollToButton").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

