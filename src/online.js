// Phòng thi nhiều thiết bị bằng Firebase Realtime Database (tùy chọn).
// Xem FIREBASE_SETUP.md để cấu hình; không cần Firebase khi chơi offline.
import {firebaseConfig} from './firebase-config.js';
export const isOnlineConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.databaseURL && firebaseConfig.projectId);
let sdk = null;
let context = null;

async function init() {
  if (!isOnlineConfigured) throw new Error('Bạn chưa cấu hình Firebase trong src/firebase-config.js.');
  if (context) return context;
  try {
    const [app, auth, db] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js')
    ]);
    sdk = {...db};
    const instance = app.initializeApp(firebaseConfig);
    const authentication = auth.getAuth(instance);
    if (!authentication.currentUser) await auth.signInAnonymously(authentication);
    context = {db: db.getDatabase(instance),uid: authentication.currentUser.uid};
    return context;
  } catch (error) {
    throw new Error('Không kết nối được Firebase. Kiểm tra cấu hình, Anonymous Authentication, Realtime Database và kết nối mạng. (' + error.message + ')');
  }
}
export async function identity(){return init();}
export async function createRoom(name) {
  const {db,uid} = await init();
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i=0;i<6;i++) code += alphabet[Math.floor(Math.random()*alphabet.length)];
  const room = {hostUid:uid,createdAt:Date.now(),status:'lobby',questionIdx:0,question:null,buzz:null,players:{[uid]:{uid,name:name.slice(0,32),score:0,joinedAt:Date.now()}}};
  const at = sdk.ref(db,`rooms/${code}`);
  if ((await sdk.get(at)).exists()) return createRoom(name);
  await sdk.set(at,room);
  return code;
}
export async function joinRoom(code,name) {
  const {db,uid} = await init();
  code = String(code).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);
  const at = sdk.ref(db,`rooms/${code}`);
  const snap = await sdk.get(at);
  if (!snap.exists()) throw new Error('Không tìm thấy phòng này. Hãy kiểm tra lại mã 6 ký tự.');
  if (!snap.child(`players/${uid}`).exists()) {
    await sdk.set(sdk.ref(db,`rooms/${code}/players/${uid}`),{uid,name:name.slice(0,32),score:0,joinedAt:Date.now()});
  }
  return code;
}
export async function subscribe(code, callback, onError) {
  const {db} = await init();
  return sdk.onValue(sdk.ref(db,`rooms/${code}`),s => callback(s.val()),e => onError?.(e));
}
export async function nextQuestion(code, question) {
  const {db} = await init();
  const at = sdk.ref(db,`rooms/${code}`);
  const snap = await sdk.get(at);
  if (!snap.exists()) throw new Error('Phòng không còn tồn tại.');
  const data = snap.val();
  await sdk.update(at,{status:'question',questionIdx:Number(data.questionIdx||0)+1,question:{id:question.id,q:question.q,options:question.options||null,type:question.type,topic:question.topic},buzz:null,questionStartedAt:Date.now()});
}
export async function pressBuzzer(code,name) {
  const {db,uid} = await init();
  const at = sdk.ref(db,`rooms/${code}/buzz`);
  const result = await sdk.runTransaction(at,v => v===null?{uid,name:name.slice(0,32),at:Date.now()}:undefined, {applyLocally:false});
  return result.committed;
}
export async function decide(code, winnerUid, correct) {
  const {db} = await init();
  const at = sdk.ref(db,`rooms/${code}`);
  const snap = await sdk.get(at);
  if (!snap.exists()) return;
  const data = snap.val();
  const updates = {status:'reveal',wasCorrect:Boolean(correct)};
  if (winnerUid && data.players?.[winnerUid]) updates[`players/${winnerUid}/score`] = Math.max(0,Number(data.players[winnerUid].score||0)+(correct?10:0));
  await sdk.update(at,updates);
}
export async function showAnswer(code) {
  const {db} = await init();
  await sdk.update(sdk.ref(db,`rooms/${code}`),{status:'reveal',wasCorrect:null});
}
