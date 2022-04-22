import { MdRemoveCircleOutline, MdAddCircleOutline, MdDelete } from "react-icons/md"

interface Product {
    id: number
    title: string
    price: number
    image: string
    amount: number
    onIncrement: () => void
    onDecrement: () => void
    onRemove: () => void
}

export function Cart({id, title, image, price, amount, onDecrement, onIncrement, onRemove}:Product) {
    return (
        <tr data-testid="product">
            <td>
                <img src={image} alt={title} />
            </td>
            <td>
                <strong>{title}</strong>
                <span>R$ {price}</span>
            </td>
            <td>
                <div>
                    <button
                        type="button"
                        data-testid="decrement-product"
                        onClick={() => {onDecrement}
                    >
                        <MdRemoveCircleOutline size={20} />
                    </button>
                    <input
                        type="text"
                        data-testid="product-amount"
                        readOnly
                        value={amount}
                    />
                    <button
                        type="button"
                        data-testid="increment-product"
                        onClick={onIncrement}
                    >
                        <MdAddCircleOutline size={20} />
                    </button>
                </div>
            </td>
            <td>
                <strong>R$ {price * Number(amount)}</strong>
            </td>
            <td>
                <button
                    type="button"
                    data-testid="remove-product"
                    onClick={onRemove}
                >
                    <MdDelete size={20} />
                </button>
            </td>
        </tr>
    )
}
