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
	Game.Renderer.SpriteRenderer = function (options) {
		this.game = options.game;
		this.image = options.image;
		this.count = options.count;
		this.frameMax = this.count - 1;
		this.tickDelta = options.tickDelta;
		this.loop = options.loop;
		this.callback = options.callback;
		this.tick = -1;
		this.frameIndex = 0;
		this.spriteW = this.image.width / this.count;
		this.spriteH = this.image.height;
	};

	Game.Renderer.SpriteRenderer.prototype.render = function (delta, dx, dy, dw, dh) {
		var x = dx, y = dy, width = dw, height = dh;
		if (!x) {
			x = 0;
		}

		if (!y) {
			y = 0;
		}

		if (!width) {
			width = this.spriteW;
		}

		if (!height) {
			height = this.spriteH;
		}

		if (this.tick === -1) {
			this.tick = 0;
		} else {
			this.tick += delta;
		}

		while (this.tick >= this.tickDelta) {
			this.tick -= this.tickDelta;
			if (this.frameIndex < this.frameMax) {
				this.frameIndex++;
			} else {
				if (this.loop) {
					this.frameIndex = 0;
				} else {
					if (this.callback) {
						this.callback();
					}
				}
			}
		}

		this.game.ctx.drawImage(this.image, this.frameIndex * this.spriteW, 0, this.spriteW, this.spriteH, x, y, width, height);
	}
}());