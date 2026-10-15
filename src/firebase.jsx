import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDKQjLkwtmT8FQ-3O_KhERJy0g2lLx_OaE",
  databaseURL: "https://smart-home-3cf04-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-home-3cf04",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export { ref, onValue, update, set };