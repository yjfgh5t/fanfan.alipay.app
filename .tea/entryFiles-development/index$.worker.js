require('./config$');

function success() {
require('../..//app');
require('../..//pages/index/index');
require('../..//pages/order/order');
require('../..//pages/me/me');
require('../..//pages/me/me-addr/me-addr');
require('../..//pages/me/me-addr-edit/me-addr-edit');
require('../..//pages/me/me-coupon/me-coupon');
require('../..//pages/order/order-detail/order-detail');
require('../..//pages/order/order-sure/order-sure');
require('../..//pages/order/order-remark/order-remark');
require('../..//pages/order/pay-order/pay-order');
require('../..//pages/todos/todos');
require('../..//pages/add-todo/add-todo');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
