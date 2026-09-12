/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to order.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 21/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------

export const insertOrderRequest = (reqData: FormData): Promise<any> => {
  return axiosInstance
    .post('/admin/master/order/InsertOrder', reqData)
    .then((response) => response.data);
};

export const deleteOrderRequest = (
  orderId: number,
  modifiedBy: number
): Promise<any> => {
  return axiosInstance
    .delete(`/admin/master/order/DeleteOrder/${orderId}`, {
      data: {
        modifiedBy
      }
    })
    .then((response) => response.data);
};

export const getOrderByIdRequest = (orderId: number): Promise<any> => {
  return axiosInstance
    .get(`/admin/master/order/GetOrderById/${orderId}`)
    .then((response) => response.data);
};

export const getOrdersRequest = (): Promise<any> => {
  return axiosInstance
    .get('/admin/master/order/GetOrders')
    .then((response) => response.data);
};
