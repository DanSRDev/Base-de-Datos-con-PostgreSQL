const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize')

class OrderService {

  constructor(){
  }
  async create(data) {
    const newOrder = await models.Order.create(data);
    return newOrder.dataValues;
  }

  async addItem(data) {
    const { orderId } = data;
    await this.findOne(orderId);
    const newItem = await models.OrderProduct.create(data);
    return newItem;
  }

  async find() {
    const orders = await models.Order.findAll({
      include: [{
        association: 'customer',
        include: ['user']
      },
      'items'
    ]
    });
    return orders;
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id, {
      include: [{
        association: 'customer',
        include: ['user']
      },
      'items'
    ]
    });
    if(!order) {
      throw boom.notFound('order not found');
    }
    return order;
  }

  async update(id, changes) {
    const order = await this.findOne(id);
    await order.update(changes);
    const rta = await this.findOne(id);
    return rta;
  }

  async delete(id) {
    const order = await this.findOne(id);
    await order.destroy();
    return { id };
  }

}

module.exports = OrderService;
