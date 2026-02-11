package com.flashsale.backend.repository;

import com.flashsale.backend.container.CustomerStats;
import com.flashsale.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // No extra code needed!
    // JpaRepository gives save(), findById(), etc. automatically.
    @Query("SELECT o.userId as userId, o.userName as userName, " +
            "COUNT(o) as orderCount, SUM(o.pricePaid) as totalSpent, " +
            "MAX(o.orderTime) as lastActive " +
            "FROM Order o GROUP BY o.userId, o.userName " + 
            "ORDER BY totalSpent DESC")
    List<CustomerStats> findCustomerStats();

    public List<Order> findByUserId(Long userId);
}