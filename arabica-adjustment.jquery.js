(function( factory ) {
	if (typeof(require) === 'function') {
		module.exports = factory(jQuery);
	} else {
		factory(jQuery);
	}
})(function( $ ) {
	var _this, _adjustment, _label, _scale, _btn, _min, _max, _step, _btnMovement;
	function Position(event) {
		var _event = event;
		return {
			getX: function() {
				if (typeof _event.touches !== 'undefined' && typeof _event.touches[0] !== 'undefined') {
					return _event.touches[0].clientX;
				}
				return _event.clientX;
			},
			getY:function() {
				if (typeof _event.touches !== 'undefined' && typeof _event.touches[0] !== 'undefined') {
					return _event.touches[0].clientY;
				}
				return _event.clientY;
			}
		};
	};
	function Movement(target) {
		var _isDrag = false, _target = target, _currentLeft, _complete = 0;

		return {
			move: function(position, callback) {
				if (_isDrag && _currentLeft) {
					var delta = position.getX() - _currentLeft,
						isContinue = true;

					if ((position.getX() <= _scale.offset().left || position.getX() >= _scale.offset().left + _scale.width())
					 || (position.getY() <= _adjustment.offset().top || position.getY() >= _adjustment.offset().top + _adjustment.outerHeight())) {
						isContinue = false;
						this.end();
					}

					if (_target.offset().left + delta <= _scale.offset().left) {
						_target.css('left', 0);
						_complete = 0;
						isContinue = false;
					}

					if (_target.offset().left + _target.width() + delta >= _scale.offset().left + _scale.width()) {
						_target.css('left', _scale.width() - _target.width());
						_complete = _scale.width();
						isContinue = false;
					}

					if (!isContinue) {
						return false;
					}

					_target.css('left', parseInt(_target.css('left')) + delta);
					_currentLeft = position.getX();
					_complete = _target.offset().left - _scale.offset().left;
					if (typeof callback === 'function') {
						callback.call();
					}
				} else {
					this.end();
				}
			},
			start: function(position) {
				if (_isDrag) return;
				_isDrag = true;
				_currentLeft = position.getX();
			},
			end: function() {
				if (!_isDrag) return;
				_isDrag = false;
			},
			reset: function() {
				if (_isDrag) {
					_isDrag = false;
				}
				_complete = 0;
				_target.css('left', 0);
				_this.val(_min);
				_label.find('.arabica-adjustment-value').text(_min)
			},
			getComplete: function() {
				return _complete;
			}
		};
	};

	$.fn.adjustment = function(params) {
		_this = this;
		if (!_this.is('input[type=number][max]')) {
			return _this;
		}

		if (typeof params === 'string' && typeof _btn !== 'undefined') {
			switch (params) {
				case 'reset':
					_this.val('');
					if (typeof _btnMovement === 'object' && typeof _btnMovement.reset === 'function') {
						_btnMovement.reset();
					}
					break;
			}
			return _this;
		}

		if (typeof _this.attr('id') === 'undefined') {
			_this.attr('id', 'arabica-adjustment');
		}

		_this.hide();
		_min = (typeof _this.attr('min') !== 'undefined') ? _this.attr('min') : 0;
		_max = _this.attr('max');
		_this.val(_min);
		_step = (typeof _this.attr('step') !== 'undefined' && _this.attr('step') !== '0') ? parseFloat(_this.attr('step')) : 1;
		_adjustment = $('<div class="arabica-adjustment-wrapper"></div>')
					  .css({
					  	  'width': '100%',
					  	  'padding': '30px 0',
					  });

		_label = $('label[for=' + _this.attr('id') + ']').length ? $('label[for=' + _this.attr('id') + ']') : $('<label for="' + _this.attr('id') + '"></label>').insertBefore(_adjustment);
		if (_label.find('span.arabica-adjustment-value').length) {
			_label.find('span.arabica-adjustment-value').text(_min);
		} else {
			$('<span class="arabica-adjustment-value">' + _min + '</span>').appendTo(_label);
		}
		_label.find('.arabica-adjustment-value').css('margin-left', 8);

		_scale = $('<div class="arabica-adjustment-scale"></div>')
				 .css({
				 	'width': '100%',
				 	'height': 6,
				 	'border-radius': 2,
				 	'box-shadow': '0 0 1px 1px rgba(51,51,102,.4)',
				 }).appendTo(_adjustment);

		_btn = $('<div class="arabica-adjustment-btn"></div>')
			   .css({
			       'width': 20,
			       'height': 20,
			       'position': 'relative',
			       'margin-top': -13,
			       'box-shadow': '0 0 1px 1px rgba(51,51,102,.7)',
			       'border-radius': 10,
			       'background-color': '#FAFAFA',
			       'left': 0,
			   }).appendTo(_adjustment);
		_adjustment.insertAfter(_this);

		_btnMovement = new Movement(_btn);
		_btn.on('mousedown', function(e) {
			e.preventDefault();
			if ((e.which && e.which != 1) || (e.button && e.button != 1)) return;
			_btnMovement.start(new Position(e));
		}).on('touchstart', function(e) {
			_btnMovement.start(new Position(e));
		});
		
		$(document).on('mouseup', function(e) {
			e.preventDefault();
			_btnMovement.end();
		}).on('touchend', function(e) {
			_btnMovement.end();
		});
		
		$(document).on('mousemove', function(e) {
			e.preventDefault();

			_btnMovement.move(new Position(e), function() {
				var complete = _btnMovement.getComplete(),
					increment = (_scale.width() - _btn.width()) / (_max - _min),
					rest = complete % increment,
					value = (rest > (increment / 2)) ? ((complete - rest) / increment) + 1 : (complete - rest) / increment;
				if (_label.find('span.arabica-adjustment-value').length) {
					_label.find('span.arabica-adjustment-value').text(value);
				} else {
					$('<span class="arabica-adjustment-value">' + value + '</span>').appendTo(_label);
				}
				_this.val(value);
			});
		}).on('touchmove', function(e) {
			e.preventDefault();
			_btnMovement.move(new Position(e), function() {
				var complete = _btnMovement.getComplete(),
					increment = (_scale.width() - _btn.width()) / (_max - _min),
					rest = complete % increment,
					value = (rest > (increment / 2)) ? Math.round((complete - rest) / increment) + 1 : Math.round((complete - rest) / increment);
				if (_label.find('span.arabica-adjustment-value').length) {
					_label.find('span.arabica-adjustment-value').text(value);
				} else {
					$('<span class="arabica-adjustment-value">' + value + '</span>').appendTo(_label);
				}
				_this.val(value);
			});
		});

	};
});