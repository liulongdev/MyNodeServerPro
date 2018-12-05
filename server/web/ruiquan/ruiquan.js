function toggleSlideBar(){
    $('.row-offcanvas').toggleClass('active');
    $('#sidebar').toggleClass('hidden-sm');
    $('#sidebar').toggleClass('hidden-md');
    $('#sidebar').toggleClass('hidden-lg');
    $('#sidebar').toggleClass('hidden-xl');
    if ($('.row-offcanvas').hasClass('active'))
    {
        $('#main').removeClass('col-sm-9 col-lg-10');
        $('#main').addClass('col-sm-12 col-lg-12');
    }
    else
    {
        $('#main').removeClass('col-sm-12 col-lg-12');
        $('#main').addClass('col-sm-9 col-lg-10');
    }
}
