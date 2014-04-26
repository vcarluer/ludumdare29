/**
 Copyright 2014 Vincent Carluer.

 This file is part of 1gam0414.

 1gam0414 is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 1gam0414 is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with 1gam0414.  If not, see <http://www.gnu.org/licenses/>.
 */
(function () {
	"use strict";
	Game.Service.AudioLoader = function (game) {
		this.game = game;
	};

	Game.Service.AudioLoader.prototype.load = function (soundSources, callback, loop) {
		var soundCount = 0, loaded = 0, src, sound;
		if (!this.game.res.sounds) {
			this.game.res.sounds = [];
		}

		for (src in soundSources) {
			soundCount++;
		}

		for (src in soundSources) {
			if (soundSources.hasOwnProperty(src)) {
				sound = document.createElement("audio");
				sound.setAttribute("id", src);
				sound.style.display = "none";
				sound.src = soundSources[src];
				if (loop) {
					sound.loop = true;
				}

				this.game.res.sounds[src] = sound;

				if (++loaded >= soundCount) {
					callback();
				}
			}
		}

		callback();
	};
}());