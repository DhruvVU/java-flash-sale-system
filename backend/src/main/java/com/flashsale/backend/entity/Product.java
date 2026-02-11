package com.flashsale.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "products") // products table in our database
@Data // Lombok sets all getters and setters in background
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "stock_quantity") // case-sensitive name(CamelCase vs Snake_case)
    private int stockQuantity;

    private BigDecimal price;

    @Column(name = "image_url")
    private String imageUrl;
}