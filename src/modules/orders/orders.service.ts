import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order, OrderDocument } from "src/schemas/Orders.schema";
import { CreateOrderDto } from "./dto/create-orders.dto";
import { UpdateOrderDto } from "./dto/update-orders.dto";
import { paginate } from "src/common/utils/pagination.util";
import {
  Promocode,
  PromocodeDocument,
  PromocodeType,
} from "src/schemas/Promocodes.schema";
import { Product, ProductDocument } from "src/schemas/Products.schema";
import { Ingredient, IngredientDocument } from "src/schemas/Ingredients.schema";
import axios from "axios";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Promocode.name) private promoModel: Model<PromocodeDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Ingredient.name)
    private ingredientModel: Model<IngredientDocument>
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    let price: number = 0;

    if (createOrderDto.products) {
      for (let i = 0; i < createOrderDto.products.length; i++) {
        const p = createOrderDto.products[i];

        let item = await this.productModel.findOne({ _id: p.product });
        if (item) {
          price += item.price * p.quantity;
          if (p.ingredients) {
            p.ingredients.map(async (i) => {
              let ingredient = await this.ingredientModel.findOne({ _id: i });
              if (ingredient) {
                price += ingredient?.price;
              }
            });
          }
        }
      }
      if (createOrderDto.promocode) {
        let promo = await this.promoModel.findOne({
          _id: createOrderDto.promocode,
        });
        if (promo) {
          if (promo.minimal_order_amount < price) {
            if (promo?.type == PromocodeType.PERCENTAGE) {
              price = (price / 100) * promo?.percentage;
            } else if (promo?.type == PromocodeType.AMOUNT) {
              price = price - promo?.amount;
            }
          } else {
            throw new BadRequestException(
              `You should hit ${promo.minimal_order_amount} to be enable to use discount`
            );
          }
        } else {
          throw new NotFoundException(
            "Promocode does not exist or not actual !!!"
          );
        }
      }
      return await this.orderModel.create({ ...createOrderDto, price });
    }
  }
  async getOrdersList(query) {
    const data: any = await paginate(this.orderModel, query, [
      "products.product",
      "promocode",
    ]);
    return data;
  }
  async showOrder(id: number) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException();
    }
    return order;
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    return await this.orderModel.findByIdAndUpdate(
      id,
      { ...updateOrderDto },
      { new: true }
    );
  }

  async updateStatus(id: number, status: number) {
    return await this.orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  }

  async pay(id: number, payment: string) {
    if (payment !== "click" && payment !== "payme") {
      throw new NotFoundException("The type of payment is not found !!!");
    }

    const url = `http://localhost:3001/api/payments/${payment}/${id}`;

    try {
      const response = await axios.post(url);
      return {
        success: true,
        message: "Payment processed successfully",
        data: response.data,
      };
    } catch (error) {
      throw new BadRequestException("Payment failed, retry !!!");
    }
  }

  async removeOrder(id: number) {
    return await this.orderModel.findByIdAndUpdate(
      id,
      { deleted: true, deletedAt: Date.now() },
      { new: true }
    );
  }
}
