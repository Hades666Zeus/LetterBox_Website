// Mobile detection
var IsMobile = {
	Android: function () {
		return !!navigator.userAgent.match(/Android/i)
	},
	BlackBerry: function () {
		return !!navigator.userAgent.match(/BlackBerry/i)
	},
	iOS: function () {
		return !!navigator.userAgent.match(/iPhone|iPad|iPod/i)
	},
	iPhone: function () {
		return !!navigator.userAgent.match(/iPhone/i)
	},
	iPad: function () {
		return !!navigator.userAgent.match(/iPad/i)
	},
	Windows: function () {
		return !!navigator.userAgent.match(/IEMobile/i)
	},
	Any: function () {
		return (this.Android() || this.BlackBerry() || this.iOS() || this.Windows())
	},
	None: function () {
		return (!this.Android() && !this.BlackBerry() && !this.iOS() && !this.Windows())
	}
}

// Parallax
var Parallax = (function () {
	function Parallax(elementName, offsetsArray) {
		this.element = elementName
		this.scrollVal = 0
		this.multipliers = offsetsArray

		// $.srSmoothscroll({
		//   step: 155,
		//   speed: 40,
		//   ease: 'linear'
		// })

		$(document).on('scroll', $.proxy(this.onScroll, this))
	}

	Parallax.prototype = {
		draw: function () {
			var offset
			$.each(this.multipliers, $.proxy(function (i, v) {
				offset = -(this.scrollVal * v)

				$(this.element + i).css({
					'-webkit-transform': 'translate3d(0, ' + offset + 'px, 0)',
					'-moz-transform': 'translate3d(0, ' + offset + 'px, 0)',
					'transform': 'translate3d(0, ' + offset + 'px, 0)'
				})
			}, this))
		},

		onScroll: function (event) {
			this.scrollVal = Math.max($(window).scrollTop(), 0)
			this.draw()
		}
	}

	return Parallax
})()

// Templates
var TemplateParser = {
	parse: function (template, data) {
		for (var key in data) {
			template = template.replace(new RegExp('{' + key + '}', 'g'), data[key])
		}
		return template
	}
}

// Viewport Handler
var Viewport = (function () {
	function Viewport() {
		this.wrapper
		this.window = $(window)
		this.window.resize($.proxy(this.onResize, this))
	}

	Viewport.prototype = {
		getViewportHeight: function () {
			return this.window.height()
		},

		getViewportWidth: function () {
			return this.window.width()
		},

		setFullHeightClass: function (className) {
			this.wrapper = $(className)
			this.onResize()
		},

		onResize: function () {
			var wrapperH = this.wrapper.height()
			var windowH = this.window.height()
			if (IsMobile.Any()) { // if (windowH > wrapperH) {
				this.wrapper.css({
					'height': (windowH) + 'px'
				})
			}
		}
	}

	return Viewport

})()


//Video Links
var VideoLink = (function () {

	function VideoLink() {
		this.videos = document.querySelectorAll('.videolink')
		this.setVideo()
	}

	VideoLink.prototype = {
		events: {
			addEventListener: function (element, type, handler, context) {
				handler = context ? handler.bind(context) : handler
				element.addEventListener(type, handler, false)
			}
		},

		handleClick: function (event) {
			event.preventDefault()
			var element = event.currentTarget

			if (!element.classList.contains('playing')) {
				var videotype = element.getAttribute('data-videotype')
				var videoid = element.getAttribute('data-videoid')
				var controls = element.getAttribute('data-controls')
				var videoEl = document.createElement('iframe')
				videoEl.setAttribute('height', 360)
				videoEl.setAttribute('width', 640)
				videoEl.setAttribute('class', 'videoframe')
				videoEl.setAttribute('frameborder', 0)
				videoEl.setAttribute('allowfullscreen', '')

				if (videotype === 'youtube') {
					videoEl.setAttribute('src', 'https://www.youtube.com/embed/' + videoid + '?rel=0&controls=' + controls + '&showinfo=0&autoplay=1')
				}
				if (videotype === 'vimeo') {
					videoEl.setAttribute('src', 'https://player.vimeo.com/video/' + videoid + '?title=0&byline=0&portrait=0&color=5b009c&autoplay=1=')
				}

				element.insertBefore(videoEl, element.firstChild)
				element.classList.add('playing')
			}
		},

		setVideo: function () {
			var self = this
			Array.prototype.forEach.call(this.videos, function (element, index) {
				self.events.addEventListener(element, 'click', self.handleClick, self)
			})
		}

	}

	return VideoLink

})()


// Badges Perspective
var Badges = (function () {

	function Badges(id) {
		this.button = $(id + ' .button')
		this.badgesWrapper = $(id + ' .badges-wrapper')
		this.img = $(id + ' img')
		this.shine = $('<span class="shine"></span>')
		this.shine.appendTo(this.button)

		setTimeout($.proxy(function () {
			var buttonWidth = this.img.width()
			var buttonHeight = this.img.height()
			this.button.css({
				'width': buttonWidth,
				'height': buttonHeight
					// 'margin-top':  -(buttonHeight / 2),
					// 'margin-left': -(buttonWidth / 2)
			})

		}, this), 100)

		$(window).on('mousemove', $.proxy(this.onMouseMove, this))
		this.button.on('click', $.proxy(this.onClick, this))
	}

	Badges.prototype = {
		onClick: function (e) {
			e.preventDefault()
			$(e.currentTarget).fadeOut(200, $.proxy(this.onFadeOut, this))
		},

		onFadeOut: function () {
			this.badgesWrapper.fadeIn()
		},

		onMouseMove: function (e) {
			var transformLayer

			var w = $(window).width()
			var h = $(window).height()

			var offsetLayer = this.img.data('offset') || 0
			var offsetX = .5 - e.pageX / w
			var offsetY = .5 - e.pageY / h
			var dy = e.pageY - h / 2
			var dx = e.pageX - w / 2
			var theta = Math.atan2(dy, dx)
			var angle = theta * 180 / Math.PI - 90
			var offsetElement = this.button.data('offset')
			var transformElement = 'translateY(' + -offsetX * offsetElement + 'px) rotateX(' + (-offsetY * offsetElement) + 'deg) rotateY(' + (offsetX * (offsetElement * 2)) + 'deg)'
			var color = '255, 255, 255'
			var alpha = .4 // e.pageY / h * .5

			// Get angle between 0-360
			angle = (angle < 0) ? angle + 360 : angle

			transformLayer = 'translateX(' + offsetX * offsetLayer + 'px) translateY(' + offsetY * offsetLayer + 'px)'

			this.shine.css({
				'background': 'linear-gradient(' + angle + 'deg, rgba(' + color + ',' + alpha + ') 0%, rgba(' + color + ', 0) 80%)'
			})

			this.img.css({
				'-webkit-transform': transformLayer,
				'-moz-transform': transformLayer,
				'transform': transformLayer
			})

			this.button.css({
				'-webkit-transform': transformElement,
				'-moz-transform': transformElement,
				'transform': transformElement
			})
		}
	}

	return Badges

})()
