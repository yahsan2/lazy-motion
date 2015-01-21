var LazyMotion;

LazyMotion = (function() {
  function LazyMotion(options) {
    this.options = {
      'attr': 'data-lazy',
      'el': 'html',
      'scollEvent': false,
      'position': 'bottom',
      'offset': '100%',
      'motion': this.addClass,
      'reverse': this.removeClass,
      'cls': 'is-active',
      'beforeFn': function() {},
      'afterFn': function() {}
    };
    $.extend(this.options, options);
    this.$el = $(this.options.el).find('[' + this.options.attr + ']');
    this.attr = this.options.attr;
    this.cls = this.options.cls;
    this.windowHeight = $(window).height();
    this.moving = false;
    this.init();
  }

  LazyMotion.prototype.init = function() {
    var fn, key, _ref;
    if (this.options.custom) {
      _ref = this.options.custom;
      for (key in _ref) {
        fn = _ref[key];
        if (!this[key]) {
          this[key] = fn;
        }
      }
    }
    this.setElems();
    this.check($(window).scrollTop());
    if (this.options.scollEvent) {
      $(window).on('scroll', (function(_this) {
        return function() {
          var scrollTop;
          scrollTop = $(window).scrollTop();
          return _this.check(scrollTop);
        };
      })(this));
    }
    return $(window).on('resize', (function(_this) {
      return function() {
        _this.windowHeight = $(window).height();
        return _this.setBasePosition();
      };
    })(this));
  };

  LazyMotion.prototype.setElems = function() {
    this.elems = [];
    return this.$el.each((function(_this) {
      return function(i, el) {
        var $el, attr, motionFn, motionParam, offset, position, reverseFn, reverseParam;
        $el = $(el);
        attr = $el.attr(_this.attr);
        motionFn = _this.options.motion;
        motionParam = _this.options.cls;
        reverseFn = null;
        reverseParam = _this.options.cls;
        position = _this.options.position;
        offset = $el.outerHeight(true) * parseInt(_this.options.offset) / 100;
        if (attr.indexOf('|') !== -1) {
          attr = attr.split('|')[0];
          reverseFn = attr.split('|')[1] ? attr.split('|')[1] : _this.options.reverse;
        }
        if (attr) {
          $.each(attr.split(','), function(i, opt) {
            var motionStr;
            if (opt.indexOf('top:') !== -1 || opt.indexOf('center:') !== -1 || opt.indexOf('bottom:') !== -1) {
              position = opt.split(':')[0];
              return offset = opt.split(':')[1].indexOf('px') !== -1 ? parseInt(opt.split(':')[1]) : $el.outerHeight(true) * parseInt(opt.split(':')[1]) / 100;
            } else {
              motionStr = opt;
              if (motionStr.indexOf(':') !== -1) {
                if (_this[motionStr.split(':')[0]]) {
                  motionFn = _this[motionStr.split(':')[0]];
                }
                return motionParam = motionStr.split(':')[1];
              } else {
                if (_this[motionStr]) {
                  return motionFn = _this[motionStr];
                } else {
                  return motionParam = motionStr;
                }
              }
            }
          });
        }
        _this.elems.push({
          '$el': $el,
          'offset': offset,
          'position': position,
          'positionTop': $el.position().top,
          'motion': {
            'func': motionFn,
            'param': motionParam
          },
          'reverse': {
            'func': reverseFn,
            'param': reverseParam
          },
          'moved': false
        });
        return _this.setBasePosition();
      };
    })(this));
  };

  LazyMotion.prototype.setBasePosition = function() {
    return $.each(this.elems, (function(_this) {
      return function(i, elem) {
        return elem.basePosition = (function() {
          switch (elem.position) {
            case 'top':
              return 0 - elem.offset;
            case 'center':
              return this.windowHeight * 0.5 - elem.offset;
            case 'bottom':
              return this.windowHeight * 1 - elem.offset;
          }
        }).call(_this);
      };
    })(this));
  };

  LazyMotion.prototype.doMotion = function($el, motion) {
    if (typeof motion === 'function') {
      return motion($el);
    } else if (motion.func) {
      return motion.func($el, motion.param);
    }
  };

  LazyMotion.prototype.check = function(scrollTop) {
    return $.each(this.elems, (function(_this) {
      return function(i, elem) {
        if (scrollTop + elem.basePosition > elem.positionTop) {
          if (!elem.moved) {
            elem.moved = true;
            return _this.doMotion(elem.$el, elem.motion);
          }
        } else if (elem.reverse.func) {
          if (elem.moved) {
            elem.moved = false;
            return _this.doMotion(elem.$el, elem.reverse);
          }
        }
      };
    })(this));
  };

  LazyMotion.prototype.addClass = function($el, param) {
    return $el.addClass(param);
  };

  LazyMotion.prototype.removeClass = function($el, param) {
    return $el.removeClass(param);
  };

  return LazyMotion;

})();
