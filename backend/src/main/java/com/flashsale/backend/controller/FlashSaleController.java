package com.flashsale.backend.controller;

import com.flashsale.backend.entity.Order;
import com.flashsale.backend.entity.Product;
import com.flashsale.backend.entity.User;
import com.flashsale.backend.repository.*;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/flashsale")
@CrossOrigin(origins = "http://localhost:5173") // Allow Frontend
public class FlashSaleController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StringRedisTemplate redisTemplate;  

    // GET All products
    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Get list of orders to display 
    @GetMapping("/orders")
    public List<com.flashsale.backend.entity.Order> getAllOrders() {
        return orderRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id"));
    }
    
    // Get Customers list
    @GetMapping("/customers")
    public List<com.flashsale.backend.container.CustomerStats> getCustomerStats() {
        return orderRepository.findCustomerStats();
    }
    
    // GET STOCK (Optimized with Redis)
    @GetMapping("/stock/{productId}")
    public int getStock(@PathVariable Long productId) {
        String cacheKey = "stock:" + productId;

        // Check Redis (RAM) - Super Fast
        String cachedStock = redisTemplate.opsForValue().get(cacheKey);
        if (cachedStock != null) {
            return Integer.parseInt(cachedStock);
        }
        
        // If Redis is empty, check DB (Disk) - Slower
        int dbStock = productRepository.findById(productId)
                .map(Product::getStockQuantity)
                .orElse(0);
                
        // Save to Redis for next time
        redisTemplate.opsForValue().set(cacheKey, String.valueOf(dbStock));
        
        return dbStock;
    }

    
    // BUY PRODUCT (Updates DB + Redis)
    @PostMapping("/buy")
    @Transactional // Ensures Locking works
    public String buyProduct(@RequestParam Long userId, @RequestParam Long productId) {
        // Find User
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return "Failed: User not found";

        // Find Product (Locking the row in DB)
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) return "Failed: Product not found";

        // Check Stock
        if (product.getStockQuantity() > 0) {
            // Decrease Stock in DB
            product.setStockQuantity(product.getStockQuantity() - 1);
            productRepository.save(product);

            // UPDATE REDIS INSTANTLY
            // We overwrite the old cache with the new number
            String cacheKey = "stock:" + productId;
            redisTemplate.opsForValue().set(cacheKey, String.valueOf(product.getStockQuantity()));

            // Create order record
            com.flashsale.backend.entity.Order newOrder = new com.flashsale.backend.entity.Order();

            // user details
            newOrder.setUserId(user.getId());
            newOrder.setUserName(user.getUsername());

            // product details
            newOrder.setProductId(product.getId());
            newOrder.setProductName(product.getName());
            newOrder.setPricePaid(product.getPrice().doubleValue());
            newOrder.setStatus("SUCCESS");

            orderRepository.save(newOrder); // Save to DB

            return "Success: Order Placed! (Stock left: " + product.getStockQuantity() + ")";
        } else {
            return "Failed: Out of Stock";
        }
    }

    // Add product
    @PostMapping("/products/add")
    public Product addProduct(@RequestBody Product product) {
        
        if ( product.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Price cannot be negative");
        } 
        
        return productRepository.save(product);
    }
    
    // Delete product
    @DeleteMapping("/products/delete/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);

        // Removing from redis too to update data
        redisTemplate.delete("stock:" + id);
        
        return "Product Deleted Successfully";
    }

    // Edit product details
    @PutMapping("products/update/{id}")
    @CrossOrigin(origins = "http://localhost:5173")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product ) {
        Product existingProduct = productRepository.findById(id).orElse(null);
        
        if (existingProduct != null) {
            existingProduct.setName(product.getName());
            existingProduct.setPrice(product.getPrice());
            existingProduct.setStockQuantity(product.getStockQuantity());
            
            // Saving updated data to DB
            Product updatedProduct = productRepository.save(existingProduct);
            
            // Saving updated data to cache
            String cacheKey = "stock:" + id;
            redisTemplate.opsForValue().set(
                cacheKey, String.valueOf(updatedProduct.getStockQuantity())
            );
            
            return updatedProduct;
        }
        return null;
    }

    // Registering new users
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        user.setRole("CUSTOMER");
        userRepository.save(user);
        return user;
    }

    // Fetch order details for specific user in customer dashboard
    @GetMapping("/orders/{userId}")
    public List<Order> getUserOrders(@PathVariable Long userId) {
        return orderRepository.findByUserId(userId);
    }
    
}