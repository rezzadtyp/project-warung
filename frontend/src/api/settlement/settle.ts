import api from "../api";

export interface SettleOrderRequest {
  beneficiary: string;
  orderHash: string;
}

export interface SettleOrderResponse {
  success: boolean;
  txHash: string;
  message: string;
}

export const settleOrder = async (
  data: SettleOrderRequest
): Promise<SettleOrderResponse> => {
  const { data: response } = await api.post<SettleOrderResponse>(
    "/settlement/settle",
    data
  );
  return response;
};

