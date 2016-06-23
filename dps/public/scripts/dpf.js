// SCRIPT TO LOAD AND SLIDE THE slides

// Micro lib to send ajax requests

function pegasus(a,b){return b=new XMLHttpRequest,b.open("GET",a),a=[],b.onreadystatechange=b.then=function(c,d,e,f){if(c&&c.call&&(a=[,c,d]),4==b.readyState&&(e=a[0|b.status/200])){try{f=JSON.parse(b.responseText)}catch(g){f=null}e(f,b)}},b.send(),b}

var newData = {};
var data = {};
var htmlData = [];
var update = false;

var refresh = function () {
  console.log("refresh");
  document.location.reload();
}

window.setInterval(refresh, 150000);

// object to create url and send requests
var getData = {
  // baseUrl: 'http://localhost:8080/dpf/api/', // local test
  baseUrl: 'http://146.185.182.221/dpf/api/',
  url: '',
  screenId: 0,
  getScreenId: function () {
    var path = window.location.pathname.split("/");
    this.screenId = path.pop();
    this.makeRequest();
  },
  makeRequest: function () {
    this.url = pegasus(this.baseUrl + this.screenId);
    this.doReq();
  },
  doReq: function () {
    console.log("dorequest");
    this.url.then(
      function (reqData, xhr) {
        data = reqData;
        createElement.createSlides();
      },
      function(data, xhr) {
        console.error(reqData, xhr.status)
      }
    );
  }
};

var setTimeouts = function () {
  console.log("settimeouts");
  disBlock = "dis-block";
  disNone = "dis-none";
  var video;
  var curSlide = 0;
  var oldSlide = null;
  update = false;

  var slides = document.querySelectorAll('.slide');

  var changeSlide = function () {
    console.log("changeslide");

    if (video) {
      video.pause();
      video = undefined;
    }


    slides[curSlide].classList.remove(disNone);
    slides[curSlide].classList.add(disBlock);

    if (htmlData[curSlide].contentType == "video") {
      video = slides[curSlide].querySelector('video');
      video.currentTime = 0;
      video.play();
    }

    if (oldSlide != null) {
      slides[oldSlide].classList.remove(disBlock);
      slides[oldSlide].classList.add(disNone);
    }
    oldSlide = curSlide;
    curSlide ++;



    var duration = htmlData[oldSlide].duration * 1000;

    if (curSlide == slides.length) {
      curSlide = 0;
    }

    if (update == false){
      window.setTimeout(changeSlide, duration);
    }
  };

  if (slides.length == 1) {
    slides[curSlide].classList.remove(disNone);
    slides[curSlide].classList.add(disBlock);
  } else {
    changeSlide();
  }

}

// Create slides from api data.
var createElement = {
  addToDom: function () {
    console.log("addtodom");
    var slideFrame = document.querySelector('.slider');
    htmlData.forEach(function(data) {
      slideFrame.appendChild(data.html);
    });
    setTimeouts();
  },

  createSlides: function () {
    console.log("createslides");
    htmlData = [];
    data.slides.forEach(function(slide){
      if (slide.contentType == "image") {
        createElement.image(slide);
      } else if (slide.contentType == "video") {
        createElement.video(slide);
      } else {
        createElement.text(slide);
      }
    });
    createElement.addToDom();
  },
  image: function (slide) {
    var container = document.createElement("div");
    container.setAttribute('class', 'slide dis-none');
    var innerContainer = document.createElement("div");
    innerContainer.setAttribute('class', 'content-image');

    var newImage = document.createElement("img");
    newImage.setAttribute('src', slide.content);

    innerContainer.appendChild(newImage);
    container.appendChild(innerContainer);
    var slide = slide;
    slide.html = container;
    htmlData.push(slide);
  },
  video: function (slide) {
    var container = document.createElement("div");
    container.setAttribute('class', 'slide dis-none');
    var innerContainer = document.createElement("div");
    innerContainer.setAttribute('class', 'content-video');

    var newVideo = document.createElement("video");
    // newVideo.setAttribute('autoplay', 'true');
    newVideo.setAttribute('src', slide.content);

    innerContainer.appendChild(newVideo);
    container.appendChild(innerContainer);
    var slide = slide;
    slide.html = container;
    htmlData.push(slide);
  },
  text: function (slide) {
    var container = document.createElement("div");
    container.setAttribute('class', 'slide dis-none');
    var innerContainer = document.createElement("div");
    innerContainer.setAttribute('class', 'content-text');

    var newText = document.createElement("div");
    newText.innerHTML= slide.content;

    innerContainer.appendChild(newText);
    container.appendChild(innerContainer);
    var slide = slide;
    slide.html = container;
    htmlData.push(slide);
  }
};

getData.getScreenId();
