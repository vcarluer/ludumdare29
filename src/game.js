/**
 Copyright 2014 Vincent Carluer.

 This file is part of ld29.

 ld29 is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 ld29 is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with ld29.  If not, see <http://www.gnu.org/licenses/>.
 */

window.onload = function () {
	var myGame = new Game("gameDiv");
	myGame.run();
}

// Global game var
var Game = function (divId) {
	this.init(divId);
};
(function () {
	"use strict";
	Game.Service = function(){};
	Game.Scene = function(){};
	Game.Renderer = function () {};

	Game.prototype.init = function (divId) {
		this.scene = {};
		this.dom = {};
		this.service = {};
		this.res = {};
		this.model = {};
		var tile = 32;
		this.options = {
			lang: "en",
			tileSize: tile,
			pyxelCrop: {
				x: 0,
				y: tile,
				width: 7 * tile,
				height: 4 * tile
			},
			size: 800,
			dialogHeight: 150,
			spaceShipHeight: 400,
			choiceHeight: 250
		};

		this.dom.mainDivId = divId;
		this.dom.mainDiv = document.getElementById(divId);

		// resources
		this.res.imagesSources = {
			bkg: "res/bkg.png",
			crew: "res/crew.png",
			planet: "res/planet.png",
			reactor: "res/reactor.png",
			spaceship: "res/spaceship.png"
		};

		// Services
		this.service.imageLoader = new Game.Service.ImageLoader(this);
		this.service.audioLoader = new Game.Service.AudioLoader(this);
		this.service.updateService = new Game.Service.UpdateService(this);
		this.service.canvasLoader = new Game.Service.CanvasLoader(this);
		this.service.translationService = new Game.Service.TranslationService(this);
		this.t = this.service.translationService;

		// scene
		this.scene.scene1 = new Game.Scene.Scene1(this);
	};

	Game.prototype.run = function () {
		var self = this;
		this.service.canvasLoader.createCanvas();
		this.service.imageLoader.load(this.res.imagesSources, function () {
			self.resourceLoaded();
		});
	};

	Game.prototype.resourceLoaded = function () {
		this.scene.scene1.prepare();
		this.service.updateService.loop();
	};
}());