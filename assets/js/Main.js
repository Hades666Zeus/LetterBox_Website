// Main
var Main = (function () {
	function Main() {
		this.body = $('body')
		this.header = $('header')
		this.content = $('.content')
		this.bts = $('.behind-the-scenes')
		this.currentPlatform = this.getCurrentPlatform()

		this.viewport = new Viewport()
		this.viewport.setFullHeightClass('.full-height')

		this.videoLinks = new VideoLink()

		this.setReadyState()
		this.setHeader()
		this.setLevels()
		this.setDevices()
		this.setCurrentDevice()
		this.setBehindTheScenes()
		this.setBadges()

		$(window).resize($.proxy(this.onResize, this))
	}

	Main.prototype = {
		setReadyState: function () {
			this.body.removeClass('loading').addClass('ready ' + this.currentPlatform)

			$('.panel').waypoint(function (direction) {
				$(this.element).addClass('animate')
			}, {
				offset: '70%'
			})

			$('.devices').waypoint(function (direction) {
				$(this.element).find('.devices-wrapper').addClass('animate')
			}, {
				offset: '70%'
			})
		},

		setDevices: function (path) {
			var self = this
			var container = $('.devices-wrapper')
			var template = $('#tpl-device')
			var item = ''
			$.each(devices, function (index, data) {
				if (IsMobile.None() || data.platform === self.currentPlatform) {
					item = TemplateParser.parse(template.html(), {
						device: data.device,
						platform: data.platform,
						image: data.image,
						alt: data.alt,
						type: data.type
					})
					container.append(item)
				}
			})
		},

		setHeader: function () {
			// [1, .6, .3, .15, .1, .05])
			var header = new Parallax('.lvl', [.8, .6, .5, .4, .3, .2])
		},

		setCurrentDevice: function () {
			if (IsMobile.Any()) {
				var device = IsMobile.Android() ? 'ios' : 'android'
				$('.devices').find('[data-device=' + device + ']').hide();
			}
		},

		setLevels: function () {
			var content
			var container = $('#video-container')

			if (IsMobile.Any()) {
				content = TemplateParser.parse($('#tpl-video-mobile').html())
			} else if (IsMobile.None()) {
				content = TemplateParser.parse($('#tpl-video').html(), {
					source: videoSources.low
				})
			}
			container.append(content)
		},

		setBadges: function () {
			if (IsMobile.None()) {
				var badgesTop = new Badges('#badges-top')
				var badgesBottom = new Badges('#badges-bottom')
			} else {
				$('.button').attr('href', 'https://applinks.woogatrack.com/fui/open?network=community&campaign=email&adgroup=release')
			}
		},

		setBehindTheScenes: function () {
			var self = this
			this.onResize()

			$('.behind-the-scenes-trigger').waypoint(function (direction) {
				self.bts.addClass('visible')
			}, {
				offset: '100%'
			})

			$('.behind-the-scenes-reset').waypoint(function (direction) {
				self.bts.removeClass('visible')
			})
		},

		getCurrentPlatform: function () {
			if (IsMobile.iOS()) {
				return 'ios'
			} else if (IsMobile.Android()) {
				return 'android'
			} else if (IsMobile.None()) {
				return 'desktop'
			} else {
				return ''
			}
		},

		onResize: function () {
			var height = $('.behind-the-scenes').outerHeight()
			$('.behind-the-scenes-trigger').height(height)
		}

	}

	return Main

})()

// -----------------------------

$(document).ready(function () {
	new Main()
})
