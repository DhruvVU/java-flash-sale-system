package com.flashsale.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders") // orders table in our database
@Data // Lombok sets all getters and setters in background
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;
    
    private String userName;
    
    @Column(name = "product_id")
    private Long productId;

    private String productName;

    @Column(name = "order_time")
    private LocalDateTime orderTime;

    // Helps in revenue calculations in case of price change
    private Double pricePaid;

    private String status;

    @PrePersist
    protected void onCreate() { 
        orderTime = LocalDateTime.now();
        if (status == null) status = "COMPLETED";
    }
}