const Video = {
	init: () => {
		Video.videoControl();
		Video.videoPlay();
	},
	// Vídeos
	videoControl: () => {
		const videosThumbs = $('.cervejeiras-videos-thumbs__item');

		videosThumbs.click(function() {
			const self = $(this);

			if (self.hasClass('is--active')) {
				return;
			}

			videosThumbs.removeClass('is--active');
			self.addClass('is--active');
		});
	},

	videoPlay: () => {
		const playVideo = $('.cervejeiras-videos-thumbs__item, .cervejeiras-videos__video');

		playVideo.click(function() {
			const videoToPlay = $('.cervejeiras-videos-thumbs__item.is--active').data('vid');
			const videoContainer = $('.cervejeiras-videos__video');

			videoContainer.addClass('video-is-playing');
			Video.updateVideoUrl(videoToPlay);
		});
	},

	updateVideoUrl: videoId => {
		const videoURL = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
		const videoContainer = $('.cervejeiras-videos__video');
		const videoFrame = videoContainer.find('iframe');

		videoContainer.addClass('is--loading');
		videoFrame.attr('src', videoURL);

		setTimeout(() => {
			videoContainer.removeClass('is--loading');
		}, 700);
	}
};

export default Video;
