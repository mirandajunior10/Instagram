import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDvZ9vcfPNeiCgtExxQl4uKKzoRYbvC70U",
    authDomain: "instagram-d89e3.firebaseapp.com",
    databaseURL: "https://instagram-d89e3.firebaseio.com",
    projectId: "instagram-d89e3",
    storageBucket: "instagram-d89e3.appspot.com",
    messagingSenderId: "390298799165",
    appId: "1:390298799165:web:dfcdd277fe8d7751"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export const f = firebase;
  export const database = firebase.database();
  export const auth = firebase.auth();
  export const storage = firebase.storage();