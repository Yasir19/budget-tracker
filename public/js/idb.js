// create a variable to hold db connection 
let db;
//establishing a conne connection to IndexDb database and set the version of db to 1
const request = indexedDB.open('budet-tracker', 1);
// add an event to emit if the db version change 
request.onupgradeneeded = function(event) {
    //save a refence to the database 
    const db = event.target.result;
    // an object to store (table) called new_budget, with out increment PK
    db.createObjectStore('new_budget', {autoIncrement: true});
}
    // upon a success request 
    request.onsuccess = function(event) {
        // if the db successfully created with its object store from onupgradeneeded, save the refernce to db global variable 
        db = event.target.result;
        // check if app is online 
        // if the app is online run sendTransaction()
        if(navigatore.online) {
            //sendTransaction()

        }
    }; 
    // if there is an error 
    request.onerror = function(event) {
        console.log(event.target.errorCode);
    }
// save records 
//a function will be executed if we attempt to submit a new budget and there's no internet connection
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_budget'], 'readwrite');
     // access the object store for `new_budget`
     const newObjectStore = transaction.objectStore('new_budget');
    // add record to your store with add method
    newObjectStore.add(record);
}

