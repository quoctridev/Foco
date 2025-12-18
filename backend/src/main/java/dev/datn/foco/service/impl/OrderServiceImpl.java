package dev.datn.foco.service.impl;

import dev.datn.foco.dto.request.OrderDetailOptionRequest;
import dev.datn.foco.dto.request.OrderDetailRequest;
import dev.datn.foco.dto.request.OrderRequest;
import dev.datn.foco.dto.respone.OrderDetailOptionResponse;
import dev.datn.foco.dto.respone.OrderDetailResponse;
import dev.datn.foco.dto.respone.OrderResponse;
import dev.datn.foco.model.*;
import dev.datn.foco.repository.*;
import dev.datn.foco.service.OrderService;
import dev.datn.foco.service.WebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final OrderDetailOptionRepository orderDetailOptionRepository;
    private final StoreRepository storeRepository;
    private final TableRepository tableRepository;
    private final CustomerRepository customerRepository;
    private final dev.datn.foco.repository.MenuItemRepository menuItemRepository;
    private final dev.datn.foco.repository.MenuItemOptionValueRepository menuItemOptionValueRepository;
    private final WebSocketService webSocketService;

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        // Xác thực cửa hàng tồn tại
        Store store = storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cửa hàng"));

        // Tạo đơn hàng
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .store(store)
                .orderType(request.getOrderType())
                .notes(request.getNotes())
                .build();

        // Gán bàn nếu có (đối với đơn tại chỗ)
        if (request.getTableId() != null) {
            Tables table = tableRepository.findById(request.getTableId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn"));
            order.setTable(table);
            // Đổi trạng thái bàn thành "occupied" khi có đơn hàng
            table.setStatus("occupied");
            tableRepository.save(table);
        }

        // Gán thông tin khách hàng
        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));
            order.setCustomer(customer);
            order.setCustomerName(customer.getName());
            order.setCustomerPhone(customer.getPhone());
        } else {
            order.setCustomerName(request.getCustomerName());
            order.setCustomerPhone(request.getCustomerPhone());
        }

        // Gán điểm sử dụng
        order.setPointsUsed(request.getPointsUsed() != null ? request.getPointsUsed() : 0);

        // Tính tổng tiền
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderDetail> orderDetails = new ArrayList<>();

        // Xử lý từng món trong đơn
        for (OrderDetailRequest detailRequest : request.getOrderDetails()) {
            MenuItems menuItem = menuItemRepository.findById(detailRequest.getItemId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy món ăn"));

            // Tính tiền món (giá x số lượng)
            BigDecimal unitPrice = BigDecimal.valueOf(menuItem.getPrice());
            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(detailRequest.getQuantity()));

            OrderDetail orderDetail = OrderDetail.builder()
                    .order(order)
                    .menuItem(menuItem)
                    .quantity(detailRequest.getQuantity())
                    .unitPrice(unitPrice)
                    .totalPrice(itemTotal)
                    .specialInstructions(detailRequest.getSpecialInstructions())
                    .build();

            // Xử lý các tùy chọn (size, topping...)
            if (detailRequest.getOptions() != null && !detailRequest.getOptions().isEmpty()) {
                List<OrderDetailOption> options = new ArrayList<>();
                for (OrderDetailOptionRequest optionRequest : detailRequest.getOptions()) {
                    MenuItemOptionValues optionValue = menuItemOptionValueRepository
                            .findById(optionRequest.getValueId())
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy giá trị tùy chọn"));

                    // Tính tiền tùy chọn
                    BigDecimal optionPrice = optionValue.getExtraPrice()
                            .multiply(BigDecimal.valueOf(optionRequest.getQuantity()));
                    itemTotal = itemTotal.add(optionPrice);

                    OrderDetailOption option = OrderDetailOption.builder()
                            .orderDetail(orderDetail)
                            .optionValue(optionValue)
                            .quantity(optionRequest.getQuantity())
                            .extraPrice(optionValue.getExtraPrice())
                            .build();
                    options.add(option);
                }
                orderDetail.setOptions(options);
                orderDetail.setTotalPrice(itemTotal);
            }

            subtotal = subtotal.add(itemTotal);
            orderDetails.add(orderDetail);
        }

        order.setOrderDetails(orderDetails);
        order.setSubtotal(subtotal);

        // Tính thuế VAT (giả định 10%)
        BigDecimal taxAmount = subtotal.multiply(BigDecimal.valueOf(0.1));
        order.setTaxAmount(taxAmount);

        // Tính giảm giá từ điểm thưởng (100 điểm = 1 đơn vị tiền tệ)
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (order.getPointsUsed() > 0) {
            discountAmount = BigDecimal.valueOf(order.getPointsUsed()).divide(BigDecimal.valueOf(100));
        }
        order.setDiscountAmount(discountAmount);

        // Tính tổng tiền cuối cùng
        BigDecimal totalAmount = subtotal.add(taxAmount).subtract(discountAmount);
        order.setTotalAmount(totalAmount);

        // Tính điểm thưởng nhận được (1 đơn vị tiền = 10 điểm)
        int pointsEarned = totalAmount.multiply(BigDecimal.valueOf(10)).intValue();
        order.setPointsEarned(pointsEarned);

        Order savedOrder = orderRepository.save(order);
        OrderResponse response = mapToResponse(savedOrder);

        // Gửi thông báo realtime
        webSocketService.notifyNewOrder(response);

        return response;
    }

    @Override
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        return mapToResponse(order);
    }

    @Override
    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        return mapToResponse(order);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getOrdersByStore(Long storeId) {
        return orderRepository.findByStore_StoreId(storeId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomer_Id(customerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getOrdersByTable(Long tableId) {
        return orderRepository.findByTable_Id(tableId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getOrdersByStoreAndStatus(Long storeId, String status) {
        return orderRepository.findByStoreIdAndStatus(storeId, status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByDateRange(startDate, endDate).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        OrderResponse response = mapToResponse(updatedOrder);

        // Gửi thông báo realtime
        webSocketService.notifyOrderStatusUpdate(response);

        return response;
    }

    @Override
    @Transactional
    public OrderResponse confirmOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        order.setStatus("confirmed");
        order.setConfirmedAt(LocalDateTime.now());
        Order updatedOrder = orderRepository.save(order);
        return mapToResponse(updatedOrder);
    }

    @Override
    @Transactional
    public OrderResponse completeOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        order.setStatus("completed");
        order.setCompletedAt(LocalDateTime.now());

        // Cập nhật điểm thưởng cho khách hàng (nếu có)
        if (order.getCustomer() != null) {
            Customer customer = order.getCustomer();
            customer.setPoints(customer.getPoints() + order.getPointsEarned() - order.getPointsUsed());
            customerRepository.save(customer);
        }

        Order updatedOrder = orderRepository.save(order);
        return mapToResponse(updatedOrder);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        order.setStatus("cancelled");
        order.setCancelledAt(LocalDateTime.now());
        Order updatedOrder = orderRepository.save(order);
        return mapToResponse(updatedOrder);
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    private String generateOrderNumber() {
        return "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderDetailResponse> orderDetailResponses = order.getOrderDetails().stream()
                .map(this::mapOrderDetailToResponse)
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .storeId(order.getStore().getStoreId())
                .storeName(order.getStore().getName())
                .tableId(order.getTable() != null ? order.getTable().getId() : null)
                .tableName(order.getTable() != null ? order.getTable().getName() : null)
                .customerId(order.getCustomer() != null ? order.getCustomer().getId() : null)
                .customerName(order.getCustomerName())
                .customerPhone(order.getCustomerPhone())
                .orderType(order.getOrderType())
                .status(order.getStatus())
                .subtotal(order.getSubtotal())
                .taxAmount(order.getTaxAmount())
                .discountAmount(order.getDiscountAmount())
                .totalAmount(order.getTotalAmount())
                .pointsEarned(order.getPointsEarned())
                .pointsUsed(order.getPointsUsed())
                .notes(order.getNotes())
                .createdAt(order.getCreatedAt())
                .confirmedAt(order.getConfirmedAt())
                .completedAt(order.getCompletedAt())
                .cancelledAt(order.getCancelledAt())
                .orderDetails(orderDetailResponses)
                .build();
    }

    private OrderDetailResponse mapOrderDetailToResponse(OrderDetail orderDetail) {
        List<OrderDetailOptionResponse> optionResponses = orderDetail.getOptions().stream()
                .map(this::mapOrderDetailOptionToResponse)
                .collect(Collectors.toList());

        return OrderDetailResponse.builder()
                .id(orderDetail.getId())
                .itemId(orderDetail.getMenuItem().getId())
                .itemName(orderDetail.getMenuItem().getName())
                .quantity(orderDetail.getQuantity())
                .unitPrice(orderDetail.getUnitPrice())
                .totalPrice(orderDetail.getTotalPrice())
                .specialInstructions(orderDetail.getSpecialInstructions())
                .status(orderDetail.getStatus())
                .options(optionResponses)
                .build();
    }

    private OrderDetailOptionResponse mapOrderDetailOptionToResponse(OrderDetailOption option) {
        return OrderDetailOptionResponse.builder()
                .id(option.getId())
                .valueId(option.getOptionValue().getId())
                .valueName(option.getOptionValue().getName())
                .quantity(option.getQuantity())
                .extraPrice(option.getExtraPrice())
                .build();
    }
}
