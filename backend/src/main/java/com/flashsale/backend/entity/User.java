package com.flashsale.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users") 
@Data // will set all the getters and setter methods automatically
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String role;
}