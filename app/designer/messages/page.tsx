"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Loader } from "lucide-react";

interface Message {
  id: string;
  orderId: string;
  fromUserId: string;
  fromUser: { id: string; name: string; email: string; role: string };
  toUser: { id: string; name: string; email: string; role: string };
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface DesignerOrder {
  id: string;
  orderId: string;
  order: {
    id: string;
    orderNumber: string;
    productName: string;
    status: string;
    userId: string;
  };
}

export default function DesignerMessagesPage() {
  const [orders, setOrders] = useState<DesignerOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DesignerOrder | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/api/users/profile");
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/designer/orders");
      if (response.ok) {
        const data = await response.json();
        const orderList = Array.isArray(data.orders) ? data.orders : [];
        setOrders(orderList);
        if (orderList.length > 0) {
          setSelectedOrder(orderList[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOrder) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedOrder]);

  const fetchMessages = async () => {
    if (!selectedOrder) return;
    try {
      const response = await fetch(`/api/messages/${selectedOrder.orderId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedOrder || !currentUser) return;

    setSending(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.orderId,
          toUserId: selectedOrder.order.userId,
          message: messageText,
        }),
      });

      if (response.ok) {
        setMessageText("");
        await fetchMessages();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-1"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              我的订单
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无订单</p>
            ) : (
              orders.map((designerOrder) => (
                <button
                  key={designerOrder.id}
                  onClick={() => setSelectedOrder(designerOrder)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedOrder?.id === designerOrder.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <div className="font-medium text-sm">
                    {designerOrder.order.orderNumber}
                  </div>
                  <div className="text-xs opacity-80">
                    {designerOrder.order.productName}
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:col-span-3"
      >
        {selectedOrder ? (
          <Card className="flex flex-col h-[600px]">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">
                {selectedOrder.order.orderNumber} -{" "}
                {selectedOrder.order.productName}
              </CardTitle>
              <Badge variant="outline" className="w-fit mt-2">
                {selectedOrder.order.status}
              </Badge>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>暂无消息</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`flex ${
                      msg.fromUserId === currentUser?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.fromUserId === currentUser?.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <div className="text-xs font-medium mb-1">
                        {msg.fromUser.name}
                      </div>
                      <p className="text-sm break-words">{msg.message}</p>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="输入消息..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={sending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || sending}
                  size="icon"
                >
                  {sending ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="flex items-center justify-center h-[600px]">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无可用订单</p>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
