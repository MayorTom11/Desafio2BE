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
        const addProduct = await this.readProducts()
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
            const getProductById = await this.readProducts()
            const getId = getProductById.find((idProductos)=>{return idProductos.id === idProducto})
            getId == undefined
                    ? console.log("El producto no fue encontrado")
                    : console.log("Producto: ", getId)
        } catch (error) {
            console.log(error.message)
        }
        
    }

    // async updateProduct(idProducto, title, description, price, thumbnail, code, stock){
    //     const updateProduct = {
    //         id:idProducto,
    //         title,
    //         description,
    //         price,
    //         thumbnail,
    //         code,
    //         stock
    //     }
    //     try {
    //         const products = await fs.promises.readFile(this.path,"utf-8")
    //         const productsJson = JSON.parse(products)
    //         const getId = productsJson.find((idProductos)=>{return idProductos.id === idProducto})
    //         getId == undefined
    //                 ? console.log("El producto no fue encontrado")
    //                 : productsJson.push(updateProduct) && await fs.promises.writeFile(this.path,JSON.stringify(productsJson,null,'\t'))
    //     } catch (error) {
    //         console.log(error.message)
    //     }
    // }

    async updateProduct(id, data) {

        try{
            let updateProduct = await this.getProductById(id)
            console.log("updateProduct: ",updateProduct)
            for (let prop in data) {
                updateProduct[prop] = data[prop]
            }
            let data_json = JSON.stringify(this.products, null, 2)
            await fs.promises.writeFile(this.path, data_json)
            return 'updateProduct: done'
        }catch(err){
         return 'updateProduct: error', err
        }
       
    }


    async deleteProduct(idProducto){
        try {
            const deleteProduct = await this.readProducts()
            const getId = deleteProduct.find((idProductos)=>{return idProductos.id === idProducto})
            if(getId == undefined){
                console.log("El producto no fue encontrado")
            }if(getId == 1){
                deleteProduct.splice(idProducto,1)
                await fs.promises.writeFile(this.path,JSON.stringify(deleteProduct,null,'\t'))
                console.log("productsJson: ",deleteProduct)
            }else{
                deleteProduct.splice(idProducto-1,1)
                await fs.promises.writeFile(this.path,JSON.stringify(deleteProduct,null,'\t'))
                console.log("productsJson: ",deleteProduct)
            }
                    
        } catch (error) {
            console.log(error.message)
        }
    }
}
module.exports = { ProductManager }