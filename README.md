# DIGITALPOSTERS


## Herkansing

###Links

[screens.leandervanbaekel.nl](http://screens.leandervanbaekel.nl)  
Hier kun je het CMS van de schermen bekijken.  

Login: joost  
wachtwoord: 123  
-of-  
Login: koop  
wachtwoord: 123


[screen 1 url](http://screens.leandervanbaekel.nl/dpf/0)  
[screen 2 url](http://screens.leandervanbaekel.nl/dpf/1)  
Hier kun je de schermen bekijken


 
[Poster](readme-img/eindposter.pdf)  
Hier is de poster die ik voor de presentatie heb gemaakt.



## Issues

### [Readme aanpassen](https://github.com/LeanderVanBaekel/digitalPosters/issues/16)  

Dat ben je nu aan het lezen ;) 


### [UI verbeteren](https://github.com/LeanderVanBaekel/digitalPosters/issues/15)  

#### Oude interface
![oude ui](readme-img/ui-1.png)  
![oude ui](readme-img/ui-3.png)


#### Nieuwe interface
Het nieuwe interface maakt gebruik van 'blokken' in plaats van tabellen/lijsten. Dit is voor de gebruiker beter leesbaar. Zo zie je ook sneller de items los van elkaar in plaats van één brei aan content.  
![nieuwe ui](readme-img/ui-4.png)  
Het eerste scherm waar je op komt (na het inloggen) is een overzicht van de screens die je kunt aanpassen.  
![nieuwe ui](readme-img/ui-2.png)
De content op het scherm is makkelijk aan te passen met de knoppen 'add' en 'remove'. Je kunt gemakkelijk een slide toevoegen met de knop 'add new slide' rechtsboven. Er is ook een knop om een voorbeeld zien van de slideshow.


### [HTML verbeteren](https://github.com/LeanderVanBaekel/digitalPosters/issues/14)  

In het formulier waar je slides kunt toevoegen zaten ```<br>``` elementen om het op te maken. Die zijn er nu uit gehaald zoals je [hier kunt zien](https://github.com/LeanderVanBaekel/digitalPosters/blob/master/dps/views/add-slide.ejs#L32).

In de navigatie zat een button in een ```<a>``` element. Met de nieuwe layout heb ik de hele navigatie eruit gehaald waardoor dit probleem ook weg is.

### [Client side JS aanpassen](https://github.com/LeanderVanBaekel/digitalPosters/issues/13)  

#### Consistente structuur

[De nieuwe javascript client code](https://github.com/LeanderVanBaekel/digitalPosters/blob/master/dps/public/scripts/dpf-new.js) is helemaal in objecten geschreven in plaats van voor de helft. Hierdoor is de leesbaarheid van de code verbeterd.

#### Dry'er

In [deze functie](https://github.com/LeanderVanBaekel/digitalPosters/blob/master/dps/public/scripts/dpf-new.js#L38) werd een hoop code herhaald. 

```javascript
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
``` 

Ik heb deze nu zo geschreven dat alle code die hetzelfde is voor alle 3 de soorten slides niet herhaald in de functie. Hij zou technisch gezien nog kleiner kunnen met bijvoorbeeld een constructor functie. Maar omdat deze code alleen op dedicated machines draait en dit nu nog een prototype is waar nog dingen in de data kunnen veranderen leek mij dit geen goed idee.

```javascript
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
  innerContainer.appendChild(newVideo);
} else {
  innerContainer.setAttribute('class', 'content-text');
  var newText = document.createElement("div");
  newText.innerHTML= slide.content;
  innerContainer.appendChild(newText);
}

```

#### IIFE

De code draait op een dedicated computer. Hierdoor vind ik dat het niet zo belangrijk om te code af te schermen. Omdat het wel best-practice is heb ik het in een [IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression) gezet zodat de code niet buiten de bedoelde scope beschikbaar is.

Voorbeeld:  

```javascript
(function () {
  'use strict';
  
  //code
  
})();  

```  

## Inleiding

Voor de meesterproef van de minor Everything Web heb ik de opdracht Digital Posters gekozen. Dit ga ik doen in opdracht voor Mattijs Blekemolen.

## Het probleem

De posterframes die in de gangen bij CMD hangen worden graag gebruikt. Te graag. Daarom moet er een oplossing komen waardoor er beter en makkelijker op deze vraag ingespeeld kan worden.

## Mijn oplossing

Digitale posterframes met een slideshow van digitale content. Daarbij een CMS waarin de content beheerd kan worden.

Het prototype is hier te vinden:

[screens.leandervanbaekel.nl](http://screens.leandervanbaekel.nl)

## User stories

1.	Toon een aantrekkelijke carousel met (digitale) informatie posters in de 2 schermen op de gang.2.	Maak een web based systeem waarmee eenvoudig posters kunnen worden geupload, in een bepaalde volgorde kunnen worden gezet en voor een bepaalde tijd kunnen worden getoond.

# De Applicatie

De applicatie is geschreven in Node.js met een [Express server](https://www.npmjs.com/package/express). Deze regelt de server en de routing. Als template engine heb ik gekozen voor [EJS](https://www.npmjs.com/package/ejs). Dit is een robuste combinatie die veel gebruikt wordt en waar veel/goede ondersteuning voor is. Voor het database heb ik gekozen voor [MongoDB](https://mongodb.com). Ik heb hiervoor gekozen omdat Mongo flexibeler is dan de grote tegenhanger MySQL, dit komt goed van pas tijdens dit project omdat nog niet alle features vanaf het begin goed op papier staan.

## Opstarten

Om de applicatie lokaal te starten moet je eerst zorgen dat er een MongoDB server draait. Daarna ga je naar de applicatie map en voer je het commando
```
sudo npm install 
```
en  
```
node server.js
```
uit.

## Het CMS

Voor het beheren van de schermen, slideshows en slides is een Content Management System nodig. Deze is te bereiken op [/dps](http://screens.leandervanbaekel.nl/dps) (hiervoor moet je inloggen naam: mathijs, wachtwoord: 123). 

Hier zijn de volgende functies te vinden:

- Slides beheren
- slide toevoegen
- Schermen beheren
- scherm toevoegen

## De schermen

De schermen zijn te bereiken op /dpf/[scherm nummer uit cms]. Bijvoorbeeld: [/dpf/0](http://screens.leandervanbaekel.nl/dpf/0). Hier worden automatisch de slides getoont van de slideshow die gekopelt is aan het scherm nummer. Deze data wordt opgehaald via de link [/dpf/api/0](http://screens.leandervanbaekel.nl/dpf/api/0s) waarbij de '1' weer het scherm nummer is.


## Koppeling met de vakken

### Web app form scratch
Voor het opzetten van dit project heb ik gebruik gemaakt van de technieken die we geleerd hebben tijdens WAFS. Ik heb bijvoorbeeld geleerd hoe je api's kunt aanspreken met XHR requests. Dit heb ik weer toegepast hier: 

```javascript
  var getData = {
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
```
Dit is het getData object waarmee de Raspberry Pi de data van de slides opvraagd van de server. met de getScreenId en makeRequest functies maak ik de dynamische URL voor het opvragen van de data. DoReq voert de XHR request vervolgens uit met behulp van de micro lib [Pegasus](https://github.com/typicode/pegasus). 


### CSS to the rescue

Zonder CSS is de website wel bruikbaar maar niet mooi. Daarom heb ik de tips en trucs die we geleerd hebben bij CSS to the rescue toegepast in dit project. 

Ik heb bijvoorbeeld formulier elementen gestyled:

```
.add-content input {
  border: none;
  border-bottom: 2px solid #FFCC00;
  border-left: 2px solid #FFCC00;
  font-size: 0.9em;
}
```
Resultaat:  
![formulier voorbeeld](readme-img/form.png)

Ze zijn nog steeds bruikbaar maar passen nu beter in de style van rest van de site.

### Performance Matters

Performance matters dat is duidelijk. Niemand zit te wachten op langzaam ladende pagina's. Om dit te voorkomen heb ik er voor gezorgd dat de afbeeldingen die ik zelf toegevoegd heb zo klein mogelijk zijn. Verder heb ik alle CSS in een bestand gezet en alle javascript op ook. 

In het CMS render ik alles serverside zodat ik niet afhankelijk ben van het apparaat van de gebruiker die de pagina bekijkt.

### Browser Technologies

Browser Technologies is een van de vakken die ik bij ongeveer elke regel code die schrijf in mijn achterhoofd heb zitten. Als ik hier een lijst wil weergeven, welk element kan ik dan het beste gebruiken? Het antwoord kwam dan meestal uit een van de wijze lessen van Krijn of Koop dat het ook bruikbaar moet zijn voor mensen met een handicap oid.

Zo ben ik ook met de html begonnen voordat ik CSS toegepast heb. Hierdoor heb ik de data die in een lijst hoort ook echt in een lijst gezet in plaats van allemaal losse items (div's) maken.

![voorbeeld lijst](readme-img/list.png)

Ook werkt het hele CMS zonder javascript en wordt alles dus serverside geregeld waardoor de pagina's extreem snel en ligt zijn. (Helaas op de geuploade content na.)











