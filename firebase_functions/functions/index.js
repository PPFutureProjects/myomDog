let functions = require('firebase-functions');
let admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.reactToInvite = functions.database.ref('/userData/{user_id}/invitation').onWrite(event => {
    let eventData = event.data.val();
    let dog_id = eventData.dog_id;
    let receiver = event.params.user_id;
    let sender = eventData.sender;
    console.log('dog_id: '+dog_id+'receiver: '+receiver+'sender: '+sender);

    let message = sender+' invited you';

    getToken(receiver).then(token => {
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
    let snap =  dbRef.once('value');
    let token = snap.val().pushToken;
    return token;
}