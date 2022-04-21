import React from 'react'
import {
    MdDelete,
    MdAddCircleOutline,
    MdRemoveCircleOutline,
} from 'react-icons/md'
import { useCart } from '../../hooks/useCart'

// import { useCart } from '../../hooks/useCart';
// import { formatPrice } from '../../util/format';
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

    function handleProductIncrement(product: Product) {
        // TODO
    }

    function handleProductDecrement(product: Product) {
        // TODO
    }

    function handleRemoveProduct(productId: number) {
        removeProduct(productId)

        // TODO
    }

    return (
        <Container>
            {cart.map((product) => {
                return (
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
                            <tr data-testid="product">
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
                        </tbody>
                    </ProductTable>
                )
            })}

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
