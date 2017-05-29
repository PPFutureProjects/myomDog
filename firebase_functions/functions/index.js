let functions = require('firebase-functions');
let admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.reactToInvite = functions.database.ref('/userData/{user_id}/invitation/{identify}').onWrite(event => {
    let eventData = event.data.val();
    let dog_id = eventData.dog_id;
    let receiver = event.params.user_id;
    let sender = eventData.sender;
    console.log('dog_id: '+dog_id+' receiver: '+receiver+' sender: '+sender);

    getToken(receiver).then((token, name) => {
        let message = name + ' invited you';
        if(token!==null) console.log(token);
        let payload = {
            notification: {
                title: 'invite push notification',
                body: message,
                sound: 'default',
                badge: '1'
            },
            data: {
                sender: sender,
                message: dog_id
            }
        };
        
        return admin.messaging().sendToDevice(token, payload).then((response) =>{
            console.log("pushed notification");
        }).catch((err)=> {
            console.log(err);
        })
    });
});

exports.feedPush = function(){
    while(true){
        let current = new Date();//현재시간
        let currentyear = current.getFullYear();
        let currentmonth = current.getMonth();
        let currentday = current.getDate();
        let currenthour = current.getHours();
        let currentminute = current.getMinutes();
        let currentsec = current.getSeconds();

        functions.database().ref('dogData/{dog_id}/lastmeal').onWrite(event => {
            let dog_id = event.params.dog_id;
            let dogname = event.data.val().name;
            let mealtime = event.data.val().lastmeal;
            if(/*시간연산*/current-lastmeal) {   //현재시간과 마지막 식사시간을 비교
                let owners = event.data.val().owners;
                let superowner = event.data.val().super;
                
                let msg = name+" is hungry...";
                /*
                해당 개 주인들의 푸시토큰을 찾아서, 푸시알림 발송
                 */
                return loadOwners(dog_id).then((tokens)=>{
                    let payload = {
                        notification: {
                            title: 'Hungry...',
                            body: msg,
                            sound: 'default',
                            badge: '1'
                        }
                    };
                    return admin.messaging().sendToDevice(tokens, payload);
                });
            }
        });
    }
}

function getToken(user){
    let dbRef = admin.database().ref('userData/'+user);
    let defer = new Promise((resolve, reject) => {
        dbRef.once('value', (snap) => {
            let data = snap.val();
            resolve(data.pushToken, data.name);
        }, (err) => {
            reject(err);
        });
    });
    return defer;
}

function loadOwners(dog){
    let dbRef = admin.database().ref('/dogData/'+dog);
	let defer = new Promise((resolve, reject) => {
		dbRef.once('value', (snap) => {
			let data = snap.val();
            let owners = [];
            
            //make owners`s pushToken Array
            owners.push(data.super);
            for(owner in data.owners){
                owners.push(owner.pushToken);
            }
			resolve(owners);    //owners`s token
		}, (err) => {
			reject(err);
		});
	});
	return defer;
}

