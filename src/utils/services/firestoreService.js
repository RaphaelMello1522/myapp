import { db } from "../firestore";

function GetAllMenuItems() {
    return new Promise((resolve, reject) => {
        db.collection("MenuItens").get().then((allMenuItens) => {
            resolve(allMenuItens);
        }).catch((e) => {
            reject(e);
        })
    })
}

function AddNewMenuItem(itemName, itemCategory, itemPrice) {
    return new Promise((resolve, reject) => {
    const data = {
    "NomeItem": itemName,
    "CategoriaItem": itemCategory,
    "PrecoItem": itemPrice
    }
    db.collection("MenuItens").add(data).then((docRef) => {
       resolve(docRef);
    }).catch((e) => {
       reject(e);
    })
    })}

    function UpdateMenuItem(menuItemId, itemName, itemCategory, itemPrice){
        return new Promise((resolve, reject) => {
            const data = {
                "NomeItem": itemName,
                "CategoriaItem": itemCategory,
                "PrecoItem": itemPrice
            }
            db.collection("MenuItens").doc(menuItemId).update(data).then(() => {
                resolve()
            }).catch((e) => {
                reject(e)
            })
        })
    }

    function DeleteMenuItem(menuItemId){
        return new Promise((resolve, reject) => {
            db.collection("MenuItens").doc(menuItemId).delete().then(() => {
                resolve()
            }).catch((e) => {
                reject(e)
            })
         })
    }
    export default { GetAllMenuItems, AddNewMenuItem, UpdateMenuItem, DeleteMenuItem }
