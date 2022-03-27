// create a variable to hold db connection
let db;
//establishing a conne connection to IndexDb database and set the version of db to 1
const request = indexedDB.open("budet-tracker", 1);
// add an event to emit if the db version change
request.onupgradeneeded = function (event) {
  //save a refence to the database
  const db = event.target.result;
  // an object to store (table) called new_budget, with out increment PK
  db.createObjectStore("new_budget", { autoIncrement: true });
};
// upon a success request
request.onsuccess = function (event) {
  // if the db successfully created with its object store from onupgradeneeded, save the refernce to db global variable
  db = event.target.result;
  // check if app is online
  // if the app is online run sendTransaction()
  if (navigator.online){ 
    uploadBudget()
  }
};
// if there is an error
request.onerror = function (event) {
  console.log(event.target.errorCode);
};
// save records
//a function will be executed if we attempt to submit a new budget and there's no internet connection
function saveRecord(record) {
  // open a new transaction with the database with read and write permissions
  const transaction = db.transaction(["new_budget"], "readwrite");
  // access the object store for `new_budget`
  const newObjectStore = transaction.objectStore("new_budget");
  // add record to your store with add method
  newObjectStore.add(record);
}
function uploadBudget() {
  // open a transaction in the db
  const transaction = db.transaction(["new_budget"], "readwrite");
  // access the stored object
  const newObjectStore = transaction.objectStore('new_budget')
  const getAll = newObjectStore.getAll();
  // upon sucess
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((serverRes) => {
          if (serverRes.message) {
            throw new Error(serverRes);
          }
          // open one more transaction
          const transaction = db.transaction(["new_budget"], "readwrite");
          // access the new_budget object store
          const pizzaObjectStore = transaction.objectStore("new_budget");
          // clear all items in your store
          pizzaObjectStore.clear();
          alert("All saved transaction has been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

// listen to the internet connection 
window.addEventListener('online', uploadBudget)