import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'
import { toast } from 'react-toastify'
import { api } from '../services/api'
import { Product, Stock } from '../types'

interface CartProviderProps {
    children: ReactNode
}

interface UpdateProductAmount {
    productId: number
    amount: number
}

interface CartContextData {
    cart: Product[]
    addProduct: (productId: number) => Promise<void>
    removeProduct: (productId: number) => void
    updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void
}

const CartContext = createContext<CartContextData>({} as CartContextData)

export function CartProvider({ children }: CartProviderProps): JSX.Element {
    const [cart, setCart] = useState<Product[]>(() => {
        const storagedCart = localStorage.getItem('@RocketShoes:cart')

        if (storagedCart) {
            return JSON.parse(storagedCart)
        }

        return []
    })

    const addProduct = async (productId: number) => {
        try {
            const updatedCart = [...cart]

            const stock = await api(`stock/${productId}`)

            const productExists = cart.find(
                (product) => product.id === productId
            )

            const stockAmount = stock.data.amount
            const currentAmount = productExists ? productExists.amount : 0
            const amount = currentAmount + 1

            if (amount > stockAmount) {
                toast.error('Quantidade solicitada fora de estoque')
                return
            }

            if (productExists) {
                productExists.amount = amount
            } else {
                const product = await api(`product/${productId}`)

                const newProduct = { ...product.data, amount: 1 }

                updatedCart.push(newProduct)
            }

            setCart(updatedCart)

            localStorage.setItem(
                '@RocketShoes:cart',
                JSON.stringify(updatedCart)
            )
        } catch {
            toast.error('Erro na adição do produto')
        }
    }

    const removeProduct = (productId: number) => {
        try {
            const updatedCart = [...cart]

            const productIndex = updatedCart.findIndex(
                (product) => product.id === productId
            )

            if (productIndex >= 0) {
                updatedCart.splice(productIndex, 1)

                setCart(updatedCart)
                localStorage.setItem(
                    '@RocketShoes:cart',
                    JSON.stringify(updatedCart)
                )
            } else {
                throw Error()
            }
        } catch {
            toast.error('Erro na remoção do produto')
        }
    }

    const updateProductAmount = async ({
        productId,
        amount,
    }: UpdateProductAmount) => {
        try {
            const updatedCart = [...cart]

            const stock = await api.get(`stock/${productId}`)
            const stockAmount = stock.data.amount

            const productToUpdate = updatedCart.find(
                (product) => product.id === productId
            )

            if (stockAmount === 0) {
                throw Error()
            }

            if (amount > stockAmount) {
                throw Error()
            }

            if (amount < 1) {
                throw Error()
            }

            if (productToUpdate) {
                productToUpdate.amount = amount

                setCart(updatedCart)

                localStorage.setItem(
                    '@RocketShoes:cart',
                    JSON.stringify(updatedCart)
                )
            } else {
                throw Error()
            }

            // await api.get(`stock/${productId}`).then((response) => {
            //     const productInStock = response.data
            //     const findProductIndex = cart.findIndex(
            //         (product) => product.id === productId
            //     )
            //     try {
            //         if (productInStock.amount > 0) {
            //             if (
            //                 productInStock.amount >
            //                 cart[findProductIndex].amount
            //             ) {
            //                 const cartArr = cart
            //                 if (cartArr[findProductIndex].amount > 1) {
            //                     cartArr[findProductIndex].amount = amount
            //                     setCart(() => {
            //                         localStorage.setItem(
            //                             '@RocketShoes:cart',
            //                             JSON.stringify(cartArr)
            //                         )
            //                         return cartArr
            //                     })
            //                 }
            //             }
            //         }
            //     } catch {
            //         toast.error('Quantidade solicitada fora de estoque')
            //     }
            // })
        } catch {
            toast.error('Erro na alteração de quantidade do produto')
            // TODO
        }
    }

    return (
        <CartContext.Provider
            value={{ cart, addProduct, removeProduct, updateProductAmount }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart(): CartContextData {
    const context = useContext(CartContext)

    return context
}
