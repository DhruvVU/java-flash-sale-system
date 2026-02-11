package com.flashsale.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.core.StringRedisTemplate;

@SpringBootApplication
public class FlashSaleApplication {

	public static void main(String[] args) {
		SpringApplication.run(FlashSaleApplication.class, args);
	}

    // This runs automatically when the server starts
	@Bean
	CommandLineRunner testRedisConnection(StringRedisTemplate redisTemplate) {
		return args -> {
			try {
                // 1. Write to Redis
				redisTemplate.opsForValue().set("test-connection", "Redis is working!");
                
                // 2. Read from Redis
				String value = redisTemplate.opsForValue().get("test-connection");
                
				System.out.println("\n✅✅✅ REDIS CONNECTION SUCCESS: " + value + " ✅✅✅\n");
			} catch (Exception e) {
				System.err.println("\n❌❌❌ REDIS CONNECTION FAILED: " + e.getMessage() + " ❌❌❌\n");
			}
		};
	}
}