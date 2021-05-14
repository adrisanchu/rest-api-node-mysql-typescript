import { BasicProduct, Product } from "./product";
import { BasicCustomer, Customer } from "./customer";

// useful when creating an order for the first time
export interface BasicOrder {
    product: BasicProduct,
    customer: BasicCustomer,
    productQuantity: number
}

export interface Order extends BasicOrder {
    orderId: number
}

export interface OrderWithDetails extends Order {
    product: Product,
    customer: Customer
}
