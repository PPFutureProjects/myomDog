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