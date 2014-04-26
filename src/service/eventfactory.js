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

// Global static tooling
EventFactory = function () {};

(function () {
	"use strict";

	// Unified method to create events on all browsers
	// To use with:
	// this.game.event.addEventListener(name, callback);
	// this.game.events.dispatchEvent(evt);
	EventFactory.create = function (name, params) {
		var evt = document.createEvent('CustomEvent');
		evt.initCustomEvent(name, true, true, params);
		return evt;
	};
}());