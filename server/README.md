install:
```
npm install --global --production windows-build-tools
npm install robotjs
npm install http
```

configure ip, port in main.js and run server:
```
node main.js
```

example of avialable commands:
```
http://10.2.3.40:8080/?command=robot.mouseClick()
http://10.2.3.40:8080/?command=robot.moveMouse(100, 200)
```