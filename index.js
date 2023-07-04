const {ProductManager} = require("./ProductManager")
const filePath = "./productos.json"
const manager = new ProductManager(filePath)

const functions = async() => {

    try {
        await manager.addProduct("Fernet","Fernet 750ml",14500,"https://dummyimage.com/200x200/000/fff","FRT750",20)
        await manager.addProduct("Campari","Campari 750ml",12500,"https://dummyimage.com/200x200/000/fff","CPR750",18)
        // const getProducts = await manager.getProducts()
        // console.log(getProducts)
    } catch (error) {
        console.log(error.message)
    }

}

functions()