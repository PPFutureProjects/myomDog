# myomDog
New repository for 4st-myomDog vol.2

pull 이후에 ```$npm install``` 로 node module 설치

AngularFire 데이터 베이스 참조 방식이 바뀜
```
AngularFire.database.list('/item') --> AngularFireDatabase.list('/item')
```

### 라이브러리 오류

myomDog/node_modules/source-map/lib/source-node.js

위 경로에서 94번 줄과 115번 줄에 있는

```var nextLine = remainingLines[0];```

다음 줄에 다음 코드를 삽입해야함

```if (!nextLine) return;```

다음과 같이 되어있어야 오류가 안나온다.
```
var nextLine = remainingLines[0];
if (!nextLine) return;
```
