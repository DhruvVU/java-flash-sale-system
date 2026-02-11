package com.flashsale.backend.service;

import com.flashsale.backend.entity.Order;
import com.flashsale.backend.entity.Product;
import com.flashsale.backend.repository.OrderRepository;
import com.flashsale.backend.repository.ProductRepository;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired 
    private OrderRepository orderRepository;

    @Transactional
    public String processOrder(Long productId, Long userId) {

        // Step 1 : Fetch product using our pessimistic LOCK
        // If another user is also in this block, this will wait until they finish
        Product product = productRepository.findByIdWithLock(productId)
                        .orElseThrow(() -> new RuntimeException("Product Not Found!"));  
        
        // Step 2 : Validate block
        if (product.getStockQuantity() < 1) {
            return "Failed: Out of Stock!";
        }

        // Step 3 : Deduct Stock
        product.setStockQuantity(product.getStockQuantity() - 1);
        productRepository.save(product);

        // Step 4 : Create and Save Order
        Order order = new Order();
        order.setProductId(productId);
        order.setUserId(userId);
        order.setOrderTime(LocalDateTime.now());
        order.setStatus("CONFIRMED!");

        orderRepository.save(order);

        return "Success : Order Placed!";
    }
}
