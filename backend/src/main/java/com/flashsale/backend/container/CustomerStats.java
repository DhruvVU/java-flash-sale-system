package com.flashsale.backend.container; 
import java.time.LocalDateTime;

public interface CustomerStats {
    Long getUserId();
    String getUserName();
    Long getOrderCount();
    Double getTotalSpent();
    LocalDateTime getLastActive();
}