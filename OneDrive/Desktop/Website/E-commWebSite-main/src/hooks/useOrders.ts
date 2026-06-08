import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Order, OrderItem } from '../types';

export interface OrderWithItems extends Order {
  items: OrderItem[];
  customerName?: string;
  customerEmail?: string;
}

export function useMyOrders(userId: string | undefined) {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    setOrders((data ?? []).map(o => ({
      id: o.id,
      userId: o.user_id ?? '',
      status: o.status,
      subtotal: o.subtotal,
      tax: o.tax,
      shipping: o.shipping,
      total: o.total,
      shippingAddress: o.shipping_address as any,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
      items: (o.order_items ?? []).map((i: any) => ({
        productId: i.product_id ?? '',
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
    })));
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  return { orders, loading, refetch: load };
}

export async function createOrder(
  userId: string,
  cart: { id: string; name: string; price: number; quantity: number; image: string }[],
  shippingAddress: Record<string, string>,
  subtotal: number,
  tax: number,
  stripePaymentIntentId?: string
): Promise<string> {
  const total = subtotal + tax;

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      status: 'processing',
      subtotal,
      tax,
      shipping: 0,
      total,
      shipping_address: shippingAddress,
      stripe_payment_intent_id: stripePaymentIntentId ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  const items = cart.map(item => ({
    order_id: order.id,
    product_id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(items);
  if (itemsError) throw new Error(itemsError.message);

  return order.id;
}

// Admin-only hooks
export function useAllOrders() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*), profiles(name, email)')
      .order('created_at', { ascending: false });

    setOrders((data ?? []).map((o: any) => ({
      id: o.id,
      userId: o.user_id ?? '',
      status: o.status,
      subtotal: o.subtotal,
      tax: o.tax,
      shipping: o.shipping,
      total: o.total,
      shippingAddress: o.shipping_address,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
      customerName: o.profiles?.name,
      customerEmail: o.profiles?.email,
      items: (o.order_items ?? []).map((i: any) => ({
        productId: i.product_id ?? '',
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
    })));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return { orders, loading, refetch: load };
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);
  if (error) throw new Error(error.message);
}
