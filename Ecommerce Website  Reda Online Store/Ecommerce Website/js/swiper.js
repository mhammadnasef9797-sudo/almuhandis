// swiper.js بعد التعديل لمعالجة مشكلة loop

// السلايدر الأول
(function(){
  const slides1 = document.querySelectorAll('.slide-swp .swiper-slide');
  const enableLoop1 = slides1.length > 3; // عدد كافٍ (slidesPerView الافتراضي =1)

  new Swiper('.slide-swp', {
    pagination: {
      el: '.swiper-pagination',
      dynamicBullets: true, // تم تصحيح الكتابة
      clickable: true
    },
    autoplay: {
      delay: 2500
    },
    loop: enableLoop1
  });
})();

// السلايدر الخاص بالمنتجات
(function(){
  const slides2 = document.querySelectorAll('.slide_product .swiper-slide');
  const slidesPerView = 5;
  // يجب أن يتجاوز العدد ضعف slidesPerView +1 ليعمل loop بأمان
  const enableLoop2 = slides2.length > slidesPerView * 2;

  new Swiper('.slide_product', {
    slidesPerView: slidesPerView,
    spaceBetween: 20,
    autoplay: {
      delay: 2500
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    loop: enableLoop2,
    breakpoints:{
      1200:{
        slidesPerView : 5,
        spaceBetween : 20
      },
      1000:{
        slidesPerView: 3 ,
        spaceBetween: 15 ,

      },
      0:{
        slidesPerView: 2,
        spaceBetween: 10
      }

    }
  });
})();
