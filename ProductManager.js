const fs = require("fs")

class ProductManager {
    constructor(route){
        this.path = route
    }

    fileExists(){
       return fs.existsSync(this.path)
    }

    async readProducts(){
        try {
            if(this.fileExists){
                const products = await fs.promises.readFile(this.path,"utf-8")
                const productsJson = JSON.parse(products)
                return productsJson
            }else{
                return "El archivo no existe"
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    async getProducts(){
        try {
            if(this.fileExists){
                return this.readProducts()
            }else{
                return "El archivo no existe"
            }
        } catch (error) {
            console.log(error.message)
        }
        
    }

    async addProduct(title, description, price, thumbnail, code, stock){
        const addProduct = this.readProducts()
        let newId = addProduct.length 
                    ? addProduct[addProduct.length-1].id+1
                    : 1
        const newProduct = {
            id:newId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        try {
            if(this.fileExists()){
                const getCode = addProduct.some((codes)=>{return codes.code === newProduct.code})
                if(getCode == true){
                    return "Este producto ya existe"
                }else{
                    addProduct.push(newProduct)
                    await fs.promises.writeFile(this.path,JSON.stringify(addProduct,null,'\t'))
                    return "Producto Agregado"
                }                
            }else{
                console.log("El archivo no existe")
                await fs.promises.writeFile(this.path,JSON.stringify([newProduct],null,'\t'))
                console.log("Producto Agregado")
            }
        } catch (error) {
            return error.message
        }
    }

    async getProductById(idProducto){
        try {
            const products = await fs.promises.readFile(this.path,"utf-8")
            const productsJson = JSON.parse(products)
            const getId = productsJson.find((idProductos)=>{return idProductos.id === idProducto})
            getId == undefined
                    ? console.log("El producto no fue encontrado")
                    : console.log("Producto: ", getId)
        } catch (error) {
            console.log(error.message)
        }
        
    }

    async updateProduct(idProducto, title, description, price, thumbnail, code, stock){
        const updateProduct = {
            id:idProducto,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        try {
            const products = await fs.promises.readFile(this.path,"utf-8")
            const productsJson = JSON.parse(products)
            const getId = productsJson.find((idProductos)=>{return idProductos.id === idProducto})
            getId == undefined
                    ? console.log("El producto no fue encontrado")
                    : productsJson.push(updateProduct) && await fs.promises.writeFile(this.path,JSON.stringify(productsJson,null,'\t'))
        } catch (error) {
            console.log(error.message)
        }
    }


    async deleteProduct(idProducto){
        try {
            const products = await fs.promises.readFile(this.path,"utf-8")
            const productsJson = JSON.parse(products)
            const getId = productsJson.find((idProductos)=>{return idProductos.id === idProducto})
            if(getId == undefined){
                console.log("El producto no fue encontrado")
            }if(getId == 1){
                productsJson.splice(idProducto,1)
                await fs.promises.writeFile(this.path,JSON.stringify(productsJson,null,'\t'))
                console.log("productsJson: ",productsJson)
            }else{
                productsJson.splice(idProducto-1,1)
                await fs.promises.writeFile(this.path,JSON.stringify(productsJson,null,'\t'))
                console.log("productsJson: ",productsJson)
            }
                    
        } catch (error) {
            console.log(error.message)
        }
    }
}
module.exports = { ProductManager }