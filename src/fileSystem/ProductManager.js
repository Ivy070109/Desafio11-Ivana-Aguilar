import fs from "fs"

class ProductManager {
  constructor() {
    this.path = './files/products.json'
    this.products = []
  }

  //leer productos
  readProducts = async () => {
    const productAdded = await fs.promises.readFile(this.path, 'utf-8')
    return JSON.parse(productAdded)
  }

  //Objetener productos
  getProducts = async () => {
    return await this.readProducts()
  }

  //Obtener productos por id
  getProductbyId = async (id) => {
    const productById = await this.exist(id)
        if(!productById) {
            return "Ese producto no existe"
        } else {
            return productById
        }
  }
  
  //Generar id autoincrementable
  generateId = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const productlist = await this.readProducts()
        const counter = productlist.length
        if (counter == 0) {
          return 1
        } else {
          return productlist[counter - 1].id + 1
        }
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  //Creación de producto
  addProduct = async (obj) => {
    const {title, description, price, thumbnail, category, status=true, code, stock} = obj

    if (!title || !description || !price || !category || !code ||!status || !stock) {
      return ("Debes proporcionar todos los campos completos. Todos los valores son obligatorios.")
    } else {
      const productArray = await this.getProducts({})
      const existCodeInProducts = productArray.some((elemento) => elemento.code === code)
      if (existCodeInProducts) {
        return(`El código ${code} no puede repetirse`)
      } else {

        const id = await this.generateId();
        const newProduct = {
          id,
          title,
          description,
          price,
          category,
          status,
          thumbnail,
          code,
          stock,
        }
        productArray.push(newProduct)
        await fs.promises.writeFile(this.path, JSON.stringify(productArray, null, '\t'))
        return "Producto agregado"
      }
    }
  }

  //Borrar producto
  deleteProduct = async (id) => {
    const productDetected = await this.readProducts()
    const productFilter = productDetected.filter(products => products.id != id)
    await fs.promises.writeFile(this.path, JSON.stringify(productFilter, null, '\t'))

    return `El producto ha sido eliminado`
  }

  //Actualizar productos
  updateProduct = async (id, obj) => {
    const productDetected = await this.readProducts()
    const actulizarProduct = productDetected.filter(products => products.id != id)
    await fs.promises.writeFile(this.path, JSON.stringify(actulizarProduct, null, '\t'))
    const productOld = await this.readProducts()
    const productsModif = [{id: id, ...obj}, ...productOld]
    await fs.promises.writeFile(this.path, JSON.stringify(productsModif, null, '\t'))

    return "Producto actualizado"
  }
}

export default ProductManager