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
            const findProductIndex = cart.findIndex(
                (product) => product.id === productId
            )

            if (findProductIndex === -1) {
                await api.get(`products/${productId}`).then((response) => {
                    const addToCart = { ...response.data, amount: 1 }

                    setCart([...cart, addToCart])

                    localStorage.setItem(
                        '@RocketShoes:cart',
                        JSON.stringify(cart)
                    )
                })
            } else {
                cart[findProductIndex].amount += 1

                setCart([...cart])

                localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
            }
        } catch {
            throw new Error('this is an error belive me')
        }
    }

    const removeProduct = (productId: number) => {
        try {
            const findProductIndex = cart.findIndex(
                (product) => product.id === productId
            )

            cart.splice(findProductIndex, 1)

            setCart([...cart])

            localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
        } catch {
            throw new Error('this is an error belive me')
        }
    }

    const updateProductAmount = async ({
        productId,
        amount,
    }: UpdateProductAmount) => {
        try {
            const findProductIndex = cart.findIndex(
                (product) => product.id === productId
            )

            const cartArr = cart

            cartArr[findProductIndex].amount = amount

            setCart([...cartArr])
        } catch {
            throw new Error('this is an error belive me')

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
