const mongoose = require('mongoose')
const Product = require('./product')

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
})

userSchema.methods.addToCart = function (product) {
  // Find out if products is already exists in cart
  const cartProductIndex = this.cart.items.findIndex(
    p => p.productId.toString() === product._id.toString()
  )
  let newQuantity = 1
  const updatedCartItems = [...this.cart.items]

  // Updated existing cart item's quantity OR add new cart item
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1
    updatedCartItems[cartProductIndex].quantity = newQuantity
  } else {
    // Storing only product's reference and quantity
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    })
  }

  const updatedCart = {
    items: updatedCartItems,
  }

  this.cart = updatedCart
  return this.save()
}

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    item => item.productId.toString() !== productId.toString()
  )

  this.cart.items = updatedCartItems

  return this.save()
}

module.exports = mongoose.model('User', userSchema)

/* 

  // Getting user's current cart
  getCart() {
    const db = getDb()
    const productsId = this.cart.items.map(p => p.productId)
    return (
      db
        .collection('products')
        // Get products which are added to cart by current user
        .find({ _id: { $in: productsId } })
        .toArray()
        .then(products => {
          let productsIdStr = productsId.map(p => p.toString())

          const databaseProducts = products.map(p => p._id.toString())

          productsIdStr = productsIdStr.filter(p => {
            if (databaseProducts.includes(p)) return p
          })

          const updatedCart = this.cart.items.filter(p => {
            if (productsIdStr.includes(p.productId.toString())) {
              return p
            } else {
              this.deleteItemFromCart(p.productId.toString())
            }
          })

          this.cart.items = updatedCart

          return products.map(product => {
            return {
              ...product,
              quantity: this.cart.items.find(
                p => p.productId.toString() === product._id.toString()
              ).quantity,
            }
          })
        })
    )
  }

  // Deleting products from cart
  deleteItemFromCart(id) {
    const db = getDb()
    

    return db
      .collection('users')
      .updateOne(
        { _id: ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      )
  }

  // Adding order
  addOrder() {
    const db = getDb()

    return this.getCart()
      .then(product => {
        const order = {
          items: product,
          user: {
            _id: new ObjectId(this._id),
            name: this.name,
            email: this.email,
          },
        }
        return db.collection('orders').insertOne(order)
      })
      .then(res => {
        // clear cart in user object and in database
        this.cart = { items: [] }

        return db
          .collection('users')
          .updateOne(
            { _id: ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          )
      })
  }

  // Getting orders
  getOrders() {
    const db = getDb()
    // nested properties
    return db
      .collection('orders')
      .find({ 'user._id': new ObjectId(this._id) })
      .toArray()
  }

  // Find user
  static findUserById(userId) {
    const db = getDb()

    return db
      .collection('users')
      .findOne({ _id: ObjectId(userId) })
      .catch(err => console.log(err))
  }
}

module.exports = User */
