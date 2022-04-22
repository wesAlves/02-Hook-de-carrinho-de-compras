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

            await api.get(`products/${productId}`).then((response) => {
                const addToCart = { ...response.data, amount: 1 }

                const newCart = [...cart, addToCart]

                if (findProductIndex === -1) {
                    setCart(() => {
                        localStorage.setItem(
                            '@RocketShoes:cart',
                            JSON.stringify(newCart)
                        )
                        return newCart
                    })
                } else {
                    cart[findProductIndex].amount += 1

                    setCart([...cart])

                    localStorage.setItem(
                        '@RocketShoes:cart',
                        JSON.stringify(cart)
                    )
                }
            })
            const local = localStorage.getItem('@Rocketshoes:cart')

            if (local !== null) {
                console.log(cart)
                console.log(JSON.parse(local))
            }
        } catch {
            toast.error('Erro na adição do produto')
        }
    }

    const removeProduct = (productId: number) => {
        try {
            const findProductIndex = cart.findIndex(
                (product) => product.id === productId
            )

            if (findProductIndex >= 0) {
                cart.splice(findProductIndex, 1)

                setCart(() => {
                    localStorage.setItem(
                        '@RocketShoes:cart',
                        JSON.stringify(cart)
                    )

                    return cart
                })
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
            const findProductIndex = cart.findIndex(
                (product) => product.id === productId
            )

            const cartArr = cart

            if (cartArr[findProductIndex].amount > 1) {
                cartArr[findProductIndex].amount = amount

                setCart(() => {
                    localStorage.setItem(
                        '@RocketShoes:cart',
                        JSON.stringify(cartArr)
                    )
                    return cartArr
                })
            }
        } catch {
            toast.error('Erro na remoção do produto')
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
