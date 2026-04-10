package com.hermes.hermes.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import com.hermes.hermes.model.User;
import com.hermes.hermes.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    @Transactional
    public User save(User user) throws Exception {
        boolean isNew = user.getId() == null || user.getId().isEmpty();
        
        if (isNew) {
            // Create user in Firebase first
            UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                    .setEmail(user.getEmail())
                    .setPassword(user.getPassword())
                    .setDisplayName(user.getUsername());
            
            UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);
            user.setId(userRecord.getUid());

            // Encrypt password for local DB
            if (user.getPassword() != null) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }
        } else {
            // Update user in Firebase if necessary
            UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(user.getId())
                    .setEmail(user.getEmail())
                    .setDisplayName(user.getUsername());
            
            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                request.setPassword(user.getPassword());
                // Encrypt for local DB
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            } else {
                // Keep old password from DB if not provided
                User existingUser = userRepository.findById(user.getId()).orElse(null);
                if (existingUser != null) {
                    user.setPassword(existingUser.getPassword());
                }
            }
            
            FirebaseAuth.getInstance().updateUser(request);
        }

        return userRepository.save(user);
    }

    @Transactional
    public void deleteById(String id) throws Exception {
        // Delete from Firebase
        FirebaseAuth.getInstance().deleteUser(id);
        // Delete from Database
        userRepository.deleteById(id);
    }
}
