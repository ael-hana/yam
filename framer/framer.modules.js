require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"ViewNavigationController":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.ViewNavigationController = (function(superClass) {
  var ANIMATION_OPTIONS, BACKBUTTON_VIEW_NAME, BACK_BUTTON_FRAME, DEBUG_MODE, DIR, INITIAL_VIEW_NAME, PUSH;

  extend(ViewNavigationController, superClass);

  INITIAL_VIEW_NAME = "initialView";

  BACKBUTTON_VIEW_NAME = "vnc-backButton";

  ANIMATION_OPTIONS = {
    time: 0.3,
    curve: "ease-in-out"
  };

  BACK_BUTTON_FRAME = {
    x: 0,
    y: 40,
    width: 88,
    height: 88
  };

  PUSH = {
    UP: "pushUp",
    DOWN: "pushDown",
    LEFT: "pushLeft",
    RIGHT: "pushRight",
    CENTER: "pushCenter"
  };

  DIR = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right"
  };

  DEBUG_MODE = false;

  function ViewNavigationController(options) {
    var base, base1, base2, base3;
    this.options = options != null ? options : {};
    this.views = this.history = this.initialView = this.currentView = this.previousView = this.initialViewName = null;
    if ((base = this.options).width == null) {
      base.width = Screen.width;
    }
    if ((base1 = this.options).height == null) {
      base1.height = Screen.height;
    }
    if ((base2 = this.options).clip == null) {
      base2.clip = true;
    }
    if ((base3 = this.options).backgroundColor == null) {
      base3.backgroundColor = "#999";
    }
    ViewNavigationController.__super__.constructor.call(this, this.options);
    this.views = [];
    this.history = [];
    this.animationOptions = this.options.animationOptions || ANIMATION_OPTIONS;
    this.initialViewName = this.options.initialViewName || INITIAL_VIEW_NAME;
    this.backButtonFrame = this.options.backButtonFrame || BACK_BUTTON_FRAME;
    this.debugMode = this.options.debugMode != null ? this.options.debugMode : DEBUG_MODE;
    this.on("change:subLayers", function(changeList) {
      return Utils.delay(0, (function(_this) {
        return function() {
          var i, len, ref, results, subLayer;
          ref = changeList.added;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subLayer = ref[i];
            results.push(_this.addView(subLayer, true));
          }
          return results;
        };
      })(this));
    });
  }

  ViewNavigationController.prototype.addView = function(view, viaInternalChangeEvent) {
    var obj, vncHeight, vncWidth;
    vncWidth = this.options.width;
    vncHeight = this.options.height;
    view.states.add((
      obj = {},
      obj["" + PUSH.UP] = {
        x: 0,
        y: -vncHeight
      },
      obj["" + PUSH.LEFT] = {
        x: -vncWidth,
        y: 0
      },
      obj["" + PUSH.CENTER] = {
        x: 0,
        y: 0
      },
      obj["" + PUSH.RIGHT] = {
        x: vncWidth,
        y: 0
      },
      obj["" + PUSH.DOWN] = {
        x: 0,
        y: vncHeight
      },
      obj
    ));
    view.states.animationOptions = this.animationOptions;
    if (view.name === this.initialViewName) {
      this.initialView = view;
      this.currentView = view;
      view.states.switchInstant(PUSH.CENTER);
      this.history.push(view);
    } else {
      view.states.switchInstant(PUSH.RIGHT);
    }
    if (!(view.superLayer === this || viaInternalChangeEvent)) {
      view.superLayer = this;
    }
    if (view.name !== this.initialViewName) {
      this._applyBackButton(view);
    }
    return this.views.push(view);
  };

  ViewNavigationController.prototype.transition = function(view, direction, switchInstant, preventHistory) {
    if (direction == null) {
      direction = DIR.RIGHT;
    }
    if (switchInstant == null) {
      switchInstant = false;
    }
    if (preventHistory == null) {
      preventHistory = false;
    }
    if (view === this.currentView) {
      return false;
    }
    if (direction === DIR.RIGHT) {
      view.states.switchInstant(PUSH.RIGHT);
      this.currentView.states["switch"](PUSH.LEFT);
    } else if (direction === DIR.DOWN) {
      view.states.switchInstant(PUSH.DOWN);
      this.currentView.states["switch"](PUSH.UP);
    } else if (direction === DIR.LEFT) {
      view.states.switchInstant(PUSH.LEFT);
      this.currentView.states["switch"](PUSH.RIGHT);
    } else if (direction === DIR.UP) {
      view.states.switchInstant(PUSH.UP);
      this.currentView.states["switch"](PUSH.DOWN);
    } else {
      view.states.switchInstant(PUSH.CENTER);
      this.currentView.states.switchInstant(PUSH.LEFT);
    }
    view.states["switch"](PUSH.CENTER);
    this.previousView = this.currentView;
    this.previousView.custom = {
      lastTransition: direction
    };
    this.currentView = view;
    if (preventHistory === false) {
      this.history.push(this.previousView);
    }
    return this.emit("change:view");
  };

  ViewNavigationController.prototype.removeBackButton = function(view) {
    return Utils.delay(0.1, (function(_this) {
      return function() {
        return view.subLayersByName(BACKBUTTON_VIEW_NAME)[0].visible = false;
      };
    })(this));
  };

  ViewNavigationController.prototype.back = function() {
    var direction, lastTransition, lastView, oppositeTransition, preventHistory, switchInstant;
    lastView = this._getLastHistoryItem();
    lastTransition = lastView.custom.lastTransition;
    oppositeTransition = this._getOppositeDirection(lastTransition);
    this.transition(lastView, direction = oppositeTransition, switchInstant = false, preventHistory = true);
    return this.history.pop();
  };

  ViewNavigationController.prototype._getLastHistoryItem = function() {
    return this.history[this.history.length - 1];
  };

  ViewNavigationController.prototype._applyBackButton = function(view, frame) {
    if (frame == null) {
      frame = this.backButtonFrame;
    }
    return Utils.delay(0, (function(_this) {
      return function() {
        var backButton;
        if (view.backButton !== false) {
          backButton = new Layer({
            name: BACKBUTTON_VIEW_NAME,
            width: 80,
            height: 80,
            superLayer: view
          });
          if (_this.debugMode === false) {
            backButton.backgroundColor = "transparent";
          }
          backButton.frame = frame;
          return backButton.on(Events.Click, function() {
            return _this.back();
          });
        }
      };
    })(this));
  };

  ViewNavigationController.prototype._getOppositeDirection = function(initialDirection) {
    if (initialDirection === DIR.UP) {
      return DIR.DOWN;
    } else if (initialDirection === DIR.DOWN) {
      return DIR.UP;
    } else if (initialDirection === DIR.RIGHT) {
      return DIR.LEFT;
    } else if (initialDirection === DIR.LEFT) {
      return DIR.RIGHT;
    } else {
      return DIR.LEFT;
    }
  };

  return ViewNavigationController;

})(Layer);


/*

USAGE EXAMPLE 1 - Define InitialViewName

initialViewKey = "view1"

vnc = new ViewNavigationController
	initialViewName: initialViewKey

view1 = new Layer
	name: initialViewKey
	width:  Screen.width
	height: Screen.height
	backgroundColor: "red"
	parent: vnc
 */


/*

USAGE EXAMPLE 2 - Use default initialViewName "initialView"

vnc = new ViewNavigationController

view1 = new Layer
	name: "initialView"
	width:  Screen.width
	height: Screen.height
	backgroundColor: "red"
	parent: vnc

view2 = new Layer
	width:  Screen.width
	height: Screen.height
	backgroundColor: "green"
	parent: vnc

view1.onClick ->
	vnc.transition view2

view2.onClick ->
	vnc.back()
 */


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL0Rlc2t0b3AveWFtLmZyYW1lci9tb2R1bGVzL1ZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIGV4cG9ydHMuVmlld05hdmlnYXRpb25Db250cm9sbGVyIGV4dGVuZHMgTGF5ZXJcblxuXHQjIFNldHVwIENsYXNzIENvbnN0YW50c1xuXHRJTklUSUFMX1ZJRVdfTkFNRSA9IFwiaW5pdGlhbFZpZXdcIlxuXG5cdEJBQ0tCVVRUT05fVklFV19OQU1FID0gXCJ2bmMtYmFja0J1dHRvblwiXG5cblx0QU5JTUFUSU9OX09QVElPTlMgPSBcblx0XHR0aW1lOiAwLjNcblx0XHRjdXJ2ZTogXCJlYXNlLWluLW91dFwiXG5cblx0QkFDS19CVVRUT05fRlJBTUUgPSBcblx0XHR4OiAwXG5cdFx0eTogNDBcblx0XHR3aWR0aDogODhcblx0XHRoZWlnaHQ6IDg4XG5cblx0UFVTSCA9XG5cdFx0VVA6ICAgICBcInB1c2hVcFwiXG5cdFx0RE9XTjogICBcInB1c2hEb3duXCJcblx0XHRMRUZUOiAgIFwicHVzaExlZnRcIlxuXHRcdFJJR0hUOiAgXCJwdXNoUmlnaHRcIlxuXHRcdENFTlRFUjogXCJwdXNoQ2VudGVyXCJcblxuXHRESVIgPVxuXHRcdFVQOiAgICBcInVwXCJcblx0XHRET1dOOiAgXCJkb3duXCJcblx0XHRMRUZUOiAgXCJsZWZ0XCJcblx0XHRSSUdIVDogXCJyaWdodFwiXG5cblx0REVCVUdfTU9ERSA9IGZhbHNlXG5cblx0IyBTZXR1cCBJbnN0YW5jZSBhbmQgSW5zdGFuY2UgVmFyaWFibGVzXG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnM9e30pIC0+XG5cblx0XHRAdmlld3MgPSBAaGlzdG9yeSA9IEBpbml0aWFsVmlldyA9IEBjdXJyZW50VmlldyA9IEBwcmV2aW91c1ZpZXcgPSBAaW5pdGlhbFZpZXdOYW1lID0gbnVsbFxuXHRcdEBvcHRpb25zLndpZHRoICAgICAgICAgICA/PSBTY3JlZW4ud2lkdGhcblx0XHRAb3B0aW9ucy5oZWlnaHQgICAgICAgICAgPz0gU2NyZWVuLmhlaWdodFxuXHRcdEBvcHRpb25zLmNsaXAgICAgICAgICAgICA/PSB0cnVlXG5cdFx0QG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IFwiIzk5OVwiXG5cblx0XHRzdXBlciBAb3B0aW9uc1xuXG5cdFx0QHZpZXdzICAgPSBbXVxuXHRcdEBoaXN0b3J5ID0gW11cblx0XHRAYW5pbWF0aW9uT3B0aW9ucyA9IEBvcHRpb25zLmFuaW1hdGlvbk9wdGlvbnMgb3IgQU5JTUFUSU9OX09QVElPTlNcblx0XHRAaW5pdGlhbFZpZXdOYW1lICA9IEBvcHRpb25zLmluaXRpYWxWaWV3TmFtZSAgb3IgSU5JVElBTF9WSUVXX05BTUVcblx0XHRAYmFja0J1dHRvbkZyYW1lICA9IEBvcHRpb25zLmJhY2tCdXR0b25GcmFtZSAgb3IgQkFDS19CVVRUT05fRlJBTUVcblxuXHRcdEBkZWJ1Z01vZGUgPSBpZiBAb3B0aW9ucy5kZWJ1Z01vZGU/IHRoZW4gQG9wdGlvbnMuZGVidWdNb2RlIGVsc2UgREVCVUdfTU9ERVxuXG5cdFx0QC5vbiBcImNoYW5nZTpzdWJMYXllcnNcIiwgKGNoYW5nZUxpc3QpIC0+XG5cdFx0XHRVdGlscy5kZWxheSAwLCA9PlxuXHRcdFx0XHRAYWRkVmlldyBzdWJMYXllciwgdHJ1ZSBmb3Igc3ViTGF5ZXIgaW4gY2hhbmdlTGlzdC5hZGRlZFxuXG5cdGFkZFZpZXc6ICh2aWV3LCB2aWFJbnRlcm5hbENoYW5nZUV2ZW50KSAtPlxuXG5cdFx0dm5jV2lkdGggID0gQG9wdGlvbnMud2lkdGhcblx0XHR2bmNIZWlnaHQgPSBAb3B0aW9ucy5oZWlnaHRcblxuXHRcdHZpZXcuc3RhdGVzLmFkZFxuXHRcdFx0XCIjeyBQVVNILlVQIH1cIjpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiAtdm5jSGVpZ2h0XG5cdFx0XHRcIiN7IFBVU0guTEVGVCB9XCI6XG5cdFx0XHRcdHg6IC12bmNXaWR0aFxuXHRcdFx0XHR5OiAwXG5cdFx0XHRcIiN7IFBVU0guQ0VOVEVSIH1cIjpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiAwXG5cdFx0XHRcIiN7IFBVU0guUklHSFQgfVwiOlxuXHRcdFx0XHR4OiB2bmNXaWR0aFxuXHRcdFx0XHR5OiAwXG5cdFx0XHRcIiN7IFBVU0guRE9XTiB9XCI6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogdm5jSGVpZ2h0XG5cblx0XHR2aWV3LnN0YXRlcy5hbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnNcblxuXHRcdGlmIHZpZXcubmFtZSBpcyBAaW5pdGlhbFZpZXdOYW1lXG5cdFx0XHRAaW5pdGlhbFZpZXcgPSB2aWV3XG5cdFx0XHRAY3VycmVudFZpZXcgPSB2aWV3XG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50IFBVU0guQ0VOVEVSXG5cdFx0XHRAaGlzdG9yeS5wdXNoIHZpZXdcblx0XHRlbHNlXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50IFBVU0guUklHSFRcblxuXHRcdHVubGVzcyB2aWV3LnN1cGVyTGF5ZXIgaXMgQCBvciB2aWFJbnRlcm5hbENoYW5nZUV2ZW50XG5cdFx0XHR2aWV3LnN1cGVyTGF5ZXIgPSBAXG5cblx0XHRAX2FwcGx5QmFja0J1dHRvbiB2aWV3IHVubGVzcyB2aWV3Lm5hbWUgaXMgQGluaXRpYWxWaWV3TmFtZVxuXG5cdFx0QHZpZXdzLnB1c2ggdmlld1xuXG5cdHRyYW5zaXRpb246ICh2aWV3LCBkaXJlY3Rpb24gPSBESVIuUklHSFQsIHN3aXRjaEluc3RhbnQgPSBmYWxzZSwgcHJldmVudEhpc3RvcnkgPSBmYWxzZSkgLT5cblxuXHRcdHJldHVybiBmYWxzZSBpZiB2aWV3IGlzIEBjdXJyZW50Vmlld1xuXG5cdFx0IyBTZXR1cCBWaWV3cyBmb3IgdGhlIHRyYW5zaXRpb25cblx0XHRpZiBkaXJlY3Rpb24gaXMgRElSLlJJR0hUXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50ICBQVVNILlJJR0hUXG5cdFx0XHRAY3VycmVudFZpZXcuc3RhdGVzLnN3aXRjaCBQVVNILkxFRlRcblx0XHRlbHNlIGlmIGRpcmVjdGlvbiBpcyBESVIuRE9XTlxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCAgUFVTSC5ET1dOXG5cdFx0XHRAY3VycmVudFZpZXcuc3RhdGVzLnN3aXRjaCBQVVNILlVQXG5cdFx0ZWxzZSBpZiBkaXJlY3Rpb24gaXMgRElSLkxFRlRcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgIFBVU0guTEVGVFxuXHRcdFx0QGN1cnJlbnRWaWV3LnN0YXRlcy5zd2l0Y2ggUFVTSC5SSUdIVFxuXHRcdGVsc2UgaWYgZGlyZWN0aW9uIGlzIERJUi5VUFxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCAgUFVTSC5VUFxuXHRcdFx0QGN1cnJlbnRWaWV3LnN0YXRlcy5zd2l0Y2ggUFVTSC5ET1dOXG5cdFx0ZWxzZVxuXHRcdFx0IyBJZiB0aGV5IHNwZWNpZmllZCBzb21ldGhpbmcgZGlmZmVyZW50IGp1c3Qgc3dpdGNoIGltbWVkaWF0ZWx5XG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50IFBVU0guQ0VOVEVSXG5cdFx0XHRAY3VycmVudFZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgUFVTSC5MRUZUXG5cblx0XHQjIFB1c2ggdmlldyB0byBDZW50ZXJcblx0XHR2aWV3LnN0YXRlcy5zd2l0Y2ggUFVTSC5DRU5URVJcblx0XHQjIGN1cnJlbnRWaWV3IGlzIG5vdyBvdXIgcHJldmlvdXNWaWV3XG5cdFx0QHByZXZpb3VzVmlldyA9IEBjdXJyZW50Vmlld1xuXHRcdCMgU2F2ZSB0cmFuc2l0aW9uIGRpcmVjdGlvbiB0byB0aGUgbGF5ZXIncyBjdXN0b20gcHJvcGVydGllc1xuXHRcdEBwcmV2aW91c1ZpZXcuY3VzdG9tID1cblx0XHRcdGxhc3RUcmFuc2l0aW9uOiBkaXJlY3Rpb25cblx0XHQjIFNldCBvdXIgY3VycmVudFZpZXcgdG8gdGhlIHZpZXcgd2UndmUgYnJvdWdodCBpblxuXHRcdEBjdXJyZW50VmlldyA9IHZpZXdcblxuXHRcdCMgU3RvcmUgdGhlIGxhc3QgdmlldyBpbiBoaXN0b3J5XG5cdFx0QGhpc3RvcnkucHVzaCBAcHJldmlvdXNWaWV3IGlmIHByZXZlbnRIaXN0b3J5IGlzIGZhbHNlXG5cdFx0XG5cdFx0IyBFbWl0IGFuIGV2ZW50IHNvIHRoZSBwcm90b3R5cGUgY2FuIHJlYWN0IHRvIGEgdmlldyBjaGFuZ2Vcblx0XHRAZW1pdCBcImNoYW5nZTp2aWV3XCJcblxuXHRyZW1vdmVCYWNrQnV0dG9uOiAodmlldykgLT5cblx0XHRVdGlscy5kZWxheSAwLjEsID0+XG5cdFx0XHR2aWV3LnN1YkxheWVyc0J5TmFtZShCQUNLQlVUVE9OX1ZJRVdfTkFNRSlbMF0udmlzaWJsZSA9IGZhbHNlXG5cblx0YmFjazogKCkgLT5cblx0XHRsYXN0VmlldyA9IEBfZ2V0TGFzdEhpc3RvcnlJdGVtKClcblx0XHRsYXN0VHJhbnNpdGlvbiA9IGxhc3RWaWV3LmN1c3RvbS5sYXN0VHJhbnNpdGlvblxuXHRcdG9wcG9zaXRlVHJhbnNpdGlvbiA9IEBfZ2V0T3Bwb3NpdGVEaXJlY3Rpb24obGFzdFRyYW5zaXRpb24pXG5cdFx0QHRyYW5zaXRpb24obGFzdFZpZXcsIGRpcmVjdGlvbiA9IG9wcG9zaXRlVHJhbnNpdGlvbiwgc3dpdGNoSW5zdGFudCA9IGZhbHNlLCBwcmV2ZW50SGlzdG9yeSA9IHRydWUpXG5cdFx0QGhpc3RvcnkucG9wKClcblxuXHRfZ2V0TGFzdEhpc3RvcnlJdGVtOiAoKSAtPlxuXHRcdHJldHVybiBAaGlzdG9yeVtAaGlzdG9yeS5sZW5ndGggLSAxXVxuXG5cdF9hcHBseUJhY2tCdXR0b246ICh2aWV3LCBmcmFtZSA9IEBiYWNrQnV0dG9uRnJhbWUpIC0+XG5cdFx0VXRpbHMuZGVsYXkgMCwgPT5cblx0XHRcdGlmIHZpZXcuYmFja0J1dHRvbiBpc250IGZhbHNlXG5cdFx0XHRcdGJhY2tCdXR0b24gPSBuZXcgTGF5ZXJcblx0XHRcdFx0XHRuYW1lOiBCQUNLQlVUVE9OX1ZJRVdfTkFNRVxuXHRcdFx0XHRcdHdpZHRoOiA4MFxuXHRcdFx0XHRcdGhlaWdodDogODBcblx0XHRcdFx0XHRzdXBlckxheWVyOiB2aWV3XG5cblx0XHRcdFx0aWYgQGRlYnVnTW9kZSBpcyBmYWxzZVxuXHRcdFx0XHRcdGJhY2tCdXR0b24uYmFja2dyb3VuZENvbG9yID0gXCJ0cmFuc3BhcmVudFwiXG5cblx0XHRcdFx0YmFja0J1dHRvbi5mcmFtZSA9IGZyYW1lXG5cblx0XHRcdFx0YmFja0J1dHRvbi5vbiBFdmVudHMuQ2xpY2ssID0+XG5cdFx0XHRcdFx0QGJhY2soKVxuXG5cdF9nZXRPcHBvc2l0ZURpcmVjdGlvbjogKGluaXRpYWxEaXJlY3Rpb24pIC0+XG5cdFx0aWYgaW5pdGlhbERpcmVjdGlvbiBpcyBESVIuVVBcblx0XHRcdHJldHVybiBESVIuRE9XTlxuXHRcdGVsc2UgaWYgaW5pdGlhbERpcmVjdGlvbiBpcyBESVIuRE9XTlxuXHRcdFx0cmV0dXJuIERJUi5VUFxuXHRcdGVsc2UgaWYgaW5pdGlhbERpcmVjdGlvbiBpcyBESVIuUklHSFRcblx0XHRcdHJldHVybiBESVIuTEVGVFxuXHRcdGVsc2UgaWYgaW5pdGlhbERpcmVjdGlvbiBpcyBESVIuTEVGVFxuXHRcdFx0cmV0dXJuIERJUi5SSUdIVFxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBESVIuTEVGVFxuXG4jIyNcblxuVVNBR0UgRVhBTVBMRSAxIC0gRGVmaW5lIEluaXRpYWxWaWV3TmFtZVxuXG5pbml0aWFsVmlld0tleSA9IFwidmlldzFcIlxuXG52bmMgPSBuZXcgVmlld05hdmlnYXRpb25Db250cm9sbGVyXG5cdGluaXRpYWxWaWV3TmFtZTogaW5pdGlhbFZpZXdLZXlcblxudmlldzEgPSBuZXcgTGF5ZXJcblx0bmFtZTogaW5pdGlhbFZpZXdLZXlcblx0d2lkdGg6ICBTY3JlZW4ud2lkdGhcblx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdGJhY2tncm91bmRDb2xvcjogXCJyZWRcIlxuXHRwYXJlbnQ6IHZuY1xuXG4jIyNcbiMjI1xuXG5VU0FHRSBFWEFNUExFIDIgLSBVc2UgZGVmYXVsdCBpbml0aWFsVmlld05hbWUgXCJpbml0aWFsVmlld1wiXG5cbnZuYyA9IG5ldyBWaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXJcblxudmlldzEgPSBuZXcgTGF5ZXJcblx0bmFtZTogXCJpbml0aWFsVmlld1wiXG5cdHdpZHRoOiAgU2NyZWVuLndpZHRoXG5cdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwicmVkXCJcblx0cGFyZW50OiB2bmNcblxudmlldzIgPSBuZXcgTGF5ZXJcblx0d2lkdGg6ICBTY3JlZW4ud2lkdGhcblx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdGJhY2tncm91bmRDb2xvcjogXCJncmVlblwiXG5cdHBhcmVudDogdm5jXG5cbnZpZXcxLm9uQ2xpY2sgLT5cblx0dm5jLnRyYW5zaXRpb24gdmlldzJcblxudmlldzIub25DbGljayAtPlxuXHR2bmMuYmFjaygpXG5cbiMjIyIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQ0FBO0FEQUEsSUFBQTs7O0FBQU0sT0FBTyxDQUFDO0FBR2IsTUFBQTs7OztFQUFBLGlCQUFBLEdBQW9COztFQUVwQixvQkFBQSxHQUF1Qjs7RUFFdkIsaUJBQUEsR0FDQztJQUFBLElBQUEsRUFBTSxHQUFOO0lBQ0EsS0FBQSxFQUFPLGFBRFA7OztFQUdELGlCQUFBLEdBQ0M7SUFBQSxDQUFBLEVBQUcsQ0FBSDtJQUNBLENBQUEsRUFBRyxFQURIO0lBRUEsS0FBQSxFQUFPLEVBRlA7SUFHQSxNQUFBLEVBQVEsRUFIUjs7O0VBS0QsSUFBQSxHQUNDO0lBQUEsRUFBQSxFQUFRLFFBQVI7SUFDQSxJQUFBLEVBQVEsVUFEUjtJQUVBLElBQUEsRUFBUSxVQUZSO0lBR0EsS0FBQSxFQUFRLFdBSFI7SUFJQSxNQUFBLEVBQVEsWUFKUjs7O0VBTUQsR0FBQSxHQUNDO0lBQUEsRUFBQSxFQUFPLElBQVA7SUFDQSxJQUFBLEVBQU8sTUFEUDtJQUVBLElBQUEsRUFBTyxNQUZQO0lBR0EsS0FBQSxFQUFPLE9BSFA7OztFQUtELFVBQUEsR0FBYTs7RUFHQSxrQ0FBQyxPQUFEO0FBRVosUUFBQTtJQUZhLElBQUMsQ0FBQSw0QkFBRCxVQUFTO0lBRXRCLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBQyxDQUFBLGVBQUQsR0FBbUI7O1VBQzdFLENBQUMsUUFBbUIsTUFBTSxDQUFDOzs7V0FDM0IsQ0FBQyxTQUFtQixNQUFNLENBQUM7OztXQUMzQixDQUFDLE9BQW1COzs7V0FDcEIsQ0FBQyxrQkFBbUI7O0lBRTVCLDBEQUFNLElBQUMsQ0FBQSxPQUFQO0lBRUEsSUFBQyxDQUFBLEtB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
