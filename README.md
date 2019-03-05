# RDP

Remote desktop via HTML. This is a POC and is not to safe for production purpose.

1. start desktop capture streaming using ffmpeg
```
ffmpeg -f dshow -i video="screen-capture-recorder" -r 24 -vcodec libx264 -preset ultrafast -tune zerolatency -crf 18 -f hls -hls_time 1 -hls_flags delete_segments+split_by_time stream/stream.m3u8
```
2. make the produced .m3u8 available over http
3. start server to consume user interaction (mouse events), see /server/README.md
4. load client player (in chrome)

## Screen Capturing with FFMPEG

Dependency https://github.com/rdp/screen-capture-recorder-to-video-windows-free

CLI arguments https://stackoverflow.com/questions/16369745/stream-desktop-over-rtp-using-vlc-with-the-lowest-latency-possible

### h264 to rtp

stream:
```
ffmpeg -f dshow -i video="screen-capture-recorder" -s 400x300 -r 24 -vcodec libx264 -preset ultrafast -tune zerolatency -crf 18 -f mpegts udp://127.0.0.1:1234
```

play:
```
ffplay udp://127.0.0.1:1234
ffplay -probesize 32 -sync ext udp://127.0.0.1:1234
```

### h264 to HLS

stream:
```
ffmpeg -f dshow -i video="screen-capture-recorder" -s 400x300 -r 24 -vcodec libx264 -preset ultrafast -tune zerolatency -crf 18 -f hls -hls_time 1 -hls_flags delete_segments+split_by_time mystream.m3u8
```

play:
```
ffplay https://localhost/mystream.m3u8
```

or online https://players.akamai.com/hls/

### mpeg2video to rtp

stream:
```
ffmpeg -f dshow -i video="screen-capture-recorder" -s 400x300 -r 24 -vcodec mpeg2video -b:v 8000 -f rtp rtp://127.0.0.1:1234
```

play:
```
ffplay udp://127.0.0.1:1234
ffplay -probesize 32 -sync ext udp://127.0.0.1:1234
```

## Screen Capturing with VLC

### HLS

stream:
```
vlc.exe" -vvv screen:// :screen-fps=24.000000 :screen-width=1920 :screen-height=1080 :live-caching=100  :sout=#transcode{vcodec=h264,vb=300,venc=x264{aud,profile=baseline,level=30,keyint=24,ref=1},acodec=none}:std{access=livehttp{seglen=1,delsegs=true,numsegs=1,index=mystream.m3u8,index-url=https://localhost/mystream-########.ts},mux=ts{use-key-frames},dst=mystream-########.ts} :sout-all :sout-keep
```

play:
```
vlc -vvv https://localhost/mystream.m3u8
```

### to HTTP

https://stackoverflow.com/questions/48588485/how-to-embed-streaming-rtsp-media-into-an-html5-page

