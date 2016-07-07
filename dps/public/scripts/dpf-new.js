// SCRIPT TO LOAD AND SLIDE THE slides

(function () {
  'use strict';

  // object to create url and send requests
  var getData = {
    // baseUrl: 'http://localhost:8080/dpf/api/', // local test
    baseUrl: 'http://146.185.182.221/dpf/api/',
    url: '',
    screenId: 0,
    data: [],
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
      this.url.then(
        function (reqData, xhr) {
          getData.data = reqData;
          createElement.createHtml(getData.data);
        },
        function(data, xhr) {
          console.error(reqData, xhr.status)
        }
      );
    }
  };

  // create HTML elements and add them to the DOM
  var createElement = {
    htmlData: [],
    createHtml: function (data) {
      data.slides.forEach(function(slide){

        var container = document.createElement("div");
        container.setAttribute('class', 'slide dis-none');
        var innerContainer = document.createElement("div");

        if (slide.contentType == "image") {
          innerContainer.setAttribute('class', 'content-image');
          var newImage = document.createElement("img");
          newImage.setAttribute('src', slide.content);
          innerContainer.appendChild(newImage);
        } else if (slide.contentType == "video") {
          innerContainer.setAttribute('class', 'content-video');
          var newVideo = document.createElement("video");
          newVideo.setAttribute('src', slide.content);
          innerContainer.appendChild(newVideo);
        } else {
          innerContainer.setAttribute('class', 'content-text');
          var newText = document.createElement("div");
          newText.innerHTML= slide.content;
          innerContainer.appendChild(newText);
        }

        container.appendChild(innerContainer);
        var slide = slide;
        slide.html = container;
        createElement.htmlData.push(slide);

      });
      createElement.addToDom();
    },
    addToDom: function () {
      var slideFrame = document.querySelector('.slider');
      createElement.htmlData.forEach(function(data) {
        slideFrame.appendChild(data.html);
      });
      startShow.setTimeout();
    }
  };

  // Slide the slideshow!
  var startShow = {
    disBlock: "dis-block",
    disNone: "dis-none",
    curSlide: 0,
    oldSlide: null,
    video: undefined,
    slides: [],
    duration: 0,
    setTimeout: function () {
      startShow.slides = document.querySelectorAll('.slide');

      if (startShow.slides.length == 1) {
        startShow.slides[startShow.curSlide].classList.remove(startShow.disNone);
        startShow.slides[startShow.curSlide].classList.add(startShow.disBlock);
      } else {

        if (startShow.video) {
          startShow.video.pause();
          startShow.video = undefined;
        }
        startShow.slides[startShow.curSlide].classList.remove(startShow.disNone);
        startShow.slides[startShow.curSlide].classList.add(startShow.disBlock);

        if (createElement.htmlData[startShow.curSlide].contentType == "video") {
          startShow.video = startShow.slides[startShow.curSlide].querySelector('video');
          startShow.video.currentTime = 0;
          startShow.video.play();
        }

        if (startShow.oldSlide != null) {
          startShow.slides[startShow.oldSlide].classList.remove(startShow.disBlock);
          startShow.slides[startShow.oldSlide].classList.add(startShow.disNone);
        }
        startShow.oldSlide = startShow.curSlide;
        startShow.curSlide ++;

        startShow.duration = createElement.htmlData[startShow.oldSlide].duration * 1000;

        if (startShow.curSlide == startShow.slides.length) {
          startShow.curSlide = 0;
        }

        window.setTimeout(startShow.setTimeout, startShow.duration);

      }
    }
  };

  var refresh = {
    go: function () {
      document.location.reload();
    }
  };

  window.setInterval(refresh.go, 150000);
  getData.getScreenId();
})();
