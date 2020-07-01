let content = {
		LEAF: {
			title: "Листа",
			description: "Листът е вегетативен орган при растенията, в който се извършва процесът фотосинтеза. Той е надземен и има ограничен растеж. Изграден е основно от две части – листна дръжка и обемиста част, прикрепена на листната дръжка – петура. Ягодата има три петури, затова нейният лист се определя като сложен триделен. Ръбът на петурата е едро назъбен, а жилкуването на листа е мрежовидно.",
			images: [
				{
					src: "texture/leaf-img.png"
				}
			]
		},
		FRUIT: {
			title: "Плод",
			description: "Плодът представлява узрелият яйчник, заедно със семената, на цъфтящото растение. Плодът на ягодата е лъжлив плод - той е растителна структура, която прилича на плод, но не се получава от цвят или цветове. Спецификите на плода до голяма степен са свързани с разпръскването на семената. При ягодата семената се съдържат в семки. Плодът на ягодата се характеризира като прост месест плод - при него целия околоплодник е месест в състояние на зрялост.",
			images: [
				{
					src: "texture/fruit-img.png"
				}
			]
		},
		FLOWER: {
			title: "Цвят",
			description: "Цветът е размножителен орган при покритосеменните растения. В цветовете се извършва опрашването и оплождането. Цветът се прикрепя към стъблото с цветна дръжка в основата на която често има листенца наречени прицвет. Цветът може да бъда разделен на две части - околоцветник и фертилна част. Околоцветникът се състои от чашка (еднородни зелени чашелистчета) и венче (цветни венчелистчета).",
			images: [
				{
					src: "texture/flowers-img.png"
				}
			]
		},
		ROOT: {
			title: "Корен",
			description: "Коренът е подземен вегетативен орган, който прикрепва растението към почвата и всмуква вода и минерални соли. Растежът му е неограничен. В индивидуалното си развитие коренът възниква от зародишното коренче в семената. При покълване и поникване, зародишното коренче първо се показва, когато се разкъса обвивката на семето. Коренът има няколко зони – коренов връх с коренова гугла, зона на нарастване, зона на власинките, зона на разклоняване.",
			images: [
				{
					src: "texture/root-img.png"
				}
			]
		},
		STEM: {
			title: "Стъбло",
			description: "Стъблото (или стебло) е вегетативен надземен орган, който образува и носи пъпките, листата, цветовете и плодовете на растението. Стъблото осъществява връзката между тях не само анатомически, но и физиологически, провеждайки соковете на растението. Начинът, по който листата са разположени по възлите на стъблото, се нарича листоразположение. Листоразположението на ягодата се характеризира като спираловидно. ",
			images: [
				{
					src: "texture/stem-img.png"
				}
			]
		}
	}

class InfoBoard {

	constructor(params) {
		this.domRef =  document.getElementById(params.id);
		this.currentState = "leave";
		this.selectedItem = null;
	}

	getState() {
		console.log(this.currentState);
	}

	closeInfoBoard( event ) {
 		this.domRef.className = "hide-info-board";
 	}

 	showInfoBoard( ) {
  		this.domRef.className = "show-info-board";
  	}

  	showPicture(image, index) {
  		let previosImage = document.querySelectorAll("#slideshow img.current");
  		previosImage[0] && (previosImage[0].className = "previous");

  		image.className = "current";
  		//document.getElementById("picture-description").innerHTML = content[this.selectedItem].images[index].description;
  	}

  	setSelectedItem(name) {
  		this.selectedItem = name;
  		let currentContent = content[this.selectedItem];
  		let imageGallery = [];

  		imageGallery = currentContent.images.map(function(image, index){
  			return `<img ${!index ? 'class="current"' : ""} onclick="infoBoard.showPicture(this, ${index})" src="${image.src}"/>`;
  		}).join(" ");

  		document.getElementById("info-board-article-title").innerHTML = currentContent.title;
  		document.getElementById("info-board-article-text").innerHTML = currentContent.description;
  		//document.getElementById("picture-description").innerHTML = currentContent.images[0].description;

  		document.getElementById("slideshow").innerHTML = imageGallery;
  	}
};