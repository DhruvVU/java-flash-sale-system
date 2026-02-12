package com.flashsale.backend.controller;
import com.flashsale.backend.entity.User;
import com.flashsale.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/flashsale/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        Optional<User> userOptional = userRepository.findByUsername(username);

        if(userOptional.isPresent()) { 
            User user = userOptional.get();

            if(user.getPassword().equals(password)) { 
                return ResponseEntity.ok(user);
            }
        }

        return ResponseEntity.status(401).body("Invalid Credentials!");
    }
    

}
