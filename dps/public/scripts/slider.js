var slides = [],
    disBlock = "dis-block",
    disNone = "dis-none",
    setTime = 5,
    timeout = 0,
    slideShown = 0;
    slideOld = 0;



calcTime = function () {
  timeout = setTime * 1000;
}
calcTime();


slides = document.querySelectorAll('.slide');

for (var i = 0; i < slides.length; i++) {
  slides[i].classList.add(disNone);
}

slides[slideShown].classList.add(disBlock);
slides[slideShown].classList.remove(disNone);



setInterval(function () {
  slideOld = slideShown
  slideShown ++;
  if (slideShown == slides.length ) {
    slideShown = 0;
  }

  console.log('shown ', slideShown);
  console.log('old ', slideOld);

  slides[slideShown].classList.add(disBlock);
  slides[slideShown].classList.remove(disNone);
  slides[slideOld].classList.add(disNone);
  slides[slideOld].classList.remove(disBlock);
}, timeout);

var socket = io.connect();

console.log(slides);
