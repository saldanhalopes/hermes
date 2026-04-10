package com.hermes.hermes.controller;

import com.hermes.hermes.model.User;
import com.hermes.hermes.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public String listUsers(Model model) {
        model.addAttribute("users", userService.findAll());
        return "users/list";
    }

    @GetMapping("/new")
    public String createUserForm(Model model) {
        model.addAttribute("user", new User());
        return "users/form";
    }

    @PostMapping
    public String saveUser(@ModelAttribute("user") User user) {
        try {
            userService.save(user);
            return "redirect:/users";
        } catch (Exception e) {
            // Handle error (e.g., return to form with error message)
            return "redirect:/users/new?error=" + e.getMessage();
        }
    }

    @GetMapping("/edit/{id}")
    public String editUserForm(@PathVariable String id, Model model) {
        User user = userService.findById(id);
        if (user != null) {
            model.addAttribute("user", user);
            return "users/form";
        }
        return "redirect:/users";
    }

    @PostMapping("/delete/{id}")
    public String deleteUser(@PathVariable String id) {
        try {
            userService.deleteById(id);
        } catch (Exception e) {
            // Handle error
        }
        return "redirect:/users";
    }
}
