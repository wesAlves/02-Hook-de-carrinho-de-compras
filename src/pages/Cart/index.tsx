import {
    MdDelete,
    MdAddCircleOutline,
    MdRemoveCircleOutline,
} from 'react-icons/md'
import { useCart } from '../../hooks/useCart'
import { api } from '../../services/api'

import { formatPrice } from '../../util/format'
import { Container, ProductTable, Total } from './styles'

interface Product {
    id: number
    title: string
    price: number
    image: string
    amount: number
}

const Cart = (): JSX.Element => {
    const { cart, removeProduct, updateProductAmount } = useCart()

    // const cartFormatted = cart.map(product => ({
    //   // TODO
    // }))
    // const total =
    //   formatPrice(
    //     cart.reduce((sumTotal, product) => {
    //       // TODO
    //     }, 0)
    //   )

    async function handleProductIncrement(product: Product) {
        // await api.get(`stock/${product.id}`).then((response) => {
        //     const productInStock = response.data

        //     if (productInStock.amount > product.amount) {
        updateProductAmount({
            amount: (product.amount += 1),
            productId: product.id,
        })
        // } else {
        //     return
        // }
        // })
    }

    function handleProductDecrement(product: Product) {
        if (product.amount > 1) {
            product.amount -= 1
            updateProductAmount({
                productId: product.id,
                amount: product.amount,
            })
        } else {
            return
        }
    }

    function handleRemoveProduct(productId: number) {
        removeProduct(productId)
    }

    return (
        <Container>
            <ProductTable>
                <thead>
                    <tr>
                        <th aria-label="product image" />
                        <th>PRODUTO</th>
                        <th>QTD</th>
                        <th>SUBTOTAL</th>
                        <th aria-label="delete icon" />
                    </tr>
                </thead>
                <tbody>
                    {cart.map((product) => {
                        return (
                            <tr data-testid="product" key={product.id}>
                                <td>
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                    />
                                </td>
                                <td>
                                    <strong>{product.title}</strong>
                                    <span>R$ {product.price}</span>
                                </td>
                                <td>
                                    <div>
                                        <button
                                            type="button"
                                            data-testid="decrement-product"
                                            onClick={() =>
                                                handleProductDecrement(product)
                                            }
                                        >
                                            <MdRemoveCircleOutline size={20} />
                                        </button>
                                        <input
                                            type="text"
                                            data-testid="product-amount"
                                            readOnly
                                            value={product.amount}
                                        />
                                        <button
                                            type="button"
                                            data-testid="increment-product"
                                            onClick={() =>
                                                handleProductIncrement(product)
                                            }
                                        >
                                            <MdAddCircleOutline size={20} />
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <strong>
                                        R${' '}
                                        {product.price * Number(product.amount)}
                                    </strong>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        data-testid="remove-product"
                                        onClick={() =>
                                            handleRemoveProduct(product.id)
                                        }
                                    >
                                        <MdDelete size={20} />
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </ProductTable>
            <footer>
                <button type="button">Finalizar pedido</button>

                <Total>
                    <span>TOTAL</span>
                    <strong>R$ 359,80</strong>
                </Total>
            </footer>
        </Container>
    )
}

export default Cart
