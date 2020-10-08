'use strict';

Nitro.module('video-bem-pensado', function () {
    self.init = () => {
        self.ytAPIPdpInstitucional();
    }

    self.ytAPIPdpInstitucional = () => {
        var tag = document.createElement('script');
        var firstScriptTag = document.getElementsByTagName('script')[0];

        // O container do video
        var playerDiv = document.querySelectorAll('.player');

        var player;

        var playerArr = [];

        var videoDuration = 0;

        // inicializando o contador do tempo do video
        var videotime = 0;

        // inicializando intervalo
        var intervalVideo = null;

        // Adicionando Youtube iframe API
        tag.src = 'https://www.youtube.com/iframe_api';
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // Método chamado automaticamente pela api do youtube
        function onYouTubeIframeAPIReady() {
            window.YT.ready(function () {
                playerDiv.forEach(function (p, i) {
                    player = new YT.Player(p, {
                        height: 650,
                        width: "100%",
                        videoId: p.dataset.videoId,
                        events: {
                            onReady: onPlayerReady
                        },
                        playerVars: {
                            rel: 0,
                            showinfo: 0
                        }
                    });

                    playerArr.push(player);
                })
            })

        }

        onYouTubeIframeAPIReady();

        // Método chamado nos eventos do player
        function onPlayerReady(event) {

            // obtendo a duração do video, em segundos
            videoDuration = playerArr.map(function (p) {
                return parseInt(p.getDuration());
            })
            // aplicando o intervalo de 1 em 1 segundo
            intervalVideo = setInterval(discoverTime, 1000);

        }

        // método utilizado para descobrir o tempo atual do vídeo
        function discoverTime() {
            playerArr.map(function (p, i) {
                if (p) {
                    videoDuration = parseInt(p.getDuration());
                    videotime = parseInt(p.getCurrentTime());
                    if (videotime == parseInt(videoDuration * 0.25)) {
                        dataLayer.push({
                            event: "generic",
                            category: "pdp-institucional",
                            action: "beneficios",
                            label: "video_do_produto_25%"
                        });
                    } else if (videotime == parseInt(videoDuration * 0.5)) {
                        dataLayer.push({
                            event: "generic",
                            category: "pdp-institucional",
                            action: "beneficios",
                            label: "video_do_produto_50%"
                        });
                    } else if (videotime == parseInt(videoDuration * 0.75)) {
                        dataLayer.push({
                            event: "generic",
                            category: "pdp-institucional",
                            action: "beneficios",
                            label: "video_do_produto_75%"
                        });
                    } else if (videotime == videoDuration) {
                        dataLayer.push({
                            event: "generic",
                            category: "pdp-institucional",
                            action: "beneficios",
                            label: "video_do_produto_100%"
                        });
                    }
                }
                if (videotime == videoDuration) {
                    clearInterval(intervalVideo);
                    // let videoContainer = document.getElementById("video-container");
                    // let mainVideo = document.getElementById("player");
                    // mainVideo.style.display = "none";
                    // videoContainer.style.display = "block";
                }
            })

        }
    }

    self.init();
})
