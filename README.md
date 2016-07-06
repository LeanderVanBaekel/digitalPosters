# DIGITALPOSTERS


### [screens.leandervanbaekel.nl](screens.leandervanbaekel.nl)


# Herkansing

## Issues

### [Readme aanpassen](https://github.com/LeanderVanBaekel/digitalPosters/issues/16)  


### [Readme aanpassen part 2](https://github.com/LeanderVanBaekel/digitalPosters/issues/12)  

Link geplaatst

### [UI verbeteren](https://github.com/LeanderVanBaekel/digitalPosters/issues/15)  

Oude interface
![oude ui](readme-img/ui-1.png)

Nieuwe interface
![nieuwe ui](readme-img/ui-2.png)

### [HTML verbeteren](https://github.com/LeanderVanBaekel/digitalPosters/issues/14)  
### [Client side JS aanpassen](https://github.com/LeanderVanBaekel/digitalPosters/issues/13)  

## Inleiding

Voor de meesterproef van de minor Everything Web heb ik de opdracht Digital Posters gekozen. Dit ga ik doen in opdracht voor Mattijs Blekemolen.

## Het probleem

De posterframes die in de gangen bij CMD hangen worden graag gebruikt. Te graag. Daarom moet er een oplossing komen waardoor er beter en makkelijker op deze vraag ingespeeld kan worden.

## Mijn oplossing

Digitale posterframes met een slideshow van digitale content. Daarbij een CMS waarin de content beheerd kan worden.

Het prototype is hier te vinden:

[screens.leandervanbaekel.nl](screens.leandervanbaekel.nl)

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
- slideshows beheren
- slideshow toevoegen
- Schermen beheren
- scherm toevoegen

## De schermen

De schermen zijn te bereiken op /dpf/[scherm nummer uit cms]. Bijvoorbeeld: [/dpf/1](http://screens.leandervanbaekel.nl/dpf/1). Hier worden automatisch de slides getoont van de slideshow die gekopelt is aan het scherm nummer. Deze data wordt opgehaald via de link [/dpf/api/1](http://screens.leandervanbaekel.nl/dpf/api/1) waarbij de '1' weer het scherm nummer is.
















